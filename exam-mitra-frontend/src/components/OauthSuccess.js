import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { account } from "../Database/appwriteConfig";
import { useUser } from "../context/userContext";

import Header from "./Header";
import Footer from "./Footer";

import "../CSS/OauthSuccess.css";

const OauthSuccess = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();

  useEffect(() => {
    const finishLogin = async () => {
      try {
        const user = await account.get();
        setUser(user);

        const redirectPath = localStorage.getItem("redirectAfterLogin") || "/";

        navigate("/dashboard");
      } catch (err) {
        console.error("OAuth login failed", err);
        navigate("/login");
      }
    };

    finishLogin();
  }, []);

  return (
    <>
      <div className="login-loading">
        <div class="loader"></div>
        <p>Logging you in, please wait...</p>
      </div>
    </>
  );
};

export default OauthSuccess;
