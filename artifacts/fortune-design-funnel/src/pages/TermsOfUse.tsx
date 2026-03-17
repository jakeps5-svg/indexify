import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

export default function TermsOfUse() {
  useSEO({
    title: "Terms of Use | Indexify – SEO & Google Ads Agency South Africa",
    description: "Indexify's terms of use — the conditions governing use of our website and digital marketing services provided by Fortune Design (Pty) Ltd.",
    keywords: ["Indexify terms of use", "terms and conditions South Africa", "digital marketing agency terms"],
    canonical: "https://indexify.co.za/terms-of-use",
  });

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 pt-28 pb-20 w-full">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileText size={18} className="text-primary" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Legal</span>
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-2">Terms of Use</h1>
          <p className="text-sm text-gray-400 mb-10">Last updated: March 2026 · Indexify, a brand of Fortune Design (Pty) Ltd</p>

          <div className="prose prose-gray max-w-none space-y-10">

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">1. Acceptance of Terms</h2>
              <p className="text-gray-600 leading-relaxed">
                By accessing or using the Indexify website (<a href="https://indexify.co.za" className="text-primary">indexify.co.za</a>) and any of its associated services, tools, or products, you agree to be bound by these Terms of Use. If you do not agree, please discontinue use immediately.
              </p>
              <p className="text-gray-600 leading-relaxed mt-2">
                These terms constitute a legally binding agreement between you and <strong>Fortune Design (Pty) Ltd</strong>, the owner and operator of the Indexify brand.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">2. Services Provided</h2>
              <p className="text-gray-600 leading-relaxed mb-3">Indexify provides the following services:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Search Engine Optimisation (SEO) — monthly retainer packages</li>
                <li>Google Ads campaign management — monthly retainer</li>
                <li>Free SEO audit tool — website analysis and grading</li>
                <li>Free Google Ads proposal generator — AI-assisted proposal reports</li>
                <li>Digital marketing consultations and strategy</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">3. Payments & Billing</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>All prices are quoted in <strong>South African Rand (ZAR)</strong> and are exclusive of VAT unless stated otherwise.</li>
                <li>Payments are processed securely by <strong>Yoco</strong>. By making a payment, you agree to Yoco's terms and conditions.</li>
                <li>Monthly retainer services are billed in advance. Payments are non-refundable once the service period has commenced.</li>
                <li>For Google Ads management, your ad spend is paid directly to Google — Indexify's fee covers management only.</li>
                <li>Proposal unlock fees are one-time, non-refundable payments to generate your personalised proposal.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">4. Cancellation Policy</h2>
              <p className="text-gray-600 leading-relaxed">
                Monthly retainer services require a minimum of <strong>30 days' written notice</strong> to cancel. Notice must be submitted via email to <a href="mailto:support@indexify.co.za" className="text-primary">support@indexify.co.za</a>. Services will continue until the end of the notice period. No partial-month refunds are issued.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">5. Results Disclaimer</h2>
              <p className="text-gray-600 leading-relaxed">
                While we are committed to delivering measurable results, Indexify does not guarantee specific rankings, traffic numbers, or revenue outcomes. SEO and Google Ads performance depends on many factors outside our control, including Google algorithm updates, competitor activity, and market conditions.
              </p>
              <p className="text-gray-600 leading-relaxed mt-2">
                Case studies and results showcased on our website represent past client outcomes and are not guarantees of future performance.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">6. Client Responsibilities</h2>
              <p className="text-gray-600 leading-relaxed mb-3">To enable us to deliver services effectively, you agree to:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Provide accurate business information and website access credentials when required</li>
                <li>Grant necessary permissions for Google Search Console, Google Analytics, and Google Ads accounts</li>
                <li>Respond to reasonable requests for information within 5 business days</li>
                <li>Not engage other SEO or Google Ads providers simultaneously without prior written agreement</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">7. Intellectual Property</h2>
              <p className="text-gray-600 leading-relaxed">
                All content, designs, reports, strategies, and materials produced by Indexify remain the intellectual property of <strong>Fortune Design (Pty) Ltd</strong> until full payment has been received. Upon full payment, you receive a non-exclusive licence to use the deliverables for your business purposes.
              </p>
              <p className="text-gray-600 leading-relaxed mt-2">
                The Indexify name, logo, and brand assets may not be reproduced or used without written permission.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">8. Free Tools</h2>
              <p className="text-gray-600 leading-relaxed">
                Our free SEO audit and Google Ads proposal tools are provided on an "as-is" basis for informational purposes only. Results are automated estimates and should not be treated as professional advice. Indexify reserves the right to modify, suspend, or discontinue free tools at any time without notice.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">9. Limitation of Liability</h2>
              <p className="text-gray-600 leading-relaxed">
                To the maximum extent permitted by South African law, Fortune Design (Pty) Ltd shall not be liable for any indirect, incidental, special, or consequential damages arising from use of our services or website. Our total liability in any matter is limited to the fees paid by you in the 3 months preceding the claim.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">10. Governing Law</h2>
              <p className="text-gray-600 leading-relaxed">
                These Terms of Use are governed by and construed in accordance with the laws of the <strong>Republic of South Africa</strong>. Any disputes shall be subject to the exclusive jurisdiction of the South African courts.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">11. Changes to Terms</h2>
              <p className="text-gray-600 leading-relaxed">
                We reserve the right to update these Terms of Use at any time. Updated terms will be posted on this page with a revised date. Continued use of our services after changes constitutes your acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">12. Contact</h2>
              <p className="text-gray-600 leading-relaxed">
                For any questions regarding these Terms of Use:<br />
                <a href="mailto:support@indexify.co.za" className="text-primary">support@indexify.co.za</a><br />
                Fortune Design (Pty) Ltd · South Africa
              </p>
            </section>

          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
