import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSEO } from "@/hooks/useSEO";
import {
  Search, CheckCircle2, XCircle, AlertTriangle, ChevronDown,
  ExternalLink, Zap, Globe, Image, Link2, Share2,
  Clock, FileText, TrendingUp, Award, BarChart3,
  Monitor, Smartphone, ImageOff, Tag
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PoweredByBadge } from "@/components/PoweredByBadge";

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

interface KeywordEntry {
  keyword: string;
  source: string;
  count: number;
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
  rankingKeywords: KeywordEntry[];
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
  if (score >= 95) return { grade: "A+", color: "text-emerald-600", bg: "bg-emerald-50",  border: "border-emerald-200", label: "Excellent" };
  if (score >= 90) return { grade: "A",  color: "text-emerald-600", bg: "bg-emerald-50",  border: "border-emerald-200", label: "Excellent" };
  if (score >= 85) return { grade: "A−", color: "text-emerald-600", bg: "bg-emerald-50",  border: "border-emerald-200", label: "Very Good" };
  if (score >= 80) return { grade: "B+", color: "text-sky-600",     bg: "bg-sky-50",      border: "border-sky-200",     label: "Good" };
  if (score >= 75) return { grade: "B",  color: "text-sky-600",     bg: "bg-sky-50",      border: "border-sky-200",     label: "Good" };
  if (score >= 70) return { grade: "B−", color: "text-sky-600",     bg: "bg-sky-50",      border: "border-sky-200",     label: "Above Average" };
  if (score >= 65) return { grade: "C+", color: "text-amber-600",   bg: "bg-amber-50",    border: "border-amber-200",   label: "Average" };
  if (score >= 60) return { grade: "C",  color: "text-amber-600",   bg: "bg-amber-50",    border: "border-amber-200",   label: "Average" };
  if (score >= 50) return { grade: "C−", color: "text-amber-600",   bg: "bg-amber-50",    border: "border-amber-200",   label: "Below Average" };
  if (score >= 40) return { grade: "D",  color: "text-orange-600",  bg: "bg-orange-50",   border: "border-orange-200",  label: "Poor" };
  return               { grade: "F",  color: "text-red-600",    bg: "bg-red-50",      border: "border-red-200",     label: "Critical" };
}

const statusIcon  = { pass: CheckCircle2, warn: AlertTriangle, fail: XCircle };
const statusColor = { pass: "text-emerald-500", warn: "text-amber-500", fail: "text-red-500" };
const statusBg    = {
  pass: "bg-emerald-50 border-emerald-200",
  warn: "bg-amber-50  border-amber-200",
  fail: "bg-red-50    border-red-200",
};

