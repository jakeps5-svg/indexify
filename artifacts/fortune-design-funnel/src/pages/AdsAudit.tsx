import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MousePointerClick, CheckCircle2, XCircle, AlertTriangle, ChevronDown,
  ArrowLeft, MessageCircle, Award, Lock, Unlock, Download, Phone,
  Zap, Shield, Target, TrendingUp, Smartphone, Eye, BarChart3,
  FileText, ExternalLink, Star, Copy, Check, Monitor
} from "lucide-react";
import { cn } from "@/lib/utils";

const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") ?? "";
const ACCENT = "hsl(29 100% 65%)";
const WA_NUMBER = "27832555270";

type CheckStatus = "pass" | "warn" | "fail";

interface AuditCheck {
  name: string;
  status: CheckStatus;
  value: string;
  description: string;
  impact: "high" | "medium" | "low";
}

interface AuditSection {
  title: string;
  score: number;
  checks: AuditCheck[];
}

interface ConversionElements {
  hasForms: boolean;
  hasPhone: boolean;
  hasCTA: boolean;
  ctaCount: number;
  phonesFound: string[];
}

interface AdsAuditResult {
  url: string;
  finalUrl: string;
  overallScore: number;
  qualityScoreEstimate: number;
  loadTimeMs: number;
  pageTitle: string;
  metaDescription: string;
  sections: AuditSection[];
  topIssues: string[];
  quickWins: string[];
  conversionElements: ConversionElements;
  screenshots: { desktop: string | null; mobile: string | null };
  unlockCode: string;
}

const sectionIcons: Record<string, typeof MousePointerClick> = {
  "Landing Page Quality": FileText,
  "Mobile & Speed": Smartphone,
  "Conversion Readiness": Target,
  "Trust & Credibility": Shield,
  "Technical Compatibility": Zap,
};

const statusIcon  = { pass: CheckCircle2, warn: AlertTriangle, fail: XCircle };
const statusColor = { pass: "text-emerald-500", warn: "text-amber-500", fail: "text-red-500" };
const statusBg    = {
  pass: "bg-emerald-50 border-emerald-200",
  warn: "bg-amber-50 border-amber-200",
  fail: "bg-red-50 border-red-200",
};

function scoreColor(score: number) {
  if (score >= 80) return { text: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", label: "Great" };
  if (score >= 65) return { text: "text-sky-600",     bg: "bg-sky-50",     border: "border-sky-200",     label: "Good" };
  if (score >= 50) return { text: "text-amber-600",   bg: "bg-amber-50",   border: "border-amber-200",   label: "Fair" };
  if (score >= 35) return { text: "text-orange-600",  bg: "bg-orange-50",  border: "border-orange-200",  label: "Poor" };
  return               { text: "text-red-600",    bg: "bg-red-50",     border: "border-red-200",     label: "Critical" };
}

function QsBar({ score }: { score: number }) {
  const c = scoreColor(score);
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-1000", {
            "bg-emerald-500": score >= 80,
            "bg-sky-500":     score >= 65 && score < 80,
            "bg-amber-500":   score >= 50 && score < 65,
            "bg-orange-500":  score >= 35 && score < 50,
            "bg-red-500":     score < 35,
          })}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className={cn("text-xs font-bold w-8 text-right", c.text)}>{score}%</span>
    </div>
  );
}

