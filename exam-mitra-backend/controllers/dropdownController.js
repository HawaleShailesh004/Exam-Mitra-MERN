import Course from "../models/Data/Course.js";
import Semester from "../models/Data/Semester.js";
import QuestionPaper from "../models/Data/QuestionPaper.js";
import Subject from "../models/Data/Subject.js";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
  "January",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
];

const findMonth = (text) => {
  const month = months.find((m) =>
    text.toLowerCase().includes(m.toLowerCase())
  );
  return month || null;
};

const findYear = (text) => {
  const year = text.match(/\b(20\d{2})\b/);
  return year ? year[0] : null;
};

//@GET /dropdowns/papers
//@DESC Get all papers for a subject
//@ACCESS Public
export const getPapers = async (req, res) => {
  const { branch, semester, subject } = req.query;

  if (!branch || !semester || !subject) {
    return res
      .status(400)
      .json({ error: "Missing branch, semester, or subject" });
  }

  const branchData = await Course.findOne({ name: branch });
  const semesterData = await Semester.findOne({ semNo: semester });
  const subjectData = await Subject.findById(subject);

  if (!branchData || !semesterData || !subjectData) {
    return res
      .status(404)
      .json({ error: "Branch, semester, or subject not found." });
  }

  const qps = await QuestionPaper.find({
    course: branchData._id,
    semester: semesterData._id,
    subject: subjectData._id,
  });

  if (!qps.length) {
    return res.status(404).json({ error: "No question papers found." });
  }

  console.log(findMonth(qps[0].originalTitle));
  console.log(findYear(qps[0].originalTitle));
  const result = qps.map((qp) => ({
    title: qp.originalTitle,
    url: qp.url,
    month: findMonth(qp.originalTitle),
    year: findYear(qp.originalTitle),
  }));

  console.log(result);
  res.json({ papers: result });
};

//@GET /dropdowns/subjects
//@DESC Get all subjects for a branch & semester
//@ACCESS Public
export const getSubjects =  async (req, res) => {
  const { branch, semester } = req.query;

  if (!branch || !semester) {
    return res.status(400).json({ error: "Branch and semester are required." });
  }

  try {
    const BranchData = await Course.findOne({ name: branch });
    const SemesterData = await Semester.findOne({ semNo: semester });

    let subjects = await Subject.find({
      course: BranchData._id,
      semester: SemesterData._id,
    });

    subjects = subjects.map((subj) => {
      const cleaned = subj.name
        .replace(/\(.*?\)/g, "")
        .replace(/-/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      const titleCased = cleaned
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      return { id: subj._id, title: titleCased };
    });
    // console.log(subjects);

    return res.status(200).json({ subjects });
  } catch (err) {
    console.error("❌ Error fetching subjects:", err.message);
    return res.status(500).json({ error: "Failed to fetch subjects." });
  }
};
