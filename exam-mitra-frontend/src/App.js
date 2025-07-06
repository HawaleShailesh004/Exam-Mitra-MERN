import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./components/Home";
import SelectionPage from "./components/SelectionPage";
import QuestionListingPage from "./components/QuestionListingPage";
import AnswerPage from "./components/AnswerPage";
import SelectOption from "./components/SelectOption";
import Upload from "./components/Upload";
import LoginSignup from "./components/loginSignup";
import OauthSuccess from "./components/OauthSuccess";

import { UserProvider } from "./context/userContext";
import Dashboard from "./components/Dashboard";
import EditPaper from "./components/EditPaper";
import NotFoundPage from "./components/NotFoundPage";
import FAQPage from "./components/FAQPage";
import ContactPage from "./components/ContactPage";
import PDFExport from "./components/PDFExport";

const App = () => {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginSignup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/choice" element={<SelectOption />} />
          <Route path="/selection" element={<SelectionPage />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/questions" element={<QuestionListingPage />} />
         <Route path="/edit-paper/:paperId" element={<EditPaper />} />



          <Route path="/answer/:id" element={<AnswerPage />} />
          <Route path="/oauth-success" element={<OauthSuccess />} />
          
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/pdf" element={<PDFExport />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
};

export default App;
