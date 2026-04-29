import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  Users, FileText, MessageSquare, Calendar, LogOut,
  TrendingUp, DollarSign, Send, CheckCircle2, PlusCircle,
  X, ChevronDown, AlertCircle, Clock, Search,
  Package, RefreshCw, BarChart3, Bell,
  Trash2, Pencil, Paperclip, ImagePlus, Download, ExternalLink,
  MousePointerClick, Inbox, Phone, Mail,
} from "lucide-react";
import { usePortalAuth } from "@/hooks/usePortalAuth";
import { cn } from "@/lib/utils";
import { useSEO } from "@/hooks/useSEO";

type Tab = "overview" | "customers" | "invoices" | "chat" | "meetings" | "enquiries";

interface Customer {
  id: number; name: string; email: string; phone?: string; company?: string;
  createdAt: string; subscriptions: Subscription[]; invoices: Invoice[]; unreadMessages: number;
  googleAdsCustomerId?: string | null;
}
interface Subscription {
  id: number; userId: number; serviceName: string; serviceSlug: string;
  priceRands: string; status: string; startDate: string; nextInvoiceDate: string; notes?: string;
}
interface Invoice {
  id: number; invoiceNumber: string; userId: number; subscriptionId?: number;
  amountRands: string; description: string; status: string;
  dueDate: string; sentAt?: string; paidAt?: string; createdAt: string;
  customerName?: string; customerEmail?: string;
}
interface ChatMsg {
  id: number; message: string; sender: "customer" | "admin"; createdAt: string; read: boolean;
  attachmentUrl?: string | null; attachmentName?: string | null; attachmentMime?: string | null;
}
interface Meeting {
  id: number; userId: number; preferredDate: string; preferredTime: string;
  meetingType: string; notes?: string; status: string; createdAt: string;
  customerName?: string; customerEmail?: string;
}
interface Attachment { url: string; name: string; mime: string; }
interface Enquiry {
  id: number; name: string; email: string; phone?: string | null;
  service: string; message: string; createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  active: "text-emerald-600 bg-emerald-50 border-emerald-200",
  paused: "text-amber-600 bg-amber-50 border-amber-200",
  cancelled: "text-red-600 bg-red-50 border-red-200",
  paid: "text-emerald-600 bg-emerald-50 border-emerald-200",
  sent: "text-sky-600 bg-sky-50 border-sky-100",
  pending: "text-amber-600 bg-amber-50 border-amber-200",
  overdue: "text-red-600 bg-red-50 border-red-200",
  confirmed: "text-emerald-600 bg-emerald-50 border-emerald-200",
};

const SERVICES = [
  { name: "Basic SEO", slug: "basic-seo", price: "5900" },
  { name: "Advanced SEO", slug: "advanced-seo", price: "7900" },
  { name: "Premium SEO", slug: "premium-seo", price: "11900" },
  { name: "Google Ads Management", slug: "google-ads", price: "7300" },
  { name: "Market Leader Bundle", slug: "market-leader", price: "12500" },
];

