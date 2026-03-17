import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, CheckCircle2, XCircle, AlertTriangle, ChevronDown,
  ExternalLink, Zap, Globe, Image, Link2, Share2, ArrowLeft,
  Clock, FileText, MessageCircle, TrendingUp, Award, BarChart3,
  Monitor, Smartphone, ImageOff
} from "lucide-react";
import { cn } from "@/lib/utils";

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

interface MissingAltImage {
  src: string;
  filename: string;
}

interface BacklinkResult {
  domain: string;
  dr: number;
  label: string;
  checkUrl: string;
  verified: boolean;
  note?: string;
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
  screenshots: { desktop: string | null; mobile: string | null };
  missingAltImages: MissingAltImage[];
  topBacklinks: BacklinkResult[];
}

const sectionIcons: Record<string, typeof Search> = {
  "On-Page SEO": FileText,
  "Technical SEO": Zap,
  "Images": Image,
  "Links": Link2,
  "Backlinks & Authority": TrendingUp,
  "Social & Structured Data": Share2,
};

function scoreToGrade(score: number): { grade: string; color: string; bg: string; border: string; label: string } {
  if (score >= 95) return { grade: "A+", color: "text-emerald-400", bg: "bg-emerald-400/15", border: "border-emerald-400/40", label: "Excellent" };
  if (score >= 90) return { grade: "A",  color: "text-emerald-400", bg: "bg-emerald-400/15", border: "border-emerald-400/40", label: "Excellent" };
  if (score >= 85) return { grade: "A−", color: "text-emerald-400", bg: "bg-emerald-400/15", border: "border-emerald-400/40", label: "Very Good" };
  if (score >= 80) return { grade: "B+", color: "text-sky-400",     bg: "bg-sky-400/15",     border: "border-sky-400/40",     label: "Good" };
  if (score >= 75) return { grade: "B",  color: "text-sky-400",     bg: "bg-sky-400/15",     border: "border-sky-400/40",     label: "Good" };
  if (score >= 70) return { grade: "B−", color: "text-sky-400",     bg: "bg-sky-400/15",     border: "border-sky-400/40",     label: "Above Average" };
  if (score >= 65) return { grade: "C+", color: "text-amber-400",   bg: "bg-amber-400/15",   border: "border-amber-400/40",   label: "Average" };
  if (score >= 60) return { grade: "C",  color: "text-amber-400",   bg: "bg-amber-400/15",   border: "border-amber-400/40",   label: "Average" };
  if (score >= 50) return { grade: "C−", color: "text-amber-400",   bg: "bg-amber-400/15",   border: "border-amber-400/40",   label: "Below Average" };
  if (score >= 40) return { grade: "D",  color: "text-orange-400",  bg: "bg-orange-400/15",  border: "border-orange-400/40",  label: "Poor" };
  return               { grade: "F",  color: "text-red-400",    bg: "bg-red-400/15",     border: "border-red-400/40",     label: "Critical" };
}

const statusIcon = { pass: CheckCircle2, warn: AlertTriangle, fail: XCircle };
const statusColor = { pass: "text-emerald-400", warn: "text-amber-400", fail: "text-red-400" };
const statusBg    = {
  pass: "bg-emerald-400/8 border-emerald-400/15",
  warn: "bg-amber-400/8 border-amber-400/15",
  fail: "bg-red-400/8 border-red-400/15",
};

function drColor(dr: number) {
  if (dr >= 80) return { text: "text-emerald-400", bg: "bg-emerald-400/15", border: "border-emerald-400/30" };
  if (dr >= 60) return { text: "text-sky-400",     bg: "bg-sky-400/15",     border: "border-sky-400/30" };
  if (dr >= 40) return { text: "text-amber-400",   bg: "bg-amber-400/15",   border: "border-amber-400/30" };
  if (dr >= 20) return { text: "text-orange-400",  bg: "bg-orange-400/15",  border: "border-orange-400/30" };
  return               { text: "text-red-400",     bg: "bg-red-400/15",     border: "border-red-400/30" };
}

function GradeBadge({ score, size = "md" }: { score: number; size?: "sm" | "md" | "lg" | "xl" }) {
  const g = scoreToGrade(score);
  const sizes = {
    sm:  "w-10 h-10 text-base",
    md:  "w-14 h-14 text-xl",
    lg:  "w-20 h-20 text-3xl",
    xl:  "w-28 h-28 text-5xl",
  };
  return (
    <div className={cn(
      "rounded-2xl border-2 flex items-center justify-center font-black shrink-0",
      g.bg, g.border, g.color, sizes[size]
    )}>
      {g.grade}
    </div>
  );
}

