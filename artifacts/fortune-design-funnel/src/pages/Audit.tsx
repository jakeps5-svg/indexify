import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useSEO } from "@/hooks/useSEO";
import { jsPDF } from "jspdf";
import {
  Search, CheckCircle2, XCircle, AlertTriangle,
  ExternalLink, Zap, Globe, Image, Link2, Share2,
  Clock, FileText, TrendingUp, Award, BarChart3,
  Monitor, Smartphone, ImageOff, Tag, ShieldCheck, Download
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PoweredByBadge } from "@/components/PoweredByBadge";
import { openWhatsAppModal } from "@/components/WhatsAppModal";

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
  isSPA?: boolean;
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

function ScoreRing({ score, size = 112 }: { score: number; size?: number }) {
  const r = 38;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (score / 100) * circumference;
  const stroke = score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : score >= 40 ? "#f97316" : "#ef4444";
  const g = scoreToGrade(score);
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg className="w-full h-full" style={{ transform: "rotate(-90deg)" }} viewBox="0 0 96 96">
        <circle cx="48" cy="48" r={r} fill="none" stroke="#f3f4f6" strokeWidth="9" />
        <motion.circle
          cx="48" cy="48" r={r} fill="none" stroke={stroke} strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn("font-black leading-none", g.color)} style={{ fontSize: size * 0.25 }}>{score}</span>
        <span className="text-gray-400 leading-none" style={{ fontSize: size * 0.1 }}>/ 100</span>
      </div>
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
  const Icon = sectionIcons[section.title] ?? Globe;
  const g = scoreToGrade(section.score);
  const passes = section.checks.filter(c => c.status === "pass").length;
  const warns  = section.checks.filter(c => c.status === "warn").length;
  const fails  = section.checks.filter(c => c.status === "fail").length;
  const accentBorder = section.score >= 80 ? "border-l-emerald-400" : section.score >= 60 ? "border-l-amber-400" : "border-l-red-400";
  const barColor = section.score >= 80 ? "bg-emerald-500" : section.score >= 70 ? "bg-sky-500" : section.score >= 50 ? "bg-amber-500" : section.score >= 40 ? "bg-orange-500" : "bg-red-500";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className={cn("bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden border-l-4", accentBorder)}
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <GradeBadge score={section.score} size="md" />
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <Icon size={14} className="text-gray-400 shrink-0" />
              <span className="font-bold text-base text-gray-900 truncate">{section.title}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
              <span className={g.color + " font-semibold"}>{g.label}</span>
              <span>·</span>
              <span className="text-emerald-600">{passes} passed</span>
              {warns > 0 && <><span>·</span><span className="text-amber-600">{warns} warnings</span></>}
              {fails > 0 && <><span>·</span><span className="text-red-600">{fails} failed</span></>}
            </div>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <div className="h-1.5 rounded-full bg-gray-100 w-28 overflow-hidden">
            <motion.div
              className={cn("h-full rounded-full", barColor)}
              initial={{ width: 0 }}
              animate={{ width: `${section.score}%` }}
              transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.07 + 0.1 }}
            />
          </div>
          <span className="text-xs text-gray-400 w-8 text-right font-mono font-semibold">{section.score}%</span>
        </div>
      </div>

      <div className="px-5 pb-5 pt-3 space-y-2.5">
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
                                  alt={`Image missing alt text: ${img.filename}`}
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
                                      alt={`${bl.label} favicon`}
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
                                    aria-label={`View ${bl.label} reference page`}
                                    className="inline-flex items-center gap-1 text-[10px] text-gray-400 hover:text-primary transition-colors"
                                  >
                                    View <ExternalLink size={10} aria-hidden="true" />
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
  );
}

/** Load an image via fetch and return a base64 data-URL. */
async function loadLogoDataURL(url: string): Promise<string> {
  try {
    const resp = await fetch(url);
    if (!resp.ok) return "";
    const blob = await resp.blob();
    return await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload  = () => resolve(reader.result as string);
      reader.onerror = () => resolve("");
      reader.readAsDataURL(blob);
    });
  } catch {
    return "";
  }
}

/**
 * Fully programmatic PDF using jsPDF only.
 * No DOM screenshot, no CORS dependencies — works reliably in all environments.
 */
