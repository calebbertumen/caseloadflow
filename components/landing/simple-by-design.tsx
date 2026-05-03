import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export function SimpleByDesignSection() {
  return (
    <section className="border-y border-border/60 bg-background">
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-14">
        <Card className="mx-auto max-w-3xl border-primary/15 bg-gradient-to-br from-primary/[0.06] via-card to-amber-50/40 shadow-sm transition-shadow hover:shadow-md dark:to-amber-950/20">
          <CardHeader className="space-y-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/12 text-primary">
              <Sparkles className="size-5" aria-hidden />
            </div>
            <CardTitle className="font-heading text-xl md:text-2xl">
              Simple by design.
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
              CaseloadFlow is not trying to replace your district system or become
              a full EHR. It is a lightweight scheduling workspace to help you plan
              your week, catch conflicts, and understand your service-minute gaps.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="font-normal">
                No account required for MVP
              </Badge>
              <Badge variant="secondary" className="font-normal">
                Browser-based saving
              </Badge>
              <Badge variant="secondary" className="font-normal">
                No payment info required
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
