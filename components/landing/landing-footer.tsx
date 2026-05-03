import Link from "next/link";
import { SUPPORT_EMAIL } from "@/lib/constants";
import { cn } from "@/lib/utils";

type LandingFooterProps = {
  variant?: "marketing" | "legal";
  children?: React.ReactNode;
};

export function LandingFooter({ variant = "legal", children }: LandingFooterProps) {
  const isMarketing = variant === "marketing";

  return (
    <footer className="border-t bg-muted/40 py-9 text-center text-sm text-muted-foreground">
      {isMarketing ? (
        <div className="space-y-2 px-4">
          <p className="text-base font-semibold text-foreground">CaseloadFlow</p>
          <p className="mx-auto max-w-md text-pretty">
            A calm, practical workspace for school SLPs who need a clearer weekly
            therapy plan.
          </p>
          <p className="mx-auto max-w-xl pt-1 text-xs leading-relaxed text-muted-foreground">
            CaseloadFlow is a scheduling support tool and does not replace district
            systems, clinical documentation, or compliance review.
          </p>
          {children ? (
            <div className="pt-4">{children}</div>
          ) : null}
        </div>
      ) : (
        <div className="space-y-1">
          <p className="font-medium text-foreground">CaseloadFlow</p>
          <p className="text-xs text-muted-foreground">
            School-based SLP scheduling support
          </p>
        </div>
      )}

      <nav
        className={cn(
          "flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-foreground/90",
          isMarketing ? "mt-6" : "mt-6"
        )}
        aria-label="Site policies and contact"
      >
        <Link
          href="/privacy"
          className="rounded-sm underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Privacy Policy
        </Link>
        <Link
          href="/terms"
          className="rounded-sm underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Terms of Service
        </Link>
        <a
          href={`mailto:${SUPPORT_EMAIL}`}
          className="rounded-sm underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Contact
        </a>
      </nav>

      {!isMarketing ? (
        <p className="mt-5">
          <Link
            href="/"
            className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            ← Back to home
          </Link>
        </p>
      ) : null}
    </footer>
  );
}
