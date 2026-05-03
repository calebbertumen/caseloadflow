import { AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { DAY_SHORT } from "@/lib/constants";

const days = [0, 1, 2, 3, 4] as const;
const slots = ["08:00", "09:00", "10:00", "11:00"];

const summary = [
  { label: "48 students", tone: "muted" as const },
  { label: "1,320 required min", tone: "muted" as const },
  { label: "240 min unscheduled", tone: "amber" as const },
  { label: "2 conflicts", tone: "amber" as const },
];

export function ProductPreview() {
  return (
    <Card className="overflow-hidden border-primary/20 bg-gradient-to-b from-card to-muted/50 shadow-md ring-1 ring-primary/10 transition-shadow duration-300 hover:shadow-lg">
      <div className="grid gap-4 p-4 md:grid-cols-[minmax(0,140px)_1fr] md:items-start md:gap-5 md:p-5">
        <div className="space-y-2 rounded-lg border border-border/80 bg-muted/30 p-3 text-xs md:min-h-0">
          <p className="font-medium text-foreground">This week</p>
          <ul className="space-y-1.5 text-muted-foreground">
            {summary.map(({ label, tone }) => (
              <li
                key={label}
                className={
                  tone === "amber"
                    ? "font-medium text-amber-950 dark:text-amber-100"
                    : ""
                }
              >
                {label}
              </li>
            ))}
          </ul>
          <Badge
            variant="outline"
            className="mt-1 w-fit border-amber-500/35 bg-amber-500/10 text-[10px] font-normal text-amber-950 dark:text-amber-50"
          >
            Needs minutes
          </Badge>
        </div>
        <div className="min-w-0 space-y-3">
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Weekly schedule preview
            </p>
            <p className="text-sm font-semibold text-foreground">
              Monday-Friday grid
            </p>
          </div>
          <div className="max-w-full overflow-x-auto rounded-lg border border-border/80 bg-background shadow-inner">
            <div
              className="grid min-w-[480px] text-xs sm:min-w-[520px]"
              style={{
                gridTemplateColumns: `64px repeat(${days.length}, minmax(0,1fr))`,
              }}
            >
              <div className="border-b bg-muted/60 px-2 py-2 font-medium text-muted-foreground">
                Time
              </div>
              {days.map((d) => (
                <div
                  key={d}
                  className="border-b border-l bg-muted/60 px-1.5 py-2 text-center font-medium text-muted-foreground"
                >
                  {DAY_SHORT[d]}
                </div>
              ))}
              {slots.map((t) => [
                <div
                  key={`${t}-label`}
                  className="border-b px-2 py-2 tabular-nums text-muted-foreground"
                >
                  {t}
                </div>,
                ...days.map((d) => (
                  <div
                    key={`${t}-${d}`}
                    className="border-b border-l bg-muted/[0.35] p-1"
                  >
                    {d === 0 && t === "09:00" ? (
                      <div className="rounded-md bg-primary/20 px-2 py-2 text-[11px] font-medium leading-snug text-primary">
                        Artic group · 2 students
                      </div>
                    ) : d === 2 && t === "08:00" ? (
                      <div className="flex items-center gap-1 rounded-md bg-destructive/12 px-2 py-2 text-[11px] font-medium leading-snug text-destructive">
                        <AlertTriangle className="size-3 shrink-0" aria-hidden />
                        Lunch overlap
                      </div>
                    ) : (
                      <div className="h-10 rounded-md border border-dashed border-muted-foreground/15" />
                    )}
                  </div>
                )),
              ])}
            </div>
          </div>
          <p className="rounded-md border border-border/60 bg-muted/25 px-3 py-2 text-[11px] leading-relaxed text-muted-foreground">
            <span className="font-medium text-foreground">Conflict panel</span>{" "}
            flags double-bookings, unavailable times, risky group sizes, and
            missing IEP minutes.
          </p>
        </div>
      </div>
    </Card>
  );
}
