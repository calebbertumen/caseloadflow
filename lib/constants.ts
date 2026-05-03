import type { DayOfWeek } from "./types";

/** Current workspace blob in localStorage (versioned). */
export const STORAGE_KEY = "caseloadflow_workspace_v1";

/** Previous key; data is migrated on read once. */
export const LEGACY_STORAGE_KEY = "caseloadflow:v1";

/** Last-saved timestamp (ISO) for the workspace blob. */
export const WORKSPACE_META_KEY = "caseloadflow_workspace_meta_v1";

export const CURRENT_SCHEMA_VERSION = 1;

export const WORKSPACE_EXPORT_FILE_VERSION = 1;

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

/** Default grid: 7:00 AM-4:00 PM in 30-minute steps (desktop-first). */
export const DEFAULT_SLOT_START = "07:00";
export const DEFAULT_SLOT_END = "16:00";
export const SLOT_STEP_MINUTES = 30;

export const DEFAULT_SETTINGS = {
  maxGroupSize: 4,
  slpDisplayName: "You",
} as const;

export const SUPPORT_EMAIL = "calebbertumen99@gmail.com";

export const POLICIES_LAST_UPDATED = "May 2, 2026";

/** Policy document version shown on /privacy and /terms. */
export const POLICY_DOCUMENT_VERSION = "1.0";

/**
 * Student IDs used in the built-in sample workspace. Used to detect “official”
 * demo data for analytics and the sample banner (not for security).
 */
export const OFFICIAL_DEMO_STUDENT_ID_LIST = [
  "demo-stu-01",
  "demo-stu-02",
  "demo-stu-03",
  "demo-stu-04",
  "demo-stu-05",
  "demo-stu-06",
  "demo-stu-07",
  "demo-stu-08",
  "demo-stu-09",
  "demo-stu-10",
] as const;

/** Shown wherever users enter student identifiers. */
export const PRIVACY_REMINDER_COPY =
  "Privacy reminder: CaseloadFlow is for scheduling support only. Avoid entering full legal names, diagnoses, IEP documents, therapy notes, medical records, or sensitive student information. Use initials, first names, or nicknames when possible.";

/** Primary local-storage notice (no account, backup hint). */
export const LOCAL_DATA_NOTICE =
  "Your schedule is saved only in this browser. No account required. To keep a backup or move devices, export your workspace file.";

export const LOCAL_DATA_LIMITATION =
  "Clearing browser data or using another device may remove access to this workspace unless you export a backup.";

export const LOCAL_SAVE_BENEFIT =
  "No account needed. Your schedule stays on this browser.";

export function betaListMailto(): string {
  const subject = encodeURIComponent("CaseloadFlow beta list (cloud save)");
  const body = encodeURIComponent(
    "Hi,\n\nPlease keep me posted about optional cloud save / sync for CaseloadFlow.\n\nThanks!"
  );
  return `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
}
