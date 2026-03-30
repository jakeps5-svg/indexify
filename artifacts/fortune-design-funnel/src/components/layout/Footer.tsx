function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

export function Footer() {
  const BASE = import.meta.env.BASE_URL;

  const socials = [
    {
      label: "Facebook",
      href: "https://www.facebook.com/FortunedesignSA",
      icon: <FacebookIcon />,
      hoverColor: "hover:bg-[#1877f2]",
    },
    {
      label: "Instagram",
      href: "https://www.instagram.com/fortunedesign_sa/",
      icon: <InstagramIcon />,
      hoverColor: "hover:bg-gradient-to-br hover:from-[#f09433] hover:via-[#e6683c] hover:via-[#dc2743] hover:via-[#cc2366] hover:to-[#bc1888]",
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/fortune-design-168270213/",
      icon: <LinkedInIcon />,
      hoverColor: "hover:bg-[#0077b5]",
    },
  ];

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
            <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 hover:bg-white/10 transition-all mb-6">
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

            {/* Social links */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Follow Fortune Design</p>
              <div className="flex items-center gap-3">
                {socials.map(s => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    className={`w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200 ${s.hoverColor} hover:border-transparent hover:scale-110`}
                  >
                    {s.icon}
                  </a>
                ))}
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
              <li><a href={`${BASE}blog`} className="text-gray-400 hover:text-primary transition-colors text-sm">Blog</a></li>
              <li><a href={`${BASE}contact`} className="text-gray-400 hover:text-primary transition-colors text-sm">Contact Us</a></li>
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
            <a href={`${window.location.origin}/sitemap_index.xml`} target="_blank" rel="noreferrer" className="text-sm text-gray-500 hover:text-primary transition-colors">
              Sitemap
            </a>
            <a href={`${window.location.origin}/rss.xml`} target="_blank" rel="noreferrer" className="text-sm text-gray-500 hover:text-primary transition-colors">
              RSS Feed
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
