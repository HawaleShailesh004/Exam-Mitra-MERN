import React from "react";
import "../CSS/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Section: Explore */}
        <div className="footer-column">
          <h4>Explore</h4>
          <a href="/">Home</a>
          <a href="/upload">Upload</a>
          <a href="/selection">Browse</a>
        </div>

        <div className="footer-divider-vertical"></div>

        {/* Section: Help */}
        <div className="footer-column">
          <h4>Help</h4>
          <a href="/faq">FAQs</a>
          <a href="/contact">Contact</a>
        </div>

      </div>

      <hr className="footer-divider" />
      <p className="footer-text">© 2025 ExamMitra. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
