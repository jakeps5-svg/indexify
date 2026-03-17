import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, Loader2, Send } from "lucide-react";
import { useSubmitInquiry } from "@workspace/api-client-react";
import type { InquiryInput } from "@workspace/api-client-react/src/generated/api.schemas";

function WhatsAppIcon({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 1C7.716 1 1 7.716 1 16c0 2.628.672 5.101 1.85 7.258L1 31l8.01-1.818A14.94 14.94 0 0016 31c8.284 0 15-6.716 15-15S24.284 1 16 1z" fill="currentColor"/>
      <path d="M16 3.5c-6.904 0-12.5 5.596-12.5 12.5 0 2.332.643 4.514 1.763 6.38L4 28l5.797-1.52A12.453 12.453 0 0016 28.5c6.904 0 12.5-5.596 12.5-12.5S22.904 3.5 16 3.5z" fill="#25D366"/>
      <path d="M21.9 19.3c-.3-.15-1.75-.864-2.02-.963-.27-.1-.467-.15-.664.15-.197.3-.764.963-.937 1.16-.173.197-.346.222-.645.075-.3-.148-1.265-.466-2.41-1.487-.89-.795-1.493-1.775-1.668-2.075-.174-.3-.018-.462.13-.61.134-.133.3-.347.448-.52.148-.174.197-.3.296-.497.1-.197.05-.37-.025-.52-.075-.148-.663-1.6-.908-2.19-.24-.574-.483-.496-.663-.505l-.565-.01c-.197 0-.52.074-.792.37-.272.297-1.04 1.016-1.04 2.477s1.065 2.874 1.213 3.072c.149.197 2.1 3.206 5.086 4.494.711.307 1.266.49 1.699.627.714.227 1.364.195 1.878.118.572-.085 1.762-.72 2.01-1.416.248-.696.248-1.292.173-1.416-.074-.124-.272-.197-.57-.347z" fill="white"/>
    </svg>
  );
}

export function WhatsAppModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState<InquiryInput>({
    name: "",
    email: "",
    phone: "",
    service: "seo",
    message: ""
  });

  const { mutate: submitInquiry, isPending } = useSubmitInquiry();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    submitInquiry({ data: formData }, {
      onSuccess: (response) => {
        setIsSuccess(true);
        setTimeout(() => {
          window.open(response.whatsappUrl, '_blank');
          setTimeout(() => {
            setIsOpen(false);
            setIsSuccess(false);
            setFormData({ name: "", email: "", phone: "", service: "seo", message: "" });
          }, 500);
        }, 1500);
      },
      onError: (error) => {
        console.error("Failed to submit inquiry:", error);
        alert("Something went wrong. Please try again.");
      }
    });
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full flex items-center justify-center shadow-2xl hover:-translate-y-1 transition-all duration-300 whatsapp-pulse"
        aria-label="Chat on WhatsApp"
      >
        <WhatsAppIcon size={32} />
      </button>

      {/* Modal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-card border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/10 relative" style={{ background: "linear-gradient(135deg, #075E54 0%, #128C7E 100%)" }}>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white">
                    <WhatsAppIcon size={20} />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg text-white">Chat with our Team</h3>
                    <p className="text-sm text-white/80">We typically reply within minutes.</p>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-6">
                {isSuccess ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="py-12 flex flex-col items-center text-center"
                  >
                    <div className="w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center mb-4">
                      <CheckCircle2 size={32} />
                    </div>
                    <h4 className="text-xl font-bold text-foreground mb-2">Connecting to WhatsApp...</h4>
                    <p className="text-muted-foreground">Opening chat securely.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Name *</label>
                      <input
                        required
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">Email *</label>
                        <input
                          required
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                          placeholder="john@company.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">Phone</label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                          placeholder="+27..."
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">I'm interested in *</label>
                      <select
                        required
                        value={formData.service}
                        onChange={(e) => setFormData({...formData, service: e.target.value as any})}
                        className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all appearance-none"
                      >
                        <option value="seo">Search Engine Optimization (SEO)</option>
                        <option value="google-ads">Google Ads Management</option>
                        <option value="both">Both Services</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Message *</label>
                      <textarea
                        required
                        rows={3}
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
                        placeholder="Tell us about your business goals..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isPending}
                      className="w-full mt-2 flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[#25D366] text-white font-bold hover:bg-[#20bd5a] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isPending ? (
                        <>
                          <Loader2 className="animate-spin" size={20} />
                          Connecting...
                        </>
                      ) : (
                        <>
                          <WhatsAppIcon size={20} />
                          Continue to WhatsApp
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
