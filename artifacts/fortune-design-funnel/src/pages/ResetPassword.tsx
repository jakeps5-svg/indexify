import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, KeyRound, CheckCircle2, ArrowLeft } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

const API = import.meta.env.VITE_API_URL ?? "";

export default function ResetPasswordPage() {
  useSEO({ title: "Set New Password | Indexify Portal", description: "Set a new password for your Indexify client portal account." });

  const token = new URLSearchParams(window.location.search).get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) { setError("Password must be at least 8 characters"); return; }
    if (password !== confirm) { setError("Passwords do not match"); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "Reset failed");
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

          <div className="text-center mb-8">
            <a href="/login" className="inline-block">
              <img src="/indexify-logo.png" alt="Indexify" className="h-12 mx-auto mb-3" onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
              <div className="text-3xl font-black text-white tracking-tight">indexify.</div>
            </a>
            <p className="text-slate-400 text-sm mt-1">Client Portal</p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl">
            {!token ? (
              <div className="text-center py-4">
                <p className="text-red-400 text-sm mb-4">Invalid or missing reset link. Please request a new one.</p>
                <a href="/forgot-password" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-sm transition-colors">
                  Request new link
                </a>
              </div>
            ) : done ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={28} className="text-emerald-400" />
                </div>
                <h2 className="text-white font-bold text-xl mb-2">Password updated!</h2>
                <p className="text-slate-400 text-sm mb-6">Your password has been changed successfully. You can now log in.</p>
                <a href="/login" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-violet-500 text-white font-bold text-sm hover:opacity-90 transition-all">
                  Go to Login
                </a>
              </motion.div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
                    <KeyRound size={18} className="text-primary" />
                  </div>
                  <div>
                    <h1 className="text-white font-bold text-lg leading-none">Set New Password</h1>
                    <p className="text-slate-400 text-xs mt-0.5">Choose a strong password</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wide">New Password</label>
                    <div className="relative">
                      <input
                        type={showPw ? "text" : "password"}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Min. 8 characters"
                        required
                        className="w-full px-4 py-3 pr-11 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                      <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors">
                        {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wide">Confirm Password</label>
                    <input
                      type={showPw ? "text" : "password"}
                      value={confirm}
                      onChange={e => setConfirm(e.target.value)}
                      placeholder="Repeat password"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all"
                    />
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
                    {loading
                      ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</>
                      : <><KeyRound size={14} /> Save New Password</>}
                  </button>
                </form>

                <div className="mt-5 pt-5 border-t border-white/10 text-center">
                  <a href="/login" className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition-colors">
                    <ArrowLeft size={13} /> Back to login
                  </a>
                </div>
              </>
            )}
          </div>

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
