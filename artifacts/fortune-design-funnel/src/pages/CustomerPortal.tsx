import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  LayoutDashboard, FileText, MessageSquare, Calendar,
  LogOut, CheckCircle2, Clock, AlertCircle, Send,
  TrendingUp, Package, BadgeCheck, Video, Wifi,
  ChevronRight, ExternalLink, Bell,
} from "lucide-react";
import { usePortalAuth } from "@/hooks/usePortalAuth";
import { cn } from "@/lib/utils";
import { useSEO } from "@/hooks/useSEO";

type Tab = "dashboard" | "services" | "invoices" | "meeting" | "chat" | "updates";

interface ServiceUpdate {
  id: number; title: string; content: string; createdAt: string;
  serviceName?: string; subscriptionId?: number;
}
interface Subscription {
  id: number; serviceName: string; serviceSlug: string;
  priceRands: string; status: string; startDate: string; nextInvoiceDate: string; notes?: string;
}
interface Invoice {
  id: number; invoiceNumber: string; amountRands: string;
  description: string; status: string; dueDate: string; sentAt?: string; paidAt?: string;
}
interface ChatMsg { id: number; message: string; sender: "customer" | "admin"; createdAt: string; }

const STATUS_COLORS: Record<string, string> = {
  active: "text-emerald-600 bg-emerald-50 border-emerald-200",
  paused: "text-amber-600 bg-amber-50 border-amber-200",
  cancelled: "text-red-600 bg-red-50 border-red-200",
  paid: "text-emerald-600 bg-emerald-50 border-emerald-200",
  sent: "text-sky-600 bg-sky-50 border-sky-200",
  pending: "text-amber-600 bg-amber-50 border-amber-200",
  overdue: "text-red-600 bg-red-50 border-red-200",
};

