import { Router, type IRouter } from "express";
import * as cheerio from "cheerio";

const router: IRouter = Router();

// ── COUNTRY CONFIG ────────────────────────────────────────────────────────────
// cpcFactor: multiply SA ZAR base CPC by this to get local currency amount
// Accounts for both exchange rate AND market competition premium
const COUNTRY_CONFIG: Record<string, {
  symbol: string;
  cpcFactor: number;
  budgetFactor: number;
  defaultLocation: string;
  cities: string[];
}> = {
  "South Africa":         { symbol: "R",    cpcFactor: 1,     budgetFactor: 1,    defaultLocation: "South Africa",   cities: ["Cape Town", "Johannesburg", "Durban", "Pretoria"] },
  "United Kingdom":       { symbol: "£",    cpcFactor: 0.14,  budgetFactor: 0.14, defaultLocation: "United Kingdom", cities: ["London", "Manchester", "Birmingham", "Edinburgh"] },
  "United States":        { symbol: "$",    cpcFactor: 0.17,  budgetFactor: 0.17, defaultLocation: "United States",  cities: ["New York", "Los Angeles", "Chicago", "Houston"] },
  "Australia":            { symbol: "A$",   cpcFactor: 0.25,  budgetFactor: 0.25, defaultLocation: "Australia",      cities: ["Sydney", "Melbourne", "Brisbane", "Perth"] },
  "United Arab Emirates": { symbol: "AED",  cpcFactor: 0.62,  budgetFactor: 0.62, defaultLocation: "UAE",            cities: ["Dubai", "Abu Dhabi", "Sharjah", "Ajman"] },
  "Canada":               { symbol: "CA$",  cpcFactor: 0.15,  budgetFactor: 0.15, defaultLocation: "Canada",         cities: ["Toronto", "Vancouver", "Montreal", "Calgary"] },
  "Germany":              { symbol: "€",    cpcFactor: 0.14,  budgetFactor: 0.14, defaultLocation: "Germany",        cities: ["Berlin", "Munich", "Hamburg", "Frankfurt"] },
  "Netherlands":          { symbol: "€",    cpcFactor: 0.15,  budgetFactor: 0.15, defaultLocation: "Netherlands",    cities: ["Amsterdam", "Rotterdam", "The Hague", "Utrecht"] },
  "New Zealand":          { symbol: "NZ$",  cpcFactor: 0.28,  budgetFactor: 0.28, defaultLocation: "New Zealand",    cities: ["Auckland", "Wellington", "Christchurch", "Hamilton"] },
  "Kenya":                { symbol: "KSh",  cpcFactor: 2.3,   budgetFactor: 2.3,  defaultLocation: "Kenya",          cities: ["Nairobi", "Mombasa", "Kisumu", "Eldoret"] },
  "Nigeria":              { symbol: "₦",    cpcFactor: 16,    budgetFactor: 16,   defaultLocation: "Nigeria",        cities: ["Lagos", "Abuja", "Port Harcourt", "Kano"] },
  "India":                { symbol: "₹",    cpcFactor: 4.7,   budgetFactor: 4.7,  defaultLocation: "India",          cities: ["Mumbai", "Delhi", "Bangalore", "Chennai"] },
  "Singapore":            { symbol: "S$",   cpcFactor: 0.075, budgetFactor: 0.075,defaultLocation: "Singapore",      cities: ["Singapore City", "Jurong", "Tampines", "Woodlands"] },
  "Ireland":              { symbol: "€",    cpcFactor: 0.14,  budgetFactor: 0.14, defaultLocation: "Ireland",        cities: ["Dublin", "Cork", "Limerick", "Galway"] },
};

