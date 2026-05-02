"use client";

import Link from "next/link";
import {
  AlertTriangle,
  CalendarDays,
  Clock,
  Printer,
  Users,
} from "lucide-react";
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
import { cn } from "@/lib/utils";
import { detectConflicts } from "@/lib/conflict-utils";
import {
  aggregateRemainingMinutes,
  aggregateRequiredMinutes,
  totalScheduledStudentMinutes,
} from "@/lib/minute-utils";

export default function DashboardPage() {
  const { state, hydrated } = useCaseload();
  const conflicts = detectConflicts(state);
  const required = aggregateRequiredMinutes(state.students);
  const scheduled = totalScheduledStudentMinutes(state.students, state.sessions);
  const remaining = aggregateRemainingMinutes(state.students, state.sessions);

  if (!hydrated) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-muted" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="font-heading text-2xl font-semibold tracking-tight md:text-3xl">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Hi{state.settings.slpDisplayName ? `, ${state.settings.slpDisplayName}` : ""}{" "}
          — here is a snapshot of your week.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Students</CardDescription>
            <CardTitle className="text-3xl tabular-nums">
              {state.students.length}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Active names in your caseload list.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Required weekly minutes</CardDescription>
            <CardTitle className="text-3xl tabular-nums">{required}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Sum of IEP weekly totals across students.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Scheduled student-minutes</CardDescription>
            <CardTitle className="text-3xl tabular-nums">{scheduled}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Minutes assigned in sessions that count toward IEP time.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Unscheduled / remaining</CardDescription>
            <CardTitle className="text-3xl tabular-nums">{remaining}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Minutes still needed to meet weekly targets.
          </CardContent>
        </Card>
        <Card className="border-amber-500/25 sm:col-span-2 xl:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <div>
              <CardDescription>Conflicts</CardDescription>
              <CardTitle className="text-3xl tabular-nums">
                {conflicts.length}
              </CardTitle>
            </div>
            <Badge variant="outline" className="shrink-0">
              <AlertTriangle className="size-3" />
              Review
            </Badge>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Warnings and errors from overlap checks, minutes, and unavailable
            blocks.
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground">Quick actions</h2>
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
            Add availability block
          </Link>
          <Link
            href="/schedule"
            className={cn(buttonVariants({ variant: "secondary" }))}
          >
            <CalendarDays className="size-4" />
            Build schedule
          </Link>
          <Link
            href="/export"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            <Printer className="size-4" />
            Print schedule
          </Link>
        </div>
      </div>
    </div>
  );
}
