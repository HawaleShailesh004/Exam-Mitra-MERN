import express from "express";
import axios from "axios";

const router = express.Router();

import dotenv from "dotenv";
dotenv.config();

// =======================
// 🧠 LLM Question Extraction
// =======================
async function getQuestionsFromText(extractedText) {
  const prompt = `You are given raw academic exam content. Your task is to extract academic-style exam questions from it.

Each question belongs to a **single subject** and **single paper code**. All extracted questions must be merged into a single JSON array under one subject and paper code. 

For each extracted question:
- Include the **text** of the question (remove duplicates).
- Include the **marks** assigned the **first time** the question appeared (do not multiply marks by frequency).
- Include **frequency**, i.e., how many times this exact question appears in the text.
- Set **status** and **revision** fields as **false** (default values).
- Number questions using a unique **id** starting from 1.

Return a **JSON array**. Each item represents a single paper:
- "subject" should be the subject name if available, or null.
- "paperCode" should be the paper code if available, or null.
- "questions" should be an array of extracted questions as described above.

⚠️ Output ONLY the JSON array. No commentary, no markdown, no code formatting.

Format example:
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

Here is the academic content:
${extractedText}`;

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
    console.log("Request for TExt Extraction")

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
