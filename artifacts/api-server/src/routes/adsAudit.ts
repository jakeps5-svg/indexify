import { Router, type IRouter } from "express";
import * as cheerio from "cheerio";
import * as crypto from "crypto";

const router: IRouter = Router();

type CheckStatus = "pass" | "warn" | "fail";

interface AuditCheck {
  name: string;
  status: CheckStatus;
  value: string;
  description: string;
  impact: "high" | "medium" | "low";
}

interface AuditSection {
  title: string;
  score: number;
  checks: AuditCheck[];
}

interface AdsAuditResult {
  url: string;
  finalUrl: string;
  overallScore: number;
  qualityScoreEstimate: number;
  loadTimeMs: number;
  pageTitle: string;
  metaDescription: string;
  sections: AuditSection[];
  topIssues: string[];
  quickWins: string[];
  conversionElements: {
    hasForms: boolean;
    hasPhone: boolean;
    hasCTA: boolean;
    ctaCount: number;
    phonesFound: string[];
  };
  screenshots: { desktop: string | null; mobile: string | null };
  unlockCode: string;
}

function normalizeUrl(raw: string): string {
  let url = raw.trim();
  if (!url.startsWith("http://") && !url.startsWith("https://")) url = "https://" + url;
  return url;
}

function scoreSection(checks: AuditCheck[]): number {
  if (checks.length === 0) return 100;
  const weighted = checks.reduce((sum, c) => {
    const w = c.impact === "high" ? 3 : c.impact === "medium" ? 2 : 1;
    const s = c.status === "pass" ? w : c.status === "warn" ? w * 0.5 : 0;
    return { score: sum.score + s, total: sum.total + w };
  }, { score: 0, total: 0 });
  return Math.round((weighted.score / weighted.total) * 100);
}

function generateUnlockCode(domain: string): string {
  const secret = `fd-ads-${domain}-2025`;
  return crypto.createHash("sha256").update(secret).digest("hex").slice(0, 8).toUpperCase();
}

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

