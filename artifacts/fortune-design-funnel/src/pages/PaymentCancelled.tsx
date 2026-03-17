import { useLocation } from "wouter";
import { XCircle, ArrowLeft, Home } from "lucide-react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function PaymentCancelled() {
  const [, navigate] = useLocation();
  const params = new URLSearchParams(window.location.search);
  const type = params.get("type") ?? "service";
  const ref = params.get("ref");

  function goBack() {
    if (type === "proposal") {
      navigate(ref ? `${BASE}/ads-audit` : `${BASE}/ads-audit`);
    } else {
      navigate(`${BASE}/`);
    }
  }

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
          <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
            <XCircle size={40} className="text-red-400" />
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
            Payment Cancelled
          </h1>

          <p className="text-gray-500 text-lg mb-8">
            No worries — your payment was cancelled and you have not been charged. You can try again whenever you're ready.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={goBack}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/25"
            >
              <ArrowLeft size={18} /> Try Again
            </button>
            <a
              href={`${BASE}/`}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-all"
            >
              <Home size={18} /> Back to Home
            </a>
          </div>

          <p className="text-xs text-gray-400 mt-8">
            Questions? Contact us on WhatsApp: +27 76 059 7724
          </p>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
