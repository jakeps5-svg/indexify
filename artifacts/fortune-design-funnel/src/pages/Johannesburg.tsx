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
  { icon: Search, title: "SEO Agency Johannesburg", desc: "Rank on page 1 for Johannesburg searches. We handle on-page, technical, and local SEO so your business is found before your competitors.", cta: "/services/seo" },
  { icon: MousePointerClick, title: "Google Ads Johannesburg", desc: "Targeted Google Ads campaigns built for the Johannesburg market — put your business in front of buyers actively searching in Joburg.", cta: "/services/google-ads" },
  { icon: TrendingUp, title: "PPC Agency Johannesburg", desc: "Data-driven paid advertising across Search, Display, and Remarketing — all managed for a fixed monthly fee with no percentage of spend.", cta: "/pricing" },
];

const INDUSTRIES = [
  "Attorneys & Legal Firms", "Accountants & Tax Specialists", "Construction & Renovation",
  "Medical & Healthcare", "Real Estate & Property", "eCommerce & Online Retail",
  "IT & Software Companies", "Manufacturing & Industrial", "Beauty & Wellness",
];

const FAQS = [
  { q: "How long does SEO take in Johannesburg?", a: "Johannesburg is a competitive market. Most businesses see measurable ranking improvements in 3–6 months. We provide monthly reports so you can track every step of the progress." },
  { q: "What does Google Ads management cost in Johannesburg?", a: "Our Google Ads management is a flat fee from R7,300/month — no percentage of your ad budget. Your ad spend goes directly to Google, not to us. This saves you money as your campaigns scale." },
  { q: "Do you serve clients outside Johannesburg?", a: "Yes. While we serve many Johannesburg businesses, Indexify is a national agency. We work with businesses in Sandton, Midrand, Randburg, Pretoria, and across South Africa." },
  { q: "Can you help a startup in Johannesburg with limited budget?", a: "Yes. Our Basic SEO package starts at R5,900/month, which is designed for startups and small businesses that want to build a sustainable online presence without overspending." },
];

