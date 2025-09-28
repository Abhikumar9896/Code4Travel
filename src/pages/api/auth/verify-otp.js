// /api/auth/verify-otp.js
import dbConnect from '../../../lib/dbConnect';
import bcrypt from 'bcryptjs';
import Otp from '../../../models/Otp';
import users from '../../../models/users';
import { signupSchema } from '../../../lib/zodSchemas/userSchema';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: 'Validation error', error: parsed.error.flatten() });
  }

  const { email, otp, fullName, password, firstName } = parsed.data;

  if (!otp) {
    return res.status(400).json({ success: false, message: "OTP is required" });
  }

  try {
    // Find OTP
    const otpDoc = await Otp.findOne({ email, code: otp });
    if (!otpDoc || otpDoc.expiresAt < new Date()) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    // Check if email already exists
    if (await users.findOne({ email })) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate userId
    

    

    // Create user
    const newUser = await users.create({
      fullName,
      firstName,
      email,
      password: hashedPassword,
      
    });

    // Delete OTP after success
    await Otp.deleteMany({ email });

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: {
        email: newUser.email,
        fullName: newUser.fullName,
        
      },
    });

  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}
