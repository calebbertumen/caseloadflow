import type {
  AppState,
  AvailabilityBlock,
  Conflict,
  Session,
  Student,
} from "./types";
import {
  intervalsOverlap,
  parseTimeToMinutes,
  sessionsOverlap,
} from "./schedule-utils";
import { scheduledMinutesForStudent } from "./minute-utils";

function stableId(parts: string[]): string {
  return parts.join(":");
}

function sessionOverlapsBlock(
  session: Session,
  block: AvailabilityBlock
): boolean {
  if (session.dayOfWeek !== block.dayOfWeek) return false;
  const s0 = parseTimeToMinutes(session.startTime);
  const s1 = parseTimeToMinutes(session.endTime);
  const b0 = parseTimeToMinutes(block.startTime);
  const b1 = parseTimeToMinutes(block.endTime);
  return intervalsOverlap(s0, s1, b0, b1);
}

function sessionViolatesBlockForStudent(
  session: Session,
  block: AvailabilityBlock,
  student: Student
): boolean {
  if (!sessionOverlapsBlock(session, block)) return false;
  if (student.unavailableBlockIds.includes(block.id)) return true;
  if (block.appliesTo === "global") return true;
  if (block.appliesTo === "slp") return true;
  if (block.appliesTo === "student") {
    return block.studentIds?.includes(student.id) ?? false;
  }
  return false;
}

/**
 * Pure conflict detection for client-side MVP.
 * Structured so an auto-scheduler can reuse the same checks later.
 */
export function detectConflicts(state: AppState): Conflict[] {
  const conflicts: Conflict[] = [];
  const { students, sessions, availabilityBlocks, settings } = state;
  const maxGroup = settings.maxGroupSize;

  for (const session of sessions) {
    if (session.studentIds.length === 0) {
      conflicts.push({
        id: stableId(["session_no_students", session.id]),
        type: "session_no_students",
        severity: "warning",
        message: "A session has no students assigned.",
        affectedStudentIds: [],
        affectedSessionIds: [session.id],
        suggestedFix: "Assign at least one student or remove the empty session.",
      });
    }

    if (session.sessionType === "group" && session.studentIds.length > maxGroup) {
      conflicts.push({
        id: stableId(["group_size", session.id]),
        type: "group_size",
        severity: "warning",
        message: `Group session has more students than your preferred maximum (${maxGroup}).`,
        affectedStudentIds: session.studentIds,
        affectedSessionIds: [session.id],
        suggestedFix: "Split into two groups or adjust your max group size in Settings.",
      });
    }
  }

  for (let i = 0; i < sessions.length; i++) {
    for (let j = i + 1; j < sessions.length; j++) {
      const a = sessions[i];
      const b = sessions[j];
      if (sessionsOverlap(a, b)) {
        conflicts.push({
          id: stableId(["overlap", a.id, b.id]),
          type: "session_overlap",
          severity: "error",
          message: "Two sessions overlap on the same day.",
          affectedStudentIds: [...new Set([...a.studentIds, ...b.studentIds])],
          affectedSessionIds: [a.id, b.id],
          suggestedFix: "Move one session to a different time or shorten durations.",
        });
      }
    }
  }

  for (const student of students) {
    const dayToSessions = new Map<number, Session[]>();
    for (const s of sessions) {
      if (!s.studentIds.includes(student.id)) continue;
      const list = dayToSessions.get(s.dayOfWeek) ?? [];
      list.push(s);
      dayToSessions.set(s.dayOfWeek, list);
    }
    for (const [, daySessions] of dayToSessions) {
      const sorted = [...daySessions].sort(
        (x, y) =>
          parseTimeToMinutes(x.startTime) - parseTimeToMinutes(y.startTime)
      );
      for (let i = 0; i < sorted.length - 1; i++) {
        const a = sorted[i];
        const b = sorted[i + 1];
        if (sessionsOverlap(a, b)) {
          conflicts.push({
            id: stableId(["double", student.id, a.id, b.id]),
            type: "student_double_booked",
            severity: "error",
            message: `${student.name} is double-booked.`,
            affectedStudentIds: [student.id],
            affectedSessionIds: [a.id, b.id],
            suggestedFix: "Move one session so times do not overlap.",
          });
        }
      }
    }
  }

  for (const session of sessions) {
    for (const block of availabilityBlocks) {
      if (!sessionOverlapsBlock(session, block)) continue;

      if (block.appliesTo === "global" || block.appliesTo === "slp") {
        if (session.studentIds.length === 0) continue;
        conflicts.push({
          id: stableId(["unavail_block", session.id, block.id]),
          type: "student_unavailable",
          severity: "error",
          message:
            block.appliesTo === "slp"
              ? `Session overlaps SLP unavailable time: “${block.label}”.`
              : `Session overlaps a school-wide block: “${block.label}”.`,
          affectedStudentIds: [...session.studentIds],
          affectedSessionIds: [session.id],
          suggestedFix: "Move the session outside that unavailable window.",
        });
        continue;
      }

      for (const studentId of session.studentIds) {
        const student = students.find((s) => s.id === studentId);
        if (!student) continue;
        if (!sessionViolatesBlockForStudent(session, block, student)) continue;
        conflicts.push({
          id: stableId(["unavail", session.id, student.id, block.id]),
          type: "student_unavailable",
          severity: "error",
          message: `${student.name} overlaps “${block.label}”.`,
          affectedStudentIds: [student.id],
          affectedSessionIds: [session.id],
          suggestedFix: "Move the session outside that unavailable window.",
        });
      }
    }
  }

  for (const student of students) {
    const sched = scheduledMinutesForStudent(sessions, student.id);
    if (student.requiredMinutesPerWeek > 0 && sched < student.requiredMinutesPerWeek) {
      conflicts.push({
        id: stableId(["under", student.id]),
        type: "under_scheduled_minutes",
        severity: sched === 0 ? "error" : "warning",
        message: `${student.name} is short on weekly therapy minutes.`,
        affectedStudentIds: [student.id],
        affectedSessionIds: sessions
          .filter((s) => s.studentIds.includes(student.id))
          .map((s) => s.id),
        suggestedFix: "Add or extend sessions that count toward IEP minutes.",
      });
    }
  }

  for (const student of students) {
    const hasSession = sessions.some((s) => s.studentIds.includes(student.id));
    if (!hasSession && student.requiredMinutesPerWeek > 0) {
      conflicts.push({
        id: stableId(["unsched", student.id]),
        type: "unscheduled_student",
        severity: "warning",
        message: `${student.name} has no sessions on the weekly schedule yet.`,
        affectedStudentIds: [student.id],
        affectedSessionIds: [],
        suggestedFix: "Add at least one weekly session for this student.",
      });
    }
  }

  const dedup = new Map<string, Conflict>();
  for (const c of conflicts) {
    dedup.set(c.id, c);
  }
  return [...dedup.values()];
}

export function conflictCounts(conflicts: Conflict[]): {
  errors: number;
  warnings: number;
} {
  return {
    errors: conflicts.filter((c) => c.severity === "error").length,
    warnings: conflicts.filter((c) => c.severity === "warning").length,
  };
}
