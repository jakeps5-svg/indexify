import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import router from "./routes";

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Dynamic sitemap — uses the actual request host so it works on any domain
app.get("/sitemap.xml", (req: Request, res: Response) => {
  const proto = req.headers["x-forwarded-proto"] ?? req.protocol ?? "https";
  const host = req.headers["x-forwarded-host"] ?? req.headers.host ?? "indexify.co.za";
  const base = `${proto}://${host}`;
  const now = new Date().toISOString().split("T")[0];

  const pages = [
    { path: "/",                   priority: "1.0", changefreq: "weekly"  },
    { path: "/services/seo",       priority: "0.9", changefreq: "monthly" },
    { path: "/services/google-ads",priority: "0.9", changefreq: "monthly" },
    { path: "/pricing",            priority: "0.8", changefreq: "monthly" },
    { path: "/contact",            priority: "0.7", changefreq: "monthly" },
    { path: "/blog",               priority: "0.7", changefreq: "weekly"  },
    { path: "/audit",              priority: "0.8", changefreq: "monthly" },
    { path: "/serp-checker",       priority: "0.8", changefreq: "monthly" },
  ];

  const urls = pages
    .map(
      (p) => `  <url>
    <loc>${base}${p.path}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
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

app.use("/api", router);

export default app;
