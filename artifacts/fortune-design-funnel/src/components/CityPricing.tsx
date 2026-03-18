import { motion } from "framer-motion";
import { CheckCircle2, MousePointerClick, Search, Zap, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const WA   = "27760597724";

function goCheckout(type: string) {
  window.location.href = `${window.location.origin}${BASE}/checkout?type=${type}`;
}

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.09 } } };

interface Props {
  city: string;
  accent: "teal" | "purple" | "emerald" | "indigo" | "cyan";
}

const SEO_PLANS = [
  {
    name: "Basic SEO",
    price: "5,900",
    type: "seo-basic",
    badge: null,
    features: [
      "Local SEO (Rank Locally)",
      "Keyword Research",
      "Analytics Setup & Config",
      "Technical SEO (Robots, Sitemap)",
      "Title & Meta Tag Creation",
      "Content Editing & Optimisation",
      "Monthly Custom Report",
    ],
  },
  {
    name: "Advanced SEO",
    price: "7,900",
    type: "seo-advanced",
    badge: "Most Popular",
    features: [
      "Competitive / Nationwide Keywords",
      "Ecommerce Lead Generation",
      "Local SEO",
      "Keyword Research",
      "Analytics Setup & Config",
      "Technical SEO",
      "Title & Meta Tag Creation",
      "Content Editing & Optimisation",
      "Monthly Custom Report",
      "Offsite Link Building",
    ],
  },
  {
    name: "Premium SEO",
    price: "11,900",
    type: "seo-premium",
    badge: "Best Results",
    features: [
      "Competitive / Nationwide Keywords",
      "Backlink Manager",
      "DA 90+ Backlinks",
      "Ecommerce Lead Generation",
      "Local SEO",
      "Keyword Research & Optimisation",
      "Backlink Indexing",
      "Analytics Setup & Config",
      "Technical SEO",
      "Title & Meta Tag Creation",
      "Content Editing & Optimisation",
      "Monthly Custom Report",
      "Offsite Link Building",
      "Press Release",
    ],
  },
];

const ACCENT: Record<Props["accent"], {
  badge: string; ring: string; btn: string; icon: string; bg: string; border: string; tagBg: string; tagText: string;
}> = {
  teal:    { badge: "bg-teal-500",    ring: "ring-teal-400",    btn: "bg-teal-600 hover:bg-teal-500",    icon: "text-teal-500",    bg: "bg-teal-50",    border: "border-teal-200",    tagBg: "bg-teal-100",    tagText: "text-teal-700" },
  purple:  { badge: "bg-purple-500",  ring: "ring-purple-400",  btn: "bg-purple-600 hover:bg-purple-500", icon: "text-purple-500",  bg: "bg-purple-50",  border: "border-purple-200",  tagBg: "bg-purple-100",  tagText: "text-purple-700" },
  emerald: { badge: "bg-emerald-500", ring: "ring-emerald-400", btn: "bg-emerald-600 hover:bg-emerald-500",icon: "text-emerald-500",bg: "bg-emerald-50", border: "border-emerald-200", tagBg: "bg-emerald-100", tagText: "text-emerald-700" },
  indigo:  { badge: "bg-indigo-500",  ring: "ring-indigo-400",  btn: "bg-indigo-600 hover:bg-indigo-500", icon: "text-indigo-500",  bg: "bg-indigo-50",  border: "border-indigo-200",  tagBg: "bg-indigo-100",  tagText: "text-indigo-700" },
  cyan:    { badge: "bg-cyan-500",    ring: "ring-cyan-400",    btn: "bg-cyan-600 hover:bg-cyan-500",    icon: "text-cyan-500",    bg: "bg-cyan-50",    border: "border-cyan-200",    tagBg: "bg-cyan-100",    tagText: "text-cyan-700" },
};

