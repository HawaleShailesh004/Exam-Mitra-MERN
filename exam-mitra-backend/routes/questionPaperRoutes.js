import express from "express";
import {
  getAllQuestionPapers,
  getQuestionPaperById,
  getQuestionPaperByTitle,
  createQuestionPaper,
} from "../controllers/questionPaperController.js";

const router = express.Router();

// Routes
router.get("/", getAllQuestionPapers);
router.get("/:id", getQuestionPaperById);
router.get("/title/:title", getQuestionPaperByTitle);
router.post("/", createQuestionPaper);

export default router;
