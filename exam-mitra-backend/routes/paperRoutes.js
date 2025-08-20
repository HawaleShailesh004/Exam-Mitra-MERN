import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  uploadPaper,
  getAllPapers,
  getPaperById,
  deletePaper,
  updatePaper,
} from "../controllers/paperController.js";

const router = express.Router();

// Routes mapping
router.post("/", verifyToken, uploadPaper);
router.get("/", verifyToken, getAllPapers);
router.get("/:id", verifyToken, getPaperById);
router.delete("/:id", verifyToken, deletePaper);
router.put("/:id", verifyToken, updatePaper);

export default router;
