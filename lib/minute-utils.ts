import type {
  AppState,
  Session,
  Student,
  StudentMinuteSummary,
  StudentScheduleStatus,
} from "./types";
import { sessionDurationMinutes } from "./schedule-utils";

export function scheduledMinutesForStudent(
  sessions: Session[],
  studentId: string
): number {
  let total = 0;
  for (const s of sessions) {
    if (!s.countsTowardMinutes) continue;
    if (!s.studentIds.includes(studentId)) continue;
    total += sessionDurationMinutes(s);
  }
  return total;
}

export function minuteStatus(
  required: number,
  scheduled: number
): StudentMinuteSummary["status"] {
  if (required <= 0) return "complete";
  if (scheduled >= required) return "complete";
  if (scheduled > 0) return "partial";
  return "missing";
}

export function scheduleStatusFromMinutes(
  required: number,
  scheduled: number
): StudentScheduleStatus {
  if (required <= 0) return "scheduled";
  if (scheduled >= required) return "scheduled";
  if (scheduled > 0) return "partially_scheduled";
  return "unscheduled";
}

export function summarizeStudentMinutes(
  student: Student,
  sessions: Session[]
): StudentMinuteSummary {
  const required = student.requiredMinutesPerWeek;
  const scheduled = scheduledMinutesForStudent(sessions, student.id);
  const remaining = Math.max(0, required - scheduled);
  const status = minuteStatus(required, scheduled);
  const scheduleStatus = scheduleStatusFromMinutes(required, scheduled);
  return {
    studentId: student.id,
    required,
    scheduled,
    remaining,
    status,
    scheduleStatus,
  };
}

export function allStudentMinuteSummaries(
  state: Pick<AppState, "students" | "sessions">
): StudentMinuteSummary[] {
  return state.students.map((s) => summarizeStudentMinutes(s, state.sessions));
}

export function aggregateRequiredMinutes(students: Student[]): number {
  return students.reduce((acc, s) => acc + s.requiredMinutesPerWeek, 0);
}

/** Sum of remaining IEP minutes across students (not double-counting overlap). */
export function aggregateRemainingMinutes(
  students: Student[],
  sessions: Session[]
): number {
  return allStudentMinuteSummaries({ students, sessions }).reduce(
    (acc, row) => acc + row.remaining,
    0
  );
}

/** Sum of per-student scheduled minutes (group time counts for each student). */
export function totalScheduledStudentMinutes(
  students: Student[],
  sessions: Session[]
): number {
  return students.reduce(
    (acc, s) => acc + scheduledMinutesForStudent(sessions, s.id),
    0
  );
}
