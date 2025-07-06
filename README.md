# EXAMMITRA

A smart AI-powered companion to help students ace their exams by providing intelligent question extraction, AI-generated answers in multiple formats, and comprehensive progress tracking — all in one seamless platform.

---

## 🔗 Live Demo  
https://exammitra-h.vercel.app/

## Table of Contents

- [About](#about)  
- [Features](#features)  
- [Tech Stack & Architecture](#tech-stack--architecture)  
- [Installation & Setup](#installation--setup)  
- [Usage](#usage)  
- [Agentic AI Components](#agentic-ai-components)  
- [Sponsor Technologies](#sponsor-technologies)  
- [Limitations](#limitations)  
- [Future Roadmap](#future-roadmap)  
- [License](#license)  

---

## About

EXAMMITRA leverages AI to transform how students prepare for exams. By combining OCR, LLM-powered question answering, and progress tracking, it empowers learners to efficiently study previous year question papers and improve their understanding through customized answer formats.

This project was built as a submission for the **100 Agents Hackathon 2025**, pushing the boundaries of agentic AI frameworks in education technology.

---

## Features

- Upload or scrape previous year question papers (PDFs) with OCR text extraction.  
- Automatic question identification and frequency analysis.  
- Generate AI-driven answers in multiple styles (summary, step-by-step, examples, etc.).  
- Save and track answer progress (done, revision needed).  
- User authentication with Appwrite (email/password and Google OAuth).  
- Dashboard showing preparation stats, subjects, and revision needs.  
- Clean, modern UI with smooth animations and accessibility considerations.  
- Backend powered by Express.js and Appwrite functions for OCR and scraping.  

---

## Tech Stack & Architecture

- **Frontend:** React.js, React Router, React Markdown, CSS modules, Puter.ai for client-side OCR  
- **Backend:** Node.js with Express.js, Puppeteer for web scraping  
- **Database & Auth:** Appwrite Cloud (Databases, Auth, Storage)  
- **OCR & Scraping:** OCR performed on client-side using Puter.ai; web scraping done on backend using Puppeteer  
- **AI Integration:** Groq API for LLM-powered answer generation, Tavily AI integrated for generating web insights related to questions on the answer page  
- **Deployment:** Planned with Appwrite Cloud deployments (frontend + backend)  

## Architecture Overview

1. User uploads question papers or browses available papers.
2. Frontend extracts text and questions using Backend Puppeteer-based scraping.
3. Frontend displays extracted questions for the user.
4. Users generate AI-powered answers via Groq API and view web insights using Tavily AI.
5. Users track their progress with features like done/revision status.
6. All data (questions, answers, user info, progress) is stored securely in Appwrite Cloud.
7. Dashboard provides a summarized view of user preparation and progress.

---

## Installation & Setup

1. Clone the repository:  
```bash
   git clone https://github.com/HawaleShailesh004/EXAMMITRA---H.git
```


2. Navigate to the frontend and backend folders:

```bash
cd exam-mitra-frontend
npm install
cd ../exam-mitra-backend
npm install
```

3. Setup environment variables (.env) for API keys and Appwrite credentials in both frontend and backend as needed. (No direct user input for API keys required)

4. Run the backend server:

```bash
npm run start
```

5. Run the frontend development server:

```bash
npm start
```

## Usage

- Register or login with email or Google OAuth.  
- Upload PDFs of question papers or browse & select question papers.  
- Extract questions and view AI-generated answers in various formats. 
- Generate Web insights for questions 
- Mark questions as done or revision needed and track progress.  
- Navigate dashboard for quick overview of preparation status.  

## Agentic AI Components

EXAMMITRA leverages autonomous AI-driven features to enhance exam preparation by extracting relevant questions from unstructured PDF papers, generating tailored answers using large language models (LLMs), and providing intelligent tracking of study progress. This creates a semi-autonomous assistant that helps users focus on important topics and efficiently revise their syllabus.

## Sponsor Technologies

- **Appwrite Cloud:** Core backend platform providing databases, authentication, and storage.  
- **Tavily AI:** Integrated to enrich answers with contextual web insights related to questions on the answer page.

*Note: Although the hackathon sponsors include Keywords AI, Mem0, and Superdev.build, EXAMMITRA currently integrates only Appwrite Cloud and Tavily AI.*

## Limitations

- The current version is **not fully mobile responsive**. Mobile UI improvements are planned for future releases.  
- Some OCR and scraping results may vary in accuracy depending on PDF quality.  
- AI-generated answers depend on the quality and availability of LLM services.  

## Future Roadmap

- Enhance mobile responsiveness and accessibility.  
- Integrate additional AI copilots and agents for improved answer generation.  
- Expand scraping capabilities with Tavily Crawl API for more diverse papers.  
- Implement advanced progress analytics and gamification features.  
- Open source release with community contributions and extended documentation.  

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Thank you for exploring EXAMMITRA!  
Questions? Suggestions? Feel free to open an issue or pull request.

*This project is submitted for the 100 Agents Hackathon 2025.*

