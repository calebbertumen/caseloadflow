"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Ban, Pencil, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BlockDialog } from "@/components/availability/block-dialog";
import { useCaseload } from "@/components/providers/caseload-provider";
import { DAY_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { AvailabilityBlock, DayOfWeek } from "@/lib/types";
import type { AvailabilityFormValues } from "@/lib/validation";

const exampleChips = [
  "Lunch",
  "Recess",
  "Specials",
  "Meeting",
  "Testing",
  "Classroom unavailable",
] as const;

const days: DayOfWeek[] = [0, 1, 2, 3, 4];

function appliesLabel(b: AvailabilityBlock, studentNames: Map<string, string>) {
  if (b.appliesTo === "global") return "School-wide";
  if (b.appliesTo === "slp") return "SLP";
  if (b.appliesTo === "student") {
    const names =
      b.studentIds?.map((id) => studentNames.get(id) ?? id).join(", ") ?? "";
    return names || "Students";
  }
  return "Teacher note";
}

export default function AvailabilityPage() {
  const {
    state,
    hydrated,
    addAvailabilityBlock,
    updateAvailabilityBlock,
    deleteAvailabilityBlock,
  } = useCaseload();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AvailabilityBlock | null>(null);

  const studentNames = useMemo(() => {
    const m = new Map<string, string>();
    for (const s of state.students) m.set(s.id, s.name);
    return m;
  }, [state.students]);

  const studentOptions = useMemo(
    () => state.students.map((s) => ({ id: s.id, name: s.name })),
    [state.students]
  );

  const blocksByDay = useMemo(() => {
    const m = new Map<DayOfWeek, AvailabilityBlock[]>();
    for (const d of days) m.set(d, []);
    for (const b of state.availabilityBlocks) {
      m.get(b.dayOfWeek)?.push(b);
    }
    for (const list of m.values()) {
      list.sort((a, b) => a.startTime.localeCompare(b.startTime));
    }
    return m;
  }, [state.availabilityBlocks]);

  const onSave = (values: AvailabilityFormValues) => {
    const studentIds =
      values.appliesTo === "student" && values.studentIds.length > 0
        ? values.studentIds
        : undefined;
    if (editing) {
      updateAvailabilityBlock(editing.id, { ...values, studentIds });
    } else {
      addAvailabilityBlock({ ...values, studentIds });
    }
  };

  const openAdd = () => {
    setEditing(null);
    setOpen(true);
  };

  if (!hydrated) {
    return <div className="h-40 animate-pulse rounded-xl bg-muted" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div className="space-y-1">
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            Unavailable times
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
            Block the parts of the school week where sessions should not be placed,
            such as lunch, recess, specials, meetings, or classroom restrictions.
          </p>
        </div>
        <Button onClick={openAdd}>
          <Plus className="size-4" />
          Add block
        </Button>
      </div>

      {state.availabilityBlocks.length === 0 ? (
        <Card className="border-border/80 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Ban className="size-5 shrink-0 text-primary/80" aria-hidden />
              No unavailable times yet
            </CardTitle>
            <CardDescription>
              Add predictable hard stops like lunch, recess, specials, meetings, or
              classroom restrictions before building your weekly grid.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {exampleChips.map((label) => (
                <Badge key={label} variant="secondary" className="font-normal">
                  {label}
                </Badge>
              ))}
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <Button type="button" size="lg" className="w-full sm:w-auto" onClick={openAdd}>
                <Plus className="size-4" />
                Add first unavailable time
              </Button>
              <Link
                href="/schedule"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "w-full justify-center sm:w-auto"
                )}
              >
                Skip for now and build schedule
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {days.map((d) => {
            const list = blocksByDay.get(d) ?? [];
            if (list.length === 0) return null;
            return (
              <Card key={d} className="border-border/80 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{DAY_LABELS[d]}</CardTitle>
                </CardHeader>
                <CardContent className="px-0 sm:px-4">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Label</TableHead>
                          <TableHead className="hidden sm:table-cell">Type</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead className="hidden md:table-cell">Applies to</TableHead>
                          <TableHead className="hidden lg:table-cell">Notes</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {list.map((b) => (
                          <TableRow key={b.id}>
                            <TableCell className="font-medium">{b.label}</TableCell>
                            <TableCell className="hidden sm:table-cell">
                              <Badge variant="outline" className="font-normal">
                                {b.type.replace(/_/g, " ")}
                              </Badge>
                            </TableCell>
                            <TableCell className="tabular-nums text-muted-foreground">
                              {b.startTime}-{b.endTime}
                            </TableCell>
                            <TableCell className="hidden max-w-[220px] truncate text-sm text-muted-foreground md:table-cell">
                              {appliesLabel(b, studentNames)}
                            </TableCell>
                            <TableCell className="hidden max-w-[200px] truncate text-sm text-muted-foreground lg:table-cell">
                              {b.notes || "—"}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <Button
                                  size="icon-sm"
                                  variant="ghost"
                                  aria-label={`Edit ${b.label}`}
                                  onClick={() => {
                                    setEditing(b);
                                    setOpen(true);
                                  }}
                                >
                                  <Pencil className="size-4" />
                                </Button>
                                <Button
                                  size="icon-sm"
                                  variant="ghost"
                                  className="text-destructive hover:text-destructive"
                                  aria-label={`Delete ${b.label}`}
                                  onClick={() => {
                                    if (window.confirm(`Remove "${b.label}"?`)) {
                                      deleteAvailabilityBlock(b.id);
                                    }
                                  }}
                                >
                                  <Trash2 className="size-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <BlockDialog
        open={open}
        onOpenChange={setOpen}
        block={editing}
        studentOptions={studentOptions}
        onSave={onSave}
      />
    </div>
  );
}
