import express from "express";
import axios from "axios";

const router = express.Router();

import dotenv from "dotenv";
dotenv.config();

// =======================
// 🧠 LLM Question Extraction
// =======================
async function getQuestionsFromText(extractedText) {
  const prompt = `Extract academic-style questions from the following academic texts. Each text corresponds to the same subject & same subject code. Return a JSON array where each item corresponds to one paper only. Merge all questions into a single array. For each question, include frequency (based on whole raw text).

Return ONLY a JSON array in this format:
[
  {
    "subject": "Subject Name (or null)",
    "paperCode": "Paper Code (or null)",
    "questions": [
      {
        "id": 1,
        "text": "What is AI?",
        "marks": 2,
        "frequency": 3,
        "status": false,
        "revision": false
      }
    ]
  }
]

Here is the academic content:\n${extractedText}`;

  const res = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
    }
  );

  const content = res.data.choices?.[0]?.message?.content || "";
  const start = content.indexOf("[");
  const end = content.lastIndexOf("]");

  if (start !== -1 && end !== -1) {
    const clean = content
      .slice(start, end + 1)
      .replace(/[\u0000-\u001F\u007F-\u009F\u200B\uFEFF]/g, "");
    return JSON.parse(clean);
  } else {
    throw new Error("LLM response invalid or JSON not found.");
  }
}

// =======================
// 📥 POST /extract-text (from plain merged OCR text)
// =======================
router.post("/extract-text", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== "string" || text.trim().length < 10) {
      return res.status(400).json({ error: "Invalid or empty text provided." });
    }

    const papers = await getQuestionsFromText(text);
    const allQuestions = papers.flatMap((p) => p.questions || []);

    return res.json({
      extractedText: text,
      questions: allQuestions,
      subjectDetails: {
        subject: papers[0]?.subject || "",
        paperCode: papers[0]?.paperCode || "",
      },
    });
  } catch (err) {
    console.error("❌ LLM Extraction failed:", err.message || err);
    return res.status(500).json({ error: err.message || "Unknown error" });
  }
});

// =======================
// 📥 POST /fetch-pdfs-from-urls (return base64 PDFs for frontend OCR)
// =======================
router.post("/fetch-pdfs-from-urls", async (req, res) => {
  const { urls } = req.body;

  if (!Array.isArray(urls) || urls.length === 0) {
    return res.status(400).json({ error: "No URLs provided." });
  }

  try {
    const pdfs = await Promise.all(
      urls.map(async (url) => {
        const response = await axios.get(url, { responseType: "arraybuffer" });
        const base64 = Buffer.from(response.data).toString("base64");
        return {
          filename: url.split("/").pop(),
          base64,
          mime: "application/pdf",
        };
      })
    );

    return res.json({ files: pdfs });
  } catch (err) {
    console.error("❌ PDF Fetching failed:", err.message || err);
    return res.status(500).json({ error: "Failed to fetch PDFs" });
  }
});

export default router;
