import { Router, type IRouter } from "express";
import * as cheerio from "cheerio";
import * as crypto from "crypto";

const router: IRouter = Router();

// ── INDUSTRY DETECTION ───────────────────────────────────────────────────────
const INDUSTRY_KEYWORDS: Record<string, string[]> = {
  "Healthcare & Medical":   ["doctor","medical","health","clinic","dentist","pharmacy","hospital","therapy","physiotherapy","chiropractic","specialist","gp","nursing","optometrist","dietitian"],
  "Legal Services":         ["attorney","lawyer","law firm","legal","advocate","solicitor","paralegal","conveyancing","litigation","divorce"],
  "Construction & Trades":  ["construction","building","contractor","renovation","plumbing","electrical","roofing","painting","tiling","carpentry","bricklaying","handyman","builder"],
  "Education & Training":   ["school","college","academy","tutoring","training","course","education","coaching","lecturer","e-learning","workshop"],
  "Real Estate":            ["property","real estate","estate agent","letting","rental","apartment","house","bond","mortgage","sectional title"],
  "Automotive":             ["car","vehicle","auto","motor","mechanic","tyre","panel beating","exhaust","service centre","detailing","accessories"],
  "Food & Beverage":        ["restaurant","food","catering","bakery","café","takeaway","delivery","chef","meals","cuisine","drinks","bar"],
  "Financial Services":     ["financial","insurance","accounting","tax","bookkeeping","investment","wealth","advisory","broker","pension","audit"],
  "Digital & Technology":   ["marketing","seo","google ads","social media","web design","digital","software","it support","app","cyber","cloud","development"],
  "Beauty & Wellness":      ["salon","beauty","spa","nail","hair","aesthetics","makeup","massage","skincare","lashes","waxing","microblading"],
  "Cleaning Services":      ["cleaning","domestic","commercial cleaning","carpet cleaning","laundry","hygiene","sanitising","spring clean"],
  "Security Services":      ["security","alarm","cctv","access control","guard","surveillance","electric fence","biometric","patrol"],
  "Travel & Tourism":       ["travel","tourism","tour","accommodation","hotel","lodge","safari","holiday","booking","airport","transfers"],
  "Events & Entertainment": ["events","wedding","photography","venue","catering","dj","entertainment","birthday","conference","function"],
  "Retail & E-Commerce":    ["shop","store","retail","products","buy","purchase","online store","delivery","stock","wholesale"],
  "Agriculture":            ["farming","agriculture","livestock","crop","irrigation","fertilizer","harvest","poultry","dairy","agri"],
};

const INDUSTRY_CPC: Record<string, { min: number; max: number; budget: number }> = {
  "Healthcare & Medical":   { min: 12, max: 40, budget: 6000 },
  "Legal Services":         { min: 25, max: 100, budget: 12000 },
  "Construction & Trades":  { min: 6,  max: 22,  budget: 4500 },
  "Financial Services":     { min: 18, max: 70,  budget: 10000 },
  "Real Estate":            { min: 12, max: 45,  budget: 7000 },
  "Digital & Technology":   { min: 10, max: 35,  budget: 6000 },
  "Automotive":             { min: 5,  max: 18,  budget: 4000 },
  "Beauty & Wellness":      { min: 4,  max: 15,  budget: 3500 },
  "Education & Training":   { min: 6,  max: 20,  budget: 4500 },
  "Security Services":      { min: 8,  max: 28,  budget: 5000 },
  "Cleaning Services":      { min: 4,  max: 14,  budget: 3000 },
  "Events & Entertainment": { min: 5,  max: 18,  budget: 4000 },
  "Travel & Tourism":       { min: 8,  max: 30,  budget: 5500 },
  "Food & Beverage":        { min: 4,  max: 14,  budget: 3500 },
  "Retail & E-Commerce":    { min: 4,  max: 18,  budget: 4500 },
  "Agriculture":            { min: 5,  max: 16,  budget: 3500 },
  "General Business":       { min: 5,  max: 20,  budget: 4000 },
};

