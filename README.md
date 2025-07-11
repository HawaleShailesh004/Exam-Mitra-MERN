# 📘 ExamMitra – Your Smart Exam Companion

> AI-powered MERN stack platform to extract, organize, and revise exam questions – built for students who want to study smarter, not harder.

![ExamMitra Banner](/screenshots/banner.png)

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
![React](https://img.shields.io/badge/Frontend-React.js-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb)
![Status](https://img.shields.io/badge/Status-Active-brightgreen)
---

## 📚 Table of Contents

- [Live Demo](#-live-demo)
- [Demo Video](#-demo-video)
- [Features](#-features)
- [Screenshots](#-screenshots)
- [Tech Stack](#-tech-stack)
- [Folder Structure](#-folder-structure)
- [Installation & Setup](#-installation--setup)
- [Environment Variables](#-environment-variables)
- [Why I Built This](#-why-i-built-this)
- [To-Do / Roadmap](#-to-do--roadmap)
- [Author](#-author)
- [License](#-license)

---

## 🔗 Live Demo  
🌐 https://exammitra-h.vercel.app/

---

## 🎥 Demo Video  
🎬 [Watch Full Demo Video](https://youtu.be/BAvnYzU2WVs)

---

## ✨ Features

### 📄 PDF Upload & Question Extraction
- Upload scanned or typed PDF question papers  
- Extract questions using **OCR (Puter.ai)** + **LLaMA 70B (via Groq API)**  
- Edit extracted questions and assign marks  

### 🧠 Smart Question Management
- Tag questions with **subject** & **paper info**  
- Mark questions as **Done**, **Revision**, or **Pending**  
- Sort and filter questions by **marks**, **frequency**, and more  
- Edit or delete saved question papers  

### 📝 AI-Powered Assistance
- Generate **answers in various ways** using LLM  
- Get additional **web insights** for deeper understanding  

### 📊 Progress Tracking & Organization
- Access personalized **dashboard** to track subjects and questions  
- View and manage all saved papers easily  

### 🔐 Authentication & Security
- Login via **Google OAuth** using Passport.js  
- Secure backend with JWT-based authentication  

### 🧾 Export & Sharing
- Export filtered questions and answers to **PDF**  
- Send messages via integrated **contact form** (Nodemailer)

### 🌐 Web Scraping Integration
- Scrape university papers directly from **MUQuestionPapers.com**  

### 📚 Support & Help
- FAQ section to address common questions  
- Clean and intuitive UI with screenshot-guided interactions  

## 🖼️ Screenshots

## 🖼️ Screenshots

| Landing Page | Login Page |
|--------------|----------------|
| ![Landing](./screenshots/landing_page.png) | ![Login](./screenshots/login.png) |

| Upload PDF | Select Option |
|-------------|------------------|
| ![Upload](./screenshots/upload_pdf.png) | ![Select](./screenshots/select_option.png) |

| Question Listing | Answer Page |
|--------------|-----------|
| ![Questions](./screenshots/qs_listing.png) | ![Answer](./screenshots/answer.png)  |

| Browse Papers | Dashboard |
|----------------|-------------|
| ![Browse](./screenshots/browse_papers.png) | ![Dashboard](./screenshots/dashboard.png) |



---


## 🧱 Tech Stack

### Frontend
- React.js
- CSS  
- Axios, React Router

### Backend
- Node.js + Express.js  
- MongoDB + Mongoose  
- Passport.js (Google OAuth)  
- Multer (PDF Uploads)  
- Puppeteer (Web Scraping)  
- Nodemailer (Email Support)

### AI & Tools
- OCR: [Puter.ai](https://www.puter.ai/)  
- LLM: [LLaMA 70B via Groq API](https://groq.com/)  
- Deployment: Vercel (Frontend), Railway (Backend), MongoDB Atlas (DB)

---

#### Now that you know what ExamMitra can do, here's how the codebase is organized:


## 📁 Folder Structure

```
exammitra/
├── exam-mitra-frontend/              # React frontend
├── exam-mitra-backend/              # Express backend
│   ├── routes/               
│   ├── models/          
│   └── utils/           
├── screenshots/         # App screenshots for README/docs
└── README.md
```

---

## ⚙️ Installation & Setup

1. Clone the repository  
```bash
git clone https://github.com/HawaleShailesh004/Exam-Mitra-MERN.git
```

2. Navigate into folders and install dependencies  
```bash
cd exam-mitra-frontend && npm install
cd ../exam-mitra-backend && npm install
```

3. Add required environment variables (see below)

4. Start the backend and frontend servers  
```bash
# In exam-mitra-backend
npm start   # Starts backend on http://localhost:5000 (or your configured port)

# In exam-mitra-frontend
npm run dev   # Starts frontend on http://localhost:3000 

```

---

## 🔐 Environment Variables
### 📦 Frontend (exam-mitra-frontend/.env.example)
```env
REACT_APP_GROQ_API_KEY=your_groq_api_key
REACT_APP_TAVILY_KEY=your_tavily_api_key
REACT_APP_API_BASE_URL=https://your-backend-url.com
```

### 📦 Backend (exam-mitra-backend/.env.example)
```env
# Database
MONGO_URI=your_mongodb_uri

# JWT Auth
JWT_SECRET=your_jwt_secret_key

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CLIENT_URL=https://your-frontend-url.com

# Groq AI
GROQ_API_KEY=your_groq_api_key

# Contact Email (for Nodemailer)
CONTACT_EMAIL=your_email@gmail.com
CONTACT_PASS=your_email_app_password

```

---

## 🧠 Why I Built This

As a student and developer, I saw how difficult and fragmented exam prep can be — from collecting PDFs to finding repeated questions and writing answers manually.  
**ExamMitra** combines OCR, LLMs, and smart tracking to streamline the entire prep process in one platform.

---



## ✅ To-Do / Roadmap
 
- Improve analytics with graphs & score tracking  
- Add bookmarking + topic-level filtering  
- Enable multi-university scraping  
- Add gamified revision scoring system  

---

## 👨‍💻 Author

**Shailesh Hawale**  
🔗 [LinkedIn](https://www.linkedin.com/in/shailesh-hawale)  
💻 [GitHub](https://github.com/HawaleShailesh004)   

> Open to feedback, collaboration & new opportunities!

---

## 📄 License

This project is open source under the [MIT License](LICENSE).
