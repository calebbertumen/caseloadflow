import { LandingPageViewTracker } from "@/components/landing/landing-tracking";
import { BeforeAfter } from "@/components/landing/before-after";
import { FeatureCards } from "@/components/landing/feature-cards";
import { FinalCtaSection } from "@/components/landing/final-cta-section";
import { HeroSection } from "@/components/landing/hero-section";
import { HowItWorks } from "@/components/landing/how-it-works";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNav } from "@/components/landing/landing-nav";
import { ProblemSection } from "@/components/landing/problem-section";
import { SimpleByDesignSection } from "@/components/landing/simple-by-design";

export default function HomePage() {
  return (
    <div className="flex min-h-full flex-col">
      <LandingPageViewTracker />
      <LandingNav />
      <HeroSection />
      <BeforeAfter />
      <ProblemSection />
      <HowItWorks />
      <FeatureCards />
      <SimpleByDesignSection />
      <FinalCtaSection />
      <LandingFooter variant="marketing" />
    </div>
  );
}
