import React, { useState } from "react";
import "../CSS/Header.css";
import { Link, useNavigate } from "react-router-dom";
import { account } from "../Database/appwriteConfig";
import { useUser } from "../context/userContext";

const Header = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleLogout = async () => {
    await account.deleteSessions("current");
    localStorage.setItem("manualLogout", "true");
    setUser(null);
    navigate("/");
  };

  const toggleMenu = () => {
    if (menuOpen) {
      setIsClosing(true);
      setTimeout(() => {
        setMenuOpen(false);
        setIsClosing(false);
      }, 300); // match CSS animation duration
    } else {
      setMenuOpen(true);
    }
  };

  return (
    <nav className="navbar">
      <img src="/images/final logo.jpg" alt="Logo" className="logo" />

      {/* Hamburger Icon */}
      <div
        className={`hamburger ${menuOpen ? "hamburger-open" : ""}`}
        onClick={toggleMenu}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Slide Menu with animation class */}
      <div
        className={`nav-menu ${
          menuOpen ? (isClosing ? "closing" : "open") : ""
        }`}
      >
        <ul className="nav-links">
          <li onClick={toggleMenu}>
            <Link to="/">Home</Link>
          </li>
          <li onClick={toggleMenu}>
            <Link to="/upload">Upload</Link>
          </li>
          <li onClick={toggleMenu}>
            <Link to="/selection">Browse</Link>
          </li>
          {user && (
            <li onClick={toggleMenu}>
              <Link to="/dashboard">Dashboard</Link>
            </li>
          )}
        </ul>

        <div className="nav-buttons">
          {user ? (
            <>
              <span className="username">👤 {user.name.split(" ")[0]}</span>
              <button className="btn-secondary" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                className="btn-secondary"
                onClick={() => {
                  navigate("/login");
                  toggleMenu();
                }}
              >
                Login
              </button>
              <button
                className="btn-primary"
                onClick={() => {
                  navigate("/login");
                  toggleMenu();
                }}
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