// ── INDUSTRY KEYWORDS ────────────────────────────────────────────────────────
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
  "Retail & E-Commerce":    ["shop","store","retail","products","buy","purchase","online store","delivery","stock","wholesale","ecommerce","e-commerce"],
  "Agriculture":            ["farming","agriculture","livestock","crop","irrigation","fertilizer","harvest","poultry","dairy","agri"],
  "Technology Rental":      ["rental","hire","rent","equipment","lease","temporary","event tech","audiovisual","av","laptop","ipad","screen","monitor"],
  "Logistics & Transport":  ["logistics","transport","courier","freight","delivery","shipping","supply chain","fleet","distribution","warehouse"],
  "Manufacturing":          ["manufacturing","factory","production","fabrication","industrial","machinery","equipment","OEM","supplier","wholesale"],
  "Home Services":          ["home improvement","gardening","landscaping","pest control","pool","solar","aircon","hvac","appliance repair","home maintenance"],
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
  "Technology Rental":      { min: 7,  max: 22,  budget: 5000 },
  "Logistics & Transport":  { min: 6,  max: 20,  budget: 4500 },
  "Manufacturing":          { min: 5,  max: 18,  budget: 4000 },
  "Home Services":          { min: 5,  max: 18,  budget: 4000 },
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
  "Technology Rental":      ["buy","purchase","for sale","used","second hand","own","ownership"],
  "Retail & E-Commerce":    ["free","second hand","used","diy","tutorial","wikipedia","complaint"],
  "General Business":       ["free","diy","how to","tutorial","youtube","wikipedia","complaint","review"],
};

function normalizeUrl(raw: string): string {
  let url = raw.trim();
  if (!url.startsWith("http://") && !url.startsWith("https://")) url = "https://" + url;
  return url;
}

function generateUnlockCode(_domain: string): string {
  return "FortuneD21!@";
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
  if (/^[a-z]+$/.test(s) && s.length < 8) return false;
  if (/^(seo|ads|web|digital|services|solutions|home|about|contact|web design|marketing|agency)$/i.test(s)) return false;
  return true;
}

function extractBusinessName($: cheerio.CheerioAPI, title: string, domain: string): string {
  const siteName = $('meta[property="og:site_name"]').attr("content")?.trim();
  if (siteName && looksLikeBusinessName(siteName)) return siteName;
  const logo = $('[class*="logo"], [id*="logo"], [class*="brand"], [id*="brand"]').first().text().trim();
  if (logo && looksLikeBusinessName(logo)) return logo;
  const parts = title.split(/\s*[|\-–—:]\s*/).map(p => p.trim()).filter(looksLikeBusinessName);
  if (parts.length > 0) return parts.sort((a, b) => a.length - b.length)[0];
  return domain.replace(/^www\./, "").split(".")[0]
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase());
}

const SA_CITIES = ["cape town","johannesburg","durban","pretoria","port elizabeth","bloemfontein","east london","nelspruit","polokwane","kimberley","rustenburg","george","pietermaritzburg"];

function extractLocation(bodyText: string, countryOverride?: string): string {
  if (countryOverride && countryOverride !== "South Africa") {
    const cfg = COUNTRY_CONFIG[countryOverride];
    if (cfg) return cfg.cities[0] + ", " + countryOverride;
  }
  for (const city of SA_CITIES) {
    if (bodyText.toLowerCase().includes(city)) {
      return city.replace(/\b\w/g, c => c.toUpperCase()) + ", South Africa";
    }
  }
  const schemaAddress = bodyText.match(/"addressLocality"\s*:\s*"([^"]+)"/);
  if (schemaAddress) return schemaAddress[1] + ", South Africa";
  return countryOverride ?? "South Africa";
}

function extractPhone(bodyText: string): string {
  const m = bodyText.match(/(\+27|0)[0-9\s\-().]{8,16}/);
  return m ? m[0].trim() : "";
}

