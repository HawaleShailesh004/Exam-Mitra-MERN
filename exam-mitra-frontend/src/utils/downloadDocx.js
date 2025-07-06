// ✅ Use the browser-safe version
import htmlDocx from "html-docx-js/dist/html-docx";

export function downloadAsDocx(htmlContent, fileName = "document.docx") {
  const blob = htmlDocx.asBlob(htmlContent);
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
