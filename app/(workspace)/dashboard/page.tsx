"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock,
  MessageSquareText,
  Printer,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GiveFeedbackButton } from "@/components/feedback/give-feedback-button";
import { useCaseload } from "@/components/providers/caseload-provider";
import { cn } from "@/lib/utils";
import { conflictCounts, detectConflicts } from "@/lib/conflict-utils";
import {
  aggregateRemainingMinutes,
  aggregateRequiredMinutes,
  totalScheduledStudentMinutes,
} from "@/lib/minute-utils";
import { isOfficialDemoWorkspace, workspaceHasContent } from "@/lib/workspace-utils";

const DEMO_GUIDE_DISMISS_KEY = "caseloadflow_demo_3step_dismissed";

export default function DashboardPage() {
  const { state, hydrated } = useCaseload();
  const conflicts = detectConflicts(state);
  const conflictSummary = conflictCounts(conflicts);
  const required = aggregateRequiredMinutes(state.students);
  const scheduled = totalScheduledStudentMinutes(state.students, state.sessions);
  const remaining = aggregateRemainingMinutes(state.students, state.sessions);
  const hasStudents = state.students.length > 0;
  const hasBlocks = state.availabilityBlocks.length > 0;
  const hasSessions = state.sessions.length > 0;
  const interacted = workspaceHasContent(state);
  const isSample = isOfficialDemoWorkspace(state);
  const [demoGuideDismissed, setDemoGuideDismissed] = useState(true);

  useEffect(() => {
    try {
      setDemoGuideDismissed(
        localStorage.getItem(DEMO_GUIDE_DISMISS_KEY) === "1"
      );
    } catch {
      setDemoGuideDismissed(false);
    }
  }, []);

  const dismissDemoGuide = () => {
    try {
      localStorage.setItem(DEMO_GUIDE_DISMISS_KEY, "1");
    } catch {
      /* ignore */
    }
    setDemoGuideDismissed(true);
  };

  if (!hydrated) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-56 animate-pulse rounded-lg bg-muted" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  const allZero =
    state.students.length === 0 &&
    required === 0 &&
    scheduled === 0 &&
    remaining === 0 &&
    conflicts.length === 0;

  let nextStep: {
    title: string;
    text: string;
    primary: { label: string; href: string };
    secondary?: { label: string; href: string };
    tertiary?: { label: string; href: string };
  };

  if (isSample && hasStudents && hasBlocks && hasSessions) {
    nextStep = {
      title: "Review this sample week",
      text: "This fictional schedule shows how CaseloadFlow tracks minutes, surfaces conflicts, and prepares a print-ready weekly view.",
      primary: { label: "Review conflicts", href: "/conflicts" },
      secondary: { label: "View schedule", href: "/schedule" },
      tertiary: { label: "Print sample schedule", href: "/export" },
    };
  } else if (!hasStudents) {
    nextStep = {
      title: "Start your first schedule",
      text: "Add a student or load sample data to see how CaseloadFlow works. Recommended flow: add students → block unavailable times → build your schedule → review conflicts → print or export.",
      primary: { label: "Load sample data", href: "/demo" },
      secondary: { label: "Add first student", href: "/students" },
    };
  } else if (!hasBlocks) {
    nextStep = {
      title: "Next: block unavailable times",
      text: "Add lunch, recess, specials, meetings, and classroom restrictions before building your schedule.",
      primary: { label: "Add unavailable time", href: "/availability" },
    };
  } else if (!hasSessions) {
    nextStep = {
      title: "Next: build your weekly grid",
      text: "Place individual or group sessions on the Monday-Friday schedule.",
      primary: { label: "Build schedule", href: "/schedule" },
    };
  } else {
    nextStep = {
      title: "Review your week",
      text: "Check conflicts, remaining minutes, and unscheduled students before printing.",
      primary: { label: "Review conflicts", href: "/conflicts" },
      secondary: { label: "Print schedule", href: "/export" },
    };
  }

  const studentsStatus =
    state.students.length === 0 ? "Add students" : "Ready";
  const minutesStatus =
    remaining > 0 ? "Needs minutes" : hasStudents ? "Ready" : "—";
  const conflictStatus =
    conflicts.length > 0 ? "Check conflicts" : hasSessions ? "No issues" : "—";

  const metricLinkClass =
    "block rounded-xl transition-shadow hover:shadow-md hover:ring-1 hover:ring-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

  return (
    <div className="space-y-6 md:space-y-8">
      {isSample ? (
        <div className="rounded-lg border border-primary/20 bg-primary/[0.06] px-3 py-2.5 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Sample workspace: </span>
          names, times, and minutes are fictional so you can explore without real
          student data.
        </div>
      ) : null}

      {isSample && !demoGuideDismissed ? (
        <Card className="relative border-primary/20 bg-card shadow-sm">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="absolute right-2 top-2 text-muted-foreground"
            aria-label="Dismiss"
            onClick={dismissDemoGuide}
          >
            <X className="size-4" />
          </Button>
          <CardHeader className="pb-2 pr-10">
            <CardTitle className="text-base">Try the demo in 3 steps</CardTitle>
            <CardDescription className="text-sm leading-relaxed">
              <ol className="mt-2 list-decimal space-y-1 pl-5">
                <li>View the schedule</li>
                <li>Review conflicts</li>
                <li>Print or export the sample week</li>
              </ol>
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Link href="/schedule" className={cn(buttonVariants({ size: "sm" }))}>
              View schedule
            </Link>
            <Link
              href="/conflicts"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              Review conflicts
            </Link>
          </CardContent>
        </Card>
      ) : null}

      <div className="space-y-1.5">
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          Your weekly planning dashboard
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
          {isSample
            ? "Minutes update as you edit sessions. Conflicts are plain-English planning checks — not legal or compliance advice."
            : "Start by adding students, blocking unavailable times, then building your Monday–Friday schedule."}
        </p>
      </div>

      <Card className="border-primary/20 bg-gradient-to-br from-primary/[0.06] to-card shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{nextStep.title}</CardTitle>
          <CardDescription className="text-sm leading-relaxed">
            {nextStep.text}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <Link
            href={nextStep.primary.href}
            className={cn(
              buttonVariants({ size: "lg" }),
              "inline-flex w-full items-center justify-center gap-2 sm:w-auto"
            )}
          >
            {nextStep.primary.href === "/demo" ? (
              <Sparkles className="size-4" aria-hidden />
            ) : null}
            {nextStep.primary.label}
          </Link>
          {nextStep.secondary ? (
            <Link
              href={nextStep.secondary.href}
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "w-full justify-center sm:w-auto"
              )}
            >
              {nextStep.secondary.label}
            </Link>
          ) : null}
          {nextStep.tertiary ? (
            <Link
              href={nextStep.tertiary.href}
              className={cn(
                buttonVariants({ variant: "ghost", size: "lg" }),
                "w-full justify-center text-muted-foreground sm:w-auto"
              )}
            >
              {nextStep.tertiary.label}
            </Link>
          ) : null}
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Link href="/students" className={metricLinkClass}>
          <Card className="h-full border-border/80 shadow-sm">
            <CardHeader className="pb-1">
              <div className="flex items-start justify-between gap-2">
                <CardDescription>Students</CardDescription>
                <Badge variant="secondary" className="shrink-0 font-normal text-[10px]">
                  {studentsStatus}
                </Badge>
              </div>
              <CardTitle className="text-2xl tabular-nums">
                {state.students.length}
              </CardTitle>
            </CardHeader>
          </Card>
        </Link>
        <Card className="border-border/80 shadow-sm">
          <CardHeader className="pb-1">
            <CardDescription>Required weekly minutes</CardDescription>
            <CardTitle className="text-2xl tabular-nums">{required}</CardTitle>
          </CardHeader>
        </Card>
        <Link href="/schedule" className={metricLinkClass}>
          <Card className="h-full border-border/80 shadow-sm">
            <CardHeader className="pb-1">
              <div className="flex items-start justify-between gap-2">
                <CardDescription>Scheduled minutes</CardDescription>
                <Badge variant="secondary" className="shrink-0 font-normal text-[10px]">
                  {minutesStatus}
                </Badge>
              </div>
              <CardTitle className="text-2xl tabular-nums">{scheduled}</CardTitle>
            </CardHeader>
          </Card>
        </Link>
        <Link href="/schedule" className={metricLinkClass}>
          <Card className="h-full border-border/80 shadow-sm">
            <CardHeader className="pb-1">
              <CardDescription>Remaining minutes</CardDescription>
              <CardTitle className="text-2xl tabular-nums">{remaining}</CardTitle>
            </CardHeader>
          </Card>
        </Link>
        <Link href="/conflicts" className={metricLinkClass}>
          <Card
            className={cn(
              "h-full border-border/80 shadow-sm sm:col-span-2 lg:col-span-1",
              conflicts.length > 0 && "border-amber-500/25 bg-amber-500/[0.04]"
            )}
          >
            <CardHeader className="pb-1">
              <div className="flex items-start justify-between gap-2">
                <CardDescription>Conflicts</CardDescription>
                <Badge variant="outline" className="shrink-0 font-normal text-[10px]">
                  {conflictStatus}
                </Badge>
              </div>
              <CardTitle className="text-2xl tabular-nums">
                {conflicts.length === 0
                  ? "0"
                  : `${conflictSummary.errors} err · ${conflictSummary.warnings} warn`}
              </CardTitle>
            </CardHeader>
          </Card>
        </Link>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Try editing a session or student to see the numbers update.
      </p>

      {allZero ? (
        <p className="text-center text-sm text-muted-foreground">
          Load sample data or add your first student to make this dashboard useful.
        </p>
      ) : null}

      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground">
          {isSample ? "Try the workflow" : "Build your schedule"}
        </h2>
        <div className="flex flex-wrap gap-2">
          <Link href="/students" className={cn(buttonVariants())}>
            <Users className="size-4" />
            Add student
          </Link>
          <Link
            href="/availability"
            className={cn(buttonVariants({ variant: "secondary" }))}
          >
            <Clock className="size-4" />
            Add unavailable time
          </Link>
          <Link
            href="/schedule"
            className={cn(buttonVariants({ variant: "secondary" }))}
          >
            <CalendarDays className="size-4" />
            {isSample ? "Edit schedule" : "Build schedule"}
          </Link>
          <Link href="/export" className={cn(buttonVariants({ variant: "outline" }))}>
            <Printer className="size-4" />
            Print/export
          </Link>
        </div>
      </div>

      <p className="text-center text-[11px] text-muted-foreground">
        Print a clean weekly view before finalizing your week. Use initials or
        nicknames for real students.
      </p>

      <p className="text-center text-[11px] text-muted-foreground">
        You can reset your workspace or reload sample data anytime from Settings.
      </p>

      {interacted ? (
        <div className="flex flex-col gap-2 rounded-lg border border-border/60 bg-muted/25 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MessageSquareText className="size-4 shrink-0 text-primary/80" aria-hidden />
            <span>
              <span className="font-medium text-foreground">Help shape CaseloadFlow — </span>
              what felt confusing, missing, or useful?
            </span>
          </div>
          <GiveFeedbackButton className="shrink-0" />
        </div>
      ) : null}
    </div>
  );
}
