import { motion } from "framer-motion";
import {
  Search, CheckCircle2, ArrowRight, TrendingUp, Target, BarChart3,
  Globe, FileText, Link2, MapPin, Zap, Clock, Award, ChevronDown,
  ChevronUp, Users, Star, Shield, Eye
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
  { step: "01", title: "Deep-Dive Audit & Research", desc: "We analyse your website, competitors, and target market to uncover every opportunity and technical issue holding you back.", icon: Eye },
  { step: "02", title: "Keyword Strategy", desc: "We identify the exact search terms your ideal customers type into Google — high intent, high volume, low competition.", icon: Target },
  { step: "03", title: "On-Page Optimisation", desc: "We rewrite and restructure your pages so Google clearly understands what you offer and ranks you above competitors.", icon: FileText },
  { step: "04", title: "Technical SEO Fixes", desc: "Speed, mobile-friendliness, Core Web Vitals, structured data — we fix every technical issue that limits your rankings.", icon: Zap },
  { step: "05", title: "Authority Link Building", desc: "We earn high-quality backlinks from credible South African and global websites to signal authority to Google.", icon: Link2 },
  { step: "06", title: "Monthly Reporting & Refinement", desc: "Transparent reports every month showing rankings, traffic, and conversions — then we refine the strategy.", icon: BarChart3 },
];

const DELIVERABLES = [
  { icon: Search, title: "Keyword Research & Mapping", desc: "In-depth research across 50–200+ relevant keywords grouped by intent and priority." },
  { icon: FileText, title: "On-Page SEO", desc: "Title tags, meta descriptions, H1/H2 structure, internal linking, and content optimisation." },
  { icon: Zap, title: "Technical SEO", desc: "Site speed, Core Web Vitals, crawlability, XML sitemaps, robots.txt, and schema markup." },
  { icon: MapPin, title: "Local SEO", desc: "Google Business Profile management, local citations, and location-specific landing pages." },
  { icon: Link2, title: "Link Building", desc: "White-hat outreach to earn do-follow backlinks from authoritative local and niche websites." },
  { icon: Globe, title: "Content Strategy", desc: "Blog planning and optimised content that attracts organic traffic and builds topical authority." },
  { icon: BarChart3, title: "Rank Tracking", desc: "Weekly rank tracking for all target keywords with historical trend data." },
  { icon: Users, title: "Competitor Analysis", desc: "Ongoing monitoring of competitor rankings and backlink profiles to stay ahead." },
];

const FAQS = [
  { q: "How long does SEO take to show results?", a: "SEO is a long-term strategy. Most clients begin seeing measurable ranking improvements within 3–4 months, with significant traffic increases by month 6. Highly competitive industries may take 9–12 months for top-3 positions. We provide month-by-month progress tracking so you always know what's happening." },
  { q: "Do you guarantee first page rankings?", a: "No legitimate SEO agency can guarantee a specific ranking — Google's algorithm is constantly evolving. What we guarantee is a proven process, complete transparency, and measurable progress every month. Our track record speaks for itself: the majority of our clients reach page 1 within 6 months." },
  { q: "Will my rankings drop if I stop SEO?", a: "Rankings built on genuine authority tend to be sticky. However, competitors invest in SEO continuously, so pausing can gradually erode your position. We recommend a minimum 6-month commitment to build durable, compounding results." },
  { q: "Do you do SEO for all industries?", a: "We work with any South African business that relies on Google to attract clients — from trades and medical practices to e-commerce stores and professional services. Our process is tailored to your specific market and competition level." },
  { q: "What makes Fortune Design different from other SEO agencies?", a: "We only focus on search marketing — no social media, no graphic design, no distractions. That singular focus means deeper expertise, faster results, and a team that genuinely understands how Google works at a technical level." },
  { q: "How much does SEO cost?", a: "Our SEO packages start from R5,900/month for Local SEO and go up to R11,900/month for our Premium package with DA90+ backlinks and press releases. We'll recommend the right package after a free audit of your website and market." },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden cursor-pointer bg-white shadow-sm" onClick={() => setOpen(!open)}>
      <div className="flex items-center justify-between px-6 py-5 hover:bg-gray-50 transition-colors">
        <span className="font-semibold text-gray-900 pr-4">{q}</span>
        {open ? <ChevronUp className="shrink-0 text-primary" size={20} /> : <ChevronDown className="shrink-0 text-gray-400" size={20} />}
      </div>
      {open && (
        <div className="px-6 py-5 text-gray-500 leading-relaxed border-t border-gray-100 bg-gray-50">
          {a}
        </div>
      )}
    </div>
  );
}

