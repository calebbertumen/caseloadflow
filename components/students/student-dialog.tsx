"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { STUDENT_COLOR_OPTIONS } from "@/lib/student-colors";
import type { Student } from "@/lib/types";
import { studentFormSchema, type StudentFormValues } from "@/lib/validation";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student?: Student | null;
  onSave: (values: StudentFormValues) => void;
};

const defaults: StudentFormValues = {
  name: "",
  grade: "",
  teacher: "",
  requiredMinutesPerWeek: 60,
  preferredSessionLength: 30,
  sessionType: "individual",
  notes: "",
  color: "violet",
};

export function StudentDialog({ open, onOpenChange, student, onSave }: Props) {
  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: defaults,
  });

  useEffect(() => {
    if (!open) return;
    if (student) {
      form.reset({
        name: student.name,
        grade: student.grade,
        teacher: student.teacher,
        requiredMinutesPerWeek: student.requiredMinutesPerWeek,
        preferredSessionLength: student.preferredSessionLength,
        sessionType: student.sessionType,
        notes: student.notes ?? "",
        color: student.color,
      });
    } else {
      form.reset(defaults);
    }
  }, [open, student]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{student ? "Edit student" : "Add student"}</DialogTitle>
          <DialogDescription>
            Keep it simple — you can always come back and adjust minutes or
            preferences.
          </DialogDescription>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit((values) => {
            onSave(values);
            onOpenChange(false);
          })}
        >
          <div className="space-y-2">
            <Label htmlFor="stu-name">Student name</Label>
            <Input id="stu-name" {...form.register("name")} autoComplete="name" />
            {form.formState.errors.name && (
              <p className="text-xs text-destructive">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="stu-grade">Grade</Label>
              <Input id="stu-grade" {...form.register("grade")} placeholder="e.g. 2nd" />
              {form.formState.errors.grade && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.grade.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="stu-color">Color tag</Label>
              <select
                id="stu-color"
                className="flex h-8 w-full rounded-lg border border-input bg-background px-2 text-sm"
                {...form.register("color")}
              >
                {STUDENT_COLOR_OPTIONS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="stu-teacher">Teacher / classroom</Label>
            <Input id="stu-teacher" {...form.register("teacher")} />
            {form.formState.errors.teacher && (
              <p className="text-xs text-destructive">
                {form.formState.errors.teacher.message}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="stu-req">Weekly IEP minutes</Label>
              <Input
                id="stu-req"
                type="number"
                min={0}
                {...form.register("requiredMinutesPerWeek", { valueAsNumber: true })}
              />
              <p className="text-xs text-muted-foreground">
                Total weekly therapy required.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="stu-len">Preferred session length</Label>
              <Input
                id="stu-len"
                type="number"
                min={5}
                {...form.register("preferredSessionLength", { valueAsNumber: true })}
              />
              <p className="text-xs text-muted-foreground">Typical block length.</p>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="stu-type">Session type</Label>
            <select
              id="stu-type"
              className="flex h-8 w-full rounded-lg border border-input bg-background px-2 text-sm"
              {...form.register("sessionType")}
            >
              <option value="individual">Individual</option>
              <option value="group">Group</option>
              <option value="flexible">Flexible</option>
            </select>
            <p className="text-xs text-muted-foreground">
              Helps you remember how you usually see this student.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="stu-notes">Notes</Label>
            <Textarea id="stu-notes" rows={3} {...form.register("notes")} />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save student</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
