import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, User, Mail, Phone, Building2, Loader2, ArrowLeft, CheckCircle2, Eye, EyeOff, KeyRound } from "lucide-react";
import { useLocation } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useYocoPopup } from "@/hooks/useYocoPopup";
import { useRecaptcha } from "@/hooks/useRecaptcha";

const API = import.meta.env.VITE_API_URL ?? "";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const SERVICES: Record<string, { label: string; price: string; amountInCents: number; description: string }> = {
  proposal: {
    label: "Full Google Ads Proposal",
    price: "R500",
    amountInCents: 50000,
    description: "Complete campaign strategy with all keywords, ad copy, budgets & downloadable PDF",
  },
  starter: {
    label: "Growth Starter Package",
    price: "R5,500 / month",
    amountInCents: 550000,
    description: "Local SEO, keyword strategy, Google My Business & monthly reporting",
  },
  leader: {
    label: "Market Leader Package",
    price: "R12,500 / month",
    amountInCents: 1250000,
    description: "Full SEO + Google Ads management, conversion optimisation & bi-weekly strategy calls",
  },
  "seo-basic": {
    label: "Basic SEO Package",
    price: "R5,900 / month",
    amountInCents: 590000,
    description: "Local SEO, keyword research, technical SEO, meta tags & monthly reporting",
  },
  "seo-advanced": {
    label: "Advanced SEO Package",
    price: "R7,900 / month",
    amountInCents: 790000,
    description: "Nationwide keywords, ecommerce lead generation, link building & advanced reporting",
  },
  "seo-premium": {
    label: "Premium SEO Package",
    price: "R11,900 / month",
    amountInCents: 1190000,
    description: "DA 90+ backlinks, press releases, full technical SEO & comprehensive link building",
  },
  "google-ads": {
    label: "Google Ads Management",
    price: "R7,300 / month",
    amountInCents: 730000,
    description: "Full campaign setup, keyword research, ad copy, conversion tracking & monthly reports",
  },
};

