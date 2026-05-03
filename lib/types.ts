/** Core domain types, structured for a future Supabase/Postgres migration. */

export type DayOfWeek = 0 | 1 | 2 | 3 | 4; // Monday-Friday

export type SessionType = "individual" | "group" | "flexible";

export type StudentScheduleStatus =
  | "scheduled"
  | "partially_scheduled"
  | "unscheduled";

export type AvailabilityAppliesTo = "student" | "teacher" | "slp" | "global";

export type AvailabilityBlockType =
  | "lunch"
  | "recess"
  | "specials"
  | "testing"
  | "classroom_unavailable"
  | "student_unavailable"
  | "slp_unavailable"
  | "other";

export interface Student {
  id: string;
  name: string;
  grade: string;
  teacher: string;
  requiredMinutesPerWeek: number;
  preferredSessionLength: number;
  sessionType: SessionType;
  unavailableBlockIds: string[];
  notes: string;
  color: string;
}

export interface AvailabilityBlock {
  id: string;
  label: string;
  type: AvailabilityBlockType;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  appliesTo: AvailabilityAppliesTo;
  studentIds?: string[];
  notes?: string;
}

export interface Session {
  id: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  studentIds: string[];
  sessionType: SessionType;
  location?: string;
  notes?: string;
  countsTowardMinutes: boolean;
}

export type ConflictSeverity = "error" | "warning" | "info";

export type ConflictType =
  | "student_unavailable"
  | "student_double_booked"
  | "group_size"
  | "under_scheduled_minutes"
  | "session_no_students"
  | "session_overlap"
  | "unscheduled_student";

export interface Conflict {
  id: string;
  type: ConflictType;
  severity: ConflictSeverity;
  message: string;
  affectedStudentIds: string[];
  affectedSessionIds: string[];
  suggestedFix?: string;
}

export interface AppSettings {
  maxGroupSize: number;
  slpDisplayName: string;
}

export interface AppState {
  schemaVersion: number;
  onboardingCompleted: boolean;
  students: Student[];
  availabilityBlocks: AvailabilityBlock[];
  sessions: Session[];
  settings: AppSettings;
}

/** All user-editable workspace fields persisted locally (conflicts are derived). */
export type WorkspaceData = AppState;

/** JSON file shape for backup export / import. */
export interface WorkspaceExportDocument {
  caseloadflowWorkspaceFile: number;
  exportedAt: string;
  workspace: WorkspaceData;
}

export type MinuteStatus = "complete" | "partial" | "missing";

export interface StudentMinuteSummary {
  studentId: string;
  required: number;
  scheduled: number;
  remaining: number;
  status: MinuteStatus;
  scheduleStatus: StudentScheduleStatus;
}
