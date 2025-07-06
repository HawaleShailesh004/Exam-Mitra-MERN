import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { databases } from "../Database/appwriteConfig";
import { Query, ID } from "appwrite";
import Header from "./Header";
import Footer from "./Footer";

import { useUser } from "../context/userContext";

import { useParams } from "react-router-dom";
import "../CSS/EditPaper.css";

const EditPaper = () => {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const location = useLocation();

  const { user } = useUser();
  const navigate = useNavigate();

  const { paperId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const paperRes = await databases.getDocument(
          process.env.REACT_APP_APPWRITE_DATABASE_ID,
          process.env.REACT_APP_APPWRITE_PAPERS_COLLECTION_ID,
          paperId
        );
        setTitle(paperRes.title);

        const qRes = await databases.listDocuments(
          process.env.REACT_APP_APPWRITE_DATABASE_ID,
          process.env.REACT_APP_APPWRITE_QUESTIONS_COLLECTION_ID,
          [Query.equal("paperId", paperId)]
        );

        setQuestions(qRes.documents);
      } catch (err) {
        console.error("❌ Failed to fetch paper or questions:", err);
        setError("Something went wrong!");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [paperId]);

  const handleSave = async () => {
    try {
      await databases.updateDocument(
        process.env.REACT_APP_APPWRITE_DATABASE_ID,
        process.env.REACT_APP_APPWRITE_PAPERS_COLLECTION_ID,
        paperId,
        { title }
      );

      await Promise.all(
        questions.map((q) =>
          databases.updateDocument(
            process.env.REACT_APP_APPWRITE_DATABASE_ID,
            process.env.REACT_APP_APPWRITE_QUESTIONS_COLLECTION_ID,
            q.$id,
            {
              questionText: q.questionText,
              marks: q.marks,
              frequency: q.frequency,
            }
          )
        )
      );

      alert("✅ Paper updated!");
      navigate("/dashboard");
    } catch (err) {
      console.error("❌ Update error:", err);
      alert("Failed to save changes.");
    }
  };

  const handleChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] =
      field === "marks" || field === "frequency" ? parseInt(value) : value;
    setQuestions(updated);
  };

  const deleteQuestion = async (id) => {
    const confirmDel = window.confirm("Delete this question?");
    if (!confirmDel) return;

    try {
      await databases.deleteDocument(
        process.env.REACT_APP_APPWRITE_DATABASE_ID,
        process.env.REACT_APP_APPWRITE_QUESTIONS_COLLECTION_ID,
        id
      );
      setQuestions((prev) => prev.filter((q) => q.$id !== id));
    } catch (err) {
      console.error("❌ Delete failed:", err);
    }
  };

  const addQuestion = () => {
    const newQ = {
      $id: ID.unique(),
      questionText: "",
      marks: 0,
      frequency: 0,
      isNew: true,
    };
    setQuestions([...questions, newQ]);
  };

  const saveNewQuestions = async () => {
    const newOnes = questions.filter((q) => q.isNew && q.questionText.trim());
    try {
      await Promise.all(
        newOnes.map((q) =>
          databases.createDocument(
            process.env.REACT_APP_APPWRITE_DATABASE_ID,
            process.env.REACT_APP_APPWRITE_QUESTIONS_COLLECTION_ID,
            ID.unique(),
            {
              userId: user.$id, // ✅ Required!
              paperId,
              questionText: q.questionText,
              marks: q.marks,
              frequency: q.frequency,
              isDone: false,
              isReviosn: false,
            }
          )
        )
      );
      alert("✅ New questions added.");
      navigate("/dashboard");
    } catch (err) {
      console.error("❌ Failed to save new questions", err);
      alert("❌ Failed to save new questions");
    }
  };

  if (loading) return <div className="loading-div">⏳ Loading Editor...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <>
      <Header />
      <div className="main-qs-container">
        <div className="subject-details">
          <h2>Edit Paper</h2>
        </div>

        <div className="filter-container">
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
          <button
            id="edit-paper-save-btn"
            className="edit-btn"
            onClick={handleSave}
          >
            Save Changes
          </button>
          <button className="edit-btn" onClick={saveNewQuestions}>
            Save New
          </button>
          <button className="edit-btn" onClick={addQuestion}>
            Add Question
          </button>
        </div>
        <div className="edit-paper-question-table">
          <div className="question-list-container">
            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Question</th>
                  <th>Marks</th>
                  <th>Frequency</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((q, i) => (
                  <tr key={q.$id}>
                    <td className="que-no">{i + 1}</td>
                    <td className="que-text">
                      <input
                        type="text"
                        value={q.questionText}
                        onChange={(e) =>
                          handleChange(i, "questionText", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={q.marks}
                        onChange={(e) =>
                          handleChange(i, "marks", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={q.frequency}
                        onChange={(e) =>
                          handleChange(i, "frequency", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <button
                        className="delete-question"
                        onClick={() => deleteQuestion(q.$id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default EditPaper;
