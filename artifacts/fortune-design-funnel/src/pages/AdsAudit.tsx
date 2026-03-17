import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock, Unlock, Download, Target, Zap,
  TrendingUp, DollarSign, Users, MousePointerClick,
  Loader2, Search, Megaphone, RefreshCw, Lightbulb,
  BarChart3, ChevronDown, Globe
} from "lucide-react";
import { useLocation } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { cn } from "@/lib/utils";

const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") ?? "";
const WA_NUMBER = "27760597724";
const PRIMARY = "hsl(198 69% 52%)";
const ACCENT  = "hsl(29 100% 65%)";

function WhatsAppIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 3.5c-6.904 0-12.5 5.596-12.5 12.5 0 2.332.643 4.514 1.763 6.38L4 28l5.797-1.52A12.453 12.453 0 0016 28.5c6.904 0 12.5-5.596 12.5-12.5S22.904 3.5 16 3.5z" fill="currentColor"/>
      <path d="M21.9 19.3c-.3-.15-1.75-.864-2.02-.963-.27-.1-.467-.15-.664.15-.197.3-.764.963-.937 1.16-.173.197-.346.222-.645.075-.3-.148-1.265-.466-2.41-1.487-.89-.795-1.493-1.775-1.668-2.075-.174-.3-.018-.462.13-.61.134-.133.3-.347.448-.52.148-.174.197-.3.296-.497.1-.197.05-.37-.025-.52-.075-.148-.663-1.6-.908-2.19-.24-.574-.483-.496-.663-.505l-.565-.01c-.197 0-.52.074-.792.37-.272.297-1.04 1.016-1.04 2.477s1.065 2.874 1.213 3.072c.149.197 2.1 3.206 5.086 4.494.711.307 1.266.49 1.699.627.714.227 1.364.195 1.878.118.572-.085 1.762-.72 2.01-1.416.248-.696.248-1.292.173-1.416-.074-.124-.272-.197-.57-.347z" fill="white"/>
    </svg>
  );
}

interface AdGroup {
  name: string;
  previewKeywords: string[];
  keywords: string[];
  headlines: string[];
  descriptions: string[];
}

interface Campaign {
  name: string;
  type: string;
  objective: string;
  monthlyBudget: number;
  dailyBudget: number;
  biddingStrategy: string;
  adGroups: AdGroup[];
}

interface ProposalResult {
  url: string;
  finalUrl: string;
  businessName: string;
  industry: string;
  location: string;
  phone: string;
  country: string;
  currencySymbol: string;
  servicesDetected: string[];
  pagesCrawled: number;
  campaigns: Campaign[];
  negativeKeywords: string[];
  totalMonthlyBudget: number;
  expectedCPC: { min: number; max: number };
  expectedMonthlyClicks: { min: number; max: number };
  unlockCode: string;
}

const COUNTRIES = [
  "South Africa", "United Kingdom", "United States", "Australia",
  "United Arab Emirates", "Canada", "Germany", "Netherlands",
  "New Zealand", "Kenya", "Nigeria", "India", "Singapore", "Ireland",
];

