// routes/questionRoutes.js
import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  addQuestions,
  getQuestionsByPaper,
  updateQuestion,
  getSingleQuestion,
  deleteQuestion,
} from "../controllers/questionController.js";

const router = express.Router();

// Routes
router.post("/", verifyToken, addQuestions);
router.get("/by-paper/:paperId", verifyToken, getQuestionsByPaper);
router.patch("/:id", verifyToken, updateQuestion);
router.get("/single/:id", verifyToken, getSingleQuestion);
router.delete("/:id", verifyToken, deleteQuestion);

export default router;
