import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  TrackedStartFreeLink,
  TrackedViewDemoLink,
} from "./landing-tracking";
import { ProductPreview } from "./product-preview";

export function HeroSection() {
  return (
    <section className="border-b bg-gradient-to-b from-primary/[0.07] via-background to-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 md:grid md:grid-cols-[1.05fr_0.95fr] md:items-center md:gap-10 md:px-6 md:py-16">
        <div className="flex min-w-0 flex-col gap-5 md:gap-6">
          <p className="inline-flex w-fit rounded-full border border-primary/15 bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
            For school-based SLPs
          </p>
          <div className="space-y-3 md:space-y-4">
            <h1 className="font-heading text-4xl font-semibold tracking-tight text-balance md:text-5xl">
              Build your school SLP schedule without spreadsheet chaos.
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-muted-foreground text-pretty md:text-lg">
              Add students, IEP service minutes, unavailable times, and group
              sessions. CaseloadFlow helps you build a clear weekly therapy
              schedule, track remaining minutes, and catch conflicts before the
              week starts.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex w-full max-w-md flex-col gap-3 sm:flex-row sm:max-w-none">
              <TrackedStartFreeLink
                href="/onboarding"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "w-full sm:w-auto sm:min-w-[9.5rem]"
                )}
              >
                Start free
              </TrackedStartFreeLink>
              <TrackedViewDemoLink
                href="/demo"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "w-full sm:w-auto sm:min-w-[9.5rem] border-primary/20 bg-background"
                )}
              >
                View demo
              </TrackedViewDemoLink>
            </div>
            <p className="text-xs text-muted-foreground">
              Free beta · No payment info required · Sample data included
            </p>
          </div>
        </div>
        <div className="min-w-0 md:min-h-0">
          <ProductPreview />
        </div>
      </div>
    </section>
  );
}