const NEGATIVE_KEYWORDS_BY_INDUSTRY: Record<string, string[]> = {
  "Healthcare & Medical":   ["free","diy","how to","wikipedia","youtube","home remedy","symptoms","webmd"],
  "Legal Services":         ["free legal advice","diy","pro se","lawsuit","malpractice","complaint","bad lawyer"],
  "Construction & Trades":  ["diy","how to","youtube","tutorial","free","second hand","used"],
  "Financial Services":     ["free","scam","complaint","bad","worst","review","wikipedia","tutorial"],
  "Real Estate":            ["rent free","squat","free house","wikipedia","diy","how to sell"],
  "Digital & Technology":   ["free","crack","pirate","torrent","open source","wikipedia","tutorial"],
  "Beauty & Wellness":      ["diy","how to","tutorial","youtube","free","homemade","cheap","ingredients"],
  "Cleaning Services":      ["diy","how to","recipe","homemade","cheap tricks","free tips","wikipedia"],
  "General Business":       ["free","diy","how to","tutorial","youtube","wikipedia","complaint","review"],
};

const SA_CITIES = ["cape town","johannesburg","durban","pretoria","port elizabeth","bloemfontein","east london","nelspruit","polokwane","kimberley","rustenburg","george","pietermaritzburg"];

function normalizeUrl(raw: string): string {
  let url = raw.trim();
  if (!url.startsWith("http://") && !url.startsWith("https://")) url = "https://" + url;
  return url;
}

function generateUnlockCode(domain: string): string {
  const secret = `fd-proposal-${domain}-2025`;
  return crypto.createHash("sha256").update(secret).digest("hex").slice(0, 8).toUpperCase();
}

function detectIndustry(text: string, title: string): string {
  const combined = (text + " " + title).toLowerCase();
  let best = "General Business";
  let bestScore = 0;
  for (const [industry, keywords] of Object.entries(INDUSTRY_KEYWORDS)) {
    const score = keywords.filter(k => combined.includes(k)).length;
    if (score > bestScore) { bestScore = score; best = industry; }
  }
  return best;
}

function looksLikeBusinessName(s: string): boolean {
  if (s.length < 4 || s.length > 45) return false;
  // Reject all-lowercase single common words
  if (/^[a-z]+$/.test(s) && s.length < 8) return false;
  // Reject generic marketing words / standalone terms
  if (/^(seo|ads|web|digital|services|solutions|home|about|contact|web design|marketing|agency)$/i.test(s)) return false;
  return true;
}

function extractBusinessName($: cheerio.CheerioAPI, title: string, domain: string): string {
  // og:site_name is usually the cleanest
  const siteName = $('meta[property="og:site_name"]').attr("content")?.trim();
  if (siteName && looksLikeBusinessName(siteName)) return siteName;

  // Logo text — only trust it if it's short and clean
  const logo = $('[class*="logo"], [id*="logo"], [class*="brand"], [id*="brand"]').first().text().trim();
  if (logo && looksLikeBusinessName(logo)) return logo;

  // Page title — prefer segments that look like a proper business name
  const parts = title.split(/\s*[|\-–—:]\s*/).map(p => p.trim()).filter(looksLikeBusinessName);
  // Return the shortest qualifying segment (usually the brand name)
  if (parts.length > 0) {
    return parts.sort((a, b) => a.length - b.length)[0];
  }

  // Domain-based fallback
  return domain.replace(/^www\./, "").split(".")[0]
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase());
}

function extractLocation(bodyText: string): string {
  for (const city of SA_CITIES) {
    if (bodyText.toLowerCase().includes(city)) {
      return city.replace(/\b\w/g, c => c.toUpperCase()) + ", South Africa";
    }
  }
  const schemaAddress = bodyText.match(/"addressLocality"\s*:\s*"([^"]+)"/);
  if (schemaAddress) return schemaAddress[1] + ", South Africa";
  return "South Africa";
}

function extractPhone(bodyText: string): string {
  const m = bodyText.match(/(\+27|0)[0-9\s\-().]{8,16}/);
  return m ? m[0].trim() : "";
}

