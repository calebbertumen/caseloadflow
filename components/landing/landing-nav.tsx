import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { OpenWorkspaceNavLink } from "./open-workspace-nav-link";
import { TrackedStartFreeLink, TrackedViewDemoLink } from "./landing-tracking";

export function LandingNav() {
  return (
    <header className="sticky top-0 z-20 border-b border-border/80 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 md:px-6">
        <Link href="/" className="flex min-w-0 flex-col leading-tight">
          <span className="text-base font-semibold tracking-tight">
            CaseloadFlow
          </span>
          <span className="text-xs text-muted-foreground">
            School-based SLP scheduling
          </span>
        </Link>
        <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
          <TrackedViewDemoLink
            href="/demo"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
          >
            View demo
          </TrackedViewDemoLink>
          <TrackedStartFreeLink
            href="/onboarding"
            className={cn(buttonVariants({ size: "sm" }))}
          >
            Start free
          </TrackedStartFreeLink>
          <OpenWorkspaceNavLink />
        </div>
      </div>
    </header>
  );
}
