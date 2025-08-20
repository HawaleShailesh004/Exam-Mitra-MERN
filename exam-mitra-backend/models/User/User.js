import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: String, // only for email users
  googleId: { type: String, default: null },
}, { timestamps: true });

export default mongoose.model("User", userSchema);
