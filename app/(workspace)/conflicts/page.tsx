"use client";

import { useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { AlertTriangle, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCaseload } from "@/components/providers/caseload-provider";
import {
  buildSafeAnalyticsContext,
  trackEvent,
} from "@/lib/analytics";
import { DAY_SHORT } from "@/lib/constants";
import { conflictCounts, detectConflicts } from "@/lib/conflict-utils";
import type { AppState, Conflict } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function ConflictsPage() {
  const { state, hydrated } = useCaseload();
  const conflicts = useMemo(() => detectConflicts(state), [state]);
  const counts = useMemo(() => conflictCounts(conflicts), [conflicts]);
  const viewedRef = useRef(false);

  const hasStudents = state.students.length > 0;
  const hasSessions = state.sessions.length > 0;
  const canCheck = hasStudents && hasSessions;

  const errors = useMemo(
    () => conflicts.filter((c) => c.severity === "error"),
    [conflicts]
  );
  const warnings = useMemo(
    () => conflicts.filter((c) => c.severity !== "error"),
    [conflicts]
  );

  useEffect(() => {
    if (!hydrated || viewedRef.current) return;
    viewedRef.current = true;
    trackEvent("conflict_panel_viewed", buildSafeAnalyticsContext(state));
  }, [hydrated, state]);

  if (!hydrated) {
    return <div className="h-40 animate-pulse rounded-xl bg-muted" />;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Conflicts
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
          Plain-English checks for overlaps, unavailable times, remaining minutes,
          and group size. CaseloadFlow supports your planning but does not replace
          your professional judgment.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge variant="destructive">{counts.errors} errors</Badge>
        <Badge variant="outline">{counts.warnings} warnings</Badge>
      </div>

      {!canCheck ? (
        <Card className="border-border/80 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Nothing to check yet</CardTitle>
            <CardDescription>
              Add students and sessions to start seeing conflict and minute checks.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Link href="/students" className={cn(buttonVariants())}>
              Add students
            </Link>
            <Link href="/schedule" className={cn(buttonVariants({ variant: "outline" }))}>
              Build schedule
            </Link>
          </CardContent>
        </Card>
      ) : conflicts.length === 0 ? (
        <Card className="border-primary/15 bg-primary/[0.04] shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">You are clear</CardTitle>
            <CardDescription>
              No conflicts detected for your current draft schedule. Review
              remaining minutes before printing.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="space-y-8">
          {errors.length > 0 ? (
            <section className="space-y-3">
              <h2 className="text-sm font-semibold text-destructive">Errors</h2>
              <ul className="space-y-3">
                {errors.map((c) => (
                  <ConflictRow key={c.id} conflict={c} state={state} />
                ))}
              </ul>
            </section>
          ) : null}
          {warnings.length > 0 ? (
            <section className="space-y-3">
              <h2 className="text-sm font-semibold text-muted-foreground">Warnings</h2>
              <ul className="space-y-3">
                {warnings.map((c) => (
                  <ConflictRow key={c.id} conflict={c} state={state} />
                ))}
              </ul>
            </section>
          ) : null}
          <Link href="/schedule" className={cn(buttonVariants({ variant: "secondary" }))}>
            Go to schedule
          </Link>
        </div>
      )}
    </div>
  );
}

function ConflictRow({ conflict: c, state }: { conflict: Conflict; state: AppState }) {
  const studentLine =
    c.affectedStudentIds.length > 0
      ? c.affectedStudentIds
          .map((id) => state.students.find((s) => s.id === id)?.name ?? id)
          .join(", ")
      : null;
  const sessionLine =
    c.affectedSessionIds.length > 0
      ? c.affectedSessionIds
          .map((id) => {
            const s = state.sessions.find((x) => x.id === id);
            if (!s) return id;
            const when = `${DAY_SHORT[s.dayOfWeek]} ${s.startTime}`;
            return `${when} (${s.sessionType})`;
          })
          .join(" · ")
      : null;

  return (
    <li>
      <Card
        className={cn(
          "border-border/80 shadow-sm",
          c.severity === "error" && "border-destructive/30 bg-destructive/5"
        )}
      >
        <CardHeader className="pb-2">
          <div className="flex flex-wrap items-start gap-2">
            {c.severity === "error" ? (
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" />
            ) : (
              <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            )}
            <div className="min-w-0 flex-1 space-y-1">
              <Badge variant="outline" className="text-[10px] font-normal">
                {c.type.replace(/_/g, " ")}
              </Badge>
              <CardTitle className="text-sm font-medium leading-snug">
                {c.message}
              </CardTitle>
              {(studentLine || sessionLine) && (
                <p className="text-xs text-muted-foreground">
                  {studentLine ? (
                    <>
                      <span className="font-medium text-foreground">Students: </span>
                      {studentLine}
                    </>
                  ) : null}
                  {studentLine && sessionLine ? " · " : null}
                  {sessionLine ? (
                    <>
                      <span className="font-medium text-foreground">Sessions: </span>
                      {sessionLine}
                    </>
                  ) : null}
                </p>
              )}
            </div>
          </div>
        </CardHeader>
        {c.suggestedFix ? (
          <CardContent className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Suggested fix: </span>
            {c.suggestedFix}
          </CardContent>
        ) : null}
      </Card>
    </li>
  );
}