const NAV_JUNK_SET = new Set([
  "home","about","about us","contact","contact us","blog","news","faq","careers","gallery",
  "portfolio","login","sign in","sign up","register","menu","search","cart","services","products",
  "team","testimonials","privacy","terms","sitemap","back","next","previous",
  "whatsapp us","whatsapp","call us","email us","get a quote","get quote","free quote",
  "our work","our clients","case studies","read more","learn more","view all","see more",
  "click here","submit","send","close","follow us","follow","subscribe","newsletter",
  "share","like us","connect","social media","stay connected","get in touch","find us on",
  "connect with us","join us","share this","like this","follow us on",
  "facebook","instagram","twitter","linkedin","youtube","tiktok","pinterest","snapchat",
  "social","copyright","all rights reserved","powered by","rss","rss feed",
  "privacy policy","terms of use","terms and conditions","disclaimer","legal",
  "company registration","vat number","reg no","physical address","postal address",
  "quick links","useful links","important links","pages","navigation","site map",
  "work with us","join our team","careers","vacancies","apply now",
]);

function isJunkNavItem(text: string): boolean {
  const lower = text.toLowerCase().trim();
  if (NAV_JUNK_SET.has(lower) || NAV_JUNK_SET.has(lower + "s")) return true;
  if (text.length > 60 || text.length < 3) return true;
  // Social/verb-first patterns
  if (/^(follow|subscribe|connect|like|share|join|tweet|pin|see|view|read|click|submit|send|go to|find us|check out|visit us|contact us|call us|email us|whatsapp|book now|download|navigate|open|close|back|next|previous|scroll)/i.test(lower)) return true;
  // Contains social platform names
  if (/facebook|instagram|twitter|linkedin|youtube|tiktok|pinterest|snapchat|telegram|reddit/i.test(lower)) return true;
  // Generic filler phrases
  if (/^(we |our |the |a |get |you |is |are |all |fast|easy|no |with |designed|built|fully|since |established|founded|welcome|hello|hi |thank)/i.test(lower)) return true;
  // Phone numbers, emails, URLs, copyright
  if (/^[\+0-9\s\(\)\-]{7,}$/.test(text)) return true;
  if (/@|\.co\.za|\.com|\.net|www\./i.test(text)) return true;
  if (/©|copyright|all rights reserved/i.test(lower)) return true;
  return false;
}

// Selectors to skip — footer, sidebar, social sections never contain real services
const JUNK_SECTIONS = "footer, [class*='footer'], [id*='footer'], aside, [class*='sidebar'], [id*='sidebar'], [class*='social'], [id*='social'], [class*='follow'], [class*='copyright'], [class*='newsletter'], [class*='cookie']";

