import React, { useEffect, useRef, useState } from "react";
import { FiCopy, FiCheck } from "react-icons/fi";
import { MdAutoAwesome } from "react-icons/md";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { marked } from "marked";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useNavigate, useParams } from "react-router-dom";

import API from "../utils/api";

import promptTemplates from "../utils/promptTemplates.js";
import "../CSS/Home.css";
import "../CSS/AnswerPage.css";
import Footer from "./Footer.js";
import Header from "./Header.js";

import { useUser } from "../context/userContext";

const AnswerPage = () => {
  const { id } = useParams();
  const { user } = useUser();
  const navigate = useNavigate();

  const [questionData, setQuestionData] = useState(null);
  const [answer, setAnswer] = useState("");
  const [displayedAnswer, setDisplayedAnswer] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedType, setSelectedType] = useState("MitraMode");

  const [insightsVisible, setInsightsVisible] = useState(false);

  const [insightData, setInsightData] = useState(null);
  const [insightLoading, setInsightLoading] = useState(false);

  const [paperId, setPaperId] = useState(null);

  const handleInsightsFetch = async () => {
    if (!questionData?.questionText) return;

    setInsightsVisible(true);
    setInsightLoading(true);

    try {
      const baseRes = await fetch("https://api.tavily.com/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${process.env.REACT_APP_TAVILY_KEY}`,
        },
        body: JSON.stringify({
          query: questionData.questionText,
          include_answer: true,
          include_sources: true,
        }),
      });
      const base = await baseRes.json();

      const ytRes = await fetch("https://api.tavily.com/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${process.env.REACT_APP_TAVILY_KEY}`,
        },
        body: JSON.stringify({
          query: `${questionData.questionText} site:youtube.com`,
          include_answer: false,
          include_sources: true,
        }),
      });
      const ytData = await ytRes.json();

      setInsightData({
        answer: base.answer,
        articles: (base.results || []).filter(
          (r) => !r.url.includes("youtube.com")
        ),
        videos: (ytData.results || []).filter((v) =>
          v.url.includes("youtube.com")
        ),
      });
    } catch (err) {
      console.error("❌ Failed to fetch insights", err);
    }

    setInsightLoading(false);
  };

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        // Express API
        const res = await API.get(`/questions/single/${id}`);
        setQuestionData(res.data);
        setPaperId(res.data.paperId);

        const allAnswers = JSON.parse(res.data.answers || "[]");
        const match = allAnswers.find((a) => a.ansType === selectedType);
        if (match) {
          setAnswer(match.value);
          setDisplayedAnswer(match.value);
          setIsSaved(true);
        } else {
          setAnswer("");
          setDisplayedAnswer("");
          setIsSaved(false);
        }
      } catch (err) {
        console.error("❌ Failed to fetch question:", err);
      }
    };

    if (id) fetchQuestion();
  }, [id, selectedType]);

  const animateText = (text) => {
    let index = 0;
    const chunkSize = 20;
    const delay = 100;
    let accumulated = "";

    setDisplayedAnswer("");
    const interval = setInterval(() => {
      accumulated += text.slice(index, index + chunkSize);
      setDisplayedAnswer(accumulated);
      index += chunkSize;
      if (index >= text.length) clearInterval(interval);
    }, delay);
  };

  const handleCopy = () => {
    const html = marked.parse(displayedAnswer);
    const tempElement = document.createElement("div");
    tempElement.innerHTML = html;
    const plainText = tempElement.innerText;

    navigator.clipboard.writeText(plainText).then(() => {
      setCopied(true);
      alert("📋 Copied Answer to clipboard!");
      setTimeout(() => setCopied(false), 5000);
    });
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    const questionText = questionData?.questionText || "";
    const promptFn =
      promptTemplates[selectedType] || promptTemplates["Summary"];
    const prompt = promptFn(questionText);

    try {
      const res = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
          }),
        }
      );

      const data = await res.json();
      const fullResponse = data.choices?.[0]?.message?.content || "";
      setAnswer(fullResponse);
      animateText(fullResponse);
    } catch (err) {
      console.error("❌ Error generating answer:", err);
    }

    setIsGenerating(false);
  };

  const updateStatus = async (field, value) => {
    if (!questionData) return;

    try {
      await API.patch(`/questions/${questionData._id}`, {
        [field === "status" ? "isDone" : "isRevision"]: value,
      });

      setQuestionData((prev) => ({ ...prev, [field]: value }));
    } catch (err) {
      console.error("❌ Failed to update status:", err);
    }
  };

  const handleSave = async () => {
    try {
      const allAnswers = JSON.parse(questionData.answers || "[]");
      const updatedAnswers = [
        ...allAnswers.filter((a) => a.ansType !== selectedType),
        { ansType: selectedType, value: answer },
      ];

      await API.patch(`/questions/${questionData._id}`, {
        answers: JSON.stringify(updatedAnswers),
      });

      setIsSaved(true);
      alert("✅ Answer Saved");
    } catch (err) {
      console.error("❌ Failed to save answer:", err);
    }
  };

  if (!questionData) {
    return (
      <>
        <Header />
        <div className="loading-spinner">
          <div className="loader"></div>
          <p>Loading..</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="mainContainer">
        <div className="subjectContainer">
          <h2 className="subjectTitle">Answer Page</h2>
          <button
            className="goBackBtn"
            onClick={() => navigate(`/questions?paperId=${paperId}`)}
          >
            ⬅ Go To Questions
          </button>
        </div>
        <div className="answerContainer">
          <div className="questionTitleContainer">
            <h3 className="questionTitle">{questionData.questionText}</h3>
            <div className="rightConatiner">
              <div className="checkboxGroup">
                <label className="checkboxItem">
                  <input
                    type="checkbox"
                    defaultChecked={questionData.isDone}
                    onChange={(e) => updateStatus("status", e.target.checked)}
                  />
                  <span>Done</span>
                </label>
                <label className="checkboxItem">
                  <input
                    type="checkbox"
                    defaultChecked={questionData.isReviosn}
                    onChange={(e) => updateStatus("revision", e.target.checked)}
                  />
                  <span>Revision</span>
                </label>
              </div>
              <div className="selectContainer">
                <select
                  id="answerType"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  <option value="Summary">Brief Summary</option>
                  <option value="FullAnswer">Full-Length Answer</option>
                  <option value="InSimpleWords">In Simple Words</option>
                  <option value="KeyPoints">Key Points Only</option>
                  <option value="ExamFocused">Exam-Focused Answer</option>
                  <option value="StepByStep">Step-by-Step Explanation</option>
                  <option value="WithExamples">With Examples</option>
                  <option value="DefinitionOnly">Definition Only</option>
                  <option value="MitraMode">💥 MitraMode™</option>
                </select>
              </div>
              <button
                className="generateButton"
                onClick={handleGenerate}
                disabled={isGenerating}
              >
                <MdAutoAwesome /> {isGenerating ? "Generating..." : "Generate"}
              </button>
            </div>
          </div>

          <div className="answerBox">
            <h2>Answer</h2>
            <div className="buttonContainer">
              <button id="copyBtn" onClick={handleCopy}>
                {copied ? <FiCheck /> : <FiCopy />}
              </button>
              <button id="saveBtn" onClick={handleSave}>
                {isSaved ? <BsBookmarkFill /> : <BsBookmark />}
              </button>
            </div>
            <div className="answerText markdown-body">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {displayedAnswer}
              </ReactMarkdown>
            </div>
          </div>

          <div className="webInsightsContainer">
            {!insightsVisible && (
              <button
                className="insightsFetchBtn"
                onClick={handleInsightsFetch}
              >
                🌐 Get Web Insights
              </button>
            )}

            {insightLoading && (
              <p className="loaderText">⏳ Fetching insights from the web...</p>
            )}

            {insightsVisible && !insightLoading && (
              <>
                {insightData?.answer && (
                  <div className="insightBlock">
                    <h4>🧠 AI Summary</h4>
                    <p className="insightAnswer">{insightData.answer}</p>
                  </div>
                )}

                {insightData?.articles?.length > 0 && (
                  <div className="insightBlock">
                    <h4>📄 Related Articles</h4>
                    {insightData.articles.map((item, index) => (
                      <div key={index} className="insightCard">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                          className="insightTitleLink"
                        >
                          🔗 {item.title}
                        </a>
                        {item.content && (
                          <p className="insightSnippet">
                            {item.content.slice(0, 150)}...
                          </p>
                        )}
                        <p className="insightMeta">
                          Source: <strong>{new URL(item.url).hostname}</strong>
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {insightData?.videos?.length > 0 && (
                  <div className="insightBlock">
                    <h4>🎥 YouTube Videos</h4>
                    {insightData.videos.map((item, index) => (
                      <div key={index} className="insightCard">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                          className="insightTitleLink"
                        >
                          ▶️ {item.title}
                        </a>
                        {item.content && (
                          <p className="insightSnippet">
                            {item.content.slice(0, 150)}...
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AnswerPage;
