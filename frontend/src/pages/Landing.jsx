import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useStore } from "@/lib/store";
import { LandingNav, Hero } from "@/components/landing/Hero";
import { SourceStrip, Pillars, HowItWorks } from "@/components/landing/Features";
import { Transparency, Trust, PricingPreview, Faq, FinalCta, Footer } from "@/components/landing/Sections";
import { LoginDialog } from "@/components/landing/LoginDialog";
import { LiveTour } from "@/components/landing/LiveTour";
import { OrgContact } from "@/components/landing/OrgContact";

export default function Landing() {
  const { state } = useStore();
  const [login, setLogin] = useState(false);
  const [wasEntered] = useState(state.entered);
  const navigate = useNavigate();
  if (wasEntered) return <Navigate to={state.workspace === "admin" ? "/yonetim" : "/"} replace />;
  const open = () => setLogin(true);
  const signup = () => navigate("/kayit");
  return (
    <div id="landing-scroll" className="h-full overflow-y-auto overflow-x-hidden scroll-smooth bg-background" data-testid="landing-page">
      <LandingNav onLogin={open} onSignup={signup} />
      <Hero onSignup={signup} />
      <SourceStrip />
      <Pillars />
      <LiveTour onLogin={open} />
      <HowItWorks />
      <Transparency />
      <Trust />
      <PricingPreview onSignup={signup} />
      <OrgContact />
      <Faq />
      <FinalCta onSignup={signup} />
      <Footer />
      <LoginDialog open={login} onOpenChange={setLogin} />
    </div>
  );
}
