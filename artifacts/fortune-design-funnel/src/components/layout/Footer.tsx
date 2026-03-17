export function Footer() {
  const BASE = import.meta.env.BASE_URL;

  return (
    <footer className="bg-gray-900 pt-16 pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand column */}
          <div className="md:col-span-2">
            <img
              src={`${BASE}indexify-logo.png`}
              alt="Indexify"
              className="h-10 w-auto object-contain mb-4 brightness-0 invert"
            />
            <p className="text-gray-400 max-w-sm leading-relaxed mb-6">
              South Africa's leading SEO & Google Ads agency — delivering real rankings, real leads, and real revenue.
            </p>

            {/* Fortune Design attribution */}
            <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 hover:bg-white/10 transition-all">
              <img
                src={`${BASE}images/fortune-design-logo.png`}
                alt="Fortune Design"
                className="h-10 w-10 object-contain shrink-0"
              />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 leading-none mb-1">Powered by</p>
                <p className="text-sm font-bold text-white leading-none">Fortune Design</p>
                <a
                  href="https://fortunedesign.co.za"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-primary hover:text-primary/80 transition-colors"
                >
                  fortunedesign.co.za
                </a>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Services</h4>
            <ul className="space-y-3">
              <li><a href={`${BASE}services/seo`} className="text-gray-400 hover:text-primary transition-colors text-sm">Search Engine Optimization</a></li>
              <li><a href={`${BASE}services/google-ads`} className="text-gray-400 hover:text-primary transition-colors text-sm">Google Ads Management</a></li>
              <li><a href={`${BASE}audit`} className="text-gray-400 hover:text-primary transition-colors text-sm">Free SEO Audit</a></li>
              <li><a href={`${BASE}ads-audit`} className="text-gray-400 hover:text-primary transition-colors text-sm">Google Ads Proposal</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Company</h4>
            <ul className="space-y-3">
              <li><a href={`${BASE}pricing`} className="text-gray-400 hover:text-primary transition-colors text-sm">Pricing Packages</a></li>
              <li><a href={`${BASE}contact`} className="text-gray-400 hover:text-primary transition-colors text-sm">Contact Us</a></li>
              <li><a href={`${BASE}#results`} className="text-gray-400 hover:text-primary transition-colors text-sm">Our Results</a></li>
              <li><a href={`${BASE}#reviews`} className="text-gray-400 hover:text-primary transition-colors text-sm">Client Reviews</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-3 pb-6">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Indexify · A Fortune Design product. All rights reserved.
          </p>
          <div className="flex items-center gap-6 flex-wrap justify-center">
            <a href={`${BASE}privacy-policy`} className="text-sm text-gray-500 hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href={`${BASE}terms-of-use`} className="text-sm text-gray-500 hover:text-primary transition-colors">
              Terms of Use
            </a>
            <a href="https://fortunedesign.co.za" target="_blank" rel="noreferrer" className="text-sm text-gray-500 hover:text-primary transition-colors">
              fortunedesign.co.za
            </a>
          </div>
        </div>
      </div>

      {/* Fortune Design bottom strip */}
      <div className="bg-black/40 border-t border-white/5 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center gap-3">
          <img
            src={`${BASE}images/fortune-design-logo.png`}
            alt="Fortune Design"
            className="h-6 w-6 object-contain opacity-60"
          />
          <p className="text-xs text-gray-600">
            Indexify is a brand owned and operated by{" "}
            <a href="https://fortunedesign.co.za" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-primary transition-colors font-medium">
              Fortune Design (Pty) Ltd
            </a>
            {" "}· fortunedesign.co.za
          </p>
        </div>
      </div>
    </footer>
  );
}
