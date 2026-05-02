import Link from "next/link";
import { BeforeAfter } from "@/components/landing/before-after";
import { ConversionSection } from "@/components/landing/conversion-section";
import { FeatureCards } from "@/components/landing/feature-cards";
import { HeroSection } from "@/components/landing/hero-section";
import { LandingNav } from "@/components/landing/landing-nav";
import { PricingSection } from "@/components/landing/pricing-section";
import { ProblemSection } from "@/components/landing/problem-section";
import { SolutionSection } from "@/components/landing/solution-section";

export default function HomePage() {
  return (
    <div className="flex min-h-full flex-col">
      <LandingNav />
      <HeroSection />
      <BeforeAfter />
      <ProblemSection />
      <SolutionSection />
      <FeatureCards />
      <ConversionSection />
      <PricingSection />
      <footer className="border-t bg-muted/30 py-10 text-center text-sm text-muted-foreground">
        <p className="font-medium text-foreground">CaseloadFlow</p>
        <p className="mt-1 max-w-md mx-auto px-4">
          A calm, practical weekly scheduler for school speech-language
          pathologists. Questions? You are early — we are listening.
        </p>
        <p className="mt-4">
          <Link href="/onboarding" className="text-primary underline-offset-4 hover:underline">
            Start free
          </Link>
          {" · "}
          <Link href="/demo" className="text-primary underline-offset-4 hover:underline">
            View demo
          </Link>
        </p>
      </footer>
    </div>
  );
}
