import { Router, type IRouter } from "express";
import * as cheerio from "cheerio";
import * as whoisLib from "whois";

const router: IRouter = Router();

// ── Static DR lookup for well-known domains ───────────────────────────────────
// Values are industry-standard approximations based on publicly available Ahrefs/Moz data
const KNOWN_DR: Record<string, { dr: number; label: string }> = {
  // Global high-authority
  "google.com":             { dr: 100, label: "Google" },
  "maps.google.com":        { dr: 100, label: "Google Maps" },
  "business.google.com":    { dr: 100, label: "Google Business" },
  "wikipedia.org":          { dr: 100, label: "Wikipedia" },
  "trustpilot.com":         { dr: 91,  label: "Trustpilot" },
  "g2.com":                 { dr: 89,  label: "G2" },
  "capterra.com":           { dr: 87,  label: "Capterra" },
  "builtwith.com":          { dr: 74,  label: "BuiltWith" },
  "clutch.co":              { dr: 79,  label: "Clutch" },
  "domaintools.com":        { dr: 73,  label: "DomainTools" },
  "whois.domaintools.com":  { dr: 73,  label: "DomainTools WHOIS" },
  "goodfirms.co":           { dr: 72,  label: "GoodFirms" },
  "kompass.com":            { dr: 68,  label: "Kompass" },
  "web.archive.org":        { dr: 95,  label: "Wayback Machine" },
  "similarweb.com":         { dr: 82,  label: "SimilarWeb" },
  "semrush.com":            { dr: 84,  label: "SEMrush" },
  "designrush.com":         { dr: 61,  label: "DesignRush" },
  "upcity.com":             { dr: 56,  label: "UpCity" },
  "expertise.com":          { dr: 60,  label: "Expertise" },
  "sortlist.co.za":         { dr: 58,  label: "Sortlist SA" },
  "gumtree.co.za":          { dr: 62,  label: "Gumtree SA" },
  "itweb.co.za":            { dr: 54,  label: "ITWeb SA" },
  "memeburn.com":           { dr: 51,  label: "Memeburn" },
  "techcentral.co.za":      { dr: 50,  label: "TechCentral SA" },
  "brownbook.net":          { dr: 47,  label: "Brownbook" },
  "sacompanies.co.za":      { dr: 44,  label: "SA Companies" },
  "hotfrog.co.za":          { dr: 38,  label: "Hotfrog SA" },
  "brabys.com":             { dr: 36,  label: "Brabys" },
  "infoisinfo.co.za":       { dr: 32,  label: "InfoIsInfo SA" },
  "businessdirectory.co.za":{ dr: 28,  label: "SA Business Dir" },
};

// Estimate DR for unknown domains based on TLD and structure
function estimateDR(domain: string): number {
  if (domain.endsWith(".gov.za") || domain.endsWith(".edu.za") || domain.endsWith(".ac.za")) return 55;
  if (domain.endsWith(".co.za") || domain.endsWith(".org.za")) return 22;
  if (domain.endsWith(".io") || domain.endsWith(".co")) return 35;
  if (domain.endsWith(".org")) return 40;
  if (domain.endsWith(".com")) return 30;
  return 18;
}

interface BacklinkResult {
  domain: string;
  dr: number;
  label: string;
  checkUrl: string;
  verified: boolean;
  note?: string;
}

// ── Candidate reference pages — each URL is a real page that may mention the target
// These span review platforms, agency listing sites, press archives & directories
type CandidatePage = {
  domain: string;
  pageUrl: (t: string) => string;
};

const REFERENCE_CANDIDATES: CandidatePage[] = [
  // Review & rating platforms
  { domain: "trustpilot.com",        pageUrl: t => `https://www.trustpilot.com/search?query=${encodeURIComponent(t)}` },
  { domain: "g2.com",                pageUrl: t => `https://www.g2.com/search?query=${encodeURIComponent(t)}` },
  { domain: "capterra.com",          pageUrl: t => `https://www.capterra.com/search/#q=${encodeURIComponent(t)}` },
  // Agency listing / award sites
  { domain: "clutch.co",             pageUrl: t => `https://clutch.co/agencies/digital-marketing/south-africa` },
  { domain: "goodfirms.co",          pageUrl: t => `https://www.goodfirms.co/seo-agencies/south-africa` },
  { domain: "sortlist.co.za",        pageUrl: t => `https://www.sortlist.co.za/seo-agencies` },
  { domain: "designrush.com",        pageUrl: t => `https://www.designrush.com/agency/list/seo/south-africa` },
  { domain: "upcity.com",            pageUrl: t => `https://upcity.com/profiles/${encodeURIComponent(t)}` },
  // Business data & tech registries
  { domain: "builtwith.com",         pageUrl: t => `https://builtwith.com/${encodeURIComponent(t)}` },
  { domain: "similarweb.com",        pageUrl: t => `https://www.similarweb.com/website/${encodeURIComponent(t)}/` },
  { domain: "semrush.com",           pageUrl: t => `https://www.semrush.com/website/${encodeURIComponent(t)}/overview/` },
  { domain: "whois.domaintools.com", pageUrl: t => `https://whois.domaintools.com/${encodeURIComponent(t)}` },
  { domain: "dnsdumpster.com",       pageUrl: t => `https://dnsdumpster.com` },
  // SA-focused directories & business databases
  { domain: "brownbook.net",         pageUrl: t => `https://www.brownbook.net/businesses/?search=${encodeURIComponent(t)}&near=South+Africa` },
  { domain: "hotfrog.co.za",         pageUrl: t => `https://www.hotfrog.co.za/search/page/1/${encodeURIComponent(t)}` },
  { domain: "brabys.com",            pageUrl: t => `https://www.brabys.com/search.asp?Search=${encodeURIComponent(t)}` },
  { domain: "kompass.com",           pageUrl: t => `https://za.kompass.com/en/s/?q=${encodeURIComponent(t)}` },
  { domain: "infoisinfo.co.za",      pageUrl: t => `https://za.infoisinfo.com/search/${encodeURIComponent(t)}` },
  // Press / news archives
  { domain: "sacompanies.co.za",     pageUrl: t => `https://www.sacompanies.co.za/search/?q=${encodeURIComponent(t)}` },
  { domain: "techcentral.co.za",     pageUrl: t => `https://techcentral.co.za/?s=${encodeURIComponent(t)}` },
  { domain: "memeburn.com",          pageUrl: t => `https://memeburn.com/?s=${encodeURIComponent(t)}` },
  { domain: "itweb.co.za",           pageUrl: t => `https://www.itweb.co.za/search?query=${encodeURIComponent(t)}` },
  // Web archive
  { domain: "web.archive.org",       pageUrl: t => `https://web.archive.org/web/*/${encodeURIComponent(t)}` },
];

