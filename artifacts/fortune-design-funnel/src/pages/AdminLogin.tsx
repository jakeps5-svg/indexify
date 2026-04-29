import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Eye, EyeOff, LogIn, ShieldCheck } from "lucide-react";
import { usePortalAuth } from "@/hooks/usePortalAuth";
import { useSEO } from "@/hooks/useSEO";

export default function AdminLoginPage() {
  useSEO({ title: "Admin Login | Indexify", description: "Indexify admin login." });

  const [, navigate] = useLocation();
  const { user, loading: authLoading, setSession } = usePortalAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Already logged in as admin → go straight to dashboard
  useEffect(() => {
    if (!authLoading && user?.role === "admin") navigate("/admin");
  }, [user, authLoading]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Login failed");
      if (data.user.role !== "admin") {
        throw new Error("This login is for admin accounts only. Clients please use the client portal login.");
      }
      setSession(data.token, data.user);
      navigate("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

          {/* Logo */}
          <div className="text-center mb-8">
            <a href="/" className="inline-block">
              <img src="/indexify-logo.png" alt="Indexify" className="h-12 mx-auto mb-3" onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
              <div className="text-3xl font-black text-white tracking-tight">indexify.</div>
            </a>
            <p className="text-slate-500 text-sm mt-1">Admin Portal</p>
          </div>

          {/* Card */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                <ShieldCheck size={18} className="text-amber-400" />
              </div>
              <div>
                <h1 className="text-white font-bold text-lg leading-none">Admin Sign In</h1>
                <p className="text-slate-400 text-xs mt-0.5">Fortune Design staff only</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wide">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@fortunedesign.co.za"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wide">Password</label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-3 pr-11 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/20 transition-all"
                  />
                  <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors">
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
                  {error}
                </motion.div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm hover:opacity-90 transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 mt-2"
              >
                {submitting
                  ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in…</>
                  : <><LogIn size={15} />Sign In to Admin</>
                }
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="text-center mt-6">
            <a href="/login" className="text-slate-500 hover:text-slate-300 text-xs transition-colors">← Client portal login</a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
