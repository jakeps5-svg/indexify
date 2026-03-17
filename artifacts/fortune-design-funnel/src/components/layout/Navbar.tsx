import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Search, MousePointerClick } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) {
        setIsServicesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const scrollTo = (id: string) => {
    const base = import.meta.env.BASE_URL.replace(/\/$/, "");
    const isHome = window.location.pathname === base + "/" || window.location.pathname === base;
    if (!isHome) {
      window.location.href = `${import.meta.env.BASE_URL}#${id}`;
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { name: "Results", id: "results", href: null },
    { name: "Reviews", id: "reviews", href: null },
    { name: "Pricing", id: null, href: `${import.meta.env.BASE_URL}pricing` },
    { name: "Contact", id: null, href: `${import.meta.env.BASE_URL}contact` },
  ];

  const services = [
    {
      name: "Search Engine Optimisation",
      desc: "Rank on page 1 organically",
      href: `${import.meta.env.BASE_URL}services/seo`,
      icon: Search,
      color: "text-primary",
      bg: "bg-primary/10",
      divider: false,
    },
    {
      name: "Google Ads Management",
      desc: "Instant leads via paid search",
      href: `${import.meta.env.BASE_URL}services/google-ads`,
      icon: MousePointerClick,
      color: "text-accent",
      bg: "bg-accent/10",
      divider: false,
    },
    {
      name: "Free Google Ads Proposal",
      desc: "Get a tailored campaign strategy",
      href: `${import.meta.env.BASE_URL}ads-audit`,
      icon: MousePointerClick,
      color: "text-accent",
      bg: "bg-accent/10",
      divider: true,
    },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm py-4"
          : "bg-white/80 backdrop-blur-sm border-b border-gray-100 py-6"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <a href={import.meta.env.BASE_URL} className="flex items-center cursor-pointer">
            <img
              src={`${import.meta.env.BASE_URL}indexify-logo.png`}
              alt="Indexify – Lead SEO & Google Ads Expert"
              className="h-10 w-auto object-contain"
            />
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Services Dropdown */}
            <div ref={servicesRef} className="relative">
              <button
                onClick={() => setIsServicesOpen(!isServicesOpen)}
                className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Services
                <ChevronDown size={14} className={cn("transition-transform duration-200", isServicesOpen && "rotate-180")} />
              </button>

              <AnimatePresence>
                {isServicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-72 rounded-2xl bg-white border border-gray-200 shadow-xl overflow-hidden"
                  >
                    <div className="p-2">
                      {services.map((service) => (
                        <div key={service.name}>
                          {service.divider && <div className="h-px bg-gray-100 my-1.5 mx-2" />}
                          <a
                            href={service.href}
                            onClick={() => setIsServicesOpen(false)}
                            className="flex items-start gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors group"
                          >
                            <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5", service.bg)}>
                              <service.icon size={16} className={service.color} />
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900 text-sm group-hover:text-primary transition-colors">
                                {service.name}
                              </div>
                              <div className="text-xs text-gray-400 mt-0.5">{service.desc}</div>
                            </div>
                          </a>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {navLinks.map((link) => (
              link.href
                ? <a key={link.name} href={link.href} className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">{link.name}</a>
                : <button key={link.name} onClick={() => scrollTo(link.id!)} className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">{link.name}</button>
            ))}
            <a
              href={`${import.meta.env.BASE_URL}audit`}
              className="px-5 py-2.5 rounded-full bg-primary text-white font-semibold text-sm hover:bg-primary/90 hover:scale-105 transition-all duration-200 shadow-md shadow-primary/20"
            >
              Get Free Audit
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-700">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-200 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1 flex flex-col">
              <div className="px-4 py-2">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Services</div>
                {services.map((service) => (
                  <a
                    key={service.name}
                    href={service.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 py-2.5 text-base font-medium text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", service.bg)}>
                      <service.icon size={14} className={service.color} />
                    </div>
                    {service.name}
                  </a>
                ))}
              </div>

              <div className="h-px bg-gray-100 mx-4" />

              {navLinks.map((link) => (
                link.href
                  ? <a key={link.name} href={link.href} className="block px-4 py-3 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">{link.name}</a>
                  : <button key={link.name} onClick={() => scrollTo(link.id!)} className="block w-full text-left px-4 py-3 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">{link.name}</button>
              ))}
              <div className="px-4 pt-2">
                <a
                  href={`${import.meta.env.BASE_URL}audit`}
                  className="block w-full px-5 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors text-center shadow-md shadow-primary/20"
                >
                  Get Free Audit
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
