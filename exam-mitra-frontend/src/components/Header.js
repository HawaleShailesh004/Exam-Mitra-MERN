import React, { useState } from "react";
import "../CSS/Header.css";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";

const Header = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    closeMenuAndRedirect("/");
  };

  const toggleMenu = () => {
    if (menuOpen) {
      setIsClosing(true);
      setTimeout(() => {
        setMenuOpen(false);
        setIsClosing(false);
      }, 300);
    } else {
      setMenuOpen(true);
    }
  };

  const closeMenuAndRedirect = (path) => {
    setIsClosing(true);
    setTimeout(() => {
      setMenuOpen(false);
      setIsClosing(false);
      navigate(path);
    }, 300);
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

      {/* Slide Menu */}
      <div
        className={`nav-menu ${
          menuOpen ? (isClosing ? "closing" : "open") : ""
        }`}
      >
        <ul className="nav-links">
          <li onClick={() => closeMenuAndRedirect("/")}>
            <Link to="/">Home</Link>
          </li>
          <li onClick={() => closeMenuAndRedirect("/upload")}>
            <Link to="/upload">Upload</Link>
          </li>
          <li onClick={() => closeMenuAndRedirect("/selection")}>
            <Link to="/selection">Browse</Link>
          </li>
          {user && (
            <li onClick={() => closeMenuAndRedirect("/dashboard")}>
              <Link to="/dashboard">Dashboard</Link>
            </li>
          )}
        </ul>

        <div className="nav-buttons">
          {user ? (
            <>
              <span className="username">
                👤 {user?.name?.split(" ")[0] || "User"}
              </span>
              <button className="btn-secondary" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                className="btn-secondary"
                onClick={() => closeMenuAndRedirect("/login")}
              >
                Login
              </button>
              <button
                className="btn-primary"
                onClick={() => closeMenuAndRedirect("/login")}
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
