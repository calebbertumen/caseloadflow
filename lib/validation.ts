import { z } from "zod";
import type { AvailabilityAppliesTo, AvailabilityBlockType } from "./types";

export const dayOfWeekSchema = z.union([
  z.literal(0),
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
]);

const timeSchema = z.string().regex(/^\d{2}:\d{2}$/, "Use HH:MM (24-hour).");

export const sessionTypeSchema = z.enum(["individual", "group", "flexible"]);

export const studentFormSchema = z.object({
  name: z.string().min(1, "Name is required.").max(120),
  grade: z.string().min(1, "Grade helps you stay organized.").max(40),
  teacher: z.string().min(1, "Teacher or classroom is required.").max(120),
  requiredMinutesPerWeek: z
    .number()
    .min(0, "Minutes cannot be negative.")
    .max(600, "That number looks too large for a weekly total."),
  preferredSessionLength: z
    .number()
    .min(5, "Use at least 5 minutes.")
    .max(120, "Use a shorter preferred length for school therapy blocks."),
  sessionType: sessionTypeSchema,
  notes: z.string().max(2000),
  color: z.string().min(1).max(32),
});

export type StudentFormValues = z.infer<typeof studentFormSchema>;

export const availabilityBlockTypeSchema = z.enum([
  "lunch",
  "recess",
  "specials",
  "testing",
  "classroom_unavailable",
  "student_unavailable",
  "slp_unavailable",
  "other",
]) satisfies z.ZodType<AvailabilityBlockType>;

export const availabilityAppliesToSchema = z.enum([
  "student",
  "teacher",
  "slp",
  "global",
]) satisfies z.ZodType<AvailabilityAppliesTo>;

export const availabilityFormSchema = z
  .object({
    label: z.string().min(1, "Label is required.").max(120),
    type: availabilityBlockTypeSchema,
    dayOfWeek: dayOfWeekSchema,
    startTime: timeSchema,
    endTime: timeSchema,
    appliesTo: availabilityAppliesToSchema,
    studentIds: z.array(z.string()),
    notes: z.string().max(2000),
  })
  .superRefine((data, ctx) => {
    const [sh, sm] = data.startTime.split(":").map(Number);
    const [eh, em] = data.endTime.split(":").map(Number);
    const start = sh * 60 + sm;
    const end = eh * 60 + em;
    if (!(end > start)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "End time must be after start time.",
        path: ["endTime"],
      });
    }
    if (data.appliesTo === "student" && !(data.studentIds?.length)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Pick at least one student for a student-specific block.",
        path: ["studentIds"],
      });
    }
  });

export type AvailabilityFormValues = z.infer<typeof availabilityFormSchema>;

export const sessionFormSchema = z
  .object({
    dayOfWeek: dayOfWeekSchema,
    startTime: timeSchema,
    endTime: timeSchema,
    studentIds: z.array(z.string()),
    sessionType: sessionTypeSchema,
    location: z.string().max(120),
    notes: z.string().max(2000),
    countsTowardMinutes: z.boolean(),
  })
  .superRefine((data, ctx) => {
    const [sh, sm] = data.startTime.split(":").map(Number);
    const [eh, em] = data.endTime.split(":").map(Number);
    const start = sh * 60 + sm;
    const end = eh * 60 + em;
    if (!(end > start)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "End time must be after start time.",
        path: ["endTime"],
      });
    }
  });

export type SessionFormValues = z.infer<typeof sessionFormSchema>;
