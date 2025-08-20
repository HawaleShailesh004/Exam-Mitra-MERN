import mongoose from "mongoose";

const semesterSchema = mongoose.Schema(
  {
    semNo: {
      type: Number,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const semesterModel = mongoose.model("Semester", semesterSchema);

export default semesterModel;
