import { Router } from "express";
import * as cheerio from "cheerio";
import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);
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

// Use curl instead of Node's fetch — curl (libcurl) bypasses DDG's TLS fingerprint block.
// DDG Lite returns results when no User-Agent is sent (empty string).
async function curlPost(url: string, body: string): Promise<string> {
  const { stdout } = await execFileAsync("curl", [
    "-s",
    "--max-time", "15",
    "-X", "POST",
    url,
    "-A", "",
    "-H", "Content-Type: application/x-www-form-urlencoded",
    "--data-raw", body,
    "-L",
  ]);
  return stdout;
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
  region: string,
  maxResults = 50
): Promise<PageResult[]> {
  const allResults: PageResult[] = [];
  const seenUrls = new Set<string>();

  // Page 1 — initial POST
  const firstBody = `q=${encodeURIComponent(keyword)}&kl=${region}`;
  const html1 = await curlPost("https://lite.duckduckgo.com/lite/", firstBody);

  if (!html1 || html1.length < 100) {
    throw new Error("DDG returned empty response");
  }

  const { results: res1, nextFormParams } = parseDDGLitePage(html1);

  for (const r of res1) {
    if (!seenUrls.has(r.href)) {
      seenUrls.add(r.href);
      allResults.push(r);
    }
  }

  if (!nextFormParams.vqd || allResults.length === 0) return allResults;

  // Pages 2–5 — chain using vqd token from each previous page's form
  let currentParams = nextFormParams;
  const maxPages = 5;

  for (let page = 2; page <= maxPages; page++) {
    if (allResults.length >= maxResults || !currentParams.vqd) break;

    await new Promise((r) => setTimeout(r, 400));

    const params = new URLSearchParams({ q: keyword, kl: region, ...currentParams });
    const html = await curlPost("https://lite.duckduckgo.com/lite/", params.toString());

    if (!html || html.length < 100) break;

    const { results: pageResults, nextFormParams: nextParams } = parseDDGLitePage(html);

    if (pageResults.length === 0) break;

    for (const r of pageResults) {
      if (!seenUrls.has(r.href)) {
        seenUrls.add(r.href);
        allResults.push(r);
      }
    }

    currentParams = nextParams;
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
      .slice(0, 50)
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
