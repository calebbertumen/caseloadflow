"use client";

import { FlaskConical } from "lucide-react";
import { useCaseload } from "@/components/providers/caseload-provider";
import { isOfficialDemoWorkspace } from "@/lib/workspace-utils";

export function SampleWorkspaceBanner() {
  const { state, hydrated } = useCaseload();
  if (!hydrated || !isOfficialDemoWorkspace(state)) return null;

  return (
    <div
      className="no-print mb-3 flex items-start gap-2 rounded-lg border border-primary/20 bg-primary/[0.06] px-3 py-2 text-xs text-muted-foreground sm:text-sm"
      role="status"
    >
      <FlaskConical
        className="mt-0.5 size-4 shrink-0 text-primary"
        aria-hidden
      />
      <p className="min-w-0 leading-snug">
        <span className="font-medium text-foreground">Sample workspace.</span>{" "}
        Names, times, and minutes are fictional so you can explore conflicts and
        printing without real student data.
      </p>
    </div>
  );
}
