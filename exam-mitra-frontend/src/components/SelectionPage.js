import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import "../CSS/Home.css";
import "../CSS/SelectionPage.css";
import { useNavigate } from "react-router-dom";
import { extractTextFromPdfUrlUsingOCR } from "../utils/ocrPdfFromUrl";
import branchesList from "../utils/branches.js";
import API from "../utils/api"; // ✅ use centralized axios

const SelectionPage = () => {
  const navigate = useNavigate();

  const [branch, setBranch] = useState("");
  const [semester, setSemester] = useState("");
  const [subject, setSubject] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [qpLoading, setQpLoading] = useState(false);
  const [error, setError] = useState("");
  const [progressText, setProgressText] = useState("");
  const [extloading, setExtLoading] = useState(false);
  const [qps, setQps] = useState([]);
  const [selectedQps, setSelectedQps] = useState([]);

  const branches = branchesList;
  const semesters = [3, 4, 5, 6, 7, 8];

  const loadingMessages = [
    "Analyzing your paper like a topper 🧠",
    "Scanning for important questions 📚",
    "Summoning the exam gods 🕉️",
    "Breaking down complex questions like a pro 🧩",
    "Extracting gold nuggets from question papers 💎",
    "Looking for the 5-marker questions you love 🔍",
    "Almost there Stay sharp! ⚡",
    "Thinking like an examiner 🤓",
  ];

  const romanNumerals = [
    "I",
    "II",
    "III",
    "IV",
    "V",
    "VI",
    "VII",
    "VIII",
    "IX",
    "X",
  ];
  const formatTitle = (title) =>
    title
      .split(" ")
      .map((word) =>
        romanNumerals.includes(word.toUpperCase())
          ? word.toUpperCase()
          : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join(" ");

  const handleBranchChange = (e) => {
    setBranch(e.target.value);
    setSubject(null);
    setQps([]);
    setSelectedQps([]);
  };

  const handleSemesterChange = (e) => {
    setSemester(e.target.value);
    setQps([]);
    setSelectedQps([]);
  };

  useEffect(() => {
    let interval;
    if (extloading) {
      let index = 0;
      setProgressText(loadingMessages[index]);
      interval = setInterval(() => {
        index = (index + 1) % loadingMessages.length;
        setProgressText(loadingMessages[index]);
      }, 3500);
    } else {
      clearInterval(interval);
      setProgressText("");
    }

    return () => clearInterval(interval);
  }, [extloading]);

  useEffect(() => {
    if (!branch || !semester) return;

    const fetchSubjects = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await API.get("/dropdown/dropdowns/subjects", {
          params: { branch, semester },
        });

        const seenTitles = new Set();
        const cleanedSubjects = (res.data.subjects || [])
          .map((sub) => ({
            ...sub,
            title: formatTitle(sub.title),
          }))
          .filter((sub) => {
            if (seenTitles.has(sub.title)) return false;
            seenTitles.add(sub.title);
            return true;
          });

        setSubjects(cleanedSubjects);
      } catch (err) {
        console.error("Failed to fetch subjects:", err);
        setError("Unable to load subjects. Please try again.");
        setSubjects([]);
      }
      setLoading(false);
    };

    fetchSubjects();
  }, [branch, semester]);

  const handleWebFetchStart = async () => {
    if (!branch || !semester || !subject) return;

    setQpLoading(true);
    setError("");
    setQps([]);
    setSelectedQps([]);

    try {
      const res = await API.get("/dropdown/dropdowns/papers", {
        params: {
          branch,
          semester,
          subject: subject.title,
        },
      });

      if (res.data?.papers?.length) {
        setQps(res.data.papers);
      } else {
        setError("No question papers found for selected subject.");
      }
    } catch (err) {
      console.error("Failed to fetch QPs:", err);
      setError("Failed to fetch question papers. Please try again.");
    } finally {
      setQpLoading(false);
    }
  };

  const handleExtractFromUrls = async (urls) => {
    if (!urls.length) {
      alert("Please select at least one question paper.");
      return;
    }

    try {
      setExtLoading(true);
      setProgressText("");
      let mergedText = "";

      for (let i = 0; i < urls.length; i++) {
        const text = await extractTextFromPdfUrlUsingOCR(
          urls[i],
          setProgressText
        );
        mergedText += text + "\n\n";
      }

      const res = await API.post("/extract/extract-text", {
        text: mergedText,
      });

      const { questions, extractedText, subjectDetails } = res.data;

      if (!questions?.length) throw new Error("No questions extracted");

      localStorage.setItem(
        "uploadSession",
        JSON.stringify({
          extractedText,
          questions,
          subjectDetails,
          files: urls.map((url) => new URL(url).pathname.split("/").pop()),
        })
      );
      localStorage.setItem("uploadSource", "selection");
      navigate("/upload");
    } catch (err) {
      console.error("❌ OCR extract failed:", err);
      setProgressText("Failed to extract questions.");
    } finally {
      setExtLoading(false);
      setQpLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="selection-page fadeIn">
        <main className="main-section">
          <h1>Select Your Details to Start Exploring!</h1>
          <p>
            Choose your branch, semester, and subject to access previous year
            papers and important questions.
          </p>

          <div className="selection-form">
            <div className="dropdown">
              <label>Branch:</label>
              <select value={branch} onChange={handleBranchChange}>
                <option value="">Select Branch</option>
                {branches.map((b, idx) => (
                  <option key={idx} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div className="dropdown">
              <label>Semester:</label>
              <select value={semester} onChange={handleSemesterChange}>
                <option value="">Select Semester</option>
                {semesters.map((s, idx) => (
                  <option key={idx} value={s}>
                    Semester {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="dropdown" id="subject-dropdown">
              <label>Subject:</label>
              <select
                value={subject ? JSON.stringify(subject) : ""}
                onChange={(e) => setSubject(JSON.parse(e.target.value))}
                disabled={!branch || !semester}
              >
                <option value="">Select Subject</option>
                {loading ? (
                  <option disabled>Loading...</option>
                ) : (
                  subjects.map((s, idx) => (
                    <option key={idx} value={JSON.stringify(s)}>
                      {s.title}
                    </option>
                  ))
                )}
              </select>
            </div>

            <button
              className="continue-btn"
              disabled={!subject || qpLoading}
              onClick={handleWebFetchStart}
              type="button"
            >
              {qpLoading ? "Fetching..." : "Fetch QPs from Web"}
            </button>

            {error && <p className="error-text">{error}</p>}
            <p className="info-text">
              Tip: You can change selections anytime from your dashboard!
            </p>
          </div>

          {qps.length > 0 && (
            <div className="qps-table-section fadeIn">
              <h2>Available Question Papers</h2>
              <table className="qps-table">
                <thead>
                  <tr>
                    <th>Year</th>
                    <th>Month</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {qps.map((qp, idx) => {
                    const [month, year] = qp.title.split(" ");
                    const isSelected = selectedQps.includes(qp.url);
                    return (
                      <tr key={idx} className="fadeInRow">
                        <td>{year}</td>
                        <td>{month}</td>
                        <td>
                          <button
                            className={`qp-table-btn ${
                              isSelected ? "selected" : "action-btn"
                            }`}
                            onClick={() =>
                              setSelectedQps((prev) =>
                                isSelected
                                  ? prev.filter((url) => url !== qp.url)
                                  : [...prev, qp.url]
                              )
                            }
                          >
                            {isSelected ? "Remove" : "Add to Preparation"}
                          </button>
                          <a
                            className="qp-table-btn download-btn"
                            href={qp.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                          >
                            View
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="selection-summary">
                <p>{selectedQps.length} paper(s) selected.</p>
                {selectedQps.length > 0 && (
                  <div className="extract-btn-container">
                    <button
                      className="extract-btn"
                      onClick={() => handleExtractFromUrls(selectedQps)}
                      type="button"
                    >
                      {extloading ? "Extracting..." : "Extract Questions"}
                    </button>
                    {extloading && <div className="loader"></div>}
                    {progressText && (
                      <p className="progressText-text error-text">
                        {progressText}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
};

export default SelectionPage;