const NAV_JUNK = ["home","about","about us","contact","contact us","blog","news","faq","careers","gallery","portfolio","login","sign in","register","menu","search","cart","services","products","team","testimonials","privacy","terms","sitemap","back","next","previous","whatsapp us","whatsapp","call us","email us","get a quote","get quote","free quote","our work","our clients","case studies","read more","learn more","view all","see more","click here"];

function isJunkNavItem(text: string): boolean {
  if (NAV_JUNK.some(j => text.toLowerCase() === j || text.toLowerCase() === j + "s")) return true;
  // Filter long marketing phrases (likely not service names)
  if (text.length > 55) return true;
  // Filter sentences (contain common connector words at start)
  if (/^(we |our |the |a |get |you |is |are |all |fast|easy|no |with |designed|built|fully)/i.test(text)) return true;
  return false;
}

function extractServicesFromSite(html: string, $: cheerio.CheerioAPI, bodyText: string, industry: string): string[] {
  const candidates: { text: string; score: number }[] = [];

  // 1. Nav/menu links (drop-down items especially)
  $("nav a, header a, [class*='menu'] a, [class*='nav'] a").each((_, el) => {
    const text = $(el).text().trim();
    if (text.length >= 3 && text.length <= 60 && !isJunkNavItem(text)) {
      candidates.push({ text, score: 2 });
    }
  });

  // 2. H2/H3 headings in service-like sections
  $("h2, h3").each((_, el) => {
    const text = $(el).text().trim();
    if (text.length >= 4 && text.length <= 80 && !isJunkNavItem(text)) {
      candidates.push({ text, score: 3 });
    }
  });

  // 3. Schema.org Service / Product names
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const json = JSON.parse($(el).text());
      const items = Array.isArray(json) ? json : [json];
      for (const item of items) {
        if (item["@type"] === "Service" || item["@type"] === "Product" || item["@type"] === "ItemList") {
          if (item.name) candidates.push({ text: item.name, score: 5 });
          if (item.hasOfferCatalog?.itemListElement) {
            for (const s of item.hasOfferCatalog.itemListElement) {
              if (s.name) candidates.push({ text: s.name, score: 5 });
            }
          }
        }
      }
    } catch {}
  });

  // 4. Links that look like service/product pages
  $("a[href]").each((_, el) => {
    const href = ($(el).attr("href") ?? "").toLowerCase();
    if (/\/(service|product|solution|offering|package)s?\/[a-z\-]+/.test(href)) {
      const text = $(el).text().trim();
      if (text.length >= 3 && text.length <= 60) candidates.push({ text, score: 4 });
    }
  });

  // Deduplicate and clean
  const seen = new Set<string>();
  const unique: string[] = [];
  const sorted = candidates.sort((a, b) => b.score - a.score);
  for (const c of sorted) {
    const key = c.text.toLowerCase().replace(/[^a-z0-9 ]/g, "").trim();
    if (!seen.has(key) && key.length > 2 && !isJunkNavItem(c.text)) {
      seen.add(key);
      unique.push(c.text);
    }
    if (unique.length >= 8) break;
  }

  // Fallback: industry-specific default services
  if (unique.length < 2) {
    const industryDefaults: Record<string, string[]> = {
      "Healthcare & Medical":   ["General Practitioner", "Specialist Consultations", "Preventative Healthcare"],
      "Legal Services":         ["Contract Law", "Family Law", "Commercial Litigation"],
      "Construction & Trades":  ["Residential Renovation", "Commercial Construction", "Project Management"],
      "Financial Services":     ["Tax Consulting", "Accounting Services", "Financial Planning"],
      "Real Estate":            ["Property Sales", "Property Rentals", "Property Management"],
      "Digital & Technology":   ["Website Design", "SEO Services", "Google Ads Management"],
      "Automotive":             ["Vehicle Servicing", "Mechanical Repairs", "Tyres & Fitment"],
      "Beauty & Wellness":      ["Hair Styling", "Beauty Treatments", "Spa Packages"],
      "Education & Training":   ["Corporate Training", "Online Courses", "Tutoring Services"],
      "Security Services":      ["Alarm Systems", "CCTV Installation", "Access Control"],
      "Cleaning Services":      ["Residential Cleaning", "Commercial Cleaning", "Deep Cleaning"],
      "Events & Entertainment": ["Wedding Planning", "Event Decor", "Photography"],
      "Travel & Tourism":       ["Tour Packages", "Accommodation", "Airport Transfers"],
      "Food & Beverage":        ["Restaurant Dining", "Catering Services", "Food Delivery"],
      "Retail & E-Commerce":    ["Online Store", "Product Catalogue", "Same-Day Delivery"],
      "General Business":       ["Our Services", "Consulting", "Custom Solutions"],
    };
    return industryDefaults[industry] ?? ["Our Services", "Consulting", "Custom Solutions"];
  }

  return unique;
}