function formatCurrency(n: number, symbol: string) {
  return `${symbol}${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}
function formatRand(n: number) { return formatCurrency(n, "R"); }

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function getCompetition(cpcMax: number): string {
  if (cpcMax > 30) return "High";
  if (cpcMax > 15) return "Medium";
  return "Low";
}

function getCompetitionColor(comp: string) {
  if (comp === "High") return "text-red-600 bg-red-50 border-red-200";
  if (comp === "Medium") return "text-amber-600 bg-amber-50 border-amber-200";
  return "text-emerald-600 bg-emerald-50 border-emerald-200";
}

function generateMarketData(services: string[], cpc: { min: number; max: number }, currencySymbol = "R") {
  return services.map((svc, i) => {
    const spread = Math.max(cpc.max - cpc.min, 0.01);
    const svcCpcMin = cpc.min + ((i * 3) % spread);
    const svcCpcMax = Math.min(cpc.max, svcCpcMin + spread * 0.4 + 2);
    const avgCpc = ((svcCpcMin + svcCpcMax) / 2).toFixed(2);
    const baseVol = 400 + (i % 3) * 300 + Math.round(cpc.min * 40);
    const competition = getCompetition(svcCpcMax);
    return { category: svc, volume: baseVol, competition, cpc: `${currencySymbol}${avgCpc}` };
  });
}

function AdPreviewMock({ adGroup, domain, businessName }: {
  adGroup: AdGroup; domain: string; businessName: string;
}) {
  const slug = slugify(adGroup.name);
  const h1 = adGroup.headlines[0] ?? adGroup.name;
  const h2 = adGroup.headlines[1] ?? businessName;
  const h3 = adGroup.headlines[4] ?? adGroup.headlines[2] ?? "Get a Quote";
  const titleLine = [h1, h2, h3].filter(Boolean).join(" | ");
  const desc = adGroup.descriptions[0] ?? `Professional ${adGroup.name.toLowerCase()} services. Contact us today.`;
  const displayUrl = `${domain}/${slug}`;

  return (
    <div className="mt-3 border border-gray-200 rounded-xl p-4 bg-white">
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Ad Preview</p>
      <div className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-sm transition-shadow">
        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
          <span className="border border-gray-400 rounded px-1 py-0.5 text-[10px] font-semibold text-gray-500 leading-none">Ad</span>
          <span>· {displayUrl}</span>
        </div>
        <p className="text-blue-700 font-medium text-sm leading-snug mb-1.5 line-clamp-2 hover:underline cursor-default">
          {titleLine}
        </p>
        <p className="text-xs text-gray-600 leading-relaxed mb-3 line-clamp-2">{desc}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {["Get a Quote", "View More", "Contact Us"].map(link => (
            <span key={link} className="text-xs text-blue-700 hover:underline cursor-default">{link}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function AdGroupRow({ adGroup, domain, businessName, showPreview, estClicks, unlocked }: {
  adGroup: AdGroup; domain: string; businessName: string; showPreview: boolean; estClicks: number; unlocked: boolean;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-100">
        <div>
          <p className="font-bold text-sm text-gray-900">{adGroup.name}</p>
          <p className="text-xs text-gray-400 mt-0.5">Targeting: {adGroup.keywords.length} keywords</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-xs text-gray-400">Est. Clicks</p>
          <p className="font-bold text-sm text-gray-700">~{estClicks.toLocaleString()}/mo</p>
        </div>
      </div>
      <div className="px-5 py-4 space-y-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
            Keywords
            <span className="ml-2 normal-case font-normal text-gray-400">
              ({adGroup.keywords.length} total{!unlocked && adGroup.keywords.length > 5 ? ` · ${adGroup.keywords.length - 5} locked` : ""})
            </span>
          </p>
          <div className="flex flex-wrap gap-1.5">
            {adGroup.keywords.map((kw, i) => {
              const visible = unlocked || i < 5;
              return (
                <span
                  key={i}
                  className="px-2.5 py-1 text-xs rounded border font-medium transition-all duration-300"
                  style={visible
                    ? { background: "#eff6ff", color: "#1d4ed8", borderColor: "#bfdbfe" }
                    : {
                        background: "#eff6ff",
                        color: "#1d4ed8",
                        borderColor: "#bfdbfe",
                        filter: "blur(5px)",
                        userSelect: "none",
                        pointerEvents: "none",
                        opacity: 0.7,
                      }
                  }
                >
                  {kw}
                </span>
              );
            })}
          </div>
          {!unlocked && adGroup.keywords.length > 5 && (
            <p className="text-[10px] text-gray-400 mt-2 flex items-center gap-1">
              <Lock size={9} /> Remaining keywords revealed with unlock code
            </p>
          )}
        </div>
        {showPreview
          ? <AdPreviewMock adGroup={adGroup} domain={domain} businessName={businessName} />
          : (
            <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <Lock size={14} className="text-gray-300 shrink-0" />
              <p className="text-xs text-gray-400">Ad preview (15 headlines + 4 descriptions) included in full proposal</p>
            </div>
          )
        }
      </div>
    </div>
  );
}

function CampaignSection({ campaign, index, unlocked, result }: {
  campaign: Campaign; index: number; unlocked: boolean; result: ProposalResult;
}) {
  const [open, setOpen] = useState(index === 0);
  const isLocked = !unlocked && index > 0;
  const domain = (() => { try { return new URL(result.finalUrl).hostname.replace(/^www\./, ""); } catch { return result.finalUrl; } })();
  const totalClicksForCampaign = Math.round((result.expectedMonthlyClicks.min + result.expectedMonthlyClicks.max) / 2 * 0.6);
  const clicksPerGroup = Math.round(totalClicksForCampaign / Math.max(campaign.adGroups.length, 1));
  const typeColors: Record<string, string> = {
    Search: "bg-blue-600",
    Display: "bg-purple-600",
    Shopping: "bg-emerald-600",
  };
  const typeBg = typeColors[campaign.type] ?? "bg-gray-600";

  return (
    <div className={cn("rounded-2xl border overflow-hidden", isLocked ? "border-gray-100 opacity-60" : "border-gray-200 shadow-sm")}>
      <button
        onClick={() => !isLocked && setOpen(v => !v)}
        className={cn("w-full flex items-center justify-between px-5 py-4 bg-gray-900 text-left", !isLocked && "hover:bg-gray-800 transition-colors", isLocked && "cursor-default")}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className={cn("px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-widest text-white shrink-0", typeBg)}>
            {campaign.type}
          </span>
          <div className="min-w-0">
            <p className="font-black text-white text-sm truncate">{campaign.name}</p>
            <p className="text-gray-400 text-xs mt-0.5 hidden sm:block">{campaign.objective} · {formatCurrency(campaign.monthlyBudget, result.currencySymbol)}/mo · {campaign.biddingStrategy}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {isLocked
            ? <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-700 text-gray-400 text-xs font-bold"><Lock size={10} /> LOCKED</span>
            : <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">● ACTIVE</span>
          }
          {!isLocked && (
            <ChevronDown size={16} className={cn("text-gray-400 transition-transform duration-300", open && "rotate-180")} />
          )}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && !isLocked && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-3 bg-slate-50">
              {campaign.adGroups.map((ag, i) => (
                <AdGroupRow
                  key={i}
                  adGroup={ag}
                  domain={domain}
                  businessName={result.businessName}
                  showPreview={unlocked || index === 0}
                  estClicks={clicksPerGroup}
                  unlocked={unlocked}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function generateProposalHTML(result: ProposalResult): string {
  const now = new Date().toLocaleDateString("en-ZA", { year: "numeric", month: "long", day: "numeric" });
  const domain = (() => { try { return new URL(result.finalUrl).hostname.replace(/^www\./, ""); } catch { return result.finalUrl; } })();
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>Google Ads Proposal – ${result.businessName}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #111827; background: #fff; padding: 40px; max-width: 960px; margin: 0 auto; }
  .logo { font-size: 28px; font-weight: 900; margin-bottom: 8px; background: linear-gradient(90deg, #e040fb 0%, #7c4dff 40%, #00b8d9 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; letter-spacing: -1px; }
  .logo span { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; display: block; background: linear-gradient(90deg, #7c4dff, #00b8d9); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-top: 2px; }
  .badge { display: inline-block; background: hsl(29 100% 65%); color: white; font-size: 11px; font-weight: 700; padding: 4px 14px; border-radius: 99px; text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 20px; }
  h1 { font-size: 28px; font-weight: 900; color: #111827; margin-bottom: 4px; }
  .subtitle { color: #6b7280; font-size: 13px; margin-bottom: 36px; }
  .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 32px; }
  .card { border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; text-align: center; }
  .card .num { font-size: 28px; font-weight: 900; color: hsl(198 69% 52%); }
  .card .lbl { font-size: 11px; color: #6b7280; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.05em; }
  .section { margin-bottom: 32px; page-break-inside: avoid; }
  .section-title { font-size: 16px; font-weight: 800; color: #111827; border-bottom: 2px solid #f3f4f6; padding-bottom: 8px; margin-bottom: 16px; }
  .services { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; }
  .svc-tag { background: #eff6ff; border: 1px solid #bfdbfe; color: #1d4ed8; padding: 4px 12px; border-radius: 99px; font-size: 12px; font-weight: 600; }
  .campaign { border: 1px solid #e5e7eb; border-radius: 12px; margin-bottom: 20px; overflow: hidden; page-break-inside: avoid; }
  .campaign-header { background: #111827; padding: 14px 18px; border-bottom: 1px solid #374151; }
  .campaign-name { font-size: 15px; font-weight: 800; color: #fff; margin-bottom: 4px; }
  .campaign-meta { font-size: 12px; color: #9ca3af; }
  .campaign-meta span { font-weight: 700; color: #10b981; }
  .ad-group { padding: 16px 18px; border-bottom: 1px solid #f3f4f6; background: #fff; }
  .ad-group:last-child { border-bottom: none; }
  .ag-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
  .ag-name { font-size: 13px; font-weight: 700; color: #374151; }
  .ag-clicks { font-size: 11px; color: #6b7280; text-align: right; }
  .ag-clicks strong { display: block; font-size: 13px; color: #374151; }
  .kw-grid { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 14px; }
  .kw { background: #eff6ff; border: 1px solid #bfdbfe; color: #1d4ed8; padding: 3px 10px; border-radius: 4px; font-size: 11px; font-weight: 600; }
  .ad-preview { border: 1px solid #e5e7eb; border-radius: 8px; padding: 14px; background: #fff; }
  .ad-preview-label { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #9ca3af; margin-bottom: 8px; }
  .ad-indicator { border: 1px solid #9ca3af; border-radius: 3px; padding: 1px 4px; font-size: 10px; color: #6b7280; font-weight: 600; margin-right: 4px; }
  .ad-url { font-size: 12px; color: #4b5563; }
  .ad-title { font-size: 14px; color: #1a73e8; font-weight: 500; margin: 4px 0; line-height: 1.4; }
  .ad-desc { font-size: 12px; color: #4b5563; line-height: 1.5; margin-bottom: 8px; }
  .ad-sitelinks { display: flex; gap: 16px; }
  .ad-sitelinks span { font-size: 12px; color: #1a73e8; }
  .section-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: #9ca3af; margin-bottom: 6px; }
  .neg-kws { display: flex; flex-wrap: wrap; gap: 6px; }
  .neg-kw { background: #fef2f2; border: 1px solid #fecaca; color: #991b1b; padding: 3px 10px; border-radius: 99px; font-size: 11px; font-weight: 600; }
  .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 20px; }
  .info-item { padding: 12px 16px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; }
  .info-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: #9ca3af; margin-bottom: 2px; }
  .info-value { font-size: 14px; font-weight: 700; color: #111827; }
  .mktable { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
  .mktable th { background: #f9fafb; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; padding: 8px 12px; text-align: left; border-bottom: 2px solid #e5e7eb; }
  .mktable td { padding: 8px 12px; font-size: 12px; border-bottom: 1px solid #f3f4f6; }
  .comp-high { color: #dc2626; font-weight: 600; }
  .comp-med { color: #d97706; font-weight: 600; }
  .comp-low { color: #059669; font-weight: 600; }
  .guide-box { background: #fffbeb; border: 1px solid #fde68a; border-radius: 10px; padding: 14px 18px; margin-bottom: 20px; }
  .guide-title { font-size: 12px; font-weight: 800; color: #78350f; margin-bottom: 8px; }
  .guide-item { font-size: 12px; color: #92400e; margin-bottom: 4px; }
  .footer { margin-top: 48px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 11px; color: #9ca3af; text-align: center; }
  @media print { body { padding: 24px; } .campaign { page-break-inside: avoid; } }
</style>
</head>
<body>
<div class="logo">indexify.<span>Lead SEO &amp; Google Ads Expert</span></div>
<div class="badge">Google Ads Proposal</div>
<h1>${result.businessName} — Strategy Plan</h1>
<p class="subtitle">High-conversion Google Ads blueprint for ${result.businessName}. Prepared by Indexify · Generated ${now}</p>

<div class="grid-4">
  <div class="card"><div class="num">${formatCurrency(result.totalMonthlyBudget, result.currencySymbol)}</div><div class="lbl">Monthly Budget</div></div>
  <div class="card"><div class="num">${result.currencySymbol}${result.expectedCPC.min}–${result.currencySymbol}${result.expectedCPC.max}</div><div class="lbl">Avg. CPC Range</div></div>
  <div class="card"><div class="num">${result.expectedMonthlyClicks.min}–${result.expectedMonthlyClicks.max}</div><div class="lbl">Est. Monthly Clicks</div></div>
  <div class="card"><div class="num">~${Math.round((result.expectedMonthlyClicks.min + result.expectedMonthlyClicks.max) / 2 * 0.062)}</div><div class="lbl">Est. Conversions</div></div>
</div>

<div class="section">
  <div class="section-title">Market Intelligence</div>
  <table class="mktable">
    <thead><tr><th>Category</th><th>Est. Monthly Searches</th><th>Competition</th><th>Avg. CPC</th></tr></thead>
    <tbody>
      ${generateMarketData(result.servicesDetected, result.expectedCPC, result.currencySymbol).map(row => `
      <tr>
        <td>${row.category}</td>
        <td>${row.volume.toLocaleString()}</td>
        <td class="${row.competition === "High" ? "comp-high" : row.competition === "Medium" ? "comp-med" : "comp-low"}">${row.competition}</td>
        <td>${row.cpc}</td>
      </tr>`).join("")}
    </tbody>
  </table>
</div>

<div class="guide-box">
  <div class="guide-title">Guide: Effective Ad Copy</div>
  <div class="guide-item">1. <strong>Specificity:</strong> Match headlines to keywords.</div>
  <div class="guide-item">2. <strong>Speed:</strong> Highlight fast delivery or quick response.</div>
  <div class="guide-item">3. <strong>Credibility:</strong> Emphasise "${result.businessName}" by name.</div>
</div>

<div class="section">
  <div class="section-title">Business Overview</div>
  <div class="info-grid">
    <div class="info-item"><div class="info-label">Business</div><div class="info-value">${result.businessName}</div></div>
    <div class="info-item"><div class="info-label">Industry</div><div class="info-value">${result.industry}</div></div>
    <div class="info-item"><div class="info-label">Location</div><div class="info-value">${result.location}</div></div>
    <div class="info-item"><div class="info-label">Website</div><div class="info-value">${result.finalUrl}</div></div>
  </div>
  <div class="section-label">Services / Products Detected</div>
  <div class="services">${result.servicesDetected.map(s => `<span class="svc-tag">${s}</span>`).join("")}</div>
</div>

<div class="section">
  <div class="section-title">Proposed Campaign Structure</div>
  ${result.campaigns.map(c => `
  <div class="campaign">
    <div class="campaign-header">
      <div class="campaign-name">Campaign: ${c.name}</div>
      <div class="campaign-meta">${c.type} · ${c.objective} · Budget: <span>${formatCurrency(c.monthlyBudget, result.currencySymbol)}/month</span> · ${c.biddingStrategy}</div>
    </div>
    ${c.adGroups.map((ag, i) => {
      const slug = ag.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const h1 = ag.headlines[0] ?? ag.name;
      const h2 = ag.headlines[1] ?? result.businessName;
      const h3 = ag.headlines[4] ?? ag.headlines[2] ?? "Get a Quote";
      const titleLine = [h1, h2, h3].filter(Boolean).join(" | ");
      const descText = ag.descriptions[0] ?? "";
      const clicksPerGroup = Math.round(((result.expectedMonthlyClicks.min + result.expectedMonthlyClicks.max) / 2 * 0.6) / Math.max(c.adGroups.length, 1));
      return `
    <div class="ad-group">
      <div class="ag-header">
        <div>
          <div class="ag-name">Ad Group: ${ag.name}</div>
          <div style="font-size:11px;color:#9ca3af;margin-top:2px;">Targeting: ${ag.keywords.length} keywords</div>
        </div>
        <div class="ag-clicks"><span>Est. Clicks</span><strong>~${clicksPerGroup.toLocaleString()}/mo</strong></div>
      </div>
      <div class="section-label">Keywords</div>
      <div class="kw-grid">${ag.keywords.map(k => `<span class="kw">${k}</span>`).join("")}</div>
      <div class="ad-preview">
        <div class="ad-preview-label">Ad Preview</div>
        <div><span class="ad-indicator">Ad</span><span class="ad-url">${domain}/${slug}</span></div>
        <div class="ad-title">${titleLine}</div>
        <div class="ad-desc">${descText}</div>
        <div class="ad-sitelinks"><span>Get a Quote</span><span>View More</span><span>Contact Us</span></div>
      </div>
    </div>`;
    }).join("")}
  </div>`).join("")}
</div>

<div class="section">
  <div class="section-title">Negative Keywords (Exclusions)</div>
  <div class="neg-kws">${result.negativeKeywords.map(k => `<span class="neg-kw">−${k}</span>`).join("")}</div>
</div>

<div class="footer">
  <p>Prepared by Indexify · indexify.co.za · info@indexify.co.za · WhatsApp: +27 76 059 7724</p>
  <p style="margin-top:6px;">This proposal is confidential and prepared exclusively for ${result.businessName}. Valid for 30 days.</p>
</div>
</body>
</html>`;
}