function SectionCard({ section, index, locked }: { section: AuditSection; index: number; locked: boolean }) {
  const [open, setOpen] = useState(false);
  const Icon = sectionIcons[section.title] ?? BarChart3;
  const c = scoreColor(section.score);
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
        open ? "border-gray-200 shadow-md" : "border-gray-100 shadow-sm hover:shadow-md",
        locked && "opacity-60"
      )}
    >
      <button
        onClick={() => !locked && setOpen(!open)}
        className={cn("w-full flex items-center justify-between px-5 py-4 text-left gap-4", !locked && "hover:bg-gray-50 transition-colors", locked && "cursor-default")}
      >
        <div className="flex items-center gap-4 min-w-0">
          <div className={cn("w-14 h-14 rounded-2xl border-2 flex items-center justify-center font-black text-xl shrink-0", c.bg, c.border, c.text)}>
            {section.score}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <Icon size={14} className="text-gray-400 shrink-0" />
              <span className="font-bold text-base text-gray-900 truncate">{section.title}</span>
              {locked && <Lock size={13} className="text-gray-300 shrink-0" />}
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span className={cn(c.text, "font-semibold")}>{c.label}</span>
              <span>·</span>
              <span className="text-emerald-600">{passes} passed</span>
              {warns > 0 && <><span>·</span><span className="text-amber-600">{warns} warnings</span></>}
              {fails > 0 && <><span>·</span><span className="text-red-600">{fails} failed</span></>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:block w-24">
            <QsBar score={section.score} />
          </div>
          {!locked && (
            <ChevronDown size={16} className={cn("text-gray-400 transition-transform duration-300", open && "rotate-180")} />
          )}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && !locked && (
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
                return (
                  <div key={i} className={cn("flex items-start gap-3 p-3.5 rounded-xl border", statusBg[check.status])}>
                    <StatusIcon size={16} className={cn("mt-0.5 shrink-0", statusColor[check.status])} />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-semibold text-sm text-gray-800">{check.name}</span>
                        <span className={cn(
                          "text-[10px] font-bold uppercase px-1.5 py-0.5 rounded",
                          check.impact === "high" ? "bg-red-100 text-red-600" : check.impact === "medium" ? "bg-amber-100 text-amber-600" : "bg-gray-100 text-gray-500"
                        )}>
                          {check.impact} impact
                        </span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full truncate max-w-[260px]">{check.value}</span>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">{check.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function generateReport(result: AdsAuditResult): string {
  const domain = new URL(result.finalUrl).hostname;
  const now = new Date().toLocaleDateString("en-ZA", { year: "numeric", month: "long", day: "numeric" });
  const passes = result.sections.reduce((s, sec) => s + sec.checks.filter(c => c.status === "pass").length, 0);
  const warns  = result.sections.reduce((s, sec) => s + sec.checks.filter(c => c.status === "warn").length, 0);
  const fails  = result.sections.reduce((s, sec) => s + sec.checks.filter(c => c.status === "fail").length, 0);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Google Ads Audit Report – ${domain}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #111827; background: #fff; padding: 40px; max-width: 900px; margin: 0 auto; }
  h1 { font-size: 28px; font-weight: 900; color: #111827; margin-bottom: 4px; }
  .subtitle { color: #6b7280; font-size: 14px; margin-bottom: 32px; }
  .logo { font-size: 20px; font-weight: 900; margin-bottom: 24px; }
  .logo span { color: hsl(198 69% 52%); }
  .badge { display: inline-block; background: hsl(29 100% 65%); color: white; font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 99px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 16px; }
  .score-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 32px; }
  .score-card { border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; text-align: center; }
  .score-card .num { font-size: 32px; font-weight: 900; }
  .score-card .lbl { font-size: 11px; color: #6b7280; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.05em; }
  .green { color: #059669; } .amber { color: #d97706; } .red { color: #dc2626; }
  .section { margin-bottom: 28px; page-break-inside: avoid; }
  .section-title { font-size: 16px; font-weight: 800; color: #111827; border-bottom: 2px solid #f3f4f6; padding-bottom: 8px; margin-bottom: 14px; display: flex; justify-content: space-between; align-items: center; }
  .section-score { font-size: 13px; font-weight: 700; }
  .check { display: flex; align-items: flex-start; gap: 10px; padding: 10px 12px; border-radius: 8px; margin-bottom: 8px; }
  .check.pass { background: #f0fdf4; border: 1px solid #bbf7d0; }
  .check.warn { background: #fffbeb; border: 1px solid #fde68a; }
  .check.fail { background: #fef2f2; border: 1px solid #fecaca; }
  .check-icon { font-size: 16px; margin-top: 1px; line-height: 1; }
  .check-name { font-weight: 700; font-size: 13px; margin-bottom: 2px; }
  .check-val { font-size: 11px; color: #6b7280; }
  .check-desc { font-size: 12px; color: #4b5563; margin-top: 4px; line-height: 1.5; }
  .issues { margin-bottom: 28px; }
  .issue-item { padding: 10px 14px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; font-size: 12px; color: #7f1d1d; margin-bottom: 6px; }
  .win-item { padding: 10px 14px; background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; font-size: 12px; color: #78350f; margin-bottom: 6px; }
  .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 11px; color: #9ca3af; text-align: center; }
  @media print { body { padding: 20px; } }
</style>
</head>
<body>
<div class="logo">FORTUNE<span>DESIGN</span></div>
<div class="badge">Google Ads Audit Report</div>
<h1>Audit Report: ${domain}</h1>
<p class="subtitle">Generated ${now} · ${result.finalUrl}</p>

<div class="score-grid">
  <div class="score-card">
    <div class="num ${result.overallScore >= 80 ? "green" : result.overallScore >= 50 ? "amber" : "red"}">${result.overallScore}%</div>
    <div class="lbl">Overall Score</div>
  </div>
  <div class="score-card">
    <div class="num ${result.qualityScoreEstimate >= 7 ? "green" : result.qualityScoreEstimate >= 5 ? "amber" : "red"}">${result.qualityScoreEstimate}/10</div>
    <div class="lbl">Est. Quality Score</div>
  </div>
  <div class="score-card">
    <div class="num green">${passes}</div>
    <div class="lbl">Checks Passed</div>
  </div>
  <div class="score-card">
    <div class="num red">${fails}</div>
    <div class="lbl">Critical Issues</div>
  </div>
</div>

${result.topIssues.length > 0 ? `
<div class="issues">
  <div class="section-title">🚨 Top Issues to Fix</div>
  ${result.topIssues.slice(0, 5).map(i => `<div class="issue-item">✗ ${i}</div>`).join("")}
</div>` : ""}

${result.quickWins.length > 0 ? `
<div class="issues">
  <div class="section-title">⚡ Quick Wins</div>
  ${result.quickWins.map(w => `<div class="win-item">→ ${w}</div>`).join("")}
</div>` : ""}

${result.sections.map(s => `
<div class="section">
  <div class="section-title">
    ${s.title}
    <span class="section-score ${s.score >= 80 ? "green" : s.score >= 50 ? "amber" : "red"}">${s.score}%</span>
  </div>
  ${s.checks.map(c => `
  <div class="check ${c.status}">
    <div class="check-icon">${c.status === "pass" ? "✓" : c.status === "warn" ? "⚠" : "✗"}</div>
    <div>
      <div class="check-name">${c.name}</div>
      <div class="check-val">${c.value}</div>
      <div class="check-desc">${c.description}</div>
    </div>
  </div>`).join("")}
</div>`).join("")}

<div class="footer">
  <p>Generated by Fortune Design · fortunedesign.co.za · info@fortunedesign.co.za · WhatsApp: +27 83 255 5270</p>
  <p style="margin-top:6px;">This report is confidential and intended solely for the use of the recipient.</p>
</div>
</body>
</html>`;
}

function downloadReport(result: AdsAuditResult) {
  const html = generateReport(result);
  const blob = new Blob([html], { type: "text/html" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `google-ads-audit-${new URL(result.finalUrl).hostname}-${new Date().toISOString().slice(0, 10)}.html`;
  a.click();
  URL.revokeObjectURL(a.href);
}

export default function AdsAuditPage() {
  const [inputUrl, setInputUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AdsAuditResult | null>(null);
  const [unlockOpen, setUnlockOpen] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [codeError, setCodeError] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [copied, setCopied] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  async function runAudit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setUnlocked(false);
    setCodeInput("");
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/api/ads-audit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: inputUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Audit failed");
      setResult(data as AdsAuditResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function tryUnlock() {
    if (!result) return;
    if (codeInput.trim().toUpperCase() === result.unlockCode) {
      setUnlocked(true);
      setUnlockOpen(false);
      setCodeError("");
    } else {
      setCodeError("Incorrect code. Please check and try again.");
    }
  }

  function openWhatsApp() {
    const domain = result ? new URL(result.finalUrl).hostname : inputUrl;
    const msg = encodeURIComponent(`Hi Fortune Design, I'd like to purchase my full Google Ads Audit report for *${domain}*. Please send me payment details for the R500 full report.`);
    window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, "_blank");
  }

  function copyCode() {
    if (!result) return;
    navigator.clipboard.writeText(result.unlockCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const passes = result?.sections.reduce((s, sec) => s + sec.checks.filter(c => c.status === "pass").length, 0) ?? 0;
  const warns  = result?.sections.reduce((s, sec) => s + sec.checks.filter(c => c.status === "warn").length, 0) ?? 0;
  const fails  = result?.sections.reduce((s, sec) => s + sec.checks.filter(c => c.status === "fail").length, 0) ?? 0;
  const sc     = result ? scoreColor(result.overallScore) : null;
  const domain = result ? (() => { try { return new URL(result.finalUrl).hostname; } catch { return result.url; } })() : "";

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900">

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <a href={BASE + "/"} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors font-medium">
            <ArrowLeft size={15} /> Back to Home
          </a>
          <a href={BASE + "/"} className="font-display font-black text-lg tracking-tight">
            <span className="text-gray-900">FORTUNE</span>
            <span className="text-primary">DESIGN</span>
          </a>
          <a href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-[#25d366] text-white text-sm font-bold hover:bg-[#20bc5a] transition-colors">
            <MessageCircle size={14} /> WhatsApp Us
          </a>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-5 border"
            style={{ background: "hsl(29 100% 65% / 0.1)", color: ACCENT, borderColor: "hsl(29 100% 65% / 0.3)" }}>
            <MousePointerClick size={14} /> Free Google Ads Readiness Audit
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-3 leading-tight text-gray-900">
            Is Your Website <span style={{ color: ACCENT }}>Ready for Google Ads?</span>
          </h1>
          <p className="text-base text-gray-500 max-w-xl mx-auto leading-relaxed">
            Enter your website URL for a free instant audit. We check landing page quality, mobile speed, conversion readiness and more — all factors that directly affect your Google Ads Quality Score and cost-per-click.
          </p>
        </motion.div>

        {/* Search Form */}
        <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={runAudit}
          className="max-w-2xl mx-auto mb-10"
        >
          <div className="flex gap-3 flex-col sm:flex-row">
            <div className="relative flex-1">
              <MousePointerClick size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={inputUrl}
                onChange={e => setInputUrl(e.target.value)}
                placeholder="yourwebsite.co.za"
                className="w-full pl-10 pr-4 py-4 rounded-xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 text-gray-900 placeholder-gray-400 text-base"
                style={{ "--tw-ring-color": ACCENT } as React.CSSProperties}
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !inputUrl.trim()}
              className="px-8 py-4 rounded-xl font-bold text-white text-base transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              style={{ background: ACCENT }}
            >
              {loading ? "Analysing…" : "Run Free Audit"}
            </button>
          </div>
          <p className="text-center text-xs text-gray-400 mt-3">
            Free preview · Full report with download available for R500
          </p>
        </motion.form>

        {/* Loading */}
        <AnimatePresence>
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-16">
              <div className="relative inline-block mb-6">
                <div className="w-20 h-20 rounded-full border-4 border-gray-100 border-t-[hsl(29_100%_65%)] animate-spin" />
                <MousePointerClick className="absolute inset-0 m-auto" style={{ color: ACCENT }} size={22} />
              </div>
              <h3 className="font-black text-xl text-gray-900 mb-2">Auditing Your Website…</h3>
              <p className="text-gray-500 text-sm max-w-xs mx-auto">
                Checking landing page quality, speed, conversion readiness, and trust signals. This takes 15–30 seconds.
              </p>
              <div className="mt-6 flex flex-col items-center gap-2 text-xs text-gray-400">
                {["Fetching page content…", "Checking mobile readiness…", "Analysing conversion elements…", "Scoring Quality Score factors…"].map((step, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 1.5 }}
                    className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: ACCENT }} />
                    {step}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="max-w-2xl mx-auto bg-red-50 border border-red-200 rounded-2xl p-6 text-center mb-8">
              <XCircle size={32} className="text-red-400 mx-auto mb-3" />
              <h3 className="font-bold text-red-800 mb-1">Audit Failed</h3>
              <p className="text-red-600 text-sm">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {result && !loading && (
            <motion.div ref={reportRef} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

              {/* Overall Score Banner */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 mb-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="flex items-center gap-5">
                    <div className={cn("w-24 h-24 rounded-2xl border-2 flex flex-col items-center justify-center shrink-0", sc?.bg, sc?.border)}>
                      <span className={cn("text-4xl font-black leading-none", sc?.text)}>{result.overallScore}</span>
                      <span className="text-xs text-gray-400 mt-0.5">/ 100</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Ads Readiness Score</p>
                      </div>
                      <h2 className="text-2xl font-black text-gray-900 mb-1 truncate max-w-xs">{domain}</h2>
                      <p className="text-sm text-gray-500 mb-3 truncate max-w-sm">{result.pageTitle || result.finalUrl}</p>
                      <div className="flex flex-wrap gap-3 text-xs">
                        <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full font-semibold">
                          <CheckCircle2 size={11} /> {passes} passed
                        </span>
                        {warns > 0 && <span className="flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full font-semibold">
                          <AlertTriangle size={11} /> {warns} warnings
                        </span>}
                        {fails > 0 && <span className="flex items-center gap-1.5 bg-red-50 text-red-700 border border-red-200 px-2.5 py-1 rounded-full font-semibold">
                          <XCircle size={11} /> {fails} critical
                        </span>}
                      </div>
                    </div>
                  </div>

                  {/* Quality Score Estimate */}
                  <div className="shrink-0 w-full md:w-auto">
                    <div className="bg-slate-50 border border-gray-200 rounded-2xl p-5 min-w-[180px]">
                      <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Est. Quality Score</p>
                      <div className="flex items-end gap-1 mb-3">
                        <span className={cn("text-5xl font-black", result.qualityScoreEstimate >= 7 ? "text-emerald-600" : result.qualityScoreEstimate >= 5 ? "text-amber-600" : "text-red-600")}>
                          {result.qualityScoreEstimate}
                        </span>
                        <span className="text-gray-400 text-xl mb-1">/10</span>
                      </div>
                      <div className="flex gap-1">
                        {Array.from({ length: 10 }, (_, i) => (
                          <div key={i} className={cn("flex-1 h-2 rounded-full", i < result.qualityScoreEstimate
                            ? result.qualityScoreEstimate >= 7 ? "bg-emerald-500" : result.qualityScoreEstimate >= 5 ? "bg-amber-500" : "bg-red-500"
                            : "bg-gray-100")} />
                        ))}
                      </div>
                      <p className="text-[10px] text-gray-400 mt-2">Higher = lower cost-per-click</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Metrics Strip */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { label: "Load Time",      value: `${result.loadTimeMs}ms`, icon: Zap,    good: result.loadTimeMs < 1500 },
                  { label: "Has Forms",      value: result.conversionElements.hasForms ? "Yes ✓" : "No ✗", icon: FileText, good: result.conversionElements.hasForms },
                  { label: "Phone Number",   value: result.conversionElements.hasPhone ? "Found ✓" : "Missing ✗", icon: Phone, good: result.conversionElements.hasPhone },
                  { label: "CTAs Found",     value: String(result.conversionElements.ctaCount), icon: Target, good: result.conversionElements.ctaCount >= 3 },
                ].map(({ label, value, icon: Icon, good }, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
                    <Icon size={20} className={cn("mx-auto mb-2", good ? "text-emerald-500" : "text-amber-500")} />
                    <p className={cn("font-black text-lg", good ? "text-gray-900" : "text-amber-600")}>{value}</p>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">{label}</p>
                  </div>
                ))}
              </div>

              {/* Screenshots Preview (free) */}
              {(result.screenshots.desktop || result.screenshots.mobile) && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                    <Eye size={12} /> Landing Page Previews
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {result.screenshots.desktop && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-1.5">
                          <Monitor size={12} /> Desktop
                        </p>
                        <div className="border border-gray-200 rounded-xl overflow-hidden">
                          <img src={result.screenshots.desktop} alt="Desktop preview" className="w-full object-cover object-top" />
                        </div>
                      </div>
                    )}
                    {result.screenshots.mobile && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-1.5">
                          <Smartphone size={12} /> Mobile
                        </p>
                        <div className="border border-gray-200 rounded-xl overflow-hidden max-w-[200px]">
                          <img src={result.screenshots.mobile} alt="Mobile preview" className="w-full object-cover object-top" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Top Issues (free — shown first 3) */}
              {result.topIssues.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                    <AlertTriangle size={12} className="text-red-500" /> Top Issues Costing You Ad Performance
                  </p>
                  <div className="space-y-2">
                    {result.topIssues.slice(0, 3).map((issue, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-red-50 border border-red-100">
                        <XCircle size={15} className="text-red-500 mt-0.5 shrink-0" />
                        <p className="text-sm text-red-800">{issue}</p>
                      </div>
                    ))}
                    {result.topIssues.length > 3 && (
                      <div className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 border border-dashed border-gray-200">
                        <Lock size={14} className="text-gray-300 shrink-0" />
                        <p className="text-sm text-gray-400">+{result.topIssues.length - 3} more issues in the full report</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Detailed Sections */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-black text-lg text-gray-900">Detailed Section Analysis</h3>
                  {!unlocked && (
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Lock size={11} /> {result.sections.length - 2} sections locked
                    </span>
                  )}
                </div>
                <div className="space-y-3">
                  {result.sections.map((section, i) => (
                    <SectionCard key={i} section={section} index={i} locked={!unlocked && i >= 2} />
                  ))}
                </div>
              </div>

              {/* Unlock / Download Panel */}
              {!unlocked ? (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="rounded-3xl overflow-hidden border border-gray-100 shadow-lg mb-8">
                  <div className="p-8 text-white text-center" style={{ background: ACCENT }}>
                    <Lock size={32} className="mx-auto mb-4 text-white/80" />
                    <h3 className="text-2xl font-black mb-2">Unlock the Full Report</h3>
                    <p className="text-white/80 text-base mb-2">View all sections, quick wins, and download a branded PDF report.</p>
                    <div className="inline-flex items-baseline gap-1 text-white mb-6">
                      <span className="text-3xl font-semibold">R</span>
                      <span className="text-6xl font-black">500</span>
                      <span className="text-white/70 ml-2">once-off</span>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <button
                        onClick={openWhatsApp}
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white font-bold text-base hover:-translate-y-0.5 transition-all duration-300 shadow-md"
                        style={{ color: ACCENT }}
                      >
                        <MessageCircle size={18} /> Pay R500 via WhatsApp
                      </button>
                      <button
                        onClick={() => setUnlockOpen(true)}
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white/20 text-white font-bold text-base hover:-translate-y-0.5 transition-all duration-300 border border-white/30"
                      >
                        <Unlock size={18} /> Enter Unlock Code
                      </button>
                    </div>
                    <p className="text-white/60 text-xs mt-4">After payment, Fortune Design will send your unlock code via WhatsApp within minutes.</p>
                  </div>

                  {/* Unlock Code Input */}
                  <AnimatePresence>
                    {unlockOpen && (
                      <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden bg-white">
                        <div className="p-6 border-t border-gray-100">
                          <p className="font-bold text-gray-900 mb-1 text-sm">Enter your 8-character unlock code</p>
                          <p className="text-xs text-gray-400 mb-4">Fortune Design will send this via WhatsApp after payment confirmation.</p>
                          <div className="flex gap-3">
                            <input
                              type="text"
                              maxLength={8}
                              value={codeInput}
                              onChange={e => { setCodeInput(e.target.value.toUpperCase()); setCodeError(""); }}
                              placeholder="e.g. A1B2C3D4"
                              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 font-mono uppercase tracking-widest text-center text-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
                            />
                            <button
                              onClick={tryUnlock}
                              className="px-6 py-3 rounded-xl text-white font-bold transition-all hover:-translate-y-0.5"
                              style={{ background: ACCENT }}
                            >
                              Unlock
                            </button>
                          </div>
                          {codeError && <p className="text-red-500 text-xs mt-2">{codeError}</p>}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ) : (
                /* Unlocked State */
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 mb-8 text-center">
                  <CheckCircle2 size={40} className="text-emerald-500 mx-auto mb-3" />
                  <h3 className="text-xl font-black text-emerald-900 mb-2">Full Report Unlocked!</h3>
                  <p className="text-emerald-700 text-sm mb-6">All sections are now visible. You can also download your branded PDF report.</p>

                  {/* Quick Wins */}
                  {result.quickWins.length > 0 && (
                    <div className="bg-white rounded-2xl border border-emerald-200 p-5 mb-5 text-left">
                      <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
                        <Zap size={12} style={{ color: ACCENT }} /> Quick Wins — Fix These First
                      </p>
                      <div className="space-y-2">
                        {result.quickWins.map((win, i) => (
                          <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-amber-50 border border-amber-100">
                            <AlertTriangle size={14} className="text-amber-500 mt-0.5 shrink-0" />
                            <p className="text-sm text-amber-800">{win}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={() => downloadReport(result)}
                      className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-white font-bold text-base hover:-translate-y-0.5 transition-all duration-300 shadow-md"
                      style={{ background: ACCENT }}
                    >
                      <Download size={18} /> Download PDF Report
                    </button>
                    <a
                      href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hi Fortune Design, I'd like to discuss the Google Ads audit results for my website and get started with a campaign.")}`}
                      target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-base border border-gray-200 bg-white text-gray-700 hover:border-emerald-300 hover:-translate-y-0.5 transition-all duration-300"
                    >
                      <MessageCircle size={18} className="text-[#25d366]" /> Discuss with Fortune Design
                    </a>
                  </div>
                </motion.div>
              )}

              {/* CTA Strip */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {[...Array(5)].map((_, i) => <Star key={i} size={14} className="text-amber-400 fill-amber-400" />)}
                  </div>
                  <p className="font-bold text-gray-900">Want us to fix all these issues for you?</p>
                  <p className="text-sm text-gray-500">Fortune Design manages Google Ads campaigns from R7,300/month.</p>
                </div>
                <a href={`${BASE}/services/google-ads`}
                  className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm hover:-translate-y-0.5 transition-all"
                  style={{ background: ACCENT }}>
                  View Google Ads Service <ExternalLink size={14} />
                </a>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

        {/* Feature list (shown before results) */}
        {!result && !loading && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {[
              {
                icon: TrendingUp,
                title: "Quality Score Factors",
                desc: "We check the exact page signals that determine your Google Ads Quality Score — which directly sets your cost-per-click.",
              },
              {
                icon: Target,
                title: "Conversion Readiness",
                desc: "CTAs, phone numbers, forms, trust signals — we audit whether your page is set up to turn ad clicks into actual leads.",
              },
              {
                icon: Smartphone,
                title: "Mobile & Speed Check",
                desc: "Over 65% of Google Ads clicks are from mobile. We verify your site loads fast and displays correctly on phones.",
              },
            ].map(({ icon: Icon, title, desc }, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm text-center">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: "hsl(29 100% 65% / 0.1)" }}>
                  <Icon size={22} style={{ color: ACCENT }} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </motion.div>
        )}

      </div>
    </div>
  );
}

