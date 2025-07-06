// src/pages/NotFoundPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/NotFoundPage.css";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="notfound-container">
      <div className="notfound-card">
        <h1>🚧 Oops! Lost in the syllabus?</h1>
        <p>
          The path you're trying to access doesn’t exist or has been moved.
          <br />
          Even exam toppers get lost sometimes — don’t worry!
        </p>
        <button className="home-btn" onClick={() => navigate("/")}>
          🏠 Go to Home
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
