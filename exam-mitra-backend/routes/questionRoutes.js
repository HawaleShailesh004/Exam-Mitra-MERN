// routes/questionRoutes.js
import express from "express";
import Question from "../models/Question.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// @POST /api/questions - Add multiple questions
router.post("/", verifyToken, async (req, res) => {
  const { paperId, questions } = req.body;

  try {
    const questionsWithUser = questions.map((q) => ({
      ...q,
      userId: req.user.id,
      paperId,
    }));

    const created = await Question.insertMany(questionsWithUser);
    res.status(201).json(created);
  } catch (err) {
    console.error("Question insert failed:", err);
    res.status(500).json({ message: "Failed to insert questions" });
  }
});

// ✅ GET /api/questions/by-paper/:paperId
router.get("/by-paper/:paperId", verifyToken, async (req, res) => {
  const { paperId } = req.params;
  try {
    const questions = await Question.find({
      userId: req.user.id,
      paperId,
    });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch questions" });
  }
});


// ✅ Update a question (done, revision, answer, marks, etc.)
router.patch("/:id", verifyToken, async (req, res) => {
  try {
    const updated = await Question.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { $set: req.body },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update question" });
  }
});


// Get single question by ID
router.get("/single/:id", verifyToken, async (req, res) => {
  try {
    const question = await Question.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!question) return res.status(404).json({ message: "Not found" });

    res.json(question);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch question" });
  }
});

// @DELETE /api/questions/:id - Delete single question
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const deleted = await Question.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Question not found or unauthorized" });
    }

    res.json({ message: "Question deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete question" });
  }
});



export default router;
