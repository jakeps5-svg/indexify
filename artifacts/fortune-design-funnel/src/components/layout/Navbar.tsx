import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Search, MousePointerClick, BarChart3, TrendingUp, MapPin, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isScrolled, setIsScrolled]         = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen]   = useState(false);
  const [isToolsOpen, setIsToolsOpen]         = useState(false);
  const [isCitiesOpen, setIsCitiesOpen]       = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);
  const toolsRef    = useRef<HTMLDivElement>(null);
  const citiesRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) setIsServicesOpen(false);
      if (toolsRef.current   && !toolsRef.current.contains(e.target as Node))   setIsToolsOpen(false);
      if (citiesRef.current  && !citiesRef.current.contains(e.target as Node))  setIsCitiesOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const BASE = import.meta.env.BASE_URL;

  const services = [
    {
      name: "Search Engine Optimisation",
      desc: "Rank on page 1 organically",
      href: `${BASE}services/seo`,
      icon: Search,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      name: "Google Ads Management",
      desc: "Instant leads via paid search",
      href: `${BASE}services/google-ads`,
      icon: MousePointerClick,
      color: "text-accent",
      bg: "bg-accent/10",
    },
  ];

  const tools = [
    {
      name: "Free SEO Audit",
      desc: "25+ checks — instant report card",
      href: `${BASE}audit`,
      icon: BarChart3,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      name: "SERP Rank Checker",
      desc: "See where you rank on Google",
      href: `${BASE}serp-checker`,
      icon: TrendingUp,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
  ];

  const cities = [
    { name: "Cape Town",       href: `${BASE}cape-town`,      color: "text-teal-600",   bg: "bg-teal-50",   dot: "bg-teal-500" },
    { name: "Johannesburg",    href: `${BASE}johannesburg`,   color: "text-purple-600", bg: "bg-purple-50", dot: "bg-purple-500" },
    { name: "Durban",          href: `${BASE}durban`,         color: "text-emerald-600",bg: "bg-emerald-50",dot: "bg-emerald-500" },
    { name: "Pretoria",        href: `${BASE}pretoria`,       color: "text-indigo-600", bg: "bg-indigo-50", dot: "bg-indigo-500" },
    { name: "Port Elizabeth",  href: `${BASE}port-elizabeth`, color: "text-cyan-600",   bg: "bg-cyan-50",   dot: "bg-cyan-500" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm py-3"
          : "bg-white/80 backdrop-blur-sm border-b border-gray-100 py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Desktop: 3-column centred-logo layout */}
        <div className="hidden md:grid md:grid-cols-3 md:items-center">

          {/* LEFT — Services + Blog + Free Tools */}
          <div className="flex items-center gap-7">
            {/* Services dropdown */}
            <div ref={servicesRef} className="relative">
              <button
                onClick={() => setIsServicesOpen(!isServicesOpen)}
                aria-label="Toggle services menu"
                aria-expanded={isServicesOpen}
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
                    className="absolute top-full left-0 mt-3 w-72 rounded-2xl bg-white border border-gray-200 shadow-xl overflow-hidden"
                  >
                    <div className="p-2">
                      {services.map((service) => (
                        <a
                          key={service.name}
                          href={service.href}
                          onClick={() => setIsServicesOpen(false)}
                          className="flex items-start gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors group"
                        >
                          <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5", service.bg)}>
                            <service.icon size={16} className={service.color} />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 text-sm group-hover:text-primary transition-colors">{service.name}</div>
                            <div className="text-xs text-gray-400 mt-0.5">{service.desc}</div>
                          </div>
                        </a>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <a href={`${BASE}blog`} className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Blog
            </a>

            {/* Free Tools dropdown */}
            <div ref={toolsRef} className="relative">
              <button
                onClick={() => setIsToolsOpen(!isToolsOpen)}
                aria-label="Toggle free tools menu"
                aria-expanded={isToolsOpen}
                className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors whitespace-nowrap"
              >
                Free Tools
                <ChevronDown size={14} className={cn("transition-transform duration-200", isToolsOpen && "rotate-180")} />
              </button>

              <AnimatePresence>
                {isToolsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-3 w-72 rounded-2xl bg-white border border-gray-200 shadow-xl overflow-hidden"
                  >
                    <div className="p-2">
                      {tools.map((tool) => (
                        <a
                          key={tool.name}
                          href={tool.href}
                          onClick={() => setIsToolsOpen(false)}
                          className="flex items-start gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors group"
                        >
                          <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5", tool.bg)}>
                            <tool.icon size={16} className={tool.color} />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 text-sm group-hover:text-primary transition-colors">{tool.name}</div>
                            <div className="text-xs text-gray-400 mt-0.5">{tool.desc}</div>
                          </div>
                        </a>
                      ))}
                    </div>
                    <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50">
                      <p className="text-[11px] text-gray-400 text-center">100% free — no sign-up required</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* CENTRE — Logo */}
          <div className="flex justify-center">
            <a href={BASE} className="flex items-center cursor-pointer">
              <img
                src={`${BASE}indexify-logo.png`}
                alt="Indexify – Lead SEO & Google Ads Expert"
                className="h-14 w-auto object-contain"
              />
            </a>
          </div>

          {/* RIGHT — Locations + Pricing + Contact + CTA */}
          <div className="flex items-center justify-end gap-7">

            {/* Locations / Cities dropdown */}
            <div ref={citiesRef} className="relative">
              <button
                onClick={() => setIsCitiesOpen(!isCitiesOpen)}
                aria-label="Toggle locations menu"
                aria-expanded={isCitiesOpen}
                className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors whitespace-nowrap"
              >
                Locations
                <ChevronDown size={14} className={cn("transition-transform duration-200", isCitiesOpen && "rotate-180")} />
              </button>

              <AnimatePresence>
                {isCitiesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full right-0 mt-3 w-60 rounded-2xl bg-white border border-gray-200 shadow-xl overflow-hidden"
                  >
                    <div className="px-3 py-2 border-b border-gray-100">
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">We serve</p>
                    </div>
                    <div className="p-2">
                      {cities.map((city) => (
                        <a
                          key={city.name}
                          href={city.href}
                          onClick={() => setIsCitiesOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors group"
                        >
                          <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center shrink-0", city.bg)}>
                            <MapPin size={13} className={city.color} />
                          </div>
                          <span className="font-medium text-sm text-gray-700 group-hover:text-gray-900 transition-colors">{city.name}</span>
                        </a>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <a href={`${BASE}pricing`} className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Pricing
            </a>
            <a href={`${BASE}contact`} className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Contact
            </a>
            <a
              href={`${BASE}login`}
              className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 border border-gray-200 hover:border-gray-400 px-3 py-2 rounded-full transition-all whitespace-nowrap"
            >
              <LogIn size={13} /> Client Login
            </a>
            <a
              href={`${BASE}audit`}
              className="px-5 py-2.5 rounded-full bg-primary text-white font-semibold text-sm hover:bg-primary/90 hover:scale-105 transition-all duration-200 shadow-md shadow-primary/20 whitespace-nowrap"
            >
              Get Free Audit
            </a>
          </div>
        </div>

        {/* Mobile: logo left + hamburger right */}
        <div className="flex items-center justify-between md:hidden">
          <a href={BASE} className="flex items-center cursor-pointer">
            <img
              src={`${BASE}indexify-logo.png`}
              alt="Indexify"
              className="h-10 w-auto object-contain"
            />
          </a>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMobileMenuOpen}
            className="p-2 text-gray-700"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
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

              <div className="px-4 py-2">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Free Tools</div>
                {tools.map((tool) => (
                  <a
                    key={tool.name}
                    href={tool.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 py-2.5 text-base font-medium text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", tool.bg)}>
                      <tool.icon size={14} className={tool.color} />
                    </div>
                    {tool.name}
                  </a>
                ))}
              </div>

              <div className="h-px bg-gray-100 mx-4" />

              <div className="px-4 py-2">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Locations</div>
                {cities.map((city) => (
                  <a
                    key={city.name}
                    href={city.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 py-2.5 text-base font-medium text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", city.bg)}>
                      <MapPin size={14} className={city.color} />
                    </div>
                    {city.name}
                  </a>
                ))}
              </div>

              <div className="h-px bg-gray-100 mx-4" />

              {[
                { name: "Blog",    href: `${BASE}blog` },
                { name: "Pricing", href: `${BASE}pricing` },
                { name: "Contact", href: `${BASE}contact` },
                { name: "Client Login", href: `${BASE}login` },
              ].map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  {link.name}
                </a>
              ))}

              <div className="px-4 pt-2">
                <a
                  href={`${BASE}audit`}
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
