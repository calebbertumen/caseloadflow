"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  DAY_LABELS,
  DEFAULT_SLOT_END,
  DEFAULT_SLOT_START,
  SLOT_STEP_MINUTES,
} from "@/lib/constants";
import { generateTimeSlots } from "@/lib/schedule-utils";
import type { Session } from "@/lib/types";
import { sessionFormSchema, type SessionFormValues } from "@/lib/validation";

const slotOptions = generateTimeSlots(
  DEFAULT_SLOT_START,
  DEFAULT_SLOT_END,
  SLOT_STEP_MINUTES
);

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session?: Session | null;
  studentOptions: { id: string; name: string }[];
  defaultDay?: Session["dayOfWeek"];
  /** When adding a session, prefill start (and next slot as end) from a grid click. */
  defaultStartTime?: string;
  onSave: (values: SessionFormValues) => void;
};

const defaults: SessionFormValues = {
  dayOfWeek: 0,
  startTime: "09:00",
  endTime: "09:30",
  studentIds: [],
  sessionType: "group",
  location: "",
  notes: "",
  countsTowardMinutes: true,
};

function endTimeAfterStart(startTime: string): string {
  const i = slotOptions.indexOf(startTime);
  if (i >= 0 && i + 1 < slotOptions.length) return slotOptions[i + 1]!;
  return defaults.endTime;
}

export function SessionDialog({
  open,
  onOpenChange,
  session,
  studentOptions,
  defaultDay = 0,
  defaultStartTime,
  onSave,
}: Props) {
  const form = useForm<SessionFormValues>({
    resolver: zodResolver(sessionFormSchema),
    defaultValues: { ...defaults, dayOfWeek: defaultDay },
  });

  const counts = useWatch({ control: form.control, name: "countsTowardMinutes" });

  useEffect(() => {
    if (!open) return;
    if (session) {
      form.reset({
        dayOfWeek: session.dayOfWeek,
        startTime: session.startTime,
        endTime: session.endTime,
        studentIds: [...session.studentIds],
        sessionType: session.sessionType,
        location: session.location ?? "",
        notes: session.notes ?? "",
        countsTowardMinutes: session.countsTowardMinutes,
      });
    } else {
      const start = defaultStartTime ?? defaults.startTime;
      const end = defaultStartTime ? endTimeAfterStart(defaultStartTime) : defaults.endTime;
      form.reset({ ...defaults, dayOfWeek: defaultDay, startTime: start, endTime: end });
    }
  }, [open, session?.id, defaultDay, defaultStartTime]);

  const toggleStudent = (id: string, checked: boolean) => {
    const cur = form.getValues("studentIds");
    if (checked) form.setValue("studentIds", [...cur, id], { shouldValidate: true });
    else
      form.setValue(
        "studentIds",
        cur.filter((x) => x !== id),
        { shouldValidate: true }
      );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{session ? "Edit session" : "Add session"}</DialogTitle>
          <DialogDescription>
            Place therapy manually. CaseloadFlow will check overlaps and minutes
            after you save.
          </DialogDescription>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit((values) => {
            onSave(values);
            onOpenChange(false);
          })}
        >
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="ses-day">Day</Label>
              <select
                id="ses-day"
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
            <div className="space-y-2">
              <Label htmlFor="ses-type">Session type</Label>
              <select
                id="ses-type"
                className="flex h-8 w-full rounded-lg border border-input bg-background px-2 text-sm"
                {...form.register("sessionType")}
              >
                <option value="individual">Individual</option>
                <option value="group">Group</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="ses-start">Start</Label>
              <select
                id="ses-start"
                className="flex h-8 w-full rounded-lg border border-input bg-background px-2 text-sm"
                {...form.register("startTime")}
              >
                {slotOptions.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ses-end">End</Label>
              <select
                id="ses-end"
                className="flex h-8 w-full rounded-lg border border-input bg-background px-2 text-sm"
                {...form.register("endTime")}
              >
                {slotOptions.map((t) => (
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
            <Label htmlFor="ses-loc">Location (optional)</Label>
            <Input id="ses-loc" {...form.register("location")} placeholder="Speech room" />
          </div>
          <fieldset className="space-y-2 rounded-lg border p-3">
            <legend className="text-sm font-medium px-1">Students in this session</legend>
            {studentOptions.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                Add students on the Students tab first.
              </p>
            ) : (
              <div className="max-h-44 space-y-2 overflow-y-auto pr-1">
                {studentOptions.map((s) => {
                  const checked = form.watch("studentIds").includes(s.id);
                  return (
                    <label
                      key={s.id}
                      className="flex cursor-pointer items-center gap-2 text-sm"
                    >
                      <Checkbox
                        checked={checked}
                        onCheckedChange={(v) => toggleStudent(s.id, Boolean(v))}
                      />
                      {s.name}
                    </label>
                  );
                })}
              </div>
            )}
          </fieldset>
          <div className="flex items-center gap-2">
            <Checkbox
              checked={counts}
              onCheckedChange={(v) =>
                form.setValue("countsTowardMinutes", Boolean(v), {
                  shouldValidate: true,
                })
              }
            />
            <Label className="font-normal text-sm">Counts toward IEP minutes</Label>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ses-notes">Notes</Label>
            <Textarea id="ses-notes" rows={2} {...form.register("notes")} />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save session</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
