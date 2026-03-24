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
  { icon: Search, title: "SEO Agency Pretoria", desc: "Rank on Google page 1 for Pretoria and Tshwane searches. We build targeted SEO strategies for Pretoria businesses across government, professional services, and retail.", cta: "/services/seo" },
  { icon: MousePointerClick, title: "Google Ads Pretoria", desc: "Precision Google Ads campaigns for the Pretoria market — reach buyers in Hatfield, Menlyn, Centurion, and across Tshwane the moment they search for your service.", cta: "/services/google-ads" },
  { icon: TrendingUp, title: "Digital Marketing Pretoria", desc: "Full digital marketing — SEO and Google Ads combined — to dominate your industry in Pretoria and the greater Tshwane region.", cta: "/pricing" },
];

const INDUSTRIES = [
  "Government & Public Sector", "Legal & Attorneys", "Medical & Healthcare",
  "Accounting & Financial", "Construction & Civil", "Real Estate & Property",
  "Education & Training", "IT & Technology", "Retail & eCommerce",
];

const FAQS = [
  { q: "Do you work with Pretoria businesses remotely?", a: "Yes. All our SEO and Google Ads work is delivered remotely — no need for in-person meetings. We serve clients across Pretoria, Centurion, Midrand, and the broader Tshwane metro." },
  { q: "How competitive is SEO in Pretoria?", a: "Pretoria is competitive in professional services (legal, medical, accounting) but many industries remain underserved digitally. Businesses that invest in SEO now gain a significant first-mover advantage." },
  { q: "Can you target both Pretoria and Johannesburg?", a: "Absolutely. Our SEO and Google Ads strategies can target multiple cities simultaneously, including Pretoria, Sandton, Midrand, and Centurion — all under one campaign." },
  { q: "What's the minimum budget for Google Ads in Pretoria?", a: "Our Google Ads management fee starts at R7,300/month (flat, no % of spend). We recommend a separate ad budget of R5,000–R12,000/month for most Pretoria industries." },
];

export default function PretoriaPage() {
  useSEO({
    title: "SEO Agency Pretoria | Google Ads Tshwane | Indexify",
    description: "Pretoria's trusted SEO & Google Ads agency. Rank across Tshwane. From R5,900/month. Free SEO audit. Serving Centurion & Midrand.",
    keywords: [
      "SEO agency Pretoria", "Google Ads Pretoria", "digital marketing Pretoria",
      "SEO services Pretoria", "SEO Tshwane", "Google Ads Tshwane",
      "SEO company Pretoria", "PPC Pretoria", "Google Ads management Pretoria",
      "local SEO Pretoria", "digital marketing Tshwane", "SEO Centurion",
      "SEO Midrand", "Google Ads Centurion", "affordable SEO Pretoria",
    ],
    canonical: "https://indexify.co.za/pretoria/",
  });

  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-16 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-800 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeUp} className="flex items-center justify-center gap-2 mb-5">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                <MapPin size={14} /> Pretoria, Tshwane
              </div>
              <PoweredByBadge />
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl font-black mb-5 leading-tight">
              Pretoria's <span className="text-indigo-400">SEO & Google Ads</span><br />Agency for Growth
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
              We help Pretoria and Tshwane businesses rank on Google page 1 and generate qualified leads. Fixed pricing, honest reporting, and strategies built for the local market.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate(`${BASE}/audit`)}
                className="px-8 py-4 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2"
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
              Digital Marketing Services in Pretoria
            </motion.h2>
            <motion.p variants={fadeUp} className="text-gray-500 max-w-xl mx-auto">
              From Hatfield to Menlyn to Centurion — we help Pretoria businesses dominate Google.
            </motion.p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid md:grid-cols-3 gap-6">
            {SERVICES.map((s) => (
              <motion.div key={s.title} variants={fadeUp} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center mb-4">
                  <s.icon size={22} className="text-indigo-600" />
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">{s.desc}</p>
                <button
                  onClick={() => navigate(`${BASE}${s.cta}`)}
                  className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors"
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
              Pretoria Industries We Serve
            </motion.h2>
            <motion.p variants={fadeUp} className="text-gray-500">
              From Pretoria's government sector to Centurion's business parks — we know the Tshwane market.
            </motion.p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="flex flex-wrap gap-3 justify-center">
            {INDUSTRIES.map((ind) => (
              <motion.span key={ind} variants={fadeUp} className="px-4 py-2 rounded-full border border-indigo-100 bg-indigo-50 text-indigo-700 text-sm font-medium flex items-center gap-1.5">
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
                Why Pretoria Businesses Choose Indexify
              </motion.h2>
              {[
                { title: "Tshwane market knowledge", desc: "We understand Pretoria's unique mix of government, professional services, and retail and tailor strategies accordingly." },
                { title: "Multi-city targeting", desc: "Rank across Pretoria, Centurion, Midrand, and Johannesburg simultaneously with one unified strategy." },
                { title: "Fixed, predictable pricing", desc: "No hidden fees, no percentage of ad spend. A flat monthly rate so you can plan your marketing budget accurately." },
                { title: "Monthly performance reports", desc: "Every client gets a detailed monthly report covering rankings, traffic, leads, and next steps." },
              ].map((item) => (
                <motion.div key={item.title} variants={fadeUp} className="flex gap-3 mb-5">
                  <CheckCircle2 size={20} className="text-indigo-500 shrink-0 mt-0.5" />
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
                "We ranked for 'attorney Pretoria' in under 4 months. The leads we get from Google now account for 60% of our new client intake."
              </p>
              <p className="font-bold text-sm text-gray-900">— Law firm, Hatfield</p>
              <hr className="my-5 border-gray-100" />
              <div className="flex items-center gap-1 mb-2">
                {[1,2,3,4,5].map(i => <Star key={i} size={18} fill="#f59e0b" stroke="none" />)}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-4 italic">
                "Indexify manages our Google Ads across Pretoria and Centurion. Our cost-per-enquiry is down 35% from what we paid our previous agency."
              </p>
              <p className="font-bold text-sm text-gray-900">— Accounting firm, Centurion</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <CityPricing city="Pretoria" accent="indigo" />

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
      <section className="py-16 bg-gradient-to-r from-indigo-700 to-indigo-600">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center text-white">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl font-black mb-3">
            Ready to Dominate Pretoria Search Results?
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-indigo-200 mb-7">
            Get a free SEO audit and see exactly where your Pretoria business stands on Google today.
          </motion.p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate(`${BASE}/audit`)}
              className="px-8 py-4 rounded-xl font-bold bg-white text-indigo-700 hover:bg-indigo-50 transition-all duration-300"
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
