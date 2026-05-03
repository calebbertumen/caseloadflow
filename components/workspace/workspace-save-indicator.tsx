"use client";

import { Check, CloudOff, Loader2 } from "lucide-react";
import { useCaseload } from "@/components/providers/caseload-provider";
import { cn } from "@/lib/utils";

function formatSavedAt(ms: number | null): string {
  if (ms == null) return "";
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(ms));
  } catch {
    return "";
  }
}

export function WorkspaceSaveIndicator() {
  const { hydrated, persistStatus, lastSavedAtMs } = useCaseload();

  if (!hydrated) {
    return (
      <div
        className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground"
        aria-live="polite"
      >
        <Loader2 className="size-3 animate-spin" aria-hidden />
        Loading…
      </div>
    );
  }

  const savedLabel = formatSavedAt(lastSavedAtMs);

  return (
    <div
      className={cn(
        "inline-flex max-w-full flex-wrap items-center gap-x-2 gap-y-0.5 rounded-md border px-2 py-1 text-[11px] sm:text-xs",
        persistStatus === "unsaved" && "border-amber-500/30 bg-amber-500/5",
        persistStatus === "saving" && "border-primary/25 bg-primary/5",
        persistStatus === "saved" && "border-border bg-muted/30"
      )}
      aria-live="polite"
    >
      <span className="inline-flex items-center gap-1 font-medium text-foreground">
        {persistStatus === "saving" ? (
          <>
            <Loader2 className="size-3 animate-spin text-primary" aria-hidden />
            Saving…
          </>
        ) : persistStatus === "unsaved" ? (
          <>
            <CloudOff className="size-3 text-amber-700 dark:text-amber-300" aria-hidden />
            Unsaved changes
          </>
        ) : (
          <>
            <Check className="size-3 text-primary" aria-hidden />
            Saved in this browser
          </>
        )}
      </span>
      {persistStatus === "saved" && savedLabel ? (
        <span className="text-muted-foreground sm:border-l sm:border-border sm:pl-2">
          Last saved {savedLabel}
        </span>
      ) : null}
    </div>
  );
}
