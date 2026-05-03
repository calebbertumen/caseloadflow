"use client";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TrackedStartFreeLink, TrackedViewDemoLink } from "./landing-tracking";

export function FinalCtaSection() {
  return (
    <section className="border-t border-primary/10 bg-primary/[0.06]">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-12 text-center md:px-6 md:py-14">
        <div className="max-w-xl space-y-3">
          <h2 className="font-heading text-2xl font-semibold tracking-tight md:text-3xl">
            Try CaseloadFlow with a sample caseload.
          </h2>
          <p className="text-sm text-muted-foreground text-pretty md:text-base">
            Explore the workflow before entering your own students, or start from
            a blank schedule when you are ready.
          </p>
        </div>
        <div className="flex w-full max-w-md flex-col gap-3 sm:flex-row sm:justify-center">
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
          Free beta · No payment info required
        </p>
      </div>
    </section>
  );
}
