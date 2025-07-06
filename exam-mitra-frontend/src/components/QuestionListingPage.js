import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { MdSwapVert } from "react-icons/md";
import { FaFilePdf } from "react-icons/fa";
import { FiFilter } from "react-icons/fi";
import html2pdf from "html2pdf.js";
import debounce from "lodash.debounce";
import API from "../utils/api"; // axios instance with JWT token

import Toast from "./Toast";

import Header from "./Header";
import Footer from "./Footer";
import PDFExportBlock from "./PDFExportBlock";

import { downloadAsDocx } from "../utils/downloadDocx";

import "../CSS/Home.css";
import "../CSS/QuestionListingPage.css";


import { useUser } from "../context/userContext";
import { Query } from "appwrite";

import ExportFilterModal from "./ExportFilterModal";

const QuestionListingPage = () => {
  const [sortOrder, setSortOrder] = useState(true);
  const [sortField, setSortField] = useState("marks");
  const [filter, setFilter] = useState("all");
  const [currentSubject, setCurrentSubject] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [toastMsg, setToastMsg] = useState("");
  const [exportQuestions, setExportQuestions] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { user, userLoading } = useUser();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const paperId = queryParams.get("paperId");
  window.html2pdf = html2pdf;

  const pdfRef = useRef();

  const debouncedUpdate = useRef(
    debounce(async (id, field, newValue) => {
      try {
        await API.patch(`/questions/${id}`, {
          [field === "status" ? "isDone" : "isRevision"]: newValue,
        });
      } catch (err) {
        console.error("❌ Update failed:", err);
      }
    }, 500)
  ).current;

  useEffect(() => {
    if (userLoading) return;

    const fetchData = async () => {
      try {
          if (userLoading) return;
        if (!user) {
          setError("🔐 Please login to view questions.");
          setLoading(false);
          return;
        }

        if (!paperId) {
          setError("❗ No paper selected. Please select a subject.");
          setLoading(false);
          return;
        }

        const paperRes = await API.get(`/papers/${paperId}`);
        const paper = paperRes.data;

        console.log(paper)

        setCurrentSubject({
          subject: paper.title,
          paperCode: "",
          paperId: paper._id,
        });

        const qRes = await API.get(`/questions/by-paper/${paperId}`);
        const transformed = qRes.data.map((q) => ({
          id: q._id,
          text: q.questionText,
          marks: q.marks,
          frequency: q.frequency,
          status: q.isDone,
          revision: q.isRevision,
          answer: q.answers || "",
        }));

        setQuestions(transformed);
        console.log(transformed)
        setLoading(false);
      } catch (err) {
        console.error("❌ Error:", err);
        setError("❌ Failed to fetch paper or questions.");
        setLoading(false);
      }
    };

    fetchData();
  }, [user, userLoading, paperId]);

  const handleFilteredExport = (filterOption, sortOption) => {
    let filtered = [...questions];

    switch (filterOption) {
      case "done":
        filtered = filtered.filter((q) => q.status);
        break;
      case "answered":
        filtered = filtered.filter((q) => q.answer && q.answer.trim() !== "");
        break;
      case "revision":
        filtered = filtered.filter((q) => q.revision);
        break;
      case "below5":
        filtered = filtered.filter((q) => q.marks < 5);
        break;
      case "above5":
        filtered = filtered.filter((q) => q.marks >= 5);
        break;
      default:
        break;
    }

    filtered.sort((a, b) =>
      sortOption === "marks" ? b.marks - a.marks : b.frequency - a.frequency
    );

    // Inject filtered into hidden PDF markdown and export
    const hiddenBlock = document.querySelector(".pdf-markdown");
    if (!hiddenBlock) return alert("PDF content not rendered yet");
    setToastMsg("📥 Preparing your PDF...");
    setExportQuestions(filtered);

    setTimeout(() => {
      html2pdf()
        .set({
          margin: 20,
          filename: `${
            currentSubject.subject
          }_Questions_${getCurrentTimeStamp()}.pdf`,

          html2canvas: { scale: 2 },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
          pagebreak: { mode: ["avoid-all", "css", "legacy"] },
          callback: (pdf) => {
            const totalPages = pdf.internal.getNumberOfPages();
            const today = new Date().toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            });

            for (let i = 1; i <= totalPages; i++) {
              pdf.setPage(i);
              pdf.setFontSize(12);
              pdf.text(`Page ${i} of ${totalPages}`, 105, 287, {
                align: "center",
              });
              pdf.text(
                `Generated by ExamMitra | ${currentSubject.subject} | ${today}`,
                14,
                287
              );
            }
          },
        })
        .from(hiddenBlock)
        .save();
      setToastMsg("✅ PDF Downloaded Successfully!");
    }, 100); // short delay to ensure render
  };

  const handleFilteredDocx = (filterOption, sortOption) => {
    let filtered = [...questions];

    switch (filterOption) {
      case "done":
        filtered = filtered.filter((q) => q.status);
        break;
      case "answered":
        filtered = filtered.filter((q) => q.answer && q.answer.trim() !== "");
        break;
      case "revision":
        filtered = filtered.filter((q) => q.revision);
        break;
      case "below5":
        filtered = filtered.filter((q) => q.marks < 5);
        break;
      case "above5":
        filtered = filtered.filter((q) => q.marks >= 5);
        break;
      default:
        break;
    }

    filtered.sort((a, b) =>
      sortOption === "marks" ? b.marks - a.marks : b.frequency - a.frequency
    );

    setToastMsg("📥 Preparing your DOCX...");
    setExportQuestions(filtered); // trigger render of updated PDFExportBlock

    // Wait for next render frame using a short delay
    setTimeout(() => {
      const content = document.querySelector(".pdf-markdown");
      if (!content) return alert("DOCX content not found");

      downloadAsDocx(
        content.innerHTML,
        `${currentSubject.subject}_Questions_${getCurrentTimeStamp()}.docx`
      );

      setToastMsg("✅ DOCX Downloaded Successfully!");
    }, 100);
  };

  const getCurrentTimeStamp = () => {
    const now = new Date();
    return now.toTimeString().split(" ")[0].replaceAll(":", "-"); // HH-MM-SS
  };

  const applyFilter = (questions, filter) => {
    switch (filter) {
      case "revision":
        return questions.filter((q) => q.revision);
      case "done":
        return questions.filter((q) => q.status);
      case "below10":
        return questions.filter((q) => q.marks < 10);
      case "above10":
        return questions.filter((q) => q.marks >= 10);
      default:
        return questions;
    }
  };

  const toggleSort = () => {
    const newSortOrder = !sortOrder;
    setSortOrder(newSortOrder);
    sortQuestions(sortField, newSortOrder);
  };

  const sortQuestions = (field, order) => {
    const sorted = [...questions].sort((a, b) =>
      order ? a[field] - b[field] : b[field] - a[field]
    );
    setQuestions(sorted);
  };

  const updateList = (e) => {
    const field = e.target.value;
    setSortField(field);
    sortQuestions(field, sortOrder);
  };

  const updateQuestionCheckbox = (id, field) => {
    const updatedQuestions = questions.map((q) =>
      q.id === id ? { ...q, [field]: !q[field] } : q
    );
    setQuestions(updatedQuestions);

    const newValue = !questions.find((q) => q.id === id)[field];
    debouncedUpdate(id, field, newValue);
  };

  const filteredQuestions = applyFilter(questions, filter);

  if (loading || userLoading)
    return (
      <>
        <Header />
        <div className="loading-spinner">
          <div className="loader"></div>
          <p>Loading Questions...</p>
        </div>
        <Footer />
      </>
    );

  if (error)
    return (
      <>
        <Header />
        <div style={{ color: "red", padding: "2rem" }}>{error}</div>
        <Footer />
      </>
    );

  return (
    <div>
      <Header />
      <div className="main-qs-container">
        <div className="subject-details-qs">
          <h1 className="title">{currentSubject.subject}</h1>
        </div>

        <div className="filter-container">
          <span>Questions List</span>

          <div className="selectContainer">
            <select name="sort" id="sort" onChange={updateList}>
              <option value="marks">Marks</option>
              <option value="frequency">Frequency</option>
            </select>
          </div>

          <button onClick={toggleSort} className="sortButton">
            <MdSwapVert />
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="sortButton"
            id="exportBtn"
          >
            <FaFilePdf />
          </button>

          <div className="selectContainer">
            <select
              name="filter"
              id="filter"
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="revision">Revision Only</option>
              <option value="done">Done Only</option>
              <option value="below10">{`Marks < 10`}</option>
              <option value="above10">Marks ≥ 10</option>
            </select>
            <FiFilter className="filterIcon" />
          </div>
        </div>

        {/* Table and card views */}
        <div className="question-table-wrapper">
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Title</th>
                <th>Answer</th>
                <th>Marks</th>
                <th>Frequency</th>
                <th>Revision</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredQuestions.map((que, i) => (
                <tr key={que.id}>
                  <td>{i + 1}</td>
                  <td className="que-text">{que.text}</td>
                  <td>
                    <Link id="ansbtn" to={`/answer/${que.id}`}>
                      Answer
                    </Link>
                  </td>
                  <td>{que.marks}</td>
                  <td>{que.frequency}</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={que.revision}
                      onChange={() =>
                        updateQuestionCheckbox(que.id, "revision")
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={que.status}
                      onChange={() => updateQuestionCheckbox(que.id, "status")}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="question-cards-wrapper">
          {filteredQuestions.map((que, i) => (
            <div className="question-card" key={que.id}>
              <div id="card-que-text">
                <strong>{`${i + 1}.`}</strong> {que.text}
              </div>

              <div id="card-checkbox-container">
                <span>
                  <strong>Revision:</strong>{" "}
                  <input
                    id="card-checkbox"
                    type="checkbox"
                    checked={que.revision}
                    onChange={() => updateQuestionCheckbox(que.id, "revision")}
                  />
                </span>
                <span>
                  <strong>Status:</strong>{" "}
                  <input
                    type="checkbox"
                    checked={que.status}
                    onChange={() => updateQuestionCheckbox(que.id, "status")}
                  />
                </span>
              </div>

              <div id="card-checkbox-container">
                <span>
                  <strong>Marks:</strong> {que.marks}
                </span>
                <span>
                  <strong>Frequency:</strong> {que.frequency}
                </span>
              </div>
              <div id="card-ans-text">
                <Link id="ansbtn" to={`/answer/${que.id}`}>
                  Answer
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Render PDF Block hidden */}
      {filteredQuestions.length > 0 && currentSubject && (
        <PDFExportBlock
          ref={pdfRef}
          subjectName={currentSubject.subject}
          questions={exportQuestions}
        />
      )}

      <ExportFilterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleFilteredExport}
        onDocxExport={handleFilteredDocx}
      />

      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg("")} />}

      <Footer />
    </div>
  );
};

export default QuestionListingPage;
