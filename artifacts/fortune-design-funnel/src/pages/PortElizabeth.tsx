import { motion } from "framer-motion";
import { MapPin, Search, MousePointerClick, TrendingUp, CheckCircle2, ArrowRight, Star, Phone } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PoweredByBadge } from "@/components/PoweredByBadge";
import { CityPricing } from "@/components/CityPricing";
import { useSEO } from "@/hooks/useSEO";
import { useLocation } from "wouter";
import { openWhatsAppModal } from "@/components/WhatsAppModal";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const WA = "27602988295";

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55 } } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

const SERVICES = [
  { icon: Search, title: "SEO Services Port Elizabeth", desc: "Rank on Google page 1 for Port Elizabeth and Gqeberha searches. We build local SEO strategies that drive consistent organic traffic to your business.", cta: "/services/seo" },
  { icon: MousePointerClick, title: "Google Ads Port Elizabeth", desc: "Targeted Google Ads campaigns for the Port Elizabeth market — put your business in front of buyers searching in Gqeberha and the Eastern Cape.", cta: "/services/google-ads" },
  { icon: TrendingUp, title: "Digital Marketing Gqeberha", desc: "Comprehensive SEO and Google Ads solutions for Port Elizabeth businesses — all managed for a transparent fixed monthly fee.", cta: "/pricing" },
];

const INDUSTRIES = [
  "Automotive & Manufacturing", "Legal & Conveyancing", "Medical & Dental",
  "Construction & Property", "Tourism & Hospitality", "Retail & eCommerce",
  "Accounting & Financial", "Education & Training", "Food & Beverage",
];

const FAQS = [
  { q: "Do you serve Port Elizabeth (Gqeberha) clients remotely?", a: "Yes. All our SEO and Google Ads work is done remotely. We serve clients across Port Elizabeth, Gqeberha, Uitenhage, and the broader Eastern Cape — with no need for in-person visits." },
  { q: "Is SEO worth it for a Port Elizabeth business?", a: "Absolutely. Port Elizabeth is less competitive digitally than Cape Town or Johannesburg in most industries, which means faster rankings and better ROI on your SEO investment. Businesses that start now gain a significant head start." },
  { q: "How long does SEO take in Port Elizabeth?", a: "In Port Elizabeth, many industries see measurable results in 2–4 months due to lower competition. We track and report on your rankings monthly so you see exactly what's happening." },
  { q: "Can you run Google Ads targeting both Port Elizabeth and East London?", a: "Yes. Our Google Ads campaigns can target multiple Eastern Cape cities simultaneously — Port Elizabeth, Gqeberha, East London, George, and beyond — all under one managed account." },
];

