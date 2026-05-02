import type { DayOfWeek } from "./types";

export const STORAGE_KEY = "caseloadflow:v1";

export const CURRENT_SCHEMA_VERSION = 1;

export const DAY_LABELS: Record<DayOfWeek, string> = {
  0: "Monday",
  1: "Tuesday",
  2: "Wednesday",
  3: "Thursday",
  4: "Friday",
};

export const DAY_SHORT: Record<DayOfWeek, string> = {
  0: "Mon",
  1: "Tue",
  2: "Wed",
  3: "Thu",
  4: "Fri",
};

/** Default grid: 7:00 AM – 4:00 PM in 30-minute steps (desktop-first). */
export const DEFAULT_SLOT_START = "07:00";
export const DEFAULT_SLOT_END = "16:00";
export const SLOT_STEP_MINUTES = 30;

export const DEFAULT_SETTINGS = {
  maxGroupSize: 4,
  slpDisplayName: "You",
} as const;
