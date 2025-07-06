import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import "../CSS/Home.css";
import "../CSS/SelectionPage.css";
import { useNavigate } from "react-router-dom";
import { extractTextFromPdfUrlUsingOCR } from "../utils/ocrPdfFromUrl";
import branchesList from "../utils/branches.js";

const SelectionPage = () => {
  const navigate = useNavigate();

  // State variables to track user selections and data
  const [branch, setBranch] = useState("");
  const [semester, setSemester] = useState("");
  const [subject, setSubject] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false); // For subject loading
  const [qpLoading, setQpLoading] = useState(false); // For question papers loading
  const [error, setError] = useState("");
  const [progressText, setProgressText] = useState("");
  const [extloading, setExtLoading] = useState(false);
  const [qps, setQps] = useState([]); // Question papers fetched
  const [selectedQps, setSelectedQps] = useState([]); // User-selected QPs URLs

  // Static data: branches and semesters available
  const branches = branchesList;
  const semesters = [3, 4, 5, 6, 7, 8];

  // Roman numerals for proper subject title formatting
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

  // Format subject title: capitalizes words except Roman numerals
  const formatTitle = (title) =>
    title
      .split(" ")
      .map((word) =>
        romanNumerals.includes(word.toUpperCase())
          ? word.toUpperCase()
          : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join(" ");

  // Handler for branch dropdown change
  const handleBranchChange = (e) => {
    setBranch(e.target.value);
    setSubject(null);
    setQps([]);
    setSelectedQps([]);
  };

  // Handler for semester dropdown change
  const handleSemesterChange = (e) => {
    setSemester(e.target.value);
    setQps([]);
    setSelectedQps([]);
  };

  // Fetch subjects when branch or semester changes
  useEffect(() => {
    if (!branch || !semester) return;

    const fetchSubjects = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `${
            process.env.REACT_APP_API_BASE_URL
          }/dropdowns/subjects?branch=${encodeURIComponent(
            branch
          )}&semester=${semester}`
        );
        const data = await res.json();
        const cleanedSubjects = (data.subjects || []).map((sub) => ({
          ...sub,
          title: formatTitle(sub.title),
        }));
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

  // Fetch question papers from backend API for selected branch, semester & subject
  const handleWebFetchStart = async () => {
    if (!branch || !semester || !subject) return;

    setQpLoading(true);
    setError("");
    setQps([]);
    setSelectedQps([]);

    try {
      const res = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL
        }/dropdowns/papers?branch=${encodeURIComponent(
          branch
        )}&semester=${semester}&subject=${encodeURIComponent(subject.title)}`
      );
      const data = await res.json();

      if (data?.papers?.length) {
        setQps(data.papers);
      } else {
        setError("No question papers found for selected subject.");
      }
    } catch (err) {
      setError("Failed to fetch question papers. Please try again.");
      console.error(err);
    } finally {
      setQpLoading(false);
    }
  };

  // Extract questions from selected paper URLs using OCR + backend
  async function handleExtractFromUrls(urls) {
    if (!urls.length) {
      alert("Please select at least one question paper.");
      return;
    }

    try {
      setProgressText("");
      setExtLoading(true);
      let mergedText = "";

      for (let i = 0; i < urls.length; i++) {
        setProgressText(`Processing paper ${i + 1} of ${urls.length}...`);
        const text = await extractTextFromPdfUrlUsingOCR(
          urls[i],
          setProgressText
        );
        mergedText += text + "\n\n";
      }

      // Post extracted text to backend for question extraction
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/extract-text`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: mergedText }),
        }
      );
      const data = await response.json();

      if (!data || !data.questions?.length) {
        throw new Error("No questions found.");
      }

      // Save extracted data to localStorage for next page
      localStorage.setItem(
        "uploadSession",
        JSON.stringify({
          extractedText: data.extractedText,
          questions: data.questions,
          subjectDetails: data.subjectDetails,
          files: urls.map((url) => new URL(url).pathname.split("/").pop()),
        })
      );
      localStorage.setItem("uploadSource", "selection");

      // Navigate to upload page to show extracted questions
      navigate("/upload");
    } catch (err) {
      console.error("OCR Extract failed:", err);
      setProgressText("Failed to extract questions.");
    } finally {
      setQpLoading(false);
      setExtLoading(false);
    }
  }

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
            {/* Branch Dropdown */}
            <div className="dropdown">
              <label htmlFor="branch-select">Branch:</label>
              <select
                id="branch-select"
                value={branch}
                onChange={handleBranchChange}
              >
                <option value="">Select Branch</option>
                {branches.map((b, idx) => (
                  <option key={idx} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* Semester Dropdown */}
            <div className="dropdown">
              <label htmlFor="semester-select">Semester:</label>
              <select
                id="semester-select"
                value={semester}
                onChange={handleSemesterChange}
              >
                <option value="">Select Semester</option>
                {semesters.map((s, idx) => (
                  <option key={idx} value={s}>
                    Semester {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Subject Dropdown */}
            <div className="dropdown" id="subject-dropdown">
              <label htmlFor="subject-select">Subject:</label>
              <select
                id="subject-select"
                value={subject ? JSON.stringify(subject) : ""}
                onChange={(e) => setSubject(JSON.parse(e.target.value))}
                disabled={!branch || !semester}
              >
                <option value="">Select Subject</option>
                {loading ? (
                  <option disabled>Loading subjects...</option>
                ) : (
                  subjects.map((s, idx) => (
                    <option key={idx} value={JSON.stringify(s)}>
                      {s.title}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Fetch QPs Button */}
        
       
        

            <button
              className="continue-btn"
              disabled={!subject || qpLoading}
              onClick={handleWebFetchStart}
              type="button"
            >
              {qpLoading ? "Fetching..." : "Fetch QPs from Web"}
            </button>

            {/* Error Message */}
            {error && <p className="error-text">{error}</p>}

            {/* Info Text */}
            <p className="info-text">
              Tip: You can change selections anytime from your dashboard!
            </p>
          </div>

          {/* Display available question papers */}
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
                        <td id="button-td">
                          {/* Toggle select/deselect QP */}
                          <button
                            className={`qp-table-btn ${
                              isSelected ? "selected" : "action-btn"
                            }`}
                            onClick={() => {
                              setSelectedQps((prev) =>
                                isSelected
                                  ? prev.filter((url) => url !== qp.url)
                                  : [...prev, qp.url]
                              );
                            }}
                            type="button"
                          >
                            {isSelected ? "Remove" : "Add to Preparation"}
                          </button>

                          {/* View/download link */}
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

              {/* Summary & Extract button */}
              <div className="selection-summary">
                <p>{selectedQps.length} paper(s) selected.</p>
                {selectedQps.length > 0 && (
                  <div className="extract-btn-container">
                    <button
                      className="extract-btn"
                      onClick={() => handleExtractFromUrls(selectedQps)}
                      type="button"
                    >
                      {!extloading ? "Extract Questions" : "Extracting.."}
                    </button>
                        {extloading && <div class="loader"></div>}
                    {progressText && (
                      <p className="progressText-text error-text">
                        Processing Selected PDFs & Extracting Question..
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