export default function CustomerPortal() {
  useSEO({ title: "My Dashboard | Indexify Portal", description: "Your Indexify client portal." });

  const [, navigate] = useLocation();
  const { user, loading, logout, authFetch } = usePortalAuth();
  const [tab, setTab] = useState<Tab>("dashboard");

  const [dashboard, setDashboard] = useState<{ subscriptions: Subscription[]; recentInvoices: Invoice[]; unreadMessages: number } | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [sendingMsg, setSendingMsg] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [meetingForm, setMeetingForm] = useState({ preferredDate: "", preferredTime: "", meetingType: "google-meet", notes: "" });
  const [meetingLoading, setMeetingLoading] = useState(false);
  const [meetingSuccess, setMeetingSuccess] = useState(false);
  const [updates, setUpdates] = useState<ServiceUpdate[]>([]);

  useEffect(() => {
    if (!loading && !user) navigate("/login");
    if (!loading && user?.role === "admin") navigate("/admin");
  }, [user, loading]);

  useEffect(() => {
    if (!user) return;
    authFetch("/api/portal/dashboard").then(r => r.json()).then(setDashboard);
  }, [user]);

  useEffect(() => {
    if (tab === "invoices" && user) {
      authFetch("/api/portal/invoices").then(r => r.json()).then(setInvoices);
    }
    if (tab === "chat" && user) loadChat();
    if (tab === "updates" && user) {
      authFetch("/api/portal/updates").then(r => r.json()).then(setUpdates);
    }
  }, [tab, user]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  useEffect(() => {
    if (tab !== "chat") return;
    const interval = setInterval(loadChat, 5000);
    return () => clearInterval(interval);
  }, [tab, user]);

  async function loadChat() {
    if (!user) return;
    const r = await authFetch("/api/portal/chat");
    const msgs = await r.json();
    setChatMessages(msgs);
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!chatInput.trim() || sendingMsg) return;
    setSendingMsg(true);
    try {
      await authFetch("/api/portal/chat", { method: "POST", body: JSON.stringify({ message: chatInput }) });
      setChatInput("");
      await loadChat();
    } finally { setSendingMsg(false); }
  }

  async function submitMeeting(e: React.FormEvent) {
    e.preventDefault();
    setMeetingLoading(true);
    try {
      await authFetch("/api/portal/meeting", { method: "POST", body: JSON.stringify(meetingForm) });
      setMeetingSuccess(true);
    } catch { } finally { setMeetingLoading(false); }
  }

  if (loading) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  );

  const TABS = [
    { id: "dashboard" as Tab, label: "Dashboard", icon: LayoutDashboard },
    { id: "services" as Tab, label: "Services", icon: Package },
    { id: "invoices" as Tab, label: "Invoices", icon: FileText },
    { id: "updates" as Tab, label: "Updates", icon: Bell },
    { id: "meeting" as Tab, label: "Book Meeting", icon: Calendar },
    { id: "chat" as Tab, label: "Chat", icon: MessageSquare, badge: dashboard?.unreadMessages },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top nav */}
      <nav className="bg-slate-900 border-b border-slate-800 px-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between h-14">
          <div className="flex items-center gap-4">
            <a href="/" className="text-xl font-black text-white tracking-tight">indexify.</a>
            <span className="hidden sm:block text-slate-600 text-xs">·</span>
            <span className="hidden sm:block text-slate-400 text-xs font-medium">Client Portal</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-slate-300 text-sm hidden sm:block">{user?.name}</span>
            <button onClick={() => { logout(); navigate("/login"); }} className="flex items-center gap-1.5 text-slate-400 hover:text-white text-xs transition-colors">
              <LogOut size={14} /> Sign out
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Welcome */}
        <div className="mb-6">
          <h1 className="text-2xl font-black text-gray-900">Welcome back, {user?.name?.split(" ")[0]} 👋</h1>
          <p className="text-gray-500 text-sm mt-0.5">{user?.company ? `${user.company} · ` : ""}{user?.email}</p>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 mb-6 overflow-x-auto shadow-sm">
          {TABS.map(({ id, label, icon: Icon, badge }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all relative",
                tab === id ? "bg-primary text-white shadow-sm" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              <Icon size={14} /> {label}
              {!!badge && <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center">{badge}</span>}
            </button>
          ))}
        </div>

        {/* ── Dashboard Tab ── */}
        {tab === "dashboard" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Active Services", value: dashboard?.subscriptions.filter(s => s.status === "active").length ?? "—", icon: BadgeCheck, color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
                { label: "Invoices", value: dashboard?.recentInvoices.length ?? "—", icon: FileText, color: "text-sky-600 bg-sky-50 border-sky-100" },
                { label: "Pending Invoices", value: dashboard?.recentInvoices.filter(i => i.status === "pending" || i.status === "sent").length ?? "—", icon: Clock, color: "text-amber-600 bg-amber-50 border-amber-200" },
                { label: "New Messages", value: dashboard?.unreadMessages ?? 0, icon: MessageSquare, color: "text-violet-600 bg-violet-50 border-violet-200" },
              ].map(({ label, value, icon: Icon, color }, i) => (
                <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                  <div className={cn("w-9 h-9 rounded-xl border flex items-center justify-center mb-3", color)}>
                    <Icon size={16} />
                  </div>
                  <p className="text-2xl font-black text-gray-900">{value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            {/* Active services */}
            {dashboard?.subscriptions && dashboard.subscriptions.length > 0 && (
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><TrendingUp size={15} className="text-primary" /> Your Active Services</h3>
                <div className="space-y-3">
                  {dashboard.subscriptions.map(sub => (
                    <div key={sub.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{sub.serviceName}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Started {new Date(sub.startDate).toLocaleDateString("en-ZA", { month: "long", year: "numeric" })}
                          {" · "}Next renewal: {new Date(sub.nextInvoiceDate).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-black text-gray-900 text-sm">R{sub.priceRands}/mo</span>
                        <span className={cn("text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border", STATUS_COLORS[sub.status] ?? "text-gray-500 bg-gray-50")}>{sub.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent invoices */}
            {dashboard?.recentInvoices && dashboard.recentInvoices.length > 0 && (
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2"><FileText size={15} className="text-primary" /> Recent Invoices</h3>
                  <button onClick={() => setTab("invoices")} className="text-xs text-primary hover:underline flex items-center gap-1">View all <ChevronRight size={11} /></button>
                </div>
                <div className="space-y-2">
                  {dashboard.recentInvoices.slice(0, 3).map(inv => (
                    <div key={inv.id} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{inv.invoiceNumber}</p>
                        <p className="text-xs text-gray-400">{inv.description}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-gray-900 text-sm">R{inv.amountRands}</span>
                        <span className={cn("text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border", STATUS_COLORS[inv.status] ?? "text-gray-500 bg-gray-50")}>{inv.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick actions */}
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { label: "Book a Meeting", desc: "Schedule a strategy call", icon: Calendar, action: () => setTab("meeting"), color: "from-primary/10 to-sky-50 border-primary/20" },
                { label: "Chat with Us", desc: "Send us a message", icon: MessageSquare, action: () => setTab("chat"), color: "from-violet-50 to-purple-50 border-violet-200" },
                { label: "View Invoices", desc: "Check payment history", icon: FileText, action: () => setTab("invoices"), color: "from-emerald-50 to-teal-50 border-emerald-200" },
              ].map(({ label, desc, icon: Icon, action, color }, i) => (
                <button key={i} onClick={action} className={cn("bg-gradient-to-br border rounded-xl p-4 text-left hover:shadow-md transition-all group", color)}>
                  <Icon size={18} className="text-gray-600 mb-2 group-hover:text-primary transition-colors" />
                  <p className="font-bold text-gray-900 text-sm">{label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Services Tab ── */}
        {tab === "services" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                <Package size={15} className="text-primary" />
                <h2 className="font-bold text-gray-900">Your Services</h2>
              </div>
              {dashboard?.subscriptions.length === 0 ? (
                <div className="p-10 text-center text-gray-400">
                  <Package size={32} className="mx-auto mb-3 opacity-30" />
                  <p>No active services yet.</p>
                  <a href="/" className="text-primary text-sm hover:underline mt-2 inline-block">View our packages →</a>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {dashboard?.subscriptions.map(sub => (
                    <div key={sub.id} className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-bold text-gray-900">{sub.serviceName}</p>
                            <span className={cn("text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border", STATUS_COLORS[sub.status] ?? "")}>{sub.status}</span>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
                            {[
                              { label: "Monthly Rate", value: `R${sub.priceRands}` },
                              { label: "Start Date", value: new Date(sub.startDate).toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" }) },
                              { label: "Next Invoice", value: new Date(sub.nextInvoiceDate).toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" }) },
                            ].map(({ label, value }, i) => (
                              <div key={i} className="bg-gray-50 rounded-lg p-3">
                                <p className="text-[10px] text-gray-400 uppercase tracking-wide">{label}</p>
                                <p className="font-bold text-gray-900 text-sm mt-0.5">{value}</p>
                              </div>
                            ))}
                          </div>
                          {sub.notes && <p className="text-xs text-gray-500 mt-3 bg-gray-50 rounded-lg p-3">{sub.notes}</p>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ── Invoices Tab ── */}
        {tab === "invoices" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                <FileText size={15} className="text-primary" />
                <h2 className="font-bold text-gray-900">Invoices</h2>
                <span className="ml-auto text-xs text-gray-400">{invoices.length} total</span>
              </div>
              {invoices.length === 0 ? (
                <div className="p-10 text-center text-gray-400">
                  <FileText size={32} className="mx-auto mb-3 opacity-30" />
                  <p>No invoices yet.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {invoices.map(inv => (
                    <div key={inv.id} className="px-5 py-4 flex items-center gap-4">
                      <div className={cn("w-2 h-10 rounded-full", inv.status === "paid" ? "bg-emerald-400" : inv.status === "overdue" ? "bg-red-400" : "bg-amber-400")} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-bold text-gray-900 text-sm">{inv.invoiceNumber}</p>
                          <span className={cn("text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border", STATUS_COLORS[inv.status] ?? "")}>{inv.status}</span>
                        </div>
                        <p className="text-xs text-gray-500 truncate">{inv.description}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          Due: {new Date(inv.dueDate).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })}
                          {inv.paidAt && ` · Paid: ${new Date(inv.paidAt).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })}`}
                        </p>
                      </div>
                      <span className="font-black text-gray-900 text-base shrink-0">R{inv.amountRands}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bank details card — shown when there are unpaid invoices */}
            {invoices.some(i => i.status === "pending" || i.status === "sent" || i.status === "overdue") && (
              <div className="mt-4 bg-sky-50 border border-sky-200 rounded-2xl p-5">
                <h3 className="font-bold text-sky-900 text-sm mb-3 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-sky-200 flex items-center justify-center text-[10px] font-black text-sky-700">R</span>
                  EFT Banking Details
                </h3>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                  {[
                    ["Bank", "First National Bank (FNB)"],
                    ["Account Holder", "Indexify"],
                    ["Account Number", "63139187181"],
                    ["Branch Code", "254005"],
                    ["Account Type", "Cheque"],
                    ["Reference", "Your invoice number"],
                  ].map(([label, value]) => (
                    <div key={label} className="flex flex-col">
                      <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wide">{label}</span>
                      <span className={cn("font-semibold text-sky-900", label === "Account Number" && "font-black text-base text-primary")}>{value}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-sky-600 mt-3">Please use your invoice number as the payment reference. WhatsApp us at +27 60 298 8295 once paid.</p>
              </div>
            )}
          </motion.div>
        )}

        {/* ── Meeting Tab ── */}
        {tab === "meeting" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-lg">
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Calendar size={18} className="text-primary" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">Book a Meeting</h2>
                  <p className="text-xs text-gray-400">We'll confirm within 24 hours</p>
                </div>
              </div>

              {meetingSuccess ? (
                <div className="text-center py-6">
                  <CheckCircle2 size={40} className="text-emerald-500 mx-auto mb-3" />
                  <p className="font-bold text-gray-900 text-lg">Meeting Requested!</p>
                  <p className="text-gray-500 text-sm mt-1">We'll confirm your meeting within 24 hours.</p>
                  <button onClick={() => setMeetingSuccess(false)} className="mt-4 text-primary text-sm hover:underline">Book another</button>
                </div>
              ) : (
                <form onSubmit={submitMeeting} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Preferred Date</label>
                      <input type="date" value={meetingForm.preferredDate} onChange={e => setMeetingForm(f => ({ ...f, preferredDate: e.target.value }))} required min={new Date().toISOString().split("T")[0]} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/15 bg-gray-50" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Preferred Time</label>
                      <select value={meetingForm.preferredTime} onChange={e => setMeetingForm(f => ({ ...f, preferredTime: e.target.value }))} required className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/15 bg-gray-50">
                        <option value="">Select time</option>
                        {["09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00"].map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Meeting Platform</label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { value: "google-meet", label: "Google Meet", icon: Video },
                        { value: "microsoft-teams", label: "Teams", icon: Wifi },
                      ].map(({ value, label, icon: Icon }) => (
                        <button key={value} type="button" onClick={() => setMeetingForm(f => ({ ...f, meetingType: value }))}
                          className={cn("flex items-center gap-2 p-3 rounded-xl border text-sm font-semibold transition-all", meetingForm.meetingType === value ? "border-primary bg-primary/5 text-primary" : "border-gray-200 text-gray-600 hover:border-gray-300")}>
                          <Icon size={16} /> {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Notes (optional)</label>
                    <textarea value={meetingForm.notes} onChange={e => setMeetingForm(f => ({ ...f, notes: e.target.value }))} placeholder="What would you like to discuss?" rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm resize-none focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/15 bg-gray-50" />
                  </div>

                  <button type="submit" disabled={meetingLoading} className="w-full py-3 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-md shadow-primary/20">
                    {meetingLoading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Submitting…</> : <><Calendar size={14} />Request Meeting</>}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        )}

        {/* ── Updates Tab ── */}
        {tab === "updates" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Service Updates</h2>
              <span className="text-xs text-gray-400">{updates.length} update{updates.length !== 1 ? "s" : ""}</span>
            </div>
            {updates.length === 0 ? (
              <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-sm">
                <Bell size={36} className="mx-auto mb-3 text-gray-200" />
                <p className="text-gray-500 font-medium">No updates yet</p>
                <p className="text-gray-400 text-sm mt-1">Your account manager will post updates here when there's news about your services.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {updates.map(u => (
                  <div key={u.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1.5">
                          {u.serviceName && (
                            <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/8 border border-primary/20 px-2 py-0.5 rounded-full">
                              {u.serviceName}
                            </span>
                          )}
                        </div>
                        <h3 className="font-bold text-gray-900 text-base">{u.title}</h3>
                        <p className="text-gray-600 text-sm mt-2 leading-relaxed whitespace-pre-wrap">{u.content}</p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Bell size={14} className="text-primary" />
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-3 pt-3 border-t border-gray-50">
                      {new Date(u.createdAt).toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ── Chat Tab ── */}
        {tab === "chat" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col" style={{ height: "520px" }}>
              <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3 bg-slate-900">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <MessageSquare size={14} className="text-white" />
                </div>
                <div>
                  <p className="font-bold text-white text-sm">Indexify Support</p>
                  <p className="text-[11px] text-slate-400">Your account manager</p>
                </div>
                <div className="ml-auto flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[11px] text-slate-400">Online</span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50">
                {chatMessages.length === 0 && (
                  <div className="text-center py-10 text-gray-400 text-sm">
                    <MessageSquare size={28} className="mx-auto mb-2 opacity-30" />
                    <p>Start a conversation with your account manager</p>
                  </div>
                )}
                {chatMessages.map(msg => (
                  <div key={msg.id} className={cn("flex", msg.sender === "customer" ? "justify-end" : "justify-start")}>
                    <div className={cn("max-w-[75%] rounded-2xl px-4 py-2.5 text-sm shadow-sm", msg.sender === "customer" ? "bg-primary text-white rounded-br-sm" : "bg-white text-gray-800 border border-gray-100 rounded-bl-sm")}>
                      <p>{msg.message}</p>
                      <p className={cn("text-[10px] mt-1", msg.sender === "customer" ? "text-white/60" : "text-gray-400")}>
                        {new Date(msg.createdAt).toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              <form onSubmit={sendMessage} className="px-4 py-3 border-t border-gray-100 flex gap-2 bg-white">
                <input
                  type="text"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  placeholder="Type a message…"
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/15 bg-gray-50 focus:bg-white transition-all"
                />
                <button type="submit" disabled={sendingMsg || !chatInput.trim()} className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-all disabled:opacity-40 shrink-0">
                  <Send size={15} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
