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

const PROCESS = [
  {
    step: "01",
    title: "Account Audit & Strategy",
    desc: "We audit your current account (or start fresh), analyse competitors, and build a strategy around your specific goals and budget.",
    icon: Eye,
  },
  {
    step: "02",
    title: "Keyword & Audience Research",
    desc: "We identify the highest-converting search terms and build negative keyword lists to eliminate wasted spend from day one.",
    icon: Target,
  },
  {
    step: "03",
    title: "Campaign & Ad Creation",
    desc: "We craft compelling ad copy with strong CTAs, structured ad groups, and landing page recommendations to maximise quality scores.",
    icon: Layers,
  },
  {
    step: "04",
    title: "Conversion Tracking Setup",
    desc: "We install precise conversion tracking — phone calls, form fills, purchases — so you know exactly what your spend is generating.",
    icon: Phone,
  },
  {
    step: "05",
    title: "Ongoing Optimisation",
    desc: "Bid adjustments, A/B ad testing, search term pruning, and Quality Score improvements — done weekly, not monthly.",
    icon: RefreshCw,
  },
  {
    step: "06",
    title: "Transparent Reporting",
    desc: "Monthly reports showing impressions, clicks, cost-per-lead, conversions, and ROAS — explained in plain language.",
    icon: BarChart3,
  },
];

