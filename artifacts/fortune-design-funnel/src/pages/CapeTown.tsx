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
  { icon: Search, title: "SEO Agency Cape Town", desc: "Rank on Google page 1 for Cape Town searches. We handle on-page, technical, and local SEO to drive consistent organic traffic to your business.", cta: "/services/seo" },
  { icon: MousePointerClick, title: "Google Ads Cape Town", desc: "Targeted Google Ads campaigns that put your business in front of Cape Town customers the moment they're searching for what you sell.", cta: "/services/google-ads" },
  { icon: TrendingUp, title: "Digital Marketing Cape Town", desc: "Full-funnel digital marketing — from search rankings to paid ads — designed specifically for the Cape Town market.", cta: "/pricing" },
];

const INDUSTRIES = [
  "Plumbers & Electricians", "Attorneys & Law Firms", "Restaurants & Cafés",
  "Dentists & Medical Practices", "Estate Agents", "eCommerce Stores",
  "Accountants & Financial Services", "Construction & Renovation", "Beauty & Wellness",
];

const FAQS = [
  { q: "How long does SEO take in Cape Town?", a: "Most Cape Town businesses start seeing measurable ranking improvements within 3–4 months. Competitive industries like legal or medical may take 6 months. We provide monthly rank-tracking reports so you see progress." },
  { q: "How much do Google Ads cost in Cape Town?", a: "Our Google Ads management starts at R7,300/month (flat fee — no % of spend). Your ad budget is separate. For most Cape Town industries, a starting ad budget of R5,000–R15,000/month is effective." },
  { q: "Do you work with small businesses in Cape Town?", a: "Absolutely. Most of our clients are Cape Town SMEs looking to compete with larger brands online. We have packages starting at R5,900/month designed specifically for small business budgets." },
  { q: "What areas of Cape Town do you service?", a: "We serve clients across all Cape Town areas — CBD, Atlantic Seaboard, Southern Suburbs, Northern Suburbs, Stellenbosch, Paarl, and the entire Western Cape region." },
];

export default function CapeTownPage() {
  useSEO({
    title: "SEO Agency Cape Town | Google Ads | Indexify",
    description: "Cape Town's top-rated SEO and Google Ads agency. Rank higher on Google and get more local leads. Packages from R5,900/month. Free audit.",
    keywords: [
      "SEO agency Cape Town", "Google Ads agency Cape Town", "digital marketing agency Cape Town",
      "SEO services Cape Town", "PPC services Cape Town", "Google Ads Cape Town",
      "SEO company Cape Town", "SEO experts Cape Town", "local SEO Cape Town",
      "Google Ads management Cape Town", "PPC agency Cape Town", "best Google Ads agency Cape Town",
      "affordable SEO Cape Town", "digital marketing Cape Town", "search engine optimisation Cape Town",
    ],
    canonical: "https://indexify.co.za/cape-town",
  });

  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-16 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeUp} className="flex items-center justify-center gap-2 mb-5">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                <MapPin size={14} /> Cape Town, Western Cape
              </div>
              <PoweredByBadge />
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl font-black mb-5 leading-tight">
              Cape Town's <span className="text-teal-400">SEO & Google Ads</span><br />Agency That Delivers
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
              We help Cape Town businesses rank on Google page 1 and generate more leads through targeted SEO and Google Ads. Transparent pricing. No lock-in contracts. Real results.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate(`${BASE}/audit`)}
                className="px-8 py-4 rounded-xl font-bold text-white bg-teal-500 hover:bg-teal-400 transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2"
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
              Digital Marketing Services in Cape Town
            </motion.h2>
            <motion.p variants={fadeUp} className="text-gray-500 max-w-xl mx-auto">
              From Sea Point to Stellenbosch — we help Cape Town businesses dominate Google.
            </motion.p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid md:grid-cols-3 gap-6">
            {SERVICES.map((s) => (
              <motion.div key={s.title} variants={fadeUp} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center mb-4">
                  <s.icon size={22} className="text-teal-600" />
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">{s.desc}</p>
                <button
                  onClick={() => navigate(`${BASE}${s.cta}`)}
                  className="text-sm font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1 transition-colors"
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
              Cape Town Industries We Serve
            </motion.h2>
            <motion.p variants={fadeUp} className="text-gray-500">
              We've helped Cape Town businesses across every major industry grow their online presence.
            </motion.p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="flex flex-wrap gap-3 justify-center">
            {INDUSTRIES.map((ind) => (
              <motion.span key={ind} variants={fadeUp} className="px-4 py-2 rounded-full border border-teal-100 bg-teal-50 text-teal-700 text-sm font-medium flex items-center gap-1.5">
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
                Why Cape Town Businesses Choose Indexify
              </motion.h2>
              {[
                { title: "Local market expertise", desc: "We understand the Cape Town search landscape — from CBD to Northern Suburbs — and what local customers search for." },
                { title: "Fixed monthly fees", desc: "No percentage of ad spend. No hidden fees. You know exactly what you pay every month." },
                { title: "Transparent reporting", desc: "Monthly reports showing your rankings, traffic, and leads — not just vanity metrics." },
                { title: "Quick wins + long-term growth", desc: "We combine Google Ads for immediate leads with SEO for sustainable organic growth." },
              ].map((item) => (
                <motion.div key={item.title} variants={fadeUp} className="flex gap-3 mb-5">
                  <CheckCircle2 size={20} className="text-teal-500 shrink-0 mt-0.5" />
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
                "Indexify got us ranking on page 1 for 'attorney Cape Town' within 4 months. Our enquiries doubled. Best investment we've made in marketing."
              </p>
              <p className="font-bold text-sm text-gray-900">— Law firm, Cape Town CBD</p>
              <hr className="my-5 border-gray-100" />
              <div className="flex items-center gap-1 mb-2">
                {[1,2,3,4,5].map(i => <Star key={i} size={18} fill="#f59e0b" stroke="none" />)}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-4 italic">
                "Our Google Ads campaign managed by Indexify cut our cost-per-lead by 40% in the first month. Incredible ROI."
              </p>
              <p className="font-bold text-sm text-gray-900">— eCommerce store, Northern Suburbs</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <CityPricing city="Cape Town" accent="teal" />

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
      <section className="py-16 bg-gradient-to-r from-teal-600 to-teal-500">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center text-white">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl font-black mb-3">
            Ready to Dominate Cape Town Search Results?
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-teal-100 mb-7">
            Get a free SEO audit and find out exactly what's holding your Cape Town business back on Google.
          </motion.p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate(`${BASE}/audit`)}
              className="px-8 py-4 rounded-xl font-bold bg-white text-teal-700 hover:bg-teal-50 transition-all duration-300"
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
