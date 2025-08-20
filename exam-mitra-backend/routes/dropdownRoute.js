import express from "express";
import { getPapers, getSubjects } from "../controllers/dropdownController.js";

const router = express.Router();

// 🧠 Get all papers for a subject
router.get("/dropdowns/papers", getPapers);

// 🔥 Get all subjects for a branch & semester
router.get("/dropdowns/subjects", getSubjects);

export default router;
