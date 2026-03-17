import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, CheckCircle2, XCircle, AlertTriangle, ChevronDown,
  ExternalLink, Zap, Globe, Image, Link2, Share2, ArrowLeft,
  Clock, FileText, MessageCircle, TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLink } from "wouter";

const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") ?? "";

type CheckStatus = "pass" | "warn" | "fail";

interface AuditCheck {
  name: string;
  status: CheckStatus;
  value: string;
  description: string;
}

interface AuditSection {
  title: string;
  score: number;
  checks: AuditCheck[];
}

interface AuditResult {
  url: string;
  finalUrl: string;
  overallScore: number;
  loadTimeMs: number;
  pageTitle: string;
  metaDescription: string;
  sections: AuditSection[];
  recommendations: string[];
}

const sectionIcons: Record<string, typeof Search> = {
  "On-Page SEO": FileText,
  "Technical SEO": Zap,
  "Images": Image,
  "Links": Link2,
  "Backlinks & Authority": TrendingUp,
  "Social & Structured Data": Share2,
};

const statusIcon = {
  pass: CheckCircle2,
  warn: AlertTriangle,
  fail: XCircle,
};

const statusColor = {
  pass: "text-emerald-400",
  warn: "text-amber-400",
  fail: "text-red-400",
};

const statusBg = {
  pass: "bg-emerald-400/10 border-emerald-400/20",
  warn: "bg-amber-400/10 border-amber-400/20",
  fail: "bg-red-400/10 border-red-400/20",
};

function scoreColor(score: number) {
  if (score >= 80) return "text-emerald-400";
  if (score >= 50) return "text-amber-400";
  return "text-red-400";
}

function scoreLabel(score: number) {
  if (score >= 80) return "Good";
  if (score >= 50) return "Needs Work";
  return "Poor";
}

function ScoreRing({ score, size = 120 }: { score: number; size?: number }) {
  const r = (size / 2) - 10;
  const circ = 2 * Math.PI * r;
  const progress = (score / 100) * circ;
  const color = score >= 80 ? "#34d399" : score >= 50 ? "#fbbf24" : "#f87171";
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={8} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={8}
        strokeDasharray={`${progress} ${circ}`}
        strokeLinecap="round"
        style={{ transition: "stroke-dasharray 1s ease" }}
      />
    </svg>
  );
}