async function discoverBacklinks(targetDomain: string, targetUrl: string): Promise<BacklinkResult[]> {
  const hostname = new URL(targetUrl).hostname.replace(/^www\./, "");
  const variants = [hostname, `www.${hostname}`];
  const ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";

  const checks = await Promise.allSettled(
    REFERENCE_CANDIDATES.map(async (cand) => {
      const url = cand.pageUrl(hostname);
      try {
        const res = await fetch(url, {
          signal: AbortSignal.timeout(8000),
          headers: {
            "User-Agent": ua,
            "Accept": "text/html,application/xhtml+xml",
            "Accept-Language": "en-US,en;q=0.9",
          },
        });
        if (!res.ok) return null;
        const html = await res.text();
        const $ = cheerio.load(html);

        // A real backlink means the page contains an <a href> pointing to the target domain.
        // This rejects search-result pages that merely echo the query string.
        const linkedDirectly =
          $(`a[href*="${hostname}"]`).length > 0 ||
          variants.some(v =>
            html.includes(`href="https://${v}`) ||
            html.includes(`href='https://${v}`) ||
            html.includes(`href="http://${v}`) ||
            html.includes(`href='http://${v}`)
          );

        if (!linkedDirectly) return null;

        const known = KNOWN_DR[cand.domain];
        const dr    = known ? known.dr : estimateDR(cand.domain);
        const label = known
          ? known.label
          : cand.domain.replace(/\.(co\.za|com|org|net|io|co|za)$/, "").replace(/[-_.]/g, " ").replace(/\b\w/g, c => c.toUpperCase());
        return { domain: cand.domain, dr, label, checkUrl: url, verified: true } as BacklinkResult;
      } catch {
        return null;
      }
    })
  );

  return checks
    .filter(r => r.status === "fulfilled" && r.value !== null)
    .map(r => (r as PromiseFulfilledResult<BacklinkResult>).value)
    .sort((a, b) => b.dr - a.dr)
    .slice(0, 10);
}

type CheckStatus = "pass" | "warn" | "fail";

interface AuditCheck {
  name: string;
  status: CheckStatus;
  value: string;
  description: string;
}

interface AuditSection {
  title: string;
  score: number;
  checks: AuditCheck[];
}

// ── Common English + SA stop words to exclude from keyword extraction ──────────
const STOP_WORDS = new Set([
  "a","an","the","and","or","but","in","on","at","to","for","of","with","by",
  "from","up","about","into","through","during","is","are","was","were","be",
  "been","being","have","has","had","do","does","did","will","would","could",
  "should","may","might","shall","can","need","that","this","these","those",
  "it","its","i","you","he","she","we","they","them","their","our","your",
  "my","his","her","us","what","which","who","how","when","where","why",
  "all","any","both","each","few","more","most","other","some","such",
  "no","not","only","same","so","than","too","very","just","as","if",
  "then","there","here","s","re","ve","ll","t","d","www","http","https",
  "com","co","za","org","net","io","get","use","also","new","one","two",
  "free","amp","click","home","page","read","see","go","contact","services",
  "service","our","we","you","your","get","now","today","learn","more",
]);

interface KeywordEntry {
  keyword: string;
  source: string;
  count: number;
}

function extractPageKeywords($: ReturnType<typeof import("cheerio").load>): KeywordEntry[] {
  const entries: { text: string; source: string; weight: number }[] = [];

  const addText = (text: string, source: string, weight: number) => {
    if (text?.trim()) entries.push({ text: text.trim(), source, weight });
  };

  addText($("title").first().text(), "Title", 10);
  addText($('meta[name="description"]').attr("content") ?? "", "Meta Description", 7);
  addText($('meta[name="keywords"]').attr("content") ?? "", "Meta Keywords", 8);
  $("h1").each((_, el) => addText($(el).text(), "H1", 9));
  $("h2").each((_, el) => addText($(el).text(), "H2", 7));
  $("h3").each((_, el) => addText($(el).text(), "H3", 5));

  // Body text: paragraphs, list items, spans — up to 5 000 chars to keep things fast
  const bodyParts: string[] = [];
  $("p, li, td, span[class], div[class]").each((_, el) => {
    const t = $(el).clone().children().remove().end().text().trim();
    if (t.length > 10) bodyParts.push(t);
    if (bodyParts.join(" ").length > 5000) return false;
  });
  if (bodyParts.length) addText(bodyParts.join(" "), "Body", 2);

  // Tokenise each source into 1- and 2-gram phrases
  const scores = new Map<string, { score: number; source: string; count: number }>();

  for (const { text, source, weight } of entries) {
    const tokens = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, " ")
      .split(/\s+/)
      .filter(t => t.length > 2 && !STOP_WORDS.has(t) && !/^\d+$/.test(t));

    // 1-grams
    for (const tok of tokens) {
      const existing = scores.get(tok);
      if (existing) {
        existing.score += weight;
        existing.count += 1;
      } else {
        scores.set(tok, { score: weight, source, count: 1 });
      }
    }

    // 2-grams
    for (let i = 0; i < tokens.length - 1; i++) {
      const bigram = `${tokens[i]} ${tokens[i + 1]}`;
      if (STOP_WORDS.has(tokens[i]) || STOP_WORDS.has(tokens[i + 1])) continue;
      const existing = scores.get(bigram);
      if (existing) {
        existing.score += weight * 1.5;
        existing.count += 1;
      } else {
        scores.set(bigram, { score: weight * 1.5, source, count: 1 });
      }
    }
  }

  return [...scores.entries()]
    .map(([keyword, { score, source, count }]) => ({ keyword, source, count, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 20)
    .map(({ keyword, source, count }) => ({ keyword, source, count }));
}

function normalizeUrl(raw: string): string {
  let url = raw.trim();
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }
  return url;
}

