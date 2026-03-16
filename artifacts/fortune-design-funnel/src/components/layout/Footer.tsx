import { motion } from "framer-motion";

export function Footer() {
  return (
    <footer className="bg-background border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <span className="text-2xl font-black tracking-tighter text-foreground mb-4 block">
              FORTUNE<span className="text-primary">DESIGN</span>
            </span>
            <p className="text-muted-foreground max-w-sm">
              South Africa's premier digital marketing agency specializing in high-ROI SEO and Google Ads campaigns that drive real revenue.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-foreground mb-4">Services</h4>
            <ul className="space-y-2">
              <li><a href="#services" className="text-muted-foreground hover:text-primary transition-colors">Search Engine Optimization</a></li>
              <li><a href="#services" className="text-muted-foreground hover:text-primary transition-colors">Google Ads Management</a></li>
              <li><a href="#services" className="text-muted-foreground hover:text-primary transition-colors">Local SEO</a></li>
              <li><a href="#services" className="text-muted-foreground hover:text-primary transition-colors">E-commerce Marketing</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-foreground mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="#results" className="text-muted-foreground hover:text-primary transition-colors">Our Results</a></li>
              <li><a href="#reviews" className="text-muted-foreground hover:text-primary transition-colors">Client Reviews</a></li>
              <li><a href="#pricing" className="text-muted-foreground hover:text-primary transition-colors">Pricing Packages</a></li>
              <li><a href="#contact" className="text-muted-foreground hover:text-primary transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Fortune Design. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="https://fortunedesign.co.za" target="_blank" rel="noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              fortunedesign.co.za
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
