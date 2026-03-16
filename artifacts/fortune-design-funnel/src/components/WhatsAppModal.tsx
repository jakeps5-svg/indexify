import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, CheckCircle2, Loader2, Send } from "lucide-react";
import { useSubmitInquiry } from "@workspace/api-client-react";
import type { InquiryInput } from "@workspace/api-client-react/src/generated/api.schemas";

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
        // Open WhatsApp after a short delay so they see the success state
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
        <MessageCircle size={32} />
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
              <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 p-6 border-b border-white/5 relative">
                <button 
                  onClick={() => setIsOpen(false)}
                  className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X size={20} />
                </button>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#25D366]/20 flex items-center justify-center text-[#25D366]">
                    <MessageCircle size={20} />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg text-foreground">Chat with our Team</h3>
                    <p className="text-sm text-muted-foreground">We typically reply within minutes.</p>
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
                      className="w-full mt-2 flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isPending ? (
                        <>
                          <Loader2 className="animate-spin" size={20} />
                          Connecting...
                        </>
                      ) : (
                        <>
                          <Send size={20} />
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
