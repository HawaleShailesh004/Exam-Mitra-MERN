import { validationResult } from "express-validator";
import User from "../models/User/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import passport from "passport";

const JWT_SECRET = process.env.JWT_SECRET;

// @POST /auth/register
// @DESC Register a new User
// @Access Public
export const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res
      .status(400)
      .json({ message: "Invalid inputs", errors: errors.array() });

  const { name, email, password } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({
      token,
      user: { name: newUser.name, email: newUser.email, _id: newUser._id },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// @POST /auth/login
// @DESC Login a User
// @Access Public
export const loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ message: "Invalid credentials" });

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect password" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res.json({
      token,
      user: { name: user.name, email: user.email, _id: user._id },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// @GET /auth/me
// @DESC Get current user
// @Access Private
export const getMe = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Unauthorized" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    res.json({ user });
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// @GET /auth/google
// @DESC Google OAuth
// @Access Public
export const googleAuthenticate = passport.authenticate("google", {
  scope: ["profile", "email"],
});

// @GET /auth/google/callback
// @DESC Google OAuth callback
// @Access Public
export const googleCallback = (req, res) => {
  const user = req.user;
  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

  res.redirect(`${process.env.CLIENT_URL}/oauth-success?token=${token}`);
};

