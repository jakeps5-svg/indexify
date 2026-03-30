import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import router from "./routes";
import path from "node:path";
import { fileURLToPath } from "node:url";

const UPLOADS_DIR = (() => {
  try {
    return path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../uploads");
  } catch {
    return path.resolve(process.cwd(), "artifacts/api-server/uploads");
  }
})();

const app: Express = express();

app.set("trust proxy", true);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Shared data ─────────────────────────────────────────────────────────────

const PAGES = [
  { path: "/",                    priority: "1.0", changefreq: "weekly",  lastmod: () => iso() },
  { path: "/services/seo/",       priority: "0.9", changefreq: "monthly", lastmod: () => iso() },
  { path: "/services/google-ads/",priority: "0.9", changefreq: "monthly", lastmod: () => iso() },
  { path: "/pricing/",            priority: "0.8", changefreq: "monthly", lastmod: () => iso() },
  { path: "/contact/",            priority: "0.8", changefreq: "monthly", lastmod: () => iso() },
  { path: "/audit/",              priority: "0.8", changefreq: "monthly", lastmod: () => iso() },
  { path: "/serp-checker/",       priority: "0.8", changefreq: "monthly", lastmod: () => iso() },
  { path: "/ads-audit/",          priority: "0.7", changefreq: "monthly", lastmod: () => iso() },
  { path: "/cape-town/",          priority: "0.8", changefreq: "monthly", lastmod: () => iso() },
  { path: "/johannesburg/",       priority: "0.8", changefreq: "monthly", lastmod: () => iso() },
  { path: "/durban/",             priority: "0.8", changefreq: "monthly", lastmod: () => iso() },
  { path: "/pretoria/",           priority: "0.8", changefreq: "monthly", lastmod: () => iso() },
  { path: "/port-elizabeth/",     priority: "0.8", changefreq: "monthly", lastmod: () => iso() },
  { path: "/privacy-policy/",     priority: "0.3", changefreq: "yearly",  lastmod: () => "2026-03-18T00:00:00+02:00" },
  { path: "/terms-of-use/",       priority: "0.3", changefreq: "yearly",  lastmod: () => "2026-03-18T00:00:00+02:00" },
];

const CATEGORIES = [
  { path: "/blog/",     priority: "0.8", changefreq: "weekly",  lastmod: () => iso() },
  { path: "/services/", priority: "0.8", changefreq: "monthly", lastmod: () => iso() },
];

