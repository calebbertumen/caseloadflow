"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePrintAnalytics } from "@/components/analytics/use-print-analytics";
import { useWorkspaceNudges } from "@/components/feedback/workspace-nudge-context";
import { Printer, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCaseload } from "@/components/providers/caseload-provider";
import { cn } from "@/lib/utils";
import { DAY_LABELS, DAY_SHORT } from "@/lib/constants";
import { detectConflicts } from "@/lib/conflict-utils";
import { allStudentMinuteSummaries, summarizeStudentMinutes } from "@/lib/minute-utils";
import { sessionDurationMinutes } from "@/lib/schedule-utils";
import type { DayOfWeek } from "@/lib/types";

export default function ExportPage() {
  const { state, hydrated } = useCaseload();
  const { showScheduleUseful } = useWorkspaceNudges();
  usePrintAnalytics(state, "export", showScheduleUseful);
  const conflicts = useMemo(() => detectConflicts(state), [state]);
  const summaries = useMemo(() => allStudentMinuteSummaries(state), [state]);
  const unscheduled = useMemo(
    () =>
      state.students.filter(
        (s) =>
          summarizeStudentMinutes(s, state.sessions).scheduleStatus !==
          "scheduled"
      ),
    [state]
  );

  const byDay = useMemo(() => {
    const m = new Map<DayOfWeek, typeof state.sessions>();
    for (const d of [0, 1, 2, 3, 4] as DayOfWeek[]) {
      m.set(
        d,
        state.sessions
          .filter((s) => s.dayOfWeek === d)
          .sort((a, b) => a.startTime.localeCompare(b.startTime))
      );
    }
    return m;
  }, [state]);

  const hasSessions = state.sessions.length > 0;

  if (!hydrated) {
    return <div className="h-40 animate-pulse rounded-xl bg-muted" />;
  }

  return (
    <div className="space-y-6">
      <div className="no-print flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div className="space-y-1">
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            Print & export
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
            Print a clean weekly schedule, service-minute summary, and conflict
            summary from your current workspace.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {hasSessions ? (
            <Button type="button" onClick={() => window.print()}>
              <Printer className="size-4" />
              Print schedule
            </Button>
          ) : null}
          <Link href="/schedule" className={cn(buttonVariants({ variant: "outline" }))}>
            Go to schedule
          </Link>
          {hasSessions ? (
            <Link
              href="/settings"
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-muted-foreground")}
            >
              Export workspace backup
            </Link>
          ) : null}
        </div>
      </div>

      <p className="no-print text-xs text-muted-foreground">
        Need a full workspace backup?{" "}
        <Link href="/settings" className="font-medium text-primary underline-offset-4 hover:underline">
          Export from Settings
        </Link>
        .
      </p>

      {!hasSessions ? (
        <Card className="no-print border-border/80 shadow-sm">
          <CardHeader>
            <CardTitle>No sessions to print yet</CardTitle>
            <CardDescription>
              Add students and build your weekly schedule before printing.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 sm:flex-row">
            <Link href="/schedule" className={cn(buttonVariants(), "w-full sm:w-auto")}>
              Build schedule
            </Link>
            <Link
              href="/demo"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "inline-flex w-full items-center justify-center gap-2 sm:w-auto"
              )}
            >
              <Sparkles className="size-4" aria-hidden />
              Load sample data
            </Link>
          </CardContent>
        </Card>
      ) : null}

      {hasSessions ? (
      <div className="print-break-inside-avoid space-y-8">
        <header className="border-b pb-4">
          <h2 className="text-xl font-semibold">Weekly therapy schedule</h2>
          <p className="text-sm text-muted-foreground">
            {state.settings.slpDisplayName} · CaseloadFlow export
          </p>
        </header>

        {([0, 1, 2, 3, 4] as const).map((d) => (
          <section key={d} className="print-break-inside-avoid space-y-2">
            <h3 className="text-sm font-semibold">{DAY_LABELS[d]}</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>IEP time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(byDay.get(d) ?? []).length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-muted-foreground">
                      No sessions
                    </TableCell>
                  </TableRow>
                ) : (
                  (byDay.get(d) ?? []).map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="tabular-nums">
                        {s.startTime}-{s.endTime}
                      </TableCell>
                      <TableCell>
                        {s.studentIds
                          .map(
                            (id) =>
                              state.students.find((x) => x.id === id)?.name ?? id
                          )
                          .join(", ") || "-"}
                      </TableCell>
                      <TableCell>{s.sessionType}</TableCell>
                      <TableCell>
                        {s.countsTowardMinutes ? `${sessionDurationMinutes(s)} min` : "-"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </section>
        ))}

        <section className="print-break-inside-avoid space-y-2">
          <h3 className="text-sm font-semibold">Service-minute summary</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead className="text-right">Required</TableHead>
                <TableHead className="text-right">Scheduled</TableHead>
                <TableHead className="text-right">Remaining</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {summaries.map((row) => {
                const stu = state.students.find((s) => s.id === row.studentId);
                return (
                  <TableRow key={row.studentId}>
                    <TableCell>{stu?.name ?? row.studentId}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {row.required}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {row.scheduled}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {row.remaining}
                    </TableCell>
                    <TableCell className="capitalize">
                      <Badge variant="outline">{row.status}</Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </section>

        <section className="print-break-inside-avoid space-y-2">
          <h3 className="text-sm font-semibold">Conflict summary</h3>
          {conflicts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No conflicts detected.</p>
          ) : (
            <ul className="list-disc space-y-1 pl-5 text-sm">
              {conflicts.map((c) => (
                <li key={c.id}>{c.message}</li>
              ))}
            </ul>
          )}
        </section>

        <section className="print-break-inside-avoid space-y-2">
          <h3 className="text-sm font-semibold">Unscheduled or partial students</h3>
          {unscheduled.length === 0 ? (
            <p className="text-sm text-muted-foreground">Everyone is fully scheduled.</p>
          ) : (
            <ul className="list-disc space-y-1 pl-5 text-sm">
              {unscheduled.map((s) => {
                const sum = summarizeStudentMinutes(s, state.sessions);
                return (
                  <li key={s.id}>
                    {s.name}: {sum.scheduled}/{sum.required} min placed
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <footer className="border-t pt-4 text-center text-xs text-muted-foreground">
          Created with CaseloadFlow
        </footer>
      </div>
      ) : null}

      <Card className="no-print border-border/80 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Printing tips</CardTitle>
          <CardDescription>
            In the print dialog, disable headers and footers for a cleaner page, and
            choose Save as PDF if you want a file without uploading anything.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Day columns in the app use {DAY_SHORT[0]}-{DAY_SHORT[4]} labels; this export
          lists each weekday in order for handouts.
        </CardContent>
      </Card>
    </div>
  );
}