function generateKeywords(service: string, businessName: string, location: string, industry: string): string[] {
  const s = service.toLowerCase();
  const loc = location.split(",")[0].trim();
  const biz = businessName.toLowerCase().replace(/[^a-z0-9 ]/g, "").trim();

  const kws = [
    s,
    `${s} ${loc}`,
    `best ${s}`,
    `${s} near me`,
    `professional ${s}`,
    `affordable ${s}`,
    `top ${s} in ${loc}`,
    `${s} company`,
    `${s} services`,
    `${s} specialist`,
    `best ${s} in ${loc}`,
    `${s} pricing`,
    `${s} quote`,
    `free ${s} consultation`,
    `${s} experts`,
    `trusted ${s}`,
    `reliable ${s}`,
    `hire ${s}`,
    `get ${s}`,
    `${s} help`,
    `how much does ${s} cost`,
    `${s} cost`,
    `${s} rates`,
    `${s} packages`,
    `${s} for businesses`,
    `local ${s}`,
    `${s} ${loc} price`,
    `${loc} ${s}`,
    `${s} south africa`,
    `${biz} ${s}`,
  ];
  return [...new Set(kws.filter(k => k.length > 3))].slice(0, 30);
}

function hl(s: string): string { return s.slice(0, 30); }
function desc(s: string): string { return s.slice(0, 90); }

function generateAdCopy(service: string, businessName: string, location: string): { headlines: string[]; descriptions: string[] } {
  const svc = service;
  const biz = businessName.length > 1 ? businessName : "We";
  const loc = location.split(",")[0].trim();

  return {
    headlines: [
      hl(`${svc} in ${loc}`),
      hl(`Professional ${svc}`),
      hl(`Affordable ${svc}`),
      hl(`Top-Rated ${svc}`),
      hl(`${biz} | ${svc}`),
      hl(`Expert ${svc} Services`),
      hl(`Get a Free Quote Today`),
      hl(`Call Us Now`),
      hl(`Trusted & Certified`),
      hl(`Results Guaranteed`),
      hl(`Fast & Reliable Service`),
      hl(`No Hidden Fees`),
      hl(`Free Consultation`),
      hl(`Book Online Now`),
      hl(`Serving ${loc}`),
    ],
    descriptions: [
      desc(`Looking for ${svc.toLowerCase()} in ${loc}? ${biz} delivers professional results at competitive prices. Get your free quote today.`),
      desc(`${biz} specialises in ${svc.toLowerCase()} with guaranteed results. Serving ${loc} and surroundings. Contact us for a free consultation.`),
      desc(`Rated top ${svc.toLowerCase()} provider in ${loc}. Fast, reliable and affordable. Book online or call us today for immediate assistance.`),
      desc(`Don't overpay for ${svc.toLowerCase()}. ${biz} offers transparent pricing and professional service. Get your free assessment now.`),
    ],
  };
}

interface AdGroup {
  name: string;
  previewKeywords: string[];
  keywords: string[];
  headlines: string[];
  descriptions: string[];
}

