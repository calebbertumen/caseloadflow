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
import { StudentDialog } from "@/components/students/student-dialog";
import { useCaseload } from "@/components/providers/caseload-provider";
import { summarizeStudentMinutes } from "@/lib/minute-utils";
import { studentColorDotClass } from "@/lib/student-colors";
import type { Student } from "@/lib/types";
import type { StudentFormValues } from "@/lib/validation";

function minuteBadge(status: "complete" | "partial" | "missing") {
  if (status === "complete") return <Badge variant="secondary">Complete</Badge>;
  if (status === "partial") return <Badge variant="outline">Partial</Badge>;
  return <Badge variant="destructive">Needs minutes</Badge>;
}

function scheduleBadge(
  s: "scheduled" | "partially_scheduled" | "unscheduled"
) {
  if (s === "scheduled") return <Badge variant="secondary">Scheduled</Badge>;
  if (s === "partially_scheduled")
    return <Badge variant="outline">Partially scheduled</Badge>;
  return <Badge variant="destructive">Unscheduled</Badge>;
}

export default function StudentsPage() {
  const { state, hydrated, addStudent, updateStudent, deleteStudent } =
    useCaseload();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);

  const rows = useMemo(
    () =>
      state.students.map((stu) => ({
        stu,
        summary: summarizeStudentMinutes(stu, state.sessions),
      })),
    [state.students, state.sessions]
  );

  const openNew = () => {
    setEditing(null);
    setOpen(true);
  };

  const openEdit = (s: Student) => {
    setEditing(s);
    setOpen(true);
  };

  const onSave = (values: StudentFormValues) => {
    if (editing) {
      updateStudent(editing.id, { ...values });
    } else {
      addStudent(values);
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
            Students
          </h1>
          <p className="text-muted-foreground">
            Your caseload list drives minutes tracking and session assignment.
          </p>
        </div>
        <Button onClick={openNew}>
          <Plus className="size-4" />
          Add student
        </Button>
      </div>

      {state.students.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No students yet</CardTitle>
            <CardDescription>
              Add your first student to start building your schedule. Names,
              grades, and weekly IEP minutes are enough to begin.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={openNew}>
              <Plus className="size-4" />
              Add your first student
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="sr-only">
            <CardTitle>Caseload table</CardTitle>
          </CardHeader>
          <CardContent className="px-0 sm:px-4">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead className="hidden md:table-cell">Teacher</TableHead>
                    <TableHead className="text-right">IEP min / wk</TableHead>
                    <TableHead className="text-right hidden sm:table-cell">
                      Scheduled
                    </TableHead>
                    <TableHead>Minutes</TableHead>
                    <TableHead className="hidden lg:table-cell">On schedule</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map(({ stu, summary }) => (
                    <TableRow key={stu.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span
                            className={`size-2.5 shrink-0 rounded-full ${studentColorDotClass(stu.color)}`}
                            aria-hidden
                          />
                          <div>
                            <div className="font-medium">{stu.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {stu.grade} · {stu.sessionType}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">
                        {stu.teacher}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {stu.requiredMinutesPerWeek}
                      </TableCell>
                      <TableCell className="text-right tabular-nums hidden sm:table-cell">
                        {summary.scheduled}
                      </TableCell>
                      <TableCell>{minuteBadge(summary.status)}</TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {scheduleBadge(summary.scheduleStatus)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            aria-label={`Edit ${stu.name}`}
                            onClick={() => openEdit(stu)}
                          >
                            <Pencil className="size-4" />
                          </Button>
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            className="text-destructive hover:text-destructive"
                            aria-label={`Delete ${stu.name}`}
                            onClick={() => {
                              if (
                                typeof window !== "undefined" &&
                                window.confirm(
                                  `Remove ${stu.name} from your caseload? Sessions will be unlinked.`
                                )
                              ) {
                                deleteStudent(stu.id);
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

      <StudentDialog
        open={open}
        onOpenChange={setOpen}
        student={editing}
        onSave={onSave}
      />
    </div>
  );
}
