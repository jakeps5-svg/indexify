import { motion } from "framer-motion";
import { MapPin, Search, MousePointerClick, TrendingUp, CheckCircle2, ArrowRight, Star, Phone } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PoweredByBadge } from "@/components/PoweredByBadge";
import { useSEO } from "@/hooks/useSEO";
import { useLocation } from "wouter";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const WA = "27760597724";

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55 } } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

const SERVICES = [
  { icon: Search, title: "SEO Services Durban", desc: "Rank on Google page 1 for Durban and KwaZulu-Natal searches. We use on-page, technical, and local SEO to drive consistent organic traffic to your business.", cta: "/services/seo" },
  { icon: MousePointerClick, title: "Google Ads Durban", desc: "Targeted Google Ads campaigns built for the Durban market — reach Durban customers the moment they search for your products or services.", cta: "/services/google-ads" },
  { icon: TrendingUp, title: "Digital Marketing Durban", desc: "Complete digital marketing solutions for Durban businesses — SEO, Google Ads, and strategy all under one fixed monthly fee.", cta: "/pricing" },
];

const INDUSTRIES = [
  "Tourism & Hospitality", "Construction & Property", "Legal & Conveyancing",
  "Medical & Dental Practices", "Manufacturing & Export", "Retail & eCommerce",
  "Financial & Insurance", "Education & Training", "Food & Beverage",
];

const FAQS = [
  { q: "Does Indexify serve Durban businesses remotely?", a: "Yes. All our work is done remotely — we don't need to be in the same city to deliver excellent results. We serve Durban, Umhlanga, Ballito, Pietermaritzburg, and all KwaZulu-Natal areas." },
  { q: "How competitive is SEO in Durban compared to Cape Town or Johannesburg?", a: "Durban is generally less competitive than Joburg or Cape Town for most industries, which means faster rankings and lower costs. This is a significant advantage for Durban businesses that act early." },
  { q: "What's the minimum budget for Google Ads in Durban?", a: "Our management fee starts at R7,300/month (flat). Your ad budget is separate — we recommend a minimum of R3,000–R8,000/month for Durban campaigns to see meaningful results." },
  { q: "Can you help a Durban business rank across KwaZulu-Natal?", a: "Absolutely. We build location-targeted SEO strategies that can cover Durban, Umhlanga, Ballito, Pietermaritzburg, and other KZN cities simultaneously." },
];

export default function DurbanPage() {
  useSEO({
    title: "SEO Services Durban | Google Ads & Digital Marketing Durban | Indexify",
    description: "Durban's trusted SEO and Google Ads agency. Rank higher on Google and get more KZN leads. Packages from R5,900/month. Free SEO audit. Serving all of KwaZulu-Natal.",
    keywords: [
      "SEO services Durban", "Google Ads Durban", "digital marketing Durban",
      "SEO agency Durban", "PPC Durban", "Google Ads management Durban",
      "search engine optimisation Durban", "local SEO Durban",
      "digital marketing KwaZulu-Natal", "SEO company Durban",
      "affordable SEO Durban", "PPC services Durban",
      "Google Ads agency Durban", "online marketing Durban",
    ],
    canonical: "https://indexify.co.za/durban",
  });

  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-16 bg-gradient-to-br from-slate-900 via-teal-950 to-slate-800 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeUp} className="flex items-center justify-center gap-2 mb-5">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <MapPin size={14} /> Durban, KwaZulu-Natal
              </div>
              <PoweredByBadge />
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl font-black mb-5 leading-tight">
              Durban's <span className="text-emerald-400">SEO & Google Ads</span><br />Agency for Real Results
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
              We help Durban and KZN businesses rank on Google and generate more qualified leads. Transparent pricing, honest reporting, no lock-in contracts.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate(`${BASE}/audit`)}
                className="px-8 py-4 rounded-xl font-bold text-white bg-emerald-500 hover:bg-emerald-400 transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <Search size={17} /> Get Free SEO Audit
              </button>
              <button
                onClick={() => window.open(`https://wa.me/${WA}?text=${encodeURIComponent("Hi Indexify! I'm a Durban business looking for SEO / Google Ads help.")}`, "_blank")}
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
              Digital Marketing Services in Durban
            </motion.h2>
            <motion.p variants={fadeUp} className="text-gray-500 max-w-xl mx-auto">
              From Umhlanga to the CBD — we help Durban businesses stand out on Google.
            </motion.p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid md:grid-cols-3 gap-6">
            {SERVICES.map((s) => (
              <motion.div key={s.title} variants={fadeUp} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-4">
                  <s.icon size={22} className="text-emerald-600" />
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">{s.desc}</p>
                <button
                  onClick={() => navigate(`${BASE}${s.cta}`)}
                  className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors"
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
              Durban Industries We Serve
            </motion.h2>
            <motion.p variants={fadeUp} className="text-gray-500">
              We've helped KwaZulu-Natal businesses across every major sector grow their digital presence.
            </motion.p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="flex flex-wrap gap-3 justify-center">
            {INDUSTRIES.map((ind) => (
              <motion.span key={ind} variants={fadeUp} className="px-4 py-2 rounded-full border border-emerald-100 bg-emerald-50 text-emerald-700 text-sm font-medium flex items-center gap-1.5">
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
                Why Durban Businesses Choose Indexify
              </motion.h2>
              {[
                { title: "KZN market advantage", desc: "Durban is less saturated than Joburg or Cape Town. Act now and rank faster with less spend." },
                { title: "Flat monthly fee", desc: "No surprise bills. No percentage of ad spend. A fixed, transparent fee every month." },
                { title: "Remote-first, results-first", desc: "We work remotely with clients across South Africa. Durban businesses get the same level of service as any other city." },
                { title: "Free audit to start", desc: "Every Durban client starts with a free SEO audit showing exactly what needs fixing and why." },
              ].map((item) => (
                <motion.div key={item.title} variants={fadeUp} className="flex gap-3 mb-5">
                  <CheckCircle2 size={20} className="text-emerald-500 shrink-0 mt-0.5" />
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
                "We went from invisible on Google to ranking in the top 3 for our main keywords in Durban. Indexify delivered exactly what they promised."
              </p>
              <p className="font-bold text-sm text-gray-900">— Tourism company, Umhlanga</p>
              <hr className="my-5 border-gray-100" />
              <div className="flex items-center gap-1 mb-2">
                {[1,2,3,4,5].map(i => <Star key={i} size={18} fill="#f59e0b" stroke="none" />)}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-4 italic">
                "Our Google Ads are finally working. We used to waste R15k a month with another agency. Indexify cut that spend in half and doubled our leads."
              </p>
              <p className="font-bold text-sm text-gray-900">— Construction company, Durban North</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
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
      <section className="py-16 bg-gradient-to-r from-emerald-600 to-teal-500">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center text-white">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl font-black mb-3">
            Ready to Dominate Durban Search Results?
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-emerald-100 mb-7">
            Get your free SEO audit and see exactly where your Durban business stands on Google today.
          </motion.p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate(`${BASE}/audit`)}
              className="px-8 py-4 rounded-xl font-bold bg-white text-emerald-700 hover:bg-emerald-50 transition-all duration-300"
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
