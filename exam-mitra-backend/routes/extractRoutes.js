import express from "express";

import { getPDFsFromUrls, getQuestionsFromAllPdfs } from "../controllers/extractController.js";


const router = express.Router();


router.post("/extract-text", getQuestionsFromAllPdfs);


// 📥 POST /fetch-pdfs-from-urls (return base64 PDFs for frontend OCR)
router.post("/fetch-pdfs-from-urls", getPDFsFromUrls);


export default router;
