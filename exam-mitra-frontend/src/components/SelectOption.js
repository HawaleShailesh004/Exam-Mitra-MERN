import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import "../CSS/Home.css";
import "../CSS/SelectOption.css";
import { useNavigate } from "react-router-dom";

const SelectOption = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <div className="main-container">
        <h2 id="head">Select Your Preferred Option</h2>
        <div className="option-container">
          <div className="option">
            <h3>Upload Your Own Question Papers</h3>
            <p>
              Select and upload your own PDF, text, or image files of your
              question papers for further processing.
            </p>
            <div className="img-container">
              <img src="../images/upload.png" alt="Own Question Papers" />
            </div>
            <button
              onClick={() => {
                navigate("/upload");
              }}
            >
              Upload Papers
            </button>
          </div>
          <div className="option">
            <h3>Browse Question Papers</h3>
            <p>
              Browse the question papers you want from available previous papers
              in our database for further processing.
            </p>
            <div className="img-container">
              <img src="../images/browse.png" alt="Browse Question Papers" />
            </div>
            <button onClick={() => navigate("/selection")}>Browse Papers</button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SelectOption;
