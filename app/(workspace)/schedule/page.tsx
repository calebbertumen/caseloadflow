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
import { detectConflicts } from "@/lib/conflict-utils";
import { summarizeStudentMinutes } from "@/lib/minute-utils";
import {
  generateTimeSlots,
  sessionDurationMinutes,
} from "@/lib/schedule-utils";
import type { DayOfWeek, Session } from "@/lib/types";
import type { SessionFormValues } from "@/lib/validation";
import { studentColorDotClass } from "@/lib/student-colors";
import { cn } from "@/lib/utils";

const days: DayOfWeek[] = [0, 1, 2, 3, 4];
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
  const conflictSessionIds = useMemo(() => {
    const ids = new Set<string>();
    for (const c of conflicts) {
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

  const sessionsStarting = (day: DayOfWeek, slot: string) =>
    state.sessions.filter(
      (s) => s.dayOfWeek === day && s.startTime === slot
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
        <div className="space-y-1">
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            Weekly schedule
          </h1>
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
                      const list = sessionsStarting(d, slot);
                      const empty = list.length === 0;
                      return (
                        <div
                          key={`${slot}-${d}`}
                          role={empty ? "button" : undefined}
                          tabIndex={empty ? 0 : undefined}
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
                            "border-b border-l bg-background/50 p-1 align-top min-h-[52px]",
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
                              const bad = conflictSessionIds.has(s.id);
                              return (
                                <div
                                  key={s.id}
                                  className={cn(
                                    "rounded-md border px-2 py-1.5 text-[11px] leading-snug",
                                    bad
                                      ? "border-destructive/40 bg-destructive/10"
                                      : "border-primary/20 bg-primary/5"
                                  )}
                                >
                                  <div className="flex items-start justify-between gap-1">
                                    <div>
                                      <div className="font-medium text-foreground">
                                        {sessionDurationMinutes(s)} min ·{" "}
                                        {s.sessionType}
                                      </div>
                                      <div className="text-muted-foreground">
                                        {s.startTime}-{s.endTime}
                                        {!s.countsTowardMinutes && (
                                          <Badge variant="outline" className="ml-1 text-[9px] px-1 py-0">
                                            non-IEP
                                          </Badge>
                                        )}
                                      </div>
                                      <div className="mt-0.5 text-[10px] text-muted-foreground">
                                        {names || "No students"}
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

        <div className="space-y-4">
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
                        <span className="shrink-0 tabular-nums text-xs text-muted-foreground">
                          {sum.scheduled}/{sum.required} min
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
                {conflicts.length === 0
                  ? "No conflicts detected for this draft schedule."
                  : `${conflicts.length} open items.`}
              </CardDescription>
            </CardHeader>
            {conflicts.length > 0 ? (
              <CardContent className="pt-0">
                <Link
                  href="/conflicts"
                  className={cn(
                    buttonVariants({ variant: "secondary", size: "sm" }),
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
