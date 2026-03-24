import { useParams } from "wouter";
import { motion } from "framer-motion";
import {
  CheckCircle2, Star, ArrowRight, MessageCircle, Shield,
  Search, MousePointerClick, TrendingUp, BarChart3,
  Clock, Award, Users, ChevronRight, Zap, RefreshCw,
  FileText, Phone, Lock,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useSEO } from "@/hooks/useSEO";
import { openWhatsAppModal } from "@/components/WhatsAppModal";
import { cn } from "@/lib/utils";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

interface PackageFeature { name: string; description: string; }
interface PackageData {
  slug: string;
  name: string;
  tagline: string;
  price: string;
  priceNum: string;
  period: string;
  extra?: string;
  checkoutType: string;
  color: string;
  gradient: string;
  textGradient: string;
  badgeText: string;
  badgeBg: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  heroImage: string;
  summary: string;
  whoFor: string[];
  features: PackageFeature[];
  guarantees: string[];
  faq: { q: string; a: string }[];
  related: string[];
  popular?: boolean;
}

const PACKAGES: Record<string, PackageData> = {
  "basic-seo": {
    slug: "basic-seo",
    name: "Basic SEO",
    tagline: "Rank locally. Get found by nearby customers.",
    price: "5,900",
    priceNum: "5900",
    period: "per month",
    checkoutType: "seo-basic",
    color: "#0ea5c8",
    gradient: "from-sky-500 to-cyan-600",
    textGradient: "text-primary",
    badgeText: "SEO Package",
    badgeBg: "bg-primary/10 text-primary",
    icon: Search,
    heroImage: "/images/packages/basic-seo.png",
    summary: "Our Basic SEO package is designed for small South African businesses that want to rank in their local area — whether it's your suburb, city, or region. We handle everything from the technical foundation to keyword targeting, so your business shows up when customers nearby are searching.",
    whoFor: [
      "Local service businesses (plumbers, electricians, doctors, lawyers)",
      "Brick-and-mortar stores wanting foot traffic",
      "Businesses launching their first online presence",
      "Startups looking for cost-effective SEO",
    ],
    features: [
      { name: "Local SEO Setup", description: "Google Business Profile optimisation, local citations, and geo-targeted keyword strategy so you rank in your city or suburb." },
      { name: "Keyword Research", description: "In-depth research to find the exact search terms your local customers are typing — and building your content around those." },
      { name: "Analytics Setup & Configuration", description: "Google Analytics 4 and Search Console fully configured so we track every visitor, click, and conversion." },
      { name: "Technical SEO", description: "Robots.txt, XML sitemap, canonical tags, site speed checks, and crawl error fixes — the foundation everything else is built on." },
      { name: "Title & Meta Tag Creation", description: "Every page gets keyword-rich titles and meta descriptions to maximise click-through rates from search results." },
      { name: "Content Editing & Optimisation", description: "We rewrite and enhance your existing web pages to match search intent and naturally include target keywords." },
      { name: "Monthly Custom Report", description: "A clear, plain-English report every month showing your rankings, traffic, and what we did — no fluff, no jargon." },
    ],
    guarantees: [
      "No lock-in after 3 months",
      "30-day cancellation notice",
      "Dedicated account manager",
      "Monthly performance reports",
    ],
    faq: [
      { q: "How long before I see results?", a: "SEO typically shows measurable results within 60–90 days for local searches. We start optimising from day one and you'll receive your first ranking report at the end of month one." },
      { q: "Do I need to sign a long contract?", a: "No. We ask for a minimum 3-month commitment (SEO takes time to work), after which you can cancel with 30 days' notice — no penalties." },
      { q: "What do I need to provide?", a: "Just your website access (we can use a staging environment), your business details, and any goals you have in mind. We handle everything else." },
      { q: "Is Basic SEO right for me?", a: "If your customers are mostly local — in your city or region — then yes. If you need to rank nationally or have a highly competitive niche, our Advanced or Premium plans may suit better." },
    ],
    related: ["advanced-seo", "google-ads"],
  },

  "advanced-seo": {
    slug: "advanced-seo",
    name: "Advanced SEO",
    tagline: "Compete nationally. Win high-value keywords.",
    price: "7,900",
    priceNum: "7900",
    period: "per month",
    checkoutType: "seo-advanced",
    color: "#0ea5c8",
    gradient: "from-sky-500 to-blue-600",
    textGradient: "text-primary",
    badgeText: "SEO Package",
    badgeBg: "bg-primary/10 text-primary",
    icon: TrendingUp,
    heroImage: "/images/packages/advanced-seo.png",
    summary: "The Advanced SEO package is built for businesses competing beyond their local area — targeting competitive, nationwide keywords and e-commerce lead generation. We layer on off-site link building and a more aggressive content strategy to push you past competitors.",
    whoFor: [
      "E-commerce stores targeting South Africa-wide customers",
      "Service businesses operating across multiple cities",
      "Businesses in competitive niches (legal, finance, medical, construction)",
      "Companies that have done basic SEO and want to scale",
    ],
    features: [
      { name: "Competitive / Nationwide Keywords", description: "We target high-volume, competitive keywords across South Africa — not just local searches — to expand your reach nationally." },
      { name: "E-commerce Lead Generation", description: "Optimised product pages, category pages, and schema markup to turn search traffic into buyers or qualified leads." },
      { name: "Local SEO", description: "Everything in Basic SEO for local presence is included alongside the broader national strategy." },
      { name: "Keyword Research", description: "Comprehensive research covering both long-tail local terms and high-competition national keywords in your industry." },
      { name: "Analytics Setup & Configuration", description: "Full GA4 and Search Console setup with conversion tracking and goal configuration tailored to your business." },
      { name: "Technical SEO", description: "Deep technical audits including Core Web Vitals, structured data (schema), crawl budget optimisation, and international SEO if needed." },
      { name: "Title & Meta Tag Creation", description: "Keyword-driven metadata across all key pages, plus OG tags for social sharing optimisation." },
      { name: "Content Editing & Optimisation", description: "Regular content updates and new page creation aligned with your target keyword clusters and content calendar." },
      { name: "Monthly Custom Report", description: "Detailed monthly ranking and traffic report with competitor comparisons and next-month strategy." },
      { name: "Offsite Link Building", description: "Quality backlink acquisition from reputable South African and international websites to build domain authority." },
    ],
    guarantees: [
      "No lock-in after 3 months",
      "30-day cancellation notice",
      "Dedicated account manager",
      "Competitor tracking included",
    ],
    faq: [
      { q: "How is this different from Basic SEO?", a: "Advanced SEO targets nationwide and competitive keywords, adds off-site link building, and includes e-commerce lead generation — ideal if you compete beyond your local area." },
      { q: "What industries does this work best for?", a: "It works across all industries but delivers the biggest impact in competitive sectors: legal, healthcare, financial services, e-commerce, construction, and SaaS." },
      { q: "How long until I see results?", a: "National keyword ranking typically takes 3–6 months for competitive terms. Easier keywords and local searches can improve within 30–60 days." },
      { q: "Do you build spammy links?", a: "Never. We only acquire backlinks from relevant, authoritative websites using white-hat outreach and content partnerships. No link farms, no PBNs." },
    ],
    related: ["premium-seo", "market-leader"],
  },

  "premium-seo": {
    slug: "premium-seo",
    name: "Premium SEO",
    tagline: "Dominate search. The complete SEO arsenal.",
    price: "11,900",
    priceNum: "11900",
    period: "per month",
    checkoutType: "seo-premium",
    color: "#0ea5c8",
    gradient: "from-primary to-violet-600",
    textGradient: "text-primary",
    badgeText: "Most Popular",
    badgeBg: "bg-accent/10 text-accent",
    icon: Award,
    heroImage: "/images/packages/premium-seo.png",
    popular: true,
    summary: "Premium SEO is our flagship package — the complete, all-in SEO solution for businesses serious about owning the first page. From DA 90+ backlinks to press releases and a full backlink indexing strategy, this is everything you need to outrank any competitor in South Africa.",
    whoFor: [
      "Businesses in highly competitive industries (legal, medical, finance)",
      "National e-commerce brands",
      "Companies targeting high-value keywords with significant revenue potential",
      "Businesses wanting a fully managed, results-driven SEO partner",
    ],
    features: [
      { name: "Competitive / Nationwide Keywords", description: "Full national keyword domination strategy — targeting both high-volume and high-intent keywords across all your key markets." },
      { name: "Backlink Manager", description: "A dedicated backlink profile managed for you — we track, audit, and grow your link portfolio every month using our proprietary tools." },
      { name: "DA 90+ Backlinks", description: "Premium placements on some of the highest Domain Authority (90+) publications available — the most powerful links you can get." },
      { name: "E-commerce Lead Generation", description: "Full product page optimisation, category SEO, schema markup, and conversion-rate improvements." },
      { name: "Local SEO", description: "Complete local presence management across all major platforms — Google, Bing, Apple Maps, and key South African directories." },
      { name: "Keyword Research & Optimisation", description: "Monthly keyword research cycles to capture new opportunities as trends evolve, including zero-click and featured snippet targeting." },
      { name: "Backlink Indexing", description: "We actively index all earned backlinks to ensure they pass full authority — a critical step most agencies skip." },
      { name: "Analytics Setup & Configuration", description: "Advanced GA4 configuration including funnel tracking, event mapping, and custom dashboards tailored to your KPIs." },
      { name: "Technical SEO", description: "Full technical SEO including Core Web Vitals fixes, structured data, international SEO, hreflang, and crawl optimisation." },
      { name: "Title & Meta Tag Creation", description: "Ongoing meta tag optimisation across every page with click-through rate testing and iteration." },
      { name: "Content Editing & Optimisation", description: "Ongoing content production, existing page upgrades, pillar content creation, and topical authority building." },
      { name: "Monthly Custom Report", description: "Comprehensive monthly report with ranking movements, competitor benchmarking, backlink growth, and 90-day roadmap." },
      { name: "Offsite Link Building", description: "High-volume, quality-first link building including guest posts, resource links, and editorial placements." },
      { name: "Press Release", description: "Monthly press release written and distributed to relevant South African media outlets — builds brand authority and powerful links simultaneously." },
    ],
    guarantees: [
      "No lock-in after 3 months",
      "30-day cancellation notice",
      "Priority account manager",
      "Backlink guarantee",
    ],
    faq: [
      { q: "What makes Premium different from Advanced?", a: "Premium adds DA 90+ backlinks, a dedicated backlink manager, backlink indexing, press releases, and a significantly more aggressive content strategy. It's the full package." },
      { q: "What is a DA 90+ backlink?", a: "Domain Authority (DA) is a score from 0–100 indicating a website's link strength. DA 90+ sites include major news publications, universities, and industry leaders. A single link from one of these can dramatically improve your rankings." },
      { q: "Can I upgrade from Advanced to Premium?", a: "Yes, absolutely. We can upgrade your plan at any time — just contact us and we'll adjust your strategy and billing." },
      { q: "What does a press release include?", a: "Each press release is written by our copywriters, tailored to your business news or campaigns, and distributed to a network of relevant South African media outlets — generating both exposure and backlinks." },
    ],
    related: ["market-leader", "google-ads"],
  },

  "google-ads": {
    slug: "google-ads",
    name: "Google Ads Management",
    tagline: "Instant leads from Day 1. Maximum ROI.",
    price: "7,300",
    priceNum: "7300",
    period: "per month",
    extra: "+ your ad spend budget",
    checkoutType: "google-ads",
    color: "#7c4dff",
    gradient: "from-violet-600 to-purple-700",
    textGradient: "text-accent",
    badgeText: "Google Ads",
    badgeBg: "bg-accent/10 text-accent",
    icon: MousePointerClick,
    heroImage: "/images/packages/google-ads.png",
    summary: "Our Google Ads management service puts your business in front of customers who are actively searching for what you sell — right now. We handle every aspect of your campaigns so you can focus on closing leads, not managing bids.",
    whoFor: [
      "Businesses that need leads immediately (not in 3–6 months)",
      "E-commerce stores wanting to drive sales with paid search",
      "Service businesses with high average customer values",
      "Companies wanting to test new markets quickly",
    ],
    features: [
      { name: "Full Campaign Setup & Structure", description: "We build your entire Google Ads account from scratch — correct campaign types, ad groups, and match types for maximum efficiency." },
      { name: "Keyword Research & Match Types", description: "Identifying high-intent keywords that convert, plus strategic use of match types to control spend and relevance." },
      { name: "Ad Copy & A/B Testing", description: "Compelling ad copy written and continuously A/B tested — we find what works and scale it." },
      { name: "Conversion Tracking Setup", description: "Full conversion tracking configured in GA4 and Google Ads so you know exactly which ads are generating leads and sales." },
      { name: "Negative Keyword Management", description: "Ongoing negative keyword updates to eliminate wasted ad spend on irrelevant searches — keeping your budget working hard." },
      { name: "Bid Strategy & Budget Optimisation", description: "Smart bidding strategies configured and monitored monthly to maximise conversions within your budget." },
      { name: "Audience & Remarketing Campaigns", description: "Re-engage visitors who didn't convert with targeted remarketing ads — often the highest-ROI campaigns in your account." },
      { name: "Landing Page Recommendations", description: "We review your landing pages and give actionable recommendations to improve conversion rates and Quality Scores." },
      { name: "Search Term Report Analysis", description: "Regular analysis of the actual search terms triggering your ads — used to find new opportunities and eliminate waste." },
      { name: "Google Analytics Integration", description: "Seamless GA4 integration for full-funnel attribution — from first click to final conversion." },
      { name: "Monthly Performance Reports", description: "Clear monthly reports showing spend, clicks, leads, cost-per-lead, and ROAS — with plain-English analysis." },
      { name: "Dedicated Account Manager", description: "A real person manages your account every month — no automated-only management, no offshore teams." },
    ],
    guarantees: [
      "No percentage of ad spend taken",
      "Your ad budget goes 100% to Google",
      "30-day cancellation notice",
      "Dedicated account manager",
    ],
    faq: [
      { q: "Does your fee include my ad spend?", a: "No. Our R7,300/month is purely our management fee. Your ad spend goes directly from your Google Ads account to Google — we never mark it up or take a percentage." },
      { q: "How much should I budget for ad spend?", a: "We recommend a minimum ad spend of R5,000–R10,000/month to start, depending on your industry and competition. We'll advise you on the ideal budget before you start." },
      { q: "How quickly will I get leads?", a: "Google Ads can start generating leads within days of launch. Most clients see their first leads within the first week after campaign activation." },
      { q: "Can you take over an existing Google Ads account?", a: "Yes. We can audit and take over management of your existing account — often we find significant budget waste in accounts that have run without professional management." },
    ],
    related: ["market-leader", "basic-seo"],
  },

  "market-leader": {
    slug: "market-leader",
    name: "Market Leader Bundle",
    tagline: "SEO + Google Ads. Total search domination.",
    price: "12,500",
    priceNum: "12500",
    period: "per month",
    extra: "+ your Google Ads spend",
    checkoutType: "market-leader",
    color: "#0ea5c8",
    gradient: "from-primary to-teal-700",
    textGradient: "text-primary",
    badgeText: "Best Value Bundle",
    badgeBg: "bg-primary/10 text-primary",
    icon: Zap,
    heroImage: "/images/packages/market-leader.png",
    summary: "The Market Leader Bundle combines our Advanced SEO and Google Ads Management into one cohesive strategy — at a significant saving over buying them separately. When SEO and paid search work together, you show up everywhere: organic results, local pack, and paid ads simultaneously. This is how you own your market.",
    whoFor: [
      "Businesses serious about total search dominance",
      "Companies wanting both short-term leads (Ads) and long-term growth (SEO)",
      "E-commerce brands wanting maximum search real estate",
      "Businesses that compete hard and want an unfair advantage",
    ],
    features: [
      { name: "Advanced SEO — Full Package", description: "Competitive nationwide SEO, link building, content optimisation, technical SEO, local SEO, and monthly reports — everything in our Advanced SEO plan." },
      { name: "Google Ads Management — Full Package", description: "Complete campaign setup, ad copy, bid management, conversion tracking, remarketing, and monthly reports — everything in our Google Ads plan." },
      { name: "Unified Strategy & Reporting", description: "Both channels are managed together for synergy — SEO keyword insights inform ad strategy, and ad data informs content decisions." },
      { name: "Cross-Channel Attribution", description: "Understand exactly which channel (organic vs. paid) is driving each lead or sale, so you can make smarter investment decisions." },
      { name: "Dedicated Bundle Manager", description: "One point of contact manages both your SEO and Ads — no confusion between teams, no communication gaps." },
      { name: "Priority Support", description: "Bundle clients receive priority support and quarterly strategy reviews to ensure both channels are continuously aligned." },
      { name: "R2,700/month Savings", description: "Buying SEO (Advanced, R7,900) and Ads (R7,300) separately would cost R15,200/month. The bundle saves you R2,700 every single month." },
    ],
    guarantees: [
      "Save R2,700/month vs buying separately",
      "No percentage of ad spend",
      "30-day cancellation notice",
      "Priority account manager",
    ],
    faq: [
      { q: "Why does combining SEO + Ads work so well?", a: "Google Ads gives you instant visibility while SEO builds over time. As your organic rankings improve, you can reduce ad spend on those terms — reinvesting budget into new opportunities. They complement each other perfectly." },
      { q: "Does the R12,500 include my ad spend?", a: "No — the R12,500 is purely our management fee for both channels. Your Google Ads budget goes directly to Google and is separate." },
      { q: "Can I start with just one service and add the other later?", a: "Yes. But starting with both from the beginning gives you the most data and the fastest results. We offer a seamless upgrade if you start with one plan." },
      { q: "Is the advanced SEO or basic SEO included in the bundle?", a: "The bundle includes Advanced SEO (R7,900 value) combined with full Google Ads Management (R7,300 value) — a total value of R15,200 for R12,500." },
    ],
    related: ["advanced-seo", "google-ads"],
  },
};

