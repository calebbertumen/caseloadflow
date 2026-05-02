"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { DAY_LABELS } from "@/lib/constants";
import { generateTimeSlots } from "@/lib/schedule-utils";
import type { AvailabilityBlock } from "@/lib/types";
import {
  availabilityFormSchema,
  type AvailabilityFormValues,
} from "@/lib/validation";

const timeOptions = generateTimeSlots("07:00", "17:30", 15);

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  block?: AvailabilityBlock | null;
  studentOptions: { id: string; name: string }[];
  onSave: (values: AvailabilityFormValues) => void;
};

const defaults: AvailabilityFormValues = {
  label: "",
  type: "lunch",
  dayOfWeek: 0,
  startTime: "11:30",
  endTime: "12:00",
  appliesTo: "global",
  studentIds: [] as string[],
  notes: "",
};

export function BlockDialog({
  open,
  onOpenChange,
  block,
  studentOptions,
  onSave,
}: Props) {
  const form = useForm<AvailabilityFormValues>({
    resolver: zodResolver(availabilityFormSchema),
    defaultValues: defaults,
  });

  const appliesTo = useWatch({ control: form.control, name: "appliesTo" });

  useEffect(() => {
    if (!open) return;
    if (block) {
      form.reset({
        label: block.label,
        type: block.type,
        dayOfWeek: block.dayOfWeek,
        startTime: block.startTime,
        endTime: block.endTime,
        appliesTo: block.appliesTo,
        studentIds: block.studentIds ?? [],
        notes: block.notes ?? "",
      });
    } else {
      form.reset(defaults);
    }
  }, [open, block]);

  const toggleStudent = (id: string, checked: boolean) => {
    const cur = form.getValues("studentIds") ?? [];
    if (checked) form.setValue("studentIds", [...cur, id], { shouldValidate: true });
    else form.setValue(
      "studentIds",
      cur.filter((x) => x !== id),
      { shouldValidate: true }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{block ? "Edit block" : "Add unavailable block"}</DialogTitle>
          <DialogDescription>
            Lunch, recess, specials, testing, or times you cannot pull students.
          </DialogDescription>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit((values) => {
            onSave({
              ...values,
              studentIds:
                values.appliesTo === "student" ? values.studentIds : [],
            });
            onOpenChange(false);
          })}
        >
          <div className="space-y-2">
            <Label htmlFor="blk-label">Label</Label>
            <input
              id="blk-label"
              className="flex h-8 w-full rounded-lg border border-input bg-background px-2 text-sm"
              {...form.register("label")}
            />
            {form.formState.errors.label && (
              <p className="text-xs text-destructive">
                {form.formState.errors.label.message}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="blk-type">Type</Label>
              <select
                id="blk-type"
                className="flex h-8 w-full rounded-lg border border-input bg-background px-2 text-sm"
                {...form.register("type")}
              >
                <option value="lunch">Lunch</option>
                <option value="recess">Recess</option>
                <option value="specials">Specials</option>
                <option value="testing">Testing</option>
                <option value="classroom_unavailable">Classroom unavailable</option>
                <option value="student_unavailable">Student unavailable</option>
                <option value="slp_unavailable">SLP unavailable</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="blk-day">Day</Label>
              <select
                id="blk-day"
                className="flex h-8 w-full rounded-lg border border-input bg-background px-2 text-sm"
                {...form.register("dayOfWeek", { valueAsNumber: true })}
              >
                {([0, 1, 2, 3, 4] as const).map((d) => (
                  <option key={d} value={d}>
                    {DAY_LABELS[d]}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="blk-start">Start</Label>
              <select
                id="blk-start"
                className="flex h-8 w-full rounded-lg border border-input bg-background px-2 text-sm"
                {...form.register("startTime")}
              >
                {timeOptions.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="blk-end">End</Label>
              <select
                id="blk-end"
                className="flex h-8 w-full rounded-lg border border-input bg-background px-2 text-sm"
                {...form.register("endTime")}
              >
                {timeOptions.map((t) => (
                  <option key={`e-${t}`} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            {form.formState.errors.endTime && (
              <p className="col-span-2 text-xs text-destructive">
                {form.formState.errors.endTime.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="blk-applies">Applies to</Label>
            <select
              id="blk-applies"
              className="flex h-8 w-full rounded-lg border border-input bg-background px-2 text-sm"
              {...form.register("appliesTo")}
            >
              <option value="global">Everyone / school-wide</option>
              <option value="slp">You (SLP) unavailable</option>
              <option value="student">Specific students</option>
              <option value="teacher">Teacher / classroom (reference)</option>
            </select>
            <p className="text-xs text-muted-foreground">
              “Teacher / classroom” is for your notes today — conflict checks use
              global, SLP, and student-specific blocks.
            </p>
          </div>
          {appliesTo === "student" && (
            <fieldset className="space-y-2 rounded-lg border p-3">
              <legend className="text-sm font-medium px-1">Students</legend>
              {studentOptions.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  Add students first, then link this block.
                </p>
              ) : (
                <div className="max-h-40 space-y-2 overflow-y-auto pr-1">
                  {studentOptions.map((s) => {
                    const checked = (form.watch("studentIds") ?? []).includes(s.id);
                    return (
                      <label
                        key={s.id}
                        className="flex cursor-pointer items-center gap-2 text-sm"
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(v) =>
                            toggleStudent(s.id, Boolean(v))
                          }
                        />
                        {s.name}
                      </label>
                    );
                  })}
                </div>
              )}
              {form.formState.errors.studentIds && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.studentIds.message as string}
                </p>
              )}
            </fieldset>
          )}
          <div className="space-y-2">
            <Label htmlFor="blk-notes">Notes</Label>
            <Textarea id="blk-notes" rows={2} {...form.register("notes")} />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save block</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