async function downloadAuditPDF(result: AuditResult, _reportEl: HTMLElement, setGenerating: (v: boolean) => void) {
  setGenerating(true);
  try {
    // ── Layout constants ───────────────────────────────────────────────────
    const A4_W  = 210;
    const A4_H  = 297;
    const HDR_H = 30;
    const ACC_H = 2.5;
    const FTR_H = 12;
    const L     = 14;
    const R     = 196;
    const CW    = R - L;
    const CTOP  = HDR_H + ACC_H + 8;
    const CBOT  = A4_H - FTR_H - 4;

    type RGB = [number, number, number];
    const TEAL:   RGB = [14,  165, 200];
    const PURPLE: RGB = [124,  77, 255];
    const WHITE:  RGB = [255, 255, 255];
    const DARK:   RGB = [15,   23,  42];
    const MID:    RGB = [71,   85, 105];
    const LIGHT:  RGB = [148, 163, 184];
    const BGRAY:  RGB = [248, 250, 252];
    const LINE:   RGB = [226, 232, 240];
    const GREEN:  RGB = [16,  185, 129];
    const AMBER:  RGB = [245, 158,  11];
    const RED:    RGB = [239,  68,  68];

    // ── Load logos ─────────────────────────────────────────────────────────
    const BASE_URL = import.meta.env.BASE_URL?.replace(/\/$/, "") ?? "";
    const [indexifyLogo, fdLogo] = await Promise.all([
      loadLogoDataURL(`${BASE_URL}/indexify-logo.png`),
      loadLogoDataURL(`${BASE_URL}/images/fortune-design-logo.png`),
    ]);

    const pdf    = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
    const date   = new Date().toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" });
    const domain = new URL(result.finalUrl).hostname.replace("www.", "");

    let currentPage = 1;
    const addPage = () => { pdf.addPage(); currentPage++; };

    // ── Helpers ────────────────────────────────────────────────────────────
    const scoreRGB = (s: number): RGB => s >= 80 ? GREEN : s >= 60 ? AMBER : RED;

    const scoreGrade = (s: number) => {
      if (s >= 95) return "A+"; if (s >= 90) return "A";  if (s >= 85) return "A−";
      if (s >= 80) return "B+"; if (s >= 75) return "B";  if (s >= 70) return "B−";
      if (s >= 65) return "C+"; if (s >= 60) return "C";  if (s >= 50) return "C−";
      if (s >= 40) return "D";  return "F";
    };

    const scoreLabel = (s: number) => {
      if (s >= 85) return "Excellent";
      if (s >= 75) return "Good";
      if (s >= 65) return "Average";
      if (s >= 50) return "Below Average";
      if (s >= 40) return "Poor";
      return "Critical — Needs Urgent Attention";
    };

    const wrap = (text: string, maxW: number, fs: number) => {
      pdf.setFontSize(fs);
      return pdf.splitTextToSize(text, maxW) as string[];
    };

    const drawScoreCircle = (cx: number, cy: number, r: number, score: number) => {
      pdf.setDrawColor(...LINE); pdf.setLineWidth(3.5);
      pdf.circle(cx, cy, r, "S");
      const col = scoreRGB(score);
      pdf.setDrawColor(...col); pdf.setLineWidth(3.5);
      const steps = Math.round((score / 100) * 60);
      const start = -Math.PI / 2;
      for (let i = 0; i < steps; i++) {
        const a1 = start + (i / 60) * 2 * Math.PI;
        const a2 = start + ((i + 1) / 60) * 2 * Math.PI;
        pdf.line(cx + r * Math.cos(a1), cy + r * Math.sin(a1), cx + r * Math.cos(a2), cy + r * Math.sin(a2));
      }
      pdf.setFont("helvetica", "bold"); pdf.setFontSize(22); pdf.setTextColor(...col);
      pdf.text(`${score}`, cx, cy + 3, { align: "center" });
      pdf.setFontSize(8); pdf.setTextColor(...MID);
      pdf.text("/100", cx, cy + 9, { align: "center" });
    };

    const drawBar = (x: number, y: number, w: number, h: number, score: number) => {
      pdf.setFillColor(...LINE); pdf.roundedRect(x, y, w, h, 1, 1, "F");
      pdf.setFillColor(...scoreRGB(score)); pdf.roundedRect(x, y, Math.max(2, (score / 100) * w), h, 1, 1, "F");
    };

    const drawHeader = (title = "SEO AUDIT REPORT") => {
      pdf.setFillColor(...TEAL);   pdf.rect(0, 0,     A4_W, HDR_H, "F");
      pdf.setFillColor(...PURPLE); pdf.rect(0, HDR_H, A4_W, ACC_H, "F");

      if (indexifyLogo) {
        try { pdf.addImage(indexifyLogo, "PNG", L, (HDR_H - 11) / 2, 34, 11); } catch { /**/ }
      } else {
        pdf.setFont("helvetica", "bold"); pdf.setFontSize(16); pdf.setTextColor(...WHITE);
        pdf.text("indexify.", L, HDR_H / 2 + 4);
      }

      pdf.setFont("helvetica", "bold"); pdf.setFontSize(10); pdf.setTextColor(...WHITE);
      pdf.text(title, A4_W / 2, HDR_H / 2, { align: "center" });
      pdf.setFont("helvetica", "normal"); pdf.setFontSize(7); pdf.setTextColor(200, 235, 255);
      pdf.text(date, A4_W / 2, HDR_H / 2 + 5.5, { align: "center" });

      if (fdLogo) {
        const fdW = 28; const fdH = 9; const fdX = R - fdW; const fdY = (HDR_H - fdH) / 2 + 1;
        pdf.setFontSize(5.5); pdf.setTextColor(180, 225, 250);
        pdf.text("Powered by", fdX + fdW / 2, fdY - 1.5, { align: "center" });
        try { pdf.addImage(fdLogo, "PNG", fdX, fdY, fdW, fdH); } catch { /**/ }
      } else {
        pdf.setFont("helvetica", "normal"); pdf.setFontSize(7); pdf.setTextColor(...WHITE);
        pdf.text("Powered by Fortune Design", R, HDR_H / 2 + 3, { align: "right" });
      }
    };

    const drawFooter = (pg: number, total: number) => {
      const fy = A4_H - FTR_H;
      pdf.setFillColor(...BGRAY); pdf.rect(0, fy, A4_W, FTR_H, "F");
      pdf.setDrawColor(...LINE);  pdf.line(0, fy, A4_W, fy);
      pdf.setFont("helvetica", "normal"); pdf.setFontSize(6.5); pdf.setTextColor(...LIGHT);
      pdf.text("Indexify · indexify.co.za · Powered by Fortune Design · fortunedesign.co.za", L, fy + 7.5);
      pdf.text(`Page ${pg} of ${total}`, R, fy + 7.5, { align: "right" });
    };

    // ══════════════════════════════════════════════════════════════════════
    // PAGE 1 — Summary
    // ══════════════════════════════════════════════════════════════════════
    drawHeader();
    let y = CTOP;

    // Website URL bar
    pdf.setFillColor(241, 245, 249); pdf.rect(0, y - 2, A4_W, 14, "F");
    pdf.setFont("helvetica", "bold"); pdf.setFontSize(11); pdf.setTextColor(...DARK);
    pdf.text(domain, L, y + 6);
    pdf.setFont("helvetica", "normal"); pdf.setFontSize(7.5); pdf.setTextColor(...MID);
    const urlText = result.finalUrl.length > 70 ? result.finalUrl.slice(0, 67) + "…" : result.finalUrl;
    pdf.text(urlText, R, y + 6, { align: "right" });
    y += 20;

    // Score circle
    const cx = L + 22; const cy = y + 20; const cr = 17;
    drawScoreCircle(cx, cy, cr, result.overallScore);

    // Grade pill
    const gx = cx + cr + 6; const gw = 14; const gh = 14;
    pdf.setFillColor(...scoreRGB(result.overallScore));
    pdf.roundedRect(gx, cy - gh / 2, gw, gh, 2, 2, "F");
    pdf.setFont("helvetica", "bold"); pdf.setFontSize(9); pdf.setTextColor(...WHITE);
    pdf.text(scoreGrade(result.overallScore), gx + gw / 2, cy + 2.5, { align: "center" });

    // Label + summary
    const sx = gx + gw + 7;
    pdf.setFont("helvetica", "bold"); pdf.setFontSize(13); pdf.setTextColor(...DARK);
    pdf.text(scoreLabel(result.overallScore), sx, cy - 4);
    pdf.setFont("helvetica", "normal"); pdf.setFontSize(8); pdf.setTextColor(...MID);
    const totalChecks = result.sections.reduce((a, s) => a + s.checks.length, 0);
    const summaryTxt  = `This audit analysed ${totalChecks} SEO checks across ${result.sections.length} categories. ${result.recommendations.length} improvements were identified.`;
    pdf.text(wrap(summaryTxt, R - sx, 8), sx, cy + 3);
    y = cy + cr + 10;

    // Stats row
    const statItems = [
      { label: "Overall Score",  val: `${result.overallScore}/100` },
      { label: "Load Time",      val: result.loadTimeMs < 1000 ? `${result.loadTimeMs}ms` : `${(result.loadTimeMs / 1000).toFixed(1)}s` },
      { label: "Issues Found",   val: `${result.sections.reduce((a, s) => a + s.checks.filter(c => c.status !== "pass").length, 0)}` },
      { label: "Recommendations", val: `${result.recommendations.length}` },
    ];
    const sw = CW / statItems.length;
    statItems.forEach((s, i) => {
      const bx = L + i * sw;
      pdf.setFillColor(...BGRAY); pdf.roundedRect(bx, y, sw - 2, 17, 2, 2, "F");
      pdf.setFont("helvetica", "bold"); pdf.setFontSize(12); pdf.setTextColor(...TEAL);
      pdf.text(s.val, bx + (sw - 2) / 2, y + 7.5, { align: "center" });
      pdf.setFont("helvetica", "normal"); pdf.setFontSize(6.5); pdf.setTextColor(...MID);
      pdf.text(s.label, bx + (sw - 2) / 2, y + 13, { align: "center" });
    });
    y += 23;

    // Section scores
    pdf.setFont("helvetica", "bold"); pdf.setFontSize(9); pdf.setTextColor(...DARK);
    pdf.text("SECTION SCORES", L, y);
    pdf.setDrawColor(...LINE); pdf.setLineWidth(0.3);
    pdf.line(L + 37, y - 1, R, y - 1);
    y += 6;

    result.sections.forEach(sec => {
      const pass = sec.checks.filter(c => c.status === "pass").length;
      const warn = sec.checks.filter(c => c.status === "warn").length;
      const fail = sec.checks.filter(c => c.status === "fail").length;
      pdf.setFont("helvetica", "bold"); pdf.setFontSize(8); pdf.setTextColor(...DARK);
      pdf.text(sec.title, L, y + 4);
      drawBar(L + 58, y, 76, 5, sec.score);
      pdf.setFont("helvetica", "bold"); pdf.setFontSize(8); pdf.setTextColor(...scoreRGB(sec.score));
      pdf.text(`${sec.score}%`, L + 137, y + 4.5);
      pdf.setFontSize(6.5);
      pdf.setTextColor(...GREEN); pdf.text(`✓${pass}`, L + 150, y + 4.5);
      pdf.setTextColor(...AMBER); pdf.text(`!${warn}`,  L + 161, y + 4.5);
      pdf.setTextColor(...RED);   pdf.text(`✗${fail}`,  L + 172, y + 4.5);
      y += 9;
    });
    y += 4;

    // Page title + meta
    if (result.pageTitle && y + 22 < CBOT) {
      pdf.setFillColor(...BGRAY); pdf.rect(L, y, CW, 22, "F");
      pdf.setFont("helvetica", "bold"); pdf.setFontSize(6.5); pdf.setTextColor(...TEAL);
      pdf.text("PAGE TITLE", L + 3, y + 5.5);
      pdf.setFont("helvetica", "normal"); pdf.setFontSize(8); pdf.setTextColor(...DARK);
      pdf.text(wrap(result.pageTitle, CW - 6, 8).slice(0, 1), L + 3, y + 10.5);
      if (result.metaDescription) {
        pdf.setFont("helvetica", "bold"); pdf.setFontSize(6.5); pdf.setTextColor(...TEAL);
        pdf.text("META DESCRIPTION", L + 3, y + 15.5);
        pdf.setFont("helvetica", "normal"); pdf.setFontSize(7.5); pdf.setTextColor(...MID);
        pdf.text(wrap(result.metaDescription, CW - 6, 7.5).slice(0, 1), L + 3, y + 20);
      }
      y += 26;
    }

    drawFooter(1, 99);

    // ══════════════════════════════════════════════════════════════════════
    // PAGES 2+ — Per-section detailed checks
    // ══════════════════════════════════════════════════════════════════════
    for (const sec of result.sections) {
      addPage();
      drawHeader(`SEO AUDIT — ${sec.title.toUpperCase()}`);
      y = CTOP;

      // Section heading
      pdf.setFillColor(...TEAL); pdf.rect(L, y, 3, 12, "F");
      pdf.setFont("helvetica", "bold"); pdf.setFontSize(13); pdf.setTextColor(...DARK);
      pdf.text(sec.title, L + 6, y + 8.5);
      pdf.setFontSize(10); pdf.setTextColor(...scoreRGB(sec.score));
      pdf.text(`${sec.score}%`, R, y + 8.5, { align: "right" });
      drawBar(R - 50, y + 3, 46, 5, sec.score);
      y += 18;

      for (const chk of sec.checks) {
        const rowH = chk.description ? 20 : 12;
        if (y + rowH > CBOT) {
          drawFooter(currentPage, 99);
          addPage();
          drawHeader(`SEO AUDIT — ${sec.title.toUpperCase()}`);
          y = CTOP;
        }

        const statusRGB: RGB = chk.status === "pass" ? GREEN : chk.status === "warn" ? AMBER : RED;
        const statusLbl = chk.status === "pass" ? "PASS" : chk.status === "warn" ? "WARN" : "FAIL";

        pdf.setFillColor(...statusRGB); pdf.roundedRect(L, y, 11, 6, 1, 1, "F");
        pdf.setFont("helvetica", "bold"); pdf.setFontSize(5.5); pdf.setTextColor(...WHITE);
        pdf.text(statusLbl, L + 5.5, y + 4.2, { align: "center" });

        pdf.setFont("helvetica", "bold"); pdf.setFontSize(8.5); pdf.setTextColor(...DARK);
        pdf.text(chk.name, L + 14, y + 4.5);

        const valText = chk.value.length > 45 ? chk.value.slice(0, 42) + "…" : chk.value;
        pdf.setFont("helvetica", "normal"); pdf.setFontSize(7.5); pdf.setTextColor(...statusRGB);
        pdf.text(valText, R, y + 4.5, { align: "right" });
        y += 8;

        if (chk.description) {
          pdf.setFont("helvetica", "normal"); pdf.setFontSize(7); pdf.setTextColor(...MID);
          const lines = wrap(chk.description, CW - 14, 7).slice(0, 2);
          pdf.text(lines, L + 14, y);
          y += lines.length * 4 + 2;
        }

        pdf.setDrawColor(...LINE); pdf.setLineWidth(0.2); pdf.line(L, y, R, y);
        y += 3;
      }
      drawFooter(currentPage, 99);
    }

    // ══════════════════════════════════════════════════════════════════════
    // LAST PAGE — Recommendations
    // ══════════════════════════════════════════════════════════════════════
    if (result.recommendations.length > 0) {
      addPage();
      drawHeader("SEO AUDIT — RECOMMENDATIONS");
      y = CTOP;

      pdf.setFillColor(...TEAL); pdf.rect(L, y, 3, 12, "F");
      pdf.setFont("helvetica", "bold"); pdf.setFontSize(13); pdf.setTextColor(...DARK);
      pdf.text("Top Recommendations", L + 6, y + 8.5);
      y += 18;

      result.recommendations.slice(0, 20).forEach((rec, i) => {
        const lines = wrap(rec, CW - 14, 8.5).slice(0, 3);
        const rh = lines.length * 5.5 + 6;
        if (y + rh > CBOT) {
          drawFooter(currentPage, 99);
          addPage();
          drawHeader("SEO AUDIT — RECOMMENDATIONS");
          y = CTOP;
        }
        pdf.setFillColor(...TEAL); pdf.circle(L + 4, y + 3.5, 4, "F");
        pdf.setFont("helvetica", "bold"); pdf.setFontSize(7); pdf.setTextColor(...WHITE);
        pdf.text(`${i + 1}`, L + 4, y + 5.5, { align: "center" });
        pdf.setFont("helvetica", "normal"); pdf.setFontSize(8.5); pdf.setTextColor(...DARK);
        pdf.text(lines, L + 12, y + 4.5);
        y += rh;
      });

      // CTA box
      if (y + 30 < CBOT) {
        y += 6;
        pdf.setFillColor(240, 249, 255); pdf.roundedRect(L, y, CW, 28, 3, 3, "F");
        pdf.setDrawColor(...TEAL); pdf.setLineWidth(0.5); pdf.roundedRect(L, y, CW, 28, 3, 3, "S");
        pdf.setFont("helvetica", "bold"); pdf.setFontSize(11); pdf.setTextColor(...TEAL);
        pdf.text("Ready to Fix These Issues?", A4_W / 2, y + 9, { align: "center" });
        pdf.setFont("helvetica", "normal"); pdf.setFontSize(8.5); pdf.setTextColor(...MID);
        pdf.text("Our SEO experts will implement every recommendation above.", A4_W / 2, y + 16, { align: "center" });
        pdf.setFont("helvetica", "bold"); pdf.setFontSize(9); pdf.setTextColor(...TEAL);
        pdf.text("Book a free strategy call → indexify.co.za/contact", A4_W / 2, y + 23, { align: "center" });
      }

      drawFooter(currentPage, 99);
    }

    // ── Re-render footers with correct total page count ────────────────────
    const totalPages = currentPage;
    for (let p = 1; p <= totalPages; p++) {
      pdf.setPage(p);
      drawFooter(p, totalPages);
    }

    pdf.save(`indexify-seo-audit-${domain}.pdf`);
  } catch (err) {
    console.error("[PDF] generation failed:", err);
    alert("PDF generation failed. Please try again or use your browser's Print → Save as PDF option.");
  } finally {
    setGenerating(false);
  }
}