function AttachmentPreview({ url, name, mime, className }: { url: string; name: string; mime?: string | null; className?: string }) {
  const isImage = mime?.startsWith("image/") || /\.(png|jpe?g|gif|webp|svg)$/i.test(name);
  const isPdf = mime === "application/pdf" || name.toLowerCase().endsWith(".pdf");
  return (
    <div className={cn("mt-2 rounded-xl overflow-hidden border border-white/20", className)}>
      {isImage ? (
        <a href={url} target="_blank" rel="noopener noreferrer">
          <img src={url} alt={name} className="max-w-[220px] max-h-[160px] object-cover rounded-xl" />
        </a>
      ) : (
        <a href={url} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
          <FileText size={14} />
          <span className="text-xs font-medium truncate max-w-[160px]">{name}</span>
          <Download size={12} className="shrink-0 opacity-70" />
        </a>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  useSEO({ title: "Admin Dashboard | Indexify", description: "Indexify admin dashboard." });

  const [, navigate] = useLocation();
  const { user, loading, logout, authFetch } = usePortalAuth();
  const [tab, setTab] = useState<Tab>("overview");

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [sendingMsg, setSendingMsg] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatFileRef = useRef<HTMLInputElement>(null);
  const updateFileRef = useRef<HTMLInputElement>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [showAddInvoice, setShowAddInvoice] = useState(false);
  const [showAddSub, setShowAddSub] = useState<Customer | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Customer | null>(null);
  const [editSub, setEditSub] = useState<Subscription | null>(null);
  const [editSubForm, setEditSubForm] = useState({ serviceSlug: "basic-seo", priceRands: "", status: "active", notes: "" });

  const [newCustomer, setNewCustomer] = useState({ name: "", email: "", phone: "", company: "", password: "" });
  const [newInvoice, setNewInvoice] = useState({ userId: "", subscriptionId: "", amountRands: "", description: "", dueDate: "" });
  const [newSub, setNewSub] = useState({ serviceSlug: "basic-seo", notes: "" });
  const [saving, setSaving] = useState(false);

  const [showUpdateModal, setShowUpdateModal] = useState<Customer | null>(null);
  const [newUpdate, setNewUpdate] = useState({ title: "", content: "", subscriptionId: "" });
  const [updateAttachment, setUpdateAttachment] = useState<Attachment | null>(null);
  const [chatAttachment, setChatAttachment] = useState<Attachment | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [editingGadsId, setEditingGadsId] = useState<number | null>(null);
  const [gadsIdInput, setGadsIdInput] = useState("");
  const [gadsConnected, setGadsConnected] = useState<boolean | null>(null);
  const [gadsToast, setGadsToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!user) { navigate("/admin-login"); return; }
    if (user.role !== "admin") { navigate("/portal"); return; }

    const params = new URLSearchParams(window.location.search);
    const gads = params.get("gads");
    const msg = params.get("msg");
    if (gads === "connected") {
      setGadsToast({ type: "success", msg: "Google Ads account connected successfully!" });
      setGadsConnected(true);
      window.history.replaceState({}, "", window.location.pathname);
    } else if (gads === "error") {
      setGadsToast({ type: "error", msg: msg ? decodeURIComponent(msg) : "Failed to connect Google Ads" });
      window.history.replaceState({}, "", window.location.pathname);
    }
    setTimeout(() => setGadsToast(null), 6000);
  }, [user, loading]);

  const loadCustomers = async () => {
    const r = await authFetch("/api/admin/customers");
    setCustomers(await r.json());
  };
  const loadInvoices = async () => {
    const r = await authFetch("/api/admin/invoices");
    setInvoices(await r.json());
  };
  const loadMeetings = async () => {
    const r = await authFetch("/api/admin/meetings");
    setMeetings(await r.json());
  };
  const loadEnquiries = async () => {
    const r = await authFetch("/api/admin/enquiries");
    setEnquiries(await r.json());
  };

  const loadGadsStatus = async () => {
    try {
      const r = await authFetch("/api/admin/google-ads/status");
      const d = await r.json();
      setGadsConnected(d.connected ?? false);
    } catch {
      setGadsConnected(false);
    }
  };

  const connectAgencyGoogleAds = async () => {
    try {
      const r = await authFetch("/api/admin/google-ads/auth-url");
      if (!r.ok) {
        const d = await r.json();
        toast({ title: "Error", description: d.error ?? "Could not get authorisation URL.", variant: "destructive" });
        return;
      }
      const { url } = await r.json();
      window.location.href = url;
    } catch {
      toast({ title: "Error", description: "Failed to initiate Google Ads connection.", variant: "destructive" });
    }
  };

  useEffect(() => {
    if (!user) return;
    loadCustomers();
    loadInvoices();
    loadMeetings();
    loadEnquiries();
    loadGadsStatus();
  }, [user]);

  // Deep-link: ?tab=chat&clientId=X — auto-open the right client's chat
  useEffect(() => {
    if (customers.length === 0) return;
    const params = new URLSearchParams(window.location.search);
    const deepTab = params.get("tab");
    const deepClientId = params.get("clientId");
    if (deepTab === "chat" && deepClientId) {
      const match = customers.find((c) => c.id === Number(deepClientId));
      if (match) {
        setSelectedCustomer(match);
        setTab("chat");
        window.history.replaceState({}, "", window.location.pathname);
      }
    }
  }, [customers]);

  useEffect(() => {
    if (tab === "chat" && selectedCustomer) loadChat(selectedCustomer.id);
  }, [tab, selectedCustomer]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  useEffect(() => {
    if (tab !== "chat" || !selectedCustomer) return;
    const interval = setInterval(() => loadChat(selectedCustomer.id), 5000);
    return () => clearInterval(interval);
  }, [tab, selectedCustomer]);

  async function loadChat(uid: number) {
    const r = await authFetch(`/api/admin/chat/${uid}`);
    setChatMessages(await r.json());
  }

  async function uploadFile(file: File): Promise<Attachment | null> {
    setUploadingFile(true);
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(",")[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const r = await authFetch("/api/admin/uploads", {
        method: "POST",
        body: JSON.stringify({ attachmentBase64: base64, attachmentName: file.name, attachmentMime: file.type }),
      });
      if (!r.ok) { alert("Upload failed"); return null; }
      const data = await r.json();
      return { url: data.url, name: file.name, mime: file.type };
    } catch {
      alert("Upload failed");
      return null;
    } finally {
      setUploadingFile(false);
    }
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if ((!chatInput.trim() && !chatAttachment) || sendingMsg || !selectedCustomer) return;
    setSendingMsg(true);
    try {
      await authFetch(`/api/admin/chat/${selectedCustomer.id}`, {
        method: "POST",
        body: JSON.stringify({
          message: chatInput.trim(),
          attachmentUrl: chatAttachment?.url ?? undefined,
          attachmentName: chatAttachment?.name ?? undefined,
          attachmentMime: chatAttachment?.mime ?? undefined,
        }),
      });
      setChatInput("");
      setChatAttachment(null);
      await loadChat(selectedCustomer.id);
    } finally { setSendingMsg(false); }
  }

  async function createCustomer(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    try {
      const r = await authFetch("/api/admin/customers", { method: "POST", body: JSON.stringify(newCustomer) });
      if (!r.ok) { const d = await r.json(); alert(d.error); return; }
      await loadCustomers();
      setShowAddCustomer(false);
      setNewCustomer({ name: "", email: "", phone: "", company: "", password: "" });
    } finally { setSaving(false); }
  }

  async function deleteCustomer(id: number) {
    setSaving(true);
    try {
      const r = await authFetch(`/api/admin/customers/${id}`, { method: "DELETE", body: "{}" });
      if (!r.ok) { const d = await r.json(); alert(d.error); return; }
      setDeleteConfirm(null);
      if (selectedCustomer?.id === id) setSelectedCustomer(null);
      await loadCustomers();
    } finally { setSaving(false); }
  }

  async function createSubscription(e: React.FormEvent) {
    e.preventDefault(); if (!showAddSub) return; setSaving(true);
    try {
      const svc = SERVICES.find(s => s.slug === newSub.serviceSlug)!;
      await authFetch("/api/admin/subscriptions", { method: "POST", body: JSON.stringify({ userId: showAddSub.id, serviceName: svc.name, serviceSlug: svc.slug, priceRands: svc.price, notes: newSub.notes }) });
      await loadCustomers();
      setShowAddSub(null);
    } finally { setSaving(false); }
  }

  async function saveEditSub(e: React.FormEvent) {
    e.preventDefault(); if (!editSub) return; setSaving(true);
    try {
      const svc = SERVICES.find(s => s.slug === editSubForm.serviceSlug)!;
      await authFetch(`/api/admin/subscriptions/${editSub.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          serviceName: svc.name, serviceSlug: svc.slug,
          priceRands: editSubForm.priceRands || svc.price,
          status: editSubForm.status,
          notes: editSubForm.notes,
        }),
      });
      await loadCustomers();
      setEditSub(null);
    } finally { setSaving(false); }
  }

  async function deleteSubscription(subId: number) {
    if (!confirm("Delete this subscription? All related updates and invoices will also be removed.")) return;
    await authFetch(`/api/admin/subscriptions/${subId}`, { method: "DELETE", body: "{}" });
    await loadCustomers();
  }

  async function createInvoice(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    try {
      await authFetch("/api/admin/invoices", { method: "POST", body: JSON.stringify({ ...newInvoice, userId: Number(newInvoice.userId), subscriptionId: newInvoice.subscriptionId ? Number(newInvoice.subscriptionId) : undefined }) });
      await loadInvoices();
      setShowAddInvoice(false);
      setNewInvoice({ userId: "", subscriptionId: "", amountRands: "", description: "", dueDate: "" });
    } finally { setSaving(false); }
  }

  async function postUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!showUpdateModal) return;
    setSaving(true);
    try {
      await authFetch("/api/admin/updates", {
        method: "POST",
        body: JSON.stringify({
          userId: showUpdateModal.id,
          subscriptionId: newUpdate.subscriptionId ? Number(newUpdate.subscriptionId) : undefined,
          title: newUpdate.title,
          content: newUpdate.content,
          attachmentUrl: updateAttachment?.url ?? undefined,
          attachmentName: updateAttachment?.name ?? undefined,
          attachmentMime: updateAttachment?.mime ?? undefined,
        }),
      });
      setShowUpdateModal(null);
      setNewUpdate({ title: "", content: "", subscriptionId: "" });
      setUpdateAttachment(null);
    } finally { setSaving(false); }
  }

  async function sendInvoice(id: number) {
    const r = await authFetch(`/api/admin/invoices/${id}/send`, { method: "POST", body: "{}" });
    if (!r.ok) { const d = await r.json(); alert(d.error); return; }
    await loadInvoices();
  }

  async function markPaid(id: number) {
    await authFetch(`/api/admin/invoices/${id}/paid`, { method: "PATCH", body: "{}" });
    await loadInvoices();
  }

  async function updateMeeting(id: number, status: "confirmed" | "cancelled") {
    await authFetch(`/api/admin/meetings/${id}`, { method: "PATCH", body: JSON.stringify({ status }) });
    await loadMeetings();
  }

  async function saveGadsId(customerId: number) {
    await authFetch(`/api/admin/customers/${customerId}/google-ads`, {
      method: "PATCH",
      body: JSON.stringify({ googleAdsCustomerId: gadsIdInput.trim() || null }),
    });
    setEditingGadsId(null);
    await loadCustomers();
  }

  if (loading) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  );

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.company ?? "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalRevenue = customers.reduce((sum, c) => sum + c.subscriptions.filter(s => s.status === "active").reduce((s2, sub) => s2 + Number(sub.priceRands), 0), 0);
  const pendingInvoicesCount = invoices.filter(i => i.status === "pending" || i.status === "sent").length;
  const totalUnread = customers.reduce((sum, c) => sum + c.unreadMessages, 0);
  const pendingMeetings = meetings.filter(m => m.status === "pending").length;

  const TABS = [
    { id: "overview" as Tab, label: "Overview", icon: BarChart3 },
    { id: "enquiries" as Tab, label: "Enquiries", icon: Inbox, badge: enquiries.length > 0 ? enquiries.length : undefined },
    { id: "customers" as Tab, label: `Customers (${customers.length})`, icon: Users },
    { id: "invoices" as Tab, label: `Invoices`, icon: FileText, badge: pendingInvoicesCount },
    { id: "chat" as Tab, label: "Chat", icon: MessageSquare, badge: totalUnread },
    { id: "meetings" as Tab, label: "Meetings", icon: Calendar, badge: pendingMeetings },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Google Ads OAuth toast */}
      {gadsToast && (
        <div className={cn(
          "fixed top-4 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl border text-sm font-semibold transition-all",
          gadsToast.type === "success"
            ? "bg-emerald-600 border-emerald-500 text-white"
            : "bg-red-600 border-red-500 text-white"
        )}>
          {gadsToast.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {gadsToast.msg}
          <button onClick={() => setGadsToast(null)} className="ml-2 opacity-70 hover:opacity-100"><X size={14} /></button>
        </div>
      )}

      {/* Nav */}
      <nav className="bg-slate-900 border-b border-slate-800 px-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-14">
          <div className="flex items-center gap-4">
            <a href="/" className="text-xl font-black text-white">indexify.</a>
            <span className="text-slate-600 text-xs hidden sm:block">·</span>
            <span className="text-slate-400 text-xs font-medium hidden sm:block">Admin Dashboard</span>
            <span className="text-[10px] font-bold text-violet-400 bg-violet-400/10 border border-violet-400/20 px-2 py-0.5 rounded-full uppercase tracking-wide">Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-slate-300 text-sm hidden sm:block">{user?.name}</span>
            <button onClick={() => { logout(); navigate("/admin-login"); }} className="flex items-center gap-1.5 text-slate-400 hover:text-white text-xs transition-colors">
              <LogOut size={14} /> Sign out
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-black text-gray-900">Business Overview</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage clients, invoices, chat and meetings</p>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 mb-6 overflow-x-auto shadow-sm">
          {TABS.map(({ id, label, icon: Icon, badge }) => (
            <button key={id} onClick={() => setTab(id)}
              className={cn("flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all relative",
                tab === id ? "bg-slate-900 text-white shadow-sm" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50")}>
              <Icon size={14} /> {label}
              {!!badge && <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center">{badge}</span>}
            </button>
          ))}
        </div>

        {/* ── Overview ── */}
        {tab === "overview" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Total Clients", value: customers.length, icon: Users, color: "text-sky-600 bg-sky-50 border-sky-200" },
                { label: "Monthly Revenue", value: `R${totalRevenue.toLocaleString()}`, icon: DollarSign, color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
                { label: "Pending Invoices", value: pendingInvoicesCount, icon: FileText, color: "text-amber-600 bg-amber-50 border-amber-200" },
                { label: "Unread Messages", value: totalUnread, icon: MessageSquare, color: "text-violet-600 bg-violet-50 border-violet-200" },
              ].map(({ label, value, icon: Icon, color }, i) => (
                <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                  <div className={cn("w-10 h-10 rounded-xl border flex items-center justify-center mb-3", color)}>
                    <Icon size={18} />
                  </div>
                  <p className="text-2xl font-black text-gray-900">{value}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            {/* Google Ads Integration Status */}
            <div className={cn(
              "rounded-2xl p-5 border flex items-center gap-4",
              gadsConnected === null ? "bg-gray-50 border-gray-200" :
              gadsConnected ? "bg-emerald-50 border-emerald-200" : "bg-violet-50 border-violet-200"
            )}>
              <div className={cn(
                "w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0",
                gadsConnected === null ? "bg-gray-100 border-gray-200 text-gray-400" :
                gadsConnected ? "bg-emerald-100 border-emerald-200 text-emerald-600" : "bg-violet-100 border-violet-200 text-violet-600"
              )}>
                <BarChart3 size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-gray-900">Google Ads Integration</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {gadsConnected === null ? "Checking connection status…" :
                   gadsConnected ? "Agency Google Ads account is connected. Client portals can display live campaign data." :
                   "Not connected. Authorise your agency Google Ads account so client portals can display live data."}
                </p>
              </div>
              <div className="flex-shrink-0 flex flex-col items-end gap-2">
                {gadsConnected === false && (
                  <button
                    onClick={connectAgencyGoogleAds}
                    className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors"
                  >
                    <ExternalLink size={13} /> Connect Google Ads
                  </button>
                )}
                {gadsConnected === true && (
                  <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-full">
                    <CheckCircle2 size={12} /> Connected
                  </span>
                )}
                <span className="text-[10px] text-gray-400 font-mono break-all text-right max-w-[220px]">
                  Callback URL: {window.location.origin}/api/auth/google-ads/callback
                </span>
              </div>
            </div>

            {/* Active subscriptions summary */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Package size={15} className="text-primary" /> Active Subscriptions</h3>
              {customers.filter(c => c.subscriptions.some(s => s.status === "active")).length === 0 ? (
                <p className="text-gray-400 text-sm">No active subscriptions yet.</p>
              ) : (
                <div className="space-y-2">
                  {customers.filter(c => c.subscriptions.some(s => s.status === "active")).map(c => (
                    c.subscriptions.filter(s => s.status === "active").map(sub => (
                      <div key={sub.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-black text-primary">{c.name.charAt(0)}</div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 text-sm truncate">{c.name}</p>
                          <p className="text-xs text-gray-400">{sub.serviceName}</p>
                        </div>
                        <span className="font-black text-gray-900 text-sm">R{sub.priceRands}/mo</span>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">Active</span>
                      </div>
                    ))
                  ))}
                </div>
              )}
            </div>

            {/* Upcoming meetings */}
            {meetings.filter(m => m.status === "pending").length > 0 && (
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Calendar size={15} className="text-amber-500" /> Pending Meetings</h3>
                <div className="space-y-2">
                  {meetings.filter(m => m.status === "pending").slice(0, 3).map(m => (
                    <div key={m.id} className="flex items-center gap-4 p-3 bg-amber-50 rounded-xl border border-amber-100">
                      <div className="text-center min-w-[48px]">
                        <p className="text-xs text-amber-600 font-bold">{m.preferredDate}</p>
                        <p className="text-xs text-amber-500">{m.preferredTime}</p>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 text-sm">{m.customerName}</p>
                        <p className="text-xs text-gray-400">{m.meetingType.replace("-", " ")}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => updateMeeting(m.id, "confirmed")} className="text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg hover:bg-emerald-100 transition-colors">Confirm</button>
                        <button onClick={() => updateMeeting(m.id, "cancelled")} className="text-[11px] font-bold text-red-500 bg-red-50 border border-red-200 px-2.5 py-1 rounded-lg hover:bg-red-100 transition-colors">Cancel</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* ── Enquiries ── */}
        {tab === "enquiries" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="text-lg font-black text-gray-900">Website Enquiries</h2>
                <p className="text-sm text-gray-400">{enquiries.length} total submission{enquiries.length !== 1 ? "s" : ""}</p>
              </div>
              <button onClick={loadEnquiries} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-all">
                <RefreshCw size={13} /> Refresh
              </button>
            </div>

            {enquiries.length === 0 ? (
              <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-sm">
                <Inbox size={32} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-400 font-medium">No enquiries yet</p>
                <p className="text-gray-300 text-sm mt-1">Enquiries submitted through the website will appear here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {enquiries.map((enq) => (
                  <div key={enq.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:border-gray-200 transition-all">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <span className="font-black text-gray-900 text-base">{enq.name}</span>
                          <span className={cn(
                            "text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border",
                            enq.service === "seo" ? "text-sky-600 bg-sky-50 border-sky-200" :
                            enq.service === "google-ads" ? "text-amber-600 bg-amber-50 border-amber-200" :
                            "text-violet-600 bg-violet-50 border-violet-200"
                          )}>
                            {enq.service === "both" ? "SEO + Google Ads" : enq.service === "seo" ? "SEO" : "Google Ads"}
                          </span>
                          <span className="text-xs text-gray-400 ml-auto">
                            {new Date(enq.createdAt).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3 flex-wrap">
                          <a href={`mailto:${enq.email}`} className="flex items-center gap-1.5 hover:text-primary transition-colors">
                            <Mail size={12} /> {enq.email}
                          </a>
                          {enq.phone && (
                            <a href={`tel:${enq.phone}`} className="flex items-center gap-1.5 hover:text-primary transition-colors">
                              <Phone size={12} /> {enq.phone}
                            </a>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 bg-gray-50 rounded-xl px-4 py-3 leading-relaxed">{enq.message}</p>
                      </div>
                      <div className="flex flex-col gap-2 shrink-0">
                        <a href={`mailto:${enq.email}`}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all">
                          <Send size={11} /> Reply
                        </a>
                        <button
                          onClick={async () => {
                            if (!confirm(`Delete enquiry from ${enq.name}?`)) return;
                            await authFetch(`/api/admin/enquiries/${enq.id}`, { method: "DELETE" });
                            loadEnquiries();
                          }}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-200 text-red-500 text-xs font-bold hover:bg-red-50 transition-all">
                          <Trash2 size={11} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ── Customers ── */}
        {tab === "customers" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative flex-1 min-w-48">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search clients…" className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary/60 bg-white" />
              </div>
              <button onClick={() => setShowAddCustomer(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all">
                <PlusCircle size={14} /> Add Client
              </button>
            </div>

            {filteredCustomers.length === 0 ? (
              <div className="bg-white border border-gray-100 rounded-2xl p-10 text-center text-gray-400 shadow-sm">
                <Users size={32} className="mx-auto mb-3 opacity-30" />
                <p>No clients yet. Add your first client above.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredCustomers.map(c => (
                  <div key={c.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary/20 to-violet-400/20 border border-primary/20 flex items-center justify-center text-base font-black text-primary shrink-0">
                        {c.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-bold text-gray-900">{c.name}</p>
                          {c.company && <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{c.company}</span>}
                          {c.unreadMessages > 0 && <span className="text-xs font-bold text-white bg-red-500 px-2 py-0.5 rounded-full">{c.unreadMessages} new</span>}
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">{c.email}{c.phone ? ` · ${c.phone}` : ""}</p>

                        {/* Google Ads Customer ID */}
                        <div className="mt-2">
                          {editingGadsId === c.id ? (
                            <form onSubmit={e => { e.preventDefault(); saveGadsId(c.id); }} className="flex items-center gap-2">
                              <input
                                autoFocus
                                value={gadsIdInput}
                                onChange={e => setGadsIdInput(e.target.value)}
                                placeholder="e.g. 123-456-7890"
                                className="text-xs border border-violet-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-violet-500 w-40"
                              />
                              <button type="submit" className="text-[10px] font-bold text-violet-600 bg-violet-50 border border-violet-200 px-2.5 py-1.5 rounded-lg hover:bg-violet-100 transition-colors">Save</button>
                              <button type="button" onClick={() => setEditingGadsId(null)} className="text-[10px] text-gray-400 hover:text-gray-600 transition-colors">Cancel</button>
                            </form>
                          ) : (
                            <button
                              onClick={() => { setEditingGadsId(c.id); setGadsIdInput(c.googleAdsCustomerId ?? ""); }}
                              className={cn("flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-colors",
                                c.googleAdsCustomerId
                                  ? "text-violet-600 bg-violet-50 border-violet-200 hover:bg-violet-100"
                                  : "text-gray-400 bg-gray-50 border-gray-200 hover:bg-gray-100"
                              )}
                            >
                              <MousePointerClick size={10} />
                              {c.googleAdsCustomerId ? `Ads ID: ${c.googleAdsCustomerId}` : "Link Google Ads ID"}
                            </button>
                          )}
                        </div>

                        {/* Subscriptions with edit/delete */}
                        {c.subscriptions.length > 0 && (
                          <div className="mt-3 space-y-1.5">
                            {c.subscriptions.map(sub => (
                              <div key={sub.id} className="flex items-center gap-2 flex-wrap">
                                <span className={cn("text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border", STATUS_COLORS[sub.status] ?? "")}>
                                  {sub.serviceName} · R{sub.priceRands}/mo
                                </span>
                                <button
                                  onClick={() => { setEditSub(sub); setEditSubForm({ serviceSlug: sub.serviceSlug, priceRands: sub.priceRands, status: sub.status, notes: sub.notes ?? "" }); }}
                                  className="text-[10px] font-bold text-gray-400 hover:text-gray-700 flex items-center gap-0.5 transition-colors"
                                  title="Edit subscription">
                                  <Pencil size={10} /> Edit
                                </button>
                                <button
                                  onClick={() => deleteSubscription(sub.id)}
                                  className="text-[10px] font-bold text-red-400 hover:text-red-600 flex items-center gap-0.5 transition-colors"
                                  title="Delete subscription">
                                  <Trash2 size={10} /> Remove
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 shrink-0 flex-wrap justify-end items-start">
                        <button onClick={() => { setShowAddSub(c); setNewSub({ serviceSlug: "basic-seo", notes: "" }); }} className="text-xs font-bold text-sky-600 bg-sky-50 border border-sky-200 px-3 py-1.5 rounded-lg hover:bg-sky-100 transition-colors">+ Service</button>
                        <button onClick={() => { setTab("chat"); setSelectedCustomer(c); }} className="text-xs font-bold text-violet-600 bg-violet-50 border border-violet-200 px-3 py-1.5 rounded-lg hover:bg-violet-100 transition-colors">Chat</button>
                        <button onClick={() => { setShowAddInvoice(true); setNewInvoice(f => ({ ...f, userId: String(c.id), subscriptionId: String(c.subscriptions[0]?.id ?? "") })); }} className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors">Invoice</button>
                        <button onClick={() => { setShowUpdateModal(c); setNewUpdate({ title: "", content: "", subscriptionId: String(c.subscriptions[0]?.id ?? "") }); }} className="text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg hover:bg-amber-100 transition-colors flex items-center gap-1"><Bell size={11} />Update</button>
                        <button onClick={() => setDeleteConfirm(c)} className="text-xs font-bold text-red-500 bg-red-50 border border-red-200 px-2 py-1.5 rounded-lg hover:bg-red-100 transition-colors" title="Delete client">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ── Invoices ── */}
        {tab === "invoices" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="flex justify-between items-center flex-wrap gap-3">
              <p className="text-sm text-gray-500">{invoices.length} invoices total · <span className="text-amber-600 font-semibold">{pendingInvoicesCount} pending</span></p>
              <button onClick={() => setShowAddInvoice(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all">
                <PlusCircle size={14} /> Create Invoice
              </button>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
              {invoices.length === 0 ? (
                <div className="p-10 text-center text-gray-400"><FileText size={32} className="mx-auto mb-3 opacity-30" /><p>No invoices yet.</p></div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {invoices.map(inv => (
                    <div key={inv.id} className="px-5 py-4 flex items-center gap-4 flex-wrap">
                      <div className={cn("w-2 h-12 rounded-full shrink-0", inv.status === "paid" ? "bg-emerald-400" : inv.status === "overdue" ? "bg-red-400" : inv.status === "sent" ? "bg-sky-400" : "bg-amber-400")} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-bold text-gray-900 text-sm">{inv.invoiceNumber}</p>
                          <span className={cn("text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border", STATUS_COLORS[inv.status] ?? "")}>{inv.status}</span>
                        </div>
                        <p className="text-xs text-gray-500">{inv.customerName} — {inv.description}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          Due: {new Date(inv.dueDate).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })}
                          {inv.sentAt && ` · Sent: ${new Date(inv.sentAt).toLocaleDateString("en-ZA", { day: "numeric", month: "short" })}`}
                          {inv.paidAt && ` · Paid: ${new Date(inv.paidAt).toLocaleDateString("en-ZA", { day: "numeric", month: "short" })}`}
                        </p>
                      </div>
                      <span className="font-black text-gray-900 text-base shrink-0">R{inv.amountRands}</span>
                      <div className="flex gap-2 shrink-0">
                        {inv.status !== "paid" && inv.status !== "sent" && (
                          <button onClick={() => sendInvoice(inv.id)} className="flex items-center gap-1.5 text-[11px] font-bold text-sky-600 bg-sky-50 border border-sky-200 px-2.5 py-1.5 rounded-lg hover:bg-sky-100 transition-colors">
                            <Send size={11} /> Send
                          </button>
                        )}
                        {inv.status !== "paid" && (
                          <button onClick={() => markPaid(inv.id)} className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors">
                            <CheckCircle2 size={11} /> Paid
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ── Chat ── */}
        {tab === "chat" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-3 gap-4" style={{ height: "580px" }}>
            {/* Customer list */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="font-bold text-gray-900 text-sm">Conversations</p>
              </div>
              <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
                {customers.length === 0 ? (
                  <p className="p-4 text-xs text-gray-400">No clients yet</p>
                ) : customers.map(c => (
                  <button key={c.id} onClick={() => { setSelectedCustomer(c); loadChat(c.id); }}
                    className={cn("w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors", selectedCustomer?.id === c.id ? "bg-primary/5 border-l-2 border-primary" : "")}>
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-black text-primary shrink-0">{c.name.charAt(0)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">{c.name}</p>
                      <p className="text-[11px] text-gray-400 truncate">{c.email}</p>
                    </div>
                    {c.unreadMessages > 0 && <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center shrink-0">{c.unreadMessages}</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat window */}
            <div className="md:col-span-2 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col">
              {!selectedCustomer ? (
                <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
                  <div className="text-center">
                    <MessageSquare size={32} className="mx-auto mb-2 opacity-30" />
                    <p>Select a client to start chatting</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-3 bg-slate-900">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-black text-primary">{selectedCustomer.name.charAt(0)}</div>
                    <div>
                      <p className="font-bold text-white text-sm">{selectedCustomer.name}</p>
                      <p className="text-[11px] text-slate-400">{selectedCustomer.email}</p>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50">
                    {chatMessages.length === 0 && (
                      <div className="text-center py-8 text-gray-400 text-sm"><MessageSquare size={24} className="mx-auto mb-2 opacity-30" /><p>No messages yet</p></div>
                    )}
                    {chatMessages.map(msg => (
                      <div key={msg.id} className={cn("flex", msg.sender === "admin" ? "justify-end" : "justify-start")}>
                        <div className={cn("max-w-[75%] rounded-2xl px-4 py-2.5 text-sm shadow-sm", msg.sender === "admin" ? "bg-slate-900 text-white rounded-br-sm" : "bg-white text-gray-800 border border-gray-100 rounded-bl-sm")}>
                          {msg.message && <p>{msg.message}</p>}
                          {msg.attachmentUrl && (
                            <AttachmentPreview
                              url={msg.attachmentUrl}
                              name={msg.attachmentName ?? "Attachment"}
                              mime={msg.attachmentMime}
                            />
                          )}
                          <p className={cn("text-[10px] mt-1", msg.sender === "admin" ? "text-white/50" : "text-gray-400")}>
                            {new Date(msg.createdAt).toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Attachment preview bar */}
                  {chatAttachment && (
                    <div className="px-4 py-2 bg-sky-50 border-t border-sky-100 flex items-center gap-2">
                      <Paperclip size={12} className="text-sky-500 shrink-0" />
                      <span className="text-xs text-sky-700 font-medium flex-1 truncate">{chatAttachment.name}</span>
                      <button onClick={() => setChatAttachment(null)} className="text-sky-400 hover:text-sky-600"><X size={14} /></button>
                    </div>
                  )}

                  <form onSubmit={sendMessage} className="px-4 py-3 border-t border-gray-100 flex gap-2 bg-white">
                    {/* Hidden file input */}
                    <input ref={chatFileRef} type="file" accept="image/*,.pdf,.doc,.docx,.xls,.xlsx" className="hidden"
                      onChange={async e => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        e.target.value = "";
                        const att = await uploadFile(file);
                        if (att) setChatAttachment(att);
                      }}
                    />
                    <button type="button" onClick={() => chatFileRef.current?.click()} disabled={uploadingFile}
                      className="w-10 h-10 rounded-xl border border-gray-200 text-gray-400 hover:text-gray-700 hover:border-gray-300 flex items-center justify-center transition-all disabled:opacity-40 shrink-0"
                      title="Attach file or image">
                      {uploadingFile ? <div className="w-4 h-4 border-2 border-gray-300 border-t-primary rounded-full animate-spin" /> : <Paperclip size={15} />}
                    </button>
                    <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Reply to client…" className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/15 bg-gray-50 focus:bg-white transition-all" />
                    <button type="submit" disabled={sendingMsg || (!chatInput.trim() && !chatAttachment)} className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center hover:bg-slate-800 transition-all disabled:opacity-40 shrink-0">
                      <Send size={15} />
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        )}

        {/* ── Meetings ── */}
        {tab === "meetings" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2"><Calendar size={15} className="text-primary" /><h2 className="font-bold text-gray-900">Meeting Requests</h2></div>
                <span className="text-xs text-amber-600 font-semibold bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">{pendingMeetings} pending</span>
              </div>
              {meetings.length === 0 ? (
                <div className="p-10 text-center text-gray-400"><Calendar size={32} className="mx-auto mb-3 opacity-30" /><p>No meeting requests yet.</p></div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {meetings.map(m => (
                    <div key={m.id} className="px-5 py-4 flex items-center gap-4 flex-wrap">
                      <div className="text-center bg-gray-50 border border-gray-100 rounded-xl p-3 min-w-[80px]">
                        <p className="text-xs font-bold text-gray-700">{m.preferredDate}</p>
                        <p className="text-xs text-gray-400">{m.preferredTime}</p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 text-sm">{m.customerName}</p>
                        <p className="text-xs text-gray-400">{m.customerEmail} · {m.meetingType.replace("-", " ")}</p>
                        {m.notes && <p className="text-xs text-gray-500 mt-1 italic">"{m.notes}"</p>}
                      </div>
                      <span className={cn("text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border", STATUS_COLORS[m.status] ?? "")}>{m.status}</span>
                      {m.status === "pending" && (
                        <div className="flex gap-2">
                          <button onClick={() => updateMeeting(m.id, "confirmed")} className="text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors">Confirm</button>
                          <button onClick={() => updateMeeting(m.id, "cancelled")} className="text-[11px] font-bold text-red-500 bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors">Cancel</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* ── Modal: Delete Customer Confirmation ── */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl p-6 shadow-2xl w-full max-w-sm text-center">
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} className="text-red-600" />
            </div>
            <h3 className="font-black text-gray-900 text-lg mb-1">Delete Client?</h3>
            <p className="text-gray-500 text-sm mb-1"><strong>{deleteConfirm.name}</strong></p>
            <p className="text-gray-400 text-xs mb-6">This will permanently delete the client account, all subscriptions, invoices, chat messages, and service updates. This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50">Cancel</button>
              <button onClick={() => deleteCustomer(deleteConfirm.id)} disabled={saving} className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 transition-all disabled:opacity-60">
                {saving ? "Deleting…" : "Yes, Delete"}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ── Modal: Edit Subscription ── */}
      {editSub && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl p-6 shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-black text-gray-900 text-lg">Edit Subscription</h3>
              <button onClick={() => setEditSub(null)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <form onSubmit={saveEditSub} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Package</label>
                <select value={editSubForm.serviceSlug}
                  onChange={e => {
                    const svc = SERVICES.find(s => s.slug === e.target.value)!;
                    setEditSubForm(f => ({ ...f, serviceSlug: e.target.value, priceRands: svc.price }));
                  }}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none bg-gray-50">
                  {SERVICES.map(s => <option key={s.slug} value={s.slug}>{s.name} — R{s.price}/mo</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Monthly Price (R)</label>
                <input type="number" min="1" value={editSubForm.priceRands}
                  onChange={e => setEditSubForm(f => ({ ...f, priceRands: e.target.value }))}
                  placeholder="Override price…"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none bg-gray-50" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Status</label>
                <select value={editSubForm.status} onChange={e => setEditSubForm(f => ({ ...f, status: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none bg-gray-50">
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Notes (optional)</label>
                <textarea value={editSubForm.notes} onChange={e => setEditSubForm(f => ({ ...f, notes: e.target.value }))} rows={2}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm resize-none focus:outline-none bg-gray-50" />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setEditSub(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-all">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all disabled:opacity-60">
                  {saving ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* ── Modal: Add Customer ── */}
      {showAddCustomer && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl p-6 shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-black text-gray-900 text-lg">Add New Client</h3>
              <button onClick={() => setShowAddCustomer(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <form onSubmit={createCustomer} className="space-y-3">
              {[
                { label: "Full Name", key: "name", type: "text", placeholder: "Client Name", required: true },
                { label: "Email", key: "email", type: "email", placeholder: "client@company.co.za", required: true },
                { label: "Company", key: "company", type: "text", placeholder: "Company Name" },
                { label: "Phone", key: "phone", type: "text", placeholder: "+27..." },
                { label: "Portal Password", key: "password", type: "password", placeholder: "Set login password", required: true },
              ].map(({ label, key, type, placeholder, required }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">{label}</label>
                  <input type={type} required={required} placeholder={placeholder}
                    value={(newCustomer as any)[key]} onChange={e => setNewCustomer(f => ({ ...f, [key]: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/15 bg-gray-50" />
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAddCustomer(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-all">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all disabled:opacity-60">
                  {saving ? "Creating…" : "Create Client"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* ── Modal: Add Subscription ── */}
      {showAddSub && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl p-6 shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-black text-gray-900 text-lg">Add Service for {showAddSub.name}</h3>
              <button onClick={() => setShowAddSub(null)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <form onSubmit={createSubscription} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Service</label>
                <select value={newSub.serviceSlug} onChange={e => setNewSub(f => ({ ...f, serviceSlug: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none bg-gray-50">
                  {SERVICES.map(s => <option key={s.slug} value={s.slug}>{s.name} — R{s.price}/mo</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Notes (optional)</label>
                <textarea value={newSub.notes} onChange={e => setNewSub(f => ({ ...f, notes: e.target.value }))} rows={2} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm resize-none focus:outline-none bg-gray-50" />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowAddSub(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-all">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-all disabled:opacity-60">
                  {saving ? "Adding…" : "Add Service"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* ── Modal: Post Service Update ── */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl p-6 shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-black text-gray-900 text-lg">Post Service Update</h3>
                <p className="text-xs text-gray-400 mt-0.5">To: {showUpdateModal.name}</p>
              </div>
              <button onClick={() => { setShowUpdateModal(null); setUpdateAttachment(null); }} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <form onSubmit={postUpdate} className="space-y-3">
              {showUpdateModal.subscriptions.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Service (optional)</label>
                  <select value={newUpdate.subscriptionId} onChange={e => setNewUpdate(f => ({ ...f, subscriptionId: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none bg-gray-50">
                    <option value="">General update (no specific service)</option>
                    {showUpdateModal.subscriptions.map(s => (
                      <option key={s.id} value={s.id}>{s.serviceName}</option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Title</label>
                <input type="text" required placeholder="e.g. March SEO Report Ready" value={newUpdate.title} onChange={e => setNewUpdate(f => ({ ...f, title: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none bg-gray-50" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Content</label>
                <textarea required rows={4} placeholder="Write your update here…" value={newUpdate.content} onChange={e => setNewUpdate(f => ({ ...f, content: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none bg-gray-50 resize-none" />
              </div>

              {/* File attachment for update */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Attachment (optional)</label>
                <input ref={updateFileRef} type="file" accept="image/*,.pdf,.doc,.docx,.xls,.xlsx" className="hidden"
                  onChange={async e => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    e.target.value = "";
                    const att = await uploadFile(file);
                    if (att) setUpdateAttachment(att);
                  }}
                />
                {updateAttachment ? (
                  <div className="flex items-center gap-2 p-2.5 bg-sky-50 border border-sky-200 rounded-xl">
                    <Paperclip size={13} className="text-sky-500 shrink-0" />
                    <span className="text-xs text-sky-700 font-medium flex-1 truncate">{updateAttachment.name}</span>
                    <button type="button" onClick={() => setUpdateAttachment(null)} className="text-sky-400 hover:text-sky-600"><X size={13} /></button>
                  </div>
                ) : (
                  <button type="button" onClick={() => updateFileRef.current?.click()} disabled={uploadingFile}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-gray-300 text-gray-400 hover:border-gray-400 hover:text-gray-600 text-xs font-semibold w-full transition-colors disabled:opacity-40">
                    {uploadingFile
                      ? <><div className="w-3 h-3 border-2 border-gray-300 border-t-primary rounded-full animate-spin" /> Uploading…</>
                      : <><ImagePlus size={14} /> Add image or PDF</>
                    }
                  </button>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowUpdateModal(null); setUpdateAttachment(null); }} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={saving || uploadingFile} className="flex-1 py-2.5 rounded-xl bg-amber-500 text-white font-bold text-sm hover:bg-amber-600 transition-all disabled:opacity-60">
                  {saving ? "Posting…" : "Post Update"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* ── Modal: Create Invoice ── */}
      {showAddInvoice && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl p-6 shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-black text-gray-900 text-lg">Create Invoice</h3>
              <button onClick={() => setShowAddInvoice(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <form onSubmit={createInvoice} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Client</label>
                <select value={newInvoice.userId} onChange={e => setNewInvoice(f => ({ ...f, userId: e.target.value }))} required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none bg-gray-50">
                  <option value="">Select client</option>
                  {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Description</label>
                <input type="text" required placeholder="e.g. Advanced SEO — March 2026" value={newInvoice.description} onChange={e => setNewInvoice(f => ({ ...f, description: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none bg-gray-50" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Amount (R)</label>
                  <input type="number" required min="1" placeholder="7900" value={newInvoice.amountRands} onChange={e => setNewInvoice(f => ({ ...f, amountRands: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none bg-gray-50" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Due Date</label>
                  <input type="date" required value={newInvoice.dueDate} onChange={e => setNewInvoice(f => ({ ...f, dueDate: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none bg-gray-50" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAddInvoice(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 transition-all disabled:opacity-60">
                  {saving ? "Creating…" : "Create Invoice"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
