import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: "website" | "article";
  canonical?: string;
}

const DEFAULT_TITLE = "Indexify – Lead SEO & Google Ads Expert";
const SITE_URL      = "https://indexify.co.za";

function setMeta(selector: string, attr: string, value: string) {
  let tag = document.querySelector(selector);
  if (!tag) {
    tag = document.createElement("meta");
    const m = selector.match(/\[(\w+(?::\w+)?)="([^"]+)"\]/);
    if (m) tag.setAttribute(m[1], m[2]);
    document.head.appendChild(tag);
  }
  tag.setAttribute(attr, value);
}

function setLink(rel: string, href: string) {
  let tag = document.querySelector(`link[rel="${rel}"]`);
  if (!tag) {
    tag = document.createElement("link");
    tag.setAttribute("rel", rel);
    document.head.appendChild(tag);
  }
  tag.setAttribute("href", href);
}

export function useSEO({
  title,
  description,
  keywords = [],
  ogImage = `${SITE_URL}/opengraph.jpg`,
  ogType  = "website",
  canonical,
}: SEOProps) {
  useEffect(() => {
    document.title = title;

    const rawPath = window.location.pathname.replace(/\/$/, "");
    const path = rawPath ? `${rawPath}/` : "/";
    const canonicalUrl = canonical ?? `${SITE_URL}${path}`;

    setMeta('meta[name="description"]',        "content", description);
    setMeta('meta[name="keywords"]',           "content", keywords.join(", "));
    setMeta('meta[name="robots"]',             "content", "index, follow");
    setMeta('meta[property="og:title"]',       "content", title);
    setMeta('meta[property="og:description"]', "content", description);
    setMeta('meta[property="og:image"]',       "content", ogImage);
    setMeta('meta[property="og:type"]',        "content", ogType);
    setMeta('meta[property="og:site_name"]',   "content", "Indexify");
    setMeta('meta[property="og:url"]',         "content", canonicalUrl);
    setMeta('meta[name="twitter:card"]',       "content", "summary_large_image");
    setMeta('meta[name="twitter:title"]',      "content", title);
    setMeta('meta[name="twitter:description"]',"content", description);
    setMeta('meta[name="twitter:image"]',      "content", ogImage);

    setLink("canonical", canonicalUrl);

    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, [title, description, keywords, ogImage, ogType, canonical]);
}
