"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AlertTriangle, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
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
import { summarizeStudentMinutes } from "@/lib/minute-utils";
import type { AppState, Conflict } from "@/lib/types";
import { cn } from "@/lib/utils";

type FilterTab = "all" | "errors" | "warnings";

export default function ConflictsPage() {
  const { state, hydrated } = useCaseload();
  const conflicts = useMemo(() => detectConflicts(state), [state]);
  const counts = useMemo(() => conflictCounts(conflicts), [conflicts]);
  const viewedRef = useRef(false);
  const [tab, setTab] = useState<FilterTab>("all");

  const hasStudents = state.students.length > 0;
  const hasSessions = state.sessions.length > 0;
  const canCheck = hasStudents && hasSessions;

  const underMinute = useMemo(
    () => conflicts.filter((c) => c.type === "under_scheduled_minutes"),
    [conflicts]
  );
  const restConflicts = useMemo(
    () => conflicts.filter((c) => c.type !== "under_scheduled_minutes"),
    [conflicts]
  );

  const groupedUnderSummary = useMemo(() => {
    if (underMinute.length === 0) return null;
    const parts = underMinute.map((c) => {
      const id = c.affectedStudentIds[0];
      if (!id) return null;
      const stu = state.students.find((s) => s.id === id);
      if (!stu) return null;
      const sum = summarizeStudentMinutes(stu, state.sessions);
      return `${stu.name} needs ${sum.remaining} more min`;
    });
    return parts.filter(Boolean).join(" · ");
  }, [underMinute, state]);

  const filteredRest = useMemo(() => {
    if (tab === "all") return restConflicts;
    if (tab === "errors") return restConflicts.filter((c) => c.severity === "error");
    return restConflicts.filter((c) => c.severity !== "error");
  }, [restConflicts, tab]);

  const showGroupedUnder =
    underMinute.length > 0 && (tab === "all" || tab === "warnings");

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
              No issues flagged for your current draft schedule. Review remaining
              minutes before printing.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <>
          <Card className="border-border/80 bg-muted/20 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Fix these before printing</CardTitle>
              <CardDescription>
                {counts.errors > 0 ? (
                  <span className="font-medium text-destructive">
                    {counts.errors} error{counts.errors !== 1 ? "s" : ""} need attention.
                  </span>
                ) : (
                  <span>No errors — nice work.</span>
                )}{" "}
                {counts.warnings > 0 ? (
                  <span className="text-muted-foreground">
                    {counts.warnings} warning{counts.warnings !== 1 ? "s" : ""} are
                    planning checks.
                  </span>
                ) : null}
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="flex flex-wrap gap-2">
            <Badge variant="destructive">{counts.errors} errors</Badge>
            <Badge variant="outline">{counts.warnings} warnings</Badge>
          </div>

          <div className="flex flex-wrap gap-1 rounded-lg border bg-muted/30 p-1">
            {(["all", "errors", "warnings"] as const).map((k) => (
              <Button
                key={k}
                type="button"
                size="sm"
                variant={tab === k ? "secondary" : "ghost"}
                className={cn(
                  "capitalize",
                  tab === k && "bg-background shadow-sm"
                )}
                onClick={() => setTab(k)}
              >
                {k === "all" ? "All" : k}
              </Button>
            ))}
          </div>

          <div className="space-y-6">
            {showGroupedUnder && groupedUnderSummary ? (
              <section className="space-y-2">
                <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Weekly minutes
                </h2>
                <ul>
                  <GroupedUnderScheduledCard
                    summary={groupedUnderSummary}
                    count={underMinute.length}
                  />
                </ul>
              </section>
            ) : null}

            {filteredRest.some((c) => c.severity === "error") ? (
              <section className="space-y-3">
                <h2 className="text-sm font-semibold text-destructive">Errors</h2>
                <ul className="space-y-3">
                  {filteredRest
                    .filter((c) => c.severity === "error")
                    .map((c) => (
                      <ConflictRow key={c.id} conflict={c} state={state} />
                    ))}
                </ul>
              </section>
            ) : null}

            {filteredRest.some((c) => c.severity !== "error") ? (
              <section className="space-y-3">
                <h2 className="text-sm font-semibold text-muted-foreground">Warnings</h2>
                <ul className="space-y-3">
                  {filteredRest
                    .filter((c) => c.severity !== "error")
                    .map((c) => (
                      <ConflictRow key={c.id} conflict={c} state={state} />
                    ))}
                </ul>
              </section>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}

function GroupedUnderScheduledCard({
  summary,
  count,
}: {
  summary: string;
  count: number;
}) {
  return (
    <li>
      <Card className="border-border/80 shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex flex-wrap items-start gap-2">
            <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div className="min-w-0 flex-1 space-y-1">
              <Badge variant="outline" className="text-[10px] font-normal">
                under scheduled minutes
              </Badge>
              <CardTitle className="text-sm font-medium leading-snug">
                {count} student{count !== 1 ? "s" : ""} still need weekly minutes
              </CardTitle>
              <p className="text-xs text-muted-foreground">{summary}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 pt-0 text-sm text-muted-foreground">
          <p>
            <span className="font-medium text-foreground">Suggested fix: </span>
            Add or extend sessions that count toward IEP minutes.
          </p>
          <Link href="/schedule" className={cn(buttonVariants({ size: "sm" }))}>
            Go to schedule
          </Link>
        </CardContent>
      </Card>
    </li>
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
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="text-[10px] font-normal capitalize">
                  {c.type.replace(/_/g, " ")}
                </Badge>
                <Badge
                  variant={c.severity === "error" ? "destructive" : "secondary"}
                  className="text-[10px] font-normal"
                >
                  {c.severity}
                </Badge>
              </div>
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
        <CardContent className="space-y-3 pt-0 text-sm text-muted-foreground">
          {c.suggestedFix ? (
            <p>
              <span className="font-medium text-foreground">Suggested fix: </span>
              {c.suggestedFix}
            </p>
          ) : null}
          <Link href="/schedule" className={cn(buttonVariants({ size: "sm" }))}>
            Go to schedule
          </Link>
        </CardContent>
      </Card>
    </li>
  );
}
