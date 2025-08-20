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
import dbConnection from "./config/dbConfig.js";

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(passport.initialize());

const allowedOrigins = [
  process.env.CLIENT_URL, // frontend domain
  "http://localhost:3000", // dev
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// API Routes
app.use("/auth", authRoutes);
app.use("/extract", extractRoutes);
app.use("/dropdown", dropdownRoutes);
app.use("/contact", contactRoutes);
app.use("/papers", paperRoutes);
app.use("/questions", questionRoutes);

dbConnection();
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
