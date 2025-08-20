// models/Question.js
import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  paperId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Paper",
  },
  questionText: {
    type: String,
    required: true,
  },
  marks: {
    type: Number,
    default: 0,
  },
  frequency: {
    type: Number,
    default: 1,
  },
  isDone: {
    type: Boolean,
    default: false,
  },
  isRevision: {
    type: Boolean,
    default: false,
  },
  tags: {
    type: [String],
    default: [],
  },
  answers: {
    type: String,
    default: "",
  }
});

export default mongoose.model("Question", questionSchema);
