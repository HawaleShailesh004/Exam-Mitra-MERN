import React, { useState } from "react";
import "../CSS/ContactPage.css";
import Header from "./Header";
import Footer from "./Footer";

const ContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/contact/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus("✅ Message sent successfully!");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus(`❌ Failed: ${data?.error || "Try again later."}`);
      }
    } catch (err) {
      console.error("Error:", err);
      setStatus("❌ Error sending message.");
    }
  };

  return (
    <>
      <Header />
      <div className="contact-container">
        <h2 className="contact-title">📬 Get in Touch</h2>
        <p className="contact-subtitle">Have a question, feedback, or idea? We’d love to hear from you!</p>

        <form onSubmit={handleSubmit} className="contact-form">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <textarea
            name="message"
            rows="5"
            placeholder="Your Message"
            value={form.message}
            onChange={handleChange}
            required
          />
          <button type="submit">Send Message</button>
        </form>

        {status && <p className="status-msg">{status}</p>}
      </div>
      <Footer />
    </>
  );
};

export default ContactPage;
