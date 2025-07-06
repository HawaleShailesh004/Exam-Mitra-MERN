import React, { useEffect } from "react";
import "../CSS/Home.css";
import { useNavigate } from "react-router-dom";

import Footer from "./Footer.js";
import Header from "./Header.js";
import { useUser } from "../context/userContext";

const features = [
  {
    feature: "Upload or Browse Question Papers",
    description:
      "Either upload your own papers or browse from a vast collection across branches — no more endless searching online.",
    image: "/images/papers.png",
  },
  {
    feature: "Topic & Question Insights",
    description:
      "Understand what matters most with auto-highlighted frequently asked questions and high-weightage topics.",
    image: "/images/topics.png",
  },
  {
    feature: "Custom AI-Generated Answers",
    description:
      "Get instant answers tailored to your preference — brief, detailed, bullet points, or simple English.",
    image: "/images/ai.png",
  },
  {
    feature: "Visual Study Progress Tracking",
    description:
      "Mark questions as Done, Needs Revision, or Untouched — and visually track your preparation journey.",
    image: "/images/tracking.png",
  },
  {
    feature: "One-Click PDF Export",
    description:
      "Export selected questions with AI answers into a clean PDF for distraction-free offline revision.",
    image: "/images/export.png",
  },
];

const howItWorksSteps = [
  {
    icon: "📘",
    description:
      "Start by uploading your question paper or browsing from our ready-to-use library.",
    tagline: "Pick your paper.",
  },
  {
    icon: "🎯",
    description:
      "We automatically highlight the most repeated and important questions for you.",
    tagline: "See what matters.",
  },
  {
    icon: "🤖",
    description:
      "Choose your answer style and generate smart AI-powered answers instantly.",
    tagline: "Learn your way.",
  },
  {
    icon: "📄",
    description:
      "Track your progress and export a revision-ready PDF to study offline.",
    tagline: "Revise like a topper.",
  },
];

const Home = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  // Log user info when user state changes (for debugging)
  useEffect(() => {
    if (user) {
      console.log("🟢 Logged in user:", user);
    }
  }, [user]);

  return (
    <div className="homepage">
      {/* Header navigation */}
      <Header />

      {/* Hero Section: Main landing call-to-action */}
      <section
        className="hero"
        style={{ backgroundImage: "url('/images/hero-backgrounf.jpg')" }}
      >
        <div className="hero-text slide-in">
          <h1>
            All Your Exam Prep Tools, <br /> In One Place
          </h1>
          <p>
          
            Whether you’ve got your own papers or need some, get AI answers that
            make sense and tools to help you revise smarter.
          </p>

          <div className="hero-buttons">
            <button
              className="btn-primary"
              id="getStarted"
              onClick={() => navigate("/choice")}
            >
              Get Started Free
            </button>
          </div>
        </div>
        <div className="hero-image">
          <img src="/images/hero-image.jpg" alt="Dashboard Illustration" />
        </div>
      </section>

      {/* Features Section: Display app features */}
      <section className="features">
        <h2>Everything You Need for Exam Success</h2>
        <div className="feature-grid">
          {features.map((fet, index) => (
            <div
              className={`feature-card ${
                index % 2 === 0 ? "row-normal" : "row-reverse"
              }`}
              key={index}
            >
              <div className="feature-image">
                <img src={fet.image} alt={fet.feature} />
              </div>
              <div className="feature-text">
                <h3>{fet.feature}</h3>
                <p>{fet.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section: Step-by-step explanation */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          {howItWorksSteps.map((st, ind) => (
            <div
              className="step"
              key={ind}
              style={{ backgroundImage: "url('/images/hero-backgrounf.jpg')" }}
            >
              <span className="count">{ind + 1}</span>
              <span className="step-icon">{st.icon}</span>
              <p id="tag-text">{st.tagline}</p>
              <p id="desc-text">{st.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to action section */}
      <div className="callToActionContainer">
        <h3>Ready to Take Control of Your Exam Success?</h3>
        <p>
          Upload and manage your own question papers, get AI-powered answers,
          and track your progress — all in one place.
        </p>
        <button
          id="getStarted"
          onClick={() => {
            navigate("/choice");
          }}
        >
          Start Preparing Now
        </button>
      </div>

      {/* Footer at page bottom */}
      <Footer />
    </div>
  );
};

export default Home;
