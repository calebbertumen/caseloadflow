import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const pains = [
  "Too many students to schedule manually",
  "IEP minutes that must be met every week",
  "Lunch, recess, specials, and classroom conflicts",
  "Students who need groups but do not fit neatly together",
  "Missed sessions and make-up minutes that are hard to track",
];

export function ProblemSection() {
  return (
    <section className="border-y border-primary/10 bg-primary/[0.04]">
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-14">
        <div className="grid gap-8 md:grid-cols-2 md:items-start md:gap-10">
          <div className="space-y-3">
            <h2 className="font-heading text-2xl font-semibold tracking-tight md:text-3xl">
              School SLP scheduling has too many moving pieces.
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground text-pretty md:text-base">
              You are not just placing names into time slots. You are balancing IEP
              minutes, classroom schedules, lunch, recess, specials, group
              compatibility, meetings, make-up sessions, and constant changes.
            </p>
          </div>
          <Card className="border-destructive/20 bg-destructive/[0.06] shadow-sm transition-shadow hover:shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Sound familiar?</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                {pains.map((p) => (
                  <li key={p} className="flex gap-2">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-destructive/70" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
