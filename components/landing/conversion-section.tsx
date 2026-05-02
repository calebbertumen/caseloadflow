import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ConversionSection() {
  return (
    <section className="border-y bg-primary/5">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 py-14 md:flex-row md:items-center md:px-6 md:py-16">
        <div className="max-w-xl space-y-2">
          <h2 className="font-heading text-2xl font-semibold tracking-tight md:text-3xl">
            Try the free beta and build your first schedule in minutes.
          </h2>
          <p className="text-muted-foreground">
            Start from a sample caseload or a blank slate. No payment information
            required.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/onboarding" className={cn(buttonVariants({ size: "lg" }))}>
            Start free
          </Link>
          <Link
            href="/demo"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
          >
            View demo
          </Link>
        </div>
      </div>
    </section>
  );
}