function scoreSection(checks: AuditCheck[]): number {
  if (checks.length === 0) return 100;
  const passes = checks.filter((c) => c.status === "pass").length;
  const warns = checks.filter((c) => c.status === "warn").length;
  const total = checks.length;
  return Math.round(((passes + warns * 0.5) / total) * 100);
}

router.post("/audit", async (req, res) => {
  let { url } = req.body as { url: string };
  if (!url || typeof url !== "string") {
    res.status(400).json({ error: "URL is required" });
    return;
  }

  url = normalizeUrl(url);

  // Validate URL
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    res.status(400).json({ error: "Invalid URL format. Please enter a valid website address." });
    return;
  }

  const start = Date.now();
  let html = "";
  let finalUrl = url;
  let statusCode = 0;
  let fetchError = "";
  let responseHeaders: Record<string, string> = {};

  // ── Kick off screenshots in parallel with the main fetch ─────────────────────
  async function fetchScreenshot(targetUrl: string, mobile: boolean): Promise<string | null> {
    try {
      const params = new URLSearchParams({
        url: targetUrl,
        screenshot: "true",
        meta: "false",
        "viewport.width": mobile ? "390" : "1280",
        "viewport.height": mobile ? "844" : "800",
        ...(mobile ? { "viewport.isMobile": "true", "viewport.deviceScaleFactor": "2" } : {}),
      });
      const r = await fetch(`https://api.microlink.io/?${params}`, { signal: AbortSignal.timeout(18000) });
      if (!r.ok) return null;
      const j = await r.json() as any;
      return j?.data?.screenshot?.url ?? null;
    } catch {
      return null;
    }
  }

  const screenshotPromises = Promise.allSettled([
    fetchScreenshot(url, false),
    fetchScreenshot(url, true),
  ]);

  // ── Kick off backlink discovery in parallel too ───────────────────────────────
  const backlinksPromise = discoverBacklinks(url, url);

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "FortuneDesign-SEOBot/1.0 (+https://fortunedesign.co.za)",
        "Accept": "text/html,application/xhtml+xml,application/xhtml+xml",
        "Accept-Language": "en-ZA,en;q=0.9",
      },
      redirect: "follow",
    });
    clearTimeout(timeout);

    statusCode = response.status;
    finalUrl = response.url || url;
    response.headers.forEach((value, key) => {
      responseHeaders[key.toLowerCase()] = value;
    });
    html = await response.text();
  } catch (err: any) {
    if (err?.name === "AbortError") {
      fetchError = "The website took too long to respond (timeout after 15s).";
    } else {
      fetchError = `Could not reach the website: ${err?.message ?? "Unknown error"}`;
    }
  }

  const loadTimeMs = Date.now() - start;

  if (fetchError) {
    res.status(400).json({ error: fetchError });
    return;
  }

  const $ = cheerio.load(html);

  // ─── KEYWORD EXTRACTION ─────────────────────────────────────────────────────
  const rankingKeywords = extractPageKeywords($);

  // ─── ON-PAGE SEO ────────────────────────────────────────────────────────────
  const onPageChecks: AuditCheck[] = [];

  // Title tag
  const title = $("title").first().text().trim();
  if (!title) {
    onPageChecks.push({ name: "Title Tag", status: "fail", value: "Missing", description: "No <title> tag found. Title tags are critical for SEO and appear as the clickable headline in search results." });
  } else if (title.length < 30) {
    onPageChecks.push({ name: "Title Tag", status: "warn", value: `"${title.slice(0, 60)}" (${title.length} chars)`, description: "Title tag is too short (under 30 characters). Aim for 50–60 characters to maximise search result visibility." });
  } else if (title.length > 60) {
    onPageChecks.push({ name: "Title Tag", status: "warn", value: `"${title.slice(0, 60)}…" (${title.length} chars)`, description: "Title tag is too long (over 60 characters) and may be truncated in search results. Keep it under 60 characters." });
  } else {
    onPageChecks.push({ name: "Title Tag", status: "pass", value: `"${title.slice(0, 60)}" (${title.length} chars)`, description: "Title tag is present and within the recommended 50–60 character range." });
  }

  // Meta description
  const metaDesc = $('meta[name="description"]').attr("content")?.trim() ?? "";
  if (!metaDesc) {
    onPageChecks.push({ name: "Meta Description", status: "fail", value: "Missing", description: "No meta description found. While not a direct ranking factor, it influences click-through rate from search results." });
  } else if (metaDesc.length < 70) {
    onPageChecks.push({ name: "Meta Description", status: "warn", value: `"${metaDesc.slice(0, 80)}…" (${metaDesc.length} chars)`, description: "Meta description is too short. Aim for 140–160 characters to improve click-through rate from Google." });
  } else if (metaDesc.length > 160) {
    onPageChecks.push({ name: "Meta Description", status: "warn", value: `"${metaDesc.slice(0, 80)}…" (${metaDesc.length} chars)`, description: "Meta description is too long and will be truncated by Google. Keep it under 160 characters." });
  } else {
    onPageChecks.push({ name: "Meta Description", status: "pass", value: `"${metaDesc.slice(0, 80)}…" (${metaDesc.length} chars)`, description: "Meta description is present and within the recommended 140–160 character range." });
  }

  // H1 tags
  const h1Tags = $("h1").map((_, el) => $(el).text().trim()).get().filter(Boolean);
  if (h1Tags.length === 0) {
    onPageChecks.push({ name: "H1 Heading", status: "fail", value: "None found", description: "No H1 heading found. Every page should have exactly one H1 tag that describes the main topic of the page." });
  } else if (h1Tags.length > 1) {
    onPageChecks.push({ name: "H1 Heading", status: "warn", value: `${h1Tags.length} H1 tags found`, description: "Multiple H1 tags found. Best practice is to have exactly one H1 per page to clearly define the page's main topic." });
  } else {
    onPageChecks.push({ name: "H1 Heading", status: "pass", value: `"${h1Tags[0].slice(0, 60)}"`, description: "Exactly one H1 heading found — this is ideal for SEO." });
  }

  // H2 tags
  const h2Count = $("h2").length;
  if (h2Count === 0) {
    onPageChecks.push({ name: "H2 Headings", status: "warn", value: "None found", description: "No H2 headings found. Using H2 tags to structure your content helps search engines understand your page better." });
  } else {
    onPageChecks.push({ name: "H2 Headings", status: "pass", value: `${h2Count} H2 tags found`, description: "Good use of H2 headings to structure content for readers and search engines." });
  }

  // Keywords in title
  const bodyText = $("body").text().toLowerCase().replace(/\s+/g, " ");
  const wordFreq: Record<string, number> = {};
  bodyText.split(/\W+/).forEach((w) => {
    if (w.length > 4) wordFreq[w] = (wordFreq[w] ?? 0) + 1;
  });
  const topWords = Object.entries(wordFreq).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([w]) => w);
  const titleLower = title.toLowerCase();
  const topWordInTitle = topWords.some((w) => titleLower.includes(w));
  if (topWordInTitle) {
    onPageChecks.push({ name: "Keyword in Title", status: "pass", value: `Top terms: ${topWords.slice(0, 3).join(", ")}`, description: "Top content keywords appear in the title tag, which is a positive SEO signal." });
  } else {
    onPageChecks.push({ name: "Keyword in Title", status: "warn", value: `Title: "${title.slice(0, 40)}"`, description: "Frequently used words on the page don't appear in the title. Consider including your primary keyword in the title." });
  }

  // Word count
  const wordCount = bodyText.split(/\s+/).filter(Boolean).length;
  if (wordCount < 300) {
    onPageChecks.push({ name: "Content Length", status: "warn", value: `~${wordCount} words`, description: "Page content is quite thin. Google tends to favour pages with at least 300–500 words of quality content." });
  } else {
    onPageChecks.push({ name: "Content Length", status: "pass", value: `~${wordCount} words`, description: "Page has a solid amount of content, which is a positive ranking signal." });
  }

  // ─── TECHNICAL SEO ──────────────────────────────────────────────────────────
  const techChecks: AuditCheck[] = [];

  // HTTPS
  const isHttps = finalUrl.startsWith("https://");
  techChecks.push({
    name: "HTTPS / SSL",
    status: isHttps ? "pass" : "fail",
    value: isHttps ? "Secure (HTTPS)" : "Not Secure (HTTP)",
    description: isHttps
      ? "Your site uses HTTPS — this is a confirmed Google ranking signal."
      : "Your site does not use HTTPS. This is a ranking penalty and may cause browsers to display a 'Not Secure' warning.",
  });

  // HTTP status code
  if (statusCode >= 200 && statusCode < 300) {
    techChecks.push({ name: "HTTP Status Code", status: "pass", value: `${statusCode} OK`, description: "Page returned a successful 200-level response code." });
  } else {
    techChecks.push({ name: "HTTP Status Code", status: "fail", value: `${statusCode}`, description: `Unexpected HTTP status code ${statusCode}. Search engines need a 200 status to properly index pages.` });
  }

  // Mobile viewport
  const viewport = $('meta[name="viewport"]').attr("content");
  if (viewport?.includes("width=device-width")) {
    techChecks.push({ name: "Mobile Viewport", status: "pass", value: viewport.slice(0, 60), description: "A mobile viewport meta tag is set. This is essential for mobile-first indexing by Google." });
  } else if (viewport) {
    techChecks.push({ name: "Mobile Viewport", status: "warn", value: viewport.slice(0, 60), description: "Viewport tag found but doesn't include 'width=device-width'. This may affect mobile rendering." });
  } else {
    techChecks.push({ name: "Mobile Viewport", status: "fail", value: "Missing", description: "No mobile viewport meta tag found. Google uses mobile-first indexing — this is a critical issue." });
  }

  // Canonical URL
  const canonical = $('link[rel="canonical"]').attr("href");
  if (canonical) {
    techChecks.push({ name: "Canonical URL", status: "pass", value: canonical.slice(0, 80), description: "A canonical URL is set, which helps prevent duplicate content issues." });
  } else {
    techChecks.push({ name: "Canonical URL", status: "warn", value: "Not set", description: "No canonical URL tag found. Adding a canonical tag helps Google understand the preferred version of each page." });
  }

  // Page load time
  if (loadTimeMs < 1000) {
    techChecks.push({ name: "Server Response Time", status: "pass", value: `${loadTimeMs}ms`, description: "Excellent server response time! Fast loading is a key Google ranking factor." });
  } else if (loadTimeMs < 3000) {
    techChecks.push({ name: "Server Response Time", status: "warn", value: `${loadTimeMs}ms`, description: "Server response time is acceptable but could be improved. Aim for under 1 second for best results." });
  } else {
    techChecks.push({ name: "Server Response Time", status: "fail", value: `${loadTimeMs}ms`, description: "Slow server response time (over 3 seconds). Page speed is a confirmed Google ranking factor — optimise your hosting." });
  }

  // Robots.txt check
  try {
    const robotsUrl = new URL("/robots.txt", finalUrl).href;
    const robotsRes = await fetch(robotsUrl, { signal: AbortSignal.timeout(5000) });
    if (robotsRes.ok) {
      const robotsTxt = await robotsRes.text();
      const blocked = robotsTxt.toLowerCase().includes("disallow: /");
      if (blocked) {
        techChecks.push({ name: "Robots.txt", status: "warn", value: "Found (check disallow rules)", description: "robots.txt found but contains Disallow rules. Make sure important pages are not accidentally blocked from indexing." });
      } else {
        techChecks.push({ name: "Robots.txt", status: "pass", value: "Found and accessible", description: "robots.txt file is accessible and doesn't block important pages." });
      }
    } else {
      techChecks.push({ name: "Robots.txt", status: "warn", value: `Not found (${robotsRes.status})`, description: "No robots.txt file found. While not mandatory, it helps search engines crawl your site more efficiently." });
    }
  } catch {
    techChecks.push({ name: "Robots.txt", status: "warn", value: "Could not check", description: "Unable to verify robots.txt. Ensure it is accessible at /robots.txt." });
  }

  // Sitemap check
  try {
    const sitemapUrl = new URL("/sitemap.xml", finalUrl).href;
    const sitemapRes = await fetch(sitemapUrl, { signal: AbortSignal.timeout(5000) });
    if (sitemapRes.ok) {
      techChecks.push({ name: "XML Sitemap", status: "pass", value: "Found at /sitemap.xml", description: "XML sitemap found. This helps Google discover and index all your important pages." });
    } else {
      techChecks.push({ name: "XML Sitemap", status: "warn", value: "Not found at /sitemap.xml", description: "No XML sitemap found. A sitemap helps search engines discover your content faster." });
    }
  } catch {
    techChecks.push({ name: "XML Sitemap", status: "warn", value: "Could not check", description: "Unable to verify sitemap. Ensure a sitemap.xml exists and is submitted to Google Search Console." });
  }

  // X-Robots-Tag header
  const xRobots = responseHeaders["x-robots-tag"] ?? "";
  if (xRobots.includes("noindex")) {
    techChecks.push({ name: "X-Robots-Tag Header", status: "fail", value: xRobots, description: "The X-Robots-Tag header is set to 'noindex', which tells Google NOT to index this page!" });
  }

  // ─── IMAGES ─────────────────────────────────────────────────────────────────
  const imageChecks: AuditCheck[] = [];

  const images = $("img");
  const totalImages = images.length;
  let missingAltCount = 0;
  const missingAltImages: { src: string; filename: string }[] = [];

  images.each((_, el) => {
    const alt = $(el).attr("alt");
    const rawSrc = $(el).attr("src") ?? $(el).attr("data-src") ?? $(el).attr("data-lazy-src") ?? "";
    const isMissingAlt = alt === undefined || alt === null || alt.trim() === "";
    if (isMissingAlt) {
      missingAltCount++;
      if (rawSrc) {
        try {
          const absoluteSrc = rawSrc.startsWith("http") ? rawSrc : new URL(rawSrc, finalUrl).href;
          const filename = absoluteSrc.split("/").pop()?.split("?")[0] ?? absoluteSrc;
          if (missingAltImages.length < 30) {
            missingAltImages.push({ src: absoluteSrc, filename });
          }
        } catch { /* skip malformed */ }
      }
    }
  });

  if (totalImages === 0) {
    imageChecks.push({ name: "Image Alt Text", status: "warn", value: "No images found", description: "No images detected on this page. Images with descriptive alt text can improve visibility in Google Image Search." });
  } else if (missingAltCount === 0) {
    imageChecks.push({ name: "Image Alt Text", status: "pass", value: `${totalImages} images, all have alt text`, description: "All images have alt attributes. This is great for accessibility and image SEO." });
  } else {
    const pct = Math.round((missingAltCount / totalImages) * 100);
    imageChecks.push({
      name: "Image Alt Text",
      status: pct > 50 ? "fail" : "warn",
      value: `${missingAltCount} of ${totalImages} images missing alt text (${pct}%)`,
      description: `${missingAltCount} image(s) are missing alt text or have empty alt attributes. Alt text helps Google understand what images contain and improves SEO.`,
    });
  }

  // Check for large image count (potential perf issue)
  if (totalImages > 30) {
    imageChecks.push({ name: "Image Count", status: "warn", value: `${totalImages} images on page`, description: "Large number of images detected. Ensure they are all compressed and lazy-loaded to prevent slow page speeds." });
  } else if (totalImages > 0) {
    imageChecks.push({ name: "Image Count", status: "pass", value: `${totalImages} images`, description: "Reasonable number of images on the page." });
  }

  // ─── LINKS ──────────────────────────────────────────────────────────────────
  const linkChecks: AuditCheck[] = [];
  const baseHost = parsedUrl.hostname;

  let internalLinks = 0;
  let externalLinks = 0;
  let noFollowLinks = 0;
  let brokenAnchors = 0;

  $("a[href]").each((_, el) => {
    const href = $(el).attr("href") ?? "";
    const rel = $(el).attr("rel") ?? "";
    if (rel.includes("nofollow")) noFollowLinks++;
    if (href.startsWith("#") || href === "") {
      brokenAnchors++;
      return;
    }
    try {
      const abs = new URL(href, finalUrl);
      if (abs.hostname === baseHost || abs.hostname === `www.${baseHost}`) {
        internalLinks++;
      } else if (abs.protocol.startsWith("http")) {
        externalLinks++;
      }
    } catch {
      // relative or malformed
      if (!href.startsWith("mailto:") && !href.startsWith("tel:")) internalLinks++;
    }
  });

  if (internalLinks === 0) {
    linkChecks.push({ name: "Internal Links", status: "fail", value: "None found", description: "No internal links detected. Internal linking is crucial for SEO — it distributes page authority and helps users navigate." });
  } else if (internalLinks < 3) {
    linkChecks.push({ name: "Internal Links", status: "warn", value: `${internalLinks} internal links`, description: "Very few internal links found. Add more internal links to help search engines crawl your site and distribute authority." });
  } else {
    linkChecks.push({ name: "Internal Links", status: "pass", value: `${internalLinks} internal links`, description: "Good internal link structure found." });
  }

  if (externalLinks === 0) {
    linkChecks.push({ name: "External Links", status: "warn", value: "None found", description: "No external (outbound) links found. Linking to authoritative external sources can be a positive SEO signal." });
  } else {
    linkChecks.push({ name: "External Links", status: "pass", value: `${externalLinks} external links`, description: `${externalLinks} external links found. Ensure they link to reputable, relevant sources.` });
  }

  // ─── BACKLINKS & AUTHORITY ───────────────────────────────────────────────────
  const backlinkChecks: AuditCheck[] = [];

  // 1. Domain age — query WHOIS (TCP), then RDAP, then Wayback CDX in parallel
  const hostname = parsedUrl.hostname.replace(/^www\./, "");

  // Helper: promisify the whois TCP lookup
  function whoisLookup(domain: string): Promise<string> {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const lookupFn = (whoisLib as any).lookup ?? (whoisLib as any).default?.lookup;
      if (typeof lookupFn !== "function") {
        return reject(new Error(`whois.lookup not a function; keys: ${Object.keys(whoisLib as object).join(",")}`));
      }
      lookupFn(domain, { timeout: 8000, follow: 3 }, (err: Error | null, data: string | { data: string }[]) => {
        if (err) return reject(err);
        resolve(typeof data === "string" ? data : (data as { data: string }[])[0]?.data ?? "");
      });
    });
  }

  // Parse a creation/registration date from raw WHOIS text
  function parseWhoisDate(raw: string): string | null {
    const patterns = [
      /Creation Date:\s*(\d{4}-\d{2}-\d{2})/i,
      /Registered:\s*(\d{4}-\d{2}-\d{2})/i,
      /Registration Date:\s*(\d{4}-\d{2}-\d{2})/i,
      /Created On:\s*(\d{4}-\d{2}-\d{2})/i,
      /Created:\s*(\d{4}-\d{2}-\d{2})/i,
      /Domain Registration Date:\s*(\d{4}-\d{2}-\d{2})/i,
      // ISO datetime format
      /Creation Date:\s*(\d{4}-\d{2}-\d{2})T/i,
      // Day-Mon-Year format e.g. "01-Jan-2015"
      /(?:Created|Registered|Creation Date):\s*(\d{2}-\w{3}-\d{4})/i,
      // Month Day, Year e.g. "January 1, 2015"
      /(?:Created|Registered|Creation Date):\s*(\w+ \d{1,2},? \d{4})/i,
    ];
    for (const pat of patterns) {
      const m = raw.match(pat);
      if (m?.[1]) {
        const d = new Date(m[1]);
        if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10);
      }
    }
    return null;
  }

  const [whoisResult, rdapResult, cdxResult, crawlCountResult] = await Promise.allSettled([
    // ── TCP WHOIS (primary — direct protocol, no rate limit for single queries) ─
    (async (): Promise<{ date: string; source: string } | null> => {
      const raw = await whoisLookup(hostname);
      const date = parseWhoisDate(raw);
      return date ? { date, source: "WHOIS" } : null;
    })(),

    // ── RDAP JSON API (fallback) ──────────────────────────────────────────────
    (async (): Promise<{ date: string; source: string } | null> => {
      const res = await fetch(`https://rdap.org/domain/${hostname}`, {
        signal: AbortSignal.timeout(6000),
        headers: { Accept: "application/json" },
      });
      if (!res.ok) return null;
      const data = await res.json() as { events?: { eventAction: string; eventDate: string }[] };
      const reg = data.events?.find(e =>
        ["registration", "registration date"].includes(e.eventAction.toLowerCase())
      );
      return reg?.eventDate ? { date: reg.eventDate.slice(0, 10), source: "RDAP" } : null;
    })(),

    // ── Wayback Machine CDX (tertiary — earliest crawl seen) ─────────────────
    (async (): Promise<{ date: string; source: string } | null> => {
      const cdxUrl = `https://web.archive.org/cdx/search/cdx?url=${hostname}/*&output=json&limit=1&fl=timestamp&from=20000101&to=20150101`;
      const res = await fetch(cdxUrl, { signal: AbortSignal.timeout(6000) });
      if (!res.ok) return null;
      const json = await res.json() as string[][];
      if (json.length < 2 || !json[1]?.[0]) return null;
      const ts = json[1][0];
      return { date: `${ts.slice(0, 4)}-${ts.slice(4, 6)}-${ts.slice(6, 8)}`, source: "Wayback Machine" };
    })(),

    // ── Wayback CDX crawl-count (last 2 years) ────────────────────────────────
    (async (): Promise<number> => {
      const countUrl = `https://web.archive.org/cdx/search/cdx?url=${hostname}/*&output=json&limit=1&fl=timestamp&from=20230101&showNumPages=true`;
      const res = await fetch(countUrl, { signal: AbortSignal.timeout(6000) });
      if (!res.ok) return 0;
      return parseInt((await res.text()).trim(), 10) || 0;
    })(),
  ]);

  // Best registration date: prefer WHOIS > RDAP > Wayback CDX
  const bestDateResult =
    (whoisResult.status  === "fulfilled" && whoisResult.value)  ? whoisResult.value  :
    (rdapResult.status   === "fulfilled" && rdapResult.value)   ? rdapResult.value   :
    (cdxResult.status    === "fulfilled" && cdxResult.value)    ? cdxResult.value    :
    null;

  const registrationDate: string | null = bestDateResult?.date ?? null;
  const dateSource: string = bestDateResult?.source ?? "";

  const domainCrawlCount: number =
    crawlCountResult.status === "fulfilled" ? crawlCountResult.value : 0;

  if (registrationDate) {
    const firstYear = parseInt(registrationDate.slice(0, 4), 10);
    const age = new Date().getFullYear() - firstYear;
    if (age >= 5) {
      backlinkChecks.push({
        name: "Domain Age",
        status: "pass",
        value: `${age}+ years old (registered ${registrationDate}${dateSource ? ` · ${dateSource}` : ""})`,
        description: `This domain has a significant history (${age}+ years). Older domains tend to carry more authority with Google.`,
      });
    } else if (age >= 2) {
      backlinkChecks.push({
        name: "Domain Age",
        status: "warn",
        value: `~${age} years old (registered ${registrationDate}${dateSource ? ` · ${dateSource}` : ""})`,
        description: `Domain is relatively young (${age} years). Domain age contributes to authority — continue building links consistently to strengthen it.`,
      });
    } else {
      backlinkChecks.push({
        name: "Domain Age",
        status: "warn",
        value: `New domain (registered ${registrationDate}${dateSource ? ` · ${dateSource}` : ""})`,
        description: "New domain detected. Building a consistent backlink profile early is essential for long-term SEO growth.",
      });
    }
  } else {
    backlinkChecks.push({
      name: "Domain Age",
      status: "warn",
      value: "Unable to determine",
      description: "Could not retrieve WHOIS registration data for this domain. Try checking whois.domaintools.com directly.",
    });
  }

  if (domainCrawlCount > 500) {
    backlinkChecks.push({ name: "Crawl Activity", status: "pass", value: `High activity (est. ${domainCrawlCount}+ pages indexed)`, description: "High crawl activity indicates an established domain with good crawlability and link signals." });
  } else if (domainCrawlCount > 50) {
    backlinkChecks.push({ name: "Crawl Activity", status: "warn", value: `Moderate activity (~${domainCrawlCount} pages indexed)`, description: "Moderate crawl activity. Publishing new content regularly and earning backlinks will improve crawl frequency." });
  } else {
    backlinkChecks.push({ name: "Crawl Activity", status: "warn", value: "Low crawl activity detected", description: "Low crawl activity suggests this domain may lack strong backlink signals. Increase link building and content publishing." });
  }

  // 2. Follow vs NoFollow ratio
  const totalLinksForRatio = internalLinks + externalLinks + noFollowLinks;
  if (totalLinksForRatio > 0) {
    const noFollowPct = Math.round((noFollowLinks / totalLinksForRatio) * 100);
    if (noFollowPct > 80) {
      backlinkChecks.push({ name: "NoFollow Link Ratio", status: "warn", value: `${noFollowPct}% of links are nofollow`, description: "Most links on this page use rel='nofollow'. A mix of follow and nofollow links looks more natural to search engines." });
    } else {
      backlinkChecks.push({ name: "NoFollow Link Ratio", status: "pass", value: `${noFollowLinks} nofollow of ${totalLinksForRatio} links`, description: "Healthy mix of follow and nofollow links. This looks natural to search engines." });
    }
  }

  // 3. Outbound link domain diversity (unique external domains)
  const externalDomains = new Set<string>();
  $("a[href]").each((_, el) => {
    const href = $(el).attr("href") ?? "";
    try {
      const abs = new URL(href, finalUrl);
      if (abs.protocol.startsWith("http") && abs.hostname !== baseHost && abs.hostname !== `www.${baseHost}`) {
        externalDomains.add(abs.hostname.replace(/^www\./, ""));
      }
    } catch { /* skip */ }
  });
  const uniqueExternalDomains = externalDomains.size;
  if (uniqueExternalDomains >= 5) {
    backlinkChecks.push({ name: "Outbound Link Diversity", status: "pass", value: `${uniqueExternalDomains} unique external domains`, description: "Linking to a diverse set of external domains signals a well-connected page to search engines." });
  } else if (uniqueExternalDomains > 0) {
    backlinkChecks.push({ name: "Outbound Link Diversity", status: "warn", value: `${uniqueExternalDomains} unique external domain(s)`, description: "Limited outbound link diversity. Linking to authoritative external sources (industry directories, Google, partners) can strengthen your page's credibility." });
  } else {
    backlinkChecks.push({ name: "Outbound Link Diversity", status: "warn", value: "No external domains linked", description: "No external links detected. Linking to relevant, authoritative sources is good SEO practice and builds trust." });
  }

  // 4. Anchor text diversity
  const anchors: string[] = [];
  $("a[href]").each((_, el) => {
    const text = $(el).text().trim().toLowerCase();
    if (text.length > 1 && text.length < 80 && !["here", "click here", "read more", "learn more", "more", "link"].includes(text)) {
      anchors.push(text);
    }
  });
  const genericAnchors = $("a").filter((_, el) => {
    const t = $(el).text().trim().toLowerCase();
    return ["here", "click here", "read more", "learn more", "more", "link"].includes(t);
  }).length;
  if (genericAnchors > 5) {
    backlinkChecks.push({ name: "Anchor Text Quality", status: "warn", value: `${genericAnchors} generic anchor(s) detected`, description: `Found ${genericAnchors} generic link texts (e.g. "click here", "read more"). Replace with keyword-rich descriptive text — this improves both SEO and accessibility.` });
  } else {
    backlinkChecks.push({ name: "Anchor Text Quality", status: "pass", value: "Descriptive anchor text used", description: "Links use descriptive anchor text rather than generic phrases. This is good for SEO and users." });
  }

  // 5. Social profile links (brand presence)
  const socialDomains = ["facebook.com", "instagram.com", "linkedin.com", "twitter.com", "x.com", "youtube.com", "tiktok.com", "pinterest.com"];
  const foundSocials: string[] = [];
  $("a[href]").each((_, el) => {
    const href = $(el).attr("href") ?? "";
    for (const sd of socialDomains) {
      if (href.includes(sd) && !foundSocials.includes(sd)) {
        foundSocials.push(sd.replace(".com", ""));
      }
    }
  });
  if (foundSocials.length >= 3) {
    backlinkChecks.push({ name: "Social Profile Links", status: "pass", value: foundSocials.join(", "), description: "Multiple social media profiles are linked. Social signals contribute to brand authority and can drive indirect link-building opportunities." });
  } else if (foundSocials.length > 0) {
    backlinkChecks.push({ name: "Social Profile Links", status: "warn", value: `Only ${foundSocials.join(", ")} linked`, description: "Limited social media profiles are linked from this page. Link to all active social profiles to strengthen brand signals." });
  } else {
    backlinkChecks.push({ name: "Social Profile Links", status: "fail", value: "No social profiles linked", description: "No social media profile links found. Linking to active social profiles builds brand authority and creates additional backlink opportunities." });
  }

  // 6. Blog / content section (link-worthy content potential)
  const hasBlogLinks = $("a[href]").toArray().some(el => {
    const href = $(el).attr("href") ?? "";
    const text = $(el).text().toLowerCase();
    return /blog|article|news|post|resource|guide|tip/.test(href + text);
  });
  if (hasBlogLinks) {
    backlinkChecks.push({ name: "Link-Worthy Content", status: "pass", value: "Blog / articles section detected", description: "Content marketing section found. Regularly publishing helpful content attracts natural backlinks over time — a core long-term SEO strategy." });
  } else {
    backlinkChecks.push({ name: "Link-Worthy Content", status: "warn", value: "No blog / content section detected", description: "No blog or articles section found. Creating valuable, shareable content is one of the most effective ways to earn natural backlinks." });
  }

  // ─── BACKLINK-SPECIFIC RECOMMENDATIONS ──────────────────────────────────────
  const backlinkRecs: string[] = [];

  // Always add SA-specific directory recommendations
  backlinkRecs.push(
    "[Backlinks] SA Business Directories: Submit your site to South African directories — Brabys (brabys.com), Yellow Pages SA (yellowpages.co.za), Hotfrog SA (hotfrog.co.za), Yalwa SA (yalwa.co.za), and SA Business Hub. Each listing creates a citation and a do-follow backlink.",
    "[Backlinks] Google Business Profile: Claim and fully optimise your Google Business Profile (GBP). This is the single highest-impact citation for local SEO and directly influences your Google Maps ranking.",
    "[Backlinks] Guest Posting: Write one helpful article per month for a South African industry blog or news site (e.g. IAB SA, Bizcommunity.com, MarketingWeb.co.za). A guest post on a DA30+ site can pass significant link authority.",
    "[Backlinks] Link Reclamation: Search Google for your brand name and find any unlinked mentions. Use a polite outreach email asking the site owner to turn the mention into a clickable link — this is low-effort, high-reward.",
    "[Backlinks] Supplier & Partner Links: Ask your suppliers, business partners, and satisfied clients to link to your website from their website or testimonials page. These contextual links carry strong trust signals.",
    "[Backlinks] HARO / Media Outreach: Sign up for Help A Reporter Out (HARO) or PressLink SA to respond to journalist queries. Getting featured in news articles creates high-authority editorial backlinks.",
    "[Backlinks] Broken Link Building: Use tools like Ahrefs Free Backlink Checker or Moz Link Explorer to find broken links on competitors' referring domains. Reach out to offer your content as a replacement.",
    "[Backlinks] Local Sponsorships: Sponsor local events, charities, or community groups in your area. Many organisations link back to sponsors from their websites — giving you high-trust local backlinks.",
  );

  // ─── SOCIAL & STRUCTURED DATA ───────────────────────────────────────────────
  const socialChecks: AuditCheck[] = [];

  // Open Graph
  const ogTitle = $('meta[property="og:title"]').attr("content");
  const ogDesc = $('meta[property="og:description"]').attr("content");
  const ogImage = $('meta[property="og:image"]').attr("content");
  const ogCount = [ogTitle, ogDesc, ogImage].filter(Boolean).length;

  if (ogCount === 3) {
    socialChecks.push({ name: "Open Graph Tags", status: "pass", value: "Title, Description & Image set", description: "All essential Open Graph tags are present. This controls how your page looks when shared on Facebook, LinkedIn, and WhatsApp." });
  } else if (ogCount > 0) {
    socialChecks.push({ name: "Open Graph Tags", status: "warn", value: `${ogCount}/3 key tags found`, description: "Some Open Graph tags are missing. Add og:title, og:description, and og:image for optimal social media sharing appearance." });
  } else {
    socialChecks.push({ name: "Open Graph Tags", status: "fail", value: "None found", description: "No Open Graph tags found. Without them, social media shares of your page may look unprofessional." });
  }

  // Twitter Card
  const twitterCard = $('meta[name="twitter:card"]').attr("content");
  if (twitterCard) {
    socialChecks.push({ name: "Twitter Card", status: "pass", value: twitterCard, description: "Twitter Card meta tag found. This controls how your page appears when shared on Twitter/X." });
  } else {
    socialChecks.push({ name: "Twitter Card", status: "warn", value: "Not set", description: "No Twitter Card meta tag found. Adding one improves how your content appears when shared on Twitter/X." });
  }

  // Structured data / Schema
  const jsonLd = $('script[type="application/ld+json"]');
  if (jsonLd.length > 0) {
    let schemaTypes: string[] = [];
    jsonLd.each((_, el) => {
      try {
        const obj = JSON.parse($(el).html() ?? "{}");
        if (obj["@type"]) schemaTypes.push(obj["@type"]);
        if (Array.isArray(obj["@graph"])) {
          obj["@graph"].forEach((item: any) => item["@type"] && schemaTypes.push(item["@type"]));
        }
      } catch {}
    });
    socialChecks.push({
      name: "Structured Data (Schema)",
      status: "pass",
      value: schemaTypes.length ? schemaTypes.join(", ") : `${jsonLd.length} block(s) found`,
      description: "Structured data (JSON-LD) found. This can enable rich results in Google search (star ratings, FAQs, etc.).",
    });
  } else {
    socialChecks.push({ name: "Structured Data (Schema)", status: "warn", value: "None found", description: "No Schema.org structured data found. Adding schema markup can unlock rich snippets in Google search results." });
  }

  // ─── SCORE SECTIONS ─────────────────────────────────────────────────────────
  const sections: AuditSection[] = [
    { title: "On-Page SEO", score: scoreSection(onPageChecks), checks: onPageChecks },
    { title: "Technical SEO", score: scoreSection(techChecks), checks: techChecks },
    { title: "Images", score: scoreSection(imageChecks), checks: imageChecks },
    { title: "Links", score: scoreSection(linkChecks), checks: linkChecks },
    { title: "Backlinks & Authority", score: scoreSection(backlinkChecks), checks: backlinkChecks },
    { title: "Social & Structured Data", score: scoreSection(socialChecks), checks: socialChecks },
  ];

  const allChecks = sections.flatMap((s) => s.checks);
  const totalChecks = allChecks.length;
  const passes = allChecks.filter((c) => c.status === "pass").length;
  const warns = allChecks.filter((c) => c.status === "warn").length;
  const overallScore = Math.round(((passes + warns * 0.5) / totalChecks) * 100);

  // ─── RECOMMENDATIONS ────────────────────────────────────────────────────────
  const recommendations: string[] = [];
  for (const s of sections) {
    for (const check of s.checks) {
      if (check.status === "fail") {
        recommendations.push(`[Critical] ${check.name}: ${check.description}`);
      } else if (check.status === "warn") {
        recommendations.push(`[Improve] ${check.name}: ${check.description}`);
      }
    }
  }
  // Append specific backlink-building recommendations at the end
  recommendations.push(...backlinkRecs);

  // ── Resolve screenshots + backlinks (all ran in parallel from the start) ─────
  const [desktopResult, mobileResult] = await screenshotPromises;
  const screenshots = {
    desktop: desktopResult.status === "fulfilled" ? desktopResult.value : null,
    mobile:  mobileResult.status  === "fulfilled" ? mobileResult.value  : null,
  };
  const topBacklinks = await backlinksPromise;

  res.json({
    url,
    finalUrl,
    overallScore,
    loadTimeMs,
    pageTitle: title,
    metaDescription: metaDesc,
    sections,
    recommendations,
    screenshots,
    missingAltImages,
    topBacklinks,
    rankingKeywords,
  });
});

export default router;
