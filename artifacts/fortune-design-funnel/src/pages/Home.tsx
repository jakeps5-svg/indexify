import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Target, TrendingUp, Search, MousePointerClick, BarChart3, Users, Star, ChevronDown, MessageCircle } from "lucide-react";
import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppModal } from "@/components/WhatsAppModal";
import { cn } from "@/lib/utils";

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

export default function Home() {
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
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-primary">
      <Navbar />
      <WhatsAppModal />

      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`} 
            alt="Abstract dark gold background" 
            className="w-full h-full object-cover opacity-40 mix-blend-screen"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-zinc-300">South Africa's Top-Rated Marketing Agency</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-[1.1]"
          >
            Dominate <span className="text-gradient">Google.</span><br />
            Get More Clients.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
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
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 hover:-translate-y-1 transition-all duration-300 shadow-[0_0_30px_rgba(110,193,228,0.25)] flex items-center justify-center gap-2"
            >
              Get Free Strategy Audit <ArrowRight size={20} />
            </a>
            <button 
              onClick={() => scrollTo("services")}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/5 text-white font-bold text-lg border border-white/10 hover:bg-white/10 hover:-translate-y-1 transition-all duration-300"
            >
              View Our Services
            </button>
          </motion.div>
        </div>
      </section>

      {/* 2. STATS & LOGOS SECTION */}
      <section id="results" className="py-12 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/5"
          >
            {[
              { value: "R500K+", label: "Ad Spend Managed", icon: BarChart3 },
              { value: "200%", label: "Avg. Traffic Increase", icon: TrendingUp },
              { value: "50+", label: "Active Clients", icon: Users },
              { value: "1st", label: "Page Rankings", icon: Target }
            ].map((stat, i) => (
              <motion.div key={i} variants={fadeInUp} className="text-center px-4">
                <div className="flex justify-center mb-4 text-primary opacity-80">
                  <stat.icon size={32} />
                </div>
                <h3 className="text-3xl md:text-4xl font-black text-foreground mb-1">{stat.value}</h3>
                <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 3. SERVICES SECTION */}
      <section id="services" className="py-24 relative">
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/pattern.png`} 
            alt="Pattern" 
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6">Our Core <span className="text-primary">Services</span></h2>
            <p className="text-lg text-muted-foreground">We don't do everything. We focus exclusively on search marketing to deliver unmatched results for our clients.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* SEO Card */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="glass-card rounded-3xl p-8 md:p-10 group hover:border-primary/50 transition-colors duration-500 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-primary/20 transition-all duration-500" />
              
              <div className="w-16 h-16 rounded-2xl bg-zinc-800/80 border border-white/10 flex items-center justify-center text-primary mb-8 relative z-10">
                <Search size={32} />
              </div>
              
              <h3 className="text-3xl font-bold mb-4 relative z-10">Search Engine Optimization</h3>
              <p className="text-zinc-400 mb-8 leading-relaxed relative z-10">
                Dominate organic search results. We optimize your website to rank on page 1 for the keywords your customers are actively searching for.
              </p>
              
              <ul className="space-y-4 mb-10 relative z-10">
                {[
                  "In-depth Keyword Strategy & Research",
                  "Technical Website Optimization",
                  "Local SEO for SA Businesses",
                  "High-Authority Backlink Building"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-zinc-300">
                    <CheckCircle2 className="text-primary shrink-0 mt-0.5" size={20} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              
              <button onClick={() => scrollTo("contact")} className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 relative z-10">
                Discuss SEO Strategy
              </button>
            </motion.div>

            {/* Google Ads Card */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="glass-card rounded-3xl p-8 md:p-10 group hover:border-primary/50 transition-colors duration-500 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-primary/20 transition-all duration-500" />
              
              <div className="w-16 h-16 rounded-2xl bg-zinc-800/80 border border-white/10 flex items-center justify-center text-primary mb-8 relative z-10">
                <MousePointerClick size={32} />
              </div>
              
              <h3 className="text-3xl font-bold mb-4 relative z-10">Google Ads Management</h3>
              <p className="text-zinc-400 mb-8 leading-relaxed relative z-10">
                Instant visibility and predictable leads. We build highly targeted PPC campaigns that maximize your ROI and minimize wasted ad spend.
              </p>
              
              <ul className="space-y-4 mb-10 relative z-10">
                {[
                  "Hyper-targeted Search Campaigns",
                  "Conversion Rate Optimization (CRO)",
                  "Advanced Retargeting Strategies",
                  "Detailed ROI & Performance Reporting"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-zinc-300">
                    <CheckCircle2 className="text-primary shrink-0 mt-0.5" size={20} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              
              <button onClick={() => scrollTo("contact")} className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 relative z-10">
                Discuss Ads Strategy
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. REVIEWS SECTION */}
      <section id="reviews" className="py-24 bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6">Client <span className="text-primary">Success Stories</span></h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Don't just take our word for it. Here's what South African business owners have to say about working with Fortune Design.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                text: "We are extremely impressed with the results delivered by Fortune Design! Thanks to their strategic approach and consistent efforts, Rapple is now ranking on Page 1 of Google — a major milestone for our brand visibility and online growth. Highly recommend their services to any business looking to seriously boost their online presence.",
                author: "Leon De Wet",
                role: "Rapple Products"
              },
              {
                text: "Captuna Charters would like to thank Fortune Designs for our stunning website. We can personally recommend your service and will most definitely make use of your services in the future. You rock!",
                author: "Michael",
                role: "Captuna Charters"
              },
              {
                text: "Fortune Design created a great looking website at an affordable rate with fast delivery. Very happy with my new website, thank you guys!",
                author: "Megan van Niekerk",
                role: "Precision Gates"
              },
              {
                text: "Our new website is ready and we are absolutely stunned about the outcome. It was such a pleasure working with Fortune Design — they immediately visualised what we wanted and their turnaround time was excellent.",
                author: "Bettina Williams",
                role: "DesignAfrique"
              }
            ].map((review, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border border-white/5 rounded-2xl p-8 hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex gap-1 text-primary mb-6">
                  {[...Array(5)].map((_, j) => <Star key={j} size={20} fill="currentColor" />)}
                </div>
                <p className="text-xl font-medium leading-relaxed mb-6">"{review.text}"</p>
                <div>
                  <p className="font-bold text-foreground">{review.author}</p>
                  <p className="text-sm text-muted-foreground">{review.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. PRICING SECTION */}
      <section id="pricing" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6">Transparent <span className="text-primary">Pricing</span></h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Investment levels designed for businesses ready to scale. No hidden fees, no long-term lock-ins.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-center max-w-5xl mx-auto">
            {/* Starter */}
            <motion.div 
              variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="bg-card border border-white/5 rounded-3xl p-8"
            >
              <h3 className="text-xl font-bold mb-2">Growth Starter</h3>
              <p className="text-muted-foreground mb-6 text-sm">Perfect for local businesses</p>
              <div className="mb-8">
                <span className="text-4xl font-black">From R5,500</span>
                <span className="text-muted-foreground">/mo</span>
              </div>
              <ul className="space-y-4 mb-8">
                {["Local SEO Setup", "Basic Keyword Strategy", "Google My Business", "Monthly Reporting"].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-zinc-300">
                    <CheckCircle2 className="text-primary" size={16} /> {feature}
                  </li>
                ))}
              </ul>
              <button onClick={() => scrollTo("contact")} className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 font-semibold transition-colors">Choose Starter</button>
            </motion.div>

            {/* Premium (Highlighted) */}
            <motion.div 
              variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="bg-zinc-900 border-2 border-primary rounded-3xl p-8 relative shadow-[0_0_30px_rgba(110,193,228,0.15)] md:scale-105 z-10"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                Most Popular
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Market Leader</h3>
              <p className="text-zinc-400 mb-6 text-sm">Aggressive growth campaigns</p>
              <div className="mb-8">
                <span className="text-4xl font-black text-white">From R12,500</span>
                <span className="text-zinc-400">/mo</span>
              </div>
              <ul className="space-y-4 mb-8">
                {["Advanced SEO Strategy", "Google Ads Management", "Conversion Optimization", "Competitor Analysis", "Bi-weekly Strategy Calls"].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-zinc-200">
                    <CheckCircle2 className="text-primary" size={16} /> {feature}
                  </li>
                ))}
              </ul>
              <button onClick={() => scrollTo("contact")} className="w-full py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold transition-all shadow-lg hover:shadow-xl hover:shadow-primary/20">Choose Leader</button>
            </motion.div>

            {/* Enterprise */}
            <motion.div 
              variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="bg-card border border-white/5 rounded-3xl p-8"
            >
              <h3 className="text-xl font-bold mb-2">Enterprise</h3>
              <p className="text-muted-foreground mb-6 text-sm">For national/ecom brands</p>
              <div className="mb-8">
                <span className="text-4xl font-black">Custom</span>
              </div>
              <ul className="space-y-4 mb-8">
                {["Full Omnichannel Strategy", "E-commerce SEO", "High-Budget Ads Scaling", "Custom Data Dashboards"].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-zinc-300">
                    <CheckCircle2 className="text-primary" size={16} /> {feature}
                  </li>
                ))}
              </ul>
              <button onClick={() => scrollTo("contact")} className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 font-semibold transition-colors">Get Custom Quote</button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 6. FAQ SECTION */}
      <section className="py-24 bg-zinc-900/30 border-y border-white/5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black mb-4">Frequently Asked Questions</h2>
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
      <section id="contact" className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <h2 className="text-5xl md:text-6xl font-black mb-6 text-white">Ready to scale your revenue?</h2>
          <p className="text-xl text-zinc-300 mb-10">Stop leaving money on the table. Let's build a predictable client acquisition system for your business today.</p>
          
          <button 
            onClick={() => document.querySelector('button[aria-label="Chat on WhatsApp"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))}
            className="inline-flex items-center gap-3 px-8 py-5 rounded-2xl bg-primary text-primary-foreground font-black text-xl hover:bg-primary/90 hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(110,193,228,0.4)]"
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

// Simple FAQ Item Component for toggling
function FAQItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="bg-card border border-white/5 rounded-xl overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between text-left font-semibold text-lg hover:bg-white/[0.02] transition-colors"
      >
        {question}
        <ChevronDown className={cn("transition-transform duration-300 text-primary", isOpen && "rotate-180")} />
      </button>
      <div 
        className={cn(
          "px-6 text-zinc-400 overflow-hidden transition-all duration-300",
          isOpen ? "max-h-48 pb-4 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        {answer}
      </div>
    </div>
  );
}