export default function SEOPage() {
  const openWhatsApp = () => {
    window.open("https://wa.me/27832555270?text=Hi%20Fortune%20Design%2C%20I%27m%20interested%20in%20your%20SEO%20services.%20Can%20we%20chat%3F", "_blank");
  };

  return (
    <div className="min-h-screen bg-white text-foreground">
      <Navbar />
      <WhatsAppModal />

      {/* HERO */}
      <section className="relative pt-36 pb-24 md:pt-52 md:pb-36 overflow-hidden bg-gradient-to-br from-sky-50 via-white to-blue-50">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80"
            alt="SEO analytics dashboard"
            className="w-full h-full object-cover opacity-10 mix-blend-multiply"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-sky-50/50 via-white/60 to-white" />
        </div>
        <div className="absolute top-24 right-16 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-primary/20 shadow-sm mb-8"
            >
              <Search size={14} className="text-primary" />
              <span className="text-sm font-semibold text-primary uppercase tracking-wide">SEO Services</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-[1.1] text-gray-900"
            >
              Rank Higher.<br />
              <span className="text-gradient">Get Found. Grow.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-gray-500 max-w-2xl mb-10 leading-relaxed"
            >
              We help South African businesses dominate Google's first page through data-driven SEO strategies that deliver compounding, long-term organic growth — without paying for every click.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <a href={`${import.meta.env.BASE_URL}audit`} className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-primary text-white font-bold text-lg hover:bg-primary/90 hover:-translate-y-1 transition-all duration-300 shadow-lg shadow-primary/25">
                Get Your Free SEO Audit <ArrowRight size={20} />
              </a>
              <button onClick={openWhatsApp} className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-gray-700 font-bold text-lg border border-gray-200 hover:border-primary hover:text-primary hover:-translate-y-1 transition-all duration-300 shadow-sm">
                Talk to an Expert
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CLIENT LOGOS BANNER */}
      <section className="py-10 bg-white border-b border-gray-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Trusted by businesses across South Africa &amp; beyond</p>
        </div>
        <div className="relative overflow-hidden">
          <div className="flex marquee-track w-max">
            {[
              "https://fortunedesign.co.za/wp-content/uploads/2025/08/output-onlinepngtools-14.png",
              "https://fortunedesign.co.za/wp-content/uploads/2025/08/output-onlinepngtools-10.png",
              "https://fortunedesign.co.za/wp-content/uploads/2025/08/output-onlinepngtools-6.png",
              "https://fortunedesign.co.za/wp-content/uploads/2025/08/output-onlinepngtools-8.png",
              "https://fortunedesign.co.za/wp-content/uploads/2025/08/output-onlinepngtools-18.png",
              "https://fortunedesign.co.za/wp-content/uploads/2025/08/output-onlinepngtools-13.png",
              "https://fortunedesign.co.za/wp-content/uploads/2025/08/4.png",
              "https://fortunedesign.co.za/wp-content/uploads/2025/08/8.png",
              "https://fortunedesign.co.za/wp-content/uploads/2025/08/output-onlinepngtools-15.png",
              "https://fortunedesign.co.za/wp-content/uploads/2025/08/output-onlinepngtools-17.png",
              "https://fortunedesign.co.za/wp-content/uploads/2025/08/output-onlinepngtools-11.png",
              "https://fortunedesign.co.za/wp-content/uploads/2025/08/output-onlinepngtools-5.png",
              "https://fortunedesign.co.za/wp-content/uploads/2025/08/output-onlinepngtools-14.png",
              "https://fortunedesign.co.za/wp-content/uploads/2025/08/output-onlinepngtools-10.png",
              "https://fortunedesign.co.za/wp-content/uploads/2025/08/output-onlinepngtools-6.png",
              "https://fortunedesign.co.za/wp-content/uploads/2025/08/output-onlinepngtools-8.png",
              "https://fortunedesign.co.za/wp-content/uploads/2025/08/output-onlinepngtools-18.png",
              "https://fortunedesign.co.za/wp-content/uploads/2025/08/output-onlinepngtools-13.png",
              "https://fortunedesign.co.za/wp-content/uploads/2025/08/4.png",
              "https://fortunedesign.co.za/wp-content/uploads/2025/08/8.png",
              "https://fortunedesign.co.za/wp-content/uploads/2025/08/output-onlinepngtools-15.png",
              "https://fortunedesign.co.za/wp-content/uploads/2025/08/output-onlinepngtools-17.png",
              "https://fortunedesign.co.za/wp-content/uploads/2025/08/output-onlinepngtools-11.png",
              "https://fortunedesign.co.za/wp-content/uploads/2025/08/output-onlinepngtools-5.png",
            ].map((src, i) => (
              <div key={i} className="flex items-center justify-center mx-8 shrink-0">
                <img
                  src={src}
                  alt="Client logo"
                  className="h-14 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RESULTS STRIP */}
      <section className="py-12 border-y border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-gray-100">
            {[
              { metric: "200%+", label: "Average traffic increase within 6 months" },
              { metric: "Page 1", label: "Majority of clients reach page 1 in their niche" },
              { metric: "50+", label: "South African businesses currently managed" },
              { metric: "R500K+", label: "In SEO & ad spend budgets managed" },
            ].map((r, i) => (
              <motion.div key={i} variants={fadeInUp} className="text-center px-4">
                <div className="text-3xl md:text-4xl font-black text-primary mb-1">{r.metric}</div>
                <div className="text-sm text-gray-500">{r.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* WHY SEO MATTERS */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <h2 className="text-4xl md:text-5xl font-black mb-6 text-gray-900">
                Why SEO Is the Highest-ROI<br />
                <span className="text-gradient">Marketing Investment</span>
              </h2>
              <p className="text-gray-500 text-lg mb-6 leading-relaxed">
                Over <strong className="text-gray-900">93% of online experiences begin with a search engine</strong>. When someone searches for your service in South Africa, are they finding you — or your competitor?
              </p>
              <p className="text-gray-500 text-lg mb-8 leading-relaxed">
                Unlike Google Ads where you pay for every click, SEO builds <strong className="text-gray-900">organic visibility that compounds over time</strong>. Once you rank, traffic flows to your site without an ongoing cost-per-click.
              </p>
              <div className="space-y-4">
                {[
                  "75% of users never scroll past page 1 of Google",
                  "Organic search drives 53% of all website traffic globally",
                  "SEO leads have a 14.6% close rate vs 1.7% for outbound marketing",
                  "Companies investing in SEO see 5–12x ROI over 2 years",
                ].map((point, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="text-primary shrink-0 mt-0.5" size={20} />
                    <span className="text-gray-700">{point}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-xl">
                <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=85" alt="SEO analytics showing traffic growth" className="w-full h-72 md:h-96 object-cover" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-5 shadow-xl border border-gray-200">
                <div className="flex items-center gap-3 mb-1">
                  <TrendingUp className="text-primary" size={22} />
                  <span className="font-bold text-gray-900">Organic Traffic</span>
                </div>
                <div className="text-3xl font-black text-primary">+247%</div>
                <div className="text-sm text-gray-500">6-month growth — Rapple Products</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* OUR PROCESS */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-gray-900">Our Proven <span className="text-gradient">6-Step SEO Process</span></h2>
            <p className="text-lg text-gray-500">Every campaign follows the same battle-tested framework — refined over hundreds of South African business projects.</p>
          </div>

          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROCESS.map((step, i) => (
              <motion.div key={i} variants={fadeInUp} className="bg-white rounded-2xl p-7 relative overflow-hidden group hover:border-primary/40 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="absolute top-4 right-6 text-6xl font-black text-gray-100 select-none group-hover:text-primary/10 transition-colors">{step.step}</div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-5">
                  <step.icon size={22} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-500 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* WHAT'S INCLUDED */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="text-4xl md:text-5xl font-black mb-6 text-gray-900">
                Everything Included<br />
                <span className="text-gradient">In Your SEO Campaign</span>
              </h2>
              <p className="text-gray-500 text-lg mb-10 leading-relaxed">
                Our SEO service covers every dimension of search optimisation. No hidden extras, no piecemeal upsells — one comprehensive campaign managed by a dedicated team.
              </p>
              <div className="relative rounded-3xl overflow-hidden shadow-lg">
                <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=85" alt="Developer optimising website code for SEO" className="w-full h-64 object-cover" />
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-gray-900/80 to-transparent">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 border border-white/30 backdrop-blur-md">
                    <Shield size={14} className="text-white" />
                    <span className="text-sm font-semibold text-white">100% White-Hat Methods — No Shortcuts</span>
                  </div>
                </div>
              </div>
            </div>

            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid sm:grid-cols-2 gap-5">
              {DELIVERABLES.map((d, i) => (
                <motion.div key={i} variants={fadeInUp} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:border-primary/30 hover:shadow-md transition-all duration-300">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                    <d.icon size={18} />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">{d.title}</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">{d.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* LOCAL SEO HIGHLIGHT */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-xl">
                <img src="https://images.unsplash.com/photo-1572025442646-866d16c84a54?auto=format&fit=crop&w=900&q=85" alt="South Africa local business map" className="w-full h-72 md:h-96 object-cover" />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-5 shadow-xl border border-gray-200">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="text-primary" size={18} />
                  <span className="font-bold text-sm text-gray-900">Local Pack Rankings</span>
                </div>
                <div className="text-2xl font-black text-primary">#1 Positions</div>
                <div className="text-xs text-gray-500 mt-1">Google Maps & local results</div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <MapPin size={13} className="text-primary" />
                <span className="text-xs font-semibold text-primary uppercase tracking-wide">Local SEO Specialists</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-6 text-gray-900">
                Dominate Your<br />
                <span className="text-gradient">Local Market</span>
              </h2>
              <p className="text-gray-500 text-lg mb-6 leading-relaxed">
                When someone in your city searches "plumber near me" or "best dentist in Pretoria" — are you showing up in the Google Maps pack? Local SEO is one of the fastest ways to drive foot traffic and phone calls from nearby customers.
              </p>
              <div className="space-y-4">
                {[
                  "Google Business Profile setup and full optimisation",
                  "Local keyword research targeting your service area",
                  "Local citation building across 30+ directories",
                  "Review generation strategy to boost Google rating",
                  "Location-specific landing pages for each service area",
                ].map((point, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="text-primary shrink-0 mt-0.5" size={18} />
                    <span className="text-gray-700">{point}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-gray-900">Trusted by <span className="text-gradient">SA Businesses</span></h2>
            <p className="text-gray-500 text-lg">Real results from real clients across South Africa.</p>
          </div>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid md:grid-cols-2 gap-6">
            {[
              { text: "Thanks to Fortune Design's SEO strategy, Rapple is now ranking on Page 1 of Google for all our main keywords. Organic traffic has more than doubled and the quality of leads coming through search has been exceptional. Highly recommend.", author: "Leon De Wet", role: "Rapple Products", stars: 5 },
              { text: "Fortune Design's SEO work has completely changed our online presence. We are now ranking on page 1 for our most important search terms and the leads coming through Google have grown steadily every month. Very happy with the results and the service.", author: "Michael", role: "Captuna Charters", stars: 5 },
              { text: "We are very impressed with the SEO results Fortune Design has delivered for Precision Gates. Our website now ranks on the first page of Google for our key search terms and we are getting more organic inquiries than ever before. Excellent work.", author: "Megan van Niekerk", role: "Precision Gates", stars: 5 },
              { text: "Fortune Design has provided outstanding service. Our Google ranking skyrocketed from virtually nowhere to one of the top positions, and we began receiving significantly more inquiries almost immediately. Their team identified numerous gaps and errors that our previous SEO provider had missed. We highly recommend Fortune Design for anyone seeking expert Google optimization.", author: "Serenity Villa Daniela", role: "Luxury Villa Rentals", stars: 5 },
            ].map((review, i) => (
              <motion.div key={i} variants={fadeInUp} className="bg-white border border-gray-200 rounded-2xl p-7 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300">
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: review.stars }).map((_, j) => (
                    <Star key={j} size={16} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-gray-600 leading-relaxed mb-6 italic">"{review.text}"</p>
                <div className="border-t border-gray-100 pt-5">
                  <div className="font-bold text-gray-900">{review.author}</div>
                  <div className="text-sm text-gray-400">{review.role}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-gray-900">What to Expect <span className="text-gradient">Month by Month</span></h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">SEO is a compounding investment. Here's a realistic timeline for a typical South African business campaign.</p>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-200 hidden md:block" />
            <div className="space-y-8">
              {[
                { months: "Month 1–2", title: "Foundation & Setup", desc: "Full technical audit, keyword mapping, on-page optimisation across all key pages, Google Business Profile setup, and initial content creation.", side: "left" },
                { months: "Month 3–4", title: "Early Momentum", desc: "Ranking improvements for lower-competition keywords, link building underway, first organic traffic increases visible in Google Search Console.", side: "right" },
                { months: "Month 5–6", title: "Rankings Accelerate", desc: "Main commercial keywords breaking into top 10 or page 1. Significant organic traffic growth. Leads starting to come through organic search.", side: "left" },
                { months: "Month 6–12", title: "Dominance & Scaling", desc: "Top 3 positions for core keywords. Consistent lead flow from organic. Strategy expands to new keyword clusters and markets.", side: "right" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={`md:w-5/12 ${item.side === "right" ? "md:ml-auto" : ""}`}
                >
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
                      <Clock size={12} className="text-primary" />
                      <span className="text-xs font-bold text-primary">{item.months}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-gray-900">SEO <span className="text-gradient">Pricing Packages</span></h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">Transparent pricing. No hidden fees. Cancel anytime after your first 3 months.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {[
              {
                name: "Basic SEO",
                price: "5,900",
                popular: false,
                features: [
                  "Local SEO (Focused on Ranking Locally)",
                  "Keyword Research",
                  "Analytic Setup & Configuration",
                  "Technical SEO (Robots.txt, Sitemap, etc)",
                  "Title Tag & Meta Tag Creation",
                  "Content Editing & Optimization",
                  "Monthly Custom Report",
                ],
              },
              {
                name: "Advanced SEO",
                price: "7,900",
                popular: false,
                features: [
                  "Competitive Keywords / Ranking Nationwide",
                  "Ecommerce Lead Generation",
                  "Local SEO (Focused on Ranking Locally)",
                  "Keyword Research",
                  "Analytic Setup & Configuration",
                  "Technical SEO (Robots.txt, Sitemap, etc)",
                  "Title Tag & Meta Tag Creation",
                  "Content Editing & Optimization",
                  "Monthly Custom Report",
                  "Offsite Link Building",
                ],
              },
              {
                name: "Premium SEO",
                price: "11,900",
                popular: true,
                features: [
                  "Competitive Keywords / Ranking Nationwide",
                  "Backlink Manager",
                  "DA 90+ Backlinks",
                  "Ecommerce Lead Generation",
                  "Local SEO (Focused on Ranking Locally)",
                  "Keyword Research",
                  "Keyword Optimization & Implementation",
                  "Backlink Indexing",
                  "Analytic Setup & Configuration",
                  "Technical SEO (Robots.txt, Sitemap, etc)",
                  "Title Tag & Meta Tag Creation",
                  "Content Editing & Optimization",
                  "Monthly Custom Report",
                  "Offsite Link Building",
                  "Press Release",
                ],
              },
            ].map((pkg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.6 }}
                className={`relative rounded-3xl flex flex-col ${
                  pkg.popular
                    ? "bg-primary text-white shadow-2xl shadow-primary/30 scale-105"
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
                <div className="p-8 pb-0">
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
                        <CheckCircle2 size={16} className={`mt-0.5 shrink-0 ${pkg.popular ? "text-white" : "text-primary"}`} />
                        <span className={`text-sm leading-relaxed ${pkg.popular ? "text-white/90" : "text-gray-600"}`}>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-8 pt-4 mt-auto">
                  <button
                    onClick={openWhatsApp}
                    className={`w-full py-4 rounded-xl font-bold text-base transition-all duration-300 hover:-translate-y-0.5 ${
                      pkg.popular
                        ? "bg-white text-primary hover:bg-white/90 shadow-lg"
                        : "bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/20"
                    }`}
                  >
                    Choose Package
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
            className="text-center text-sm text-gray-400 mt-10"
          >
            Not sure which package is right for you? <button onClick={openWhatsApp} className="text-primary font-semibold hover:underline">Chat with us — we'll recommend the best fit.</button>
          </motion.p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-gray-900">SEO <span className="text-gradient">Questions Answered</span></h2>
            <p className="text-gray-500 text-lg">Straight answers — no jargon.</p>
          </div>
          <div className="space-y-4">
            {FAQS.map((faq, i) => <FAQItem key={i} q={faq.q} a={faq.a} />)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-sky-50 via-white to-blue-50 relative overflow-hidden">
        <div className="absolute top-10 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-primary/20 shadow-sm mb-8">
              <Award size={14} className="text-primary" />
              <span className="text-sm font-semibold text-primary">Free SEO Audit — No Commitment</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black mb-6 text-gray-900">
              Ready to Rank Higher<br />
              <span className="text-gradient">and Get Found?</span>
            </h2>
            <p className="text-xl text-gray-500 mb-10 leading-relaxed">
              Get a free, personalised SEO audit of your website — we'll show you exactly what's holding your rankings back and how to fix it.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={`${import.meta.env.BASE_URL}audit`} className="inline-flex items-center justify-center gap-2 px-10 py-5 rounded-xl bg-primary text-white font-bold text-xl hover:bg-primary/90 hover:-translate-y-1 transition-all duration-300 shadow-xl shadow-primary/25">
                Get My Free SEO Audit <ArrowRight size={22} />
              </a>
              <button onClick={openWhatsApp} className="inline-flex items-center justify-center gap-2 px-10 py-5 rounded-xl bg-white text-gray-700 font-bold text-xl border border-gray-200 hover:border-primary hover:text-primary hover:-translate-y-1 transition-all duration-300 shadow-sm">
                Chat on WhatsApp
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
