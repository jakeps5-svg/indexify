import { motion } from "framer-motion";
import { CheckCircle2, Star, ArrowRight, Search, MousePointerClick, FileText, MessageCircle } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PoweredByBadge } from "@/components/PoweredByBadge";
import { useSEO } from "@/hooks/useSEO";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

function goPackage(slug: string) {
  window.location.href = `${window.location.origin}${BASE}/packages/${slug}`;
}

const SEO_PACKAGES = [
  {
    name: "Basic SEO",
    price: "5,900",
    slug: "basic-seo",
    type: "seo-basic",
    popular: false,
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
    slug: "advanced-seo",
    type: "seo-advanced",
    popular: false,
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
    slug: "premium-seo",
    type: "seo-premium",
    popular: true,
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

export default function PricingPage() {
  useSEO({
    title: "SEO & Google Ads Pricing SA | Packages | Indexify",
    description: "Transparent SEO and Google Ads packages for South African businesses. Affordable pricing from R5,900/month. No hidden fees. Free audit. Cape Town, JHB & Durban.",
    keywords: [
      "SEO pricing South Africa", "Google Ads pricing South Africa",
      "SEO services pricing South Africa", "Google Ads management packages SA",
      "how much does SEO cost in South Africa", "how much does Google Ads cost South Africa",
      "affordable SEO services SA", "affordable PPC services South Africa",
      "digital marketing packages South Africa", "SEO cost South Africa",
      "SEO packages Cape Town", "Google Ads packages South Africa",
      "hire SEO agency South Africa", "best Google Ads agency Cape Town",
      "SEO pricing Johannesburg", "SEO pricing Durban", "SEO pricing Pretoria",
      "Google Ads pricing Cape Town", "digital marketing cost South Africa",
    ],
    canonical: "https://indexify.co.za/pricing",
  });

  function openWhatsApp(msg?: string) {
    const text = msg ?? "Hi Indexify! I'd like to find out more about your packages.";
    window.open(`https://wa.me/27602988295?text=${encodeURIComponent(text)}`, "_blank");
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-36 pb-16 bg-gradient-to-br from-sky-50 via-white to-blue-50 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-primary/20 shadow-sm text-sm font-medium text-gray-600">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" /> Transparent Pricing — No Hidden Fees
              </span>
              <PoweredByBadge />
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-4">
              Invest in <span className="text-gradient">Predictable Growth</span>
            </h1>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Fixed monthly fees. No percentage of ad spend. Cancel after 3 months if we don't deliver.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Google Ads Proposal — quickest CTA */}
      <section className="py-10 bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="rounded-2xl border-2 border-dashed border-primary/30 bg-sky-50/50 p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <FileText size={20} className="text-primary" />
              </div>
              <div>
                <p className="font-bold text-gray-900">Not sure which package fits?</p>
                <p className="text-sm text-gray-500">Get a free generated Google Ads proposal for your website — takes 30 seconds.</p>
              </div>
            </div>
            <a
              href={`${BASE}/ads-audit`}
              className="shrink-0 flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/90 hover:-translate-y-0.5 transition-all shadow-md shadow-primary/20"
            >
              Get Free Proposal <ArrowRight size={14} />
            </a>
          </motion.div>

          {/* SEO Audit blob */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="mt-4 rounded-2xl border-2 border-dashed border-accent/30 bg-violet-50/50 p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                <Search size={20} className="text-accent" />
              </div>
              <div>
                <p className="font-bold text-gray-900">Want to see how your website ranks?</p>
                <p className="text-sm text-gray-500">Get a free generated SEO audit for your website — instant results, no sign-up needed.</p>
              </div>
            </div>
            <a
              href={`${BASE}/audit`}
              className="shrink-0 flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm hover:-translate-y-0.5 transition-all shadow-md"
              style={{ background: "hsl(259 100% 65%)", boxShadow: "0 4px 16px hsl(259 100% 65% / 0.25)" }}
            >
              Get Free SEO Audit <ArrowRight size={14} />
            </a>
          </motion.div>
        </div>
      </section>

      {/* SEO Pricing */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-bold text-sm mb-4">
              <Search size={14} /> SEO Packages
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-3">Search Engine <span className="text-gradient">Optimisation</span></h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">Rank higher organically. Build compounding, long-term traffic that doesn't vanish when you stop paying.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {SEO_PACKAGES.map((pkg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className={`relative rounded-3xl flex flex-col ${
                  pkg.popular
                    ? "bg-primary text-white shadow-2xl shadow-primary/30 scale-105 z-10"
                    : "bg-white border border-gray-200 shadow-sm"
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-accent text-white text-xs font-bold uppercase tracking-wider shadow-lg">
                      <Star size={12} fill="currentColor" /> Most Popular
                    </span>
                  </div>
                )}
                <div className="p-8 pb-0 flex-1">
                  <h3 className={`text-xl font-bold mb-6 ${pkg.popular ? "text-white" : "text-gray-900"}`}>{pkg.name}</h3>
                  <div className="mb-8">
                    <div className={`flex items-baseline gap-1 ${pkg.popular ? "text-white" : "text-gray-900"}`}>
                      <span className="text-2xl font-semibold">R</span>
                      <span className="text-5xl font-black">{pkg.price}</span>
                    </div>
                    <p className={`text-sm mt-1 font-medium ${pkg.popular ? "text-white/70" : "text-gray-400"}`}>per month</p>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {pkg.features.map((f, j) => (
                      <li key={j} className="flex items-start gap-3">
                        <CheckCircle2 size={15} className={`mt-0.5 shrink-0 ${pkg.popular ? "text-white" : "text-primary"}`} />
                        <span className={`text-sm leading-relaxed ${pkg.popular ? "text-white/90" : "text-gray-600"}`}>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-8 pt-0 space-y-3">
                  <a
                    href={`${BASE}/packages/${pkg.slug}`}
                    className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all hover:-translate-y-0.5 flex items-center justify-center ${
                      pkg.popular
                        ? "bg-white text-primary hover:bg-white/90 shadow-lg"
                        : "bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/20"
                    }`}
                  >
                    Get Started — R{pkg.price}/mo
                  </a>
                  <button
                    onClick={() => openWhatsApp(`Hi! I'm interested in the ${pkg.name} package at R${pkg.price}/mo. Can we chat?`)}
                    className={`w-full py-2.5 rounded-xl font-medium text-xs transition-all ${
                      pkg.popular
                        ? "border border-white/20 text-white/70 hover:bg-white/10"
                        : "border border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    Questions? Chat on WhatsApp first
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <p className="text-center text-sm text-gray-400 mt-10">
            Not sure which fits? <button onClick={() => openWhatsApp()} className="text-primary font-semibold hover:underline">Chat with us — we'll recommend the best option.</button>
          </p>
        </div>
      </section>

      {/* Google Ads Pricing */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-4" style={{ background: "hsl(259 100% 65% / 0.12)", color: "hsl(259 100% 50%)" }}>
              <MousePointerClick size={14} /> Google Ads Management
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-3">Instant Leads via <span style={{ color: "hsl(259 100% 65%)" }}>Paid Search</span></h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">One flat monthly fee. No percentage of ad spend. Your budget goes 100% to Google.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="grid lg:grid-cols-5 rounded-3xl overflow-hidden shadow-2xl border border-gray-100 max-w-5xl mx-auto"
          >
            <div className="lg:col-span-2 p-10 flex flex-col justify-center" style={{ background: "hsl(259 85% 60%)" }}>
              <p className="text-white/80 text-xs font-bold uppercase tracking-widest mb-4">Google Ads Management</p>
              <div className="flex items-baseline gap-1 text-white mb-2">
                <span className="text-3xl font-semibold">R</span>
                <span className="text-7xl font-black leading-none">7,300</span>
              </div>
              <p className="text-white/70 text-sm mb-8">per month + your ad spend</p>
              <a
                href={`${BASE}/packages/google-ads`}
                className="w-full py-3.5 rounded-xl bg-white font-bold text-sm hover:-translate-y-0.5 transition-all shadow-lg mb-3 flex items-center justify-center"
                style={{ color: "hsl(259 100% 50%)" }}
              >
                Get Started — R7,300/mo
              </a>
              <a
                href={`${BASE}/ads-audit`}
                className="w-full py-3 rounded-xl border border-white/30 text-white/80 font-medium text-sm hover:bg-white/10 transition-all text-center block"
              >
                Get a Free Proposal First
              </a>
              <p className="text-white/50 text-xs text-center mt-3">No lock-in. 30-day notice to cancel.</p>
            </div>

            <div className="lg:col-span-3 bg-white p-10">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Everything included in your management fee</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                {[
                  "Full Campaign Setup & Structure", "Keyword Research & Match Types",
                  "Ad Copy & A/B Testing", "Conversion Tracking Setup",
                  "Negative Keyword Management", "Bid Strategy & Budget Optimisation",
                  "Audience & Remarketing Campaigns", "Landing Page Recommendations",
                  "Search Term Report Analysis", "Google Analytics Integration",
                  "Monthly Performance Reports", "Dedicated Account Manager",
                ].map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 size={14} className="mt-0.5 shrink-0" style={{ color: "hsl(259 100% 65%)" }} />
                    <span className="text-sm text-gray-700">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Market Leader Bundle */}
      <section className="py-24 bg-gray-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-4 bg-primary/20 text-primary">
              <Star size={14} /> Bundle & Save
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-3">The <span className="text-primary">Market Leader</span> Bundle</h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">SEO + Google Ads combined. Dominate both organic and paid search simultaneously for compounding results.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
          >
            <div className="grid lg:grid-cols-2">
              {/* Left — pricing */}
              <div className="p-10 flex flex-col justify-between" style={{ background: "linear-gradient(135deg, hsl(198 69% 40%), hsl(198 69% 28%))" }}>
                <div>
                  <div className="inline-flex items-center gap-2 bg-white/10 text-white/90 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
                    Most Popular Bundle
                  </div>
                  <p className="text-white/70 text-sm font-semibold uppercase tracking-widest mb-3">SEO + Google Ads</p>
                  <div className="flex items-baseline gap-1 text-white mb-1">
                    <span className="text-3xl font-semibold">R</span>
                    <span className="text-7xl font-black leading-none">12,500</span>
                  </div>
                  <p className="text-white/60 text-sm mb-2">per month + your Google Ads spend</p>
                  <p className="text-white/50 text-xs mb-10">Combines Advanced SEO (R7,900) + Google Ads Management (R7,300) — save R2,700/mo</p>
                </div>
                <div className="space-y-3">
                  <a
                    href={`${BASE}/packages/market-leader`}
                    className="block w-full py-3.5 rounded-xl bg-white font-bold text-sm text-center hover:-translate-y-0.5 transition-all shadow-lg"
                    style={{ color: "hsl(198 69% 35%)" }}
                  >
                    Get Started — R12,500/mo
                  </a>
                  <a
                    href={`${BASE}/contact`}
                    className="block w-full py-3 rounded-xl border border-white/20 text-white/80 font-medium text-sm hover:bg-white/10 transition-all text-center"
                  >
                    Talk to an Expert First
                  </a>
                  <p className="text-white/40 text-xs text-center">No lock-in. 30-day notice to cancel.</p>
                </div>
              </div>

              {/* Right — features */}
              <div className="bg-gray-800 p-10">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Everything you get in the bundle</p>
                <div className="mb-6">
                  <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3 flex items-center gap-2"><Search size={11} /> SEO Includes</p>
                  <ul className="space-y-2.5">
                    {["Advanced keyword strategy", "Technical SEO & backlinks", "Content optimisation", "Competitor analysis", "Monthly ranking reports"].map((f, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-primary" />
                        <span className="text-sm text-gray-300">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2" style={{ color: "hsl(259 100% 65%)" }}><MousePointerClick size={11} /> Google Ads Includes</p>
                  <ul className="space-y-2.5">
                    {["Full campaign setup & management", "Ad copy & A/B testing", "Conversion tracking", "Bid & budget optimisation", "Remarketing campaigns"].map((f, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <CheckCircle2 size={14} className="mt-0.5 shrink-0" style={{ color: "hsl(259 100% 65%)" }} />
                        <span className="text-sm text-gray-300">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Proposal unlock */}
      <section className="py-20 bg-slate-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
              <FileText size={28} className="text-primary" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-3">Full Google Ads Proposal</h2>
            <p className="text-gray-500 max-w-xl mx-auto mb-8">
              Get a complete, AI-generated campaign blueprint with all keywords, ad copy, budgets, and a downloadable PDF — tailored specifically to your website.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={`${BASE}/ads-audit`}
                className="flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 hover:-translate-y-0.5 transition-all shadow-lg shadow-primary/20"
              >
                Generate Free Preview <ArrowRight size={16} />
              </a>
              <a
                href={`${BASE}/checkout?type=proposal`}
                className="flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-primary text-primary font-bold hover:bg-primary/5 hover:-translate-y-0.5 transition-all"
              >
                Unlock Full Report — R500
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gray-900 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl font-black text-white mb-4">Not sure where to start?</h2>
            <p className="text-gray-400 mb-8">Chat with us on WhatsApp. We'll assess your situation and recommend the best package — no hard sell.</p>
            <button
              onClick={() => openWhatsApp()}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-[#25d366] text-white font-bold hover:bg-[#20bc5a] hover:-translate-y-0.5 transition-all shadow-lg"
            >
              <MessageCircle size={20} /> Chat on WhatsApp
            </button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