function SectionCard({ section }: { section: AuditSection }) {
  const [open, setOpen] = useState(true);
  const Icon = sectionIcons[section.title] ?? Globe;
  return (
    <div className="bg-card border border-white/5 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 hover:bg-white/[0.02] transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Icon size={18} className="text-primary" />
          </div>
          <span className="font-bold text-lg">{section.title}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className={cn("font-black text-xl", scoreColor(section.score))}>
            {section.score}%
          </span>
          <ChevronDown
            size={18}
            className={cn("text-muted-foreground transition-transform duration-300", open && "rotate-180")}
          />
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-3 border-t border-white/5">
              {section.checks.map((check, i) => {
                const StatusIcon = statusIcon[check.status];
                return (
                  <div
                    key={i}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-xl border",
                      statusBg[check.status]
                    )}
                  >
                    <StatusIcon size={18} className={cn("mt-0.5 shrink-0", statusColor[check.status])} />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">{check.name}</span>
                        <span className="text-xs text-muted-foreground bg-white/5 px-2 py-0.5 rounded-full truncate max-w-[240px]">
                          {check.value}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{check.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AuditPage() {
  const [inputUrl, setInputUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [showWhatsApp, setShowWhatsApp] = useState(false);

  async function runAudit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/api/audit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: inputUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Audit failed");
      setResult(data as AuditResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const passes = result?.sections.reduce((s, sec) => s + sec.checks.filter(c => c.status === "pass").length, 0) ?? 0;
  const warns = result?.sections.reduce((s, sec) => s + sec.checks.filter(c => c.status === "warn").length, 0) ?? 0;
  const fails = result?.sections.reduce((s, sec) => s + sec.checks.filter(c => c.status === "fail").length, 0) ?? 0;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <a href={BASE + "/"} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={16} /> Back to Home
          </a>
          <a href={BASE + "/"} className="font-display font-black text-lg tracking-tight">
            <span className="text-foreground">FORTUNE</span>
            <span className="text-primary">DESIGN</span>
          </a>
          <a
            href="https://wa.me/27832555270"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-[#25d366] text-white text-sm font-bold hover:bg-[#20bc5a] transition-colors"
          >
            <MessageCircle size={14} /> WhatsApp Us
          </a>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Zap size={14} /> Free SEO Audit Tool
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            Instant <span className="text-primary">SEO Report</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Enter any website URL and get a detailed SEO analysis in seconds. We check 20+ ranking factors.
          </p>
        </motion.div>

        {/* Input Form */}
        <motion.form
          onSubmit={runAudit}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Globe size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="e.g. yourwebsite.co.za"
                className="w-full pl-11 pr-4 py-4 rounded-xl bg-card border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all text-base"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="sm:w-auto px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-base hover:bg-primary/90 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2 justify-center shadow-[0_0_20px_rgba(110,193,228,0.25)]"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Analysing...
                </>
              ) : (
                <>
                  <Search size={18} /> Run Free Audit
                </>
              )}
            </button>
          </div>
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3 text-sm text-red-400 flex items-center gap-2"
            >
              <XCircle size={14} /> {error}
            </motion.p>
          )}
        </motion.form>

        {/* Loading state */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="inline-flex flex-col items-center gap-6">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin" />
                <Globe className="absolute inset-0 m-auto text-primary" size={28} />
              </div>
              <div>
                <p className="text-lg font-bold mb-2">Crawling your website...</p>
                <p className="text-sm text-muted-foreground">Checking 20+ SEO factors. This may take a few seconds.</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Results */}
        {result && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Score overview */}
            <div className="bg-card border border-white/5 rounded-2xl p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Score ring */}
                <div className="relative shrink-0">
                  <ScoreRing score={result.overallScore} size={140} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={cn("text-4xl font-black", scoreColor(result.overallScore))}>
                      {result.overallScore}
                    </span>
                    <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                      {scoreLabel(result.overallScore)}
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex-1 w-full">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-bold truncate max-w-xs">
                      {result.pageTitle || "Untitled Page"}
                    </h2>
                    <a href={result.finalUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                      <ExternalLink size={14} />
                    </a>
                  </div>
                  <p className="text-sm text-muted-foreground mb-6 truncate">{result.finalUrl}</p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-white/[0.03] rounded-xl p-3 text-center">
                      <Clock size={16} className="mx-auto mb-1 text-primary" />
                      <p className="text-lg font-black">{result.loadTimeMs}ms</p>
                      <p className="text-xs text-muted-foreground">Load Time</p>
                    </div>
                    <div className="bg-emerald-400/10 rounded-xl p-3 text-center">
                      <CheckCircle2 size={16} className="mx-auto mb-1 text-emerald-400" />
                      <p className="text-lg font-black text-emerald-400">{passes}</p>
                      <p className="text-xs text-muted-foreground">Passed</p>
                    </div>
                    <div className="bg-amber-400/10 rounded-xl p-3 text-center">
                      <AlertTriangle size={16} className="mx-auto mb-1 text-amber-400" />
                      <p className="text-lg font-black text-amber-400">{warns}</p>
                      <p className="text-xs text-muted-foreground">Warnings</p>
                    </div>
                    <div className="bg-red-400/10 rounded-xl p-3 text-center">
                      <XCircle size={16} className="mx-auto mb-1 text-red-400" />
                      <p className="text-lg font-black text-red-400">{fails}</p>
                      <p className="text-xs text-muted-foreground">Failed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Top recommendations */}
            {result.recommendations.length > 0 && (
              <div className="bg-card border border-amber-400/20 rounded-2xl p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <AlertTriangle size={18} className="text-amber-400" />
                  Top Recommendations
                </h3>
                <ol className="space-y-3">
                  {result.recommendations.slice(0, 6).map((rec, i) => {
                    const isCritical = rec.startsWith("[Critical]");
                    const text = rec.replace(/^\[(Critical|Improve)\] /, "");
                    return (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <span className={cn(
                          "shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black mt-0.5",
                          isCritical ? "bg-red-400/20 text-red-400" : "bg-amber-400/20 text-amber-400"
                        )}>
                          {i + 1}
                        </span>
                        <span className="text-muted-foreground leading-relaxed">{text}</span>
                      </li>
                    );
                  })}
                </ol>
              </div>
            )}

            {/* Detailed sections */}
            <div className="space-y-4">
              {result.sections.map((section, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <SectionCard section={section} />
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20 rounded-2xl p-8 text-center"
            >
              <h3 className="text-2xl font-black mb-3">
                Want us to fix these issues?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Fortune Design's team will analyse your full site and build a custom SEO strategy to get you on Page 1 of Google.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="https://wa.me/27832555270"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#25d366] text-white font-bold hover:bg-[#20bc5a] transition-all"
                >
                  <MessageCircle size={18} /> Chat on WhatsApp
                </a>
                <a
                  href={BASE + "/"}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all"
                >
                  View Our SEO Packages
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Empty state */}
        {!result && !loading && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {[
              { icon: FileText, title: "On-Page SEO", desc: "Title tags, meta descriptions, headings, content quality" },
              { icon: Zap, title: "Technical SEO", desc: "HTTPS, page speed, robots.txt, sitemap, mobile viewport" },
              { icon: Image, title: "Image SEO", desc: "Alt text coverage, image optimisation checks" },
              { icon: Link2, title: "Link Analysis", desc: "Internal and external link structure" },
              { icon: Share2, title: "Social & Schema", desc: "Open Graph, Twitter Cards, structured data" },
              { icon: Globe, title: "20+ Checks", desc: "Comprehensive report with actionable recommendations" },
            ].map(({ icon: Icon, title, desc }, i) => (
              <div key={i} className="bg-card border border-white/5 rounded-xl p-5">
                <div className="p-2.5 rounded-lg bg-primary/10 w-fit mb-3">
                  <Icon size={18} className="text-primary" />
                </div>
                <h4 className="font-bold mb-1">{title}</h4>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
