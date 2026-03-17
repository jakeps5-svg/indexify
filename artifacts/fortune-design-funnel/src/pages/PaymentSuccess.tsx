import { useEffect } from "react";
import { useLocation } from "wouter";
import { CheckCircle2, ArrowRight, Home, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function PaymentSuccess() {
  const params = new URLSearchParams(window.location.search);
  const type = params.get("type") ?? "service";
  const ref = params.get("ref");

  const [, navigate] = useLocation();

  useEffect(() => {
    if (type === "proposal" && ref) {
      sessionStorage.setItem("fortune_paid_ref", ref);
    }
  }, [type, ref]);

  function goToProposal() {
    if (ref) {
      navigate(`${BASE}/ads-audit?paid=${ref}` as string);
    } else {
      navigate(`${BASE}/ads-audit` as string);
    }
  }

  const isProposal = type === "proposal";
  const isService = type === "starter" || type === "leader" || type === "service";

  const serviceNames: Record<string, string> = {
    starter: "Growth Starter",
    leader: "Market Leader",
    service: "Fortune Design Service",
    proposal: "Google Ads Proposal",
  };

  const serviceName = serviceNames[type] ?? "your purchase";

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-24 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-lg w-full text-center"
        >
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} className="text-green-600" />
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
            Payment Successful!
          </h1>

          <p className="text-gray-500 text-lg mb-2">
            Thank you for purchasing <strong className="text-gray-700">{serviceName}</strong>.
          </p>

          {isProposal && (
            <div className="mt-6 mb-8 p-5 bg-blue-50 border border-blue-100 rounded-2xl text-left space-y-2">
              <p className="font-bold text-blue-900 text-sm">Your full proposal is ready</p>
              <p className="text-blue-700 text-sm">
                Click below to return to your Google Ads proposal — it will open fully unlocked with all campaigns, keywords, ad copy, and the downloadable PDF.
              </p>
            </div>
          )}

          {isService && (
            <div className="mt-6 mb-8 p-5 bg-slate-50 border border-gray-200 rounded-2xl text-left space-y-2">
              <p className="font-bold text-gray-900 text-sm">What happens next?</p>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>✓ Our team will contact you within 1 business day</li>
                <li>✓ We'll schedule an onboarding call to get started</li>
                <li>✓ A receipt will be sent to your email by Yoco</li>
              </ul>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
            {isProposal && (
              <button
                onClick={goToProposal}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/25"
              >
                <FileText size={18} /> View Full Proposal
                <ArrowRight size={16} />
              </button>
            )}
            <a
              href={`${BASE}/`}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-all"
            >
              <Home size={18} /> Back to Home
            </a>
          </div>

          <p className="text-xs text-gray-400 mt-8">
            Payment processed securely by Yoco. Fortune Design (Pty) Ltd · fortunedesign.co.za
          </p>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
