import mongoose, { Schema } from "mongoose";

const questionPaperSchema = mongoose.Schema(
  {
    originalTitle: {
      type: String,
      required: true,
    },
    encodedTitle: {
      type: String,
      required: true,
      lowercase: true,
    },
    course: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Course",
      required: true,
    },
    semester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Semester",
      required: true,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const questionPaperModel = mongoose.model("QuestionPaper", questionPaperSchema);

export default questionPaperModel;
