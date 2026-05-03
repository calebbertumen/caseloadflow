"use client";

import Link from "next/link";
import { LayoutDashboard } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { useCaseload } from "@/components/providers/caseload-provider";
import { trackEvent } from "@/lib/analytics";
import { workspaceHasContent } from "@/lib/workspace-utils";
import { cn } from "@/lib/utils";

export function OpenWorkspaceNavLink() {
  const { state, hydrated } = useCaseload();
  if (!hydrated) return null;
  const show =
    state.onboardingCompleted || workspaceHasContent(state);
  if (!show) return null;

  return (
    <Link
      href="/dashboard"
      className={cn(
        buttonVariants({ variant: "outline", size: "sm" }),
        "inline-flex items-center gap-1.5 border-primary/20"
      )}
      data-event="cta_open_workspace_clicked"
      data-source="landing"
      onClick={() =>
        trackEvent("cta_open_workspace_clicked", { source: "landing" })
      }
    >
      <LayoutDashboard className="size-3.5 opacity-80" aria-hidden />
      Open my workspace
    </Link>
  );
}
