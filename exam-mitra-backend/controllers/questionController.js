// controllers/questionController.js
import Question from "../models/User/Question.js";

//@POST /questions
//@DESC Add multiple questions
//@ACCESS Private
export const addQuestions = async (req, res) => {
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
};

//@GET /questions/by-paper/:paperId
//@DESC Get all questions for a paper
//@ACCESS Private
export const getQuestionsByPaper = async (req, res) => {
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
};

//@PATCH /questions/:id
//@DESC Update a question
//@ACCESS Private
export const updateQuestion = async (req, res) => {
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
};

//@GET /questions/single/:id
//@DESC Get single question by ID
//@ACCESS Private
export const getSingleQuestion = async (req, res) => {
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
};

//@DELETE /questions/:id
//@DESC Delete a question
//@ACCESS Private
export const deleteQuestion = async (req, res) => {
  try {
    const deleted = await Question.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!deleted) {
      return res
        .status(404)
        .json({ message: "Question not found or unauthorized" });
    }

    res.json({ message: "Question deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete question" });
  }
};
