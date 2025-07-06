const puppeteer = require("puppeteer-core");

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", // Make sure this path is correct on your system
    args: ["--no-sandbox", "--disable-setuid-sandbox"], // Recommended for production
  });

  const page = await browser.newPage();

  await page.goto("https://muquestionpapers.com/be/information-technology/semester-6", {
    waitUntil: "networkidle0",
  });

  const papers = await page.$$eval("tr[data-index]", (rows) =>
    rows.slice(0, 5).map((row) => {
      const cells = row.querySelectorAll("td");
      const year = cells[0]?.innerText.trim();
      const month = cells[1]?.innerText.trim();
      const linkEl = cells[2]?.querySelector("a");
      const link = linkEl ? linkEl.href : null;

      return {
        title: `${month} ${year}`,
        url: link,
      };
    })
  );

  console.log("📄 First 5 Papers Found:\n");
  papers.forEach((paper, i) => {
    console.log(`${i + 1}. ${paper.title}`);
    console.log(`   🔗 ${paper.url}`);
  });

  await browser.close();
})();
