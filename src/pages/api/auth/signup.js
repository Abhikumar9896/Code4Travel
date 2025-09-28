import dbConnect from "../../../lib/dbConnect";
import users from "../../../models/users";
import Otp from "../../../models/Otp";
import { sendOTPEmail } from "../../../lib/nodemailer";
import { signupSchema } from "../../../lib/zodSchemas/userSchema";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed",
    });
  }

  // Validate input
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      error: parsed.error.flatten(),
    });
  }

  const { fullName, email, password,  code } = parsed.data;

  try {
    // Step 1: Send OTP if code not provided
    if (!code) {
      // Check if user already exists
      const existingUser = await users.findOne({ email });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "User already exists with this email",
        });
      }

      // Generate OTP
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

      // Delete existing OTP for this email
      await Otp.deleteMany({ email });

      // Save OTP
      await Otp.create({
        email,
        code: generatedOtp,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      });

      // Send OTP email
      await sendOTPEmail(email, generatedOtp);

      return res.status(200).json({
        success: true,
        message: "OTP sent to your email",
      });
    }

    // Step 2: Verify OTP and create user
    const otpDoc = await Otp.findOne({ email, code });
    if (!otpDoc || otpDoc.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    // Check if user already exists (double check)
    if (await users.findOne({ email })) {
      return res.status(409).json({ success: false, message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

   

    // Create the user
    const newUser = await users.create({
      fullName,
      
      email,
      password: hashedPassword,
    });

    // Delete OTP after successful signup
    await Otp.deleteMany({ email });

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: {
        fullName: newUser.fullName,
        email: newUser.email,
      },
    });

  } catch (error) {
    console.error("Error in signup flow:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}