router.post("/ads-audit", async (req, res) => {
  let { url } = req.body as { url: string };
  if (!url || typeof url !== "string") {
    res.status(400).json({ error: "URL is required" });
    return;
  }

  url = normalizeUrl(url);

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    res.status(400).json({ error: "Invalid URL. Please enter a valid website address." });
    return;
  }

  const domain = parsedUrl.hostname.replace(/^www\./, "");
  const unlockCode = generateUnlockCode(domain);

  const screenshotPromises = Promise.allSettled([
    fetchScreenshot(url, false),
    fetchScreenshot(url, true),
  ]);

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
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "text/html,application/xhtml+xml",
        "Accept-Language": "en-ZA,en;q=0.9",
      },
      redirect: "follow",
    });
    clearTimeout(timeout);
    statusCode = response.status;
    finalUrl = response.url || url;
    response.headers.forEach((value, key) => { responseHeaders[key.toLowerCase()] = value; });
    html = await response.text();
  } catch (err: any) {
    fetchError = err?.name === "AbortError"
      ? "The website took too long to respond (timeout after 15s)."
      : `Could not reach the website: ${err?.message ?? "Unknown error"}`;
  }

  if (fetchError) { res.status(400).json({ error: fetchError }); return; }

  const loadTimeMs = Date.now() - start;
  const $ = cheerio.load(html);
  const bodyText = $("body").text().toLowerCase();
  const fullHtml = html.toLowerCase();

  // ── PAGE META ───────────────────────────────────────────────────────────────
  const pageTitle = $("title").first().text().trim();
  const metaDescription = $('meta[name="description"]').attr("content")?.trim() ?? "";

  // ── CONVERSION ELEMENT DETECTION ────────────────────────────────────────────
  const forms = $("form").length;
  const phoneRegex = /(\+27|0)[0-9\s\-()]{8,14}/g;
  const phonesFound = [...new Set((bodyText.match(phoneRegex) ?? []).map(p => p.trim()))].slice(0, 3);
  const hasPhone = phonesFound.length > 0;
  const hasForms = forms > 0;

  const ctaKeywords = ["get started","contact us","call us","request a quote","get a quote","book now",
    "free consultation","schedule","book a","buy now","order now","sign up","register","enquire",
    "whatsapp","chat","get in touch","submit","send","enquiry","apply now","claim","download"];
  const allLinks = $("a, button").map((_, el) => $(el).text().trim().toLowerCase()).get();
  const ctaCount = allLinks.filter(t => ctaKeywords.some(k => t.includes(k))).length;
  const hasCTA = ctaCount > 0 || $('[class*="cta"],[class*="btn"],[class*="button"]').length > 2;

  const conversionElements = { hasForms, hasPhone, hasCTA, ctaCount, phonesFound };

  // ── SECTION 1: LANDING PAGE QUALITY (Quality Score) ─────────────────────────
  const lpChecks: AuditCheck[] = [];

  // Headline clarity
  const h1s = $("h1").map((_, el) => $(el).text().trim()).get().filter(Boolean);
  if (h1s.length === 0) {
    lpChecks.push({ name: "Main Headline (H1)", status: "fail", value: "Missing", impact: "high",
      description: "No H1 heading found. Google Ads rewards landing pages where the headline matches the ad's message. This is a Quality Score killer." });
  } else if (h1s[0].length < 10) {
    lpChecks.push({ name: "Main Headline (H1)", status: "warn", value: `"${h1s[0]}"`, impact: "high",
      description: "H1 heading is too vague. Your headline should clearly state what you offer to match your ad's intent." });
  } else {
    lpChecks.push({ name: "Main Headline (H1)", status: "pass", value: `"${h1s[0].slice(0, 60)}"`, impact: "high",
      description: "Clear main headline found — this helps ad-to-page relevance, a key Quality Score factor." });
  }

  // Value proposition
  const vpKeywords = ["save","guarantee","best","top","leading","trusted","expert","certified","no contract","free","results","proven"];
  const hasVP = vpKeywords.some(k => bodyText.includes(k));
  lpChecks.push({ name: "Value Proposition", status: hasVP ? "pass" : "warn", value: hasVP ? "Detected" : "Not clear", impact: "high",
    description: hasVP
      ? "Strong value proposition language found — visitors can quickly understand why to choose you."
      : "No clear value proposition found. Ads convert best when landing pages immediately answer 'Why choose you?'" });

  // Title tag relevance
  if (!pageTitle) {
    lpChecks.push({ name: "Page Title", status: "fail", value: "Missing", impact: "high",
      description: "No page title found. This hurts both your SEO Quality Score and ad relevance." });
  } else if (pageTitle.length > 60) {
    lpChecks.push({ name: "Page Title", status: "warn", value: `"${pageTitle.slice(0, 60)}…" (${pageTitle.length} chars)`, impact: "medium",
      description: "Title too long — will be truncated in search results. Keep under 60 characters." });
  } else {
    lpChecks.push({ name: "Page Title", status: "pass", value: `"${pageTitle.slice(0, 60)}"`, impact: "high",
      description: "Page title is present and a good length — helps align your page with your ad keywords." });
  }

  // Meta description (Ad preview alignment)
  if (!metaDescription) {
    lpChecks.push({ name: "Meta Description", status: "warn", value: "Missing", impact: "medium",
      description: "No meta description. Google sometimes uses this as ad description text. Add one with a strong CTA." });
  } else {
    lpChecks.push({ name: "Meta Description", status: "pass", value: `"${metaDescription.slice(0, 70)}…"`, impact: "medium",
      description: "Meta description present — Google can use this text in your ad descriptions." });
  }

  // Content depth
  const wordCount = bodyText.split(/\s+/).filter(Boolean).length;
  if (wordCount < 200) {
    lpChecks.push({ name: "Content Depth", status: "fail", value: `~${wordCount} words`, impact: "high",
      description: "Very thin content. Google Ads Quality Score penalises landing pages with little content — aim for 300+ words." });
  } else if (wordCount < 400) {
    lpChecks.push({ name: "Content Depth", status: "warn", value: `~${wordCount} words`, impact: "medium",
      description: "Content is light. Adding more detailed copy about your services can improve Quality Score and conversion rate." });
  } else {
    lpChecks.push({ name: "Content Depth", status: "pass", value: `~${wordCount} words`, impact: "medium",
      description: "Good content depth — enough information to satisfy a visitor arriving from an ad." });
  }

  // ── SECTION 2: MOBILE & SPEED ───────────────────────────────────────────────
  const mobileChecks: AuditCheck[] = [];

  const viewport = $('meta[name="viewport"]').attr("content");
  if (viewport?.includes("width=device-width")) {
    mobileChecks.push({ name: "Mobile Viewport", status: "pass", value: viewport.slice(0, 60), impact: "high",
      description: "Mobile viewport is correctly set. Over 65% of Google Ads clicks come from mobile — this is critical." });
  } else {
    mobileChecks.push({ name: "Mobile Viewport", status: "fail", value: "Missing or incorrect", impact: "high",
      description: "No mobile viewport tag. Your landing page may display incorrectly on phones, destroying conversion rates." });
  }

  if (loadTimeMs < 1500) {
    mobileChecks.push({ name: "Page Load Speed", status: "pass", value: `${loadTimeMs}ms`, impact: "high",
      description: "Fast page load — excellent for Quality Score. Google penalises slow landing pages in Ads auctions." });
  } else if (loadTimeMs < 3000) {
    mobileChecks.push({ name: "Page Load Speed", status: "warn", value: `${loadTimeMs}ms`, impact: "high",
      description: "Page is a bit slow. Each second of delay reduces conversions by ~7%. Aim for under 1.5s." });
  } else {
    mobileChecks.push({ name: "Page Load Speed", status: "fail", value: `${loadTimeMs}ms`, impact: "high",
      description: "Very slow page load. This directly lowers your Quality Score and increases your cost-per-click." });
  }

  const hasResponsiveIndicators = fullHtml.includes("max-width") || fullHtml.includes("@media") || $('[class*="col-"],[class*="flex"],[class*="grid"],[class*="responsive"]').length > 3;
  mobileChecks.push({ name: "Responsive Design", status: hasResponsiveIndicators ? "pass" : "warn", value: hasResponsiveIndicators ? "Detected" : "Unclear", impact: "high",
    description: hasResponsiveIndicators
      ? "Responsive CSS detected — layout likely adapts well to mobile screens."
      : "Could not confirm responsive design. Test your page on mobile to ensure a good experience." });

  const hasLargeImages = $("img:not([loading])").length > 3;
  mobileChecks.push({ name: "Image Lazy Loading", status: hasLargeImages ? "warn" : "pass", value: hasLargeImages ? "Some images not lazy-loaded" : "Good", impact: "medium",
    description: hasLargeImages
      ? "Some images lack lazy loading — they load immediately, slowing page speed on mobile."
      : "Images appear to use lazy loading — good for mobile performance." });

  // ── SECTION 3: CONVERSION READINESS ────────────────────────────────────────
  const convChecks: AuditCheck[] = [];

  if (hasCTA) {
    convChecks.push({ name: "Call-to-Action Buttons", status: ctaCount >= 3 ? "pass" : "warn", value: `${ctaCount} CTA${ctaCount !== 1 ? "s" : ""} detected`, impact: "high",
      description: ctaCount >= 3
        ? "Multiple CTAs detected — gives visitors multiple opportunities to convert."
        : "Limited CTAs found. Ads convert better when there are 3+ clear, action-oriented buttons." });
  } else {
    convChecks.push({ name: "Call-to-Action Buttons", status: "fail", value: "None detected", impact: "high",
      description: "No clear CTA buttons found. Without a compelling call-to-action, visitors arriving from ads won't know what to do next." });
  }

  convChecks.push({ name: "Contact Form", status: hasForms ? "pass" : "warn", value: hasForms ? `${forms} form(s) found` : "None found", impact: "high",
    description: hasForms
      ? "Contact form found — a primary conversion pathway for lead generation ads."
      : "No form found. Adding a short contact form significantly increases lead capture from Google Ads traffic." });

  convChecks.push({ name: "Phone Number", status: hasPhone ? "pass" : "warn", value: hasPhone ? phonesFound[0] : "Not found", impact: "high",
    description: hasPhone
      ? "Phone number found — enables click-to-call tracking in Google Ads, a high-converting feature."
      : "No phone number detected. Phone numbers on landing pages increase trust and enable call extensions in Ads." });

  // Above-fold CTA
  const earlyHtml = html.slice(0, html.length * 0.3).toLowerCase();
  const hasAboveFoldCTA = ctaKeywords.some(k => earlyHtml.includes(k));
  convChecks.push({ name: "Above-Fold CTA", status: hasAboveFoldCTA ? "pass" : "warn", value: hasAboveFoldCTA ? "Present" : "Not visible", impact: "high",
    description: hasAboveFoldCTA
      ? "A CTA appears early on the page — visitors from ads can act immediately without scrolling."
      : "No CTA visible in the top section. Ads visitors expect an immediate action button — add one above the fold." });

  // Thank you / confirmation page indicator
  const hasThankYou = bodyText.includes("thank you") || bodyText.includes("confirmation") || bodyText.includes("submitted");
  convChecks.push({ name: "Conversion Confirmation", status: hasThankYou ? "pass" : "warn", value: hasThankYou ? "Detected" : "Unclear", impact: "medium",
    description: hasThankYou
      ? "Confirmation/thank-you language found — enables accurate Google Ads conversion tracking."
      : "No confirmation language detected. Set up a thank-you page to enable Google Ads conversion tracking." });

  // ── SECTION 4: TRUST & CREDIBILITY ──────────────────────────────────────────
  const trustChecks: AuditCheck[] = [];

  const isHttps = finalUrl.startsWith("https://");
  trustChecks.push({ name: "SSL Certificate", status: isHttps ? "pass" : "fail", value: isHttps ? "Secure (HTTPS)" : "Not Secure (HTTP)", impact: "high",
    description: isHttps
      ? "HTTPS enabled — Google requires SSL for ads. Visitors see no 'Not Secure' warning."
      : "No HTTPS. Google Ads may reject your landing page. Immediately install an SSL certificate." });

  const reviewKeywords = ["review","testimonial","star","rated","★","⭐","trustpilot","google review","client said","customer said","says","feedback","our clients","what our"];
  const hasReviews = reviewKeywords.some(k => bodyText.includes(k));
  trustChecks.push({ name: "Reviews & Testimonials", status: hasReviews ? "pass" : "warn", value: hasReviews ? "Found" : "Not found", impact: "high",
    description: hasReviews
      ? "Reviews/testimonials detected — this social proof is crucial for converting cold ad traffic."
      : "No reviews or testimonials found. Paid traffic converts much better with visible social proof." });

  const privacyKeywords = ["privacy policy","privacy","popi","gdpr","data protection"];
  const hasPrivacy = privacyKeywords.some(k => bodyText.includes(k));
  trustChecks.push({ name: "Privacy Policy", status: hasPrivacy ? "pass" : "warn", value: hasPrivacy ? "Found" : "Not found", impact: "medium",
    description: hasPrivacy
      ? "Privacy policy found — required for Google Ads compliance and POPI Act compliance in South Africa."
      : "No privacy policy found. Google Ads requires one, and it's legally required for collecting user data in South Africa." });

  const guaranteeKeywords = ["guarantee","guaranteed","money back","satisfaction","no contract","cancel anytime","no risk"];
  const hasGuarantee = guaranteeKeywords.some(k => bodyText.includes(k));
  trustChecks.push({ name: "Risk Reversal / Guarantee", status: hasGuarantee ? "pass" : "warn", value: hasGuarantee ? "Found" : "Not found", impact: "medium",
    description: hasGuarantee
      ? "Risk reversal language found — reduces purchase anxiety for cold ad traffic."
      : "No guarantee or risk reversal found. Adding one ('No contract', 'Free consultation', etc.) improves ad conversion rates." });

  const hasAddress = /\d+\s+[a-zA-Z]+\s+(street|road|avenue|drive|st\.|rd\.|ave\.|dr\.|way|crescent|lane|close)/i.test(bodyText) || bodyText.includes("cape town") || bodyText.includes("johannesburg") || bodyText.includes("durban");
  trustChecks.push({ name: "Business Location Info", status: hasAddress ? "pass" : "warn", value: hasAddress ? "Found" : "Not detected", impact: "medium",
    description: hasAddress
      ? "Location information found — builds trust with local ad visitors and improves local Quality Score."
      : "No location detected. For local Google Ads campaigns, showing your address builds trust and can improve ad rank." });

  // ── SECTION 5: TECHNICAL COMPATIBILITY ──────────────────────────────────────
  const techChecks: AuditCheck[] = [];

  if (statusCode >= 200 && statusCode < 300) {
    techChecks.push({ name: "HTTP Response", status: "pass", value: `${statusCode} OK`, impact: "high",
      description: "Page returns a successful 200 response — Google Ads bots can index and approve your page." });
  } else {
    techChecks.push({ name: "HTTP Response", status: "fail", value: `${statusCode}`, impact: "high",
      description: `Page returns status ${statusCode}. Google Ads may disapprove your landing page URL.` });
  }

  const canonical = $('link[rel="canonical"]').attr("href");
  techChecks.push({ name: "Canonical URL", status: canonical ? "pass" : "warn", value: canonical ? canonical.slice(0, 60) : "Missing", impact: "low",
    description: canonical
      ? "Canonical tag set — prevents duplicate content issues that could affect your Quality Score."
      : "No canonical tag. While not critical for Ads, it prevents Google from splitting Quality Score across duplicate pages." });

  const hasStructuredData = $('script[type="application/ld+json"]').length > 0;
  techChecks.push({ name: "Structured Data (Schema)", status: hasStructuredData ? "pass" : "warn", value: hasStructuredData ? "Present" : "Missing", impact: "medium",
    description: hasStructuredData
      ? "Schema markup found — can enable rich results and enhance your ad sitelinks."
      : "No schema markup. Adding LocalBusiness or Service schema can unlock ad extensions and improve click-through rates." });

  const hasOpenGraph = $('meta[property="og:title"]').length > 0;
  techChecks.push({ name: "Social / OG Meta Tags", status: hasOpenGraph ? "pass" : "warn", value: hasOpenGraph ? "Present" : "Missing", impact: "low",
    description: hasOpenGraph
      ? "Open Graph tags found — useful when running remarketing display ads and social retargeting."
      : "No Open Graph tags. If you run display or social remarketing alongside Google Ads, these improve ad previews." });

  const robotsMeta = $('meta[name="robots"]').attr("content") ?? "";
  const isBlocked = robotsMeta.includes("noindex") || robotsMeta.includes("nofollow");
  techChecks.push({ name: "Indexability / Robots", status: isBlocked ? "fail" : "pass", value: isBlocked ? robotsMeta : "Indexable", impact: "high",
    description: isBlocked
      ? "Page is blocked from indexing! Google Ads may reject this URL. Remove the noindex/nofollow tag immediately."
      : "Page is indexable — Google Ads bots can crawl and approve this landing page." });

  // ── BUILD RESULT ────────────────────────────────────────────────────────────
  const sections: AuditSection[] = [
    { title: "Landing Page Quality", score: scoreSection(lpChecks), checks: lpChecks },
    { title: "Mobile & Speed", score: scoreSection(mobileChecks), checks: mobileChecks },
    { title: "Conversion Readiness", score: scoreSection(convChecks), checks: convChecks },
    { title: "Trust & Credibility", score: scoreSection(trustChecks), checks: trustChecks },
    { title: "Technical Compatibility", score: scoreSection(techChecks), checks: techChecks },
  ];

  const overallScore = Math.round(sections.reduce((s, sec) => s + sec.score, 0) / sections.length);

  // Quality Score estimate (1-10 scale)
  const qualityScoreEstimate = Math.max(1, Math.min(10, Math.round(overallScore / 10)));

  // Top issues (from fail/warn checks, high impact first)
  const allChecks = sections.flatMap(s => s.checks);
  const topIssues = allChecks
    .filter(c => c.status !== "pass")
    .sort((a, b) => {
      const impactOrder = { high: 0, medium: 1, low: 2 };
      const statusOrder = { fail: 0, warn: 1, pass: 2 };
      return impactOrder[a.impact] - impactOrder[b.impact] || statusOrder[a.status] - statusOrder[b.status];
    })
    .slice(0, 8)
    .map(c => `${c.name}: ${c.description.split(".")[0]}`);

  // Quick wins (warn checks that are easy to fix)
  const quickWins = allChecks
    .filter(c => c.status === "warn" && c.impact !== "low")
    .slice(0, 5)
    .map(c => c.name + ": " + c.description.split(".")[0]);

  const screenshotResults = await screenshotPromises;
  const screenshots = {
    desktop: screenshotResults[0].status === "fulfilled" ? screenshotResults[0].value : null,
    mobile:  screenshotResults[1].status === "fulfilled" ? screenshotResults[1].value : null,
  };

  const result: AdsAuditResult = {
    url,
    finalUrl,
    overallScore,
    qualityScoreEstimate,
    loadTimeMs,
    pageTitle,
    metaDescription,
    sections,
    topIssues,
    quickWins,
    conversionElements,
    screenshots,
    unlockCode,
  };

  res.json(result);
});

export default router;
