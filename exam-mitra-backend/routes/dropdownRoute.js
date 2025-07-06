import express from "express";
import puppeteer from "puppeteer";

const router = express.Router();

// 🧠 Get all papers for a subject
router.get("/dropdowns/papers", async (req, res) => {
  const { branch, semester, subject } = req.query;

  if (!branch || !semester || !subject) {
    return res.status(400).json({ error: "Missing branch, semester, or subject" });
  }

  const kebabBranch = branch.toLowerCase().replace(/\s+/g, "-");
  const url = `https://muquestionpapers.com/be/${kebabBranch}/semester-${semester}`;
  console.log(`📄 Navigating to: ${url}`);

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded" });

    const normalizedInputSubject = subject
      .toLowerCase()
      .replace(/\(.*?\)/g, "")
      .replace(/-/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const papers = await page.evaluate((normalizedInputSubject) => {
      const allRows = Array.from(document.querySelectorAll("table#table tr"));
      const results = [];
      let capture = false;

      for (let row of allRows) {
        const th = row.querySelector("th.thstyle center.responsivecolspan");
        if (th) {
          const rawTitle = th.innerText
            .toLowerCase()
            .replace(/\(.*?\)/g, "")
            .replace(/-/g, " ")
            .replace(/\s+/g, " ")
            .trim();
          capture = rawTitle === normalizedInputSubject;
          continue;
        }

        if (!capture) continue;

        const cells = row.querySelectorAll("td");
        if (cells.length !== 3) continue;

        const year = cells[0].innerText.trim();
        const month = cells[1].innerText.trim();
        const linkEl = cells[2].querySelector("a");
        const url = linkEl?.href;

        if (url) {
          results.push({
            title: `${month} ${year}`,
            subject: normalizedInputSubject,
            url,
          });
        }
      }

      return results;
    }, normalizedInputSubject);

    await browser.close();

    if (!papers.length) {
      return res.status(404).json({ error: "No papers found for this subject." });
    }

    return res.json({ papers });
  } catch (err) {
    console.error("❌ Puppeteer Error:", err.message);
    return res.status(500).json({ error: "Failed to fetch papers." });
  }
});

// 🔥 Get all subjects for a branch & semester
router.get("/dropdowns/subjects", async (req, res) => {
  const { branch, semester } = req.query;

  if (!branch || !semester) {
    return res.status(400).json({ error: "Branch and semester are required." });
  }

  const kebabBranch = branch.toLowerCase().replace(/\s+/g, "-");
  const url = `https://muquestionpapers.com/be/${kebabBranch}/semester-${semester}`;
  console.log(`📚 Getting subjects from: ${url}`);

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded" });

    const subjects = await page.$$eval(
      "th.thstyle center.responsivecolspan",
      (centers) =>
        centers.map((el) => {
          const raw = el.innerText.trim();
          const cleaned = raw
            .replace(/\(.*?\)/g, "")
            .replace(/-/g, " ")
            .replace(/\s+/g, " ")
            .trim();

          const titleCased = cleaned
            .toLowerCase()
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");

          return { title: titleCased };
        })
    );

    await browser.close();
    return res.json({ subjects });
  } catch (err) {
    console.error("❌ Error scraping subjects:", err.message);
    return res.status(500).json({ error: "Failed to fetch subjects." });
  }
});

export default router;
