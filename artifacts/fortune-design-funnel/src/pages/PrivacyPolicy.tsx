import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

export default function PrivacyPolicy() {
  useSEO({
    title: "Privacy Policy | Indexify SA",
    description: "Indexify's privacy policy — how we collect, use and protect your personal information in accordance with the Protection of Personal Information Act (POPIA).",
    keywords: ["Indexify privacy policy", "POPIA compliance", "data protection South Africa"],
    canonical: "https://indexify.co.za/privacy-policy/",
  });

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 pt-28 pb-20 w-full">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Shield size={18} className="text-primary" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Legal</span>
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-sm text-gray-400 mb-10">Last updated: March 2026 · Indexify, a brand of Fortune Design (Pty) Ltd</p>

          <div className="prose prose-gray max-w-none space-y-10">

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">1. Who We Are</h2>
              <p className="text-gray-600 leading-relaxed">
                Indexify is a digital marketing brand owned and operated by <strong>Fortune Design (Pty) Ltd</strong>, registered in South Africa. We provide SEO and Google Ads management services to businesses across South Africa and internationally.
              </p>
              <p className="text-gray-600 leading-relaxed mt-2">
                <strong>Contact:</strong> support@indexify.co.za · <a href="https://indexify.co.za" className="text-primary">indexify.co.za</a>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">2. Information We Collect</h2>
              <p className="text-gray-600 leading-relaxed mb-3">We collect the following types of personal information:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li><strong>Contact details</strong> — name, email address, phone number, company name</li>
                <li><strong>Website data</strong> — domain names you submit for SEO audits or Google Ads proposals</li>
                <li><strong>Payment data</strong> — billing information processed securely by Yoco (we do not store card details)</li>
                <li><strong>Usage data</strong> — pages visited, time on site, browser type (collected via analytics tools)</li>
                <li><strong>Communications</strong> — messages submitted through our contact form or WhatsApp</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">3. How We Use Your Information</h2>
              <p className="text-gray-600 leading-relaxed mb-3">We use your information to:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Deliver the services you have purchased or enquired about</li>
                <li>Send transactional emails (payment confirmations, proposal tokens, onboarding)</li>
                <li>Respond to contact form submissions and support requests</li>
                <li>Improve our website, tools, and service offerings</li>
                <li>Comply with legal and regulatory obligations</li>
              </ul>
              <p className="text-gray-600 leading-relaxed mt-3">
                We do <strong>not</strong> sell, rent, or trade your personal information to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">4. Legal Basis for Processing</h2>
              <p className="text-gray-600 leading-relaxed">
                We process your personal information in accordance with the <strong>Protection of Personal Information Act (POPIA)</strong> of South Africa. Our legal bases include:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mt-3">
                <li><strong>Contract performance</strong> — to deliver services you have paid for</li>
                <li><strong>Legitimate interest</strong> — to improve our services and respond to enquiries</li>
                <li><strong>Consent</strong> — where you have explicitly provided information voluntarily</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">5. Third-Party Services</h2>
              <p className="text-gray-600 leading-relaxed mb-3">We work with the following trusted third parties who may process your data:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li><strong>Yoco</strong> — secure payment processing (subject to Yoco's privacy policy)</li>
                <li><strong>Brevo (Sendinblue)</strong> — transactional email delivery</li>
                <li><strong>Google Analytics</strong> — website usage analytics</li>
                <li><strong>Google Ads API</strong> — generating proposal data for submitted domains</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">6. Data Retention</h2>
              <p className="text-gray-600 leading-relaxed">
                We retain your personal data for as long as necessary to deliver services and meet legal obligations — typically no longer than <strong>5 years</strong> after your last interaction with us. Payment records are retained as required by South African tax law.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">7. Your Rights (POPIA)</h2>
              <p className="text-gray-600 leading-relaxed mb-3">Under POPIA, you have the right to:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Access the personal information we hold about you</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your data (subject to legal retention requirements)</li>
                <li>Object to processing of your personal information</li>
                <li>Lodge a complaint with the <strong>Information Regulator of South Africa</strong></li>
              </ul>
              <p className="text-gray-600 leading-relaxed mt-3">
                To exercise any of these rights, email us at <a href="mailto:support@indexify.co.za" className="text-primary">support@indexify.co.za</a>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">8. Cookies</h2>
              <p className="text-gray-600 leading-relaxed">
                Our website uses cookies for analytics and functionality purposes. By continuing to use our site, you consent to the use of cookies. You can disable cookies in your browser settings at any time, though this may affect site functionality.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">9. Security</h2>
              <p className="text-gray-600 leading-relaxed">
                We implement industry-standard security measures to protect your personal information, including encrypted connections (HTTPS), secure payment processing via Yoco, and restricted access to data. No method of transmission over the internet is 100% secure; however, we take all reasonable precautions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">10. Changes to This Policy</h2>
              <p className="text-gray-600 leading-relaxed">
                We may update this Privacy Policy from time to time. The updated version will always be available on this page with the revised date. Continued use of our services after changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">11. Contact Us</h2>
              <p className="text-gray-600 leading-relaxed">
                For any privacy-related questions or requests, please contact us at:<br />
                <a href="mailto:support@indexify.co.za" className="text-primary">support@indexify.co.za</a><br />
                Or visit <a href="/contact" className="text-primary">indexify.co.za/contact</a>
              </p>
            </section>

          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
