import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ProductPreview } from "./product-preview";

export function HeroSection() {
  return (
    <section className="border-b bg-gradient-to-b from-primary/5 via-background to-background">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-[1.05fr_0.95fr] md:items-center md:px-6 md:py-20">
        <div className="space-y-6">
          <p className="inline-flex rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
            Built for school SLP scheduling workflows
          </p>
          <div className="space-y-4">
            <h1 className="font-heading text-4xl font-semibold tracking-tight text-balance md:text-5xl">
              Build your school SLP schedule without spreadsheet chaos.
            </h1>
            <p className="max-w-xl text-lg text-muted-foreground text-pretty">
              Add students, IEP minutes, availability blocks, and grouping rules.
              CaseloadFlow helps you create a clear weekly therapy schedule and
              catch conflicts before they become problems.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/onboarding"
              className={cn(buttonVariants({ size: "lg" }))}
            >
              Start free
            </Link>
            <Link
              href="/demo"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              View demo
            </Link>
          </div>
          <ul className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:gap-x-6">
            <li>No complicated setup.</li>
            <li>Start with a simple weekly schedule.</li>
            <li>Free beta — no payment info.</li>
          </ul>
        </div>
        <ProductPreview />
      </div>
    </section>
  );
}