function SectionCard({ section, index, backlinkRecs }: { section: AuditSection; index: number; backlinkRecs?: string[] }) {
  const [open, setOpen] = useState(false);
  const Icon = sectionIcons[section.title] ?? Globe;
  const g = scoreToGrade(section.score);
  const passes = section.checks.filter(c => c.status === "pass").length;
  const warns  = section.checks.filter(c => c.status === "warn").length;
  const fails  = section.checks.filter(c => c.status === "fail").length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className={cn("bg-card rounded-2xl border overflow-hidden", open ? "border-white/10" : "border-white/5")}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/[0.025] transition-colors text-left gap-4"
      >
        <div className="flex items-center gap-4 min-w-0">
          <GradeBadge score={section.score} size="md" />
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <Icon size={14} className="text-muted-foreground shrink-0" />
              <span className="font-bold text-base truncate">{section.title}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className={g.color + " font-semibold"}>{g.label}</span>
              <span>·</span>
              <span className="text-emerald-400">{passes} passed</span>
              {warns > 0 && <><span>·</span><span className="text-amber-400">{warns} warnings</span></>}
              {fails > 0 && <><span>·</span><span className="text-red-400">{fails} failed</span></>}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-1">
            <div className="h-1.5 rounded-full bg-white/10 w-24 overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all duration-700", {
                  "bg-emerald-400": section.score >= 80,
                  "bg-sky-400":     section.score >= 70 && section.score < 80,
                  "bg-amber-400":   section.score >= 50 && section.score < 70,
                  "bg-orange-400":  section.score >= 40 && section.score < 50,
                  "bg-red-400":     section.score < 40,
                })}
                style={{ width: `${section.score}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground w-8 text-right">{section.score}%</span>
          </div>
          <ChevronDown
            size={16}
            className={cn("text-muted-foreground transition-transform duration-300 shrink-0", open && "rotate-180")}
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
            <div className="px-5 pb-5 pt-1 space-y-2.5 border-t border-white/5">
              {section.checks.map((check, i) => {
                const StatusIcon = statusIcon[check.status];
                return (
                  <div
                    key={i}
                    className={cn("flex items-start gap-3 p-3.5 rounded-xl border", statusBg[check.status])}
                  >
                    <StatusIcon size={16} className={cn("mt-0.5 shrink-0", statusColor[check.status])} />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">{check.name}</span>
                        <span className="text-xs text-muted-foreground bg-white/5 px-2 py-0.5 rounded-full truncate max-w-[260px]">
                          {check.value}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{check.description}</p>
                    </div>
                  </div>
                );
              })}

              {backlinkRecs && backlinkRecs.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/5">
                  <p className="text-xs font-bold text-primary uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <TrendingUp size={12} /> Backlink Building Strategy
                  </p>
                  <ol className="space-y-3">
                    {backlinkRecs.map((rec, i) => {
                      const clean = rec.replace("[Backlinks] ", "");
                      const colonIdx = clean.indexOf(": ");
                      const label = colonIdx !== -1 ? clean.slice(0, colonIdx) : clean;
                      const body  = colonIdx !== -1 ? clean.slice(colonIdx + 2) : "";
                      return (
                        <li key={i} className="flex items-start gap-3 text-sm">
                          <span className="shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-black mt-0.5">
                            {i + 1}
                          </span>
                          <span className="text-muted-foreground leading-relaxed">
                            <span className="text-foreground font-semibold">{label}</span>
                            {body && <span>: {body}</span>}
                          </span>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function AuditPage() {
  const [inputUrl, setInputUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AuditResult | null>(null);

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
  const warns  = result?.sections.reduce((s, sec) => s + sec.checks.filter(c => c.status === "warn").length, 0) ?? 0;
  const fails  = result?.sections.reduce((s, sec) => s + sec.checks.filter(c => c.status === "fail").length, 0) ?? 0;
  const overall = result ? scoreToGrade(result.overallScore) : null;

  const criticalRecs = result?.recommendations.filter(r => r.startsWith("[Critical]")) ?? [];
  const improveRecs  = result?.recommendations.filter(r => r.startsWith("[Improve]"))  ?? [];
  const backlinkRecs = result?.recommendations.filter(r => r.startsWith("[Backlinks]")) ?? [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <a href={BASE + "/"} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">
            <ArrowLeft size={15} /> Back to Home
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

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-semibold mb-5 border border-primary/20">
            <Award size={14} /> Free SEO Audit Tool
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-3 leading-tight">
            Instant <span className="text-primary">SEO Report Card</span>
          </h1>
          <p className="text-base text-muted-foreground max-w-lg mx-auto">
            Enter any website URL and receive a detailed grade report across 6 SEO categories — in seconds.
          </p>
        </motion.div>

        {/* Search bar */}
        <motion.form
          onSubmit={runAudit}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10"
        >
          <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
            <div className="flex-1 relative">
              <Globe size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={inputUrl}
                onChange={e => setInputUrl(e.target.value)}
                placeholder="e.g. yourwebsite.co.za"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-card border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-7 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-all disabled:opacity-60 flex items-center gap-2 justify-center shadow-[0_0_24px_rgba(110,193,228,0.2)] shrink-0"
            >
              {loading
                ? <><div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />Analysing...</>
                : <><Search size={16} /> Run Free Audit</>
              }
            </button>
          </div>
          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 text-sm text-red-400 flex items-center gap-2 justify-center">
              <XCircle size={14} /> {error}
            </motion.p>
          )}
        </motion.form>

        {/* Loading */}
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
            <div className="inline-flex flex-col items-center gap-5">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-primary/15" />
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin" />
                <Globe className="absolute inset-0 m-auto text-primary" size={22} />
              </div>
              <div>
                <p className="font-bold mb-1">Analysing your website...</p>
                <p className="text-sm text-muted-foreground">Checking 25+ SEO factors and capturing desktop &amp; mobile screenshots.</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Results */}
        {result && !loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">

            {/* ── Overall Grade Card ── */}
            <div className="bg-card border border-white/8 rounded-2xl overflow-hidden">
              {/* Top accent bar */}
              <div className={cn("h-1 w-full", {
                "bg-emerald-400": result.overallScore >= 80,
                "bg-sky-400":     result.overallScore >= 70 && result.overallScore < 80,
                "bg-amber-400":   result.overallScore >= 50 && result.overallScore < 70,
                "bg-orange-400":  result.overallScore >= 40 && result.overallScore < 50,
                "bg-red-400":     result.overallScore < 40,
              })} />

              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  {/* Overall grade badge */}
                  <div className="flex items-center gap-5">
                    <GradeBadge score={result.overallScore} size="xl" />
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">Overall Grade</p>
                      <p className={cn("text-5xl font-black leading-none mb-1", overall?.color)}>{overall?.grade}</p>
                      <p className="text-sm text-muted-foreground font-medium">{overall?.label} · {result.overallScore}/100</p>
                    </div>
                  </div>

                  <div className="w-px h-16 bg-white/8 hidden md:block" />

                  {/* Site info + stats */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-bold text-base truncate">{result.pageTitle || "Untitled Page"}</p>
                      <a href={result.finalUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary shrink-0 transition-colors">
                        <ExternalLink size={13} />
                      </a>
                    </div>
                    <p className="text-xs text-muted-foreground mb-5 truncate">{result.finalUrl}</p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { icon: Clock,         label: "Load Time",   value: `${result.loadTimeMs}ms`, color: "text-primary",     bg: "bg-primary/10" },
                        { icon: CheckCircle2,  label: "Passed",      value: String(passes),           color: "text-emerald-400", bg: "bg-emerald-400/10" },
                        { icon: AlertTriangle, label: "Warnings",    value: String(warns),            color: "text-amber-400",   bg: "bg-amber-400/10" },
                        { icon: XCircle,       label: "Failed",      value: String(fails),            color: "text-red-400",     bg: "bg-red-400/10" },
                      ].map(({ icon: Icon, label, value, color, bg }, i) => (
                        <div key={i} className={cn("rounded-xl p-3 text-center", bg)}>
                          <Icon size={15} className={cn("mx-auto mb-1.5", color)} />
                          <p className={cn("text-lg font-black leading-none mb-0.5", color)}>{value}</p>
                          <p className="text-[11px] text-muted-foreground">{label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Grade Summary Grid ── */}
            <div className="bg-card border border-white/5 rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                <BarChart3 size={14} /> Category Grades at a Glance
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {result.sections.map((section, i) => {
                  const g = scoreToGrade(section.score);
                  const Icon = sectionIcons[section.title] ?? Globe;
                  return (
                    <div key={i} className={cn("rounded-xl border p-3 text-center flex flex-col items-center gap-2", g.bg, g.border)}>
                      <Icon size={14} className="text-muted-foreground" />
                      <p className={cn("text-2xl font-black leading-none", g.color)}>{g.grade}</p>
                      <p className="text-[11px] text-muted-foreground leading-tight text-center">{section.title}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Top Backlinks ── */}
            {result.topBacklinks?.length > 0 && (
              <div className="bg-card border border-white/5 rounded-2xl overflow-hidden">
                <div className="px-5 pt-4 pb-3 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={14} className="text-primary" />
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                      Top Backlinks Found
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground">
                      {result.topBacklinks.filter(b => b.verified).length} verified · {result.topBacklinks.filter(b => b.note).length} recommended
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/5">
                        <th className="text-left px-5 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Source</th>
                        <th className="text-center px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">DR</th>
                        <th className="text-center px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                        <th className="text-right px-5 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">View</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      {result.topBacklinks.map((bl, i) => {
                        const dc = drColor(bl.dr);
                        return (
                          <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-3">
                                <img
                                  src={`https://www.google.com/s2/favicons?domain=${bl.domain}&sz=32`}
                                  alt=""
                                  className="w-5 h-5 rounded-sm shrink-0 bg-white/5"
                                  onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                                />
                                <div>
                                  <p className="font-semibold text-sm text-foreground">{bl.label}</p>
                                  <p className="text-[11px] text-muted-foreground">{bl.domain}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3.5 text-center">
                              <span className={cn(
                                "inline-flex items-center justify-center min-w-[42px] px-2 py-1 rounded-lg text-xs font-black border",
                                dc.bg, dc.border, dc.text
                              )}>
                                {bl.dr}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 text-center">
                              {bl.verified ? (
                                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-1 rounded-full">
                                  <CheckCircle2 size={11} /> Verified
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2.5 py-1 rounded-full">
                                  <AlertTriangle size={11} /> {bl.note ?? "Not listed"}
                                </span>
                              )}
                            </td>
                            <td className="px-5 py-3.5 text-right">
                              <a
                                href={bl.checkUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary transition-colors"
                              >
                                View <ExternalLink size={11} />
                              </a>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="px-5 py-3 border-t border-white/5">
                  <p className="text-[11px] text-muted-foreground">
                    <span className="text-emerald-400 font-semibold">Verified</span> = domain found mentioning your site. <span className="text-amber-400 font-semibold">Profile recommended</span> = high-authority platform where you should have a profile. DR scores are industry-standard domain authority ratings (0–100).
                  </p>
                </div>
              </div>
            )}

            {/* ── Site Preview Screenshots ── */}
            {(result.screenshots?.desktop || result.screenshots?.mobile) && (
              <div className="bg-card border border-white/5 rounded-2xl overflow-hidden">
                <div className="px-5 pt-4 pb-3 border-b border-white/5 flex items-center gap-2">
                  <Monitor size={14} className="text-muted-foreground" />
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    Site Preview
                  </h3>
                </div>
                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
                  {/* Desktop */}
                  {result.screenshots.desktop && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-1.5 rounded-md bg-primary/10 border border-primary/15">
                          <Monitor size={13} className="text-primary" />
                        </div>
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Desktop — 1280px</span>
                      </div>
                      {/* Browser chrome mockup */}
                      <div className="rounded-xl overflow-hidden border border-white/10 shadow-2xl">
                        <div className="bg-[#1e1e1e] px-3 py-2 flex items-center gap-2 border-b border-white/5">
                          <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/70" />
                            <div className="w-3 h-3 rounded-full bg-amber-500/70" />
                            <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
                          </div>
                          <div className="flex-1 mx-3 bg-white/5 rounded-md px-3 py-1 text-[10px] text-muted-foreground truncate border border-white/5">
                            {result.finalUrl}
                          </div>
                        </div>
                        <img
                          src={result.screenshots.desktop}
                          alt="Desktop screenshot"
                          className="w-full block object-cover object-top"
                          style={{ maxHeight: 340 }}
                          loading="lazy"
                        />
                      </div>
                    </div>
                  )}

                  {/* Mobile */}
                  {result.screenshots.mobile && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-1.5 rounded-md bg-primary/10 border border-primary/15">
                          <Smartphone size={13} className="text-primary" />
                        </div>
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Mobile — 390px</span>
                      </div>
                      {/* Phone mockup */}
                      <div className="flex justify-center">
                        <div className="w-full max-w-[260px]">
                          <div className="rounded-[28px] overflow-hidden border-[6px] border-white/15 shadow-2xl bg-[#1a1a1a]">
                            {/* Notch */}
                            <div className="bg-[#1a1a1a] flex justify-center py-2">
                              <div className="w-20 h-4 rounded-full bg-black/50" />
                            </div>
                            <img
                              src={result.screenshots.mobile}
                              alt="Mobile screenshot"
                              className="w-full block object-cover object-top"
                              style={{ maxHeight: 420 }}
                              loading="lazy"
                            />
                            {/* Home bar */}
                            <div className="bg-[#1a1a1a] flex justify-center py-2.5">
                              <div className="w-24 h-1 rounded-full bg-white/20" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Images Missing Alt Text ── */}
            {result.missingAltImages?.length > 0 && (
              <div className="bg-card border border-amber-400/20 rounded-2xl overflow-hidden">
                <div className="px-5 pt-4 pb-3 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ImageOff size={14} className="text-amber-400" />
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-400">
                      Images Missing Alt Text
                    </h3>
                  </div>
                  <span className="text-xs font-bold bg-amber-400/15 text-amber-400 border border-amber-400/30 px-2.5 py-0.5 rounded-full">
                    {result.missingAltImages.length} image{result.missingAltImages.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="p-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {result.missingAltImages.map((img, i) => (
                    <div key={i} className="group bg-white/[0.03] border border-white/8 rounded-xl overflow-hidden hover:border-amber-400/30 transition-colors">
                      {/* Thumbnail */}
                      <div className="aspect-video bg-white/5 relative overflow-hidden">
                        <img
                          src={img.src}
                          alt=""
                          className="w-full h-full object-cover object-top transition-transform group-hover:scale-105"
                          loading="lazy"
                          onError={e => {
                            (e.currentTarget as HTMLImageElement).style.display = "none";
                            (e.currentTarget.nextSibling as HTMLElement).style.display = "flex";
                          }}
                        />
                        {/* Broken image fallback */}
                        <div
                          className="absolute inset-0 hidden items-center justify-center flex-col gap-1 bg-white/[0.03]"
                        >
                          <ImageOff size={18} className="text-muted-foreground/40" />
                          <span className="text-[10px] text-muted-foreground/40">No preview</span>
                        </div>
                        {/* Overlay badge */}
                        <div className="absolute top-1.5 left-1.5 bg-amber-400/90 text-[9px] font-black text-black px-1.5 py-0.5 rounded uppercase tracking-wider">
                          No Alt
                        </div>
                      </div>
                      {/* URL */}
                      <div className="p-2.5">
                        <p className="text-[10px] text-muted-foreground truncate mb-1.5" title={img.filename}>
                          {img.filename || "Unnamed image"}
                        </p>
                        <a
                          href={img.src}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] text-primary hover:text-primary/80 transition-colors font-medium truncate max-w-full"
                          title={img.src}
                        >
                          <ExternalLink size={9} className="shrink-0" />
                          <span className="truncate">{img.src.replace(/^https?:\/\//, "")}</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-5 pb-4">
                  <p className="text-xs text-muted-foreground">
                    Add descriptive <code className="bg-white/8 px-1 py-0.5 rounded text-primary text-[10px]">alt="..."</code> attributes to each image above. Describe what the image shows — this helps Google index your images and improves accessibility.
                  </p>
                </div>
              </div>
            )}

            {/* ── Recommendations ── */}
            {(criticalRecs.length > 0 || improveRecs.length > 0) && (
              <div className="bg-card border border-white/5 rounded-2xl overflow-hidden">
                <div className="px-6 pt-5 pb-4 border-b border-white/5">
                  <h3 className="font-bold text-base flex items-center gap-2">
                    <AlertTriangle size={16} className="text-amber-400" />
                    Action Plan & Recommendations
                  </h3>
                </div>
                <div className="divide-y divide-white/5">
                  {/* Critical */}
                  {criticalRecs.length > 0 && (
                    <div className="px-6 py-4">
                      <p className="text-xs font-bold text-red-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                        <XCircle size={12} /> Critical — Fix Immediately
                      </p>
                      <ol className="space-y-2.5">
                        {criticalRecs.map((rec, i) => {
                          const [label, ...rest] = rec.replace("[Critical] ", "").split(": ");
                          return (
                            <li key={i} className="flex items-start gap-3 text-sm">
                              <span className="shrink-0 w-5 h-5 rounded-full bg-red-400/20 text-red-400 flex items-center justify-center text-[10px] font-black mt-0.5">{i + 1}</span>
                              <span className="text-muted-foreground leading-relaxed">
                                <span className="text-foreground font-semibold">{label}: </span>{rest.join(": ")}
                              </span>
                            </li>
                          );
                        })}
                      </ol>
                    </div>
                  )}

                  {/* Improve */}
                  {improveRecs.length > 0 && (
                    <div className="px-6 py-4">
                      <p className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                        <AlertTriangle size={12} /> Improvements Recommended
                      </p>
                      <ol className="space-y-2.5">
                        {improveRecs.slice(0, 8).map((rec, i) => {
                          const [label, ...rest] = rec.replace("[Improve] ", "").split(": ");
                          return (
                            <li key={i} className="flex items-start gap-3 text-sm">
                              <span className="shrink-0 w-5 h-5 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center text-[10px] font-black mt-0.5">{i + 1}</span>
                              <span className="text-muted-foreground leading-relaxed">
                                <span className="text-foreground font-semibold">{label}: </span>{rest.join(": ")}
                              </span>
                            </li>
                          );
                        })}
                      </ol>
                    </div>
                  )}

                </div>
              </div>
            )}

            {/* ── Detailed Section Cards ── */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2 px-1">
                <Search size={13} /> Detailed Breakdown
              </h3>
              <div className="space-y-3">
                {result.sections.map((section, i) => (
                  <SectionCard
                    key={i}
                    section={section}
                    index={i}
                    backlinkRecs={section.title === "Backlinks & Authority" ? backlinkRecs : undefined}
                  />
                ))}
              </div>
            </div>

            {/* ── CTA ── */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-br from-primary/10 via-primary/5 to-accent/5 border border-primary/20 rounded-2xl p-8 text-center"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/15 border border-primary/30 mb-4">
                <Award size={22} className="text-primary" />
              </div>
              <h3 className="text-2xl font-black mb-2">Want an A+ across the board?</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto text-sm">
                Our team will audit your full site, build a custom strategy, and get you ranking on Page 1 of Google.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href="https://wa.me/27832555270"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#25d366] text-white font-bold text-sm hover:bg-[#20bc5a] transition-all"
                >
                  <MessageCircle size={16} /> Chat on WhatsApp
                </a>
                <a
                  href={BASE + "/"}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(110,193,228,0.2)]"
                >
                  View Our SEO Packages
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Empty state — feature grid */}
        {!result && !loading && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-center text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-5">What we check</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { icon: FileText,    title: "On-Page SEO",           desc: "Title tags, meta descriptions, headings, keyword usage, word count" },
                { icon: Zap,         title: "Technical SEO",         desc: "HTTPS, load speed, mobile viewport, robots.txt, sitemap, canonical" },
                { icon: Image,       title: "Image Optimisation",    desc: "Alt text coverage, image count and performance checks" },
                { icon: Link2,       title: "Link Structure",        desc: "Internal and external link quality, anchor text analysis" },
                { icon: TrendingUp,  title: "Backlinks & Authority", desc: "Domain age, crawl activity, outbound diversity, social profile links" },
                { icon: Share2,      title: "Social & Schema",       desc: "Open Graph, Twitter Cards, structured data (JSON-LD)" },
              ].map(({ icon: Icon, title, desc }, i) => (
                <div key={i} className="bg-card border border-white/5 rounded-xl p-5 hover:border-white/10 transition-colors">
                  <div className="p-2.5 rounded-lg bg-primary/10 w-fit mb-3 border border-primary/10">
                    <Icon size={16} className="text-primary" />
                  </div>
                  <h4 className="font-bold text-sm mb-1">{title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
            <p className="text-center text-xs text-muted-foreground mt-6">
              Each category receives a letter grade from <span className="text-emerald-400 font-bold">A+</span> to <span className="text-red-400 font-bold">F</span> — just like a report card.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
