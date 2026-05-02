"use client";

import { useMemo } from "react";
import { AlertTriangle, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCaseload } from "@/components/providers/caseload-provider";
import { conflictCounts, detectConflicts } from "@/lib/conflict-utils";
import { cn } from "@/lib/utils";

export default function ConflictsPage() {
  const { state, hydrated } = useCaseload();
  const conflicts = useMemo(() => detectConflicts(state), [state]);
  const counts = useMemo(() => conflictCounts(conflicts), [conflicts]);

  if (!hydrated) {
    return <div className="h-40 animate-pulse rounded-xl bg-muted" />;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Conflicts
        </h1>
        <p className="text-muted-foreground">
          Plain-language checks on overlaps, unavailable times, minutes, and
          group size. Nothing here replaces your clinical judgment — it just
          saves surprises.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge variant="destructive">{counts.errors} errors</Badge>
        <Badge variant="outline">{counts.warnings} warnings</Badge>
      </div>

      {conflicts.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">You are clear</CardTitle>
            <CardDescription>
              No conflicts detected for your current draft. Keep going — or
              add more detail to stress-test the week.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <ul className="space-y-3">
          {conflicts.map((c) => (
            <li key={c.id}>
              <Card
                className={cn(
                  c.severity === "error" && "border-destructive/30 bg-destructive/5"
                )}
              >
                <CardHeader className="pb-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {c.severity === "error" ? (
                      <AlertTriangle className="size-4 text-destructive" />
                    ) : (
                      <Info className="size-4 text-muted-foreground" />
                    )}
                    <CardTitle className="text-sm font-medium leading-snug">
                      {c.message}
                    </CardTitle>
                    <Badge variant="outline" className="ml-auto shrink-0 text-[10px]">
                      {c.type.replace(/_/g, " ")}
                    </Badge>
                  </div>
                </CardHeader>
                {c.suggestedFix && (
                  <CardContent className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Suggestion: </span>
                    {c.suggestedFix}
                  </CardContent>
                )}
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
