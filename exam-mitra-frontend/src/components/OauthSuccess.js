import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";
import API from "../utils/api";

import "../CSS/OauthSuccess.css";

const OauthSuccess = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();

  const redirectPath = localStorage.getItem("uploadSource") || "/";

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");

    if (token) {
      localStorage.setItem("token", token);

      // Set auth header temporarily (or API.js already does that globally)
      API.get("/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          setUser(res.data.user);
          navigate(redirectPath ? "/" + redirectPath : "/dashboard");
        })
        .catch((err) => {
          console.error("OAuth login failed", err);
          localStorage.removeItem("token");
          navigate("/login");
        });
    } else {
      navigate("/login");
    }
  }, []);

  return (
    <div className="login-loading">
      <div className="loader"></div>
      <p>Logging you in, please wait...</p>
    </div>
  );
};

export default OauthSuccess;
