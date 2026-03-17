import { motion } from "framer-motion";

export function Footer() {
  return (
    <footer className="bg-gray-900 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <span className="text-2xl font-black tracking-tighter text-white mb-4 block">
              FORTUNE<span className="text-primary">DESIGN</span>
            </span>
            <p className="text-gray-400 max-w-sm leading-relaxed">
              South Africa's premier digital marketing agency specializing in high-ROI SEO and Google Ads campaigns that drive real revenue.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Services</h4>
            <ul className="space-y-3">
              <li><a href={`${import.meta.env.BASE_URL}services/seo`} className="text-gray-400 hover:text-primary transition-colors text-sm">Search Engine Optimization</a></li>
              <li><a href={`${import.meta.env.BASE_URL}services/google-ads`} className="text-gray-400 hover:text-primary transition-colors text-sm">Google Ads Management</a></li>
              <li><a href={`${import.meta.env.BASE_URL}services/seo`} className="text-gray-400 hover:text-primary transition-colors text-sm">Local SEO</a></li>
              <li><a href={`${import.meta.env.BASE_URL}services/google-ads`} className="text-gray-400 hover:text-primary transition-colors text-sm">E-commerce Marketing</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Company</h4>
            <ul className="space-y-3">
              <li><a href={`${import.meta.env.BASE_URL}#results`} className="text-gray-400 hover:text-primary transition-colors text-sm">Our Results</a></li>
              <li><a href={`${import.meta.env.BASE_URL}#reviews`} className="text-gray-400 hover:text-primary transition-colors text-sm">Client Reviews</a></li>
              <li><a href={`${import.meta.env.BASE_URL}#pricing`} className="text-gray-400 hover:text-primary transition-colors text-sm">Pricing Packages</a></li>
              <li><a href={`${import.meta.env.BASE_URL}audit`} className="text-gray-400 hover:text-primary transition-colors text-sm">Free SEO Audit</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Fortune Design. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="https://fortunedesign.co.za" target="_blank" rel="noreferrer" className="text-sm text-gray-500 hover:text-primary transition-colors">
              fortunedesign.co.za
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
