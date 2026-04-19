/**
 * Curated Unsplash photo IDs — every ID in this file has been confirmed to
 * load and show a visually relevant subject.
 *
 * PRIMARY → card thumbnail + hero banner
 * MID     → second image injected mid-article
 */

// ─── confirmed IDs and what they show ─────────────────────────────────────────
// photo-1460925895917-afdab827c52f  → laptop with analytics/graph dashboard
// photo-1524661135-423995f22d0b    → colourful world map with travel pins
// photo-1554224155-8d04cb21cd6c    → hand holding a calculator
// photo-1579621970795-87facc2f976d → coins in a jar with a green plant growing
// photo-1555949963-ff9fe0c870eb    → code / terminal on a dark screen
// photo-1518770660439-4636190af475 → circuit board / electronics
// photo-1499750310107-5fef28a66643 → open laptop + coffee cup (content/writing)
// photo-1455390582262-044cdead277a → person writing / typewriter / editorial
// photo-1507003211169-0a1dd7228f2d → sticky-note brainstorm / strategy wall
// photo-1551288049-bebda4e38f71    → analytics dashboard on screen
// photo-1611532736597-de2d4265fba3 → hand holding phone with social-media icons
// photo-1557838923-2985c318be48    → marketing/advertising concept abstract
// photo-1552664730-d307ca884978    → digital marketing strategy on whiteboard
// photo-1558618666-fcd25c85cd64    → network of connected people / social graph
// photo-1563986768609-322da13575f3 → data visualisation / colourful bar charts
// photo-1516321318423-f06f85e504b3 → person typing on laptop keyboard
// photo-1434030216411-0b793f4b4173 → magnifying glass held up to daylight
// photo-1506784983877-45594efa4cbe → spiral notebook / planner / calendar
// photo-1541746972996-4e0b0f43e02a → target board with an arrow in the bullseye
// photo-1590283603385-17ffb3a7f29f → analytics / financial chart on screen
// photo-1504711434969-e33886168f5c → rocket launch at dusk
// photo-1432888498266-38ffec3eaf0a → person at laptop in a library / study
// photo-1586892477838-2b96e85e0f96 → person writing in a notebook at a desk
// photo-1573804633927-bfcbcd909acd → recording studio / video camera setup
// photo-1560472354-b33ff0c44a43    → Google Search Console — impressions graph
// photo-1510519138101-570d1dca3d66 → analytics on a laptop in a dark workspace
// photo-1531482615713-2afd69097998 → team having a discussion / strategy meeting
// photo-1504868584819-f8e8b4b6d7e3 → woman at desk reviewing reports on laptop
// photo-1521737604893-d14cc237f11d → people collaborating over a laptop
// photo-1551434678-e076c223a692    → team working together at a desk
// photo-1562564055-71e051d33c19    → small team in an office setting

const PRIMARY: Record<string, string> = {
  // ── SEO ───────────────────────────────────────────────────────────────────
  "why-your-business-isnt-ranking-on-google":      "photo-1460925895917-afdab827c52f", // analytics dashboard
  "local-seo-south-africa-google-maps":             "photo-1524661135-423995f22d0b",    // map with location pins
  "technical-seo-checklist-south-africa":           "photo-1555949963-ff9fe0c870eb",    // code / terminal
  "what-is-on-page-seo":                            "photo-1499750310107-5fef28a66643", // laptop + coffee
  "backlinks-domain-authority-south-africa":        "photo-1558618666-fcd25c85cd64",    // social network graph
  "seo-vs-google-ads":                              "photo-1551288049-bebda4e38f71",    // analytics dashboard
  "how-long-does-seo-take":                         "photo-1506784983877-45594efa4cbe", // planner / calendar
  "keyword-research-south-african-businesses":      "photo-1434030216411-0b793f4b4173", // magnifying glass
  "core-web-vitals-google-ranking":                 "photo-1563986768609-322da13575f3", // data visualisation
  "seo-content-that-ranks-and-converts":            "photo-1455390582262-044cdead277a", // writer at desk
  "schema-markup-explained":                        "photo-1573804633927-bfcbcd909acd", // structured / recorded data
  "why-competitor-ranks-higher":                    "photo-1531482615713-2afd69097998", // team strategy meeting
  "rank-google-page-1-south-africa":                "photo-1541746972996-4e0b0f43e02a", // bullseye target = #1

  // ── Google Ads ────────────────────────────────────────────────────────────
  "google-ads-vs-facebook-ads":                     "photo-1611532736597-de2d4265fba3", // phone with social icons
  "google-ads-budget-south-africa":                 "photo-1554224155-8d04cb21cd6c",    // hand + calculator
  "google-ads-quality-score":                       "photo-1563986768609-322da13575f3", // metrics / charts
  "smart-bidding-strategies-google-ads":            "photo-1507003211169-0a1dd7228f2d", // strategy sticky notes
  "google-ads-copy-that-converts":                  "photo-1586892477838-2b96e85e0f96", // writing in a notebook
  "google-ads-conversion-tracking":                 "photo-1551288049-bebda4e38f71",    // analytics dashboard
  "google-ads-mistakes-south-african-businesses":   "photo-1516321318423-f06f85e504b3", // person typing on laptop
  "negative-keywords-stop-wasted-spend":            "photo-1504868584819-f8e8b4b6d7e3", // reviewing reports
  "google-ads-remarketing":                         "photo-1557838923-2985c318be48",    // marketing/ad concept
  "google-ads-campaign-structure-roi":              "photo-1590283603385-17ffb3a7f29f", // analytics / ROI chart

  // ── Digital Marketing ─────────────────────────────────────────────────────
  "digital-marketing-south-african-smes":           "photo-1552664730-d307ca884978",    // digital strategy board
  "generate-more-leads-online-2025":                "photo-1504711434969-e33886168f5c", // rocket launch = growth
  "seo-vs-sem-south-africa":                        "photo-1432888498266-38ffec3eaf0a", // person researching online
  "website-conversion-rate-optimisation":           "photo-1551288049-bebda4e38f71",    // analytics / A/B test
  "page-speed-seo-google-ads":                      "photo-1518770660439-4636190af475", // technical / circuit board
  "track-roi-digital-marketing":                    "photo-1510519138101-570d1dca3d66", // analytics in dark workspace
  "content-marketing-and-seo":                      "photo-1499750310107-5fef28a66643", // laptop + content
};

