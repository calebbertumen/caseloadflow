import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const pains = [
  "Too many students to juggle in your head",
  "Not enough open time blocks that actually work",
  "IEP minutes you must hit every week",
  "Lunch, recess, specials, and classroom conflicts",
  "Grouping students without losing track",
  "Constant schedule changes that break your sheet",
];

export function ProblemSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
      <div className="grid gap-10 md:grid-cols-2 md:items-start">
        <div className="space-y-4">
          <h2 className="font-heading text-3xl font-semibold tracking-tight">
            Spreadsheets weren’t made for school therapy.
          </h2>
          <p className="text-muted-foreground text-pretty">
            You are not alone if weekly scheduling feels like a puzzle with
            moving pieces. CaseloadFlow keeps the hard parts visible so you can
            make calm, confident decisions.
          </p>
        </div>
        <Card className="border-destructive/15 bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-base">Sound familiar?</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {pains.map((p) => (
                <li key={p} className="flex gap-2">
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-destructive/70" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
