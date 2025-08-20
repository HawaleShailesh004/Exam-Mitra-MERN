import React, { forwardRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "../CSS/PdfStyles.css";

const PDFExportBlock = forwardRef(({ subjectName, questions }, ref) => {
  const qaContent = questions
    .map((q, i) => {
      let answerContent = "NA";

      try {
        const parsed = JSON.parse(q.answer);
        if (Array.isArray(parsed)) {
          answerContent = parsed
            .map((block) => {
              const label = "Answer";
              const value = block.value?.trim() || "";

              return `\n${value}`;
            })
            .join("\n\n---\n\n");
        } else {
          answerContent = q.answer;
        }
      } catch (err) {
        answerContent = "No valid answer found.";
      }

      return `#### Q${i + 1}. ${q.text}

 **Marks:** ${q.marks || "-"}  **Frequency:** ${q.frequency || "-"}

**Answer:**

${answerContent}

---`;
    })
    .join("\n\n");

  const fullMarkdown = `### ${subjectName} Questions and Answers

---

${qaContent}
`;

  return (
    <div ref={ref} className="pdf-wrapper">
      <div className="pdf-markdown">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {fullMarkdown}
        </ReactMarkdown>
      </div>
    </div>
  );
});

export default PDFExportBlock;