export default function JohannesburgPage() {
  useSEO({
    title: "SEO Agency Johannesburg | Google Ads | Indexify",
    description: "Johannesburg's trusted SEO and Google Ads agency. Rank on Google page 1 and get more Joburg leads. Packages from R5,900/month. Free SEO audit. No lock-in.",
    keywords: [
      "SEO agency Johannesburg", "Google Ads Johannesburg", "PPC agency Johannesburg",
      "SEO services Johannesburg", "Google Ads management Johannesburg",
      "digital marketing Johannesburg", "SEO company Johannesburg",
      "search engine optimisation Johannesburg", "local SEO Johannesburg",
      "affordable SEO Johannesburg", "Google Ads expert Johannesburg",
      "digital marketing agency Johannesburg", "PPC services Johannesburg",
    ],

  });

  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-16 bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeUp} className="flex items-center justify-center gap-2 mb-5">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                <MapPin size={14} /> Johannesburg, Gauteng
              </div>
              <PoweredByBadge />
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl font-black mb-5 leading-tight">
              Johannesburg's <span className="text-purple-400">SEO & Google Ads</span><br />Agency That Wins
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
              We help Johannesburg businesses rank on Google page 1 and generate qualified leads through data-driven SEO and Google Ads. Fixed pricing. Honest reporting. No lock-in.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate(`${BASE}/audit`)}
                className="px-8 py-4 rounded-xl font-bold text-white bg-purple-600 hover:bg-purple-500 transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2"
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

      {/* Results image */}
      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100">
            <img
              src={`${BASE}/images/city-johannesburg.png`}
              alt="SEO and Google Ads agency Johannesburg — Indexify helps Joburg businesses rank on Google page 1"
              className="w-full h-auto"
              loading="lazy"
              width="1200"
              height="900"
            />
          </div>
          <p className="text-center text-sm text-gray-400 mt-3">Real results from Indexify clients — Johannesburg businesses dominating Google page 1.</p>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-12">
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
              Digital Marketing Services in Johannesburg
            </motion.h2>
            <motion.p variants={fadeUp} className="text-gray-500 max-w-xl mx-auto">
              From Sandton to Soweto — we help Johannesburg businesses dominate Google.
            </motion.p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid md:grid-cols-3 gap-6">
            {SERVICES.map((s) => (
              <motion.div key={s.title} variants={fadeUp} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center mb-4">
                  <s.icon size={22} className="text-purple-600" />
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">{s.desc}</p>
                <button
                  onClick={() => navigate(`${BASE}${s.cta}`)}
                  className="text-sm font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1 transition-colors"
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
              Johannesburg Industries We Serve
            </motion.h2>
            <motion.p variants={fadeUp} className="text-gray-500">
              From Sandton's financial district to Joburg's manufacturing hub — we know the market.
            </motion.p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="flex flex-wrap gap-3 justify-center">
            {INDUSTRIES.map((ind) => (
              <motion.span key={ind} variants={fadeUp} className="px-4 py-2 rounded-full border border-purple-100 bg-purple-50 text-purple-700 text-sm font-medium flex items-center gap-1.5">
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
                Why Johannesburg Businesses Choose Indexify
              </motion.h2>
              {[
                { title: "JHB market expertise", desc: "We understand Joburg's competitive digital landscape and tailor strategies to your specific area and industry." },
                { title: "No percentage of ad spend", desc: "Our fee is flat and fixed. Your full ad budget goes to Google, not to us. Better ROI from day one." },
                { title: "Weekly optimisation", desc: "We don't set and forget. Bids, keywords, and ad copy are reviewed weekly for maximum performance." },
                { title: "Scalable packages", desc: "Start with SEO or Ads, then scale to the full Market Leader package when you're ready." },
              ].map((item) => (
                <motion.div key={item.title} variants={fadeUp} className="flex gap-3 mb-5">
                  <CheckCircle2 size={20} className="text-purple-500 shrink-0 mt-0.5" />
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
                "Indexify took our Sandton accounting firm from page 4 to position 2 in 5 months. The phone hasn't stopped ringing since."
              </p>
              <p className="font-bold text-sm text-gray-900">— Accounting firm, Sandton</p>
              <hr className="my-5 border-gray-100" />
              <div className="flex items-center gap-1 mb-2">
                {[1,2,3,4,5].map(i => <Star key={i} size={18} fill="#f59e0b" stroke="none" />)}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-4 italic">
                "Our Google Ads cost-per-lead dropped from R480 to R190 in the first 6 weeks. The team is meticulous and highly responsive."
              </p>
              <p className="font-bold text-sm text-gray-900">— Property agency, Midrand</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <CityPricing city="Johannesburg" accent="purple" />

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
      <section className="py-16 bg-gradient-to-r from-purple-700 to-purple-600">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center text-white">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl font-black mb-3">
            Ready to Dominate Johannesburg Search Results?
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-purple-200 mb-7">
            Get a free SEO audit and discover every opportunity your Joburg competitors are exploiting.
          </motion.p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate(`${BASE}/audit`)}
              className="px-8 py-4 rounded-xl font-bold bg-white text-purple-700 hover:bg-purple-50 transition-all duration-300"
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

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
        {
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": "Indexify – SEO & Google Ads Agency Johannesburg",
          "url": "https://indexify.co.za/johannesburg/",
          "telephone": "+27602988295",
          "priceRange": "R5,900–R12,500/month",
          "description": "Johannesburg's trusted SEO and Google Ads agency. Rank on Google page 1 and get more Joburg leads.",
          "areaServed": [
            { "@type": "City", "name": "Johannesburg" },
            { "@type": "City", "name": "Sandton" },
            { "@type": "City", "name": "Midrand" },
            { "@type": "City", "name": "Randburg" }
          ],
          "address": { "@type": "PostalAddress", "addressLocality": "Johannesburg", "addressRegion": "Gauteng", "addressCountry": "ZA" },
          "parentOrganization": { "@type": "Organization", "name": "Indexify", "url": "https://indexify.co.za" },
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Johannesburg SEO & Google Ads Services",
            "itemListElement": [
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "SEO Services Johannesburg", "url": "https://indexify.co.za/services/seo/" } },
              { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Google Ads Management Johannesburg", "url": "https://indexify.co.za/services/google-ads/" } }
            ]
          }
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://indexify.co.za/" },
            { "@type": "ListItem", "position": 2, "name": "SEO & Google Ads Johannesburg", "item": "https://indexify.co.za/johannesburg/" }
          ]
        },
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": FAQS.map(f => ({
            "@type": "Question",
            "name": f.q,
            "acceptedAnswer": { "@type": "Answer", "text": f.a }
          }))
        }
      ]) }} />
    </div>
  );
}
