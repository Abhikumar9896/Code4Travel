import { parse } from "cookie";
import dbConnect from '../../../lib/dbConnect';
import users from '../../../models/users';
import { updateUserSchema } from '../../../lib/zodSchemas/userSchema';

export default async function handler(req, res) {
  await dbConnect();

  const { customUser } = parse(req.headers.cookie || "");

  if (!customUser) {
    return res.status(401).json({
      success: false,
      message: "Not authenticated"
    });
  }

  try {
    const parsed = JSON.parse(customUser);
    const user = await users.findById(parsed.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (req.method === "GET") {
      return res.status(200).json({
        success: true,
        message: "User profile retrieved",
        data: {
       
          fullName: user.fullName,
          email: user.email,
          mobile: user.mobile,
    
          profilePhoto: user.profilePhoto,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        }
      });
    }

    if (req.method === "PUT") {
      const parsedBody = updateUserSchema.safeParse(req.body);
      if (!parsedBody.success) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          error: parsedBody.error.flatten(),
        });
      }

      const updateData = parsedBody.data;

      // Check if email is being changed and if it already exists
      if (updateData.email && updateData.email !== user.email) {
        const existingUser = await users.findOne({ email: updateData.email });
        if (existingUser) {
          return res.status(409).json({
            success: false,
            message: "Email already exists"
          });
        }
      }

      // Update user
      const updatedUser = await users.findByIdAndUpdate(
        user._id,
        updateData,
        { new: true, runValidators: true }
      ).select("-password");

      return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: {
          fullName: updatedUser.fullName,
          email: updatedUser.email,
          mobile: updatedUser.mobile,
          profilePhoto: updatedUser.profilePhoto,
          createdAt: updatedUser.createdAt,
          updatedAt: updatedUser.updatedAt,
        }
      });
    }

    return res.status(405).json({
      success: false,
      message: "Method not allowed"
    });

  } catch (err) {
    console.error("Profile error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
}