export function CityPricing({ city, accent }: Props) {
  const a = ACCENT[accent];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Heading */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-14">
          <motion.div variants={fadeUp} className={cn("inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-4", a.tagBg, a.tagText)}>
            <Search size={13} /> {city} Packages
          </motion.div>
          <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
            Transparent Pricing for {city} Businesses
          </motion.h2>
          <motion.p variants={fadeUp} className="text-gray-500 max-w-xl mx-auto">
            Fixed monthly fees — no hidden costs, no percentage of ad spend. Cancel any time.
          </motion.p>
        </motion.div>

        {/* SEO Plans */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid md:grid-cols-3 gap-6 mb-10">
          {SEO_PLANS.map((plan) => (
            <motion.div
              key={plan.name}
              variants={fadeUp}
              className={cn(
                "relative bg-white rounded-2xl border p-6 flex flex-col",
                plan.badge === "Most Popular"
                  ? cn("ring-2 shadow-lg", a.ring, a.border)
                  : "border-gray-200 shadow-sm"
              )}
            >
              {plan.badge && (
                <span className={cn("absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white whitespace-nowrap", a.badge)}>
                  {plan.badge}
                </span>
              )}
              <div className="mb-4">
                <div className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-3", a.tagBg, a.tagText)}>
                  <Search size={11} /> SEO
                </div>
                <h3 className="text-xl font-black text-gray-900">{plan.name}</h3>
                <div className="flex items-end gap-1 mt-2">
                  <span className="text-3xl font-black text-gray-900">R{plan.price}</span>
                  <span className="text-gray-400 text-sm mb-1">/month</span>
                </div>
              </div>
              <ul className="space-y-2 mb-6 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle2 size={14} className={cn("shrink-0 mt-0.5", a.icon)} />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => goCheckout(plan.type)}
                className={cn(
                  "w-full py-3 rounded-xl font-bold text-white text-sm transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-center gap-2",
                  a.btn
                )}
              >
                Get Started – R{plan.price}/mo <ArrowRight size={14} />
              </button>
            </motion.div>
          ))}
        </motion.div>

        {/* Google Ads + Market Leader row */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid md:grid-cols-2 gap-6">

          {/* Google Ads */}
          <motion.div variants={fadeUp} className="bg-slate-900 rounded-2xl p-6 flex flex-col text-white">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 mb-4 w-fit">
              <MousePointerClick size={11} /> Google Ads Management
            </div>
            <h3 className="text-xl font-black mb-1">Google Ads {city}</h3>
            <div className="flex items-end gap-1 mb-3">
              <span className="text-3xl font-black">R7,300</span>
              <span className="text-white/50 text-sm mb-1">/month</span>
            </div>
            <p className="text-white/60 text-xs mb-4">Flat management fee — no % of your ad spend</p>
            <ul className="space-y-2 mb-6 flex-1">
              {[
                "Campaign Setup & Strategy",
                "Keyword Research & Targeting",
                "Ad Copywriting",
                "Bid Optimisation",
                "Conversion Tracking Setup",
                "Monthly Performance Report",
                "Negative Keyword Management",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-white/80">
                  <CheckCircle2 size={14} className="shrink-0 mt-0.5 text-purple-400" />
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => goCheckout("google-ads")}
              className="w-full py-3 rounded-xl font-bold text-white text-sm bg-purple-600 hover:bg-purple-500 transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              Get Started – R7,300/mo <ArrowRight size={14} />
            </button>
          </motion.div>

          {/* Market Leader Bundle */}
          <motion.div variants={fadeUp} className="rounded-2xl p-6 flex flex-col text-white" style={{ background: "linear-gradient(135deg, #0ea5c8 0%, #7c4dff 100%)" }}>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white mb-4 w-fit">
              <Zap size={11} /> Best Value Bundle
            </div>
            <h3 className="text-xl font-black mb-1">Market Leader Bundle</h3>
            <p className="text-white/70 text-xs mb-2">SEO + Google Ads — dominate both organic & paid search</p>
            <div className="flex items-end gap-1 mb-1">
              <span className="text-3xl font-black">R12,500</span>
              <span className="text-white/60 text-sm mb-1">/month</span>
            </div>
            <p className="text-white/50 text-xs mb-4">Save R2,700/mo vs buying separately</p>
            <ul className="space-y-2 mb-6 flex-1">
              {[
                "Everything in Advanced SEO",
                "Full Google Ads Management",
                "Unified Keyword Strategy",
                "Combined Monthly Reporting",
                "Priority Support",
                "Competitor Domination Strategy",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-white/90">
                  <CheckCircle2 size={14} className="shrink-0 mt-0.5 text-white" />
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => goCheckout("market-leader")}
              className="w-full py-3 rounded-xl font-bold text-sm bg-white text-gray-900 hover:bg-white/90 transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              Get Started – R12,500/mo <ArrowRight size={14} />
            </button>
          </motion.div>
        </motion.div>

        {/* Trust strip */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-10 text-center">
          <p className="text-gray-400 text-sm">
            Not sure which package is right for {city}?&nbsp;
            <button
              onClick={() => window.open(`https://wa.me/${WA}?text=${encodeURIComponent(`Hi Indexify! I'm a ${city} business looking for help choosing the right SEO or Google Ads package.`)}`, "_blank")}
              className="font-semibold text-gray-600 hover:text-gray-900 underline underline-offset-2 transition-colors"
            >
              Chat with us on WhatsApp
            </button>
            &nbsp;— we'll recommend the best fit.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
