import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import passport from "passport";

dotenv.config();

// Import routes
import dropdownRoutes from "./routes/dropdownRoute.js";
import extractRoutes from "./routes/extractRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import paperRoutes from "./routes/paperRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// API Routes
app.use("/auth", authRoutes);
app.use("/extract", extractRoutes);
app.use("/dropdown", dropdownRoutes);
app.use("/contact", contactRoutes);
app.use("/papers", paperRoutes);
app.use("/questions", questionRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
  });
