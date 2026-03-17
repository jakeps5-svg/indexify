import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import AuditPage from "@/pages/Audit";
import AdsAuditPage from "@/pages/AdsAudit";
import SEOPage from "@/pages/SEO";
import GoogleAdsPage from "@/pages/GoogleAds";
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
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
