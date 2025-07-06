import React, { useEffect, useState } from "react";
import "../CSS/Dashboard.css";
import { useUser } from "../context/userContext";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";

const Dashboard = () => {
  const { user, userLoading } = useUser();
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRevision, setShowRevision] = useState(false);
  const [editPaperId, setEditPaperId] = useState(null);

  const navigate = useNavigate();

  const toggleRevision = () => setShowRevision((prev) => !prev);

  const getConfidenceClass = (confidence) => {
    if (confidence >= 80) return "confidence-expert";
    if (confidence >= 40) return "confidence-intermediate";
    return "confidence-beginner";
  };

  useEffect(() => {
    if (userLoading) return;

    if (!user) {
      const wasLoggedOut = localStorage.getItem("manualLogout") === "true";

      if (wasLoggedOut) {
        localStorage.removeItem("manualLogout");
        navigate("/login?redirect=/dashboard");
        // } else {
        //   const confirmLogin = window.confirm(
        //     "🔐 You need to be logged in to view Dashboard. Do you want to login now?"
        //   );
        //   if (confirmLogin) {
        //     navigate("/login");
        //   }
      }
    }
  }, [user, userLoading, navigate]);

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const res = await API.get("/papers"); // Auto fetches for logged-in user via JWT
        const enrichedPapers = res.data.map((paper) => ({
          ...paper,
          totalQuestions: paper.questions?.length || 0,
        }));

        setPapers(enrichedPapers);
        setLoading(false);
      } catch (err) {
        console.error("❌ Error fetching papers:", err);
      }
    };

    if (user) fetchPapers();
  }, [user]);

  const goToPaper = (paperId) => {
    navigate("/questions?paperId=" + paperId);
  };

  const goToEditPaper = (paperId) => {
    navigate("/edit-paper/" + paperId);
  };

  const deletePaper = async (paperId) => {
  const confirmDelete = window.confirm(
    "⚠️ Are you sure you want to delete this paper?"
  );
  if (!confirmDelete) return;

  try {
    await API.delete(`/papers/${paperId}`);
    setPapers((prev) => prev.filter((p) => p._id !== paperId));
  } catch (err) {
    console.error("❌ Failed to delete paper:", err);
    alert("Failed to delete. Try again later.");
  }
};


  const calcProgress = (qList) => {
    if (!qList || qList.length === 0) return 0;
    const done = qList.filter((q) => q.isDone).length;
    return Math.round((done / qList.length) * 100);
  };

  const calcTotalDone = () => {
    return papers.reduce(
      (acc, p) => acc + p.questions.filter((q) => q.isDone).length,
      0
    );
  };

  const getAchievements = () => {
    const totalDone = calcTotalDone();
    const badges = [];
    if (papers.some((p) => calcProgress(p.questions) === 100)) {
      badges.push("🏅 First Subject Completed");
    }
    if (totalDone >= 50) {
      badges.push("🔥 50+ Questions Solved");
    }
    if (totalDone >= 100) {
      badges.push("🚀 100 Questions Mastered");
    }
    if (totalDone > 0) {
      badges.push("🎯 Active Learner");
    }
    return badges;
  };

  if (userLoading)
    return <div className="loading">⏳ Checking user session...</div>;
  if (!user && !userLoading)
    return (
      <div className="not-logged-in-page">
        <Header />
        <div className="not-logged-in-container">
          <h2>🔐 You are not logged in</h2>
          <p>To access your dashboard, please log in to your account.</p>
          <button
            onClick={() => navigate("/login")}
            className="login-redirect-btn"
          >
            🔑 Go to Login
          </button>
        </div>
        <Footer />
      </div>
    );

  return (
    <>
      <Header />
      <div className="dashboard-container">
        <h1 className="dashboard-heading">👋 Welcome, {user.name}</h1>

        <div className="stats-summary">
          <div
            className="stat-card fadeIn "
            style={{ backgroundImage: "url('/images/hero-backgrounf.jpg')" }}
          >
            <h3>Total Subjects</h3>
            <p>{papers.length}</p>
          </div>
          <div
            className="stat-card fadeIn delay-1"
            style={{ backgroundImage: "url('/images/hero-backgrounf.jpg')" }}
          >
            <h3>Total Questions</h3>
            <p>{papers.reduce((acc, p) => acc + (p.totalQuestions || 0), 0)}</p>
          </div>
          <div
            className="stat-card fadeIn delay-2"
            style={{ backgroundImage: "url('/images/hero-backgrounf.jpg')" }}
          >
            <h3>Questions Solved</h3>
            <p>{calcTotalDone()}</p>
          </div>
        </div>

        <div className="subject-grid">
          {papers.map((paper) => {
            const done = paper.questions.filter((q) => q.isDone).length;
            const total = paper.questions.length;
            const confidence = calcProgress(paper.questions);

            return (
              <div
                className={`subject-card slideInUp ${getConfidenceClass(
                  confidence
                )}`}
                key={paper._id}
              >
                <h2>{paper.title}</h2>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${confidence}%` }}
                  ></div>
                </div>
                <p className="progress-label">{confidence}% completed</p>
                <p className="card-metric">
                  Questions: {done}/{total}
                </p>
                <p className="card-metric">Confidence: {confidence}%</p>
                <div className="btn-container">
                  <button
                    onClick={() => goToPaper(paper._id)}
                    className="continue-btn"
                  >
                    📘 Continue
                  </button>
                  <button
                    onClick={() => goToEditPaper(paper._id)}
                    className="edit-btn continue-btn"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => deletePaper(paper._id)}
                    id="delete-btn"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="start-new-section">
          <button
            className="start-new-btn fadeIn delay-2"
            onClick={() => navigate("/upload")}
          >
            ➕ Start New Subject
          </button>
        </div>

        <div className="dashboard-bonus">
          <div className="section">
            <h2 className="section-title">📈 Your Growth</h2>
            <p className="info-text">
              Track how far you've come and stay motivated through milestones.
            </p>
            <div className="achievement-list">
              {getAchievements().map((badge, index) => (
                <div className={`badge fadeIn delay-${index}`} key={index}>
                  {badge}
                </div>
              ))}
            </div>
          </div>

          <div className="section">
            <h2 className="section-title">🔁 Revision Needed</h2>
            <button className="toggle-revision-btn" onClick={toggleRevision}>
              {showRevision
                ? "Hide Revision Questions"
                : "View Revision Questions"}
            </button>
            <div
              className={`revision-expandable ${
                showRevision ? "expanded" : ""
              }`}
            >
              <ul className="revision-list">
                {papers.flatMap((paper) =>
                  paper.questions
                    .filter((q) => q.isRevision)
                    .slice(0, 5)
                    .map((q) => (
                      <li key={q._id}>
                        <span className="rev-question">{q.questionText}</span>
                        <button
                          onClick={() => goToPaper(paper._id)}
                          className="rev-btn"
                        >
                          Review
                        </button>
                      </li>
                    ))
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Dashboard;
