import { motion } from "framer-motion";
import {
  MousePointerClick, CheckCircle2, ArrowRight, TrendingUp, Target,
  BarChart3, Zap, Clock, Award, ChevronDown, ChevronUp, Star,
  DollarSign, RefreshCw, Shield, Eye, Layers, Phone
} from "lucide-react";
import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppModal } from "@/components/WhatsAppModal";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};
const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
};

const ACCENT = "hsl(29 100% 65%)";
const ACCENT_BG = "hsl(29 100% 65% / 0.08)";
const ACCENT_BORDER = "hsl(29 100% 65% / 0.25)";

const PROCESS = [
  { step: "01", title: "Account Audit & Strategy", desc: "We audit your current account (or start fresh), analyse competitors, and build a strategy around your specific goals and budget.", icon: Eye },
  { step: "02", title: "Keyword & Audience Research", desc: "We identify the highest-converting search terms and build negative keyword lists to eliminate wasted spend from day one.", icon: Target },
  { step: "03", title: "Campaign & Ad Creation", desc: "We craft compelling ad copy with strong CTAs, structured ad groups, and landing page recommendations to maximise quality scores.", icon: Layers },
  { step: "04", title: "Conversion Tracking Setup", desc: "We install precise conversion tracking — phone calls, form fills, purchases — so you know exactly what your spend is generating.", icon: Phone },
  { step: "05", title: "Ongoing Optimisation", desc: "Bid adjustments, A/B ad testing, search term pruning, and Quality Score improvements — done weekly, not monthly.", icon: RefreshCw },
  { step: "06", title: "Transparent Reporting", desc: "Monthly reports showing impressions, clicks, cost-per-lead, conversions, and ROAS — explained in plain language.", icon: BarChart3 },
];

const CAMPAIGN_TYPES = [
  { icon: MousePointerClick, title: "Search Ads", desc: "Text ads that appear at the top of Google search results when people search for your services. The highest-intent traffic available online.", tag: "Best for: Leads & Conversions" },
  { icon: Eye, title: "Display Advertising", desc: "Visual banner ads shown across 2 million+ websites and apps in Google's Display Network to build brand awareness and reach.", tag: "Best for: Brand Awareness" },
  { icon: RefreshCw, title: "Remarketing Campaigns", desc: "Re-engage visitors who've already been to your website. These 'warm' audiences convert at dramatically higher rates.", tag: "Best for: Re-engagement" },
  { icon: Layers, title: "Performance Max", desc: "Google's AI-powered campaign type that runs across Search, Display, YouTube, Gmail, and Maps from a single campaign.", tag: "Best for: Scale" },
];

const INCLUDED = [
  { icon: Target, title: "Keyword Research & Match Types", desc: "Exact, phrase, and broad match strategy plus negative keyword lists to control spend." },
  { icon: Layers, title: "Ad Copy & Extensions", desc: "Multiple ad variations, sitelinks, callouts, structured snippets, and call extensions." },
  { icon: Phone, title: "Conversion Tracking", desc: "Call tracking, form submissions, purchases — every conversion attributed to the right campaign." },
  { icon: DollarSign, title: "Bid Management", desc: "Manual CPC or Smart Bidding strategies adjusted weekly based on performance data." },
  { icon: RefreshCw, title: "A/B Ad Testing", desc: "Continuous testing of headlines, descriptions, and landing pages to improve CTR and CVR." },
  { icon: Shield, title: "Fraud & Competitor Click Protection", desc: "Click fraud monitoring to protect your budget from invalid clicks and competitor abuse." },
  { icon: Eye, title: "Audience Targeting", desc: "In-market audiences, custom segments, and demographic targeting overlays." },
  { icon: BarChart3, title: "Monthly Reports", desc: "Clear dashboards showing spend, leads, cost-per-lead, and ROAS every month." },
];