export default function CheckoutPage() {
  const params = new URLSearchParams(window.location.search);
  const type = params.get("type") ?? "proposal";
  const domain = params.get("domain") ?? "";
  const [, navigate] = useLocation();

  const service = SERVICES[type] ?? SERVICES.proposal;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [formError, setFormError] = useState("");
  const [paid, setPaid] = useState(false);
  const [portalCreated, setPortalCreated] = useState(false);
  const [unlockToken, setUnlockToken] = useState("");

  const { showPopup, loading: yocoLoading, error: yocoError, clearError } = useYocoPopup();
  const { getToken } = useRecaptcha();

  function validate() {
    if (!name.trim()) return "Please enter your full name.";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Please enter a valid email address.";
    return "";
  }

  async function handlePay() {
    const err = validate();
    if (err) { setFormError(err); return; }
    setFormError("");
    clearError();

    const recaptchaToken = await getToken("checkout").catch(() => "");

    void showPopup({
      amountInCents: service.amountInCents,
      name: "Indexify",
      description: service.label,
      service: service.label,
      extraBody: {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        company: company.trim() || undefined,
        domain: domain || undefined,
        type,
      },
      onSuccess: async (chargeId, token) => {
        setUnlockToken(token ?? "");
        setPaid(true);
        if (type !== "proposal") {
          if (password.trim().length >= 8) {
            try {
              const regToken = await getToken("register").catch(() => "");
              const res = await fetch(`${API}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: name.trim(), email: email.trim(), password, phone: phone.trim() || undefined, company: company.trim() || undefined, recaptchaToken: regToken }),
              });
              if (res.ok) setPortalCreated(true);
            } catch { }
          }
          window.location.href = `${window.location.origin}${BASE}/payment-success?type=${type}&portal=${password.trim().length >= 8 ? "1" : "0"}`;
        }
      },
    });
  }

  if (paid && type === "proposal") {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-24 px-4">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg w-full text-center">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} className="text-green-600" />
            </div>
            <h1 className="text-3xl font-black text-gray-900 mb-3">Payment Successful!</h1>
            <p className="text-gray-500 mb-8">Your unlock token has been emailed to <strong className="text-gray-700">{email}</strong>. Use it below to access your full proposal.</p>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-8">
              <p className="text-xs font-bold uppercase tracking-widest text-blue-500 mb-2">Your Unlock Token</p>
              <p className="text-3xl font-black tracking-widest text-gray-900 font-mono mb-2">{unlockToken}</p>
              <button
                onClick={() => { void navigator.clipboard.writeText(unlockToken); }}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold underline"
              >
                Copy to clipboard
              </button>
            </div>

            <button
              onClick={() => navigate(`${BASE}/ads-audit`)}
              className="w-full py-3.5 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 mb-3"
            >
              Return to Proposal & Unlock
            </button>
            <a href={`${BASE}/`} className="block text-sm text-gray-400 hover:text-gray-600">Back to home</a>
            <p className="text-xs text-gray-400 mt-6">A copy of this token was sent to {email}</p>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-1 py-24 px-4">
        <div className="max-w-4xl mx-auto">

          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-8 transition-colors"
          >
            <ArrowLeft size={15} /> Back
          </button>

          <div className="grid md:grid-cols-5 gap-8 items-start">

            {/* Left — Order summary */}
            <div className="md:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sticky top-28"
              >
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Order Summary</p>

                <div className="flex items-start gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{service.label}</p>
                    <p className="text-gray-500 text-xs mt-1 leading-relaxed">{service.description}</p>
                  </div>
                </div>

                {domain && (
                  <div className="flex justify-between text-sm text-gray-500 mb-2">
                    <span>Domain</span>
                    <span className="font-medium text-gray-700 truncate max-w-[150px]">{domain}</span>
                  </div>
                )}

                <div className="border-t border-gray-100 pt-4 mt-4 flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-600">Total due today</span>
                  <span className="text-xl font-black text-gray-900">{service.price}</span>
                </div>

                <div className="mt-5 pt-5 border-t border-gray-100 space-y-2">
                  {["Secure payment via Yoco", "Instant confirmation email", "No hidden fees"].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-xs text-gray-500">
                      <CheckCircle2 size={13} className="text-green-500 shrink-0" /> {item}
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right — Form */}
            <div className="md:col-span-3">
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8"
              >
                <h1 className="text-2xl font-black text-gray-900 mb-1">Your Details</h1>
                <p className="text-gray-500 text-sm mb-8">Fill in your info so we can send your confirmation & token.</p>

                <div className="space-y-5">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1.5">Full Name *</label>
                    <div className="relative">
                      <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => { setName(e.target.value); setFormError(""); }}
                        placeholder="Jane Smith"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary placeholder-gray-400 transition-all"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1.5">Email Address *</label>
                    <div className="relative">
                      <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setFormError(""); }}
                        placeholder="jane@yourbusiness.co.za"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary placeholder-gray-400 transition-all"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1.5">Phone <span className="normal-case font-normal text-gray-400">(optional)</span></label>
                    <div className="relative">
                      <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+27 82 000 0000"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary placeholder-gray-400 transition-all"
                      />
                    </div>
                  </div>

                  {/* Company */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1.5">Business Name <span className="normal-case font-normal text-gray-400">(optional)</span></label>
                    <div className="relative">
                      <Building2 size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="Acme (Pty) Ltd"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary placeholder-gray-400 transition-all"
                      />
                    </div>
                  </div>

                  {/* Portal password — only for service purchases */}
                  {type !== "proposal" && (
                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <KeyRound size={14} className="text-primary" />
                        <p className="text-sm font-bold text-gray-800">Create your client portal account</p>
                      </div>
                      <p className="text-xs text-gray-500 mb-3">Set a password to access your portal — track your services, view invoices & chat with your account manager. <span className="font-medium text-gray-600">(Optional — you can skip this)</span></p>
                      <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1.5">Portal Password</label>
                      <div className="relative">
                        <input
                          type={showPw ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Min. 8 characters (optional)"
                          className="w-full pl-4 pr-10 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary placeholder-gray-400 transition-all"
                        />
                        <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                          {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>
                  )}

                  {(formError || yocoError) && (
                    <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-4 py-2.5">
                      {formError || yocoError}
                    </p>
                  )}

                  <button
                    onClick={handlePay}
                    disabled={yocoLoading}
                    className="w-full py-4 rounded-xl font-bold text-white text-base transition-all hover:-translate-y-0.5 shadow-xl disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 flex items-center justify-center gap-2"
                    style={{ background: "linear-gradient(135deg, hsl(198 69% 42%), hsl(198 69% 58%))", boxShadow: "0 6px 24px hsl(198 69% 52% / 0.4)" }}
                  >
                    {yocoLoading
                      ? <><Loader2 size={18} className="animate-spin" /> Opening payment form...</>
                      : <><Lock size={16} /> Pay {service.price} Securely with Yoco</>
                    }
                  </button>

                  <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1.5">
                    <ShieldCheck size={12} /> Secured by Yoco · South Africa's leading payment gateway
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
