import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, User, Mail, Phone, Globe, Clock, CheckCircle2, Loader2, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRecaptcha } from "@/hooks/useRecaptcha";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

const TIME_SLOTS = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
];

function formatTime(t: string) {
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, "0")} ${ampm}`;
}

function formatDate(d: string) {
  if (!d) return "";
  const date = new Date(d + "T00:00:00");
  return date.toLocaleDateString("en-ZA", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

function getTodayStr() {
  const d = new Date();
  return d.toISOString().split("T")[0];
}

function TeamsLogo() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="6" fill="#6264A7"/>
      <path d="M20.5 10.5h-4v1.5h1.5v7h1.5v-7h1V10.5z" fill="white"/>
      <path d="M12 13a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" fill="white"/>
      <path d="M7 20.5c0-2.485 2.239-4.5 5-4.5s5 2.015 5 4.5V21H7v-.5z" fill="white"/>
      <path d="M19 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" fill="#C8C6F4"/>
      <path d="M22 21h-8c0-1.657 1.567-3 3.5-3h1c1.933 0 3.5 1.343 3.5 3z" fill="#C8C6F4"/>
      <path d="M22 15.5c0 .828.672 1.5 1.5 1.5S25 16.328 25 15.5 24.328 14 23.5 14 22 14.672 22 15.5z" fill="#C8C6F4"/>
      <path d="M25.5 17h-4c-.276 0-.5.224-.5.5v3h5v-3c0-.276-.224-.5-.5-.5z" fill="#C8C6F4"/>
    </svg>
  );
}

function GoogleMeetLogo() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="6" fill="white"/>
      <path d="M18.667 16l4 3.2V12.8l-4 3.2z" fill="#EA4335"/>
      <path d="M6 13.333A2.667 2.667 0 0 1 8.667 10.667h8A2.667 2.667 0 0 1 19.333 13.333v5.333A2.667 2.667 0 0 1 16.667 21.333h-8A2.667 2.667 0 0 1 6 18.667V13.333z" fill="#1A73E8"/>
      <path d="M6 16h13.333v2.667A2.667 2.667 0 0 1 16.667 21.333h-8A2.667 2.667 0 0 1 6 18.667V16z" fill="#188038"/>
      <path d="M6 13.333A2.667 2.667 0 0 1 8.667 10.667h8A2.667 2.667 0 0 1 19.333 13.333V16H6V13.333z" fill="#1A73E8"/>
      <path d="M18.667 16l4-3.2v6.4l-4-3.2z" fill="#FBBC05"/>
      <path d="M19.333 13.333V16H18.667l-4-3.2V12.8l4 3.2.667-.667z" fill="#EA4335"/>
      <path d="M19.333 18.667V16H18.667l-4 3.2v.533l4-3.2.667.134z" fill="#188038"/>
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="26" height="26">
      <rect x="3" y="4" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="2" fill="none"/>
      <path d="M3 9h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M8 2v4M16 2v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="8" cy="14" r="1.2" fill="currentColor"/>
      <circle cx="12" cy="14" r="1.2" fill="currentColor"/>
      <circle cx="16" cy="14" r="1.2" fill="currentColor"/>
    </svg>
  );
}

export function BookingModal() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    website: "",
    date: "",
    time: "",
    platform: "" as "teams" | "meet" | "",
    needs: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const { getToken } = useRecaptcha();

  function handleClose() {
    setOpen(false);
    setTimeout(() => {
      setSuccess(false);
      setError("");
      setForm({ name: "", email: "", phone: "", website: "", date: "", time: "", platform: "", needs: "" });
    }, 300);
  }

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  function set(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.date || !form.time || !form.platform) {
      setError("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const recaptchaToken = await getToken("booking").catch(() => "");
      const res = await fetch(`${API_BASE}/api/book-meeting`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          date: formatDate(form.date),
          time: formatTime(form.time),
          recaptchaToken,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Something went wrong.");
      }
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all";
  const labelClass = "block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5";

  return (
    <>
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={handleClose}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.97 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="relative w-full sm:max-w-xl bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[92vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Calendar size={18} className="text-primary" />
                </div>
                <div>
                  <h2 className="font-black text-gray-900 text-lg leading-tight">Book a Meeting</h2>
                  <p className="text-xs text-gray-400">Teams or Google Meet · Free consultation</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <X size={16} className="text-gray-500" />
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto flex-1">
              {success ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-8 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
                    <CheckCircle2 size={32} className="text-green-500" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-3">Request sent!</h3>
                  <p className="text-gray-500 leading-relaxed mb-2">
                    Thanks, <strong>{form.name.split(" ")[0]}</strong>! We've received your meeting request for{" "}
                    <strong>{formatDate(form.date)}</strong> at <strong>{formatTime(form.time)}</strong>.
                  </p>
                  <p className="text-gray-500 text-sm leading-relaxed mb-8">
                    A{" "}
                    <strong>{form.platform === "teams" ? "Microsoft Teams" : "Google Meet"}</strong> link will be sent to{" "}
                    <strong>{form.email}</strong> shortly. Check your inbox (and spam just in case).
                  </p>
                  <button
                    onClick={handleClose}
                    className="px-8 py-3 rounded-xl font-bold text-white text-sm bg-primary hover:bg-primary/90 transition-all"
                  >
                    Done
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="p-6 space-y-5">

                  {/* Platform */}
                  <div>
                    <label className={labelClass}>Meeting Platform *</label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { value: "teams", label: "Microsoft Teams", logo: <TeamsLogo /> },
                        { value: "meet",  label: "Google Meet",      logo: <GoogleMeetLogo /> },
                      ].map((p) => (
                        <button
                          key={p.value}
                          type="button"
                          onClick={() => set("platform", p.value)}
                          className={cn(
                            "flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 text-left transition-all",
                            form.platform === p.value
                              ? "border-primary bg-primary/5 shadow-sm"
                              : "border-gray-200 bg-white hover:border-gray-300"
                          )}
                        >
                          <span className="shrink-0">{p.logo}</span>
                          <div className="flex-1 min-w-0">
                            <p className={cn("text-xs font-bold leading-tight", form.platform === p.value ? "text-primary" : "text-gray-700")}>
                              {p.label}
                            </p>
                          </div>
                          {form.platform === p.value && (
                            <CheckCircle2 size={15} className="text-primary shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name + Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}><User size={10} className="inline mr-1" />Full Name *</label>
                      <input
                        type="text"
                        placeholder="Jane Smith"
                        value={form.name}
                        onChange={(e) => set("name", e.target.value)}
                        className={inputClass}
                        required
                      />
                    </div>
                    <div>
                      <label className={labelClass}><Mail size={10} className="inline mr-1" />Email *</label>
                      <input
                        type="email"
                        placeholder="jane@company.com"
                        value={form.email}
                        onChange={(e) => set("email", e.target.value)}
                        className={inputClass}
                        required
                      />
                    </div>
                  </div>

                  {/* Phone + Website */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}><Phone size={10} className="inline mr-1" />Phone Number *</label>
                      <input
                        type="tel"
                        placeholder="+27 71 234 5678"
                        value={form.phone}
                        onChange={(e) => set("phone", e.target.value)}
                        className={inputClass}
                        required
                      />
                    </div>
                    <div>
                      <label className={labelClass}><Globe size={10} className="inline mr-1" />Website URL</label>
                      <input
                        type="url"
                        placeholder="https://yourwebsite.co.za"
                        value={form.website}
                        onChange={(e) => set("website", e.target.value)}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  {/* Date + Time */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}><Calendar size={10} className="inline mr-1" />Preferred Date *</label>
                      <input
                        type="date"
                        min={getTodayStr()}
                        value={form.date}
                        onChange={(e) => set("date", e.target.value)}
                        className={inputClass}
                        required
                      />
                    </div>
                    <div>
                      <label className={labelClass}><Clock size={10} className="inline mr-1" />Preferred Time *</label>
                      <div className="relative">
                        <select
                          value={form.time}
                          onChange={(e) => set("time", e.target.value)}
                          className={cn(inputClass, "appearance-none pr-10")}
                          required
                        >
                          <option value="">Select a time</option>
                          {TIME_SLOTS.map((t) => (
                            <option key={t} value={t}>{formatTime(t)} SAST</option>
                          ))}
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Needs */}
                  <div>
                    <label className={labelClass}>Tell us about your needs</label>
                    <textarea
                      rows={3}
                      placeholder="Briefly describe what you'd like to discuss — e.g. SEO for my law firm, Google Ads for e-commerce store..."
                      value={form.needs}
                      onChange={(e) => set("needs", e.target.value)}
                      className={cn(inputClass, "resize-none")}
                    />
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600 font-medium">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-xl font-black text-white text-sm bg-gradient-to-r from-primary to-[#7c4dff] hover:opacity-90 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {loading ? (
                      <><Loader2 size={16} className="animate-spin" /> Sending request...</>
                    ) : (
                      <><Calendar size={16} /> Request Meeting</>
                    )}
                  </button>

                  <p className="text-center text-xs text-gray-400">
                    We'll confirm your slot and send the meeting link to your email within 1 business hour.
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

    {/* Floating trigger button */}
    <motion.button
      onClick={() => setOpen(true)}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.2, type: "spring", damping: 20 }}
      className="fixed bottom-28 right-5 z-[9000] flex items-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-primary to-[#7c4dff] text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 text-sm font-bold"
      aria-label="Book a Meeting"
    >
      <CalendarIcon />
      <span className="hidden sm:inline">Book a Meeting</span>
    </motion.button>
  </>
  );
}
