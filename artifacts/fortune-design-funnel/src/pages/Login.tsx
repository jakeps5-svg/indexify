import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Eye, EyeOff, LogIn, Shield } from "lucide-react";
import { usePortalAuth } from "@/hooks/usePortalAuth";
import { useSEO } from "@/hooks/useSEO";
import { useRecaptcha } from "@/hooks/useRecaptcha";

export default function LoginPage() {
  useSEO({ title: "Client Portal Login | Indexify", description: "Log in to your Indexify client portal to track services, view invoices, and chat with your account manager." });

  const [, navigate] = useLocation();
  const { login } = usePortalAuth();
  const { getToken } = useRecaptcha();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const recaptchaToken = await getToken("login").catch(() => "");
      const user = await login(email, password, recaptchaToken);
      navigate(user.role === "admin" ? "/admin" : "/portal");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

          {/* Logo */}
          <div className="text-center mb-8">
            <a href="/" className="inline-block">
              <img src="/indexify-logo.png" alt="Indexify" className="h-12 mx-auto mb-3" onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
              <div className="text-3xl font-black text-white tracking-tight">indexify.</div>
            </a>
            <p className="text-slate-400 text-sm mt-1">Client Portal</p>
          </div>

          {/* Card */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
                <Shield size={18} className="text-primary" />
              </div>
              <div>
                <h1 className="text-white font-bold text-lg leading-none">Sign In</h1>
                <p className="text-slate-400 text-xs mt-0.5">Access your client dashboard</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wide">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@company.co.za"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wide">Password</label>
                  <a href="/forgot-password" className="text-xs text-primary hover:text-primary/80 transition-colors">Forgot password?</a>
                </div>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-3 pr-11 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all"
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
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-violet-500 text-white font-bold text-sm hover:opacity-90 transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg shadow-primary/25 mt-2"
              >
                {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in…</> : <><LogIn size={15} />Sign In</>}
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="text-center mt-6 flex items-center justify-center gap-3">
            <a href="/" className="text-slate-500 hover:text-slate-300 text-xs transition-colors">← Back to indexify.co.za</a>
            <span className="text-slate-700">·</span>
            <div className="flex items-center gap-1.5 text-slate-500 text-xs">
              <span>Powered by</span>
              <img src="/images/fortune-design-logo.png" alt="Fortune Design" className="h-4" onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
              <span className="font-semibold text-slate-400">Fortune Design</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
