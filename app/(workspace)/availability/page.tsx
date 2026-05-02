"use client";

import { useMemo, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import type { AvailabilityBlock } from "@/lib/types";
import type { AvailabilityFormValues } from "@/lib/validation";

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

  if (!hydrated) {
    return <div className="h-40 animate-pulse rounded-xl bg-muted" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div className="space-y-1">
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            Availability
          </h1>
          <p className="text-muted-foreground">
            Mark the predictable parts of the week so sessions are not placed on
            top of lunch, recess, or other hard stops.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
        >
          <Plus className="size-4" />
          Add block
        </Button>
      </div>

      {state.availabilityBlocks.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No unavailable blocks yet</CardTitle>
            <CardDescription>
              Add lunch, recess, specials, or times you are in meetings. This is
              a big quality-of-life step before you build the weekly grid.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => {
                setEditing(null);
                setOpen(true);
              }}
            >
              <Plus className="size-4" />
              Add your first block
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="px-0 sm:px-4 pt-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Label</TableHead>
                    <TableHead className="hidden sm:table-cell">Type</TableHead>
                    <TableHead>Day</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead className="hidden md:table-cell">Applies to</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {state.availabilityBlocks.map((b) => (
                    <TableRow key={b.id}>
                      <TableCell className="font-medium">{b.label}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge variant="outline">{b.type.replace("_", " ")}</Badge>
                      </TableCell>
                      <TableCell>{DAY_LABELS[b.dayOfWeek]}</TableCell>
                      <TableCell className="tabular-nums text-muted-foreground">
                        {b.startTime}–{b.endTime}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                        {appliesLabel(b, studentNames)}
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
                              if (window.confirm(`Remove “${b.label}”?`)) {
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
