import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function BeforeAfter() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-4 md:px-6 md:py-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-muted">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Before
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="font-medium text-foreground">Spreadsheet chaos</p>
            <p className="text-muted-foreground">
              Hidden overlaps, fragile formulas, and tabs that never quite match
              the real week.
            </p>
          </CardContent>
        </Card>
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-primary">
              After
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="font-medium text-foreground">
              A clean weekly schedule with conflicts flagged
            </p>
            <p className="text-muted-foreground">
              One grid, one caseload list, and plain-language warnings you can
              act on quickly.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
