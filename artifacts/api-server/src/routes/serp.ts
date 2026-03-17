import { Router } from "express";
import * as cheerio from "cheerio";

const router = Router();

interface SerpResult {
  position: number;
  title: string;
  url: string;
  displayUrl: string;
  snippet: string;
  isTarget: boolean;
}

const COUNTRIES: Record<string, string> = {
  za: "en-ZA,en;q=0.9",
  us: "en-US,en;q=0.9",
  gb: "en-GB,en;q=0.9",
  au: "en-AU,en;q=0.9",
  ca: "en-CA,en;q=0.9",
  ng: "en-NG,en;q=0.9",
};

router.post("/serp-check", async (req, res) => {
  const { domain, keyword, country = "za" } = req.body;

  if (!domain || !keyword) {
    return res.status(400).json({ error: "domain and keyword are required" });
  }

  const cleanDomain = domain
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split("/")[0]
    .toLowerCase()
    .trim();

  if (!cleanDomain) {
    return res.status(400).json({ error: "Invalid domain" });
  }

  const gl = String(country).toLowerCase().slice(0, 2);
  const acceptLang = COUNTRIES[gl] ?? COUNTRIES["za"];
  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(keyword)}&num=100&gl=${gl}&hl=en`;

  try {
    const response = await fetch(searchUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": acceptLang,
        "Accept-Encoding": "gzip, deflate, br",
        Referer: "https://www.google.com/",
        DNT: "1",
        "Cache-Control": "no-cache",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "same-origin",
      },
      redirect: "follow",
    });

    if (!response.ok) {
      return res.status(503).json({
        error: `Google returned ${response.status}. Try again shortly.`,
        blocked: true,
      });
    }

    const html = await response.text();

    if (
      html.includes("sorry/index?continue") ||
      html.includes("detected unusual traffic") ||
      html.includes("/recaptcha/")
    ) {
      return res.status(429).json({
        error:
          "Google has temporarily rate-limited this request. Please wait a moment and try again.",
        blocked: true,
      });
    }

    const $ = cheerio.load(html);
    const results: SerpResult[] = [];
    const seenUrls = new Set<string>();
    let position = 0;

    $("a[href]").each((_, el) => {
      if (results.length >= 100) return false;

      const href = $(el).attr("href") ?? "";
      let targetUrl = "";

      if (href.startsWith("/url?q=")) {
        targetUrl = new URLSearchParams(href.slice(5)).get("q") ?? "";
      } else if (href.match(/^https?:\/\//) && !href.includes("google.com")) {
        targetUrl = href;
      }

      if (!targetUrl || seenUrls.has(targetUrl)) return;

      if (
        targetUrl.includes("google.com/") ||
        targetUrl.includes("googleapis.com") ||
        targetUrl.includes("gstatic.com") ||
        targetUrl.startsWith("https://maps.google") ||
        targetUrl.startsWith("https://translate.google") ||
        targetUrl.startsWith("https://support.google") ||
        targetUrl.startsWith("https://accounts.google") ||
        targetUrl.startsWith("https://webcache.google")
      ) {
        return;
      }

      try {
        const urlObj = new URL(targetUrl);
        if (!["http:", "https:"].includes(urlObj.protocol)) return;

        seenUrls.add(targetUrl);
        position++;

        const linkEl = $(el);
        const h3 = linkEl.find("h3").first();
        const titleFromH3 = h3.text().trim();

        const container = linkEl.closest(
          "div.g, [data-hveid], [data-sokoban-container], li"
        );
        const snippet = container
          .find(
            ".VwiC3b, .st, .s3v9rd, [data-sncf='2'], .aCOpRe, .yDYNvb, .lEBKkf"
          )
          .first()
          .text()
          .trim();

        const displayUrl = urlObj.hostname.replace(/^www\./, "");
        const isTarget =
          displayUrl === cleanDomain ||
          displayUrl.endsWith(`.${cleanDomain}`) ||
          cleanDomain.endsWith(`.${displayUrl}`);

        results.push({
          position,
          title: titleFromH3 || displayUrl,
          url: targetUrl,
          displayUrl,
          snippet: snippet.slice(0, 200),
          isTarget,
        });
      } catch {
        // Invalid URL
      }
    });

    const targetResult = results.find((r) => r.isTarget);

    return res.json({
      domain: cleanDomain,
      keyword,
      country: gl,
      targetPosition: targetResult?.position ?? null,
      results: results.slice(0, 30),
      totalChecked: results.length,
      checkedAt: new Date().toISOString(),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return res.status(500).json({ error: `Failed to check SERP: ${msg}` });
  }
});

export default router;