const POSTS = [
  { path: "/blog/why-your-business-isnt-ranking-on-google/",      lastmod: "2026-03-17T00:00:00+02:00" },
  { path: "/blog/local-seo-south-africa-google-maps/",            lastmod: "2026-03-10T00:00:00+02:00" },
  { path: "/blog/technical-seo-checklist-south-africa/",          lastmod: "2026-03-03T00:00:00+02:00" },
  { path: "/blog/what-is-on-page-seo/",                           lastmod: "2026-02-24T00:00:00+02:00" },
  { path: "/blog/backlinks-domain-authority-south-africa/",       lastmod: "2026-02-17T00:00:00+02:00" },
  { path: "/blog/seo-vs-google-ads/",                             lastmod: "2026-02-10T00:00:00+02:00" },
  { path: "/blog/how-long-does-seo-take/",                        lastmod: "2026-02-03T00:00:00+02:00" },
  { path: "/blog/keyword-research-south-african-businesses/",     lastmod: "2026-01-27T00:00:00+02:00" },
  { path: "/blog/core-web-vitals-google-ranking/",                lastmod: "2026-01-20T00:00:00+02:00" },
  { path: "/blog/seo-content-that-ranks-and-converts/",           lastmod: "2026-01-13T00:00:00+02:00" },
  { path: "/blog/schema-markup-explained/",                       lastmod: "2026-01-06T00:00:00+02:00" },
  { path: "/blog/google-ads-vs-facebook-ads/",                    lastmod: "2025-12-30T00:00:00+02:00" },
  { path: "/blog/google-ads-budget-south-africa/",                lastmod: "2025-12-23T00:00:00+02:00" },
  { path: "/blog/google-ads-quality-score/",                      lastmod: "2025-12-16T00:00:00+02:00" },
  { path: "/blog/smart-bidding-strategies-google-ads/",           lastmod: "2025-12-09T00:00:00+02:00" },
  { path: "/blog/google-ads-copy-that-converts/",                 lastmod: "2025-12-02T00:00:00+02:00" },
  { path: "/blog/google-ads-conversion-tracking/",                lastmod: "2025-11-25T00:00:00+02:00" },
  { path: "/blog/google-ads-mistakes-south-african-businesses/",  lastmod: "2025-11-18T00:00:00+02:00" },
  { path: "/blog/negative-keywords-stop-wasted-spend/",           lastmod: "2025-11-11T00:00:00+02:00" },
  { path: "/blog/google-ads-remarketing/",                        lastmod: "2025-11-04T00:00:00+02:00" },
  { path: "/blog/google-ads-campaign-structure-roi/",             lastmod: "2025-10-28T00:00:00+02:00" },
  { path: "/blog/digital-marketing-south-african-smes/",          lastmod: "2025-10-21T00:00:00+02:00" },
  { path: "/blog/generate-more-leads-online-2025/",               lastmod: "2025-10-14T00:00:00+02:00" },
  { path: "/blog/seo-vs-sem-south-africa/",                       lastmod: "2025-10-07T00:00:00+02:00" },
  { path: "/blog/website-conversion-rate-optimisation/",          lastmod: "2025-09-30T00:00:00+02:00" },
  { path: "/blog/page-speed-seo-google-ads/",                     lastmod: "2025-09-23T00:00:00+02:00" },
  { path: "/blog/track-roi-digital-marketing/",                   lastmod: "2025-09-16T00:00:00+02:00" },
  { path: "/blog/content-marketing-and-seo/",                     lastmod: "2025-09-09T00:00:00+02:00" },
  { path: "/blog/rank-google-page-1-south-africa/",               lastmod: "2025-09-02T00:00:00+02:00" },
  { path: "/blog/why-competitor-ranks-higher/",                   lastmod: "2025-08-26T00:00:00+02:00" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function iso() {
  return new Date().toISOString().replace(/\.\d{3}Z$/, "+02:00");
}

function getBase(req: Request) {
  const proto = req.headers["x-forwarded-proto"] ?? req.protocol ?? "https";
  const host  = req.headers["x-forwarded-host"] ?? req.headers.host ?? "indexify.co.za";
  return `${proto}://${host}`;
}

function urlsetXml(entries: string[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join("\n")}
</urlset>`;
}

function urlEntry(loc: string, lastmod: string, changefreq: string, priority: string) {
  return `<url>
  <loc>${loc}</loc>
  <lastmod>${lastmod}</lastmod>
  <changefreq>${changefreq}</changefreq>
  <priority>${priority}</priority>
</url>`;
}

function sendXml(res: Response, xml: string) {
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(xml);
}

// ─── Sitemap Index ─────────────────────────────────────────────────────────────

app.get("/sitemap_index.xml", (req: Request, res: Response) => {
  const base = getBase(req);
  const now  = iso();
  const xml  = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${base}/page-sitemap.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${base}/post-sitemap.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${base}/category-sitemap.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
</sitemapindex>`;
  sendXml(res, xml);
});

// ─── Page Sitemap (core pages, services, city pages, legal) ──────────────────

app.get("/page-sitemap.xml", (req: Request, res: Response) => {
  const base = getBase(req);
  const entries = PAGES.map(p =>
    urlEntry(`${base}${p.path}`, p.lastmod(), p.changefreq, p.priority)
  );
  sendXml(res, urlsetXml(entries));
});

// ─── Post Sitemap (blog articles) ─────────────────────────────────────────────

app.get("/post-sitemap.xml", (req: Request, res: Response) => {
  const base = getBase(req);
  const entries = POSTS.map(p =>
    urlEntry(`${base}${p.path}`, p.lastmod, "monthly", "0.7")
  );
  sendXml(res, urlsetXml(entries));
});

// ─── Category Sitemap (section/taxonomy index pages) ─────────────────────────

app.get("/category-sitemap.xml", (req: Request, res: Response) => {
  const base = getBase(req);
  const entries = CATEGORIES.map(p =>
    urlEntry(`${base}${p.path}`, p.lastmod(), p.changefreq, p.priority)
  );
  sendXml(res, urlsetXml(entries));
});

// ─── Full Sitemap (all URLs combined — backwards compatible) ──────────────────

app.get("/sitemap.xml", (req: Request, res: Response) => {
  const base = getBase(req);
  const allPages = [
    ...PAGES.map(p => urlEntry(`${base}${p.path}`, p.lastmod(), p.changefreq, p.priority)),
    ...CATEGORIES.map(p => urlEntry(`${base}${p.path}`, p.lastmod(), p.changefreq, p.priority)),
    ...POSTS.map(p => urlEntry(`${base}${p.path}`, p.lastmod, "monthly", "0.7")),
  ];
  sendXml(res, urlsetXml(allPages));
});

// ─── robots.txt ───────────────────────────────────────────────────────────────

app.get("/robots.txt", (req: Request, res: Response) => {
  const base = getBase(req);
  const txt = `User-agent: *
Allow: /

Sitemap: ${base}/sitemap_index.xml
Sitemap: ${base}/page-sitemap.xml
Sitemap: ${base}/post-sitemap.xml
Sitemap: ${base}/category-sitemap.xml`;

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(txt);
});

app.use("/api/uploads", express.static(UPLOADS_DIR, { maxAge: "7d" }));
app.use("/api", router);

export default app;
