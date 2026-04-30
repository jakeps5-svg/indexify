import { motion } from "framer-motion";
import {
  Palette, CheckCircle2, ArrowRight, Monitor, Smartphone,
  Zap, Search, ShoppingCart, ChevronDown, ChevronUp,
  Layout, Code2, Globe, Star, Users, MessageSquare,
  Clock, Shield, RefreshCw, Eye,
} from "lucide-react";
import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useSEO } from "@/hooks/useSEO";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const fade = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};
const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const FEATURES = [
  { icon: Monitor,     title: "Desktop & Mobile Responsive",  desc: "Pixel-perfect on every screen — from 4K monitors to budget Android phones." },
  { icon: Zap,         title: "Fast Loading Pages",           desc: "Optimised for Core Web Vitals and sub-2-second load times." },
  { icon: Search,      title: "Built SEO-Ready",              desc: "Correct heading structure, schema markup, and clean URLs from day one." },
  { icon: ShoppingCart,title: "Lead Generation Focused",      desc: "Clear calls-to-action, contact forms, and conversion-optimised layouts." },
  { icon: Code2,       title: "Clean, Maintainable Code",     desc: "Modern frameworks with no bloated page builders you can't update." },
  { icon: Globe,       title: "Hosted & Launched for You",    desc: "We handle domain setup, hosting config, SSL, and go-live." },
];

const PACKAGES = [
  {
    name: "Starter Website",
    price: "R8,500",
    period: "once-off",
    tag: "Perfect for new businesses",
    color: "from-rose-400 to-pink-500",
    border: "border-rose-200",
    includes: [
      "Up to 5 pages",
      "Mobile responsive design",
      "Contact form",
      "Basic SEO setup",
      "SSL certificate",
      "1 round of revisions",
    ],
  },
  {
    name: "Business Website",
    price: "R14,500",
    period: "once-off",
    tag: "Most popular",
    featured: true,
    color: "from-rose-500 to-violet-500",
    border: "border-rose-300",
    includes: [
      "Up to 10 pages",
      "Custom UI design",
      "Blog / news section",
      "Google Analytics setup",
      "Advanced SEO structure",
      "2 rounds of revisions",
      "1 month post-launch support",
    ],
  },
  {
    name: "eCommerce Website",
    price: "R22,000",
    period: "once-off",
    tag: "Full online store",
    color: "from-violet-500 to-purple-600",
    border: "border-violet-200",
    includes: [
      "Unlimited products",
      "Payment gateway integration",
      "Order management system",
      "Inventory tracking",
      "Mobile-optimised checkout",
      "3 rounds of revisions",
      "2 months post-launch support",
    ],
  },
];

const PROCESS = [
  { step: "01", title: "Discovery & Brief",      desc: "We learn about your business, target audience, competitors, and goals. You fill in a short brief — we do the rest.", icon: MessageSquare },
  { step: "02", title: "Design Mockup",          desc: "We design a full desktop and mobile mockup in Figma. You see exactly what your site will look like before a single line of code.", icon: Eye },
  { step: "03", title: "Build & Review",         desc: "We build the live site and send you a staging link. You test everything and send revision requests.", icon: Code2 },
  { step: "04", title: "Launch & Handover",      desc: "We launch to your domain, configure SSL, submit to Google, and hand over your login credentials.", icon: Globe },
];

const FAQS = [
  { q: "How long does it take to build a website?", a: "Starter sites are typically delivered in 7–10 business days. Business websites take 14–21 days. eCommerce sites take 3–5 weeks depending on the product catalogue size." },
  { q: "Do I need to provide content and images?", a: "We'll guide you on what we need. You provide your logo, brand colours, and key content (or we can write copy at an additional cost). We source professional stock photography where needed." },
  { q: "Will I be able to update the website myself?", a: "Yes. We build on platforms that include a simple content management system so you can update text, images, and blog posts without touching any code." },
  { q: "Is hosting included?", a: "Hosting is not included in the once-off price, but we can set up and manage hosting for you from R350/month — including SSL, daily backups, and uptime monitoring." },
  { q: "Can you redesign my existing website?", a: "Absolutely. Redesigns follow the same process as new builds. We migrate your existing content and improve the design, performance, and SEO in the process." },
  { q: "Do you combine web design with SEO?", a: "Yes — and we strongly recommend it. A new website with proper SEO from day one ranks significantly faster than a retrofitted one. We offer bundle pricing when you combine Web Design with any SEO package." },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm cursor-pointer" onClick={() => setOpen(!open)}>
      <div className="flex items-center justify-between px-6 py-4 gap-4">
        <span className="font-semibold text-gray-900 text-sm leading-snug">{q}</span>
        {open ? <ChevronUp size={16} className="shrink-0 text-gray-400" /> : <ChevronDown size={16} className="shrink-0 text-gray-400" />}
      </div>
      {open && <div className="px-6 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">{a}</div>}
    </div>
  );
}

