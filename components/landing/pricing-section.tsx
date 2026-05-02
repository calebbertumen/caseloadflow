import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PricingSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-heading text-3xl font-semibold tracking-tight">
          Simple pricing while we learn together.
        </h2>
        <p className="mt-3 text-muted-foreground">
          We are starting with a generous free beta. Paid plans may arrive later
          — think roughly $9–15/month for an individual SLP — but nothing is
          charged inside the app today.
        </p>
      </div>
      <div className="mx-auto mt-10 max-w-md">
        <Card className="border-primary/20 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Free beta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Full access to the current MVP feature set.</p>
            <p className="rounded-lg bg-muted/60 p-3 text-foreground">
              Later: individual plan around $9–15/month (not activated yet).
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