const CAMPAIGN_TYPES = [
  {
    icon: MousePointerClick,
    title: "Search Ads",
    desc: "Text ads that appear at the top of Google search results when people search for your services. The highest-intent traffic available online.",
    tag: "Best for: Leads & Conversions",
  },
  {
    icon: Eye,
    title: "Display Advertising",
    desc: "Visual banner ads shown across 2 million+ websites and apps in Google's Display Network to build brand awareness and reach.",
    tag: "Best for: Brand Awareness",
  },
  {
    icon: RefreshCw,
    title: "Remarketing Campaigns",
    desc: "Re-engage visitors who've already been to your website. These 'warm' audiences convert at dramatically higher rates.",
    tag: "Best for: Re-engagement",
  },
  {
    icon: Layers,
    title: "Performance Max",
    desc: "Google's AI-powered campaign type that runs across Search, Display, YouTube, Gmail, and Maps from a single campaign.",
    tag: "Best for: Scale",
  },
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
  {
    q: "How much budget do I need for Google Ads to work?",
    a: "In South Africa, we recommend a minimum ad spend of R3,000–R5,000/month to gather meaningful data and generate consistent leads. Highly competitive industries (insurance, legal, medical) may require R10,000+/month to compete effectively. We'll advise the right budget for your market during your free consultation."
  },
  {
    q: "How quickly will I see results from Google Ads?",
    a: "Unlike SEO, Google Ads can generate leads within 24–48 hours of launch. However, the first 30 days are a learning phase where we gather conversion data and optimise bids. Most campaigns reach optimal performance by month 2–3."
  },
  {
    q: "What is your management fee on top of ad spend?",
    a: "Our Google Ads management starts from R2,500/month, separate from your advertising budget. This covers campaign setup, ongoing optimisation, A/B testing, and monthly reporting. Ad spend goes directly to Google — we never take a margin on your budget."
  },
  {
    q: "Can I pause or cancel at any time?",
    a: "Yes. We work on monthly agreements with 30 days' notice. We recommend a minimum 3-month commitment to see meaningful results, but we don't lock you into long-term contracts."
  },
  {
    q: "Will you manage my existing Google Ads account?",
    a: "Absolutely. We conduct a full audit of your existing account, identify wasted spend and opportunities, and take over management. Many clients come to us after burning through budget with minimal results — we typically cut cost-per-lead significantly within the first 60 days."
  },
  {
    q: "Do you manage Google Ads for e-commerce stores?",
    a: "Yes — we run Shopping campaigns and Performance Max campaigns for e-commerce clients, including full Google Merchant Center setup, product feed optimisation, and ROAS-focused bidding strategies."
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border border-white/10 rounded-2xl overflow-hidden cursor-pointer"
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-center justify-between px-6 py-5 bg-white/[0.03] hover:bg-white/[0.06] transition-colors">
        <span className="font-semibold text-zinc-100 pr-4">{q}</span>
        {open ? <ChevronUp className="shrink-0 text-primary" size={20} /> : <ChevronDown className="shrink-0 text-zinc-400" size={20} />}
      </div>
      {open && (
        <div className="px-6 py-5 text-zinc-400 leading-relaxed border-t border-white/10 bg-white/[0.02]">
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
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <WhatsAppModal />

      {/* HERO */}
      <section className="relative pt-36 pb-24 md:pt-52 md:pb-36 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1432888622747-4eb9a8efbe07?auto=format&fit=crop&w=1600&q=80"
            alt="Google Ads campaign management"
            className="w-full h-full object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/85 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-accent/10 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30 mb-8"
            >
              <MousePointerClick size={14} className="text-accent" />
              <span className="text-sm font-semibold text-accent uppercase tracking-wide">Google Ads Management</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-[1.1]"
            >
              Instant Leads.<br />
              <span style={{ color: "hsl(29 100% 75%)" }}>Maximum ROI.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-10 leading-relaxed"
            >
              We build and manage Google Ads campaigns that put your business in front of customers actively searching for what you offer — right now, not in 6 months.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <button
                onClick={openWhatsApp}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-lg hover:-translate-y-1 transition-all duration-300 shadow-[0_0_30px_rgba(255,188,125,0.25)]"
                style={{ background: "hsl(29 100% 75%)", color: "#151515" }}
              >
                Get a Free Ads Audit <ArrowRight size={20} />
              </button>
              <a
                href={`${import.meta.env.BASE_URL}audit`}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-lg hover:bg-white/10 hover:-translate-y-1 transition-all duration-300"
              >
                Free Website Audit
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* RESULTS STRIP */}
      <section className="py-12 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/5"
          >
            {[
              { metric: "R500K+", label: "Ad spend managed across all clients" },
              { metric: "3.8x", label: "Average return on ad spend (ROAS)" },
              { metric: "62%", label: "Average reduction in cost-per-lead" },
              { metric: "48hrs", label: "Average time to first qualified lead" },
            ].map((r, i) => (
              <motion.div key={i} variants={fadeInUp} className="text-center px-4">
                <div className="text-3xl md:text-4xl font-black mb-1" style={{ color: "hsl(29 100% 75%)" }}>{r.metric}</div>
                <div className="text-sm text-zinc-400">{r.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* WHY GOOGLE ADS */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-4xl md:text-5xl font-black mb-6">
                Why Google Ads Is the<br />
                <span style={{ color: "hsl(29 100% 75%)" }}>Fastest Way to Grow</span>
              </h2>
              <p className="text-zinc-400 text-lg mb-6 leading-relaxed">
                Google processes <strong className="text-white">8.5 billion searches per day</strong>. When someone in South Africa searches for exactly what you sell, Google Ads puts your business at the very top — above all organic results.
              </p>
              <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
                While SEO takes months to build momentum, Google Ads can deliver qualified leads within <strong className="text-white">24 hours of launch</strong>. Used together, they create an unstoppable search presence.
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
                    <CheckCircle2 size={20} className="shrink-0 mt-0.5" style={{ color: "hsl(29 100% 75%)" }} />
                    <span className="text-zinc-300">{point}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1611926653458-09294b3142bf?auto=format&fit=crop&w=900&q=85"
                  alt="Google Ads performance dashboard"
                  className="w-full h-72 md:h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
              </div>
              <div className="absolute -bottom-6 -left-6 glass-card rounded-2xl p-5 shadow-xl border border-accent/20">
                <div className="flex items-center gap-3 mb-1">
                  <TrendingUp size={22} style={{ color: "hsl(29 100% 75%)" }} />
                  <span className="font-bold text-white">ROAS This Month</span>
                </div>
                <div className="text-3xl font-black" style={{ color: "hsl(29 100% 75%)" }}>4.2x</div>
                <div className="text-sm text-zinc-400">R4.20 earned per R1 spent</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* OUR PROCESS */}
      <section className="py-24 bg-zinc-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6">Our <span style={{ color: "hsl(29 100% 75%)" }}>6-Step Campaign Process</span></h2>
            <p className="text-lg text-zinc-400">We don't guess. Every step is data-driven and designed to maximise your return from day one.</p>
          </div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {PROCESS.map((step, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="glass-card rounded-2xl p-7 relative overflow-hidden group hover:border-accent/40 transition-colors duration-300"
              >
                <div className="absolute top-4 right-6 text-6xl font-black text-white/[0.04] select-none">{step.step}</div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ background: "hsl(29 100% 75% / 0.1)", border: "1px solid hsl(29 100% 75% / 0.2)" }}>
                  <step.icon size={22} style={{ color: "hsl(29 100% 75%)" }} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CAMPAIGN TYPES */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6">Campaign Types <span style={{ color: "hsl(29 100% 75%)" }}>We Manage</span></h2>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto">We match the right campaign type to your goals — never a one-size-fits-all approach.</p>
          </div>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {CAMPAIGN_TYPES.map((ct, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="glass-card rounded-2xl p-6 hover:border-accent/40 transition-colors duration-300 flex flex-col"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ background: "hsl(29 100% 75% / 0.1)", border: "1px solid hsl(29 100% 75% / 0.2)" }}>
                  <ct.icon size={22} style={{ color: "hsl(29 100% 75%)" }} />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">{ct.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed flex-1 mb-5">{ct.desc}</p>
                <div className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: "hsl(29 100% 75% / 0.1)", color: "hsl(29 100% 75%)", border: "1px solid hsl(29 100% 75% / 0.2)" }}>
                  {ct.tag}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* WHAT'S INCLUDED */}
      <section className="py-24 bg-zinc-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="text-4xl md:text-5xl font-black mb-6">
                Everything We Handle<br />
                <span style={{ color: "hsl(29 100% 75%)" }}>So You Don't Have To</span>
              </h2>
              <p className="text-zinc-400 text-lg mb-10 leading-relaxed">
                Managing Google Ads is a full-time job. Keyword bidding, ad testing, Quality Score optimisation, fraud protection — we handle all of it so you can focus on running your business.
              </p>
              <div className="relative rounded-3xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=85"
                  alt="Marketing analytics dashboard"
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md" style={{ background: "hsl(29 100% 75% / 0.2)", border: "1px solid hsl(29 100% 75% / 0.3)" }}>
                    <DollarSign size={14} style={{ color: "hsl(29 100% 75%)" }} />
                    <span className="text-sm font-semibold" style={{ color: "hsl(29 100% 75%)" }}>Zero Hidden Fees — 100% Budget Transparency</span>
                  </div>
                </div>
              </div>
            </div>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid sm:grid-cols-2 gap-5"
            >
              {INCLUDED.map((d, i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  className="glass-card rounded-2xl p-5 hover:border-accent/30 transition-colors duration-300"
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ background: "hsl(29 100% 75% / 0.1)" }}>
                    <d.icon size={18} style={{ color: "hsl(29 100% 75%)" }} />
                  </div>
                  <h4 className="font-bold text-white mb-2">{d.title}</h4>
                  <p className="text-sm text-zinc-400 leading-relaxed">{d.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* BEFORE / AFTER */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6">What Happens When <span style={{ color: "hsl(29 100% 75%)" }}>Experts Manage Your Ads</span></h2>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto">Most businesses waste 40–60% of their Google Ads budget. Here's the difference Fortune Design makes.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="glass-card rounded-2xl p-8 border border-red-500/20"
            >
              <div className="text-red-400 font-bold text-sm uppercase tracking-widest mb-6">Without Fortune Design</div>
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
                    <span className="shrink-0 mt-0.5 text-red-400 font-bold">✕</span>
                    <span className="text-zinc-400">{point}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="glass-card rounded-2xl p-8 border-accent/20"
              style={{ borderColor: "hsl(29 100% 75% / 0.2)" }}
            >
              <div className="font-bold text-sm uppercase tracking-widest mb-6" style={{ color: "hsl(29 100% 75%)" }}>With Fortune Design</div>
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
                    <CheckCircle2 size={18} className="shrink-0 mt-0.5" style={{ color: "hsl(29 100% 75%)" }} />
                    <span className="text-zinc-300">{point}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="py-24 bg-zinc-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">Client <span style={{ color: "hsl(29 100% 75%)" }}>Results</span></h2>
            <p className="text-zinc-400 text-lg">What South African businesses say about working with us.</p>
          </div>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-6"
          >
            {[
              {
                text: "Since Fortune Design took over our Google Ads, our cost per lead dropped from R480 to R120. We're now getting double the enquiries at a quarter of the cost.",
                author: "Michael",
                role: "Captuna Charters",
                stars: 5,
              },
              {
                text: "We were spending R15,000/month on Google Ads with barely any leads. Fortune Design restructured everything and we now spend R8,000 and get 3x the leads.",
                author: "Leon De Wet",
                role: "Rapple Products",
                stars: 5,
              },
              {
                text: "Professional, responsive, and the results are undeniable. Our Google Ads ROAS went from 1.2x to 4.8x in 3 months. Highly recommend Fortune Design.",
                author: "Bettina Williams",
                role: "DesignAfrique",
                stars: 5,
              },
            ].map((review, i) => (
              <motion.div key={i} variants={fadeInUp} className="glass-card rounded-2xl p-7">
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: review.stars }).map((_, j) => (
                    <Star key={j} size={16} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-zinc-300 leading-relaxed mb-6 italic">"{review.text}"</p>
                <div className="border-t border-white/10 pt-5">
                  <div className="font-bold text-white">{review.author}</div>
                  <div className="text-sm text-zinc-500">{review.role}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* WHAT TO EXPECT TIMELINE */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6">Your First <span style={{ color: "hsl(29 100% 75%)" }}>90 Days</span> With Us</h2>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto">Here's exactly what happens from the moment you sign up to when your campaigns are fully optimised.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                period: "Week 1–2",
                title: "Setup & Launch",
                points: [
                  "Full audit of your current account (or fresh setup)",
                  "Keyword research and negative keyword list built",
                  "Ad copy written and approved by you",
                  "Conversion tracking installed and tested",
                  "Campaigns live within 10 business days",
                ],
              },
              {
                period: "Month 2",
                title: "Data & Optimisation",
                points: [
                  "Analysis of search term reports — cutting waste",
                  "First A/B ad test results — best performer retained",
                  "Bid adjustments based on conversion data",
                  "Quality Score improvements through landing page tweaks",
                  "Cost-per-lead trending downward",
                ],
              },
              {
                period: "Month 3+",
                title: "Scale & Profit",
                points: [
                  "Campaigns at optimal efficiency",
                  "Budget scaling to capitalise on top-performing keywords",
                  "Remarketing campaigns added for warm audiences",
                  "Monthly performance review and strategy session",
                  "Consistent, predictable lead volume",
                ],
              },
            ].map((phase, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="glass-card rounded-2xl p-7"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5" style={{ background: "hsl(29 100% 75% / 0.1)", border: "1px solid hsl(29 100% 75% / 0.2)" }}>
                  <Clock size={12} style={{ color: "hsl(29 100% 75%)" }} />
                  <span className="text-xs font-bold" style={{ color: "hsl(29 100% 75%)" }}>{phase.period}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-5">{phase.title}</h3>
                <div className="space-y-3">
                  {phase.points.map((pt, j) => (
                    <div key={j} className="flex items-start gap-2.5">
                      <CheckCircle2 size={16} className="shrink-0 mt-0.5" style={{ color: "hsl(29 100% 75%)" }} />
                      <span className="text-sm text-zinc-400">{pt}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-zinc-900/40">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">Google Ads <span style={{ color: "hsl(29 100% 75%)" }}>FAQ</span></h2>
            <p className="text-zinc-400 text-lg">Straight answers to the most common questions.</p>
          </div>
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <FAQItem key={i} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0" style={{ background: "linear-gradient(to right, hsl(29 100% 75% / 0.08), transparent, hsl(29 100% 75% / 0.04))" }} />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8" style={{ background: "hsl(29 100% 75% / 0.1)", border: "1px solid hsl(29 100% 75% / 0.2)" }}>
              <Award size={14} style={{ color: "hsl(29 100% 75%)" }} />
              <span className="text-sm font-semibold" style={{ color: "hsl(29 100% 75%)" }}>Free Account Audit — No Commitment</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black mb-6">
              Stop Wasting Budget.<br />
              <span style={{ color: "hsl(29 100% 75%)" }}>Start Generating Leads.</span>
            </h2>
            <p className="text-xl text-zinc-400 mb-10 leading-relaxed">
              Get a free audit of your Google Ads account — we'll show you exactly where your budget is being wasted and how we'd fix it.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={openWhatsApp}
                className="inline-flex items-center justify-center gap-2 px-10 py-5 rounded-xl font-bold text-xl hover:-translate-y-1 transition-all duration-300"
                style={{ background: "hsl(29 100% 75%)", color: "#151515", boxShadow: "0 0 40px hsl(29 100% 75% / 0.3)" }}
              >
                Get My Free Ads Audit <ArrowRight size={22} />
              </button>
              <a
                href={`${import.meta.env.BASE_URL}audit`}
                className="inline-flex items-center justify-center gap-2 px-10 py-5 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xl hover:bg-white/10 hover:-translate-y-1 transition-all duration-300"
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
