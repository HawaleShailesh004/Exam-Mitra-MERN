import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import "../CSS/Upload.css";

import API from "../utils/api";

import Header from "../components/Header";
import Footer from "../components/Footer";

import { useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";
import { ID } from "appwrite";
import { databases } from "../Database/appwriteConfig";

import { pdfToImageDataURLs } from "../utils/pdfToImages.js";

const Upload = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [progressMessage, setProgressMessage] = useState("");
  const [extractedText, setExtractedText] = useState("");
  const [questions, setQuestions] = useState([]);
  const [isFetched, setIsFetched] = useState(false);
  const [subjectDetails, setSubjectDetails] = useState();
  const [fromSelection, setFromSelection] = useState(false);

  const navigate = useNavigate();
  const { user } = useUser();

  const loadingMessages = [
    "🧠 Thinking like a professor...",
    "📘 Summarizing questions from dusty old papers...",
    "🔍 Zooming in on every mark-worthy question...",
    "⚙️ Running turbo OCR magic...",
    "📄 Flipping virtual pages like a ninja...",
    "🤖 Training an AI to become your exam buddy...",
    "✍️ Spotting important 5 markers...",
    "🪄 Cleaning handwritten mess... AI style!",
  ];

  useEffect(() => {
    let interval;
    if (loading) {
      let index = 0;
      setProgressMessage(loadingMessages[index]);
      interval = setInterval(() => {
        index = (index + 1) % loadingMessages.length;
        setProgressMessage(loadingMessages[index]);
      }, 3500); // rotate every 3.5s
    } else {
      setProgressMessage("");
    }

    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    const source = localStorage.getItem("uploadSource");
    if (source === "selection") {
      setFromSelection(true);
    }
  }, []);

  useEffect(() => {
    const savedData = localStorage.getItem("uploadSession");
    if (savedData) {
      const { extractedText, questions, subjectDetails, files } =
        JSON.parse(savedData);

      if (extractedText) setExtractedText(extractedText);
      if (questions) setQuestions(questions);
      if (subjectDetails) setSubjectDetails(subjectDetails);
      if (questions?.length > 0) setIsFetched(true);
      setStatus("🔁 Restored previous session data.");

      if (files?.length) {
        setFiles(files.map((name) => ({ name })));
      }

      localStorage.removeItem("uploadSession");
    }
  }, []);

  useEffect(() => {
    if (isFetched) {
      setTimeout(() => {
        document
          .querySelector(".question-table-wrapper")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 500);
    }
  }, [isFetched]);

  const handleBrowseAgain = () => {
    localStorage.removeItem("uploadSession");
    localStorage.removeItem("uploadSource");
    navigate("/selection");
  };

  const handleUploadAgain = () => {
    localStorage.removeItem("uploadSession");
    localStorage.removeItem("uploadSource");
    navigate("/upload");
  };
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    multiple: true,
    onDrop: (acceptedFiles) => {
      setFiles((prev) => [...prev, ...acceptedFiles]);
      setStatus("");
      setExtractedText("");
    },
  });

  const handleQuestionUpdate = (index, updatedQuestion) => {
    const newQuestions = [...questions];
    newQuestions[index] = updatedQuestion;
    setQuestions(newQuestions);
  };

  const saveQuestions = async () => {
    if (!user) {
      const confirmLogin = window.confirm(
        "🔐 You need to be logged in to save questions and start preparation. Do you want to login now?"
      );

      if (confirmLogin) {
        const backup = {
          extractedText,
          questions,
          subjectDetails,
          files: files.map((f) => f.name),
        };
        localStorage.setItem("uploadSession", JSON.stringify(backup));
        navigate("/login?redirect=/upload");
      }

      return;
    }

    try {
      const paperTitle = subjectDetails?.subject || "Untitled Subject";
      const paperCode = subjectDetails?.paperCode || "";
      const fullTitle = `${paperTitle}${paperCode ? ` (${paperCode})` : ""}`;

      // 1. Save Paper
      const paperRes = await API.post("/papers", {
        title: fullTitle,
        rawText: extractedText,
      });

      const paperId = paperRes.data._id;

      // 2. Save Questions
      await API.post("/questions", {
        paperId,
        questions: questions.map((q, idx) => ({
          questionText: q.text || `Question ${idx + 1}`,
          marks: q.marks || 0,
          frequency: q.frequency || 1,
          isDone: q.status || false,
          tags: [],
          answers: "",
          isRevision: q.revision || false,
        })),
      });

      alert(`✅ ${questions.length} Questions saved for '${fullTitle}'`);
      navigate(`/questions?paperId=${paperId}`);
    } catch (err) {
      console.error("❌ Error saving to DB:", err);
      alert("❌ Failed to save data. Please check console for errors.");
    }
  };

  const EditableRow = ({ index, question, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [text, setText] = useState(question.text);
    const [marks, setMarks] = useState(question.marks);
    const [frequency, setFrequency] = useState(question.frequency);

    const handleSave = () => {
      onUpdate(index, {
        ...question,
        text,
        marks: parseInt(marks, 10),
        frequency: parseInt(frequency, 10),
      });
      setIsEditing(false);
    };

    return (
      <tr>
        <td>{index + 1}</td>
        <td>
          {isEditing ? (
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              style={{ width: "100%" }}
            />
          ) : (
            text
          )}
        </td>
        <td>
          {isEditing ? (
            <input
              value={marks}
              type="number"
              onChange={(e) => setMarks(e.target.value)}
              style={{ width: "60px" }}
            />
          ) : (
            marks
          )}
        </td>
        <td>
          {isEditing ? (
            <input
              value={frequency}
              type="number"
              onChange={(e) => setFrequency(e.target.value)}
              style={{ width: "60px" }}
            />
          ) : (
            frequency
          )}
        </td>
        <td>
          <button
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            className={isEditing ? "save-btn" : "edit-btn"}
          >
            {isEditing ? "Save" : "Edit"}
          </button>
        </td>
      </tr>
    );
  };

  const handleExtractText = async () => {
    if (files.length === 0) {
      alert("Please upload at least one PDF file.");
      return;
    }

    setLoading(true);
    setQuestions([]);
    setSubjectDetails(null);
    setIsFetched(false);
    setStatus("🧠 Processing PDFs...");

    try {
      let allTexts = [];

      for (const file of files) {
        setStatus(`🖼️ Converting ${file.name} to images...`);
        const imageDataUrls = await pdfToImageDataURLs(file);

        for (let i = 0; i < imageDataUrls.length; i++) {
          setStatus(
            `🔍 OCR for ${file.name}, Page ${i + 1} of ${
              imageDataUrls.length
            }...`
          );
          const text = await window.puter.ai.img2txt(imageDataUrls[i]);
          allTexts.push(text || "");
        }
      }

      const mergedText = allTexts.join("\n\n");
      setExtractedText(mergedText);

      setStatus("📡 Sending extracted text to backend...");

      const res = await API.post("/extract/extract-text", { text: mergedText });
      const data = res.data;

      if (!data) throw new Error("No data returned from backend");

      setSubjectDetails(data.subjectDetails);
      const cleanedQuestions = (data.questions || []).map((q) => ({
        ...q,
        marks: q.marks > 0 ? q.marks : 5,
        frequency: q.frequency > 0 ? q.frequency : 1,
      }));

      setQuestions(cleanedQuestions);
      setIsFetched(true);
      setStatus("✅ Questions Extracted Successfully!");
    } catch (err) {
      console.error("❌ Extraction Error:", err);
      setStatus("❌ Failed to extract. See console.");
    } finally {
      setLoading(false);
      localStorage.removeItem("uploadSource");
    }
  };

  return (
    <>
      <Header />
      <div className="main-container fade-in">
        <div className="upload-container">
          <h2>
            {questions.length > 0
              ? "📘 Your Extracted Questions"
              : "Upload Your PDFs"}
          </h2>

          {questions.length > 0 && (
            <>
              <div className="button-row">
                {fromSelection ? (
                  <button
                    className="action-btn extract-btn"
                    onClick={handleBrowseAgain}
                    style={{ marginRight: "1rem" }}
                  >
                    🔁 Browse Again
                  </button>
                ) : (
                  <button
                    className="extract-btn"
                    style={{ marginBottom: "20px" }}
                    onClick={() => {
                      setFiles([]);
                      setQuestions([]);
                      setExtractedText("");
                      setSubjectDetails(null);
                      setIsFetched(false);
                      setStatus("");
                      handleUploadAgain();
                    }}
                  >
                    🔄 Upload PDF Again
                  </button>
                )}
              </div>

              {/* Table view (desktop/tablet) */}
              <div className="question-table-wrapper">
                <table className="question-table">
                  <thead>
                    <tr>
                      <th>Sr No.</th>
                      <th>Question</th>
                      <th>Marks</th>
                      <th>Frequency</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {questions.map((q, i) => (
                      <EditableRow
                        key={i}
                        index={i}
                        question={q}
                        onUpdate={handleQuestionUpdate}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Card view (mobile) */}
              <div className="question-cards-wrapper">
                {questions.map((q, i) => (
                  <div key={i} className="question-card">
                    {q.isEditing ? (
                      <textarea
                        className="card-que-text"
                        value={q.text}
                        onChange={(e) =>
                          handleQuestionUpdate(i, {
                            ...q,
                            text: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <p className="card-que-text">
                        <strong>{i + 1}. </strong>
                        {q.text}`
                      </p>
                    )}

                    <div className="card-checkbox-container">
                      <label>
                        <strong>Marks:</strong>
                        <input
                          type="number"
                          value={q.marks}
                          onChange={(e) =>
                            handleQuestionUpdate(i, {
                              ...q,
                              marks: parseInt(e.target.value),
                            })
                          }
                          disabled={!q.isEditing}
                        />
                      </label>
                      <label>
                        <strong>Frequency:</strong>
                        <input
                          type="number"
                          value={q.frequency}
                          onChange={(e) =>
                            handleQuestionUpdate(i, {
                              ...q,
                              frequency: parseInt(e.target.value),
                            })
                          }
                          disabled={!q.isEditing}
                        />
                      </label>
                    </div>

                    <div className="card-action-container">
                      <button
                        className={
                          q.isEditing ? "card-save-btn" : "card-edit-btn"
                        }
                        id="edit-save-btn"
                        onClick={() => {
                          if (q.isEditing) {
                            // Save changes
                            handleQuestionUpdate(i, { ...q, isEditing: false });
                          } else {
                            // Start editing
                            handleQuestionUpdate(i, { ...q, isEditing: true });
                          }
                        }}
                      >
                        {q.isEditing ? "Save" : "Edit"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="extract-btn"
                onClick={() => saveQuestions()}
              >
                Confirm Questions & Start Preparation
              </button>
            </>
          )}

          {questions.length === 0 && (
            <>
              <p className="format-info">Supported format: PDF only</p>

              <div {...getRootProps({ className: "dropzone" })}>
                <input {...getInputProps()} />
                <p>📂 Drag & drop PDF files here, or click to browse</p>
              </div>

              <div className="file-preview">
                {files.map((file, idx) => (
                  <div key={idx} className="file-card">
                    📄 {file.name}
                  </div>
                ))}
              </div>

              {files.length > 0 && (
                <button
                  className="extract-btn"
                  onClick={handleExtractText}
                  disabled={loading}
                >
                  {loading ? "⏳ Processing..." : "🧠 Extract Questions"}
                </button>
              )}

              {loading && (
                <div className="loading-spinner">
                  <div className="loader"></div>
                  <p>{progressMessage}</p>
                </div>
              )}

              {/* {status && <p className="status-text">{status}</p>} */}
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Upload;