function extractServicesFromHTML(html: string, $: cheerio.CheerioAPI): string[] {
  const candidates: { text: string; score: number }[] = [];

  // 1. JSON-LD structured data — highest confidence, explicitly defined by site owner
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const json = JSON.parse($(el).text());
      const items = Array.isArray(json) ? json : [json];
      const push = (name: string) => {
        const t = name.trim();
        if (t.length >= 3 && t.length <= 60 && !isJunkNavItem(t)) candidates.push({ text: t, score: 6 });
      };
      for (const item of items) {
        if (item["@type"] === "Service" || item["@type"] === "Product") push(item.name ?? "");
        if (item?.hasOfferCatalog?.itemListElement) {
          for (const s of item.hasOfferCatalog.itemListElement) {
            push(s?.itemOffered?.name ?? s?.name ?? "");
          }
        }
        if (item["@type"] === "ItemList" && Array.isArray(item.itemListElement)) {
          for (const s of item.itemListElement) push(s?.item?.name ?? s?.name ?? "");
        }
      }
    } catch {}
  });

  // 2. Links whose URL path contains service/product/category slugs — very reliable
  $("a[href]").each((_, el) => {
    if ($(el).closest(JUNK_SECTIONS).length > 0) return;
    const href = ($(el).attr("href") ?? "").toLowerCase();
    if (/\/(service|product|solution|offering|package|shop|category|collection|industry|what-we-do|niche)s?\/[a-z0-9\-]+/.test(href)) {
      const text = $(el).text().trim();
      if (text.length >= 3 && text.length <= 60 && !isJunkNavItem(text)) candidates.push({ text, score: 5 });
    }
  });

  // 3. Headings only within main content areas — skip footer/nav/social completely
  const $main = $("main, #content, #main, [role='main'], .content, article, .page-content, [class*='main-content'], [class*='page-body']");
  const $scope = $main.length > 0 ? $main : $.root();

  $scope.find("h2, h3").each((_, el) => {
    if ($(el).closest(JUNK_SECTIONS).length > 0) return;
    // Also skip headings directly inside header/nav
    if ($(el).closest("header, nav, [class*='header'], [class*='nav']").length > 0) return;
    const text = $(el).text().trim();
    if (text.length >= 4 && text.length <= 65 && !isJunkNavItem(text)) candidates.push({ text, score: 3 });
  });

  // 4. Service/product card titles — common pattern: .card h4, .service-item h3, etc.
  $("[class*='service'], [class*='product'], [class*='offering'], [class*='package'], [class*='solution'], [class*='card']").each((_, section) => {
    if ($(section).closest(JUNK_SECTIONS).length > 0) return;
    $(section).find("h3, h4, [class*='title'], [class*='name']").first().each((_, el) => {
      const text = $(el).text().trim();
      if (text.length >= 3 && text.length <= 60 && !isJunkNavItem(text)) candidates.push({ text, score: 4 });
    });
  });

  // 5. Nav links — but ONLY those that link to service-related paths
  $("nav a, header a, [class*='menu'] a").each((_, el) => {
    const href = ($(el).attr("href") ?? "").toLowerCase();
    const text = $(el).text().trim();
    if (/\/(service|product|solution|offering|package|shop|category|collection|our-|what-we|industry)/i.test(href)) {
      if (text.length >= 3 && text.length <= 60 && !isJunkNavItem(text)) candidates.push({ text, score: 4 });
    }
  });

  // Deduplicate, sort by score, return top results
  const seen = new Set<string>();
  const unique: string[] = [];
  for (const c of candidates.sort((a, b) => b.score - a.score)) {
    const key = c.text.toLowerCase().replace(/[^a-z0-9 ]/g, "").trim();
    if (!seen.has(key) && key.length > 2 && !isJunkNavItem(c.text)) {
      seen.add(key);
      unique.push(c.text);
    }
    if (unique.length >= 12) break;
  }
  return unique;
}

// ── MULTI-PAGE CRAWLER ────────────────────────────────────────────────────────
const SERVICE_PATH_PATTERNS = /\/(service|product|solution|offering|package|shop|category|collection|what-we-do|we-do|our-work|portfolio|about|industries?|capabilities|work)/i;

