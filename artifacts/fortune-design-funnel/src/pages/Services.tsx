import { motion } from "framer-motion";
import {
  Search, MousePointerClick, CheckCircle2, ArrowRight, TrendingUp,
  Target, BarChart3, Zap, Clock, Award, ChevronDown, ChevronUp,
  Globe, Link2, MapPin, FileText, DollarSign, RefreshCw, Shield,
  Eye, Layers, Phone, Star, Users, Sparkles
} from "lucide-react";
import { useState } from "react";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useSEO } from "@/hooks/useSEO";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const fade = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};
const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const SEO_FEATURES = [
  { icon: Search,    title: "Keyword Research & Mapping",   desc: "50–200+ keywords grouped by intent and buying stage." },
  { icon: FileText,  title: "On-Page Optimisation",         desc: "Title tags, meta descriptions, headings, and content." },
  { icon: Zap,       title: "Technical SEO",                desc: "Site speed, Core Web Vitals, sitemaps, and schema." },
  { icon: MapPin,    title: "Local SEO & Maps",             desc: "Google Business Profile, citations, and map rankings." },
  { icon: Link2,     title: "Link Building",                desc: "White-hat backlinks from authoritative SA websites." },
  { icon: Globe,     title: "Content Strategy",             desc: "Blog articles and landing pages that rank and convert." },
];

const ADS_FEATURES = [
  { icon: MousePointerClick, title: "Search Campaigns",      desc: "Ads at the top of Google when buyers search for you." },
  { icon: Target,    title: "Keyword & Match Strategy",     desc: "Exact, phrase, and broad match with negative keywords." },
  { icon: Phone,     title: "Conversion Tracking",          desc: "Calls, forms, and purchases tracked to the campaign." },
  { icon: DollarSign,title: "Bid Management",               desc: "Manual CPC or Smart Bidding adjusted weekly." },
  { icon: RefreshCw, title: "A/B Ad Testing",               desc: "Continuous split testing of headlines and descriptions." },
  { icon: Shield,    title: "Click Fraud Protection",       desc: "Monitoring to protect your budget from invalid clicks." },
];

const COMPARE = [
  { label: "Speed to first results", seo: "3–6 months", ads: "24–48 hours" },
  { label: "Cost per click",         seo: "Free (organic)", ads: "Paid (CPC)" },
  { label: "Long-term ROI",          seo: "Compounds over time", ads: "Stops when budget stops" },
  { label: "Brand trust signals",    seo: "High (organic credibility)", ads: "Moderate" },
  { label: "Targeting precision",    seo: "Keyword-driven", ads: "Keyword + Audience + Device" },
  { label: "Best for",               seo: "Sustainable growth", ads: "Immediate lead generation" },
];

const PROCESS = [
  { step: "01", title: "Free Audit & Strategy Session", desc: "We analyse your website, competitors, and market — then recommend the right mix of SEO and Google Ads for your goals.", icon: Eye },
  { step: "02", title: "Onboarding & Setup",            desc: "We configure tracking, set up campaigns or content plans, and establish baselines within the first two weeks.", icon: Layers },
  { step: "03", title: "Execute & Optimise",            desc: "We implement the strategy, test continuously, and refine weekly based on real data — no set-and-forget.", icon: RefreshCw },
  { step: "04", title: "Transparent Monthly Reports",   desc: "Plain-language reports showing exactly what your spend generated — rankings, leads, conversions, and ROAS.", icon: BarChart3 },
];

const PACKAGES = [
  {
    slug: "basic-seo", name: "Basic SEO", price: "R5,900", period: "/month",
    tag: "Best for local businesses", img: `${BASE}/images/packages/basic-seo.png`,
    color: "from-sky-500 to-primary", border: "border-primary/20",
    includes: ["Up to 15 keywords", "On-page SEO", "Local SEO & GBP", "Monthly report"],
  },
  {
    slug: "advanced-seo", name: "Advanced SEO", price: "R7,900", period: "/month",
    tag: "Most popular", img: `${BASE}/images/packages/advanced-seo.png`,
    color: "from-primary to-violet-500", border: "border-primary/30", featured: true,
    includes: ["Up to 40 keywords", "Technical SEO audit", "DA40+ backlinks", "Blog content (1 post)"],
  },
  {
    slug: "premium-seo", name: "Premium SEO", price: "R11,900", period: "/month",
    tag: "For competitive markets", img: `${BASE}/images/packages/premium-seo.png`,
    color: "from-violet-500 to-purple-600", border: "border-violet-200",
    includes: ["Unlimited keywords", "DA90+ backlinks", "Press releases", "4 blog posts/month"],
  },
  {
    slug: "google-ads-management", name: "Google Ads", price: "R7,300", period: "/month",
    tag: "Ad spend billed separately", img: `${BASE}/images/packages/google-ads.png`,
    color: "from-amber-500 to-orange-500", border: "border-amber-200",
    includes: ["Search & Display campaigns", "Conversion tracking", "A/B ad testing", "Bid management"],
  },
];

