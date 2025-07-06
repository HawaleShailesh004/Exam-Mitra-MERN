import React, { useRef } from "react";
import html2pdf from "html2pdf.js";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import "../CSS/PdfStyles.css";

const markdownData = `
### Operating System Questions and Answers

---

#### 1. Compare **multiprogramming** and **multithreading** in operating systems.

**Answer:**

| Feature             | Multiprogramming                         | Multithreading                            |
|---------------------|-------------------------------------------|--------------------------------------------|
| Definition          | Multiple programs run on a single CPU     | Multiple threads within a process run concurrently |
| Resource Sharing    | Each process has its own memory & resources | Threads share memory & resources of the process |
| Overhead            | Higher, due to context switching between processes | Lower, since threads share resources        |
| Communication       | Inter-process communication needed         | Easier communication via shared memory      |
| Fault Isolation     | Better, one process crash doesn’t affect others | Poor, one thread crash may bring down the process |

---

#### 2. Define **deadlock** and explain the four necessary conditions for it.

**Answer:**

**Deadlock** is a condition where a group of processes are blocked because each process is holding a resource and waiting for another one that is being held by some other process in the group.

**Necessary conditions for deadlock:**
1. **Mutual Exclusion** – Only one process can use a resource at a time.
2. **Hold and Wait** – A process holding at least one resource is waiting to acquire additional resources held by other processes.
3. **No Preemption** – A resource cannot be forcibly taken from a process.
4. **Circular Wait** – A set of processes are waiting for each other in a circular chain.

---

#### 3. Write a C program to implement **First-Come, First-Served (FCFS)** scheduling algorithm.

**Answer:**

\`\`\`c
#include <stdio.h>

int main() {
    int n, i;
    printf("Enter number of processes: ");
    scanf("%d", &n);

    int bt[n], wt[n], tat[n];
    wt[0] = 0;

    printf("Enter burst times:\\n");
    for(i = 0; i < n; i++) {
        printf("P%d: ", i + 1);
        scanf("%d", &bt[i]);
    }

    for(i = 1; i < n; i++) {
        wt[i] = bt[i - 1] + wt[i - 1];
    }

    for(i = 0; i < n; i++) {
        tat[i] = bt[i] + wt[i];
    }

    printf("\\nProcess\\tBT\\tWT\\tTAT\\n");
    for(i = 0; i < n; i++) {
        printf("P%d\\t%d\\t%d\\t%d\\n", i+1, bt[i], wt[i], tat[i]);
    }

    return 0;
}
\`\`\`

---

#### 4. Explain the difference between **paging** and **segmentation** in memory management.

**Answer:**

| Feature         | Paging                               | Segmentation                            |
|-----------------|---------------------------------------|------------------------------------------|
| Memory Division | Fixed-size pages                     | Variable-size segments                   |
| View            | Physical memory management            | Logical division of programs             |
| Fragmentation   | Internal fragmentation                | External fragmentation                   |
| Addressing      | Page number + offset                  | Segment number + offset                  |
| Use Case        | Simpler to manage in hardware         | Matches programmer's logical structure   |

---

#### 5. What is **thrashing** in operating systems and how can it be prevented?

**Answer:**

**Thrashing** is a condition where the operating system spends the majority of its time swapping pages in and out of memory rather than executing processes, resulting in very low CPU utilization.

**Causes:**
- Too many processes in memory.
- Insufficient memory allocated per process.

**Prevention techniques:**
- Decrease the degree of multiprogramming.
- Use **local page replacement** policies.
- Apply **working set model** to track active pages of processes.
- Monitor and control **page-fault frequency**.
`;

export default function PDFExport() {
  const pdfRef = useRef();

  const handleExport = () => {
    const opt = {
      margin: 15,
      filename: "OS_Questions_Export.pdf",
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["avoid-all", "css", "legacy"] },
      callback: (pdf) => {
        const totalPages = pdf.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
          pdf.setPage(i);
          pdf.setFontSize(10);
          pdf.text(`Page ${i} of ${totalPages}`, 105, 287, { align: "center" });
        }
      },
    };
    html2pdf().set(opt).from(pdfRef.current).save();
  };

  return (
    <div>
      <button onClick={handleExport} className="download-btn">
        Download PDF
      </button>
      <div  className="pdf-wrapper">
        <div ref={pdfRef} className="pdf-markdown">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {markdownData}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
