import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Phone, Mail, MapPin, MessageSquare, CheckCircle2, Loader2 } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useSEO } from "@/hooks/useSEO";
import { PoweredByBadge } from "@/components/PoweredByBadge";
import { openWhatsAppModal } from "@/components/WhatsAppModal";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const REASONS = [
  "Request a custom unlock code for my proposal",
  "Get a custom SEO quote",
  "Get a custom Google Ads quote",
  "General enquiry",
  "Other",
];

export default function Contact() {
  useSEO({
    title: "Contact Indexify – SEO & Google Ads Agency South Africa",
    description: "Get in touch with Indexify for a free strategy consultation. We serve businesses across South Africa — Johannesburg, Cape Town, Durban and nationwide.",
    keywords: ["contact SEO agency South Africa", "hire Google Ads agency South Africa", "digital marketing consultation South Africa", "SEO quote South Africa"],
    canonical: "https://indexify.co.za/contact",
  });

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    reason: REASONS[0],
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch(`${BASE}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try WhatsApp or email us directly.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-white text-foreground">
      <Navbar />

      {/* HERO */}
      <section className="relative pt-32 pb-16 md:pt-44 md:pb-20 overflow-hidden bg-gradient-to-br from-sky-50 via-white to-blue-50">
        <div className="absolute top-20 right-16 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-48 h-48 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-primary/20 shadow-sm"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-medium text-gray-600">We reply within 1 business hour</span>
            </motion.div>
            <PoweredByBadge />
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl font-black text-gray-900 mb-4 leading-tight"
          >
            Let's <span className="text-gradient">Talk.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-gray-500 max-w-xl mx-auto"
          >
            Whether you need a custom quote, a bespoke unlock code, or just want to find out how Indexify can grow your business — we're here.
          </motion.p>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">

            {/* LEFT — contact info */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-2xl font-black text-gray-900 mb-2">Get in touch</h2>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Fill in the form and we'll get back to you with a tailored solution — whether that's a custom code, a proposal, or a full strategy call.
                </p>
              </div>

              <div className="space-y-5">
                {[
                  {
                    icon: Mail,
                    label: "Email us",
                    value: "support@indexify.co.za",
                    href: "mailto:support@indexify.co.za",
                  },
                  {
                    icon: Phone,
                    label: "WhatsApp / Call",
                    value: "+27 60 298 8295",
                    href: "https://wa.me/27602988295",
                  },
                  {
                    icon: MapPin,
                    label: "Based in",
                    value: "South Africa — serving clients nationwide",
                    href: null,
                  },
                ].map(({ icon: Icon, label, value, href }) => (
                  <div key={label} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon size={18} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
                      {href ? (
                        <a href={href} target="_blank" rel="noreferrer" className="text-gray-800 font-semibold hover:text-primary transition-colors text-sm">
                          {value}
                        </a>
                      ) : (
                        <p className="text-gray-700 font-medium text-sm">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick WhatsApp CTA */}
              <button
                onClick={() => openWhatsAppModal()}
                className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-[#25d366] text-white font-bold text-sm hover:bg-[#20bc5a] hover:-translate-y-0.5 transition-all shadow-lg shadow-green-400/20 w-full justify-center"
              >
                <MessageSquare size={20} />
                Chat on WhatsApp Instead
              </button>

              <div className="rounded-2xl bg-sky-50 border border-sky-100 p-6">
                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">Custom unlock codes</p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Already generated a Google Ads proposal? Reach out and we'll review your business and send you a personalised unlock code — sometimes at no charge for the right fit.
                </p>
              </div>
            </div>

            {/* RIGHT — form */}
            <motion.div
              variants={fadeInUp} initial="hidden" animate="visible"
              className="lg:col-span-3"
            >
              {submitted ? (
                <div className="flex flex-col items-center justify-center text-center py-24 px-8 rounded-3xl border border-gray-100 bg-gray-50 shadow-sm">
                  <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
                    <CheckCircle2 size={36} className="text-green-500" />
                  </div>
                  <h3 className="text-3xl font-black text-gray-900 mb-3">Message received!</h3>
                  <p className="text-gray-500 text-base max-w-md mx-auto mb-8">
                    Thanks {form.name.split(" ")[0]}! We'll review your enquiry and get back to you within 1 business hour. Check your inbox.
                  </p>
                  <a
                    href={`${BASE}/`}
                    className="px-8 py-3 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
                  >
                    Back to Home
                  </a>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8 md:p-10 space-y-6"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Full Name *</label>
                      <input
                        required
                        value={form.name}
                        onChange={(e) => set("name", e.target.value)}
                        placeholder="Jane Smith"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-gray-900 text-sm placeholder-gray-400 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Email Address *</label>
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={(e) => set("email", e.target.value)}
                        placeholder="jane@company.co.za"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-gray-900 text-sm placeholder-gray-400 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Phone / WhatsApp</label>
                      <input
                        value={form.phone}
                        onChange={(e) => set("phone", e.target.value)}
                        placeholder="+27 82 000 0000"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-gray-900 text-sm placeholder-gray-400 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Company / Website</label>
                      <input
                        value={form.company}
                        onChange={(e) => set("company", e.target.value)}
                        placeholder="mycompany.co.za"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-gray-900 text-sm placeholder-gray-400 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">How can we help? *</label>
                    <select
                      required
                      value={form.reason}
                      onChange={(e) => set("reason", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-gray-900 text-sm transition-all"
                    >
                      {REASONS.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Message *</label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => set("message", e.target.value)}
                      placeholder="Tell us about your business and what you need..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-gray-900 text-sm placeholder-gray-400 transition-all resize-none"
                    />
                  </div>

                  {error && (
                    <p className="text-red-500 text-sm bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 rounded-xl bg-primary text-white font-bold text-base hover:bg-primary/90 hover:-translate-y-0.5 transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitting
                      ? <><Loader2 size={18} className="animate-spin" /> Sending...</>
                      : <><Send size={18} /> Send Message</>}
                  </button>

                  <p className="text-center text-xs text-gray-400">
                    We'll reply to <strong className="text-gray-600">{form.email || "your email"}</strong> within 1 business hour.
                  </p>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
