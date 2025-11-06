import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

export default async function handler(req, res) {
  try {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: "Brak URL" });

    // Uruchomienie Puppeteer z Chromium
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

    // Czekamy na pełne załadowanie strony
    await page.waitForSelector("body", { timeout: 10000 });

    // Pobieranie danych produktu
    const data = await page.evaluate(() => {
      const title =
        document.querySelector("h1")?.innerText ||
        document.title ||
        "Brak tytułu";

      const price =
        document.querySelector(".price, .item-price")?.innerText ||
        document.querySelector('[class*="price"]')?.innerText ||
        "Brak ceny";

      const image =
        document.querySelector("img")?.src ||
        document.querySelector('meta[property="og:image"]')?.content ||
        "Brak zdjęcia";

      return { title, price, image };
    });

    // Dodaj Twój kod afiliacyjny
    const finalLink = url.includes("affcode=")
      ? url
      : url + (url.includes("?") ? "&" : "?") + "affcode=dexxter";

    await browser.close();
    return res.status(200).json({ ...data, finalLink });
  } catch (err) {
    console.error("❌ Błąd:", err);
    return res.status(500).json({ error: err.message });
  }
}



