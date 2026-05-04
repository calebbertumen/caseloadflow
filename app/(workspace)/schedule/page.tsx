"use client";

import { Fragment, useMemo, useState } from "react";
import Link from "next/link";
import { AlertCircle, Pencil, Plus, Printer, Sparkles, Trash2, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { SessionDialog } from "@/components/schedule/session-dialog";
import { usePrintAnalytics } from "@/components/analytics/use-print-analytics";
import { useWorkspaceNudges } from "@/components/feedback/workspace-nudge-context";
import { useCaseload } from "@/components/providers/caseload-provider";
import {
  DAY_SHORT,
  DEFAULT_SLOT_END,
  DEFAULT_SLOT_START,
  SLOT_STEP_MINUTES,
} from "@/lib/constants";
import { conflictCounts, detectConflicts } from "@/lib/conflict-utils";
import { summarizeStudentMinutes } from "@/lib/minute-utils";
import {
  generateTimeSlots,
  intervalsOverlap,
  parseTimeToMinutes,
  sessionDurationMinutes,
  sessionStartFallsInSlot,
} from "@/lib/schedule-utils";
import type {
  AvailabilityBlock,
  ConflictType,
  DayOfWeek,
  Session,
} from "@/lib/types";
import type { SessionFormValues } from "@/lib/validation";
import { studentColorDotClass } from "@/lib/student-colors";
import { cn } from "@/lib/utils";
import { WorkspaceSampleBadge } from "@/components/workspace/workspace-sample-badge";

const days: DayOfWeek[] = [0, 1, 2, 3, 4];

function blockTouchesSlot(
  block: AvailabilityBlock,
  day: DayOfWeek,
  slot: string,
  stepMinutes: number
): boolean {
  if (block.dayOfWeek !== day) return false;
  const s0 = parseTimeToMinutes(slot);
  const s1 = s0 + stepMinutes;
  const b0 = parseTimeToMinutes(block.startTime);
  const b1 = parseTimeToMinutes(block.endTime);
  return intervalsOverlap(s0, s1, b0, b1);
}
const slots = generateTimeSlots(
  DEFAULT_SLOT_START,
  DEFAULT_SLOT_END,
  SLOT_STEP_MINUTES
);

export default function SchedulePage() {
  const { state, hydrated, addSession, updateSession, deleteSession } =
    useCaseload();
  const { showScheduleUseful } = useWorkspaceNudges();
  usePrintAnalytics(state, "schedule", showScheduleUseful);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Session | null>(null);
  const [defaultDay, setDefaultDay] = useState<DayOfWeek>(0);
  const [defaultStartTime, setDefaultStartTime] = useState<string | undefined>(
    undefined
  );

  const conflicts = useMemo(() => detectConflicts(state), [state]);
  const conflictSummary = useMemo(() => conflictCounts(conflicts), [conflicts]);

  /** Overlaps, unavailable blocks, empty session, oversized group — tint red on grid. */
  const hardConflictSessionTypes: ReadonlySet<ConflictType> = useMemo(
    () =>
      new Set([
        "session_overlap",
        "student_double_booked",
        "student_unavailable",
        "session_no_students",
        "group_size",
      ]),
    []
  );

  const hardConflictSessionIds = useMemo(() => {
    const ids = new Set<string>();
    for (const c of conflicts) {
      if (!hardConflictSessionTypes.has(c.type)) continue;
      for (const id of c.affectedSessionIds) ids.add(id);
    }
    return ids;
  }, [conflicts, hardConflictSessionTypes]);

  /** Minute gap only — tint amber when no hard issue on that session. */
  const minutesOnlySessionIds = useMemo(() => {
    const ids = new Set<string>();
    for (const c of conflicts) {
      if (c.type !== "under_scheduled_minutes") continue;
      for (const id of c.affectedSessionIds) ids.add(id);
    }
    return ids;
  }, [conflicts]);

  const studentOptions = useMemo(
    () => state.students.map((s) => ({ id: s.id, name: s.name })),
    [state.students]
  );

  const unscheduled = useMemo(() => {
    return state.students.filter((stu) => {
      const sum = summarizeStudentMinutes(stu, state.sessions);
      return sum.scheduleStatus !== "scheduled";
    });
  }, [state.students, state.sessions]);

  /** Sessions whose start time falls inside this grid row (not only :00/:30 starts). */
  const sessionsInSlot = (day: DayOfWeek, slot: string) =>
    state.sessions
      .filter(
        (s) =>
          s.dayOfWeek === day &&
          sessionStartFallsInSlot(s.startTime, slot, SLOT_STEP_MINUTES)
      )
      .sort(
        (a, b) =>
          a.startTime.localeCompare(b.startTime) || a.id.localeCompare(b.id)
      );

  const onSave = (values: SessionFormValues) => {
    if (editing) {
      updateSession(editing.id, { ...values });
    } else {
      addSession({ ...values });
    }
  };

  const openNew = (day: DayOfWeek, startTime?: string) => {
    setEditing(null);
    setDefaultDay(day);
    setDefaultStartTime(startTime);
    setOpen(true);
  };

  const closeDialog = (v: boolean) => {
    setOpen(v);
    if (!v) {
      setEditing(null);
      setDefaultStartTime(undefined);
    }
  };

  if (!hydrated) {
    return <div className="h-40 animate-pulse rounded-xl bg-muted" />;
  }

  const hasStudents = state.students.length > 0;
  const hasSessions = state.sessions.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-heading text-2xl font-semibold tracking-tight">
              Weekly schedule
            </h1>
            <WorkspaceSampleBadge variant="compact" />
          </div>
          <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
            Place individual or group therapy sessions on a Monday-Friday grid.
            CaseloadFlow will check minutes and conflicts as you build.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={() => window.print()}>
            <Printer className="size-4" />
            Print
          </Button>
          <Button
            type="button"
            onClick={() => {
              openNew(0);
            }}
          >
            <Plus className="size-4" />
            Add session
          </Button>
        </div>
      </div>

      {!hasStudents ? (
        <Card className="border-primary/15 bg-primary/[0.04] shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="size-4 text-primary" aria-hidden />
              Add students before building sessions
            </CardTitle>
            <CardDescription>
              Sessions work best after you add your caseload and required weekly
              minutes.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 sm:flex-row">
            <Link href="/students" className={cn(buttonVariants(), "w-full sm:w-auto")}>
              Add students
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

      {hasStudents && !hasSessions ? (
        <Card className="border-border/80 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">No sessions yet</CardTitle>
            <CardDescription>
              Click a time slot or use Add session to place your first therapy
              block.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button type="button" onClick={() => openNew(0)}>
              <Plus className="size-4" />
              Add session
            </Button>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1fr_280px]">
        <Card className="min-w-0 border-border/80 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">This week</CardTitle>
            <CardDescription>
              Click a time slot or use Add session to place therapy blocks manually.
              Day headers open the form for that day.
            </CardDescription>
            <div className="no-print flex flex-wrap gap-x-4 gap-y-1 pt-2 text-[10px] text-muted-foreground">
              <span>
                <span className="inline-block size-2 rounded-sm bg-primary/25 align-middle" />{" "}
                Teal tint = scheduled
              </span>
              <span>
                <span className="inline-block size-2 rounded-sm bg-amber-500/40 align-middle" />{" "}
                Amber = minutes gap
              </span>
              <span>
                <span className="inline-block size-2 rounded-sm bg-destructive/35 align-middle" />{" "}
                Red = hard conflict
              </span>
              <span>
                <span className="inline-block size-2 rounded-sm bg-muted-foreground/25 align-middle" />{" "}
                Gray cell = unavailable block window
              </span>
            </div>
          </CardHeader>
          <CardContent className="px-0 sm:px-4">
            <ScrollArea className="w-full">
              <div
                className="grid min-w-[720px] text-xs"
                style={{
                  gridTemplateColumns: `64px repeat(${days.length}, minmax(0,1fr))`,
                }}
              >
                <div className="border-b bg-muted/50 px-2 py-2 font-medium text-muted-foreground">
                  Time
                </div>
                {days.map((d) => (
                  <div
                    key={d}
                    className="border-b border-l bg-muted/50 px-1 py-2 text-center"
                  >
                    <Button
                      type="button"
                      variant="ghost"
                      size="xs"
                      className="h-auto py-1 font-medium"
                      onClick={() => openNew(d)}
                    >
                      {DAY_SHORT[d]}
                    </Button>
                  </div>
                ))}
                {slots.map((slot) => (
                  <Fragment key={slot}>
                    <div className="border-b px-2 py-1.5 text-muted-foreground tabular-nums">
                      {slot}
                    </div>
                    {days.map((d) => {
                      const list = sessionsInSlot(d, slot);
                      const empty = list.length === 0;
                      const hasUnavailable = state.availabilityBlocks.some((b) =>
                        blockTouchesSlot(b, d, slot, SLOT_STEP_MINUTES)
                      );
                      return (
                        <div
                          key={`${slot}-${d}`}
                          role={empty ? "button" : undefined}
                          tabIndex={empty ? 0 : undefined}
                          title={empty ? "Add session" : undefined}
                          onClick={() => {
                            if (empty) openNew(d, slot);
                          }}
                          onKeyDown={(e) => {
                            if (empty && (e.key === "Enter" || e.key === " ")) {
                              e.preventDefault();
                              openNew(d, slot);
                            }
                          }}
                          className={cn(
                            "border-b border-l p-1 align-top min-h-[52px]",
                            hasUnavailable && "bg-muted/35",
                            !hasUnavailable && "bg-background/50",
                            empty &&
                              "cursor-pointer transition-colors hover:bg-primary/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          )}
                        >
                          <div className="flex flex-col gap-1">
                            {list.map((s) => {
                              const names = s.studentIds
                                .map(
                                  (id) =>
                                    state.students.find((x) => x.id === id)?.name ??
                                    "Unknown"
                                )
                                .join(", ");
                              const hardIssue = hardConflictSessionIds.has(s.id);
                              const minutesOnly =
                                !hardIssue && minutesOnlySessionIds.has(s.id);
                              return (
                                <div
                                  key={s.id}
                                  className={cn(
                                    "rounded-md border px-2 py-1.5 text-[11px] leading-snug",
                                    hardIssue &&
                                      "border-destructive/40 bg-destructive/10",
                                    minutesOnly &&
                                      "border-amber-500/35 bg-amber-500/[0.08]",
                                    !hardIssue &&
                                      !minutesOnly &&
                                      "border-primary/20 bg-primary/5"
                                  )}
                                >
                                  <div className="flex items-start justify-between gap-1">
                                    <div className="min-w-0">
                                      <div className="font-medium tabular-nums text-foreground">
                                        {s.startTime}–{s.endTime} ·{" "}
                                        {sessionDurationMinutes(s)} min
                                      </div>
                                      <div className="truncate text-[10px] font-medium text-foreground/90">
                                        {names || "No students"}
                                      </div>
                                      <div className="mt-0.5 flex flex-wrap items-center gap-1 text-[10px] capitalize text-muted-foreground">
                                        <span>{s.sessionType}</span>
                                        {!s.countsTowardMinutes ? (
                                          <Badge variant="outline" className="text-[9px] px-1 py-0 font-normal">
                                            non-IEP
                                          </Badge>
                                        ) : null}
                                      </div>
                                    </div>
                                    <div className="flex shrink-0 flex-col gap-0.5">
                                      <Button
                                        type="button"
                                        size="icon-xs"
                                        variant="ghost"
                                        className="size-6"
                                        aria-label="Edit session"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setEditing(s);
                                          setDefaultDay(s.dayOfWeek);
                                          setDefaultStartTime(undefined);
                                          setOpen(true);
                                        }}
                                      >
                                        <Pencil className="size-3" />
                                      </Button>
                                      <Button
                                        type="button"
                                        size="icon-xs"
                                        variant="ghost"
                                        className="size-6 text-destructive"
                                        aria-label="Delete session"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          if (window.confirm("Remove this session?")) {
                                            deleteSession(s.id);
                                          }
                                        }}
                                      >
                                        <Trash2 className="size-3" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </Fragment>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </CardContent>
        </Card>

        <div className="space-y-4 xl:sticky xl:top-20 xl:self-start">
          <Card className="border-border/80 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Unscheduled or partial</CardTitle>
              <CardDescription>
                Students who still need time on the weekly grid.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {unscheduled.length === 0 ? (
                <p className="text-muted-foreground">
                  All required minutes are scheduled.
                </p>
              ) : (
                <ul className="space-y-2">
                  {unscheduled.map((stu) => {
                    const sum = summarizeStudentMinutes(stu, state.sessions);
                    return (
                      <li
                        key={stu.id}
                        className="flex items-center justify-between gap-2 rounded-lg border bg-card px-3 py-2"
                      >
                        <div className="flex min-w-0 items-center gap-2">
                          <span
                            className={`size-2 shrink-0 rounded-full ${studentColorDotClass(stu.color)}`}
                          />
                          <span className="truncate font-medium">{stu.name}</span>
                        </div>
                        <span className="shrink-0 text-right text-xs tabular-nums text-muted-foreground">
                          {sum.remaining > 0
                            ? `${sum.remaining} min remaining`
                            : "On target"}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </CardContent>
          </Card>
          <Card className="border-amber-500/20 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertCircle className="size-4 text-amber-600" aria-hidden />
                Conflicts at a glance
              </CardTitle>
              <CardDescription>
                {conflicts.length === 0 ? (
                  "No issues flagged for this draft schedule."
                ) : (
                  <>
                    <span className="font-medium text-foreground">
                      {conflictSummary.errors} errors
                    </span>
                    {" · "}
                    <span className="font-medium text-foreground">
                      {conflictSummary.warnings} warnings
                    </span>
                    <span className="mt-1 block font-normal text-muted-foreground">
                      Red blocks: overlaps, unavailable times, empty session, or large
                      group. Amber: still short on weekly minutes (see Conflicts for
                      full list).
                    </span>
                  </>
                )}
              </CardDescription>
            </CardHeader>
            {conflicts.length > 0 ? (
              <CardContent className="pt-0">
                <Link
                  href="/conflicts"
                  className={cn(
                    buttonVariants({ size: "sm" }),
                    "flex w-full justify-center"
                  )}
                >
                  Review conflicts
                </Link>
              </CardContent>
            ) : null}
          </Card>
        </div>
      </div>

      <SessionDialog
        open={open}
        onOpenChange={closeDialog}
        session={editing}
        studentOptions={studentOptions}
        defaultDay={editing?.dayOfWeek ?? defaultDay}
        defaultStartTime={editing ? undefined : defaultStartTime}
        onSave={onSave}
      />
    </div>
  );
}