const FAQS = [
  { q: "How much budget do I need for Google Ads to work?", a: "In South Africa, we recommend a minimum ad spend of R3,000–R5,000/month to gather meaningful data and generate consistent leads. Highly competitive industries (insurance, legal, medical) may require R10,000+/month to compete effectively. We'll advise the right budget for your market during your free consultation." },
  { q: "How quickly will I see results from Google Ads?", a: "Unlike SEO, Google Ads can generate leads within 24–48 hours of launch. However, the first 30 days are a learning phase where we gather conversion data and optimise bids. Most campaigns reach optimal performance by month 2–3." },
  { q: "What is your management fee on top of ad spend?", a: "Our Google Ads management is R7,300/month, separate from your advertising budget. This covers campaign setup, ongoing optimisation, A/B testing, conversion tracking, and monthly reporting. Ad spend goes directly to Google — we never take a margin on your budget." },
  { q: "Can I pause or cancel at any time?", a: "Yes. We work on monthly agreements with 30 days' notice. We recommend a minimum 3-month commitment to see meaningful results, but we don't lock you into long-term contracts." },
  { q: "Will you manage my existing Google Ads account?", a: "Absolutely. We conduct a full audit of your existing account, identify wasted spend and opportunities, and take over management. Many clients come to us after burning through budget with minimal results — we typically cut cost-per-lead significantly within the first 60 days." },
  { q: "Do you manage Google Ads for e-commerce stores?", a: "Yes — we run Shopping campaigns and Performance Max campaigns for e-commerce clients, including full Google Merchant Center setup, product feed optimisation, and ROAS-focused bidding strategies." },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden cursor-pointer bg-white shadow-sm" onClick={() => setOpen(!open)}>
      <div className="flex items-center justify-between px-6 py-5 hover:bg-gray-50 transition-colors">
        <span className="font-semibold text-gray-900 pr-4">{q}</span>
        {open
          ? <ChevronUp className="shrink-0" size={20} style={{ color: ACCENT }} />
          : <ChevronDown className="shrink-0 text-gray-400" size={20} />}
      </div>
      {open && (
        <div className="px-6 py-5 text-gray-500 leading-relaxed border-t border-gray-100 bg-gray-50">
          {a}
        </div>
      )}
    </div>
  );
}