const FAQS = [
  { q: "Should I run SEO and Google Ads at the same time?", a: "Yes — and the data shows this is the most effective approach. While SEO builds long-term authority, Google Ads provides immediate leads during the growth period. The keyword data from your Ads campaigns also informs your SEO strategy, and your organic visibility improves ad quality scores. Clients running both services typically see a 30–40% lower cost-per-lead from Ads as organic credibility builds." },
  { q: "How long does SEO take to work?", a: "Most clients see measurable improvements within 3–4 months, with significant traffic gains by month 6. Competitive industries may take 9–12 months for top-3 positions. We provide month-by-month tracking so you always see progress." },
  { q: "How quickly will Google Ads generate leads?", a: "Ads can generate leads within 24–48 hours of launch. The first 30 days are a learning phase. Most campaigns reach optimal performance by month 2–3." },
  { q: "Is my Google Ads spend included in the R7,300 management fee?", a: "No — your ad spend goes directly to Google. The R7,300/month management fee covers strategy, setup, ongoing optimisation, A/B testing, and reporting. We never take a margin on your budget." },
  { q: "What is the minimum budget for Google Ads in South Africa?", a: "We recommend R3,000–R5,000/month in ad spend to gather meaningful data. Highly competitive industries (legal, medical, insurance) may need R10,000+/month to compete effectively." },
  { q: "Do you lock clients into long-term contracts?", a: "No. We work on monthly agreements with 30 days' notice. We recommend a minimum 3-month commitment for Ads and 6 months for SEO to see meaningful results — but we don't lock you in." },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm cursor-pointer"
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-center justify-between px-6 py-5 hover:bg-gray-50 transition-colors">
        <span className="font-semibold text-gray-900 pr-4">{q}</span>
        {open
          ? <ChevronUp className="shrink-0 text-primary" size={20} />
          : <ChevronDown className="shrink-0 text-gray-400" size={20} />
        }
      </div>
      {open && (
        <div className="px-6 py-5 text-gray-500 leading-relaxed border-t border-gray-100 bg-gray-50/60">
          {a}
        </div>
      )}
    </div>
  );
}