export default function AuditPage() {
  useSEO({
    title: "Free SEO Audit South Africa – Instant Analysis | Indexify",
    description: "Get your free SEO audit in seconds. Discover why your website isn't ranking on Google and what's holding back your organic traffic. No sign-up required.",
    keywords: ["free SEO audit South Africa", "website SEO analysis", "Google ranking check South Africa", "SEO health check", "website audit tool South Africa"],

  });

  const [inputUrl, setInputUrl]     = useState("");
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const [result, setResult]         = useState<AuditResult | null>(null);
  const [generating, setGenerating] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20">
            <div className="max-w-sm mx-auto text-center">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full border-[5px] border-primary/10" />
                <div className="absolute inset-0 rounded-full border-[5px] border-transparent border-t-primary animate-spin" />
                <div className="absolute inset-[10px] rounded-full border-[3px] border-transparent border-t-primary/40 animate-spin" style={{ animationDirection: "reverse", animationDuration: "0.8s" }} />
                <Globe className="absolute inset-0 m-auto text-primary" size={24} />
              </div>
              <p className="font-black text-lg text-gray-900 mb-1">Analysing your website…</p>
              <p className="text-sm text-gray-400 mb-8">Checking 25+ SEO factors across 6 categories.</p>
              <div className="space-y-3 text-left">
                {[
                  { icon: FileText,   label: "Reading page content & meta tags" },
                  { icon: Zap,        label: "Checking technical SEO signals" },
                  { icon: Monitor,    label: "Capturing desktop & mobile screenshots" },
                  { icon: TrendingUp, label: "Analysing backlink authority data" },
                  { icon: Share2,     label: "Checking structured data & social tags" },
                ].map(({ icon: StepIcon, label }, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.4 + 0.3 }}
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

        {/* Results */}
        {result && !loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">

            {/* ── Download PDF button ── */}
            <div className="flex justify-end">
              <button
                onClick={() => {
                  if (!reportRef.current) {
                    alert("Report not ready — please wait a moment and try again.");
                    return;
                  }
                  downloadAuditPDF(result, reportRef.current, setGenerating);
                }}
                disabled={generating}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-all shadow-sm hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-wait"
              >
                <Download size={14} />
                {generating ? "Generating PDF…" : "Download PDF Report"}
              </button>
            </div>

            {/* ── Report content (captured as screenshot) ── */}
            <div ref={reportRef} className="space-y-5">

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
                    <ScoreRing score={result.overallScore} size={112} />
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Overall Grade</p>
                      <p className={cn("text-5xl font-black leading-none mb-1", overall?.color)}>{overall?.grade}</p>
                      <p className="text-sm text-gray-500 font-medium">{overall?.label}</p>
                    </div>
                  </div>

                  <div className="w-px h-16 bg-gray-100 hidden md:block" />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-bold text-base text-gray-900 truncate">{result.pageTitle || "Untitled Page"}</p>
                      <a href={result.finalUrl} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${result.finalUrl}`} className="text-gray-400 hover:text-primary shrink-0 transition-colors">
                        <ExternalLink size={13} aria-hidden="true" />
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
                <button
                  onClick={() => openWhatsAppModal()}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#25d366] text-white font-bold text-sm hover:bg-[#20bc5a] transition-all shadow-md"
                >
                  <Share2 size={16} /> Chat on WhatsApp
                </button>
                <a
                  href={BASE + "/"}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-all shadow-md"
                >
                  View Our SEO Packages
                </a>
              </div>
            </motion.div>

            </div>{/* ── end reportRef ── */}
          </motion.div>
        )}

        {/* Empty state — feature grid */}
        {!result && !loading && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px bg-gray-200 flex-1" />
              <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold whitespace-nowrap">25+ checks across 6 categories</p>
              <div className="h-px bg-gray-200 flex-1" />
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { icon: FileText,   title: "On-Page SEO",           desc: "Title tags, meta descriptions, headings, keyword usage, word count", color: "bg-sky-50 border-sky-100", iconColor: "text-sky-600 bg-sky-100" },
                { icon: Zap,        title: "Technical SEO",         desc: "HTTPS, load speed, mobile viewport, robots.txt, sitemap, canonical", color: "bg-violet-50 border-violet-100", iconColor: "text-violet-600 bg-violet-100" },
                { icon: Image,      title: "Image Optimisation",    desc: "Alt text coverage, image count, lazy-loading and compression checks", color: "bg-amber-50 border-amber-100", iconColor: "text-amber-600 bg-amber-100" },
                { icon: Link2,      title: "Link Structure",        desc: "Internal and external link quality, broken links, anchor text analysis", color: "bg-emerald-50 border-emerald-100", iconColor: "text-emerald-600 bg-emerald-100" },
                { icon: TrendingUp, title: "Backlinks & Authority", desc: "Domain age, crawl activity, outbound diversity, social profile links", color: "bg-orange-50 border-orange-100", iconColor: "text-orange-600 bg-orange-100" },
                { icon: Share2,     title: "Social & Schema",       desc: "Open Graph, Twitter Cards, JSON-LD structured data markup", color: "bg-pink-50 border-pink-100", iconColor: "text-pink-600 bg-pink-100" },
              ].map(({ icon: Icon, title, desc, color, iconColor }, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 + 0.1 }}
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

            {/* Grade scale preview */}
            <div className="mt-8 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 text-center">How we grade</p>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {[
                  { grade: "A+", range: "95–100", color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
                  { grade: "A",  range: "90–94",  color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
                  { grade: "B+", range: "80–89",  color: "text-sky-600 bg-sky-50 border-sky-200" },
                  { grade: "B",  range: "70–79",  color: "text-sky-600 bg-sky-50 border-sky-200" },
                  { grade: "C",  range: "50–69",  color: "text-amber-600 bg-amber-50 border-amber-200" },
                  { grade: "D",  range: "40–49",  color: "text-orange-600 bg-orange-50 border-orange-200" },
                  { grade: "F",  range: "0–39",   color: "text-red-600 bg-red-50 border-red-200" },
                ].map(({ grade, range, color }) => (
                  <div key={grade} className={cn("flex flex-col items-center border rounded-xl px-3 py-2 min-w-[52px]", color)}>
                    <span className="font-black text-lg leading-none">{grade}</span>
                    <span className="text-[10px] opacity-60 mt-0.5">{range}</span>
                  </div>
                ))}
              </div>
              <p className="text-center text-xs text-gray-400 mt-4">
                Each category receives an individual grade. Your overall score is a weighted average across all 6 categories.
              </p>
            </div>

            {/* Trust signals */}
            <div className="mt-5 grid grid-cols-3 gap-3">
              {[
                { icon: ShieldCheck, label: "No sign-up required" },
                { icon: Zap,         label: "Results in ~15 seconds" },
                { icon: Globe,       label: "Any website, any industry" },
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
