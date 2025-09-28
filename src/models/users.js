import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    // Stable string id alongside Mongo _id
    userId: { type: String, index: true, unique: true, sparse: true },

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

// Ensure userId is always set to the document's _id string on first save
userSchema.pre("save", function (next) {
  if (!this.userId) this.userId = this._id.toString();
  next();
});

export default mongoose.models.User || mongoose.model("User", userSchema);
