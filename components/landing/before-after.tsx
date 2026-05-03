import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function BeforeAfter() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-12">
        <div className="grid gap-4 md:grid-cols-2 md:gap-5">
          <Card className="border-muted-foreground/20 shadow-sm transition-shadow hover:shadow-md">
            <CardHeader className="pb-2">
              <Badge variant="outline" className="w-fit font-normal text-muted-foreground">
                Manual workaround
              </Badge>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="font-heading text-lg font-semibold text-foreground">
                Spreadsheet chaos
              </p>
              <p className="leading-relaxed text-muted-foreground">
                Hidden overlaps, fragile formulas, scattered teacher availability, and
                tabs that do not match the real school week.
              </p>
            </CardContent>
          </Card>
          <Card className="border-primary/25 bg-primary/[0.04] shadow-sm transition-shadow hover:shadow-md">
            <CardHeader className="pb-2">
              <Badge className="w-fit border-primary/20 bg-primary/10 font-normal text-primary">
                CaseloadFlow
              </Badge>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="font-heading text-lg font-semibold text-foreground">
                A clear weekly therapy schedule
              </p>
              <p className="leading-relaxed text-muted-foreground">
                One caseload list, one Monday-Friday schedule, and plain-English
                warnings for conflicts, missing minutes, and overloaded groups.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
