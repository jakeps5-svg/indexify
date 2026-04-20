import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Target, TrendingUp, Search, MousePointerClick, BarChart3, Users, Star, ChevronDown, MessageCircle, ExternalLink } from "lucide-react";
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
    title: "SEO & Google Ads Agency South Africa | Indexify",
    description: "South Africa's top SEO & Google Ads agency. Rank on page 1 and win more clients. Cape Town, JHB, Durban & Pretoria. Free audit included.",
    keywords: [
      "SEO agency South Africa", "Google Ads agency South Africa", "digital marketing agency Cape Town",
      "SEO services South Africa", "Google Ads management South Africa",
      "hire SEO agency South Africa", "best Google Ads agency Cape Town",
      "digital marketing strategies South Africa", "how to get more clients online South Africa",
      "SEO agency Cape Town", "SEO agency Johannesburg", "SEO agency Durban",
      "SEO agency Pretoria", "SEO agency Port Elizabeth", "digital marketing agency South Africa",
      "affordable SEO services SA", "affordable PPC services South Africa",
      "search engine optimisation South Africa", "PPC management South Africa",
      "digital marketing Sandton", "SEO Centurion", "SEO Midrand", "SEO Stellenbosch",
      "SEO East London", "SEO Bloemfontein", "SEO Nelspruit", "SEO Polokwane",
    ],

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
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden" style={{ background: "linear-gradient(135deg, #020b18 0%, #050f22 50%, #080d1e 100%)" }}>

        {/* Fine dot grid */}
        <div className="absolute inset-0 z-0" style={{
          backgroundImage: "radial-gradient(circle, rgba(14,165,200,0.35) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          opacity: 0.45,
        }} />

        {/* Large cell grid overlay */}
        <div className="absolute inset-0 z-0" style={{
          backgroundImage: `
            linear-gradient(rgba(14,165,200,0.18) 1px, transparent 1px),
            linear-gradient(90deg, rgba(14,165,200,0.18) 1px, transparent 1px)
          `,
          backgroundSize: "112px 112px",
          opacity: 0.6,
        }} />

        {/* Radial centre glow — teal */}
        <div className="absolute inset-0 z-0" style={{ background: "radial-gradient(ellipse 70% 55% at 50% 38%, rgba(14,165,200,0.18) 0%, transparent 65%)" }} />

        {/* Top-right teal orb */}
        <div className="absolute -top-10 right-[8%] w-[480px] h-[480px] rounded-full blur-[120px] pointer-events-none" style={{ background: "rgba(14,165,200,0.22)" }} />
        {/* Bottom-left violet orb */}
        <div className="absolute bottom-10 -left-10 w-80 h-80 rounded-full blur-[90px] pointer-events-none" style={{ background: "rgba(124,77,255,0.25)" }} />
        {/* Centre deep glow */}
        <div className="absolute top-[40%] left-[35%] w-[400px] h-[200px] rounded-full blur-[80px] pointer-events-none" style={{ background: "rgba(14,165,200,0.08)" }} />


        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-primary/30 shadow-sm mb-8 backdrop-blur-sm"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-white/80">South Africa's Top-Rated Marketing Agency</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-[1.1] text-white"
          >
            Dominate <span className="text-gradient">Google.</span><br />
            Get More Clients.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed"
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
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-primary text-white font-bold text-lg hover:bg-primary/90 hover:-translate-y-1 transition-all duration-300 shadow-lg shadow-primary/30 flex items-center justify-center gap-2"
            >
              Get Free Strategy Audit <ArrowRight size={20} />
            </a>
            <button
              onClick={() => scrollTo("services")}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/10 text-white font-bold text-lg border border-white/20 hover:bg-white/20 hover:-translate-y-1 transition-all duration-300 backdrop-blur-sm"
            >
              View Our Services
            </button>
          </motion.div>

          {/* Google Rating Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8 flex justify-center"
          >
            <a
              href="https://share.google/VKvRu96HUIY2AxKnj"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 group"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">5.0</span>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="text-amber-400" fill="currentColor" />
                  ))}
                </div>
                <span className="text-sm text-white/70">Google Reviews</span>
              </div>
              <ExternalLink size={13} className="text-white/40 group-hover:text-white/70 transition-colors" />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-10 flex items-center justify-center gap-3"
          >
            <span className="text-base text-white/40 uppercase tracking-widest font-semibold">Powered by</span>
            <a
              href="https://fortunedesign.co.za"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity duration-300"
            >
              <img
                src={`${import.meta.env.BASE_URL}images/fortune-design-logo.png`}
                alt="Fortune Design"
                className="h-28 w-auto object-contain"
              />
            </a>
          </motion.div>
        </div>
      </section>

      {/* CLIENT LOGOS BANNER */}
      <section className="py-14 bg-gray-900 overflow-hidden">
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
              <div key={i} className="flex items-center justify-center mx-10 shrink-0">
                <img
                  src={src}
                  alt="Client logo"
                  className="h-24 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity duration-300"
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

      {/* DASHBOARD PREVIEW SECTION */}
      <section className="py-20 bg-gray-50 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4 tracking-wide uppercase">Live Results</span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">Every rand tracked. <span className="text-primary">Every result visible.</span></h2>
            <p className="text-gray-500 max-w-xl mx-auto">Your dedicated client portal gives you real-time visibility into rankings, traffic, and ad performance — all in one place.</p>
          </motion.div>

          {/* Browser mockup frame */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="rounded-2xl overflow-hidden shadow-2xl border border-gray-200 bg-white"
          >
            {/* Browser chrome bar */}
            <div className="bg-gray-100 border-b border-gray-200 px-4 py-3 flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-400" />
                <span className="w-3 h-3 rounded-full bg-yellow-400" />
                <span className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 bg-white rounded-md px-3 py-1 text-xs text-gray-400 border border-gray-200 max-w-xs mx-auto text-center">
                portal.indexify.co.za
              </div>
            </div>
            {/* Dashboard screenshot */}
            <img
              src={`${import.meta.env.BASE_URL}images/dashboard-preview.png`}
              alt="Indexify client portal showing SEO rankings and Google Ads performance metrics"
              className="w-full object-cover object-top max-h-[420px]"
            />
          </motion.div>

          {/* Proof points below */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-3 gap-6 mt-8"
          >
            {[
              { label: "Keyword rank tracking", desc: "Updated weekly" },
              { label: "Ad spend & ROI reports", desc: "Real-time data" },
              { label: "Monthly strategy calls", desc: "Dedicated account manager" },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <CheckCircle2 className="mx-auto text-primary mb-2" size={22} />
                <p className="font-semibold text-gray-800 text-sm">{item.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 3. SERVICES SECTION */}
      <section id="services" className="py-24 relative overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)" }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-white">Our Core <span className="text-primary">Services</span></h2>
            <p className="text-lg text-white/60">We don't do everything. We focus exclusively on search marketing to deliver unmatched results for our clients.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* SEO Card */}
            <div
              className="bg-white rounded-3xl group hover:border-primary/40 border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-500 relative overflow-hidden flex flex-col"
            >
              {/* Image banner */}
              <div className="relative h-52 overflow-hidden rounded-t-3xl bg-sky-50">
                <img
                  src={`${import.meta.env.BASE_URL}images/seo-illustration.png`}
                  alt="SEO illustration"
                  className="w-full h-full object-cover"
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
            </div>

            {/* Google Ads Card */}
            <div
              className="bg-white rounded-3xl group hover:border-accent/40 border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-500 relative overflow-hidden flex flex-col"
            >
              {/* Image banner */}
              <div className="relative h-52 overflow-hidden rounded-t-3xl bg-violet-50">
                <img
                  src={`${import.meta.env.BASE_URL}images/ads-illustration.png`}
                  alt="Google Ads illustration"
                  className="w-full h-full object-cover"
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
            </div>
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

          {/* Featured client result image */}
          <div className="mb-12 rounded-3xl overflow-hidden shadow-xl relative max-h-72">
            <img
              src={`${import.meta.env.BASE_URL}images/rank-first-page.png`}
              alt="SEO expert showing how Indexify helps South African businesses rank on the first page of Google Search"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/70 via-gray-900/30 to-transparent flex items-center">
              <div className="p-8 md:p-12 max-w-md">
                <p className="text-white text-xl md:text-2xl font-black leading-snug mb-2">"Page 1 on Google — and the leads keep coming."</p>
                <p className="text-white/70 text-sm">— Clients across South Africa</p>
              </div>
            </div>
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
                author: "Daniela Ciman",
                role: "Serenity Villa"
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

          {/* Google Reviews CTA */}
          <div className="mt-12 text-center">
            <a
              href="https://share.google/VKvRu96HUIY2AxKnj"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-7 py-4 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900">5.0</span>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} className="text-amber-400" fill="currentColor" />
                  ))}
                </div>
                <span className="text-gray-500 text-sm">· See all our Google reviews</span>
              </div>
              <ExternalLink size={14} className="text-gray-400 group-hover:text-primary transition-colors" />
            </a>
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
              className="group relative rounded-3xl border border-gray-200 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              <div className="h-40 overflow-hidden rounded-t-3xl">
                <img
                  src={`${BASE}/images/seo-optimization.png`}
                  alt="Search engine optimization gears illustration"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="p-8">
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
              </div>
            </motion.div>

            {/* Google Ads */}
            <motion.div
              variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="group relative rounded-3xl border border-gray-200 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              <div className="h-40 overflow-hidden rounded-t-3xl">
                <img
                  src={`${BASE}/images/google-ads-manager.png`}
                  alt="Google Ads manager reviewing campaign analytics and performance metrics"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="p-8">
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
              <a href={`${BASE}/packages/basic-seo`} className="block w-full py-3 rounded-xl bg-primary text-white font-bold text-sm text-center hover:bg-primary/90 hover:-translate-y-0.5 transition-all shadow-md shadow-primary/20">
                Get Started →
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
              <a href={`${BASE}/packages/market-leader`} className="block w-full py-3 rounded-xl bg-primary text-white font-bold text-sm text-center hover:bg-primary/90 hover:-translate-y-0.5 transition-all shadow-md">
                Get Started →
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
              <a href={`${BASE}/contact`} className="block w-full py-3 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-semibold text-sm text-center transition-colors">
                Get Started →
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

      {/* TEAM IMAGE SECTION */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">A team obsessed with <span className="text-gradient">your growth</span></h2>
              <p className="text-lg text-gray-500 leading-relaxed mb-6">Every campaign we run is backed by strategy, data, and a relentless focus on the metrics that actually matter — leads, calls, and revenue.</p>
              <p className="text-lg text-gray-500 leading-relaxed">We don't outsource. We don't automate your account away. You get dedicated experts who know your business and fight for your rankings every single month.</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-3xl overflow-hidden shadow-2xl"
            >
              <img
                src={`${import.meta.env.BASE_URL}images/homepage-team.png`}
                alt="Indexify digital marketing team collaborating around a table reviewing Google Ads campaign data and SEO performance charts on multiple screens in a modern South African office"
                className="w-full h-full object-cover"
              />
            </motion.div>
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
