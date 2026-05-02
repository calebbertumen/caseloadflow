import { CalendarDays, Printer, ShieldAlert, Timer, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    title: "Student caseload manager",
    body: "Keep names, grades, teachers, and session preferences in one calm list.",
    icon: Users,
  },
  {
    title: "Weekly schedule builder",
    body: "Lay out Monday–Friday blocks with enough room to think on a desktop screen.",
    icon: CalendarDays,
  },
  {
    title: "Conflict warnings",
    body: "Catch double-bookings, unavailable overlaps, and risky group sizes early.",
    icon: ShieldAlert,
  },
  {
    title: "Service-minute tracker",
    body: "See required, scheduled, and remaining minutes at a glance for each student.",
    icon: Timer,
  },
  {
    title: "Printable schedule",
    body: "Use your browser print dialog — no extra PDF services required.",
    icon: Printer,
  },
] as const;

export function FeatureCards() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-heading text-3xl font-semibold tracking-tight">
          Everything you need for the first pass at a weekly schedule.
        </h2>
        <p className="mt-3 text-muted-foreground">
          A focused MVP that stays easy to maintain — and easy to actually use on
          a busy Monday morning.
        </p>
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map(({ title, body, icon: Icon }) => (
          <Card key={title} className="border-muted">
            <CardHeader>
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-4" aria-hidden />
              </div>
              <CardTitle className="text-base">{title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{body}</CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