function downloadProposal(result: ProposalResult) {
  const html = generateProposalHTML(result);
  const blob = new Blob([html], { type: "text/html" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  const domain = (() => { try { return new URL(result.finalUrl).hostname; } catch { return result.finalUrl; } })();
  a.download = `google-ads-proposal-${domain}-${new Date().toISOString().slice(0, 10)}.html`;
  a.click();
  URL.revokeObjectURL(a.href);
}

export default function AdsAuditPage() {
  const [inputUrl, setInputUrl] = useState("");
  const [inputServices, setInputServices] = useState("");
  const [inputCountry, setInputCountry] = useState("South Africa");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ProposalResult | null>(null);
  const [codeInput, setCodeInput] = useState("");
  const [codeError, setCodeError] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [unlockOpen, setUnlockOpen] = useState(false);
  const [tokenValidating, setTokenValidating] = useState(false);
  const codeRef = useRef<HTMLInputElement>(null);
  const [, navigate] = useLocation();

  async function runProposal(e: React.FormEvent) {
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
        body: JSON.stringify({ url: inputUrl, services: inputServices, country: inputCountry }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to generate proposal");
      setResult(data as ProposalResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function tryUnlock() {
    if (!result) return;
    const entered = (codeRef.current?.value ?? codeInput).trim();

    // Check built-in code first
    if (entered === result.unlockCode) {
      setUnlocked(true);
      setUnlockOpen(false);
      setCodeError("");
      return;
    }

    // Check DB token (FD-XXXXXXXX format)
    if (entered.toUpperCase().startsWith("FD-")) {
      setTokenValidating(true);
      try {
        const res = await fetch(`${BASE}/api/validate-token?token=${encodeURIComponent(entered)}`);
        const data = await res.json() as { valid: boolean };
        if (data.valid) {
          setUnlocked(true);
          setUnlockOpen(false);
          setCodeError("");
          return;
        }
      } catch {
        // fall through to error
      } finally {
        setTokenValidating(false);
      }
    }

    setCodeError("Incorrect code. Please check and try again.");
  }

  function openWhatsApp() {
    const domain = (() => { try { return new URL(result?.finalUrl ?? inputUrl).hostname; } catch { return inputUrl; } })();
    const biz = result?.businessName ?? domain;
    const msg = encodeURIComponent(`Hi Indexify! I'd like to receive my full Google Ads Proposal for *${biz}* (${domain}). Please send payment details for R500.`);
    window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, "_blank");
  }

  function startProposalPayment() {
    if (!result) return;
    const domain = (() => { try { return new URL(result.finalUrl).hostname.replace(/^www\./, ""); } catch { return result.finalUrl; } })();
    navigate(`${BASE}/checkout?type=proposal&domain=${encodeURIComponent(domain)}`);
  }

  const domain = result ? (() => { try { return new URL(result.finalUrl).hostname.replace(/^www\./, ""); } catch { return result.finalUrl; } })() : "";
  const avgClicks = result ? Math.round((result.expectedMonthlyClicks.min + result.expectedMonthlyClicks.max) / 2) : 0;
  const estConversions = Math.round(avgClicks * 0.062);
  const marketData = result ? generateMarketData(result.servicesDetected, result.expectedCPC, result.currencySymbol) : [];

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-28 pb-16">

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-5 border"
            style={{ background: "hsl(198 69% 52% / 0.1)", color: PRIMARY, borderColor: "hsl(198 69% 52% / 0.3)" }}>
            <Megaphone size={14} /> Free Google Ads Proposal Generator
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-3 leading-tight text-gray-900">
            Your Custom <span style={{ color: ACCENT }}>Google Ads Proposal</span><br />
            <span style={{ color: PRIMARY }}>In 30 Seconds</span>
          </h1>
          <p className="text-base text-gray-500 max-w-xl mx-auto leading-relaxed">
            Tell us about your business and we'll build a complete, country-specific Google Ads campaign strategy — keywords, ad copy, budgets and more.
          </p>
        </motion.div>

        {/* Input Form */}
        <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={runProposal}
          className="max-w-2xl mx-auto mb-10"
        >
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-5">

            {/* Step 1 — Website URL */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                Step 1 — Website URL <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={inputUrl}
                  onChange={e => setInputUrl(e.target.value)}
                  placeholder="yourwebsite.co.za"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-slate-50 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                  required
                  disabled={loading}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">We'll crawl your website to detect your services automatically.</p>
            </div>

            {/* Step 2 — Services / Products */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                Step 2 — Services or Products to Advertise
                <span className="ml-2 text-gray-400 normal-case font-normal">(optional but improves accuracy)</span>
              </label>
              <textarea
                value={inputServices}
                onChange={e => setInputServices(e.target.value)}
                placeholder={"e.g. Kitchen Renovation, Bathroom Remodel, Garden Landscaping\nor: Running Shoes, Gym Wear, Yoga Mats"}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-slate-50 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                disabled={loading}
              />
              <p className="text-xs text-gray-400 mt-1">Separate multiple services with commas or new lines. The more specific, the better your proposal.</p>
            </div>

            {/* Step 3 — Country */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                Step 3 — Target Country <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Globe size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <select
                  value={inputCountry}
                  onChange={e => setInputCountry(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-slate-50 text-gray-900 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all appearance-none"
                  disabled={loading}
                >
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              <p className="text-xs text-gray-400 mt-1">Sets the local currency, CPC rates, and location targeting for your proposal.</p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !inputUrl.trim()}
              className="w-full py-4 rounded-xl font-bold text-white text-base transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ background: PRIMARY }}
            >
              {loading
                ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Generating Proposal…</>
                : <><Megaphone size={17} /> Generate My Google Ads Proposal</>
              }
            </button>
          </div>
          <p className="text-center text-xs text-gray-400 mt-3">
            Free preview · Full proposal with ad copy &amp; downloads available for R500
          </p>
        </motion.form>

        {/* Loading */}
        <AnimatePresence>
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-16">
              <div className="relative inline-block mb-6">
                <div className="w-20 h-20 rounded-full border-4 border-gray-100 animate-spin" style={{ borderTopColor: PRIMARY }} />
                <Megaphone className="absolute inset-0 m-auto" style={{ color: PRIMARY }} size={22} />
              </div>
              <h3 className="font-black text-xl text-gray-900 mb-2">Generating Your Proposal…</h3>
              <p className="text-gray-500 text-sm max-w-xs mx-auto">
                Scanning your website, identifying services, and building your custom Google Ads strategy.
              </p>
              <div className="mt-6 flex flex-col items-center gap-2 text-xs text-gray-400">
                {[
                  "Crawling website pages for services & products…",
                  "Detecting industry, audience & country targeting…",
                  "Building campaign structure with local CPC rates…",
                  "Generating keywords, ad copy & proposal…",
                ].map((step, i) => (
                  <motion.p key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.7 }}>
                    {step}
                  </motion.p>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-xl mx-auto mb-8 px-5 py-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <span className="text-red-400 mt-0.5 shrink-0">✕</span>
            <div>
              <p className="font-bold text-red-700 text-sm mb-1">Could not generate proposal</p>
              <p className="text-red-600 text-xs leading-relaxed">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Result */}
        <AnimatePresence>
          {result && !loading && (
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">

              {/* Report Header */}
              <div className="bg-gray-900 text-white rounded-2xl p-6 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">
                      Strategy Report · Budget: {formatCurrency(result.totalMonthlyBudget, result.currencySymbol)} / Month · {result.country}
                    </p>
                    <h2 className="text-2xl font-black text-white">{result.businessName} — Strategy Plan</h2>
                    <p className="text-gray-400 text-sm mt-1 max-w-lg">
                      High-conversion Google Ads blueprint for {result.businessName}. This plan covers{" "}
                      {result.servicesDetected.slice(0, 3).join(", ")}{result.servicesDetected.length > 3 ? ", and more" : ""}.
                    </p>
                    <p className="text-gray-500 text-xs mt-1.5">
                      {result.pagesCrawled} page{result.pagesCrawled !== 1 ? "s" : ""} crawled · {result.location} · {result.industry}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => { setInputUrl(""); setResult(null); setUnlocked(false); }}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs font-medium transition-colors"
                    >
                      <RefreshCw size={12} /> New
                    </button>
                    {unlocked && (
                      <button
                        onClick={() => downloadProposal(result)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-white transition-colors"
                        style={{ background: PRIMARY }}
                      >
                        <Download size={12} /> Download
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Market Intelligence */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                  <BarChart3 size={16} className="text-gray-400" />
                  <h3 className="font-black text-sm text-gray-900">Market Intelligence</h3>
                  <span className="text-xs text-gray-400 ml-1">— Estimated monthly search volumes for your services</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100">Category</th>
                        <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100">Est. Monthly Searches</th>
                        <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100">Competition</th>
                        <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100">Avg. CPC</th>
                      </tr>
                    </thead>
                    <tbody>
                      {marketData.map((row, i) => (
                        <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                          <td className="px-5 py-3 font-medium text-gray-900">{row.category}</td>
                          <td className="px-4 py-3 text-gray-600">{row.volume.toLocaleString()}</td>
                          <td className="px-4 py-3">
                            <span className={cn("px-2 py-0.5 rounded text-xs font-bold border", getCompetitionColor(row.competition))}>
                              {row.competition}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-semibold text-gray-900">{row.cpc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { icon: DollarSign, label: "Monthly Budget", value: formatCurrency(result.totalMonthlyBudget, result.currencySymbol), sub: "Recommended spend" },
                  { icon: Target, label: "Avg. CPC", value: `${result.currencySymbol}${result.expectedCPC.min}–${result.currencySymbol}${result.expectedCPC.max}`, sub: "Cost per click" },
                  { icon: MousePointerClick, label: "Est. Clicks", value: `${result.expectedMonthlyClicks.min}–${result.expectedMonthlyClicks.max}`, sub: "Monthly visitors" },
                  { icon: Users, label: "Est. Conversions", value: `~${estConversions}`, sub: "~6.2% conv. rate" },
                ].map(({ icon: Icon, label, value, sub }) => (
                  <div key={label} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 text-center">
                    <div className="w-9 h-9 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ background: "hsl(198 69% 52% / 0.12)" }}>
                      <Icon size={16} style={{ color: PRIMARY }} />
                    </div>
                    <p className="text-2xl font-black text-gray-900 mb-0.5">{value}</p>
                    <p className="text-xs font-bold text-gray-700 mb-0.5">{label}</p>
                    <p className="text-xs text-gray-400">{sub}</p>
                  </div>
                ))}
              </div>

              {/* Ad Copy Guide */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb size={16} className="text-amber-600" />
                  <h4 className="font-black text-sm text-amber-900">Guide: Effective Ad Copy</h4>
                </div>
                <div className="grid sm:grid-cols-3 gap-3">
                  {[
                    { n: "1", title: "Specificity", desc: "Match your headlines directly to the keywords in each ad group." },
                    { n: "2", title: "Speed", desc: `Highlight fast turnaround or same-day availability.` },
                    { n: "3", title: "Credibility", desc: `Emphasise "${result.businessName}" by name to build brand trust.` },
                  ].map(tip => (
                    <div key={tip.n} className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-amber-200 text-amber-800 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">{tip.n}</span>
                      <div>
                        <p className="font-bold text-xs text-amber-900">{tip.title}</p>
                        <p className="text-xs text-amber-700 leading-relaxed mt-0.5">{tip.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Campaigns */}
              <div className="space-y-3">
                {result.campaigns.map((campaign, idx) => (
                  <CampaignSection key={idx} campaign={campaign} index={idx} unlocked={unlocked} result={result} />
                ))}
              </div>

              {/* Negative Keywords (unlocked only) */}
              {unlocked && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                  <h4 className="font-black text-sm text-gray-900 mb-3">Negative Keywords — Exclusions ({result.negativeKeywords.length})</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {result.negativeKeywords.map((kw, i) => (
                      <span key={i} className="px-2.5 py-1 text-xs bg-red-50 text-red-600 rounded border border-red-100 font-medium">−{kw}</span>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Unlock Section */}
              {!unlocked && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl border-2 border-dashed shadow-sm overflow-hidden"
                  style={{ borderColor: "hsl(198 69% 52% / 0.4)" }}
                >
                  <div className="px-6 py-8 text-center">
                    <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: "hsl(198 69% 52% / 0.12)" }}>
                      <Lock size={22} style={{ color: PRIMARY }} />
                    </div>
                    <h3 className="font-black text-xl text-gray-900 mb-2">
                      Unlock {result.campaigns.length - 1} More Campaigns + Full Ad Copy
                    </h3>
                    <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
                      Get the Brand Protection & Remarketing campaigns, all 15 headlines, 4 descriptions per ad group, full keyword lists, negative keywords, and a downloadable proposal for <strong>R500</strong>.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-3">
                      <button
                        onClick={startProposalPayment}
                        className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm text-white transition-all hover:-translate-y-0.5 shadow-lg"
                        style={{ background: "linear-gradient(135deg, hsl(198 69% 42%), hsl(198 69% 58%))", boxShadow: "0 4px 20px hsl(198 69% 52% / 0.4)" }}
                      >
                        <svg width="16" height="16" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="20" fill="white"/><text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#0099cc">Y</text></svg> Pay R500 with Yoco
                      </button>
                      <button
                        onClick={openWhatsApp}
                        className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm text-white transition-all hover:-translate-y-0.5 shadow-md bg-[#25d366] hover:bg-[#20bc5a]"
                      >
                        <WhatsAppIcon size={15} /> Pay via WhatsApp
                      </button>
                      <button
                        onClick={() => setUnlockOpen(v => !v)}
                        className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all hover:-translate-y-0.5 border border-gray-200 text-gray-600 hover:border-gray-300 bg-white"
                      >
                        <Unlock size={13} /> Enter Code
                      </button>
                    </div>
                    <AnimatePresence>
                      {unlockOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="max-w-sm mx-auto pt-2">
                            <div className="flex gap-2">
                              <input
                                ref={codeRef}
                                type="text"
                                value={codeInput}
                                onChange={e => { setCodeInput(e.target.value); setCodeError(""); }}
                                onKeyDown={e => e.key === "Enter" && void tryUnlock()}
                                placeholder="Enter your unlock code (e.g. FD-XXXXXXXX)"
                                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 text-gray-900 text-sm placeholder-gray-400"
                                style={{ "--tw-ring-color": PRIMARY } as React.CSSProperties}
                              />
                              <button
                                onClick={() => void tryUnlock()}
                                disabled={tokenValidating}
                                className="px-5 py-3 rounded-xl font-bold text-white text-sm transition-all flex items-center gap-1.5 disabled:opacity-60"
                                style={{ background: PRIMARY }}
                              >
                                {tokenValidating ? <><Loader2 size={14} className="animate-spin" /> Checking...</> : "Unlock"}
                              </button>
                            </div>
                            {codeError && <p className="text-red-500 text-xs mt-2 text-left">{codeError}</p>}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}

              {/* Unlocked download CTA */}
              {unlocked && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-2xl p-6 text-white text-center shadow-lg"
                  style={{ background: "linear-gradient(135deg, hsl(198 69% 42%), hsl(198 69% 52%))" }}
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Unlock size={20} />
                    <h3 className="font-black text-lg">Full Proposal Unlocked!</h3>
                  </div>
                  <p className="text-white/80 text-sm mb-4">Download your complete Google Ads proposal as an HTML file — print or share as PDF.</p>
                  <button
                    onClick={() => downloadProposal(result)}
                    className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-white font-bold text-sm transition-all hover:-translate-y-0.5 shadow-md"
                    style={{ color: PRIMARY }}
                  >
                    <Download size={15} /> Download Full Proposal
                  </button>
                </motion.div>
              )}

            </motion.div>
          )}
        </AnimatePresence>

      </div>
      <Footer />
    </div>
  );
}