async function crawlSitePages(
  homeUrl: string,
  homeHtml: string,
  $home: cheerio.CheerioAPI,
  maxPages = 5
): Promise<{ url: string; html: string; $: cheerio.CheerioAPI }[]> {
  const parsedHome = new URL(homeUrl);
  const baseHost = parsedHome.hostname;
  const ua = "Mozilla/5.0 (compatible; GoogleBot/2.1; +http://www.google.com/bot.html)";

  // Collect all internal links
  const internalLinks: { url: string; priority: number }[] = [];
  const seen = new Set<string>([parsedHome.pathname]);

  $home("a[href]").each((_, el) => {
    const href = ($home(el).attr("href") ?? "").split("#")[0].split("?")[0].trim();
    if (!href || href === "/" || href.startsWith("mailto:") || href.startsWith("tel:")) return;

    let abs: URL;
    try { abs = new URL(href, homeUrl); }
    catch { return; }

    if (abs.hostname !== baseHost) return;
    if (/\.(pdf|jpg|jpeg|png|gif|svg|webp|mp4|zip|doc|docx)$/i.test(abs.pathname)) return;
    if (seen.has(abs.pathname)) return;

    seen.add(abs.pathname);
    const priority = SERVICE_PATH_PATTERNS.test(abs.pathname) ? 2 : 1;
    internalLinks.push({ url: abs.href, priority });
  });

  // Sort: service-like paths first
  internalLinks.sort((a, b) => b.priority - a.priority);
  const toFetch = internalLinks.slice(0, maxPages);

  const results = await Promise.allSettled(
    toFetch.map(async ({ url }) => {
      const controller = new AbortController();
      const t = setTimeout(() => controller.abort(), 8000);
      try {
        const res = await fetch(url, {
          signal: controller.signal,
          headers: { "User-Agent": ua, "Accept": "text/html" },
          redirect: "follow",
        });
        clearTimeout(t);
        if (!res.ok) return null;
        const html = await res.text();
        const $ = cheerio.load(html);
        return { url, html, $ };
      } catch { clearTimeout(t); return null; }
    })
  );

  return results
    .filter(r => r.status === "fulfilled" && r.value !== null)
    .map(r => (r as PromiseFulfilledResult<{url:string;html:string;$:cheerio.CheerioAPI}>).value);
}

