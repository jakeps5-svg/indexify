import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Target, TrendingUp, Search, MousePointerClick, BarChart3, Users, Star, ChevronDown, MessageCircle } from "lucide-react";
import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { cn } from "@/lib/utils";
import { useSEO } from "@/hooks/useSEO";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

function YocoButton({ type, label, dark = false }: {
  type: string; label: string; dark?: boolean;
}) {
  function handleClick() {
    window.location.href = `${window.location.origin}${BASE}/checkout?type=${type}`;
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        "w-full py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2",
        dark
          ? "bg-primary hover:bg-primary/90 text-white hover:shadow-primary/30"
          : "bg-gray-900 hover:bg-gray-800 text-white hover:shadow-gray-900/20"
      )}
    >
      {label}
    </button>
  );
}

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function Home() {
  useSEO({
    title: "Indexify – SEO & Google Ads Agency South Africa | Rank Higher, Get More Clients",
    description: "South Africa's leading SEO and Google Ads agency. We help businesses rank on Google page 1 and grow revenue with data-driven campaigns. Transparent pricing, real results.",
    keywords: ["SEO South Africa", "Google Ads South Africa", "digital marketing South Africa", "SEO agency Johannesburg", "Cape Town SEO", "SEO agency South Africa", "search engine optimisation South Africa"],
    canonical: "https://indexify.co.za/",
  });

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-white text-foreground">
      <Navbar />

      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-gradient-to-br from-sky-50 via-white to-blue-50">
        <div className="absolute inset-0 z-0">
          <img
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`}
            alt="Abstract background"
            className="w-full h-full object-cover opacity-20 mix-blend-multiply"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-sky-50/50 via-white/60 to-white" />
        </div>

        {/* Decorative circles */}
        <div className="absolute top-20 right-16 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-primary/20 shadow-sm mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-gray-600">South Africa's Top-Rated Marketing Agency</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-[1.1] text-gray-900"
          >
            Dominate <span className="text-gradient">Google.</span><br />
            Get More Clients.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Stop losing customers to your competitors. We build high-converting SEO and Google Ads campaigns that turn clicks into predictable revenue.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href={`${import.meta.env.BASE_URL}audit`}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-primary text-white font-bold text-lg hover:bg-primary/90 hover:-translate-y-1 transition-all duration-300 shadow-lg shadow-primary/25 flex items-center justify-center gap-2"
            >
              Get Free Strategy Audit <ArrowRight size={20} />
            </a>
            <button
              onClick={() => scrollTo("services")}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-gray-700 font-bold text-lg border border-gray-200 hover:border-primary hover:text-primary hover:-translate-y-1 transition-all duration-300 shadow-sm"
            >
              View Our Services
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-10 flex items-center justify-center gap-2"
          >
            <span className="text-xs text-gray-400 uppercase tracking-widest font-medium">Powered by</span>
            <a
              href="https://fortunedesign.co.za"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity duration-300"
            >
              <img
                src={`${import.meta.env.BASE_URL}images/fortune-design-logo.png`}
                alt="Fortune Design"
                className="h-5 w-auto object-contain"
              />
            </a>
          </motion.div>
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

      {/* 2. STATS SECTION */}
      <section id="results" className="py-12 border-b border-gray-100 bg-white relative overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src={`${import.meta.env.BASE_URL}images/results-bg.png`}
            alt=""
            role="presentation"
            aria-hidden="true"
            className="w-full h-full object-cover opacity-5 mix-blend-multiply"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-gray-100"
          >
            {[
              { value: "R500K+", label: "Ad Spend Managed", icon: BarChart3 },
              { value: "200%", label: "Avg. Traffic Increase", icon: TrendingUp },
              { value: "50+", label: "Active Clients", icon: Users },
              { value: "1st", label: "Page Rankings", icon: Target }
            ].map((stat, i) => (
              <motion.div key={i} variants={fadeInUp} className="text-center px-4">
                <div className="flex justify-center mb-4 text-primary">
                  <stat.icon size={32} />
                </div>
                <h3 className="text-3xl md:text-4xl font-black text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 3. SERVICES SECTION */}
      <section id="services" className="py-24 relative overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <img
            src={`${import.meta.env.BASE_URL}images/results-bg.png`}
            alt=""
            role="presentation"
            aria-hidden="true"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, hsl(198 69% 18% / 0.93) 0%, hsl(220 40% 10% / 0.95) 100%)" }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-white">Our Core <span className="text-primary">Services</span></h2>
            <p className="text-lg text-white/60">We don't do everything. We focus exclusively on search marketing to deliver unmatched results for our clients.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* SEO Card */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-3xl group hover:border-primary/40 border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-500 relative overflow-hidden flex flex-col"
            >
              {/* Image banner */}
              <div className="relative h-52 overflow-hidden rounded-t-3xl bg-sky-50">
                <img
                  src={`${import.meta.env.BASE_URL}images/seo-illustration.png`}
                  alt="SEO illustration"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/60 to-transparent" />
                <div className="absolute bottom-4 left-6 w-12 h-12 rounded-xl bg-primary/90 flex items-center justify-center shadow-lg">
                  <Search size={22} className="text-white" />
                </div>
              </div>

              <div className="p-8 md:p-10 flex-1 flex flex-col">
                <h3 className="text-3xl font-bold mb-4 text-gray-900">Search Engine Optimization</h3>
                <p className="text-gray-500 mb-8 leading-relaxed">
                  Dominate organic search results. We optimize your website to rank on page 1 for the keywords your customers are actively searching for.
                </p>

                <ul className="space-y-4 mb-10 flex-1">
                  {[
                    "In-depth Keyword Strategy & Research",
                    "Technical Website Optimization",
                    "Local SEO for SA Businesses",
                    "High-Authority Backlink Building"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-700">
                      <CheckCircle2 className="text-primary shrink-0 mt-0.5" size={20} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <a href={`${import.meta.env.BASE_URL}services/seo`} className="w-full py-4 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 font-semibold hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 flex items-center justify-center gap-2">
                  Learn More About SEO <ArrowRight size={16} />
                </a>
              </div>
            </motion.div>

            {/* Google Ads Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-3xl group hover:border-accent/40 border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-500 relative overflow-hidden flex flex-col"
            >
              {/* Image banner */}
              <div className="relative h-52 overflow-hidden rounded-t-3xl bg-violet-50">
                <img
                  src={`${import.meta.env.BASE_URL}images/ads-illustration.png`}
                  alt="Google Ads illustration"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/60 to-transparent" />
                <div className="absolute bottom-4 left-6 w-12 h-12 rounded-xl bg-accent flex items-center justify-center shadow-lg">
                  <MousePointerClick size={22} className="text-white" />
                </div>
              </div>

              <div className="p-8 md:p-10 flex-1 flex flex-col">
                <h3 className="text-3xl font-bold mb-4 text-gray-900">Google Ads Management</h3>
                <p className="text-gray-500 mb-8 leading-relaxed">
                  Instant visibility and predictable leads. We build highly targeted PPC campaigns that maximize your ROI and minimize wasted ad spend.
                </p>

                <ul className="space-y-4 mb-10 flex-1">
                  {[
                    "Hyper-targeted Search Campaigns",
                    "Conversion Rate Optimization (CRO)",
                    "Advanced Retargeting Strategies",
                    "Detailed ROI & Performance Reporting"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-700">
                      <CheckCircle2 className="text-primary shrink-0 mt-0.5" size={20} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <a href={`${import.meta.env.BASE_URL}services/google-ads`} className="w-full py-4 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 font-semibold hover:bg-accent hover:text-white hover:border-accent transition-all duration-300 flex items-center justify-center gap-2">
                  Learn More About Google Ads <ArrowRight size={16} />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. REVIEWS SECTION */}
      <section id="reviews" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-gray-900">Client <span className="text-primary">Success Stories</span></h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">Don't just take our word for it. Here's what South African business owners have to say about working with Indexify.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                text: "We are extremely impressed with the results delivered by Indexify! Thanks to their strategic approach and consistent efforts, Rapple is now ranking on Page 1 of Google — a major milestone for our brand visibility and online growth. Highly recommend their services to any business looking to seriously boost their online presence.",
                author: "Leon De Wet",
                role: "Rapple Products"
              },
              {
                text: "Indexify has provided outstanding service. Our Google ranking skyrocketed from virtually nowhere to one of the top positions, and we began receiving significantly more inquiries almost immediately. Their team identified numerous gaps and errors that our previous SEO provider had missed. We highly recommend Indexify for anyone seeking expert Google optimization.",
                author: "Serenity Villa Daniela",
                role: "Luxury Villa Rentals"
              },
              {
                text: "Indexify's SEO work has completely changed our online presence. We are now ranking on page 1 for our most important search terms and the leads coming through Google have grown steadily every month. Very happy with the results and the service.",
                author: "Michael",
                role: "Captuna Charters"
              },
              {
                text: "Indexify ran our Google Ads campaign and the ROI was exceptional. From the very first month we started receiving high-quality leads. They handled everything professionally and the reporting was always clear and transparent. Highly recommend.",
                author: "Jashmir Jungbahadur",
                role: "JJS Leather"
              }
            ].map((review, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-md hover:border-primary/30 transition-all duration-300"
              >
                <div className="flex gap-1 text-amber-400 mb-6">
                  {[...Array(5)].map((_, j) => <Star key={j} size={20} fill="currentColor" />)}
                </div>
                <p className="text-lg font-medium text-gray-700 leading-relaxed mb-6">"{review.text}"</p>
                <div>
                  <p className="font-bold text-gray-900">{review.author}</p>
                  <p className="text-sm text-gray-500">{review.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICE CTAs SECTION */}
      <section id="service-packages" className="py-24 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Everything You Need to <span className="text-gradient">Dominate Google</span></h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">From free audits to full-service campaigns — choose what fits your business right now.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* SEO */}
            <motion.div
              variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="group relative rounded-3xl border border-gray-200 bg-white p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:scale-125 transition-transform duration-500" />
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                <Search size={24} className="text-primary" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">Search Engine Optimisation</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">Rank on Page 1 organically. Build compounding traffic that keeps delivering — without paying per click.</p>
              <ul className="space-y-2 mb-8">
                {["Local & Nationwide keyword ranking", "Technical SEO & backlink building", "Monthly performance reports"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle2 size={14} className="text-primary shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <div className="flex gap-3">
                <a href={`${BASE}/services/seo`} className="flex-1 py-3 rounded-xl border border-primary text-primary font-bold text-sm text-center hover:bg-primary/5 transition-all">
                  Learn More
                </a>
                <a href={`${BASE}/pricing`} className="flex-1 py-3 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/90 hover:-translate-y-0.5 transition-all shadow-md shadow-primary/20 text-center">
                  Get Started →
                </a>
              </div>
            </motion.div>

            {/* Google Ads */}
            <motion.div
              variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="group relative rounded-3xl border border-gray-200 bg-white p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:scale-125 transition-transform duration-500" />
              <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-5">
                <MousePointerClick size={24} className="text-accent" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">Google Ads Management</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">Get leads from day one. We build, manage, and optimise campaigns that deliver real ROI on your ad spend.</p>
              <ul className="space-y-2 mb-8">
                {["Full campaign setup & restructure", "Conversion tracking & A/B testing", "No % of ad spend — flat fee only"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle2 size={14} className="text-accent shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <div className="flex gap-3">
                <a href={`${BASE}/services/google-ads`} className="flex-1 py-3 rounded-xl border font-bold text-sm text-center transition-all hover:-translate-y-0.5" style={{ borderColor: "hsl(259 100% 65%)", color: "hsl(259 100% 50%)" }}>
                  Learn More
                </a>
                <a href={`${BASE}/pricing`} className="flex-1 py-3 rounded-xl text-white font-bold text-sm hover:-translate-y-0.5 transition-all shadow-md text-center" style={{ background: "hsl(259 100% 65%)", boxShadow: "0 4px 16px hsl(259 100% 65% / 0.3)" }}>
                  Get Started →
                </a>
              </div>
            </motion.div>

            {/* Free Google Ads Proposal */}
            <motion.div
              variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="group relative rounded-3xl border-2 border-dashed border-primary/30 bg-sky-50/40 p-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                <BarChart3 size={24} className="text-primary" />
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold mb-3">Free</div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">Google Ads Proposal</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">Enter your website URL and get an AI-generated Google Ads campaign strategy in under 30 seconds — keywords, ad copy, and budgets included.</p>
              <ul className="space-y-2 mb-8">
                {["Campaign structure & keywords", "Ad copy suggestions per group", "Unlock full report for R500"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle2 size={14} className="text-primary shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <a href={`${BASE}/ads-audit`} className="block w-full py-3.5 rounded-xl bg-primary text-white font-bold text-sm text-center hover:bg-primary/90 hover:-translate-y-0.5 transition-all shadow-md shadow-primary/20">
                Generate Free Proposal →
              </a>
            </motion.div>

            {/* Website Audit */}
            <motion.div
              variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="group relative rounded-3xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-5">
                <TrendingUp size={24} className="text-gray-600" />
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold mb-3">Free</div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">Free SEO Audit</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">Discover what's holding your website back. Get an instant SEO health check with actionable fixes you can implement today.</p>
              <ul className="space-y-2 mb-8">
                {["Page speed & technical issues", "Keyword & content gaps", "Instant actionable recommendations"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle2 size={14} className="text-gray-500 shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <a href={`${BASE}/audit`} className="block w-full py-3.5 rounded-xl bg-gray-900 text-white font-bold text-sm text-center hover:bg-gray-800 hover:-translate-y-0.5 transition-all shadow-md">
                Run Free Audit →
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. PRICING SECTION */}
      <section id="pricing" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-gray-900">Transparent <span className="text-primary">Pricing</span></h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">Investment levels designed for businesses ready to scale. No hidden fees, no long-term lock-ins.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-center max-w-5xl mx-auto">
            {/* Basic SEO */}
            <motion.div
              variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm"
            >
              <h3 className="text-xl font-bold mb-2 text-gray-900">Basic SEO</h3>
              <p className="text-gray-500 mb-6 text-sm">Perfect for local businesses</p>
              <div className="mb-8">
                <span className="text-4xl font-black text-gray-900">From R5,900</span>
                <span className="text-gray-400">/mo</span>
              </div>
              <ul className="space-y-4 mb-8">
                {["Local SEO Setup", "Basic Keyword Strategy", "Google My Business", "Monthly Reporting"].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-gray-600">
                    <CheckCircle2 className="text-primary" size={16} /> {feature}
                  </li>
                ))}
              </ul>
              <a href={`${BASE}/pricing`} className="block w-full py-3 rounded-xl bg-primary text-white font-bold text-sm text-center hover:bg-primary/90 hover:-translate-y-0.5 transition-all shadow-md shadow-primary/20">
                View Full Packages →
              </a>
            </motion.div>

            {/* Market Leader (Highlighted) */}
            <motion.div
              variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="bg-gray-900 border-2 border-primary rounded-3xl p-8 relative shadow-xl shadow-primary/10 md:scale-105 z-10"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                Most Popular
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Market Leader</h3>
              <p className="text-gray-400 mb-6 text-sm">SEO + Google Ads combined</p>
              <div className="mb-8">
                <span className="text-4xl font-black text-white">From R12,500</span>
                <span className="text-gray-400">/mo</span>
              </div>
              <ul className="space-y-4 mb-8">
                {["Advanced SEO Strategy", "Google Ads Management", "Conversion Optimization", "Competitor Analysis", "Bi-weekly Strategy Calls"].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-gray-200">
                    <CheckCircle2 className="text-primary" size={16} /> {feature}
                  </li>
                ))}
              </ul>
              <a href={`${BASE}/pricing`} className="block w-full py-3 rounded-xl bg-primary text-white font-bold text-sm text-center hover:bg-primary/90 hover:-translate-y-0.5 transition-all shadow-md">
                View Full Packages →
              </a>
            </motion.div>

            {/* Enterprise */}
            <motion.div
              variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm"
            >
              <h3 className="text-xl font-bold mb-2 text-gray-900">Enterprise</h3>
              <p className="text-gray-500 mb-6 text-sm">For national/ecom brands</p>
              <div className="mb-8">
                <span className="text-4xl font-black text-gray-900">Custom</span>
              </div>
              <ul className="space-y-4 mb-8">
                {["Full Omnichannel Strategy", "E-commerce SEO", "High-Budget Ads Scaling", "Custom Data Dashboards"].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-gray-600">
                    <CheckCircle2 className="text-primary" size={16} /> {feature}
                  </li>
                ))}
              </ul>
              <a href={`${BASE}/pricing`} className="block w-full py-3 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-semibold text-sm text-center transition-colors">
                View Full Packages →
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 6. FAQ SECTION */}
      <section className="py-24 bg-white border-y border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black mb-4 text-gray-900">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "How long does it take to see results from SEO?",
                a: "SEO is a long-term strategy. While some technical fixes yield quick bumps, significant organic traffic growth typically takes 3-6 months depending on your industry's competitiveness."
              },
              {
                q: "Do you require long-term contracts?",
                a: "No. We believe our results should keep you, not a contract. We operate on month-to-month agreements, though we recommend committing to at least 3 months for SEO to see real impact."
              },
              {
                q: "Google Ads vs SEO: Which should I choose?",
                a: "Google Ads provides immediate leads and traffic, while SEO builds sustainable, free long-term traffic. For most ambitious businesses, a combined approach yields the highest ROI."
              }
            ].map((faq, i) => (
              <FAQItem key={i} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* 7. FINAL CTA */}
      <section id="contact" className="py-32 relative overflow-hidden bg-gradient-to-br from-sky-50 via-white to-blue-50">
        <div className="absolute top-10 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <h2 className="text-5xl md:text-6xl font-black mb-6 text-gray-900">Ready to scale your revenue?</h2>
          <p className="text-xl text-gray-500 mb-10">Stop leaving money on the table. Let's build a predictable client acquisition system for your business today.</p>

          <button
            onClick={() => document.querySelector('button[aria-label="Chat on WhatsApp"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))}
            className="inline-flex items-center gap-3 px-8 py-5 rounded-2xl bg-primary text-white font-black text-xl hover:bg-primary/90 hover:scale-105 transition-all duration-300 shadow-xl shadow-primary/25"
          >
            <MessageCircle size={28} />
            Chat with us on WhatsApp
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between text-left font-semibold text-lg text-gray-900 hover:bg-gray-50 transition-colors"
      >
        {question}
        <ChevronDown className={cn("transition-transform duration-300 text-primary shrink-0", isOpen && "rotate-180")} />
      </button>
      <div
        className={cn(
          "px-6 text-gray-500 overflow-hidden transition-all duration-300",
          isOpen ? "max-h-48 pb-5 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        {answer}
      </div>
    </div>
  );
}
