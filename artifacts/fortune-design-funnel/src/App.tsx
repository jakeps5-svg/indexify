import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { WhatsAppModal } from "@/components/WhatsAppModal";
import { BookingModal } from "@/components/BookingModal";
import Home from "@/pages/Home";
import AuditPage from "@/pages/Audit";
import AdsAuditPage from "@/pages/AdsAudit";
import SEOPage from "@/pages/SEO";
import GoogleAdsPage from "@/pages/GoogleAds";
import PaymentSuccess from "@/pages/PaymentSuccess";
import PaymentCancelled from "@/pages/PaymentCancelled";
import CheckoutPage from "@/pages/Checkout";
import PricingPage from "@/pages/Pricing";
import ContactPage from "@/pages/Contact";
import PrivacyPolicyPage from "@/pages/PrivacyPolicy";
import TermsOfUsePage from "@/pages/TermsOfUse";
import BlogPage from "@/pages/Blog";
import BlogPostPage from "@/pages/BlogPost";
import SerpCheckerPage from "@/pages/SerpChecker";
import CapeTownPage from "@/pages/CapeTown";
import JohannesburgPage from "@/pages/Johannesburg";
import DurbanPage from "@/pages/Durban";
import PretoriaPage from "@/pages/Pretoria";
import PortElizabethPage from "@/pages/PortElizabeth";
import LoginPage from "@/pages/Login";
import ForgotPasswordPage from "@/pages/ForgotPassword";
import ResetPasswordPage from "@/pages/ResetPassword";
import CustomerPortal from "@/pages/CustomerPortal";
import AdminDashboard from "@/pages/AdminDashboard";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/audit" component={AuditPage} />
      <Route path="/ads-audit" component={AdsAuditPage} />
      <Route path="/services/seo" component={SEOPage} />
      <Route path="/services/google-ads" component={GoogleAdsPage} />
      <Route path="/payment-success" component={PaymentSuccess} />
      <Route path="/payment-cancelled" component={PaymentCancelled} />
      <Route path="/checkout" component={CheckoutPage} />
      <Route path="/pricing" component={PricingPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/privacy-policy" component={PrivacyPolicyPage} />
      <Route path="/terms-of-use" component={TermsOfUsePage} />
      <Route path="/blog" component={BlogPage} />
      <Route path="/blog/:slug" component={BlogPostPage} />
      <Route path="/serp-checker" component={SerpCheckerPage} />
      <Route path="/cape-town" component={CapeTownPage} />
      <Route path="/johannesburg" component={JohannesburgPage} />
      <Route path="/durban" component={DurbanPage} />
      <Route path="/pretoria" component={PretoriaPage} />
      <Route path="/port-elizabeth" component={PortElizabethPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/forgot-password" component={ForgotPasswordPage} />
      <Route path="/reset-password" component={ResetPasswordPage} />
      <Route path="/portal" component={CustomerPortal} />
      <Route path="/admin" component={AdminDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
          <WhatsAppModal />
          <BookingModal />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
