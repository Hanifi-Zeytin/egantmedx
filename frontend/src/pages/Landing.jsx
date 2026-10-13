import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useStore } from "@/lib/store";
import { LandingNav, Hero } from "@/components/landing/Hero";
import { SourceStrip, Pillars, HowItWorks } from "@/components/landing/Features";
import { Transparency, Trust, PricingPreview, Faq, FinalCta, Footer } from "@/components/landing/Sections";
import { LoginDialog } from "@/components/landing/LoginDialog";

export default function Landing() {
  const { state } = useStore();
  const [login, setLogin] = useState(false);
  if (state.entered) return <Navigate to={state.workspace === "admin" ? "/yonetim" : "/"} replace />;
  const open = () => setLogin(true);
  return (
    <div id="landing-scroll" className="h-full overflow-y-auto overflow-x-hidden scroll-smooth bg-background" data-testid="landing-page">
      <LandingNav onLogin={open} />
      <Hero onLogin={open} />
      <SourceStrip />
      <Pillars />
      <HowItWorks />
      <Transparency />
      <Trust />
      <PricingPreview onLogin={open} />
      <Faq />
      <FinalCta onLogin={open} />
      <Footer />
      <LoginDialog open={login} onOpenChange={setLogin} />
    </div>
  );
}