interface Campaign {
  name: string;
  type: string;
  objective: string;
  monthlyBudget: number;
  dailyBudget: number;
  biddingStrategy: string;
  adGroups: AdGroup[];
}

function buildCampaigns(services: string[], businessName: string, location: string, industry: string): Campaign[] {
  const cpcData = INDUSTRY_CPC[industry] ?? INDUSTRY_CPC["General Business"];
  const campaigns: Campaign[] = [];

  // Primary Search Campaign (covers all services)
  const primaryGroups: AdGroup[] = services.map(svc => {
    const kws = generateKeywords(svc, businessName, location, industry);
    const copy = generateAdCopy(svc, businessName, location);
    return {
      name: svc,
      previewKeywords: kws.slice(0, 5),
      keywords: kws,
      headlines: copy.headlines,
      descriptions: copy.descriptions,
    };
  });

  campaigns.push({
    name: `${businessName} — Search (All Services)`,
    type: "Search",
    objective: "Leads & Enquiries",
    monthlyBudget: Math.round(cpcData.budget * 0.6),
    dailyBudget: Math.round((cpcData.budget * 0.6) / 30),
    biddingStrategy: "Maximise Conversions",
    adGroups: primaryGroups,
  });

  // Branded Campaign
  const brandKws = [
    businessName.toLowerCase(),
    `${businessName.toLowerCase()} reviews`,
    `${businessName.toLowerCase()} contact`,
    `${businessName.toLowerCase()} services`,
    `${businessName.toLowerCase()} ${location.split(",")[0].toLowerCase()}`,
  ];
  campaigns.push({
    name: `${businessName} — Brand Protection`,
    type: "Search",
    objective: "Brand Awareness & Direct Traffic",
    monthlyBudget: Math.round(cpcData.budget * 0.15),
    dailyBudget: Math.round((cpcData.budget * 0.15) / 30),
    biddingStrategy: "Target Impression Share (Top of Page)",
    adGroups: [{
      name: `${businessName} Brand Terms`,
      previewKeywords: brandKws.slice(0, 3),
      keywords: brandKws,
      headlines: [
        hl(`${businessName} — Official`),
        hl(`${businessName} | ${services[0] ?? "Services"}`),
        hl("Contact Us Directly"),
        hl("Get a Free Quote"),
        hl("Trusted & Established"),
        hl(`Serving ${location.split(",")[0]}`),
        hl("Book Online Today"),
        hl("Call Us Now"),
        hl("Fast Response"),
        hl("Industry Leaders"),
        hl("Certified Professionals"),
        hl("No Commitment Needed"),
        hl("Free Consultation"),
        hl("Top Rated"),
        hl("Results Driven"),
      ],
      descriptions: [
        desc(`${businessName} is the official provider of ${services[0]?.toLowerCase() ?? "professional services"} in ${location.split(",")[0]}. Book your free consultation today.`),
        desc(`Contact ${businessName} directly for the best rates and professional service. We serve ${location} and surrounding areas.`),
        desc(`${businessName} — your trusted local provider. Fast response, competitive pricing, and guaranteed results every time.`),
        desc(`Book directly with ${businessName} for exclusive rates. Professional ${services[0]?.toLowerCase() ?? "service"} in ${location.split(",")[0]}.`),
      ],
    }],
  });

  // Remarketing / Display Campaign
  campaigns.push({
    name: `${businessName} — Remarketing (Past Visitors)`,
    type: "Display",
    objective: "Re-engage Website Visitors",
    monthlyBudget: Math.round(cpcData.budget * 0.15),
    dailyBudget: Math.round((cpcData.budget * 0.15) / 30),
    biddingStrategy: "Target CPA",
    adGroups: [{
      name: "All Website Visitors — 30 Days",
      previewKeywords: ["Remarketing audience", "Website visitors", "Past enquirers"],
      keywords: ["Remarketing audience — all visitors (30 days)", "Visitors who viewed service pages", "Cart abandoners / form starters"],
      headlines: [
        hl(`Still Need ${services[0] ?? "Help"}?`),
        hl(`${businessName} — Get a Quote`),
        hl("We're Ready to Help"),
        hl("Limited Availability"),
        hl("Book Your Slot Today"),
        hl("Don't Miss Out"),
        hl("Free Consultation Waiting"),
        hl("Contact Us Now"),
        hl("Fast & Affordable"),
        hl("Trusted by Many"),
        hl("Professional Results"),
        hl("Call or WhatsApp"),
        hl("Same-Day Response"),
        hl("Get Started Today"),
        hl(`Back for a Reason`),
      ],
      descriptions: [
        desc(`You visited ${businessName} recently — we'd love to help. Get your free quote today with no commitment.`),
        desc(`Don't let ${services[0]?.toLowerCase() ?? "your needs"} wait. ${businessName} has availability this week. Book your slot today.`),
        desc(`${businessName} is ready to assist you. Fast, professional, and affordable. Reach out today for your free consultation.`),
        desc(`We noticed you're interested in ${services[0]?.toLowerCase() ?? "our services"}. Book now and get your free proposal.`),
      ],
    }],
  });

  return campaigns;
}

