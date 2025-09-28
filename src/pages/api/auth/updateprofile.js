// pages/api/user/updateProfile.js
import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/users';

export default async function handler(req, res) {
  if (req.method !== "PATCH") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  await dbConnect();

  const { email, fullName, mobile, profilePhoto } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { fullName, mobile, profilePhoto },
      { new: true } // returns the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "Profile updated", user: updatedUser });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
}
