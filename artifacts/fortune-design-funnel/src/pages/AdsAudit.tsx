import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MousePointerClick, ArrowLeft, Lock, Unlock, Download, Building2,
  MapPin, Phone, Tag, Target, Zap, BarChart3, ChevronDown, ChevronRight,
  TrendingUp, DollarSign, Users, Eye, FileText, CheckCircle2, XCircle,
  Loader2, Search, Megaphone, RefreshCw
} from "lucide-react";
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
  servicesDetected: string[];
  campaigns: Campaign[];
  negativeKeywords: string[];
  totalMonthlyBudget: number;
  expectedCPC: { min: number; max: number };
  expectedMonthlyClicks: { min: number; max: number };
  unlockCode: string;
}

function formatRand(n: number) {
  return `R${n.toLocaleString("en-ZA")}`;
}

function CampaignCard({ campaign, index, unlocked }: { campaign: Campaign; index: number; unlocked: boolean }) {
  const [open, setOpen] = useState(index === 0);
  const isLocked = !unlocked && index > 0;
  const typeIcon = campaign.type === "Display" ? Eye : campaign.type === "Shopping" ? Tag : Search;
  const TypeIcon = typeIcon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className={cn("bg-white rounded-2xl border overflow-hidden", isLocked ? "border-gray-100 opacity-70" : "border-gray-200 shadow-sm")}
    >
      <button
        onClick={() => !isLocked && setOpen(!open)}
        className={cn("w-full flex items-center justify-between px-5 py-4 text-left gap-4", !isLocked && "hover:bg-gray-50 transition-colors", isLocked && "cursor-default")}
      >
        <div className="flex items-center gap-4 min-w-0">
          <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-white",
            campaign.type === "Display" ? "bg-purple-500" : campaign.type === "Search" && index === 1 ? "bg-blue-500" : "bg-primary"
          )}>
            <TypeIcon size={20} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-bold text-sm text-gray-900 truncate">{campaign.name}</span>
              {isLocked && <Lock size={12} className="text-gray-300 shrink-0" />}
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
              <span className="px-2 py-0.5 rounded-full bg-gray-100 font-medium">{campaign.type}</span>
              <span>·</span>
              <span>{campaign.objective}</span>
              {!isLocked && (
                <>
                  <span>·</span>
                  <span className="text-emerald-600 font-semibold">{formatRand(campaign.monthlyBudget)}/mo</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
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
            <div className="px-5 pb-5 pt-1 border-t border-gray-100 space-y-4">
              <div className="flex flex-wrap gap-4 pt-3">
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign size={14} className="text-gray-400" />
                  <span className="text-gray-500">Daily budget:</span>
                  <span className="font-bold text-gray-900">{formatRand(campaign.dailyBudget)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Zap size={14} className="text-gray-400" />
                  <span className="text-gray-500">Bidding:</span>
                  <span className="font-bold text-gray-900">{campaign.biddingStrategy}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Target size={14} className="text-gray-400" />
                  <span className="text-gray-500">Ad groups:</span>
                  <span className="font-bold text-gray-900">{campaign.adGroups.length}</span>
                </div>
              </div>

              <div className="space-y-3">
                {campaign.adGroups.map((ag, i) => (
                  <AdGroupCard key={i} adGroup={ag} unlocked={unlocked} isFirstCampaign={index === 0} groupIndex={i} />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function AdGroupCard({ adGroup, unlocked, isFirstCampaign, groupIndex }: {
  adGroup: AdGroup; unlocked: boolean; isFirstCampaign: boolean; groupIndex: number;
}) {
  const [open, setOpen] = useState(groupIndex === 0);
  const showFull = unlocked;
  const showPreview = isFirstCampaign && groupIndex === 0;

  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
      >
        <div className="flex items-center gap-2">
          <ChevronRight size={14} className={cn("text-gray-400 transition-transform duration-200", open && "rotate-90")} />
          <span className="font-semibold text-sm text-gray-800">{adGroup.name}</span>
          <span className="text-xs text-gray-400">
            {showFull ? `${adGroup.keywords.length} keywords · ${adGroup.headlines.length} headlines` : `${adGroup.previewKeywords.length} preview keywords`}
          </span>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-4">
              {/* Keywords */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  {showFull ? `Keywords (${adGroup.keywords.length})` : "Sample Keywords"}
                  {!showFull && <span className="ml-2 text-amber-500 font-normal normal-case">· Full list unlocked with proposal</span>}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {(showFull ? adGroup.keywords : adGroup.previewKeywords).map((kw, i) => (
                    <span key={i} className="px-2.5 py-1 text-xs bg-blue-50 text-blue-700 rounded-full border border-blue-100 font-medium">
                      {kw}
                    </span>
                  ))}
                  {!showFull && (
                    <span className="px-2.5 py-1 text-xs bg-gray-100 text-gray-400 rounded-full border border-gray-200 italic">
                      +{adGroup.keywords.length - adGroup.previewKeywords.length} more…
                    </span>
                  )}
                </div>
              </div>

              {/* Ad Copy — locked unless full */}
              {showFull ? (
                <>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Headlines (15)</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                      {adGroup.headlines.map((h, i) => (
                        <div key={i} className="px-3 py-2 text-xs bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-100 font-medium truncate" title={h}>{h}</div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Descriptions (4)</p>
                    <div className="space-y-1.5">
                      {adGroup.descriptions.map((d, i) => (
                        <div key={i} className="px-3 py-2 text-xs bg-amber-50 text-amber-800 rounded-lg border border-amber-100 leading-relaxed">{d}</div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <Lock size={14} className="text-gray-300 shrink-0" />
                  <p className="text-xs text-gray-400">Ad copy (15 headlines + 4 descriptions) included in full proposal</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function generateProposalHTML(result: ProposalResult): string {
  const now = new Date().toLocaleDateString("en-ZA", { year: "numeric", month: "long", day: "numeric" });
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>Google Ads Proposal – ${result.businessName}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #111827; background: #fff; padding: 40px; max-width: 960px; margin: 0 auto; }
  .logo { font-size: 22px; font-weight: 900; margin-bottom: 8px; }
  .logo span { color: hsl(198 69% 52%); }
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
  .campaign-header { background: #f9fafb; padding: 14px 18px; border-bottom: 1px solid #e5e7eb; }
  .campaign-name { font-size: 15px; font-weight: 800; color: #111827; margin-bottom: 4px; }
  .campaign-meta { font-size: 12px; color: #6b7280; }
  .campaign-meta span { font-weight: 700; color: #059669; }
  .ad-group { padding: 16px 18px; border-bottom: 1px solid #f3f4f6; }
  .ad-group:last-child { border-bottom: none; }
  .ag-name { font-size: 13px; font-weight: 700; color: #374151; margin-bottom: 10px; }
  .kw-grid { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px; }
  .kw { background: #eff6ff; border: 1px solid #bfdbfe; color: #1d4ed8; padding: 3px 10px; border-radius: 99px; font-size: 11px; font-weight: 600; }
  .hl-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; margin-bottom: 10px; }
  .hl { background: #f0fdf4; border: 1px solid #bbf7d0; color: #065f46; padding: 5px 8px; border-radius: 6px; font-size: 11px; font-weight: 600; }
  .desc { background: #fffbeb; border: 1px solid #fde68a; color: #78350f; padding: 8px 10px; border-radius: 6px; font-size: 11px; margin-bottom: 6px; line-height: 1.5; }
  .neg-kws { display: flex; flex-wrap: wrap; gap: 6px; }
  .neg-kw { background: #fef2f2; border: 1px solid #fecaca; color: #991b1b; padding: 3px 10px; border-radius: 99px; font-size: 11px; font-weight: 600; }
  .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 20px; }
  .info-item { padding: 12px 16px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; }
  .info-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: #9ca3af; margin-bottom: 2px; }
  .info-value { font-size: 14px; font-weight: 700; color: #111827; }
  .section-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: #9ca3af; margin-bottom: 8px; }
  .footer { margin-top: 48px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 11px; color: #9ca3af; text-align: center; }
  @media print { body { padding: 24px; } .campaign { page-break-inside: avoid; } }
</style>
</head>
<body>
<div class="logo">FORTUNE<span>DESIGN</span></div>
<div class="badge">Google Ads Proposal</div>
<h1>${result.businessName} — Google Ads Proposal</h1>
<p class="subtitle">Prepared by Fortune Design · fortunedesign.co.za · Generated ${now}</p>

<div class="grid-4">
  <div class="card"><div class="num">${formatRand(result.totalMonthlyBudget)}</div><div class="lbl">Recommended Monthly Budget</div></div>
  <div class="card"><div class="num">R${result.expectedCPC.min}–R${result.expectedCPC.max}</div><div class="lbl">Estimated CPC Range</div></div>
  <div class="card"><div class="num">${result.expectedMonthlyClicks.min}–${result.expectedMonthlyClicks.max}</div><div class="lbl">Est. Monthly Clicks</div></div>
  <div class="card"><div class="num">${result.campaigns.length}</div><div class="lbl">Campaigns Proposed</div></div>
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
      <div class="campaign-name">${c.name}</div>
      <div class="campaign-meta">${c.type} Campaign · ${c.objective} · Budget: <span>${formatRand(c.monthlyBudget)}/month (${formatRand(c.dailyBudget)}/day)</span> · Bidding: ${c.biddingStrategy}</div>
    </div>
    ${c.adGroups.map(ag => `
    <div class="ad-group">
      <div class="ag-name">Ad Group: ${ag.name}</div>
      <div class="section-label">Keywords (${ag.keywords.length})</div>
      <div class="kw-grid">${ag.keywords.map(k => `<span class="kw">${k}</span>`).join("")}</div>
      <div class="section-label">Headlines</div>
      <div class="hl-grid">${ag.headlines.map(h => `<div class="hl">${h}</div>`).join("")}</div>
      <div class="section-label">Descriptions</div>
      ${ag.descriptions.map(d => `<div class="desc">${d}</div>`).join("")}
    </div>`).join("")}
  </div>`).join("")}
</div>

<div class="section">
  <div class="section-title">Negative Keywords (Exclusions)</div>
  <div class="neg-kws">${result.negativeKeywords.map(k => `<span class="neg-kw">−${k}</span>`).join("")}</div>
</div>

<div class="footer">
  <p>Prepared by Fortune Design · fortunedesign.co.za · info@fortunedesign.co.za · WhatsApp: +27 76 059 7724</p>
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
  const domain = new URL(result.finalUrl).hostname;
  a.download = `google-ads-proposal-${domain}-${new Date().toISOString().slice(0, 10)}.html`;
  a.click();
  URL.revokeObjectURL(a.href);
}

export default function AdsAuditPage() {
  const [inputUrl, setInputUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ProposalResult | null>(null);
  const [unlockOpen, setUnlockOpen] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [codeError, setCodeError] = useState("");
  const [unlocked, setUnlocked] = useState(false);

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
        body: JSON.stringify({ url: inputUrl }),
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
    const biz = result?.businessName ?? domain;
    const msg = encodeURIComponent(`Hi Fortune Design! I'd like to receive my full Google Ads Proposal for *${biz}* (${domain}). Please send payment details for R500.`);
    window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, "_blank");
  }

  const lockedCampaigns = result ? result.campaigns.length - 1 : 0;

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
            <span style={{ color: PRIMARY }}>DESIGN</span>
          </a>
          <a href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-[#25d366] text-white text-sm font-bold hover:bg-[#20bc5a] transition-colors">
            <WhatsAppIcon size={14} /> WhatsApp Us
          </a>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

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
            Enter your website URL and we'll scan your services & products, then generate a full Google Ads campaign strategy tailored to your business — including keywords, ad copy and budget recommendations.
          </p>
        </motion.div>

        {/* Search Form */}
        <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={runProposal}
          className="max-w-2xl mx-auto mb-10"
        >
          <div className="flex gap-3 flex-col sm:flex-row">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={inputUrl}
                onChange={e => setInputUrl(e.target.value)}
                placeholder="yourwebsite.co.za"
                className="w-full pl-10 pr-4 py-4 rounded-xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 text-gray-900 placeholder-gray-400 text-base"
                style={{ "--tw-ring-color": PRIMARY } as React.CSSProperties}
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !inputUrl.trim()}
              className="px-8 py-4 rounded-xl font-bold text-white text-base transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              style={{ background: PRIMARY }}
            >
              {loading ? "Generating…" : "Generate Proposal"}
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
                  "Scanning website for services & products…",
                  "Detecting industry & target audience…",
                  "Building campaign structure…",
                  "Generating keyword recommendations…",
                  "Writing ad copy for each service…",
                ].map((step, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 1.2 }}
                    className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: PRIMARY }} />
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
              <h3 className="font-bold text-red-800 mb-1">Could Not Generate Proposal</h3>
              <p className="text-red-600 text-sm">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {result && !loading && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

              {/* Business Intelligence Card */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 mb-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-6">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Business Detected</p>
                    <h2 className="text-2xl font-black text-gray-900">{result.businessName}</h2>
                    <p className="text-sm text-gray-500 mt-0.5">{result.industry}</p>
                  </div>
                  <button
                    onClick={() => { setInputUrl(""); setResult(null); setUnlocked(false); }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors shrink-0"
                  >
                    <RefreshCw size={14} /> New Website
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-start gap-3">
                    <MapPin size={16} className="text-gray-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Location</p>
                      <p className="text-sm font-semibold text-gray-900">{result.location}</p>
                    </div>
                  </div>
                  {result.phone && (
                    <div className="flex items-start gap-3">
                      <Phone size={16} className="text-gray-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">Phone</p>
                        <p className="text-sm font-semibold text-gray-900">{result.phone}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <BarChart3 size={16} className="text-gray-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Rec. Budget</p>
                      <p className="text-sm font-semibold text-emerald-600">{formatRand(result.totalMonthlyBudget)}/mo</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <TrendingUp size={16} className="text-gray-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Est. CPC</p>
                      <p className="text-sm font-semibold text-gray-900">R{result.expectedCPC.min}–R{result.expectedCPC.max}</p>
                    </div>
                  </div>
                </div>

                {/* Detected Services */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                    Services / Products Detected ({result.servicesDetected.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {result.servicesDetected.map((svc, i) => (
                      <span key={i} className="px-3 py-1.5 rounded-full text-sm font-semibold border"
                        style={{ background: "hsl(198 69% 52% / 0.08)", color: PRIMARY, borderColor: "hsl(198 69% 52% / 0.25)" }}>
                        {svc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* KPI Preview */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {[
                  { label: "Monthly Budget", value: formatRand(result.totalMonthlyBudget), icon: DollarSign, color: "text-emerald-600" },
                  { label: "Est. Monthly Clicks", value: `${result.expectedMonthlyClicks.min}–${result.expectedMonthlyClicks.max}`, icon: MousePointerClick, color: "text-blue-600" },
                  { label: "Cost Per Click", value: `R${result.expectedCPC.min}–R${result.expectedCPC.max}`, icon: TrendingUp, color: "text-purple-600" },
                  { label: "Campaigns", value: result.campaigns.length.toString(), icon: Megaphone, color: "text-amber-600" },
                ].map((stat, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
                    <stat.icon size={18} className={cn("mx-auto mb-2", stat.color)} />
                    <p className={cn("text-xl font-black", stat.color)}>{stat.value}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Campaign Structure */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-black text-gray-900">Campaign Structure</h3>
                  {!unlocked && (
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Lock size={12} /> {lockedCampaigns} campaign{lockedCampaigns !== 1 ? "s" : ""} locked
                    </span>
                  )}
                </div>
                <div className="space-y-3">
                  {result.campaigns.map((c, i) => (
                    <CampaignCard key={i} campaign={c} index={i} unlocked={unlocked} />
                  ))}
                </div>
              </div>

              {/* Negative Keywords Preview */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <XCircle size={16} className="text-red-400" />
                    Negative Keywords
                  </h3>
                  {!unlocked && <Lock size={13} className="text-gray-300" />}
                </div>
                {unlocked ? (
                  <div className="flex flex-wrap gap-1.5">
                    {result.negativeKeywords.map((k, i) => (
                      <span key={i} className="px-2.5 py-1 text-xs bg-red-50 text-red-600 rounded-full border border-red-100 font-medium">−{k}</span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">{result.negativeKeywords.slice(0, 4).join(", ")} <span className="italic">+{result.negativeKeywords.length - 4} more in full proposal…</span></p>
                )}
              </div>

              {/* Unlock / Download CTA */}
              {!unlocked ? (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative rounded-3xl overflow-hidden border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-6 md:p-8 mb-6"
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Lock size={18} style={{ color: ACCENT }} />
                        <span className="font-bold text-sm" style={{ color: ACCENT }}>Full Proposal — R500</span>
                      </div>
                      <h3 className="text-xl font-black text-gray-900 mb-2">Unlock the Complete Google Ads Strategy</h3>
                      <ul className="space-y-1.5 text-sm text-gray-600">
                        {[
                          `All ${result.campaigns.length} campaigns with full campaign settings`,
                          `${result.campaigns.reduce((s, c) => s + c.adGroups.reduce((sum, ag) => sum + ag.keywords.length, 0), 0)}+ keywords across all ad groups`,
                          `${result.campaigns.reduce((s, c) => s + c.adGroups.length, 0) * 15} headlines + ${result.campaigns.reduce((s, c) => s + c.adGroups.length, 0) * 4} descriptions`,
                          `${result.negativeKeywords.length} negative keywords to save budget`,
                          "Downloadable HTML report (print to PDF)",
                        ].map((item, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex flex-col gap-3 shrink-0">
                      <button
                        onClick={openWhatsApp}
                        className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white text-sm bg-[#25D366] hover:bg-[#20bd5a] transition-colors"
                      >
                        <WhatsAppIcon size={18} /> Pay R500 via WhatsApp
                      </button>
                      <button
                        onClick={() => setUnlockOpen(true)}
                        className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm border border-gray-300 bg-white hover:bg-gray-50 transition-colors text-gray-700"
                      >
                        <Unlock size={15} /> Enter Unlock Code
                      </button>
                    </div>
                  </div>

                  {/* Unlock code input */}
                  <AnimatePresence>
                    {unlockOpen && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                        className="mt-6 pt-6 border-t border-amber-200">
                        <div className="flex gap-3 flex-col sm:flex-row max-w-sm">
                          <input
                            type="text"
                            value={codeInput}
                            onChange={e => { setCodeInput(e.target.value.toUpperCase()); setCodeError(""); }}
                            placeholder="Enter 8-character code"
                            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm font-mono text-gray-900 focus:outline-none focus:ring-2"
                            style={{ "--tw-ring-color": ACCENT } as React.CSSProperties}
                            onKeyDown={e => e.key === "Enter" && tryUnlock()}
                          />
                          <button onClick={tryUnlock} className="px-5 py-3 rounded-xl font-bold text-white text-sm transition-colors"
                            style={{ background: ACCENT }}>
                            Unlock
                          </button>
                        </div>
                        {codeError && <p className="text-red-600 text-xs mt-2">{codeError}</p>}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl bg-emerald-50 border border-emerald-200 p-5 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                      <Unlock size={18} className="text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-bold text-emerald-800">Full Proposal Unlocked</p>
                      <p className="text-xs text-emerald-600">All campaigns, keywords and ad copy are now visible below</p>
                    </div>
                  </div>
                  <button
                    onClick={() => downloadProposal(result)}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-white text-sm bg-emerald-600 hover:bg-emerald-700 transition-colors shrink-0"
                  >
                    <Download size={15} /> Download Proposal
                  </button>
                </motion.div>
              )}

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