function drColor(dr: number) {
  if (dr >= 80) return { text: "text-emerald-700", bg: "bg-emerald-50",  border: "border-emerald-200" };
  if (dr >= 60) return { text: "text-sky-700",     bg: "bg-sky-50",      border: "border-sky-200" };
  if (dr >= 40) return { text: "text-amber-700",   bg: "bg-amber-50",    border: "border-amber-200" };
  if (dr >= 20) return { text: "text-orange-700",  bg: "bg-orange-50",   border: "border-orange-200" };
  return               { text: "text-red-700",     bg: "bg-red-50",      border: "border-red-200" };
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

function SectionCard({ section, index, backlinkRecs, missingAltImages, topBacklinks }: {
  section: AuditSection;
  index: number;
  backlinkRecs?: string[];
  missingAltImages?: MissingAltImage[];
  topBacklinks?: BacklinkResult[];
}) {
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
      className={cn(
        "bg-white rounded-2xl border overflow-hidden transition-shadow",
        open ? "border-gray-200 shadow-md" : "border-gray-100 shadow-sm hover:shadow-md"
      )}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors text-left gap-4"
      >
        <div className="flex items-center gap-4 min-w-0">
          <GradeBadge score={section.score} size="md" />
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <Icon size={14} className="text-gray-400 shrink-0" />
              <span className="font-bold text-base text-gray-900 truncate">{section.title}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span className={g.color + " font-semibold"}>{g.label}</span>
              <span>·</span>
              <span className="text-emerald-600">{passes} passed</span>
              {warns > 0 && <><span>·</span><span className="text-amber-600">{warns} warnings</span></>}
              {fails > 0 && <><span>·</span><span className="text-red-600">{fails} failed</span></>}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-2">
            <div className="h-1.5 rounded-full bg-gray-100 w-24 overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all duration-700", {
                  "bg-emerald-500": section.score >= 80,
                  "bg-sky-500":     section.score >= 70 && section.score < 80,
                  "bg-amber-500":   section.score >= 50 && section.score < 70,
                  "bg-orange-500":  section.score >= 40 && section.score < 50,
                  "bg-red-500":     section.score < 40,
                })}
                style={{ width: `${section.score}%` }}
              />
            </div>
            <span className="text-xs text-gray-400 w-8 text-right font-medium">{section.score}%</span>
          </div>
          <ChevronDown
            size={16}
            className={cn("text-gray-400 transition-transform duration-300 shrink-0", open && "rotate-180")}
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
            <div className="px-5 pb-5 pt-2 space-y-2.5 border-t border-gray-100">
              {section.checks.map((check, i) => {
                const StatusIcon = statusIcon[check.status];
                const isAltCheck = check.name === "Image Alt Text";
                return (
                  <div key={i}>
                    <div className={cn("flex items-start gap-3 p-3.5 rounded-xl border", statusBg[check.status])}>
                      <StatusIcon size={16} className={cn("mt-0.5 shrink-0", statusColor[check.status])} />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="font-semibold text-sm text-gray-800">{check.name}</span>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full truncate max-w-[260px]">
                            {check.value}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">{check.description}</p>
                      </div>
                    </div>

                    {isAltCheck && missingAltImages && missingAltImages.length > 0 && (
                      <div className="mt-2 rounded-xl border border-amber-200 bg-amber-50 overflow-hidden">
                        <div className="px-4 pt-3 pb-2 flex items-center justify-between border-b border-amber-100">
                          <div className="flex items-center gap-2">
                            <ImageOff size={13} className="text-amber-600" />
                            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                              Images Missing Alt Text
                            </span>
                          </div>
                          <span className="text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
                            {missingAltImages.length} image{missingAltImages.length !== 1 ? "s" : ""}
                          </span>
                        </div>
                        <div className="p-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                          {missingAltImages.map((img, j) => (
                            <div key={j} className="group bg-white border border-amber-100 rounded-lg overflow-hidden hover:border-amber-300 hover:shadow-sm transition-all">
                              <div className="aspect-video bg-gray-100 relative overflow-hidden">
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
                                <div className="absolute inset-0 hidden items-center justify-center flex-col gap-1 bg-gray-50">
                                  <ImageOff size={16} className="text-gray-300" />
                                  <span className="text-[9px] text-gray-400">No preview</span>
                                </div>
                                <div className="absolute top-1 left-1 bg-amber-500 text-[8px] font-black text-white px-1.5 py-0.5 rounded uppercase tracking-wider">
                                  No Alt
                                </div>
                              </div>
                              <div className="p-2">
                                <p className="text-[9px] text-gray-500 truncate mb-1" title={img.filename}>
                                  {img.filename || "Unnamed image"}
                                </p>
                                <a
                                  href={img.src}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-[9px] text-sky-600 hover:text-sky-700 transition-colors font-medium truncate max-w-full"
                                  title={img.src}
                                >
                                  <ExternalLink size={8} className="shrink-0" />
                                  <span className="truncate">{img.src.replace(/^https?:\/\//, "")}</span>
                                </a>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="px-4 pb-3">
                          <p className="text-[10px] text-gray-500">
                            Add descriptive <code className="bg-amber-100 px-1 py-0.5 rounded text-amber-700 text-[9px]">alt="..."</code> attributes to each image above. Describe what the image shows — this helps Google index your images and improves accessibility.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {topBacklinks && topBacklinks.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                      <TrendingUp size={12} className="text-primary" /> Top Backlinks Found
                    </p>
                    <span className="text-[10px] text-gray-400 font-medium">
                      {topBacklinks.filter(b => b.verified).length} verified
                    </span>
                  </div>
                  <div className="rounded-xl border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-100 bg-gray-50">
                            <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Source</th>
                            <th className="text-center px-3 py-2.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">DR</th>
                            <th className="text-center px-3 py-2.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">View</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {topBacklinks.map((bl, i) => {
                            const dc = drColor(bl.dr);
                            return (
                              <tr key={i} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-2.5">
                                    <img
                                      src={`https://www.google.com/s2/favicons?domain=${bl.domain}&sz=32`}
                                      alt=""
                                      className="w-4 h-4 rounded-sm shrink-0 bg-gray-100"
                                      onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                                    />
                                    <div>
                                      <p className="font-semibold text-xs text-gray-800">{bl.label}</p>
                                      <p className="text-[10px] text-gray-400">{bl.domain}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-3 py-3 text-center">
                                  <span className={cn(
                                    "inline-flex items-center justify-center min-w-[38px] px-2 py-0.5 rounded-md text-[11px] font-black border",
                                    dc.bg, dc.border, dc.text
                                  )}>
                                    {bl.dr}
                                  </span>
                                </td>
                                <td className="px-3 py-3 text-center">
                                  {bl.verified ? (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                                      <CheckCircle2 size={10} /> Verified
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                                      <AlertTriangle size={10} /> {bl.note ?? "Not listed"}
                                    </span>
                                  )}
                                </td>
                                <td className="px-4 py-3 text-right">
                                  <a
                                    href={bl.checkUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-[10px] text-gray-400 hover:text-primary transition-colors"
                                  >
                                    View <ExternalLink size={10} />
                                  </a>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50">
                      <p className="text-[10px] text-gray-500">
                        <span className="text-emerald-700 font-semibold">Verified</span> = live <code className="text-[9px] bg-gray-100 px-1 rounded">href</code> pointing directly to your domain. DR = domain authority (0–100).
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {backlinkRecs && backlinkRecs.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <TrendingUp size={12} className="text-primary" /> Backlink Building Strategy
                  </p>
                  <ol className="space-y-3">
                    {backlinkRecs.map((rec, i) => {
                      const clean = rec.replace("[Backlinks] ", "");
                      const colonIdx = clean.indexOf(": ");
                      const label = colonIdx !== -1 ? clean.slice(0, colonIdx) : clean;
                      const body  = colonIdx !== -1 ? clean.slice(colonIdx + 2) : "";
                      return (
                        <li key={i} className="flex items-start gap-3 text-sm">
                          <span className="shrink-0 w-5 h-5 rounded-full bg-primary/15 text-primary flex items-center justify-center text-[10px] font-black mt-0.5">
                            {i + 1}
                          </span>
                          <span className="text-gray-500 leading-relaxed">
                            <span className="text-gray-800 font-semibold">{label}</span>
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
  useSEO({
    title: "Free SEO Audit South Africa – Instant Website Analysis | Indexify",
    description: "Get your free SEO audit in seconds. Discover why your website isn't ranking on Google and what's holding back your organic traffic. No sign-up required.",
    keywords: ["free SEO audit South Africa", "website SEO analysis", "Google ranking check South Africa", "SEO health check", "website audit tool South Africa"],
    canonical: "https://indexify.co.za/audit",
  });

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
    <div className="min-h-screen bg-slate-50 text-gray-900">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-28 pb-10">

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="flex flex-wrap items-center justify-center gap-3 mb-5">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-semibold border border-primary/20">
              <Award size={14} /> Free SEO Audit Tool
            </div>
            <PoweredByBadge />
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-3 leading-tight text-gray-900">
            Instant <span className="text-primary">SEO Report Card</span>
          </h1>
          <p className="text-base text-gray-500 max-w-lg mx-auto">
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
              <Globe size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={inputUrl}
                onChange={e => setInputUrl(e.target.value)}
                placeholder="e.g. yourwebsite.co.za"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/15 transition-all text-sm shadow-sm"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-7 py-3.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-all disabled:opacity-60 flex items-center gap-2 justify-center shadow-md shrink-0"
            >
              {loading
                ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Analysing...</>
                : <><Search size={16} /> Run Free Audit</>
              }
            </button>
          </div>
          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 text-sm text-red-500 flex items-center gap-2 justify-center">
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
                <p className="font-bold mb-1 text-gray-800">Analysing your website...</p>
                <p className="text-sm text-gray-500">Checking 25+ SEO factors and capturing desktop &amp; mobile screenshots.</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Results */}
        {result && !loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">

            {/* ── Overall Grade Card ── */}
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
              <div className={cn("h-1.5 w-full", {
                "bg-emerald-500": result.overallScore >= 80,
                "bg-sky-500":     result.overallScore >= 70 && result.overallScore < 80,
                "bg-amber-500":   result.overallScore >= 50 && result.overallScore < 70,
                "bg-orange-500":  result.overallScore >= 40 && result.overallScore < 50,
                "bg-red-500":     result.overallScore < 40,
              })} />

              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  <div className="flex items-center gap-5">
                    <GradeBadge score={result.overallScore} size="xl" />
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Overall Grade</p>
                      <p className={cn("text-5xl font-black leading-none mb-1", overall?.color)}>{overall?.grade}</p>
                      <p className="text-sm text-gray-500 font-medium">{overall?.label} · {result.overallScore}/100</p>
                    </div>
                  </div>

                  <div className="w-px h-16 bg-gray-100 hidden md:block" />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-bold text-base text-gray-900 truncate">{result.pageTitle || "Untitled Page"}</p>
                      <a href={result.finalUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary shrink-0 transition-colors">
                        <ExternalLink size={13} />
                      </a>
                    </div>
                    <p className="text-xs text-gray-400 mb-5 truncate">{result.finalUrl}</p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { icon: Clock,         label: "Load Time", value: `${result.loadTimeMs}ms`, color: "text-sky-600",     bg: "bg-sky-50     border border-sky-100" },
                        { icon: CheckCircle2,  label: "Passed",    value: String(passes),           color: "text-emerald-600", bg: "bg-emerald-50 border border-emerald-100" },
                        { icon: AlertTriangle, label: "Warnings",  value: String(warns),            color: "text-amber-600",   bg: "bg-amber-50   border border-amber-100" },
                        { icon: XCircle,       label: "Failed",    value: String(fails),            color: "text-red-600",     bg: "bg-red-50     border border-red-100" },
                      ].map(({ icon: Icon, label, value, color, bg }, i) => (
                        <div key={i} className={cn("rounded-xl p-3 text-center", bg)}>
                          <Icon size={15} className={cn("mx-auto mb-1.5", color)} />
                          <p className={cn("text-lg font-black leading-none mb-0.5", color)}>{value}</p>
                          <p className="text-[11px] text-gray-500">{label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Grade Summary Grid ── */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                <BarChart3 size={14} /> Category Grades at a Glance
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {result.sections.map((section, i) => {
                  const g = scoreToGrade(section.score);
                  const Icon = sectionIcons[section.title] ?? Globe;
                  return (
                    <div key={i} className={cn("rounded-xl border p-3 text-center flex flex-col items-center gap-2", g.bg, g.border)}>
                      <Icon size={14} className="text-gray-400" />
                      <p className={cn("text-2xl font-black leading-none", g.color)}>{g.grade}</p>
                      <p className="text-[11px] text-gray-500 leading-tight text-center">{section.title}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Site Preview Screenshots ── */}
            {(result.screenshots?.desktop || result.screenshots?.mobile) && (
              <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <div className="px-5 pt-4 pb-3 border-b border-gray-100 flex items-center gap-2">
                  <Monitor size={14} className="text-gray-400" />
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    Site Preview
                  </h3>
                </div>
                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
                  {result.screenshots.desktop && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-1.5 rounded-md bg-sky-50 border border-sky-100">
                          <Monitor size={13} className="text-sky-500" />
                        </div>
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Desktop — 1280px</span>
                      </div>
                      <div className="rounded-xl overflow-hidden border border-gray-200 shadow-md">
                        <div className="bg-gray-100 px-3 py-2 flex items-center gap-2 border-b border-gray-200">
                          <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-400" />
                            <div className="w-3 h-3 rounded-full bg-amber-400" />
                            <div className="w-3 h-3 rounded-full bg-emerald-400" />
                          </div>
                          <div className="flex-1 mx-3 bg-white rounded-md px-3 py-1 text-[10px] text-gray-400 truncate border border-gray-200">
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

                  {result.screenshots.mobile && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-1.5 rounded-md bg-sky-50 border border-sky-100">
                          <Smartphone size={13} className="text-sky-500" />
                        </div>
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Mobile — 390px</span>
                      </div>
                      <div className="flex justify-center">
                        <div className="w-full max-w-[260px]">
                          <div className="rounded-[28px] overflow-hidden border-[6px] border-gray-300 shadow-xl bg-gray-100">
                            <div className="bg-gray-100 flex justify-center py-2">
                              <div className="w-20 h-4 rounded-full bg-gray-300" />
                            </div>
                            <img
                              src={result.screenshots.mobile}
                              alt="Mobile screenshot"
                              className="w-full block object-cover object-top"
                              style={{ maxHeight: 420 }}
                              loading="lazy"
                            />
                            <div className="bg-gray-100 flex justify-center py-2.5">
                              <div className="w-24 h-1 rounded-full bg-gray-300" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Keyword Targets ── */}
            {result.rankingKeywords?.length > 0 && (
              <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <div className="px-6 pt-5 pb-4 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Tag size={15} className="text-primary" />
                    <h3 className="font-bold text-base text-gray-900">Target Keywords</h3>
                  </div>
                  <span className="text-xs text-gray-400 font-medium">
                    Extracted from page content · {result.rankingKeywords.length} terms
                  </span>
                </div>
                <div className="px-6 py-5">
                  <p className="text-xs text-gray-500 mb-4">
                    These are the keywords your page is currently optimised for, ranked by prominence across your title, headings, meta description, and body text.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {result.rankingKeywords.map((kw, i) => {
                      const sourceColor: Record<string, string> = {
                        "Title":            "bg-sky-50    text-sky-700    border-sky-200",
                        "H1":               "bg-emerald-50 text-emerald-700 border-emerald-200",
                        "H2":               "bg-violet-50 text-violet-700 border-violet-200",
                        "H3":               "bg-purple-50 text-purple-700 border-purple-200",
                        "Meta Description": "bg-amber-50  text-amber-700  border-amber-200",
                        "Meta Keywords":    "bg-orange-50 text-orange-700 border-orange-200",
                        "Body":             "bg-gray-50   text-gray-600   border-gray-200",
                      };
                      const chipColor = sourceColor[kw.source] ?? sourceColor["Body"];
                      const rankRing = i < 3
                        ? "ring-2 ring-offset-1 " + (i === 0 ? "ring-sky-300" : i === 1 ? "ring-emerald-300" : "ring-violet-300")
                        : "";
                      return (
                        <div
                          key={i}
                          className={cn(
                            "inline-flex items-center gap-1.5 border rounded-full px-3 py-1 text-xs font-medium transition-all hover:shadow-sm cursor-default",
                            chipColor, rankRing
                          )}
                          title={`Found in: ${kw.source} · Appears ${kw.count}× in that source`}
                        >
                          {i < 3 && (
                            <span className="text-[9px] font-black opacity-60">#{i + 1}</span>
                          )}
                          {kw.keyword}
                          <span className="text-[10px] opacity-50 font-normal ml-0.5">{kw.source.replace("Meta ", "")}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3 text-[11px] text-gray-400">
                    {[
                      { color: "bg-sky-400",     label: "Title" },
                      { color: "bg-emerald-400", label: "H1" },
                      { color: "bg-violet-400",  label: "H2" },
                      { color: "bg-purple-400",  label: "H3" },
                      { color: "bg-amber-400",   label: "Meta Desc" },
                      { color: "bg-gray-300",    label: "Body" },
                    ].map(({ color, label }) => (
                      <span key={label} className="inline-flex items-center gap-1.5">
                        <span className={cn("w-2 h-2 rounded-full", color)} />
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Recommendations ── */}
            {(criticalRecs.length > 0 || improveRecs.length > 0) && (
              <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <div className="px-6 pt-5 pb-4 border-b border-gray-100">
                  <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
                    <AlertTriangle size={16} className="text-amber-500" />
                    Action Plan & Recommendations
                  </h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {criticalRecs.length > 0 && (
                    <div className="px-6 py-5">
                      <p className="text-xs font-bold text-red-600 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                        <XCircle size={12} /> Critical — Fix Immediately
                      </p>
                      <ol className="space-y-2.5">
                        {criticalRecs.map((rec, i) => {
                          const [label, ...rest] = rec.replace("[Critical] ", "").split(": ");
                          return (
                            <li key={i} className="flex items-start gap-3 text-sm">
                              <span className="shrink-0 w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-[10px] font-black mt-0.5">{i + 1}</span>
                              <span className="text-gray-500 leading-relaxed">
                                <span className="text-gray-800 font-semibold">{label}: </span>{rest.join(": ")}
                              </span>
                            </li>
                          );
                        })}
                      </ol>
                    </div>
                  )}

                  {improveRecs.length > 0 && (
                    <div className="px-6 py-5">
                      <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                        <AlertTriangle size={12} /> Improvements Recommended
                      </p>
                      <ol className="space-y-2.5">
                        {improveRecs.slice(0, 8).map((rec, i) => {
                          const [label, ...rest] = rec.replace("[Improve] ", "").split(": ");
                          return (
                            <li key={i} className="flex items-start gap-3 text-sm">
                              <span className="shrink-0 w-5 h-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-[10px] font-black mt-0.5">{i + 1}</span>
                              <span className="text-gray-500 leading-relaxed">
                                <span className="text-gray-800 font-semibold">{label}: </span>{rest.join(": ")}
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
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2 px-1">
                <Search size={13} /> Detailed Breakdown
              </h3>
              <div className="space-y-3">
                {result.sections.map((section, i) => (
                  <SectionCard
                    key={i}
                    section={section}
                    index={i}
                    backlinkRecs={section.title === "Backlinks & Authority" ? backlinkRecs : undefined}
                    missingAltImages={section.title === "Images" ? result.missingAltImages : undefined}
                    topBacklinks={section.title === "Backlinks & Authority" ? result.topBacklinks : undefined}
                  />
                ))}
              </div>
            </div>

            {/* ── CTA ── */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-br from-primary/10 via-sky-50 to-orange-50 border border-primary/20 rounded-2xl p-8 text-center shadow-sm"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/15 border border-primary/25 mb-4">
                <Award size={22} className="text-primary" />
              </div>
              <h3 className="text-2xl font-black mb-2 text-gray-900">Want an A+ across the board?</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto text-sm">
                Our team will audit your full site, build a custom strategy, and get you ranking on Page 1 of Google.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href="https://wa.me/27760597724"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#25d366] text-white font-bold text-sm hover:bg-[#20bc5a] transition-all shadow-md"
                >
                  <Share2 size={16} /> Chat on WhatsApp
                </a>
                <a
                  href={BASE + "/"}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-all shadow-md"
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
            <p className="text-center text-xs text-gray-400 uppercase tracking-widest font-semibold mb-5">What we check</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { icon: FileText,   title: "On-Page SEO",           desc: "Title tags, meta descriptions, headings, keyword usage, word count" },
                { icon: Zap,        title: "Technical SEO",         desc: "HTTPS, load speed, mobile viewport, robots.txt, sitemap, canonical" },
                { icon: Image,      title: "Image Optimisation",    desc: "Alt text coverage, image count and performance checks" },
                { icon: Link2,      title: "Link Structure",        desc: "Internal and external link quality, anchor text analysis" },
                { icon: TrendingUp, title: "Backlinks & Authority", desc: "Domain age, crawl activity, outbound diversity, social profile links" },
                { icon: Share2,     title: "Social & Schema",       desc: "Open Graph, Twitter Cards, structured data (JSON-LD)" },
              ].map(({ icon: Icon, title, desc }, i) => (
                <div key={i} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-gray-200 transition-all">
                  <div className="p-2.5 rounded-lg bg-primary/10 w-fit mb-3 border border-primary/10">
                    <Icon size={16} className="text-primary" />
                  </div>
                  <h4 className="font-bold text-sm mb-1 text-gray-800">{title}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
            <p className="text-center text-xs text-gray-400 mt-6">
              Each category receives a letter grade from <span className="text-emerald-600 font-bold">A+</span> to <span className="text-red-600 font-bold">F</span> — just like a report card.
            </p>
          </motion.div>
        )}
      </div>

      {/* Pricing nudge */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-sky-50/40 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">Want us to handle this for you?</p>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
              We Fix Every Issue — <span className="text-gradient">For a Flat Monthly Fee</span>
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">No hourly surprises. Pick a plan and we'll handle everything from technical fixes to content and backlinks.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Basic SEO */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all p-7 flex flex-col"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold uppercase tracking-widest text-primary">Basic SEO</span>
                <span className="text-xs bg-primary/10 text-primary font-bold px-3 py-1 rounded-full">Most Popular</span>
              </div>
              <div className="mb-4">
                <span className="text-4xl font-black text-gray-900">R5,900</span>
                <span className="text-gray-400 text-sm">/mo</span>
              </div>
              <ul className="space-y-2 mb-6 flex-1">
                {["Keyword Research & Strategy", "On-Page Optimisation", "Technical SEO Fixes", "Monthly Ranking Reports", "Dedicated Account Manager"].map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle2 size={14} className="text-primary mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <a href={BASE + "/services/seo"} className="block w-full text-center py-3 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/90 hover:-translate-y-0.5 transition-all shadow-md shadow-primary/20">
                Get Started →
              </a>
            </motion.div>

            {/* Advanced SEO */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
              className="bg-gray-900 rounded-2xl border border-gray-800 shadow-xl hover:shadow-2xl transition-all p-7 flex flex-col relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10 -translate-y-1/2 translate-x-1/2" style={{ background: "radial-gradient(circle, #7c4dff, transparent)" }} />
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold uppercase tracking-widest text-violet-400">Advanced SEO</span>
                <span className="text-xs bg-violet-500/20 text-violet-300 font-bold px-3 py-1 rounded-full">Best Results</span>
              </div>
              <div className="mb-4">
                <span className="text-4xl font-black text-white">R7,900</span>
                <span className="text-gray-400 text-sm">/mo</span>
              </div>
              <ul className="space-y-2 mb-6 flex-1">
                {["Everything in Basic", "Backlink Building Campaign", "Competitor Content Strategy", "Core Web Vitals Optimisation", "Advanced Schema Markup", "Priority Support"].map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <CheckCircle2 size={14} className="text-violet-400 mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <a href={BASE + "/services/seo"} className="block w-full text-center py-3 rounded-xl text-gray-900 font-black text-sm hover:-translate-y-0.5 transition-all shadow-md" style={{ background: "linear-gradient(90deg,#e040fb,#7c4dff,#0ea5c8)" }}>
                Get Started →
              </a>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="text-center mt-8">
            <a href={BASE + "/pricing"} className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-primary transition-colors font-medium">
              View full pricing & compare all packages →
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
