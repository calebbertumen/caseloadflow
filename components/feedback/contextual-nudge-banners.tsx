"use client";

import { Button } from "@/components/ui/button";
import { buildResetReasonMailto } from "@/lib/feedback";
import { useFeedbackLauncher } from "./feedback-context";
import { useWorkspaceNudges } from "./workspace-nudge-context";

/** Subtle, dismissible prompts after print, export backup, or workspace reset. */
export function ContextualNudgeBanners() {
  const { active, dismiss } = useWorkspaceNudges();
  const { openFeedback } = useFeedbackLauncher();

  if (!active) return null;

  if (active === "schedule_useful") {
    return (
      <div
        className="no-print mb-4 flex flex-col gap-3 rounded-lg border border-primary/15 bg-primary/5 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between"
        role="status"
      >
        <p className="text-foreground/90">Was this schedule useful?</p>
        <div className="flex flex-wrap gap-2">
          <Button type="button" size="sm" onClick={dismiss}>
            Yes
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={dismiss}>
            Not yet
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => {
              dismiss();
              openFeedback();
            }}
          >
            Give feedback
          </Button>
        </div>
      </div>
    );
  }

  if (active === "export_followup") {
    return (
      <div
        className="no-print mb-4 flex flex-col gap-2 rounded-lg border bg-muted/40 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between"
        role="status"
      >
        <p className="text-muted-foreground">
          Want cloud save later? Tell us what would make CaseloadFlow worth using
          weekly.
        </p>
        <div className="flex shrink-0 gap-2">
          <Button type="button" size="sm" onClick={openFeedback}>
            Give feedback
          </Button>
          <Button type="button" size="sm" variant="ghost" onClick={dismiss}>
            Dismiss
          </Button>
        </div>
      </div>
    );
  }

  const resetOptions = [
    "Just exploring",
    "Too confusing",
    "Missing a feature",
    "Need cloud save",
    "Need auto-scheduling",
    "Prefer spreadsheet",
    "Other",
  ] as const;

  return (
    <div
      className="no-print mb-4 space-y-3 rounded-lg border bg-card px-4 py-3 text-sm shadow-sm"
      role="status"
    >
      <p className="font-medium text-foreground">What made you reset?</p>
      <p className="text-xs text-muted-foreground">
        Optional. Opens your email app with a short subject line. Nothing is sent
        until you choose to send.
      </p>
      <div className="flex flex-wrap gap-2">
        {resetOptions.map((label) => (
          <Button
            key={label}
            type="button"
            size="sm"
            variant="outline"
            className="text-xs font-normal"
            onClick={() => {
              window.location.href = buildResetReasonMailto(label);
              dismiss();
            }}
          >
            {label}
          </Button>
        ))}
        <Button type="button" size="sm" variant="ghost" onClick={dismiss}>
          Skip
        </Button>
      </div>
    </div>
  );
}