export default function ServicesPage() {
  useSEO({
    title: "SEO & Google Ads Services South Africa | Indexify",
    description: "Indexify offers expert SEO and Google Ads management for South African businesses. Rank on Google page 1 and generate immediate leads with transparent pricing from R5,900/month.",
    keywords: [
      "SEO and Google Ads South Africa", "digital marketing services South Africa",
      "SEO agency South Africa", "Google Ads management South Africa",
      "search engine optimisation services SA", "PPC management South Africa",
      "affordable digital marketing SA", "SEO services Cape Town Johannesburg Durban",
      "Google Ads management Cape Town", "online marketing agency South Africa",
      "local SEO services South Africa", "search marketing agency SA",
    ],
    canonical: "https://indexify.co.za/services/",
  });

  return (
    <div className="min-h-screen bg-white text-foreground">
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="relative pt-36 pb-24 md:pt-52 md:pb-32 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Background image */}
        <img
          src={`${BASE}/images/hero-bg.png`}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-luminosity pointer-events-none"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-violet-900/40 pointer-events-none" />
        <div className="absolute top-20 right-20 w-80 h-80 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={stagger} initial="hidden" animate="visible"
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div variants={fade} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white/80 text-sm font-medium mb-6">
              <Sparkles size={14} className="text-primary" />
              South Africa's Search Marketing Specialists
            </motion.div>

            <motion.h1 variants={fade} className="text-4xl md:text-6xl font-black text-white leading-tight mb-6">
              Get Found on Google.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-violet-400">
                Get More Customers.
              </span>
            </motion.h1>

            <motion.p variants={fade} className="text-lg md:text-xl text-white/70 leading-relaxed max-w-3xl mx-auto mb-10">
              Indexify combines long-term SEO with immediate Google Ads results — giving your business sustainable growth and instant lead generation from day one.
            </motion.p>

            <motion.div variants={fade} className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={`${BASE}/audit`} className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-white font-bold text-base hover:bg-primary/90 transition-all shadow-lg hover:-translate-y-0.5">
                  Get Free SEO Audit
                  <ArrowRight size={18} />
                </a>
              <a href={`${BASE}/contact`} className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white/10 backdrop-blur border border-white/25 text-white font-semibold text-base hover:bg-white/20 transition-all">
                  Book a Strategy Call
                  <ArrowRight size={18} />
                </a>
            </motion.div>
          </motion.div>

          {/* Stat bar */}
          <motion.div
            variants={stagger} initial="hidden" animate="visible"
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
          >
            {[
              { num: "150+", label: "Clients Served" },
              { num: "R5,900", label: "SEO from /month" },
              { num: "6×", label: "Avg Traffic Increase" },
              { num: "30 days", label: "Notice Period — No Lock-in" },
            ].map((s) => (
              <motion.div key={s.label} variants={fade} className="bg-white/10 backdrop-blur border border-white/15 rounded-2xl p-5 text-center">
                <div className="text-2xl font-black text-white">{s.num}</div>
                <div className="text-xs text-white/60 mt-1">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── SERVICE CARDS ─────────────────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid md:grid-cols-2 gap-8">

            {/* SEO Card */}
            <motion.div variants={fade} className="group bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="relative h-52 bg-gradient-to-br from-sky-50 to-blue-100 overflow-hidden">
                <img
                  src={`${BASE}/images/seo-illustration.png`}
                  alt="SEO services illustration"
                  className="absolute inset-0 w-full h-full object-cover object-center opacity-80 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/40 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary text-white text-xs font-bold">
                    <Search size={11} /> SEO
                  </span>
                </div>
              </div>
              <div className="p-8">
                <h2 className="text-2xl font-black text-gray-900 mb-3">Search Engine Optimisation</h2>
                <p className="text-gray-500 leading-relaxed mb-6">
                  Rank on Google page 1 for the searches your customers are already making. Our SEO builds lasting organic authority that compounds in value every month.
                </p>
                <ul className="space-y-2 mb-8">
                  {["On-page & technical SEO", "Local SEO & Google Maps", "Authority link building", "Monthly rank tracking"].map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-gray-600">
                      <CheckCircle2 size={16} className="text-primary shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-gray-400 uppercase tracking-wide">From</span>
                    <div className="text-2xl font-black text-primary">R5,900<span className="text-sm font-normal text-gray-400">/month</span></div>
                  </div>
                  <a href={`${BASE}/services/seo`} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-all">
                      Learn More <ArrowRight size={15} />
                    </a>
                </div>
              </div>
            </motion.div>

            {/* Google Ads Card */}
            <motion.div variants={fade} className="group bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="relative h-52 bg-gradient-to-br from-violet-50 to-purple-100 overflow-hidden">
                <img
                  src={`${BASE}/images/ads-illustration.png`}
                  alt="Google Ads management illustration"
                  className="absolute inset-0 w-full h-full object-cover object-center opacity-80 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/40 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-600 text-white text-xs font-bold">
                    <MousePointerClick size={11} /> Google Ads
                  </span>
                </div>
              </div>
              <div className="p-8">
                <h2 className="text-2xl font-black text-gray-900 mb-3">Google Ads Management</h2>
                <p className="text-gray-500 leading-relaxed mb-6">
                  Generate qualified leads within 24–48 hours of launch. We manage your campaigns end-to-end — from strategy and creative to daily optimisation and transparent reporting.
                </p>
                <ul className="space-y-2 mb-8">
                  {["Search, Display & Remarketing", "Conversion tracking setup", "A/B ad copy testing", "Weekly bid optimisation"].map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-gray-600">
                      <CheckCircle2 size={16} className="text-violet-600 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-gray-400 uppercase tracking-wide">From</span>
                    <div className="text-2xl font-black text-violet-600">R7,300<span className="text-sm font-normal text-gray-400">/month</span></div>
                  </div>
                  <a href={`${BASE}/services/google-ads`} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-violet-600 text-white font-bold text-sm hover:bg-violet-700 transition-all">
                      Learn More <ArrowRight size={15} />
                    </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── SEO DEEP DIVE ─────────────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Image side */}
            <motion.div variants={fade} initial="hidden" whileInView="visible" viewport={{ once: true }} className="relative order-2 lg:order-1">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src={`${BASE}/images/homepage-results.png`}
                  alt="SEO ranking results for South African businesses"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-5 -right-5 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <TrendingUp size={20} className="text-primary" />
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900">+427% Organic Traffic</div>
                  <div className="text-xs text-gray-400">Avg. client result in 12 months</div>
                </div>
              </div>
            </motion.div>

            {/* Text side */}
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="order-1 lg:order-2">
              <motion.div variants={fade}>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-4">
                  <Search size={12} /> Search Engine Optimisation
                </span>
                <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-5 leading-tight">
                  Rank on Google Page 1 —{" "}
                  <span className="text-primary">and Stay There</span>
                </h2>
                <p className="text-gray-500 leading-relaxed mb-8">
                  SEO is the highest-ROI marketing channel for most South African businesses. Unlike paid ads, every ranking you earn keeps paying dividends — month after month, without ongoing ad spend.
                </p>
              </motion.div>

              <motion.div variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {SEO_FEATURES.map(({ icon: Icon, title, desc }) => (
                  <motion.div key={title} variants={fade} className="flex gap-3 p-4 rounded-2xl bg-gray-50 hover:bg-primary/5 transition-colors border border-gray-100">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon size={17} className="text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">{title}</div>
                      <div className="text-xs text-gray-400 mt-0.5 leading-relaxed">{desc}</div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div variants={fade} className="mt-8">
                <a href={`${BASE}/services/seo`} className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all">
                    Explore SEO packages <ArrowRight size={16} />
                  </a>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── GOOGLE ADS DEEP DIVE ──────────────────────────────────────────────── */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Text side */}
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <motion.div variants={fade}>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-xs font-bold mb-4">
                  <MousePointerClick size={12} /> Google Ads Management
                </span>
                <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-5 leading-tight">
                  Instant Leads While{" "}
                  <span className="text-violet-600">Your SEO Grows</span>
                </h2>
                <p className="text-gray-500 leading-relaxed mb-8">
                  Google Ads puts your business at the top of search results immediately — before SEO kicks in. We manage every aspect of your campaigns to maximise leads and minimise wasted spend.
                </p>
              </motion.div>

              <motion.div variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {ADS_FEATURES.map(({ icon: Icon, title, desc }) => (
                  <motion.div key={title} variants={fade} className="flex gap-3 p-4 rounded-2xl bg-white hover:bg-violet-50 transition-colors border border-gray-100">
                    <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center shrink-0">
                      <Icon size={17} className="text-violet-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">{title}</div>
                      <div className="text-xs text-gray-400 mt-0.5 leading-relaxed">{desc}</div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div variants={fade} className="mt-8">
                <a href={`${BASE}/services/google-ads`} className="inline-flex items-center gap-2 text-violet-600 font-bold hover:gap-3 transition-all">
                    Explore Google Ads management <ArrowRight size={16} />
                  </a>
              </motion.div>
            </motion.div>

            {/* Image side */}
            <motion.div variants={fade} initial="hidden" whileInView="visible" viewport={{ once: true }} className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src={`${BASE}/images/homepage-analytics.png`}
                  alt="Google Ads analytics dashboard showing campaign performance"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-transparent" />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
                  <DollarSign size={20} className="text-violet-600" />
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900">-52% Cost Per Lead</div>
                  <div className="text-xs text-gray-400">Avg. improvement after 90 days</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── BETTER TOGETHER ───────────────────────────────────────────────────── */}
      <section className="py-24 bg-gradient-to-br from-primary to-violet-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src={`${BASE}/images/pattern.png`} alt="" aria-hidden className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <motion.div variants={fade}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 text-white text-sm font-semibold mb-5">
                <Sparkles size={14} /> The Synergy Advantage
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-white mb-5">
                Better Together
              </h2>
              <p className="text-lg text-white/75 max-w-2xl mx-auto">
                Businesses running both SEO and Google Ads see dramatically better results than those using either service alone.
              </p>
            </motion.div>
          </motion.div>

          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: BarChart3, num: "2×", label: "More clicks vs Ads alone",
                desc: "Appearing in both paid and organic positions dramatically increases trust and click-through rates from the same SERP.",
              },
              {
                icon: Target, num: "30%", label: "Lower cost-per-lead",
                desc: "Organic credibility improves your Google Ads Quality Score, reducing your CPC and making every advertising Rand go further.",
              },
              {
                icon: TrendingUp, num: "6×", label: "More keyword data",
                desc: "Ads conversion data tells you exactly which keywords drive customers — powering a more precise SEO strategy from day one.",
              },
            ].map(({ icon: Icon, num, label, desc }) => (
              <motion.div key={label} variants={fade} className="bg-white/15 backdrop-blur border border-white/20 rounded-3xl p-8 text-center">
                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-5">
                  <Icon size={26} className="text-white" />
                </div>
                <div className="text-4xl font-black text-white mb-1">{num}</div>
                <div className="text-sm font-semibold text-white/80 mb-4">{label}</div>
                <p className="text-sm text-white/60 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── COMPARISON TABLE ──────────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.div variants={fade} className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">SEO vs Google Ads — At a Glance</h2>
              <p className="text-gray-500">Understanding which service fits your current stage — or why both makes strategic sense.</p>
            </motion.div>

            <motion.div variants={fade} className="rounded-3xl overflow-hidden border border-gray-200 shadow-sm">
              {/* Header */}
              <div className="grid grid-cols-3 bg-gray-900 text-white">
                <div className="p-5 font-semibold text-gray-300 text-sm">Factor</div>
                <div className="p-5 font-bold text-center border-l border-gray-700">
                  <span className="inline-flex items-center gap-1.5 text-primary"><Search size={14} /> SEO</span>
                </div>
                <div className="p-5 font-bold text-center border-l border-gray-700">
                  <span className="inline-flex items-center gap-1.5 text-violet-400"><MousePointerClick size={14} /> Google Ads</span>
                </div>
              </div>
              {/* Rows */}
              {COMPARE.map((row, i) => (
                <div key={row.label} className={`grid grid-cols-3 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                  <div className="p-5 text-sm font-semibold text-gray-600 border-b border-gray-100">{row.label}</div>
                  <div className="p-5 text-sm text-gray-700 text-center border-l border-gray-100 border-b">{row.seo}</div>
                  <div className="p-5 text-sm text-gray-700 text-center border-l border-gray-100 border-b">{row.ads}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── PACKAGES ──────────────────────────────────────────────────────────── */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.div variants={fade} className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">Simple, Transparent Pricing</h2>
              <p className="text-gray-500 max-w-xl mx-auto">No hidden fees. No commissions on ad spend. Just clear pricing and real results.</p>
            </motion.div>

            <motion.div variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {PACKAGES.map((pkg) => (
                <motion.div
                  key={pkg.slug}
                  variants={fade}
                  className={`bg-white rounded-3xl border ${pkg.border} shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${pkg.featured ? "ring-2 ring-primary" : ""} flex flex-col`}
                >
                  {pkg.featured && (
                    <div className="bg-primary text-white text-xs font-bold text-center py-2 tracking-wide">
                      ⭐ MOST POPULAR
                    </div>
                  )}
                  {/* Package image */}
                  <div className={`relative h-36 bg-gradient-to-br ${pkg.color} overflow-hidden`}>
                    <img
                      src={pkg.img}
                      alt={`${pkg.name} package`}
                      className="absolute inset-0 w-full h-full object-cover opacity-75"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute bottom-3 left-4">
                      <div className="text-white font-black text-lg">{pkg.name}</div>
                      <div className="text-white/75 text-xs">{pkg.tag}</div>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <div className="mb-5">
                      <span className="text-3xl font-black text-gray-900">{pkg.price}</span>
                      <span className="text-sm text-gray-400">{pkg.period}</span>
                    </div>

                    <ul className="space-y-2.5 mb-6 flex-1">
                      {pkg.includes.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                          <CheckCircle2 size={15} className="text-primary shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>

                    <a href={`${BASE}/packages/${pkg.slug}`} className={`block text-center py-3 rounded-xl font-bold text-sm transition-all ${
                        pkg.featured
                          ? "bg-primary text-white hover:bg-primary/90"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      }`}>
                        View Package Details
                      </a>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.p variants={fade} className="text-center text-sm text-gray-400 mt-8">
              Ad spend billed directly by Google — Indexify never takes a margin on your budget.
              <a href={`${BASE}/pricing`} className="text-primary font-semibold ml-2 hover:underline">Compare all plans →</a>
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── PROCESS ───────────────────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.div variants={fade} className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">How We Get You Started</h2>
              <p className="text-gray-500">A simple, proven onboarding process that gets results fast.</p>
            </motion.div>

            <motion.div variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {PROCESS.map(({ step, title, desc, icon: Icon }) => (
                <motion.div key={step} variants={fade} className="relative p-6 rounded-3xl bg-gray-50 border border-gray-100 hover:border-primary/20 hover:bg-primary/5 transition-all">
                  <div className="text-5xl font-black text-gray-100 mb-4 leading-none">{step}</div>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Icon size={20} className="text-primary" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── RESULTS SHOWCASE ──────────────────────────────────────────────────── */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <motion.div variants={fade}>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold mb-4">
                  <Award size={12} /> Real Results
                </span>
                <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-5">
                  Numbers That{" "}
                  <span className="text-primary">Speak for Themselves</span>
                </h2>
                <p className="text-gray-500 leading-relaxed mb-10">
                  We measure success the same way you do — more customers, lower acquisition costs, and sustainable growth. Here's what our clients typically achieve.
                </p>
              </motion.div>

              <motion.div variants={stagger} className="grid grid-cols-2 gap-5">
                {[
                  { num: "Page 1", sub: "Google rankings", icon: Star, color: "text-amber-500 bg-amber-50" },
                  { num: "+6×",    sub: "Organic traffic",  icon: TrendingUp, color: "text-emerald-500 bg-emerald-50" },
                  { num: "-52%",   sub: "Cost per lead",    icon: DollarSign, color: "text-violet-500 bg-violet-50" },
                  { num: "150+",   sub: "SA businesses",    icon: Users, color: "text-primary bg-primary/10" },
                ].map(({ num, sub, icon: Icon, color }) => (
                  <motion.div key={sub} variants={fade} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
                      <Icon size={18} />
                    </div>
                    <div className="text-3xl font-black text-gray-900">{num}</div>
                    <div className="text-sm text-gray-400 mt-1">{sub}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div variants={fade} initial="hidden" whileInView="visible" viewport={{ once: true }} className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={`${BASE}/images/homepage-team.png`}
                alt="Indexify digital marketing team working on SEO and Google Ads"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-white/95 backdrop-blur rounded-2xl p-4 flex items-center gap-4">
                  <div className="flex -space-x-2">
                    {["🧑‍💼","👩‍💻","👨‍💻","👩‍🎨"].map((e, i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center text-sm border-2 border-white">{e}</div>
                    ))}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">South Africa's Search Team</div>
                    <div className="text-xs text-gray-400">Dedicated SEO & Ads specialists</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.div variants={fade} className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">Frequently Asked Questions</h2>
              <p className="text-gray-500">Everything you need to know before getting started.</p>
            </motion.div>
            <motion.div variants={stagger} className="space-y-3">
              {FAQS.map((f) => (
                <motion.div key={f.q} variants={fade}>
                  <FAQItem q={f.q} a={f.a} />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────────── */}
      <section className="py-24 bg-gradient-to-br from-slate-900 to-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <img src={`${BASE}/images/pattern.png`} alt="" aria-hidden className="w-full h-full object-cover" />
        </div>
        <div className="absolute top-10 right-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-20 w-48 h-48 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.div variants={fade}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-primary text-sm font-semibold mb-6">
                <Clock size={14} /> Start generating leads this week
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-5 leading-tight">
                Ready to Dominate{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-violet-400">Google Search?</span>
              </h2>
              <p className="text-lg text-white/65 mb-10 max-w-2xl mx-auto">
                Get a free SEO audit and strategy consultation. We'll show you exactly where your website stands and what it will take to reach page 1.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href={`${BASE}/audit`} className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-white font-bold text-base hover:bg-primary/90 transition-all shadow-lg hover:-translate-y-0.5">
                    Get My Free SEO Audit
                    <ArrowRight size={18} />
                  </a>
                <a href={`${BASE}/contact`} className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white/10 border border-white/20 text-white font-semibold text-base hover:bg-white/20 transition-all">
                    Talk to Our Team
                    <ArrowRight size={18} />
                  </a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
