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

// DuckDuckGo Lite region codes
const DDG_REGIONS: Record<string, string> = {
  za: "za-en",
  us: "us-en",
  gb: "uk-en",
  au: "au-en",
  ca: "ca-en",
  ng: "wt-en",
};

const DDG_HEADERS = {
  "User-Agent":
    "Lynx/2.8.9rel.1 libwww-FM/2.14 SSL-MM/1.4.1 OpenSSL/1.1.1k",
  "Content-Type": "application/x-www-form-urlencoded",
  Accept: "text/html,application/xhtml+xml",
};

interface PageResult {
  href: string;
  title: string;
  snippet: string;
  displayUrl: string;
}

interface ParsedPage {
  results: PageResult[];
  nextFormParams: Record<string, string>;
}

function parseDDGLitePage(html: string): ParsedPage {
  const $ = cheerio.load(html);
  const results: PageResult[] = [];

  $("a.result-link").each((_, el) => {
    const href = $(el).attr("href") ?? "";
    if (!href || href.includes("duckduckgo.com")) return;

    const title = $(el).text().trim();
    const trTitle = $(el).closest("tr");
    const trSnippet = trTitle.next("tr");
    const trDisplay = trSnippet.next("tr");
    const snippet = trSnippet.find(".result-snippet").text().trim();
    const displayUrl = trDisplay.find(".link-text").text().trim();

    if (title && href.startsWith("http")) {
      results.push({ href, title, snippet, displayUrl });
    }
  });

  // Extract next-page form params (contains vqd token)
  const nextFormParams: Record<string, string> = {};
  $("form")
    .filter((_, f) => $(f).find("input[name=s]").length > 0)
    .first()
    .find("input[name]")
    .each((_, inp) => {
      const name = $(inp).attr("name");
      if (name) nextFormParams[name] = $(inp).attr("value") ?? "";
    });

  return { results, nextFormParams };
}

async function fetchSerpResults(
  keyword: string,
  region: string
): Promise<PageResult[]> {
  const allResults: PageResult[] = [];
  const seenUrls = new Set<string>();

  // Page 1 — initial POST
  const page1Body = new URLSearchParams({ q: keyword, kl: region });
  const r1 = await fetch("https://lite.duckduckgo.com/lite/", {
    method: "POST",
    headers: DDG_HEADERS,
    body: page1Body.toString(),
  });

  if (!r1.ok) throw new Error(`DDG returned ${r1.status}`);

  const html1 = await r1.text();
  const { results: res1, nextFormParams: np1 } = parseDDGLitePage(html1);

  for (const r of res1) {
    if (!seenUrls.has(r.href)) {
      seenUrls.add(r.href);
      allResults.push(r);
    }
  }

  if (!np1.vqd || allResults.length === 0) return allResults;

  // Small delay to be a good citizen
  await new Promise((r) => setTimeout(r, 300));

  // Page 2
  const page2Body = new URLSearchParams({
    q: keyword,
    kl: region,
    ...np1,
  });
  const r2 = await fetch("https://lite.duckduckgo.com/lite/", {
    method: "POST",
    headers: DDG_HEADERS,
    body: page2Body.toString(),
  });

  if (r2.ok) {
    const html2 = await r2.text();
    const { results: res2, nextFormParams: np2 } = parseDDGLitePage(html2);

    for (const r of res2) {
      if (!seenUrls.has(r.href)) {
        seenUrls.add(r.href);
        allResults.push(r);
      }
    }

    if (np2.vqd && allResults.length < 30) {
      await new Promise((r) => setTimeout(r, 300));

      // Page 3
      const page3Body = new URLSearchParams({
        q: keyword,
        kl: region,
        ...np2,
      });
      const r3 = await fetch("https://lite.duckduckgo.com/lite/", {
        method: "POST",
        headers: DDG_HEADERS,
        body: page3Body.toString(),
      });

      if (r3.ok) {
        const html3 = await r3.text();
        const { results: res3 } = parseDDGLitePage(html3);

        for (const r of res3) {
          if (!seenUrls.has(r.href)) {
            seenUrls.add(r.href);
            allResults.push(r);
          }
        }
      }
    }
  }

  return allResults;
}

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
  const region = DDG_REGIONS[gl] ?? DDG_REGIONS["za"];

  try {
    const rawResults = await fetchSerpResults(keyword, region);

    const results: SerpResult[] = rawResults
      .slice(0, 30)
      .map((raw, idx) => {
        let displayUrl: string;
        try {
          displayUrl = new URL(raw.href).hostname.replace(/^www\./, "");
        } catch {
          displayUrl = raw.displayUrl || raw.href;
        }

        const isTarget =
          displayUrl === cleanDomain ||
          displayUrl.endsWith(`.${cleanDomain}`) ||
          cleanDomain.endsWith(`.${displayUrl}`);

        return {
          position: idx + 1,
          title: raw.title,
          url: raw.href,
          displayUrl,
          snippet: raw.snippet.slice(0, 220),
          isTarget,
        };
      });

    const targetResult = results.find((r) => r.isTarget);

    return res.json({
      domain: cleanDomain,
      keyword,
      country: gl,
      engine: "duckduckgo",
      targetPosition: targetResult?.position ?? null,
      results,
      totalChecked: rawResults.length,
      checkedAt: new Date().toISOString(),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return res.status(500).json({ error: `Failed to check SERP: ${msg}` });
  }
});

export default router;