const RELATED_NAMES: Record<string, string> = {
  "basic-seo": "Basic SEO — R5,900/mo",
  "advanced-seo": "Advanced SEO — R7,900/mo",
  "premium-seo": "Premium SEO — R11,900/mo",
  "google-ads": "Google Ads — R7,300/mo",
  "market-leader": "Market Leader — R12,500/mo",
};

function openWhatsApp(_msg: string) {
  openWhatsAppModal();
}

export default function PackagePage() {
  const params = useParams<{ slug: string }>();
  const pkg = PACKAGES[params.slug ?? ""];

  useSEO({
    title: pkg ? `${pkg.name} | Indexify SEO Packages` : "Package Not Found | Indexify",
    description: pkg ? pkg.summary : "",
    canonical: pkg ? `https://indexify.co.za/packages/${params.slug}/` : undefined,
  });

  if (!pkg) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh] flex-col gap-4">
          <h1 className="text-3xl font-black text-gray-900">Package not found</h1>
          <a href={`${BASE}/pricing`} className="text-primary font-semibold hover:underline">View all packages →</a>
        </div>
        <Footer />
      </div>
    );
  }

  const Icon = pkg.icon;
  const accentColor = pkg.slug === "google-ads" ? "#7c4dff" : "#0ea5c8";

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2 text-sm text-gray-500">
          <a href={`${BASE}/`} className="hover:text-gray-800 transition-colors">Home</a>
          <ChevronRight size={14} className="text-gray-300" />
          <a href={`${BASE}/pricing`} className="hover:text-gray-800 transition-colors">Pricing</a>
          <ChevronRight size={14} className="text-gray-300" />
          <span className="font-semibold text-gray-800">{pkg.name}</span>
        </div>
      </div>

      {/* Hero Banner */}
      <section className={`bg-gradient-to-br ${pkg.gradient} py-16`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
            <div className="flex-1">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <span className={cn("inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 bg-white/20 text-white")}>
                  {pkg.popular && <Star size={11} fill="currentColor" />}
                  {pkg.badgeText}
                </span>
                <h1 className="text-4xl md:text-5xl font-black text-white mb-3">{pkg.name}</h1>
                <p className="text-xl text-white/80 max-w-xl">{pkg.tagline}</p>
                <div className="flex items-baseline gap-2 mt-6">
                  <span className="text-2xl font-semibold text-white">R</span>
                  <span className="text-6xl font-black text-white">{pkg.price}</span>
                  <span className="text-white/70 text-sm ml-1">{pkg.period}</span>
                </div>
                {pkg.extra && <p className="text-white/60 text-sm mt-1">{pkg.extra}</p>}
              </motion.div>

              {/* Hero image */}
              <motion.div
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="mt-8 rounded-2xl overflow-hidden shadow-2xl shadow-black/30 ring-1 ring-white/20"
              >
                <img
                  src={pkg.heroImage}
                  alt={`${pkg.name} illustration`}
                  className="w-full object-cover max-h-52 lg:max-h-60"
                />
              </motion.div>
            </div>
            <div className="flex-shrink-0 w-full lg:w-96">
              <motion.div
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                className="bg-white rounded-3xl shadow-2xl p-8"
              >
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-5">Start today — no lock-in after 3 months</p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-3xl font-semibold text-gray-900">R</span>
                  <span className="text-5xl font-black text-gray-900">{pkg.price}</span>
                </div>
                <p className="text-sm text-gray-400 mb-6">{pkg.period}{pkg.extra ? ` · ${pkg.extra}` : ""}</p>

                <a
                  href={`${BASE}/checkout?type=${pkg.checkoutType}`}
                  className="block w-full py-4 rounded-xl text-white font-bold text-center text-base hover:-translate-y-0.5 transition-all shadow-xl mb-3"
                  style={{ background: `linear-gradient(135deg, ${accentColor}, ${pkg.slug === "google-ads" ? "#9c27b0" : "#0077a8"})`, boxShadow: `0 8px 24px ${accentColor}40` }}
                >
                  Get Started — R{pkg.price}/mo
                </a>
                <button
                  onClick={() => openWhatsApp(`Hi! I'm interested in the ${pkg.name} package (R${pkg.price}/mo). Can we chat?`)}
                  className="w-full py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold text-sm hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center gap-2 mb-5"
                >
                  <MessageCircle size={15} className="text-[#25d366]" /> Questions? Chat on WhatsApp
                </button>

                <div className="space-y-2.5">
                  {pkg.guarantees.map((g, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <Shield size={13} className="text-emerald-500 shrink-0" />
                      <span className="text-xs text-gray-600">{g}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 pt-5 border-t border-gray-100 flex items-center gap-2.5 text-xs text-gray-400">
                  <Lock size={12} className="text-gray-300" />
                  Secure checkout · Powered by Yoco
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Left: Details */}
            <div className="lg:col-span-2 space-y-12">

              {/* About */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <h2 className="text-2xl font-black text-gray-900 mb-4">About this package</h2>
                <p className="text-gray-600 leading-relaxed text-base">{pkg.summary}</p>
              </motion.div>

              {/* Who is this for */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <h2 className="text-2xl font-black text-gray-900 mb-5">Who is this for?</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {pkg.whoFor.map((item, i) => (
                    <div key={i} className="flex items-start gap-3 bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: `${accentColor}20` }}>
                        <CheckCircle2 size={13} style={{ color: accentColor }} />
                      </div>
                      <span className="text-sm text-gray-700 leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* What's included — WooCommerce style feature list */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <h2 className="text-2xl font-black text-gray-900 mb-6">What's included</h2>
                <div className="space-y-4">
                  {pkg.features.map((f, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      className="flex gap-4 p-5 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all bg-white"
                    >
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={{ background: `${accentColor}15` }}>
                        <CheckCircle2 size={16} style={{ color: accentColor }} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm mb-1">{f.name}</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">{f.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* FAQ */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <h2 className="text-2xl font-black text-gray-900 mb-6">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  {pkg.faq.map((item, i) => (
                    <div key={i} className="rounded-2xl border border-gray-100 p-6 bg-gray-50/50">
                      <h3 className="font-bold text-gray-900 mb-2 text-sm">{item.q}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right: Sticky sidebar */}
            <div className="hidden lg:block">
              <div className="sticky top-24 space-y-5">
                {/* Summary card */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                  className="rounded-2xl border border-gray-200 shadow-lg overflow-hidden"
                >
                  <div className={`bg-gradient-to-br ${pkg.gradient} p-5 text-white`}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                        <Icon size={18} className="text-white" />
                      </div>
                      <div>
                        <p className="font-black text-sm">{pkg.name}</p>
                        <p className="text-white/70 text-xs">{pkg.period}</p>
                      </div>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-semibold">R</span>
                      <span className="text-4xl font-black">{pkg.price}</span>
                    </div>
                  </div>
                  <div className="p-5 space-y-2 bg-white">
                    {pkg.guarantees.map((g, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Shield size={12} className="text-emerald-500 shrink-0" />
                        <span className="text-xs text-gray-600">{g}</span>
                      </div>
                    ))}
                  </div>
                  <div className="px-5 pb-5 bg-white space-y-2">
                    <a
                      href={`${BASE}/checkout?type=${pkg.checkoutType}`}
                      className="block w-full py-3.5 rounded-xl text-white font-bold text-center text-sm hover:-translate-y-0.5 transition-all"
                      style={{ background: `linear-gradient(135deg, ${accentColor}, ${pkg.slug === "google-ads" ? "#9c27b0" : "#0077a8"})`, boxShadow: `0 6px 20px ${accentColor}35` }}
                    >
                      Get Started — R{pkg.price}/mo
                    </a>
                    <button
                      onClick={() => openWhatsApp(`Hi! I'm interested in the ${pkg.name} package at R${pkg.price}/mo.`)}
                      className="w-full py-2.5 rounded-xl border border-gray-200 text-gray-500 font-medium text-xs hover:bg-gray-50 transition-all flex items-center justify-center gap-1.5"
                    >
                      <MessageCircle size={12} className="text-[#25d366]" /> Ask via WhatsApp
                    </button>
                  </div>
                </motion.div>

                {/* Trust signals */}
                <div className="rounded-2xl border border-gray-100 p-5 bg-gray-50 space-y-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Why clients trust Indexify</p>
                  {[
                    { icon: Users, text: "100+ South African businesses served" },
                    { icon: BarChart3, text: "Average 180% organic traffic increase" },
                    { icon: Clock, text: "5+ years in South African digital marketing" },
                    { icon: RefreshCw, text: "Month-to-month after 3 months" },
                  ].map((t, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0">
                        <t.icon size={12} className="text-primary" />
                      </div>
                      <span className="text-xs text-gray-600">{t.text}</span>
                    </div>
                  ))}
                </div>

                {/* Need help card */}
                <div className="rounded-2xl border border-gray-100 p-5 bg-white">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Not sure? Talk to us</p>
                  <p className="text-sm text-gray-600 mb-3">Our team can recommend the right package for your goals and budget.</p>
                  <div className="space-y-2">
                    <button
                      onClick={() => openWhatsApp("Hi! I'd like help choosing the right Indexify package.")}
                      className="w-full py-2.5 rounded-xl bg-[#25d366] text-white font-semibold text-xs hover:bg-[#20bc5a] transition-all flex items-center justify-center gap-1.5"
                    >
                      <MessageCircle size={12} /> WhatsApp Us
                    </button>
                    <a
                      href={`${BASE}/contact`}
                      className="block w-full py-2.5 rounded-xl border border-gray-200 text-gray-500 font-medium text-xs hover:bg-gray-50 transition-all text-center"
                    >
                      Send a Message
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile CTA bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white border-t border-gray-200 shadow-2xl px-4 py-3 flex gap-3">
        <button
          onClick={() => openWhatsApp(`Hi! I'm interested in the ${pkg.name} package at R${pkg.price}/mo.`)}
          className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-bold text-sm flex items-center justify-center gap-1.5"
        >
          <MessageCircle size={14} className="text-[#25d366]" /> WhatsApp
        </button>
        <a
          href={`${BASE}/checkout?type=${pkg.checkoutType}`}
          className="flex-2 flex-grow py-3 px-6 rounded-xl text-white font-bold text-sm text-center flex items-center justify-center gap-1.5"
          style={{ background: `linear-gradient(135deg, ${accentColor}, ${pkg.slug === "google-ads" ? "#9c27b0" : "#0077a8"})` }}
        >
          Get Started — R{pkg.price}/mo <ArrowRight size={14} />
        </a>
      </div>
      <div className="h-20 lg:hidden" />

      {/* Related packages */}
      <section className="py-16 bg-slate-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-black text-gray-900 mb-8 text-center">Explore other packages</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {pkg.related.map((slug) => {
              const rel = PACKAGES[slug];
              if (!rel) return null;
              const RelIcon = rel.icon;
              return (
                <a
                  key={slug}
                  href={`${BASE}/packages/${slug}`}
                  className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-gray-200 hover:border-primary/40 hover:shadow-md transition-all group"
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${rel.gradient} flex items-center justify-center shrink-0`}>
                    <RelIcon size={18} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-sm group-hover:text-primary transition-colors">{rel.name}</p>
                    <p className="text-xs text-gray-400">R{rel.price}/mo</p>
                  </div>
                  <ArrowRight size={14} className="text-gray-300 group-hover:text-primary transition-colors shrink-0" />
                </a>
              );
            })}
            <a
              href={`${BASE}/pricing`}
              className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-gray-200 hover:border-primary/40 hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                <FileText size={18} className="text-gray-500" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-900 text-sm group-hover:text-primary transition-colors">View all packages</p>
                <p className="text-xs text-gray-400">Compare SEO, Ads & bundles</p>
              </div>
              <ArrowRight size={14} className="text-gray-300 group-hover:text-primary transition-colors shrink-0" />
            </a>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className={`py-16 bg-gradient-to-br ${pkg.gradient} text-center`}>
        <div className="max-w-2xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl font-black text-white mb-3">Ready to grow your business?</h2>
            <p className="text-white/70 mb-8">Start your {pkg.name} package today. No lock-in after 3 months.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={`${BASE}/checkout?type=${pkg.checkoutType}`}
                className="flex items-center gap-2 px-8 py-4 rounded-xl bg-white font-bold text-sm hover:-translate-y-0.5 transition-all shadow-xl"
                style={{ color: accentColor }}
              >
                Get Started — R{pkg.price}/mo <ArrowRight size={16} />
              </a>
              <button
                onClick={() => openWhatsApp(`Hi! I'd like to start the ${pkg.name} package.`)}
                className="flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-white/30 text-white/90 font-bold text-sm hover:bg-white/10 transition-all"
              >
                <MessageCircle size={16} /> Chat First
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
