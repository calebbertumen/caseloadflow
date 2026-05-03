import {
  CalendarDays,
  Printer,
  ShieldAlert,
  Timer,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    title: "Student caseload manager",
    body: "Keep names or initials, grades, teachers, minutes, and session preferences in one list.",
    icon: Users,
  },
  {
    title: "Weekly schedule builder",
    body: "Lay out individual and group therapy blocks on a clear Monday-Friday grid.",
    icon: CalendarDays,
  },
  {
    title: "Conflict warnings",
    body: "Catch double-bookings, unavailable-time overlaps, missing students, and risky group sizes early.",
    icon: ShieldAlert,
  },
  {
    title: "Service-minute tracker",
    body: "See required, scheduled, and remaining minutes at a glance.",
    icon: Timer,
  },
  {
    title: "Printable weekly view",
    body: "Print a readable schedule and minute summary without extra PDF services.",
    icon: Printer,
  },
] as const;

export function FeatureCards() {
  return (
    <section className="border-y border-amber-950/10 bg-gradient-to-b from-amber-50/50 via-background to-background dark:from-amber-950/15 dark:via-background dark:to-background">
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-14">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-2xl font-semibold tracking-tight md:text-3xl">
            Everything you need for a first-pass weekly schedule.
          </h2>
          <p className="mt-3 text-sm text-muted-foreground text-pretty md:text-base">
            A focused MVP for planning the week, checking minutes, and printing a
            clean schedule.
          </p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:mt-10 lg:grid-cols-3 lg:gap-5">
          {features.map(({ title, body, icon: Icon }) => (
            <Card
              key={title}
              className="border-border/80 shadow-sm transition-shadow hover:border-primary/20 hover:shadow-md"
            >
              <CardHeader>
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-4" aria-hidden />
                </div>
                <CardTitle className="text-base">{title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-relaxed text-muted-foreground">
                {body}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
