import React, { useEffect } from "react";
import "../CSS/Toast.css";

const Toast = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(); // auto-close after 3 seconds
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return <div className="custom-toast">{message}</div>;
};

export default Toast;