export default function PortElizabethPage() {
  useSEO({
    title: "SEO Agency Port Elizabeth | Google Ads | Indexify",
    description: "Port Elizabeth's trusted SEO and Google Ads agency. Rank higher on Google in Gqeberha and Eastern Cape. Packages from R5,900/month. Free audit. No lock-in.",
    keywords: [
      "SEO agency Port Elizabeth", "Google Ads Port Elizabeth", "SEO Gqeberha",
      "digital marketing Port Elizabeth", "SEO services Port Elizabeth",
      "Google Ads Gqeberha", "SEO Eastern Cape", "local SEO Port Elizabeth",
      "digital marketing Gqeberha", "PPC Port Elizabeth", "Google Ads management Port Elizabeth",
      "SEO company Port Elizabeth", "affordable SEO Port Elizabeth",
    ],
    canonical: "https://indexify.co.za/port-elizabeth/",
  });

  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-16 bg-gradient-to-br from-slate-900 via-cyan-950 to-slate-800 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeUp} className="flex items-center justify-center gap-2 mb-5">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                <MapPin size={14} /> Port Elizabeth, Eastern Cape
              </div>
              <PoweredByBadge />
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl font-black mb-5 leading-tight">
              Port Elizabeth's <span className="text-cyan-400">SEO & Google Ads</span><br />Agency That Delivers
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
              We help Port Elizabeth and Eastern Cape businesses rank on Google and generate more qualified leads. Transparent pricing, no lock-in, and real results you can measure.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate(`${BASE}/audit`)}
                className="px-8 py-4 rounded-xl font-bold text-white bg-cyan-600 hover:bg-cyan-500 transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <Search size={17} /> Get Free SEO Audit
              </button>
              <button
                onClick={() => openWhatsAppModal()}
                className="px-8 py-4 rounded-xl font-bold bg-white/10 hover:bg-white/20 border border-white/20 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Phone size={17} /> WhatsApp Us
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-12">
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
              Digital Marketing Services in Port Elizabeth
            </motion.h2>
            <motion.p variants={fadeUp} className="text-gray-500 max-w-xl mx-auto">
              From the Harbour to Summerstrand — we help Port Elizabeth businesses stand out on Google.
            </motion.p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid md:grid-cols-3 gap-6">
            {SERVICES.map((s) => (
              <motion.div key={s.title} variants={fadeUp} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-cyan-50 flex items-center justify-center mb-4">
                  <s.icon size={22} className="text-cyan-600" />
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">{s.desc}</p>
                <button
                  onClick={() => navigate(`${BASE}${s.cta}`)}
                  className="text-sm font-semibold text-cyan-600 hover:text-cyan-700 flex items-center gap-1 transition-colors"
                >
                  Learn more <ArrowRight size={14} />
                </button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Industries */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-10">
            <motion.h2 variants={fadeUp} className="text-3xl font-black text-gray-900 mb-3">
              Port Elizabeth Industries We Serve
            </motion.h2>
            <motion.p variants={fadeUp} className="text-gray-500">
              From PE's automotive sector to its growing tourism industry — we know the Eastern Cape.
            </motion.p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="flex flex-wrap gap-3 justify-center">
            {INDUSTRIES.map((ind) => (
              <motion.span key={ind} variants={fadeUp} className="px-4 py-2 rounded-full border border-cyan-100 bg-cyan-50 text-cyan-700 text-sm font-medium flex items-center gap-1.5">
                <CheckCircle2 size={13} /> {ind}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Us */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
              <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-black text-gray-900 mb-5">
                Why Port Elizabeth Businesses Choose Indexify
              </motion.h2>
              {[
                { title: "Eastern Cape opportunity", desc: "PE is digitally underserved in most industries — businesses that invest in SEO now will rank for years ahead of competitors who haven't started." },
                { title: "No percentage of ad spend", desc: "Your full Google Ads budget goes to Google, not to us. We charge a flat monthly management fee only." },
                { title: "Proven remote delivery", desc: "We serve clients across all 9 provinces. Distance is no barrier to excellent SEO and Google Ads management." },
                { title: "Free audit to get started", desc: "Every new client starts with a comprehensive free SEO audit that maps exactly what needs fixing and why." },
              ].map((item) => (
                <motion.div key={item.title} variants={fadeUp} className="flex gap-3 mb-5">
                  <CheckCircle2 size={20} className="text-cyan-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-gray-900">{item.title}</p>
                    <p className="text-gray-500 text-sm">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              <div className="flex items-center gap-1 mb-2">
                {[1,2,3,4,5].map(i => <Star key={i} size={18} fill="#f59e0b" stroke="none" />)}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-4 italic">
                "We went from page 4 to top 3 for 'attorney Port Elizabeth' in 5 months. The SEO results have been exceptional and the communication is excellent."
              </p>
              <p className="font-bold text-sm text-gray-900">— Legal firm, Gqeberha CBD</p>
              <hr className="my-5 border-gray-100" />
              <div className="flex items-center gap-1 mb-2">
                {[1,2,3,4,5].map(i => <Star key={i} size={18} fill="#f59e0b" stroke="none" />)}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-4 italic">
                "Indexify set up our Google Ads and we saw leads within the first week. Best marketing investment we've made for our PE business."
              </p>
              <p className="font-bold text-sm text-gray-900">— Construction company, Summerstrand</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <CityPricing city="Port Elizabeth" accent="cyan" />

      {/* FAQ */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl font-black text-gray-900 text-center mb-10">
            Frequently Asked Questions
          </motion.h2>
          <div className="space-y-5">
            {FAQS.map((faq) => (
              <motion.div key={faq.q} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-slate-50 rounded-xl p-5 border border-gray-100">
                <p className="font-bold text-gray-900 mb-2">{faq.q}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-cyan-700 to-teal-600">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center text-white">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl font-black mb-3">
            Ready to Dominate Port Elizabeth Search Results?
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-cyan-100 mb-7">
            Get your free SEO audit and find out exactly where your PE business stands on Google today.
          </motion.p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate(`${BASE}/audit`)}
              className="px-8 py-4 rounded-xl font-bold bg-white text-cyan-700 hover:bg-cyan-50 transition-all duration-300"
            >
              Get Free SEO Audit
            </button>
            <button
              onClick={() => navigate(`${BASE}/pricing`)}
              className="px-8 py-4 rounded-xl font-bold bg-white/10 hover:bg-white/20 border border-white/30 text-white transition-all duration-300"
            >
              View Packages
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
