import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import router from "./routes";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = path.join(__dirname, "../../uploads");

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Dynamic sitemap — uses the actual request host so it works on any domain
app.get("/sitemap.xml", (req: Request, res: Response) => {
  const proto = req.headers["x-forwarded-proto"] ?? req.protocol ?? "https";
  const host = req.headers["x-forwarded-host"] ?? req.headers.host ?? "indexify.co.za";
  const base = `${proto}://${host}`;

  // ISO 8601 with SAST offset (+02:00)
  const isoNow = new Date().toISOString().replace(/\.\d{3}Z$/, "+02:00");

  const pages = [
    { path: "/",                    priority: "1",   changefreq: "weekly",  lastmod: isoNow },
    { path: "/services/seo/",       priority: "0.9", changefreq: "monthly", lastmod: isoNow },
    { path: "/services/google-ads/",priority: "0.9", changefreq: "monthly", lastmod: isoNow },
    { path: "/pricing/",            priority: "0.8", changefreq: "monthly", lastmod: isoNow },
    { path: "/contact/",            priority: "0.8", changefreq: "monthly", lastmod: isoNow },
    { path: "/blog/",               priority: "0.8", changefreq: "weekly",  lastmod: isoNow },
    { path: "/audit/",              priority: "0.8", changefreq: "monthly", lastmod: isoNow },
    { path: "/serp-checker/",       priority: "0.8", changefreq: "monthly", lastmod: isoNow },
    { path: "/ads-audit/",          priority: "0.7", changefreq: "monthly", lastmod: isoNow },
    { path: "/cape-town/",          priority: "0.8", changefreq: "monthly", lastmod: isoNow },
    { path: "/johannesburg/",       priority: "0.8", changefreq: "monthly", lastmod: isoNow },
    { path: "/durban/",             priority: "0.8", changefreq: "monthly", lastmod: isoNow },
    { path: "/pretoria/",           priority: "0.8", changefreq: "monthly", lastmod: isoNow },
    { path: "/port-elizabeth/",     priority: "0.8", changefreq: "monthly", lastmod: isoNow },
    { path: "/privacy-policy/",     priority: "0.3", changefreq: "yearly",  lastmod: isoNow },
    { path: "/terms-of-use/",       priority: "0.3", changefreq: "yearly",  lastmod: isoNow },
    // Blog posts
    { path: "/blog/why-your-business-isnt-ranking-on-google/",      priority: "0.7", changefreq: "monthly", lastmod: "2026-03-17T00:00:00+02:00" },
    { path: "/blog/local-seo-south-africa-google-maps/",            priority: "0.7", changefreq: "monthly", lastmod: "2026-03-10T00:00:00+02:00" },
    { path: "/blog/technical-seo-checklist-south-africa/",          priority: "0.7", changefreq: "monthly", lastmod: "2026-03-03T00:00:00+02:00" },
    { path: "/blog/what-is-on-page-seo/",                           priority: "0.7", changefreq: "monthly", lastmod: "2026-02-24T00:00:00+02:00" },
    { path: "/blog/backlinks-domain-authority-south-africa/",       priority: "0.7", changefreq: "monthly", lastmod: "2026-02-17T00:00:00+02:00" },
    { path: "/blog/seo-vs-google-ads/",                             priority: "0.7", changefreq: "monthly", lastmod: "2026-02-10T00:00:00+02:00" },
    { path: "/blog/how-long-does-seo-take/",                        priority: "0.7", changefreq: "monthly", lastmod: "2026-02-03T00:00:00+02:00" },
    { path: "/blog/keyword-research-south-african-businesses/",     priority: "0.7", changefreq: "monthly", lastmod: "2026-01-27T00:00:00+02:00" },
    { path: "/blog/core-web-vitals-google-ranking/",                priority: "0.7", changefreq: "monthly", lastmod: "2026-01-20T00:00:00+02:00" },
    { path: "/blog/seo-content-that-ranks-and-converts/",           priority: "0.7", changefreq: "monthly", lastmod: "2026-01-13T00:00:00+02:00" },
    { path: "/blog/schema-markup-explained/",                       priority: "0.7", changefreq: "monthly", lastmod: "2026-01-06T00:00:00+02:00" },
    { path: "/blog/google-ads-vs-facebook-ads/",                    priority: "0.7", changefreq: "monthly", lastmod: "2025-12-30T00:00:00+02:00" },
    { path: "/blog/google-ads-budget-south-africa/",                priority: "0.7", changefreq: "monthly", lastmod: "2025-12-23T00:00:00+02:00" },
    { path: "/blog/google-ads-quality-score/",                      priority: "0.7", changefreq: "monthly", lastmod: "2025-12-16T00:00:00+02:00" },
    { path: "/blog/smart-bidding-strategies-google-ads/",           priority: "0.7", changefreq: "monthly", lastmod: "2025-12-09T00:00:00+02:00" },
    { path: "/blog/google-ads-copy-that-converts/",                 priority: "0.7", changefreq: "monthly", lastmod: "2025-12-02T00:00:00+02:00" },
    { path: "/blog/google-ads-conversion-tracking/",                priority: "0.7", changefreq: "monthly", lastmod: "2025-11-25T00:00:00+02:00" },
    { path: "/blog/google-ads-mistakes-south-african-businesses/",  priority: "0.7", changefreq: "monthly", lastmod: "2025-11-18T00:00:00+02:00" },
    { path: "/blog/negative-keywords-stop-wasted-spend/",           priority: "0.7", changefreq: "monthly", lastmod: "2025-11-11T00:00:00+02:00" },
    { path: "/blog/google-ads-remarketing/",                        priority: "0.7", changefreq: "monthly", lastmod: "2025-11-04T00:00:00+02:00" },
    { path: "/blog/google-ads-campaign-structure-roi/",             priority: "0.7", changefreq: "monthly", lastmod: "2025-10-28T00:00:00+02:00" },
    { path: "/blog/digital-marketing-south-african-smes/",          priority: "0.7", changefreq: "monthly", lastmod: "2025-10-21T00:00:00+02:00" },
    { path: "/blog/generate-more-leads-online-2025/",               priority: "0.7", changefreq: "monthly", lastmod: "2025-10-14T00:00:00+02:00" },
    { path: "/blog/seo-vs-sem-south-africa/",                       priority: "0.7", changefreq: "monthly", lastmod: "2025-10-07T00:00:00+02:00" },
    { path: "/blog/website-conversion-rate-optimisation/",          priority: "0.7", changefreq: "monthly", lastmod: "2025-09-30T00:00:00+02:00" },
    { path: "/blog/page-speed-seo-google-ads/",                     priority: "0.7", changefreq: "monthly", lastmod: "2025-09-23T00:00:00+02:00" },
    { path: "/blog/track-roi-digital-marketing/",                   priority: "0.7", changefreq: "monthly", lastmod: "2025-09-16T00:00:00+02:00" },
    { path: "/blog/content-marketing-and-seo/",                     priority: "0.7", changefreq: "monthly", lastmod: "2025-09-09T00:00:00+02:00" },
    { path: "/blog/rank-google-page-1-south-africa/",               priority: "0.7", changefreq: "monthly", lastmod: "2025-09-02T00:00:00+02:00" },
    { path: "/blog/why-competitor-ranks-higher/",                   priority: "0.7", changefreq: "monthly", lastmod: "2025-08-26T00:00:00+02:00" },
  ];

  const url = (p: typeof pages[0]) =>
`<url>
<loc><![CDATA[${base}${p.path}]]></loc>
<lastmod><![CDATA[${p.lastmod}]]></lastmod>
<changefreq><![CDATA[${p.changefreq}]]></changefreq>
<priority><![CDATA[${p.priority}]]></priority>
</url>`;

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
xmlns:xhtml="http://www.w3.org/1999/xhtml"
>
${pages.map(url).join("\n")}
</urlset>`;

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(xml);
});

// Dynamic robots.txt — references the sitemap on the correct domain
app.get("/robots.txt", (req: Request, res: Response) => {
  const proto = req.headers["x-forwarded-proto"] ?? req.protocol ?? "https";
  const host = req.headers["x-forwarded-host"] ?? req.headers.host ?? "indexify.co.za";
  const base = `${proto}://${host}`;

  const txt = `User-agent: *
Allow: /

Sitemap: ${base}/sitemap.xml`;

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(txt);
});

app.use("/api/uploads", express.static(UPLOADS_DIR, { maxAge: "7d" }));
app.use("/api", router);

export default app;