export default function WebDesignPage() {
  useSEO({
    title: "Web Design South Africa | Professional Websites | Indexify",
    description: "Custom web design for South African businesses. Mobile-responsive, SEO-ready websites built to convert. Starter from R8,500 once-off.",
  });

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-rose-950 text-white overflow-hidden pt-28 pb-20">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 30% 50%, #f43f5e 0%, transparent 60%), radial-gradient(circle at 80% 20%, #8b5cf6 0%, transparent 50%)" }} />
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fade} className="inline-flex items-center gap-2 bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
              <Palette size={12} /> Web Design
            </motion.div>
            <motion.h1 variants={fade} className="text-4xl md:text-6xl font-black leading-tight mb-6">
              Websites That Win<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-400">Customers for You</span>
            </motion.h1>
            <motion.p variants={fade} className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Custom-built, mobile-first websites for South African businesses. Fast, SEO-ready, and designed to convert visitors into leads.
            </motion.p>
            <motion.div variants={fade} className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href={`${BASE}/contact`} className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:opacity-90 text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-lg shadow-rose-500/30">
                Get a Free Quote <ArrowRight size={16} />
              </a>
              <a href={`${BASE}/pricing`} className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold px-8 py-4 rounded-2xl transition-all">
                View Pricing
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fade} className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">Everything Your Website Needs</h2>
              <p className="text-gray-500 max-w-xl mx-auto">Every site we build includes these as standard — not add-ons.</p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map(({ icon: Icon, title, desc }, i) => (
                <motion.div key={i} variants={fade} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center mb-4">
                    <Icon size={18} className="text-rose-500" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1.5">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Packages */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fade} className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">Web Design Packages</h2>
              <p className="text-gray-500">Once-off pricing. No hidden fees. No monthly retainer required.</p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PACKAGES.map((pkg, i) => (
                <motion.div key={i} variants={fade}
                  className={`relative rounded-3xl border-2 ${pkg.border} p-7 flex flex-col ${pkg.featured ? "bg-gradient-to-b from-rose-50 to-white shadow-xl shadow-rose-100" : "bg-white shadow-sm"}`}>
                  {pkg.featured && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-black px-4 py-1 rounded-full shadow">
                      MOST POPULAR
                    </div>
                  )}
                  <div className={`inline-flex w-fit text-xs font-bold px-3 py-1 rounded-full mb-4 ${pkg.featured ? "bg-rose-100 text-rose-600" : "bg-gray-100 text-gray-500"}`}>
                    {pkg.tag}
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-1">{pkg.name}</h3>
                  <div className="mb-5">
                    <span className="text-4xl font-black text-gray-900">{pkg.price}</span>
                    <span className="text-gray-400 text-sm ml-1">{pkg.period}</span>
                  </div>
                  <ul className="space-y-2.5 mb-7 flex-1">
                    {pkg.includes.map((item, j) => (
                      <li key={j} className="flex items-center gap-2.5 text-sm text-gray-700">
                        <CheckCircle2 size={14} className="text-rose-500 shrink-0" /> {item}
                      </li>
                    ))}
                  </ul>
                  <a href={`${BASE}/contact`}
                    className={`w-full text-center py-3.5 rounded-2xl font-bold text-sm transition-all ${pkg.featured ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:opacity-90 shadow-lg shadow-rose-200" : "bg-gray-900 text-white hover:bg-gray-800"}`}>
                    Get a Quote
                  </a>
                </motion.div>
              ))}
            </div>
            <motion.p variants={fade} className="text-center text-sm text-gray-400 mt-6">
              All prices exclude VAT. Custom quotes available for larger projects.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fade} className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">How It Works</h2>
              <p className="text-gray-500">From brief to live website — a clear, simple process.</p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {PROCESS.map(({ step, title, desc, icon: Icon }, i) => (
                <motion.div key={i} variants={fade} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-rose-200">
                    {step}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why us */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div variants={fade}>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-5">Why Choose Indexify for Web Design?</h2>
              <div className="space-y-4">
                {[
                  { icon: Search,   text: "Every site is built SEO-first so Google can find and rank you from day one." },
                  { icon: Zap,      text: "We optimise for speed — slow sites lose customers and rank lower on Google." },
                  { icon: Shield,   text: "We don't use cheap page builders that break. Clean code that lasts." },
                  { icon: RefreshCw,text: "Post-launch support included on every package — we don't disappear after go-live." },
                ].map(({ icon: Icon, text }, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon size={14} className="text-rose-500" />
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
              <a href={`${BASE}/contact`} className="inline-flex items-center gap-2 mt-8 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold px-7 py-3.5 rounded-2xl hover:opacity-90 transition-all shadow-lg shadow-rose-200">
                Start Your Project <ArrowRight size={15} />
              </a>
            </motion.div>
            <motion.div variants={fade} className="grid grid-cols-2 gap-4">
              {[
                { val: "7–10", label: "Days to deliver starter sites" },
                { val: "100%", label: "Mobile-responsive by default" },
                { val: "SEO", label: "Built in from the ground up" },
                { val: "R350", label: "Monthly hosting from" },
              ].map(({ val, label }, i) => (
                <div key={i} className="bg-slate-50 border border-gray-100 rounded-2xl p-5 text-center">
                  <p className="text-3xl font-black text-gray-900 mb-1">{val}</p>
                  <p className="text-xs text-gray-500">{label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fade} className="text-center mb-10">
              <h2 className="text-3xl font-black text-gray-900 mb-2">Frequently Asked Questions</h2>
              <p className="text-gray-500 text-sm">Everything you need to know before getting started.</p>
            </motion.div>
            <motion.div variants={stagger} className="space-y-3">
              {FAQS.map((faq, i) => <motion.div key={i} variants={fade}><FAQItem {...faq} /></motion.div>)}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-slate-950 to-rose-950 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.h2 variants={fade} className="text-3xl md:text-4xl font-black mb-4">Ready to Build Your Website?</motion.h2>
            <motion.p variants={fade} className="text-slate-300 mb-8 text-lg">Get a free quote today. We'll come back to you within one business day.</motion.p>
            <motion.div variants={fade} className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href={`${BASE}/contact`} className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold px-8 py-4 rounded-2xl hover:opacity-90 transition-all shadow-lg shadow-rose-500/30">
                Get a Free Quote <ArrowRight size={16} />
              </a>
              <a href={`${BASE}/services`} className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold px-8 py-4 rounded-2xl transition-all">
                View All Services
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