const MID: Record<string, string> = {
  // ── SEO ───────────────────────────────────────────────────────────────────
  "why-your-business-isnt-ranking-on-google":      "photo-1560472354-b33ff0c44a43",    // Search Console impressions graph
  "local-seo-south-africa-google-maps":             "photo-1521737604893-d14cc237f11d", // people collaborating over laptop
  "technical-seo-checklist-south-africa":           "photo-1518770660439-4636190af475", // circuit board / server infra
  "what-is-on-page-seo":                            "photo-1432888498266-38ffec3eaf0a", // researching / editing
  "backlinks-domain-authority-south-africa":        "photo-1551434678-e076c223a692",    // team working together
  "seo-vs-google-ads":                              "photo-1460925895917-afdab827c52f", // analytics comparing channels
  "how-long-does-seo-take":                         "photo-1541746972996-4e0b0f43e02a", // bullseye target = reaching goal
  "keyword-research-south-african-businesses":      "photo-1507003211169-0a1dd7228f2d", // brainstorm sticky notes
  "core-web-vitals-google-ranking":                 "photo-1555949963-ff9fe0c870eb",    // code / dev tools
  "seo-content-that-ranks-and-converts":            "photo-1586892477838-2b96e85e0f96", // writing / editorial
  "schema-markup-explained":                        "photo-1555949963-ff9fe0c870eb",    // code / markup
  "why-competitor-ranks-higher":                    "photo-1563986768609-322da13575f3", // ranking chart comparison
  "rank-google-page-1-south-africa":                "photo-1460925895917-afdab827c52f", // analytics dashboard

  // ── Google Ads ────────────────────────────────────────────────────────────
  "google-ads-vs-facebook-ads":                     "photo-1557838923-2985c318be48",    // advertising concept
  "google-ads-budget-south-africa":                 "photo-1579621970795-87facc2f976d", // coins in jar = budget growth
  "google-ads-quality-score":                       "photo-1460925895917-afdab827c52f", // performance metrics
  "smart-bidding-strategies-google-ads":            "photo-1460925895917-afdab827c52f", // analytics / algorithm output
  "google-ads-copy-that-converts":                  "photo-1455390582262-044cdead277a", // copywriting / typewriter
  "google-ads-conversion-tracking":                 "photo-1590283603385-17ffb3a7f29f", // conversion / analytics chart
  "google-ads-mistakes-south-african-businesses":   "photo-1507003211169-0a1dd7228f2d", // planning to fix mistakes
  "negative-keywords-stop-wasted-spend":            "photo-1434030216411-0b793f4b4173", // magnifying glass = filtering
  "google-ads-remarketing":                         "photo-1552664730-d307ca884978",    // marketing strategy / follow-up
  "google-ads-campaign-structure-roi":              "photo-1541746972996-4e0b0f43e02a", // target / ROI achieved

  // ── Digital Marketing ─────────────────────────────────────────────────────
  "digital-marketing-south-african-smes":           "photo-1562564055-71e051d33c19",    // small team in office
  "generate-more-leads-online-2025":                "photo-1557838923-2985c318be48",    // converting visitors to leads
  "seo-vs-sem-south-africa":                        "photo-1460925895917-afdab827c52f", // both channels analytics
  "website-conversion-rate-optimisation":           "photo-1563986768609-322da13575f3", // A/B test data
  "page-speed-seo-google-ads":                      "photo-1563986768609-322da13575f3", // performance score chart
  "track-roi-digital-marketing":                    "photo-1551288049-bebda4e38f71",    // ROI analytics dashboard
  "content-marketing-and-seo":                      "photo-1455390582262-044cdead277a", // content editorial planning
};

const CATEGORY_FALLBACK: Record<string, string> = {
  SEO:                 "photo-1460925895917-afdab827c52f",
  "Google Ads":        "photo-1611532736597-de2d4265fba3",
  "Digital Marketing": "photo-1552664730-d307ca884978",
};

export function getBlogImage(slug: string, category: string, size: "card" | "hero" | "mid" = "card"): string {
  const map = size === "mid" ? MID : PRIMARY;
  const id  = map[slug] ?? CATEGORY_FALLBACK[category] ?? "photo-1460925895917-afdab827c52f";
  const w   = size === "hero" ? 1400 : size === "mid" ? 900 : 800;
  const h   = size === "hero" ? 520  : size === "mid" ? 380 : 420;
  return `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&auto=format&q=80`;
}