function generateNegativeKeywords(industry: string): string[] {
  return [
    ...(NEGATIVE_KEYWORDS_BY_INDUSTRY[industry] ?? NEGATIVE_KEYWORDS_BY_INDUSTRY["General Business"]),
    "free download","template","sample","example","definition","meaning","vs","comparison","alternative",
    "reddit","quora","facebook","instagram","twitter","linkedin","youtube","tiktok",
    "jobs","vacancy","career","internship","hire me","cv","resume",
    "lawsuit","complaint","fraud","scam","fake","illegal",
  ];
}

router.post("/ads-audit", async (req, res) => {
  let { url } = req.body as { url: string };
  if (!url || typeof url !== "string") {
    res.status(400).json({ error: "URL is required" });
    return;
  }

  url = normalizeUrl(url);

  let parsedUrl: URL;
  try { parsedUrl = new URL(url); }
  catch { res.status(400).json({ error: "Invalid URL. Please enter a valid website address." }); return; }

  const domain = parsedUrl.hostname.replace(/^www\./, "");
  const unlockCode = generateUnlockCode(domain);

  let html = "";
  let finalUrl = url;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml",
        "Accept-Language": "en-ZA,en;q=0.9",
      },
      redirect: "follow",
    });
    clearTimeout(timeout);
    finalUrl = response.url || url;
    html = await response.text();
  } catch (err: any) {
    const msg = err?.name === "AbortError"
      ? "The website took too long to respond (timeout after 15s)."
      : `Could not reach the website: ${err?.message ?? "Unknown error"}`;
    res.status(400).json({ error: msg });
    return;
  }

  const $ = cheerio.load(html);
  const bodyText = $("body").text();

  const pageTitle = $("title").first().text().trim();
  const businessName = extractBusinessName($, pageTitle, domain);
  const industry = detectIndustry(bodyText, pageTitle);
  const location = extractLocation(bodyText);
  const phone = extractPhone(bodyText);
  const services = extractServicesFromSite(html, $, bodyText, industry);
  const campaigns = buildCampaigns(services, businessName, location, industry);
  const negativeKeywords = generateNegativeKeywords(industry);

  const cpcData = INDUSTRY_CPC[industry] ?? INDUSTRY_CPC["General Business"];
  const totalMonthlyBudget = cpcData.budget;
  const avgCPC = (cpcData.min + cpcData.max) / 2;
  const estimatedClicks = {
    min: Math.round((totalMonthlyBudget / cpcData.max) * 0.8),
    max: Math.round((totalMonthlyBudget / cpcData.min) * 1.1),
  };

  res.json({
    url,
    finalUrl,
    businessName,
    industry,
    location,
    phone,
    servicesDetected: services,
    campaigns,
    negativeKeywords,
    totalMonthlyBudget,
    expectedCPC: { min: cpcData.min, max: cpcData.max },
    expectedMonthlyClicks: estimatedClicks,
    unlockCode,
  });
});

export default router;
