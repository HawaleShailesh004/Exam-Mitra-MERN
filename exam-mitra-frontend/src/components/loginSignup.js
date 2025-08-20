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

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError("");
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
          <input
            type="text"
            placeholder="Full Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}

        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

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
