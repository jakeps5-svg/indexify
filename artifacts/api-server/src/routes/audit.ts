import { Router, type IRouter } from "express";
import * as cheerio from "cheerio";

const router: IRouter = Router();

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
  let imagesWithoutAlt = 0;
  let imagesWithEmptyAlt = 0;

  images.each((_, el) => {
    const alt = $(el).attr("alt");
    if (alt === undefined || alt === null) imagesWithoutAlt++;
    else if (alt.trim() === "") imagesWithEmptyAlt++;
  });

  if (totalImages === 0) {
    imageChecks.push({ name: "Image Alt Text", status: "warn", value: "No images found", description: "No images detected on this page. Images with descriptive alt text can improve visibility in Google Image Search." });
  } else if (imagesWithoutAlt === 0 && imagesWithEmptyAlt === 0) {
    imageChecks.push({ name: "Image Alt Text", status: "pass", value: `${totalImages} images, all have alt text`, description: "All images have alt attributes. This is great for accessibility and image SEO." });
  } else {
    const missingCount = imagesWithoutAlt + imagesWithEmptyAlt;
    const pct = Math.round((missingCount / totalImages) * 100);
    imageChecks.push({
      name: "Image Alt Text",
      status: pct > 50 ? "fail" : "warn",
      value: `${missingCount} of ${totalImages} images missing alt text (${pct}%)`,
      description: `${missingCount} image(s) are missing alt text or have empty alt attributes. Alt text helps Google understand what images contain and improves SEO.`,
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

  res.json({
    url,
    finalUrl,
    overallScore,
    loadTimeMs,
    pageTitle: title,
    metaDescription: metaDesc,
    sections,
    recommendations,
  });
});

export default router;
