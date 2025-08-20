import questionPaperModel from "../models/Data/QuestionPaper.js";

//@GET /api/question-papers
// @desc Get all question papers
export const getAllQuestionPapers = async (req, res) => {
  try {
    const questionPapers = await questionPaperModel.find();
    res.status(200).json(questionPapers);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch question papers" });
  }
};

// @desc Get a question paper by ID
export const getQuestionPaperById = async (req, res) => {
  try {
    const questionPaper = await questionPaperModel.findById(req.params.id);
    if (!questionPaper) {
      return res.status(404).json({ message: "Question paper not found" });
    }
    res.status(200).json(questionPaper);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch question paper" });
  }
};

// @desc Get a question paper by title
export const getQuestionPaperByTitle = async (req, res) => {
  try {
    const encodedTitle = req.params.title.replace(/[-]/g, "").toLowerCase().trim();
    const questionPaper = await questionPaperModel.findOne({ encodedTitle });
    if (!questionPaper) {
      return res.status(404).json({ message: "Question paper not found" });
    }
    res.status(200).json(questionPaper);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch question paper" });
  }
};


// @desc Create a new question paper
export const createQuestionPaper = async (req, res) => {
  try {
    const { title, paperCode, url } = req.body;

    const newQuestionPaper = new questionPaperModel({
      originalTitle: title,
      encodedTitle: title.replace(/[-]/g, "").toLowerCase().trim(),
      paperCode,
      url,
    });

    await newQuestionPaper.save();
    res.status(201).json(newQuestionPaper);
  } catch (error) {
    res.status(500).json({ message: "Failed to create question paper" });
  }
};