// ── KEYWORD + AD COPY GENERATION ─────────────────────────────────────────────
function generateKeywords(service: string, businessName: string, location: string, countryName: string): string[] {
  const s = service.toLowerCase();
  const loc = location.split(",")[0].trim();
  const biz = businessName.toLowerCase().replace(/[^a-z0-9 ]/g, "").trim();
  const country = countryName.toLowerCase();

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
    `${s} ${country}`,
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

function buildCampaigns(services: string[], businessName: string, location: string, industry: string, countryName: string): Campaign[] {
  const cpcData = INDUSTRY_CPC[industry] ?? INDUSTRY_CPC["General Business"];
  const countryCfg = COUNTRY_CONFIG[countryName] ?? COUNTRY_CONFIG["South Africa"];
  const campaigns: Campaign[] = [];

  // Apply country factors to budget
  const budget = Math.round(cpcData.budget * countryCfg.budgetFactor);
  const dailyDiv = 30;

  // Primary Search Campaign
  const primaryGroups: AdGroup[] = services.map(svc => {
    const kws = generateKeywords(svc, businessName, location, countryName);
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
    monthlyBudget: Math.round(budget * 0.6),
    dailyBudget: Math.round((budget * 0.6) / dailyDiv),
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
    monthlyBudget: Math.round(budget * 0.15),
    dailyBudget: Math.round((budget * 0.15) / dailyDiv),
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

  // Remarketing Campaign
  campaigns.push({
    name: `${businessName} — Remarketing (Past Visitors)`,
    type: "Display",
    objective: "Re-engage Website Visitors",
    monthlyBudget: Math.round(budget * 0.15),
    dailyBudget: Math.round((budget * 0.15) / dailyDiv),
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
        hl("Back for a Reason"),
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

function parseUserServices(raw: string): string[] {
  return raw
    .split(/[,\n;]+/)
    .map(s => s.trim())
    .filter(s => s.length >= 2 && s.length <= 80)
    .slice(0, 12);
}

// ── ROUTE ────────────────────────────────────────────────────────────────────
router.post("/ads-audit", async (req, res) => {
  let { url, services: rawServices, country: rawCountry } = req.body as {
    url: string; services?: string; country?: string;
  };

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
  const countryName = rawCountry && COUNTRY_CONFIG[rawCountry] ? rawCountry : "South Africa";
  const countryCfg = COUNTRY_CONFIG[countryName];

  // ── Fetch homepage ────────────────────────────────────────────────────────
  let homeHtml = "";
  let finalUrl = url;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; GoogleBot/2.1; +http://www.google.com/bot.html)",
        "Accept": "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9",
      },
      redirect: "follow",
    });
    clearTimeout(timeout);
    finalUrl = response.url || url;
    homeHtml = await response.text();
  } catch (err: any) {
    const msg = err?.name === "AbortError"
      ? "The website took too long to respond (timeout after 15s)."
      : `Could not reach the website: ${err?.message ?? "Unknown error"}`;
    res.status(400).json({ error: msg });
    return;
  }

  const $home = cheerio.load(homeHtml);
  const pageTitle = $home("title").first().text().trim();
  const homeBodyText = $home("body").text();

  // ── Multi-page crawl ─────────────────────────────────────────────────────
  const subpages = await crawlSitePages(finalUrl, homeHtml, $home, 6);

  // ── Business metadata from homepage ────────────────────────────────────
  const businessName = extractBusinessName($home, pageTitle, domain);
  const allBodyText = homeBodyText + subpages.map(p => p.$.root().text()).join(" ");
  const industry = detectIndustry(allBodyText, pageTitle);
  const location = extractLocation(allBodyText, countryName !== "South Africa" ? countryName : undefined);
  const phone = extractPhone(homeBodyText);

  // ── Service detection — priority: user-provided > scraped across all pages ─
  let services: string[] = [];

  if (rawServices && rawServices.trim().length > 0) {
    services = parseUserServices(rawServices);
  }

  if (services.length < 3) {
    // Scrape homepage
    const homeServices = extractServicesFromHTML(homeHtml, $home);
    // Scrape all crawled subpages
    const subpageServices: string[] = [];
    for (const page of subpages) {
      const pageServices = extractServicesFromHTML(page.html, page.$);
      subpageServices.push(...pageServices);
    }
    // Deduplicate merged list
    const allScraped = [...homeServices, ...subpageServices];
    const seenKeys = new Set<string>(services.map(s => s.toLowerCase()));
    for (const svc of allScraped) {
      const key = svc.toLowerCase();
      if (!seenKeys.has(key)) {
        seenKeys.add(key);
        services.push(svc);
      }
      if (services.length >= 10) break;
    }
  }

  // Fallback if still empty
  if (services.length === 0) {
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
      "Technology Rental":      ["Equipment Hire", "Event Tech Rental", "Corporate Technology"],
      "Logistics & Transport":  ["Freight Services", "Courier Delivery", "Warehousing"],
      "Home Services":          ["Home Maintenance", "Garden Services", "Electrical & Plumbing"],
      "General Business":       ["Our Services", "Consulting", "Custom Solutions"],
    };
    services = industryDefaults[industry] ?? ["Our Services", "Consulting", "Custom Solutions"];
  }

  const campaigns = buildCampaigns(services, businessName, location, industry, countryName);
  const negativeKeywords = generateNegativeKeywords(industry);

  const cpcData = INDUSTRY_CPC[industry] ?? INDUSTRY_CPC["General Business"];
  const cpcMin = Math.round(cpcData.min * countryCfg.cpcFactor * 100) / 100;
  const cpcMax = Math.round(cpcData.max * countryCfg.cpcFactor * 100) / 100;
  const totalMonthlyBudget = Math.round(cpcData.budget * countryCfg.budgetFactor);
  const estimatedClicks = {
    min: Math.round((totalMonthlyBudget / cpcMax) * 0.8),
    max: Math.round((totalMonthlyBudget / cpcMin) * 1.1),
  };

  res.json({
    url,
    finalUrl,
    businessName,
    industry,
    location,
    phone,
    country: countryName,
    currencySymbol: countryCfg.symbol,
    servicesDetected: services,
    pagesCrawled: 1 + subpages.length,
    campaigns,
    negativeKeywords,
    totalMonthlyBudget,
    expectedCPC: { min: cpcMin, max: cpcMax },
    expectedMonthlyClicks: estimatedClicks,
    unlockCode,
  });
});

export default router;
