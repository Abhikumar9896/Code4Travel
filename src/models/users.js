import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
   
    profilePhoto: {
      type: String,
      default: "/images/avatar.png",
    },
  },
  { timestamps: true }
);


export default mongoose.models.User || mongoose.model("User", userSchema);
