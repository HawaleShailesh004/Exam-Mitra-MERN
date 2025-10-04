import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../CSS/loginSignup.css";
import { FcGoogle } from "react-icons/fc";
import API from "../utils/api";
import { useUser } from "../context/userContext";

const LoginSignup = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { setUser } = useUser();

  const redirectPath = localStorage.getItem("uploadSource") || "/";

  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const validateForm = () => {
    const errors = {};

    if (!isLogin && !name.trim()) {
      errors.name = "Full name is required";
    }

    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Enter a valid email address";
    }

    if (!password.trim()) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setLoading(true);
    try {
      let response;
      if (isLogin) {
        response = await API.post("/auth/login", { email, password });
      } else {
        response = await API.post("/auth/register", { name, email, password });
      }

      const { token, user } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);

      navigate("/" + redirectPath);

      // Reset form after successful submission
      setEmail("");
      setPassword("");
      setName(""); // if registering
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    window.location.href = `${process.env.REACT_APP_API_BASE_URL}/auth/google`;
  };

  return (
    <div className="login-container">
      <form onSubmit={handleEmailAuth} className="login-form animate-fade">
        <h2>{isLogin ? "Login" : "Sign Up"}</h2>

        {!isLogin && (
          <>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {validationErrors.name && (
              <p className="error-msg">{validationErrors.name}</p>
            )}
          </>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {validationErrors.email && (
          <p className="error-msg">{validationErrors.email}</p>
        )}

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {validationErrors.password && (
          <p className="error-msg">{validationErrors.password}</p>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Please wait..." : isLogin ? "Login" : "Sign Up"}
        </button>

        <button type="button" onClick={handleGoogleAuth} className="google-btn">
          <FcGoogle size={20} style={{ marginRight: "8px" }} />
          Continue with Google
        </button>

        {error && <p className="error-msg">{error}</p>}

        <p>
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span onClick={() => setIsLogin(!isLogin)} className="toggle-link">
            {isLogin ? "Sign Up" : "Login"}
          </span>
        </p>
        <a
          style={{
            color: "var(--color-text-primary)",
            WebkitTapHighlightColor: "transparent",
          }}
          href="/"
        >
          <p style={{ marginTop: "-1rem" }}>Skip for Now</p>
        </a>
      </form>
    </div>
  );
};
export default LoginSignup;
