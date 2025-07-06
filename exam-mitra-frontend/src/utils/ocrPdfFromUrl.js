// ocrPdfFromUrl.js

// Helper to convert base64 to Blob
export function base64ToBlob(base64, mime = "application/pdf") {
  const byteChars = atob(base64);
  const byteNumbers = new Array(byteChars.length);
  for (let i = 0; i < byteChars.length; i++) {
    byteNumbers[i] = byteChars.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mime });
}

// Render PDF as images and do OCR using puter.ai
export async function extractTextFromPdfUrlUsingOCR(url, setProgress) {
  setProgress?.("📦 Fetching PDF from backend...");
  const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/fetch-pdfs-from-urls`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ urls: [url] }),
  });

  const data = await response.json();
  if (!data?.files?.length) throw new Error("Failed to fetch PDF file");

  const { base64, filename } = data.files[0];
  const blob = base64ToBlob(base64);
  const file = new File([blob], filename, { type: "application/pdf" });

  setProgress?.(`📄 Rendering PDF for OCR...`);

  // Now call your existing OCR method from Upload.js
  const { extractTextFromPDF } = await import("./pdfOcrWithPuter"); // separate file
  const text = await extractTextFromPDF(file, setProgress);

  return text;
}
