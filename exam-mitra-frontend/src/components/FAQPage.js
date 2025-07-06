import React from "react";
import "../CSS/FAQPage.css";
import Header from "./Header";
import Footer from "./Footer";

const faqs = {
  "General": [
    {
      question: "What is ExamMitra?",
      answer:
        "ExamMitra is your AI-powered study buddy that helps you prepare for exams by extracting questions from past papers, tracking progress, and organizing subjects smartly.",
    },
    {
      question: "Is ExamMitra free to use?",
      answer: "Yes, ExamMitra is completely free for all students.",
    },
    {
      question: "Who can use ExamMitra?",
      answer:
        "Any student from any branch or year can use ExamMitra. We now support all branches and allow browsing papers directly.",
    },
  ],
  "Features": [
    {
      question: "Can I browse question papers?",
      answer:
        "Yes! You can browse papers from multiple branches, years, and subjects — no need to upload always.",
    },
    {
      question: "How are questions extracted?",
      answer:
        "Our backend uses OCR and LLMs to extract structured questions from your uploaded PDF or scraped paper.",
    },
    {
      question: "Can I track which questions I completed?",
      answer:
        "Definitely! You can mark questions as done or for revision and track your subject-wise progress.",
    },
  ],
  "Account & Login": [
    {
      question: "Is login required to use the app?",
      answer:
        "You can browse freely, but login is required to save papers, track progress, or access your dashboard.",
    },
    {
      question: "Can I log in with Google?",
      answer: "Yes, Google OAuth is supported for faster login.",
    },
  ],
  "Help & Support": [
    {
      question: "Why isn’t my paper extracting correctly?",
      answer:
        "Make sure the paper is clear and typed. If it’s handwritten or blurry, the OCR might fail.",
    },
    {
      question: "How do I contact the team?",
      answer:
        "Click on the Contact link in the footer or email us at support@exammita.in.",
    },
  ],
};

const FAQPage = () => {
  return (
    <>
    <Header/>
    <div className="faq-container">
      <h1 className="faq-title">📖 Frequently Asked Questions</h1>
      <p className="faq-subtitle">
        Answers to all your ExamMitra doubts – scroll through by category!
      </p>

      {Object.entries(faqs).map(([category, items]) => (
        <div key={category} className="faq-category">
          <h2 className="faq-category-title">{category}</h2>
          <div className="faq-list">
            {items.map((faq, index) => (
              <div className="faq-item" key={index}>
                <div className="faq-question">{faq.question}</div>
                <div className="faq-answer">{faq.answer}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
    <Footer/>
    </>
  );
};

export default FAQPage;
