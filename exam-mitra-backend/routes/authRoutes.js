import express from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";

import "../utils/passportSetup.js";
import {
  getMe,
  googleAuthenticate,
  googleCallback,
  loginUser,
  registerUser,
} from "../controllers/authController.js";
import passport from "passport";

const router = express.Router();

// @route POST /api/auth/register
router.post(
  "/register",
  [
    body("name").notEmpty(),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
  ],
  registerUser
);

// @route POST /api/auth/login
router.post(
  "/login",
  [body("email").isEmail(), body("password").exists()],
  loginUser
);

// @route GET /api/auth/me
router.get("/me", getMe);

// @route GET /auth/google
router.get("/google", googleAuthenticate);

// @route GET /auth/google/callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  googleCallback
);

export default router;
