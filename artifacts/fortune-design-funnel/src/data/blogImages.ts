const SLUG_IMAGES: Record<string, string> = {
  "why-your-business-isnt-ranking-on-google": "1460925895917-afdab827c52f",
  "local-seo-south-africa-google-maps":        "1538935732373-f7a495fea3f5",
  "technical-seo-checklist-south-africa":      "1555949963-ff9fe0c870eb",
  "what-is-on-page-seo":                       "1432888498266-38ffec3eaf0a",
  "backlinks-domain-authority-south-africa":   "1552664730-d307ca884978",
  "seo-vs-google-ads":                         "1504868584819-f8e8b4b6d7e3",
  "how-long-does-seo-take":                    "1506784983877-45594efa4cbe",
  "keyword-research-south-african-businesses": "1568954996886-21c5f8b6e682",
  "core-web-vitals-google-ranking":            "1563986768609-322da13575f3",
  "seo-content-that-ranks-and-converts":       "1586892477838-2b96e85e0f96",
  "schema-markup-explained":                   "1573804633927-bfcbcd909acd",
  "why-competitor-ranks-higher":               "1522202176988-66273c7fd55a",
  "rank-google-page-1-south-africa":           "1551836022-8b2858c9c69b",
  "google-ads-vs-facebook-ads":                "1611532736597-de2d4265fba3",
  "google-ads-budget-south-africa":            "1579621970795-87facc2f976d",
  "google-ads-quality-score":                  "1556742049-0cfed4f6a45d",
  "smart-bidding-strategies-google-ads":       "1507003211169-0a1dd7228f2d",
  "google-ads-copy-that-converts":             "1523474253046-8cd2748b5fd2",
  "google-ads-conversion-tracking":            "1551288049-bebda4e38f71",
  "google-ads-mistakes-south-african-businesses": "1504711434969-e33886168f5c",
  "negative-keywords-stop-wasted-spend":       "1434030216411-0b793f4b4173",
  "google-ads-remarketing":                    "1557838923-2985c318be48",
  "google-ads-campaign-structure-roi":         "1460925895917-afdab827c52f",
  "digital-marketing-south-african-smes":      "1552664730-d307ca884978",
  "generate-more-leads-online-2025":           "1504868584819-f8e8b4b6d7e3",
  "seo-vs-sem-south-africa":                   "1432888498266-38ffec3eaf0a",
  "website-conversion-rate-optimisation":      "1563986768609-322da13575f3",
  "page-speed-seo-google-ads":                 "1555949963-ff9fe0c870eb",
  "track-roi-digital-marketing":               "1538935732373-f7a495fea3f5",
  "content-marketing-and-seo":                 "1568954996886-21c5f8b6e682",
};

const CATEGORY_FALLBACKS: Record<string, string> = {
  "SEO":               "1460925895917-afdab827c52f",
  "Google Ads":        "1611532736597-de2d4265fba3",
  "Digital Marketing": "1557838923-2985c318be48",
};

export function getBlogImage(slug: string, category: string, size: "card" | "hero" = "card"): string {
  const id = SLUG_IMAGES[slug] ?? CATEGORY_FALLBACKS[category] ?? "1460925895917-afdab827c52f";
  const w = size === "hero" ? 1400 : 800;
  const h = size === "hero" ? 560 : 420;
  return `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format&q=80`;
}
