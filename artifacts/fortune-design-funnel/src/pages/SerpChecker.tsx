import { useState } from "react";
import { motion } from "framer-motion";
import { useSEO } from "@/hooks/useSEO";
import { jsPDF } from "jspdf";
import {
  Search, Globe, Trophy, TrendingUp, TrendingDown, AlertTriangle,
  CheckCircle2, XCircle, ExternalLink, RefreshCw, BarChart3,
  Award, Target, Zap, Star, ChevronDown, Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { openWhatsAppModal } from "@/components/WhatsAppModal";
import { PoweredByBadge } from "@/components/PoweredByBadge";

const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") ?? "";

interface SerpResult {
  position: number;
  title: string;
  url: string;
  displayUrl: string;
  snippet: string;
  isTarget: boolean;
}

interface SerpResponse {
  domain: string;
  keyword: string;
  country: string;
  targetPosition: number | null;
  results: SerpResult[];
  totalChecked: number;
  checkedAt: string;
  error?: string;
  blocked?: boolean;
}

const COUNTRIES = [
  { code: "za", label: "🇿🇦 South Africa" },
  { code: "us", label: "🇺🇸 United States" },
  { code: "gb", label: "🇬🇧 United Kingdom" },
  { code: "au", label: "🇦🇺 Australia" },
  { code: "ca", label: "🇨🇦 Canada" },
  { code: "ng", label: "🇳🇬 Nigeria" },
];

function positionInfo(pos: number | null) {
  if (pos === null) return {
    label: "Not Ranking",
    sublabel: "Not found in top 50",
    color: "text-gray-500",
    bg: "bg-gray-100",
    border: "border-gray-200",
    ring: "ring-gray-300",
    barColor: "bg-gray-400",
    icon: XCircle,
    emoji: "😔",
    tip: "Your site isn't appearing in the top 50 results for this keyword. Consider optimising your content and building more backlinks.",
  };
  if (pos === 1) return {
    label: "#1 — Top Spot!",
    sublabel: "You own this keyword",
    color: "text-yellow-700",
    bg: "bg-yellow-50",
    border: "border-yellow-300",
    ring: "ring-yellow-400",
    barColor: "bg-yellow-400",
    icon: Trophy,
    emoji: "🏆",
    tip: "Outstanding! You rank #1. Focus on maintaining and expanding to related keywords.",
  };
  if (pos <= 3) return {
    label: `#${pos} — Podium`,
    sublabel: "Top 3 — excellent visibility",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-300",
    ring: "ring-emerald-400",
    barColor: "bg-emerald-500",
    icon: Trophy,
    emoji: "🥇",
    tip: "You're in the top 3 — capturing the majority of clicks. Keep up the content and backlink work.",
  };
  if (pos <= 10) return {
    label: `#${pos} — Page 1`,
    sublabel: "Excellent — on Google's first page",
    color: "text-sky-700",
    bg: "bg-sky-50",
    border: "border-sky-300",
    ring: "ring-sky-400",
    barColor: "bg-sky-500",
    icon: Star,
    emoji: "🌟",
    tip: "First page — you're getting clicks. Push toward the top 3 with stronger content and more backlinks.",
  };
  if (pos <= 20) return {
    label: `#${pos} — Page 2`,
    sublabel: "Close — a few optimisations away",
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-300",
    ring: "ring-amber-400",
    barColor: "bg-amber-500",
    icon: TrendingUp,
    emoji: "📈",
    tip: "Page 2 gets very few clicks. With targeted improvements, page 1 is within reach.",
  };
  if (pos <= 50) return {
    label: `#${pos} — Page 3–5`,
    sublabel: "Low visibility — needs attention",
    color: "text-orange-700",
    bg: "bg-orange-50",
    border: "border-orange-300",
    ring: "ring-orange-400",
    barColor: "bg-orange-500",
    icon: TrendingDown,
    emoji: "⚠️",
    tip: "Positions 20–50 receive almost no organic traffic. A proper SEO strategy can move you to page 1.",
  };
  return {
    label: `#${pos} — Very Low`,
    sublabel: "Minimal visibility",
    color: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-300",
    ring: "ring-red-400",
    barColor: "bg-red-500",
    icon: AlertTriangle,
    emoji: "🔴",
    tip: "Position 50+ means almost zero organic traffic. Significant SEO work is needed.",
  };
}

const LOADING_STEPS = [
  { icon: Globe,    label: "Connecting to Google Search" },
  { icon: Search,   label: "Scanning SERP results for your keyword" },
  { icon: Target,   label: "Locating your domain in the results" },
  { icon: BarChart3, label: "Compiling your rank report" },
];

export default function SerpCheckerPage() {
  useSEO({
    title: "Free Google SERP Rank Checker South Africa | Indexify",
    description: "Check where your website ranks on Google for any keyword — free, instant results. See your SERP position, top 50 results, and actionable tips to move up.",
    keywords: ["SERP rank checker South Africa", "Google ranking checker", "keyword rank checker free", "check website Google position", "SEO rank checker"],

  });

  const [domain, setDomain]     = useState("");
  const [keyword, setKeyword]   = useState("");
  const [country, setCountry]   = useState("za");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [result, setResult]     = useState<SerpResponse | null>(null);

  async function handleCheck(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/api/serp-check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain, keyword, country }),
      });
      const data: SerpResponse = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Check failed");
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const posInfo = result ? positionInfo(result.targetPosition) : null;

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900">
      <Navbar />

      {/* ── Hero ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="flex flex-wrap items-center justify-center gap-3 mb-5">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-semibold border border-primary/20">
              <BarChart3 size={14} /> Google SERP Rank Checker
            </div>
            <PoweredByBadge />
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-3 leading-tight text-gray-900">
            Check Your <span className="text-primary">Google Ranking</span>
          </h1>
          <p className="text-base text-gray-500 max-w-lg mx-auto">
            Enter your domain and a keyword to instantly see where you appear in Google's search results — and what's standing in your way.
          </p>
        </motion.div>

        {/* ── Form ── */}
        <motion.form
          onSubmit={handleCheck}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10"
        >
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6">
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              {/* Domain */}
              <div>
                <label htmlFor="domain" className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  Your Website / Domain
                </label>
                <div className="relative">
                  <Globe size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="domain"
                    type="text"
                    value={domain}
                    onChange={e => setDomain(e.target.value)}
                    placeholder="yourwebsite.co.za"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/15 transition-all bg-gray-50 focus:bg-white"
                    required
                  />
                </div>
              </div>

              {/* Keyword */}
              <div>
                <label htmlFor="keyword" className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  Keyword to Check
                </label>
                <div className="relative">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="keyword"
                    type="text"
                    value={keyword}
                    onChange={e => setKeyword(e.target.value)}
                    placeholder="e.g. SEO company South Africa"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/15 transition-all bg-gray-50 focus:bg-white"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Country + Submit */}
            <div className="flex flex-col sm:flex-row gap-3 items-end">
              <div className="w-full sm:w-52">
                <label htmlFor="country" className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  Search Country
                </label>
                <div className="relative">
                  <select
                    id="country"
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                    className="w-full appearance-none pl-4 pr-9 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 bg-gray-50 focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/15 transition-all focus:bg-white cursor-pointer"
                  >
                    {COUNTRIES.map(c => (
                      <option key={c.code} value={c.code}>{c.label}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 sm:flex-none px-8 py-3 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-all disabled:opacity-60 flex items-center gap-2 justify-center shadow-md shadow-primary/20"
              >
                {loading
                  ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Checking…</>
                  : <><Search size={15} />Check My Ranking</>
                }
              </button>
            </div>

            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 text-sm text-red-500 flex items-center gap-2">
                <XCircle size={14} className="shrink-0" /> {error}
              </motion.p>
            )}
          </div>
        </motion.form>

        {/* ── Loading ── */}
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-10">
            <div className="max-w-sm mx-auto text-center">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full border-[5px] border-primary/10" />
                <div className="absolute inset-0 rounded-full border-[5px] border-transparent border-t-primary animate-spin" />
                <div className="absolute inset-[10px] rounded-full border-[3px] border-transparent border-t-primary/40 animate-spin" style={{ animationDirection: "reverse", animationDuration: "0.8s" }} />
                <BarChart3 className="absolute inset-0 m-auto text-primary" size={22} />
              </div>
              <p className="font-black text-lg text-gray-900 mb-1">Scanning Google…</p>
              <p className="text-sm text-gray-400 mb-8">Checking the top 100 results for your keyword.</p>
              <div className="space-y-3 text-left">
                {LOADING_STEPS.map(({ icon: StepIcon, label }, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.5 + 0.2 }}
                    className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 px-4 py-3 shadow-sm"
                  >
                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <StepIcon size={14} className="text-primary" />
                    </div>
                    <span className="text-sm text-gray-600">{label}</span>
                    <div className="ml-auto w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin shrink-0" />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Results ── */}
        {result && !loading && posInfo && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">

            {/* Position badge card */}
            <div className={cn("bg-white rounded-2xl border-2 overflow-hidden shadow-sm", posInfo.border)}>
              <div className={cn("h-1.5 w-full", posInfo.barColor)} />
              <div className="p-6 md:p-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">

                  {/* Big position number */}
                  <div className={cn(
                    "w-32 h-32 rounded-3xl border-2 flex flex-col items-center justify-center shrink-0 shadow-inner",
                    posInfo.bg, posInfo.border
                  )}>
                    <span className="text-4xl font-black leading-none mb-0.5" style={{ fontSize: result.targetPosition === null ? "1.5rem" : result.targetPosition >= 100 ? "2rem" : "3rem" }}>
                      {result.targetPosition === null ? "N/A" : `#${result.targetPosition}`}
                    </span>
                    <span className={cn("text-xs font-bold uppercase tracking-wider", posInfo.color)}>
                      {result.targetPosition === null ? "Not Found" : result.targetPosition <= 3 ? "Top 3" : result.targetPosition <= 10 ? "Page 1" : `Pos ${result.targetPosition}`}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <posInfo.icon size={18} className={posInfo.color} />
                      <span className={cn("text-xl font-black", posInfo.color)}>{posInfo.label}</span>
                    </div>
                    <p className="text-sm text-gray-500 mb-1">{posInfo.sublabel}</p>
                    <p className="text-xs text-gray-400 mb-5">
                      Keyword: <span className="font-semibold text-gray-700">"{result.keyword}"</span>
                      {" · "}Domain: <span className="font-semibold text-gray-700">{result.domain}</span>
                      {" · "}Country: <span className="font-semibold text-gray-700">{result.country.toUpperCase()}</span>
                    </p>

                    {/* Stats row */}
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: "Your Position", value: result.targetPosition === null ? "—" : `#${result.targetPosition}`, color: posInfo.color },
                        { label: "Results Scanned", value: String(result.totalChecked), color: "text-sky-600" },
                        { label: "Page", value: result.targetPosition === null ? "—" : `${Math.ceil(result.targetPosition / 10)}`, color: "text-gray-700" },
                      ].map(({ label, value, color }, i) => (
                        <div key={i} className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-center">
                          <p className={cn("text-xl font-black leading-none mb-0.5", color)}>{value}</p>
                          <p className="text-[11px] text-gray-400">{label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tip banner */}
              <div className={cn("px-6 py-3 border-t", posInfo.bg, posInfo.border.replace("border-", "border-t-"))}>
                <p className="text-xs text-gray-600 flex items-start gap-2">
                  <Zap size={12} className={cn("shrink-0 mt-0.5", posInfo.color)} />
                  <span>{posInfo.tip}</span>
                </p>
              </div>
            </div>

            {/* SERP Results list */}
            {result.results.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    <BarChart3 size={15} className="text-primary" />
                    <h3 className="text-sm font-bold text-gray-800">
                      Top Ranking Websites &amp; Competitors
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] text-gray-400 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full font-medium">
                      keyword: <span className="text-gray-600 font-semibold">{result.keyword}</span>
                    </span>
                    <span className="text-[11px] bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-full font-semibold">
                      {result.results.length} results found
                    </span>
                  </div>
                </div>

                {/* Page dividers */}
                {(() => {
                  const items: React.ReactNode[] = [];
                  let lastPage = 0;
                  result.results.forEach((r) => {
                    const page = Math.ceil(r.position / 10);
                    if (page !== lastPage) {
                      lastPage = page;
                      items.push(
                        <div key={`page-${page}`} className="flex items-center gap-3 px-5 py-2 bg-gray-50/80 border-y border-gray-100">
                          <span className={cn(
                            "text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full",
                            page === 1 ? "bg-sky-100 text-sky-700" : page === 2 ? "bg-amber-100 text-amber-700" : "bg-gray-200 text-gray-500"
                          )}>
                            {page === 1 ? "🏆 Page 1" : page === 2 ? "📈 Page 2" : `📄 Page ${page}`}
                          </span>
                          <span className="text-[10px] text-gray-400">positions {(page - 1) * 10 + 1}–{page * 10}</span>
                        </div>
                      );
                    }
                    items.push(
                      <motion.div
                        key={r.position}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: Math.min(r.position * 0.02, 0.8) }}
                        className={cn(
                          "flex items-start gap-4 px-5 py-3.5 transition-colors border-b border-gray-50 last:border-0",
                          r.isTarget
                            ? "bg-primary/5 border-l-4 !border-l-primary"
                            : "hover:bg-gray-50/70"
                        )}
                      >
                        {/* Position badge */}
                        <div className={cn(
                          "shrink-0 w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm border",
                          r.isTarget
                            ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
                            : r.position <= 3
                              ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                              : r.position <= 10
                                ? "bg-sky-50 text-sky-700 border-sky-100"
                                : "bg-gray-100 text-gray-500 border-gray-200"
                        )}>
                          {r.position <= 3 && !r.isTarget ? ["🥇","🥈","🥉"][r.position - 1] : r.position}
                        </div>

                        {/* Favicon */}
                        <img
                          src={`https://www.google.com/s2/favicons?domain=${r.displayUrl}&sz=32`}
                          alt=""
                          role="presentation"
                          aria-hidden="true"
                          className="w-5 h-5 rounded-sm shrink-0 mt-2 bg-gray-100"
                          onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                        />

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                            {r.isTarget && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-black text-white bg-primary px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                                <CheckCircle2 size={9} /> Your Site
                              </span>
                            )}
                            <p className={cn(
                              "font-semibold text-sm truncate",
                              r.isTarget ? "text-primary" : "text-blue-700"
                            )}>
                              {r.title || r.displayUrl}
                            </p>
                            <a
                              href={r.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`Visit ${r.displayUrl}`}
                              className="text-gray-300 hover:text-primary transition-colors shrink-0"
                            >
                              <ExternalLink size={11} aria-hidden="true" />
                            </a>
                          </div>
                          <p className="text-[11px] text-green-700 truncate mb-1">{r.displayUrl}</p>
                          {r.snippet && (
                            <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{r.snippet}</p>
                          )}
                        </div>

                        {/* Competitor tag for non-target sites on page 1 */}
                        {!r.isTarget && r.position <= 10 && (
                          <span className="shrink-0 text-[9px] font-bold text-orange-600 bg-orange-50 border border-orange-100 px-1.5 py-0.5 rounded-md uppercase tracking-wide mt-1">
                            Competitor
                          </span>
                        )}
                      </motion.div>
                    );
                  });
                  return items;
                })()}
              </div>
            )}

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-primary/10 via-sky-50 to-violet-50 border border-primary/20 rounded-2xl p-8 text-center shadow-sm"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/15 border border-primary/25 mb-4">
                <Award size={22} className="text-primary" />
              </div>
              <h3 className="text-2xl font-black mb-2 text-gray-900">
                {result.targetPosition === null || result.targetPosition > 10
                  ? "Let's Get You to Page 1"
                  : "Want to Push Higher?"}
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto text-sm">
                {result.targetPosition === null || result.targetPosition > 10
                  ? "Our team builds custom SEO strategies that move websites to the top of Google — with transparent monthly reporting."
                  : "Our experts can help you climb to position #1 with targeted content, backlinks, and technical SEO."}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => openWhatsAppModal()}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#25d366] text-white font-bold text-sm hover:bg-[#20bc5a] transition-all shadow-md"
                >
                  <RefreshCw size={15} /> Get a Free SEO Strategy
                </button>
                <a
                  href={`${BASE}/audit`}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-all shadow-md"
                >
                  <Search size={15} /> Run a Full SEO Audit
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* ── Empty state ── */}
        {!result && !loading && !error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px bg-gray-200 flex-1" />
              <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold whitespace-nowrap">What you'll discover</p>
              <div className="h-px bg-gray-200 flex-1" />
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
              {[
                { icon: Trophy,      title: "Your Exact Position",    desc: "See your precise rank for any keyword — updated in real time from Google's live results.", color: "bg-yellow-50 border-yellow-100", iconColor: "text-yellow-600 bg-yellow-100" },
                { icon: BarChart3,   title: "Top 50 SERP Results",   desc: "Browse the full search results page to see exactly who you're competing against.", color: "bg-sky-50 border-sky-100", iconColor: "text-sky-600 bg-sky-100" },
                { icon: TrendingUp,  title: "Competitor Visibility", desc: "Spot the domains dominating page 1 so you can benchmark and outrank them.", color: "bg-emerald-50 border-emerald-100", iconColor: "text-emerald-600 bg-emerald-100" },
                { icon: Globe,       title: "Country-Specific SERPs", desc: "Check rankings for South Africa, US, UK, Australia, Canada, or Nigeria.", color: "bg-violet-50 border-violet-100", iconColor: "text-violet-600 bg-violet-100" },
                { icon: Zap,         title: "Instant Results",        desc: "No sign-up, no limits. Get your ranking in seconds with a single click.", color: "bg-orange-50 border-orange-100", iconColor: "text-orange-600 bg-orange-100" },
                { icon: Target,      title: "Actionable SEO Tips",    desc: "Each result includes a personalised tip on how to improve your position on Google.", color: "bg-pink-50 border-pink-100", iconColor: "text-pink-600 bg-pink-100" },
              ].map(({ icon: Icon, title, desc, color, iconColor }, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 + 0.1 }}
                  className={cn("border rounded-xl p-5 shadow-sm hover:shadow-md transition-all", color)}
                >
                  <div className={cn("p-2.5 rounded-lg w-fit mb-3", iconColor)}>
                    <Icon size={16} />
                  </div>
                  <h4 className="font-bold text-sm mb-1 text-gray-800">{title}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                </motion.div>
              ))}
            </div>

            {/* Trust row */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: CheckCircle2, label: "No sign-up required" },
                { icon: Zap,          label: "Results in seconds" },
                { icon: Globe,        label: "6 countries supported" },
              ].map(({ icon: Icon, label }, i) => (
                <div key={i} className="flex flex-col items-center gap-2 text-center bg-white border border-gray-100 rounded-xl py-4 px-3 shadow-sm">
                  <Icon size={16} className="text-primary" />
                  <p className="text-xs text-gray-500 font-medium">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Pricing nudge */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-sky-50/40 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">Want consistent page-1 rankings?</p>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
              We Rank Websites — <span className="text-gradient">Month After Month</span>
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">Flat monthly fee. No contracts. Real results backed by transparent reporting.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm p-7 flex flex-col"
            >
              <span className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Basic SEO</span>
              <div className="mb-4"><span className="text-4xl font-black text-gray-900">R5,900</span><span className="text-gray-400 text-sm">/mo</span></div>
              <ul className="space-y-2 mb-6 flex-1">
                {["Keyword Research & Strategy", "On-Page Optimisation", "Technical SEO Fixes", "Monthly Ranking Reports"].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle2 size={13} className="text-primary shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <a href={`${BASE}/services/seo`} className="block w-full text-center py-3 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-all shadow-md shadow-primary/20">
                Get Started →
              </a>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
              className="bg-gray-900 rounded-2xl border border-gray-800 shadow-xl p-7 flex flex-col relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10 -translate-y-1/2 translate-x-1/2" style={{ background: "radial-gradient(circle, #7c4dff, transparent)" }} />
              <span className="text-xs font-bold uppercase tracking-widest text-violet-400 mb-1">Advanced SEO</span>
              <div className="mb-4"><span className="text-4xl font-black text-white">R7,900</span><span className="text-gray-400 text-sm">/mo</span></div>
              <ul className="space-y-2 mb-6 flex-1">
                {["Everything in Basic", "Backlink Building Campaign", "Competitor Analysis & Strategy", "Core Web Vitals Optimisation", "Priority Support"].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                    <CheckCircle2 size={13} className="text-violet-400 shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <a href={`${BASE}/services/seo`} className="block w-full text-center py-3 rounded-xl text-gray-900 font-black text-sm transition-all shadow-md" style={{ background: "linear-gradient(90deg,#e040fb,#7c4dff,#0ea5c8)" }}>
                Get Started →
              </a>
            </motion.div>
          </div>

          <div className="text-center mt-8">
            <a href={`${BASE}/pricing`} className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-primary transition-colors font-medium">
              View full pricing & compare all packages →
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