export default function GoogleAdsPage() {
  const openWhatsApp = () => {
    window.open("https://wa.me/27832555270?text=Hi%20Fortune%20Design%2C%20I%27m%20interested%20in%20Google%20Ads%20management.%20Can%20we%20chat%3F", "_blank");
  };

  return (
    <div className="min-h-screen bg-white text-foreground">
      <Navbar />
      <WhatsAppModal />

      {/* HERO */}
      <section className="relative pt-36 pb-24 md:pt-52 md:pb-36 overflow-hidden bg-gradient-to-br from-orange-50 via-white to-amber-50">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1432888622747-4eb9a8efbe07?auto=format&fit=crop&w=1600&q=80"
            alt="Google Ads campaign management"
            className="w-full h-full object-cover opacity-10 mix-blend-multiply"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-orange-50/50 via-white/60 to-white" />
        </div>
        <div className="absolute top-24 right-16 w-72 h-72 rounded-full blur-3xl pointer-events-none" style={{ background: `${ACCENT_BG}` }} />
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm mb-8"
              style={{ border: `1px solid ${ACCENT_BORDER}` }}
            >
              <MousePointerClick size={14} style={{ color: ACCENT }} />
              <span className="text-sm font-semibold uppercase tracking-wide" style={{ color: ACCENT }}>Google Ads Management</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-[1.1] text-gray-900"
            >
              Instant Leads.<br />
              <span style={{ color: ACCENT }}>Maximum ROI.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-gray-500 max-w-2xl mb-10 leading-relaxed"
            >
              We build and manage Google Ads campaigns that put your business in front of customers actively searching for what you offer — right now, not in 6 months.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <button
                onClick={openWhatsApp}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-lg hover:-translate-y-1 transition-all duration-300 shadow-lg text-white"
                style={{ background: ACCENT, boxShadow: `0 10px 30px ${ACCENT_BG}` }}
              >
                Get a Free Ads Audit <ArrowRight size={20} />
              </button>
              <a
                href={`${import.meta.env.BASE_URL}audit`}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-gray-700 font-bold text-lg border border-gray-200 hover:border-primary hover:text-primary hover:-translate-y-1 transition-all duration-300 shadow-sm"
              >
                Free Website Audit
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CLIENT LOGOS BANNER */}
      <section className="py-10 bg-gray-900 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Trusted by businesses across South Africa &amp; beyond</p>
        </div>
        <div className="relative overflow-hidden">
          <div className="flex marquee-track w-max">
            {[
              `${import.meta.env.BASE_URL}images/clients/output-onlinepngtools-14.png`,
              `${import.meta.env.BASE_URL}images/clients/output-onlinepngtools-10.png`,
              `${import.meta.env.BASE_URL}images/clients/output-onlinepngtools-6.png`,
              `${import.meta.env.BASE_URL}images/clients/output-onlinepngtools-8.png`,
              `${import.meta.env.BASE_URL}images/clients/output-onlinepngtools-18.png`,
              `${import.meta.env.BASE_URL}images/clients/output-onlinepngtools-13.png`,
              `${import.meta.env.BASE_URL}images/clients/client-4.png`,
              `${import.meta.env.BASE_URL}images/clients/client-8.png`,
              `${import.meta.env.BASE_URL}images/clients/output-onlinepngtools-15.png`,
              `${import.meta.env.BASE_URL}images/clients/output-onlinepngtools-17.png`,
              `${import.meta.env.BASE_URL}images/clients/output-onlinepngtools-11.png`,
              `${import.meta.env.BASE_URL}images/clients/output-onlinepngtools-5.png`,
              `${import.meta.env.BASE_URL}images/clients/output-onlinepngtools-14.png`,
              `${import.meta.env.BASE_URL}images/clients/output-onlinepngtools-10.png`,
              `${import.meta.env.BASE_URL}images/clients/output-onlinepngtools-6.png`,
              `${import.meta.env.BASE_URL}images/clients/output-onlinepngtools-8.png`,
              `${import.meta.env.BASE_URL}images/clients/output-onlinepngtools-18.png`,
              `${import.meta.env.BASE_URL}images/clients/output-onlinepngtools-13.png`,
              `${import.meta.env.BASE_URL}images/clients/client-4.png`,
              `${import.meta.env.BASE_URL}images/clients/client-8.png`,
              `${import.meta.env.BASE_URL}images/clients/output-onlinepngtools-15.png`,
              `${import.meta.env.BASE_URL}images/clients/output-onlinepngtools-17.png`,
              `${import.meta.env.BASE_URL}images/clients/output-onlinepngtools-11.png`,
              `${import.meta.env.BASE_URL}images/clients/output-onlinepngtools-5.png`,
            ].map((src, i) => (
              <div key={i} className="flex items-center justify-center mx-8 shrink-0">
                <img
                  src={src}
                  alt="Client logo"
                  className="h-12 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RESULTS STRIP */}
      <section className="py-12 border-y border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-gray-100">
            {[
              { metric: "R500K+", label: "Ad spend managed across all clients" },
              { metric: "3.8x", label: "Average return on ad spend (ROAS)" },
              { metric: "62%", label: "Average reduction in cost-per-lead" },
              { metric: "48hrs", label: "Average time to first qualified lead" },
            ].map((r, i) => (
              <motion.div key={i} variants={fadeInUp} className="text-center px-4">
                <div className="text-3xl md:text-4xl font-black mb-1" style={{ color: ACCENT }}>{r.metric}</div>
                <div className="text-sm text-gray-500">{r.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* WHY GOOGLE ADS */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <h2 className="text-4xl md:text-5xl font-black mb-6 text-gray-900">
                Why Google Ads Is the<br />
                <span style={{ color: ACCENT }}>Fastest Way to Grow</span>
              </h2>
              <p className="text-gray-500 text-lg mb-6 leading-relaxed">
                Google processes <strong className="text-gray-900">8.5 billion searches per day</strong>. When someone in South Africa searches for exactly what you sell, Google Ads puts your business at the very top — above all organic results.
              </p>
              <p className="text-gray-500 text-lg mb-8 leading-relaxed">
                While SEO takes months to build momentum, Google Ads can deliver qualified leads within <strong className="text-gray-900">24 hours of launch</strong>. Used together, they create an unstoppable search presence.
              </p>
              <div className="space-y-4">
                {[
                  "Appear at the top of Google instantly — not in 6 months",
                  "Only pay when someone clicks on your ad (PPC model)",
                  "Target by location, device, time of day, and audience",
                  "Full control over budget — scale up or down any time",
                  "Real-time data on every rand spent and every lead generated",
                ].map((point, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 size={20} className="shrink-0 mt-0.5" style={{ color: ACCENT }} />
                    <span className="text-gray-700">{point}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-xl">
                <img src="https://images.unsplash.com/photo-1611926653458-09294b3142bf?auto=format&fit=crop&w=900&q=85" alt="Google Ads performance dashboard" className="w-full h-72 md:h-96 object-cover" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-5 shadow-xl border border-gray-200">
                <div className="flex items-center gap-3 mb-1">
                  <TrendingUp size={22} style={{ color: ACCENT }} />
                  <span className="font-bold text-gray-900">ROAS This Month</span>
                </div>
                <div className="text-3xl font-black" style={{ color: ACCENT }}>4.2x</div>
                <div className="text-sm text-gray-500">R4.20 earned per R1 spent</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* OUR PROCESS */}
      <section className="py-24 bg-orange-50/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-gray-900">Our <span style={{ color: ACCENT }}>6-Step Campaign Process</span></h2>
            <p className="text-lg text-gray-500">We don't guess. Every step is data-driven and designed to maximise your return from day one.</p>
          </div>

          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROCESS.map((step, i) => (
              <motion.div key={i} variants={fadeInUp}
                className="bg-white rounded-2xl p-7 relative overflow-hidden group border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
                style={{ ["--hover-border" as string]: ACCENT_BORDER }}
              >
                <div className="absolute top-4 right-6 text-6xl font-black text-gray-100 select-none">{step.step}</div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ background: ACCENT_BG, border: `1px solid ${ACCENT_BORDER}` }}>
                  <step.icon size={22} style={{ color: ACCENT }} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-500 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CAMPAIGN TYPES */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-gray-900">Campaign Types <span style={{ color: ACCENT }}>We Manage</span></h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">We match the right campaign type to your goals — never a one-size-fits-all approach.</p>
          </div>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CAMPAIGN_TYPES.map((ct, i) => (
              <motion.div key={i} variants={fadeInUp} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ background: ACCENT_BG, border: `1px solid ${ACCENT_BORDER}` }}>
                  <ct.icon size={22} style={{ color: ACCENT }} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{ct.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed flex-1 mb-5">{ct.desc}</p>
                <div className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: ACCENT_BG, color: ACCENT, border: `1px solid ${ACCENT_BORDER}` }}>
                  {ct.tag}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* WHAT'S INCLUDED */}
      <section className="py-24 bg-orange-50/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="text-4xl md:text-5xl font-black mb-6 text-gray-900">
                Everything We Handle<br />
                <span style={{ color: ACCENT }}>So You Don't Have To</span>
              </h2>
              <p className="text-gray-500 text-lg mb-10 leading-relaxed">
                Managing Google Ads is a full-time job. Keyword bidding, ad testing, Quality Score optimisation, fraud protection — we handle all of it so you can focus on running your business.
              </p>
              <div className="relative rounded-3xl overflow-hidden shadow-lg">
                <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=85" alt="Marketing analytics dashboard" className="w-full h-64 object-cover" />
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-gray-900/80 to-transparent">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md" style={{ background: "rgba(255,188,125,0.2)", border: "1px solid rgba(255,188,125,0.4)" }}>
                    <DollarSign size={14} className="text-white" />
                    <span className="text-sm font-semibold text-white">Zero Hidden Fees — 100% Budget Transparency</span>
                  </div>
                </div>
              </div>
            </div>

            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid sm:grid-cols-2 gap-5">
              {INCLUDED.map((d, i) => (
                <motion.div key={i} variants={fadeInUp} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ background: ACCENT_BG }}>
                    <d.icon size={18} style={{ color: ACCENT }} />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">{d.title}</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">{d.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* BEFORE / AFTER */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-gray-900">What Happens When <span style={{ color: ACCENT }}>Experts Manage Your Ads</span></h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">Most businesses waste 40–60% of their Google Ads budget. Here's the difference Fortune Design makes.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="bg-white border border-red-200 rounded-2xl p-8 shadow-sm">
              <div className="text-red-500 font-bold text-sm uppercase tracking-widest mb-6">Without Fortune Design</div>
              <div className="space-y-4">
                {[
                  "Budget wasted on irrelevant clicks from broad keywords",
                  "No conversion tracking — you don't know what's working",
                  "Generic ad copy with low click-through rates",
                  "No negative keywords — paying for competitor searches",
                  "Set and forget — campaigns never optimised",
                  "High cost-per-lead with poor quality prospects",
                ].map((point, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="shrink-0 mt-0.5 text-red-500 font-bold">✕</span>
                    <span className="text-gray-500">{point}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl p-8 shadow-sm border"
              style={{ borderColor: ACCENT_BORDER }}>
              <div className="font-bold text-sm uppercase tracking-widest mb-6" style={{ color: ACCENT }}>With Fortune Design</div>
              <div className="space-y-4">
                {[
                  "Precise keyword match types that attract only ready-to-buy searchers",
                  "Full conversion tracking — every lead, call, and sale measured",
                  "High-impact ad copy tested weekly for maximum CTR",
                  "800+ negative keywords blocking irrelevant traffic",
                  "Weekly bid optimisation and continuous improvement",
                  "Lower cost-per-lead with higher quality prospects",
                ].map((point, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="shrink-0 mt-0.5" style={{ color: ACCENT }} />
                    <span className="text-gray-700">{point}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="py-24 bg-orange-50/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-gray-900">Client <span style={{ color: ACCENT }}>Results</span></h2>
            <p className="text-gray-500 text-lg">What South African businesses say about working with us.</p>
          </div>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid md:grid-cols-3 gap-6">
            {[
              { text: "Fortune Design ran our Google Ads campaign and the ROI was exceptional. From the very first month we started receiving high-quality leads. They handled everything professionally and the reporting was always clear and transparent. Highly recommend.", author: "Jashmir Jungbahadur", role: "JJS Leather", stars: 5 },
              { text: "We were burning through budget on Google Ads with very little to show for it before Fortune Design stepped in. They restructured everything, set up proper conversion tracking, and within 60 days our cost-per-lead dropped by more than half. Outstanding results.", author: "Alltech Rental L.L.C", role: "Equipment Rental", stars: 5 },
              { text: "Fortune Design has provided outstanding service. Our Google ranking skyrocketed from virtually nowhere to one of the top positions, and we began receiving significantly more inquiries almost immediately. Their team identified numerous gaps and errors that our previous SEO provider had missed. We highly recommend Fortune Design for anyone seeking expert Google optimization.", author: "Serenity Villa Daniela", role: "Luxury Villa Rentals", stars: 5 },
            ].map((review, i) => (
              <motion.div key={i} variants={fadeInUp} className="bg-white border border-gray-200 rounded-2xl p-7 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: review.stars }).map((_, j) => <Star key={j} size={16} className="text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-gray-600 leading-relaxed mb-6 italic">"{review.text}"</p>
                <div className="border-t border-gray-100 pt-5">
                  <div className="font-bold text-gray-900">{review.author}</div>
                  <div className="text-sm text-gray-400">{review.role}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-gray-900">Your First <span style={{ color: ACCENT }}>90 Days</span> With Us</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">Here's exactly what happens from the moment you sign up to when your campaigns are fully optimised.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { period: "Week 1–2", title: "Setup & Launch", points: ["Full audit of your current account (or fresh setup)", "Keyword research and negative keyword list built", "Ad copy written and approved by you", "Conversion tracking installed and tested", "Campaigns live within 10 business days"] },
              { period: "Month 2", title: "Data & Optimisation", points: ["Analysis of search term reports — cutting waste", "First A/B ad test results — best performer retained", "Bid adjustments based on conversion data", "Quality Score improvements through landing page tweaks", "Cost-per-lead trending downward"] },
              { period: "Month 3+", title: "Scale & Profit", points: ["Campaigns at optimal efficiency", "Budget scaling to capitalise on top-performing keywords", "Remarketing campaigns added for warm audiences", "Monthly performance review and strategy session", "Consistent, predictable lead volume"] },
            ].map((phase, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.15 }}
                className="bg-white border border-gray-200 rounded-2xl p-7 shadow-sm">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5" style={{ background: ACCENT_BG, border: `1px solid ${ACCENT_BORDER}` }}>
                  <Clock size={12} style={{ color: ACCENT }} />
                  <span className="text-xs font-bold" style={{ color: ACCENT }}>{phase.period}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-5">{phase.title}</h3>
                <div className="space-y-3">
                  {phase.points.map((pt, j) => (
                    <div key={j} className="flex items-start gap-2.5">
                      <CheckCircle2 size={16} className="shrink-0 mt-0.5" style={{ color: ACCENT }} />
                      <span className="text-sm text-gray-500">{pt}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-gray-900">Google Ads <span style={{ color: ACCENT }}>Management Pricing</span></h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">One flat monthly fee. No percentage of ad spend. No surprises.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 lg:grid-cols-5 gap-0 rounded-3xl overflow-hidden shadow-2xl border border-gray-100"
          >
            {/* Price panel */}
            <div className="lg:col-span-2 p-10 flex flex-col justify-center" style={{ background: ACCENT }}>
              <p className="text-white/80 text-sm font-bold uppercase tracking-widest mb-4">Google Ads Management</p>
              <div className="flex items-baseline gap-1 text-white mb-2">
                <span className="text-3xl font-semibold">R</span>
                <span className="text-7xl font-black leading-none">7,300</span>
              </div>
              <p className="text-white/70 text-base font-medium mb-10">per month <span className="text-white/50">+ your ad spend</span></p>
              <button
                onClick={openWhatsApp}
                className="w-full py-4 rounded-xl bg-white font-bold text-base transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                style={{ color: ACCENT }}
              >
                Get Started Today
              </button>
              <p className="text-white/60 text-xs text-center mt-4">No long-term lock-in. 30-day notice to cancel.</p>
            </div>

            {/* Features panel */}
            <div className="lg:col-span-3 bg-white p-10">
              <p className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">Everything included in your management fee</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                {[
                  "Full Campaign Setup & Structure",
                  "Keyword Research & Match Types",
                  "Compelling Ad Copy & A/B Testing",
                  "Conversion Tracking Setup",
                  "Negative Keyword Management",
                  "Bid Strategy & Budget Optimisation",
                  "Audience & Remarketing Campaigns",
                  "Landing Page Recommendations",
                  "Search Term Report Analysis",
                  "Google Analytics Integration",
                  "Monthly Performance Reports",
                  "Dedicated Account Manager",
                ].map((f, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0" style={{ color: ACCENT }} />
                    <span className="text-sm text-gray-700 leading-relaxed">{f}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 pt-8 border-t border-gray-100 flex flex-wrap gap-6">
                {[
                  { icon: Shield, label: "Ad spend goes directly to Google" },
                  { icon: RefreshCw, label: "Monthly optimisation cycles" },
                  { icon: BarChart3, label: "Transparent reporting every month" },
                ].map(({ icon: Icon, label }, i) => (
                  <div key={i} className="flex items-center gap-2 text-gray-500 text-xs font-medium">
                    <Icon size={14} style={{ color: ACCENT }} />
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
            className="text-center text-sm text-gray-400 mt-8"
          >
            Have questions about budget or fit? <button onClick={openWhatsApp} className="font-semibold hover:underline" style={{ color: ACCENT }}>Chat with us on WhatsApp — no hard sell.</button>
          </motion.p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-orange-50/40">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-gray-900">Google Ads <span style={{ color: ACCENT }}>FAQ</span></h2>
            <p className="text-gray-500 text-lg">Straight answers to the most common questions.</p>
          </div>
          <div className="space-y-4">
            {FAQS.map((faq, i) => <FAQItem key={i} q={faq.q} a={faq.a} />)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-amber-50">
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: ACCENT_BG }} />
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm mb-8" style={{ border: `1px solid ${ACCENT_BORDER}` }}>
              <Award size={14} style={{ color: ACCENT }} />
              <span className="text-sm font-semibold" style={{ color: ACCENT }}>Free Account Audit — No Commitment</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black mb-6 text-gray-900">
              Stop Wasting Budget.<br />
              <span style={{ color: ACCENT }}>Start Generating Leads.</span>
            </h2>
            <p className="text-xl text-gray-500 mb-10 leading-relaxed">
              Get a free audit of your Google Ads account — we'll show you exactly where your budget is being wasted and how we'd fix it.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={openWhatsApp}
                className="inline-flex items-center justify-center gap-2 px-10 py-5 rounded-xl font-bold text-xl hover:-translate-y-1 transition-all duration-300 text-white shadow-xl"
                style={{ background: ACCENT, boxShadow: `0 20px 40px ${ACCENT_BG}` }}
              >
                Get My Free Ads Audit <ArrowRight size={22} />
              </button>
              <a
                href={`${import.meta.env.BASE_URL}audit`}
                className="inline-flex items-center justify-center gap-2 px-10 py-5 rounded-xl bg-white text-gray-700 font-bold text-xl border border-gray-200 hover:border-primary hover:text-primary hover:-translate-y-1 transition-all duration-300 shadow-sm"
              >
                Free Website Audit
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
