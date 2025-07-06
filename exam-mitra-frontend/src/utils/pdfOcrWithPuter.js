// pdfOcrWithPuter.js
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import "pdfjs-dist/build/pdf.worker.entry";

export async function extractTextFromPDF(file, setProgress) {
  const pdfData = new Uint8Array(await file.arrayBuffer());
  const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;

  const extractedTexts = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    setProgress?.(`🖼️ Rendering Page ${pageNum}/${pdf.numPages}...`);

    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: 2.0 });

    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const context = canvas.getContext("2d");
    await page.render({ canvasContext: context, viewport }).promise;

    setProgress?.(`🔍 OCR Page ${pageNum}...`);

    const dataUrl = canvas.toDataURL("image/png");
    const ocrText = await window.puter.ai.img2txt(dataUrl);
    extractedTexts.push(ocrText);
  }

  setProgress?.(`✅ OCR completed for ${file.name}`);
  return extractedTexts.join("\n\n");
}
