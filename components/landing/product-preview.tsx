import { AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { DAY_SHORT } from "@/lib/constants";

const days = [0, 1, 2, 3, 4] as const;
const slots = ["08:00", "09:00", "10:00", "11:00"];

export function ProductPreview() {
  return (
    <Card className="border-primary/15 bg-gradient-to-b from-card to-muted/40 shadow-sm ring-primary/10">
      <div className="grid gap-3 p-4 md:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Weekly schedule preview
            </p>
            <p className="text-sm font-semibold">This week</p>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border bg-background px-2 py-1 text-xs text-amber-800 dark:text-amber-200">
            <AlertTriangle className="size-3.5" aria-hidden />
            2 conflicts
          </div>
        </div>
        <div className="overflow-x-auto rounded-lg border bg-background">
          <div
            className="grid min-w-[520px] text-xs"
            style={{
              gridTemplateColumns: `72px repeat(${days.length}, minmax(0,1fr))`,
            }}
          >
            <div className="border-b bg-muted/50 px-2 py-2 font-medium text-muted-foreground">
              Time
            </div>
            {days.map((d) => (
              <div
                key={d}
                className="border-b border-l bg-muted/50 px-2 py-2 text-center font-medium text-muted-foreground"
              >
                {DAY_SHORT[d]}
              </div>
            ))}
            {slots.map((t) => [
              <div
                key={`${t}-label`}
                className="border-b px-2 py-2 text-muted-foreground"
              >
                {t}
              </div>,
              ...days.map((d) => (
                <div
                  key={`${t}-${d}`}
                  className="border-b border-l bg-muted/10 px-1 py-1"
                >
                  {d === 0 && t === "09:00" ? (
                    <div className="rounded-md bg-primary/15 px-2 py-2 text-[11px] font-medium text-primary">
                      Group · 2 students
                    </div>
                  ) : d === 2 && t === "08:00" ? (
                    <div className="rounded-md bg-destructive/10 px-2 py-2 text-[11px] font-medium text-destructive line-through decoration-destructive/50">
                      Overlap
                    </div>
                  ) : (
                    <div className="h-10 rounded-md border border-dashed border-muted-foreground/20" />
                  )}
                </div>
              )),
            ])}
          </div>
        </div>
        <div className="rounded-lg border bg-muted/30 p-3 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">Conflicts panel:</span>{" "}
          flags double-bookings, lunch overlaps, and missing IEP minutes before
          you print.
        </div>
      </div>
    </Card>
  );
}
