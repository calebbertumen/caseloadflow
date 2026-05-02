import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LandingNav() {
  return (
    <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 md:px-6">
        <Link href="/" className="flex flex-col leading-tight">
          <span className="text-base font-semibold tracking-tight">
            CaseloadFlow
          </span>
          <span className="text-xs text-muted-foreground">
            School SLP scheduling
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/demo"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
          >
            View demo
          </Link>
          <Link href="/onboarding" className={cn(buttonVariants({ size: "sm" }))}>
            Start free
          </Link>
        </div>
      </div>
    </header>
  );
}
