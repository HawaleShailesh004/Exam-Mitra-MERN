import express from "express";
import Paper from "../models/Paper.js";
import Question from "../models/Question.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// @POST /api/papers - Upload a new paper
router.post("/", verifyToken, async (req, res) => {
  const { title, rawText } = req.body;
  try {
    const paper = new Paper({
      userId: req.user.id,
      title,
      rawText,
    });
    await paper.save();
    res.status(201).json(paper);
  } catch (err) {
    console.error("Paper upload failed:", err);
    res.status(500).json({ message: "Server error while uploading paper" });
  }
});

// @GET /api/papers - Get all papers of current user with their questions
router.get("/", verifyToken, async (req, res) => {
  try {
    const papers = await Paper.find({ userId: req.user.id })
      .sort({ uploadedAt: -1 })
      .lean();

    const enrichedPapers = await Promise.all(
      papers.map(async (paper) => {
        const questions = await Question.find({ paperId: paper._id }).lean();
        return {
          ...paper,
          questions,
          totalQuestions: questions.length,
        };
      })
    );

    res.json(enrichedPapers);
  } catch (err) {
    console.error("Failed to fetch papers:", err);
    res.status(500).json({ message: "Failed to fetch papers" });
  }
});

// @GET /api/papers/:id - Get single paper with its questions
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const paper = await Paper.findOne({
      _id: req.params.id,
      userId: req.user.id,
    }).lean();

    if (!paper) {
      return res.status(404).json({ message: "Paper not found" });
    }

    const questions = await Question.find({ paperId: paper._id }).lean();

    res.json({
      ...paper,
      questions,
      totalQuestions: questions.length,
    });
  } catch (err) {
    console.error("Error fetching paper:", err);
    res.status(500).json({ message: "Server error while fetching paper" });
  }
});

// ✅ @DELETE /api/papers/:id - Delete a paper and its questions
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const paper = await Paper.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!paper) {
      return res
        .status(404)
        .json({ message: "Paper not found or unauthorized" });
    }

    // Also delete all questions belonging to this paper
    await Question.deleteMany({ paperId: paper._id });

    res.json({ message: "Paper and its questions deleted successfully" });
  } catch (err) {
    console.error("Error deleting paper:", err);
    res.status(500).json({ message: "Failed to delete paper" });
  }
});

// @PUT /api/papers/:id - Update paper title
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const paper = await Paper.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { $set: { title: req.body.title } },
      { new: true }
    );

    if (!paper) {
      return res.status(404).json({ message: "Paper not found or unauthorized" });
    }

    res.json(paper);
  } catch (err) {
    console.error("Error updating paper title:", err);
    res.status(500).json({ message: "Failed to update paper" });
  }
});


export default router;
