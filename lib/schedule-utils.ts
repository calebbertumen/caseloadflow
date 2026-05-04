import type { DayOfWeek, Session } from "./types";

/** Minutes from midnight for "HH:MM" (24h). */
export function parseTimeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function minutesToTime(total: number): string {
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function sessionDurationMinutes(session: Session): number {
  return Math.max(
    0,
    parseTimeToMinutes(session.endTime) - parseTimeToMinutes(session.startTime)
  );
}

/**
 * Whether a session's start time falls in [slotStart, slotStart + stepMinutes).
 * Used so the grid row for e.g. 09:00 shows 09:15 starts when the grid step is 30m.
 */
export function sessionStartFallsInSlot(
  sessionStartTime: string,
  slotStartTime: string,
  stepMinutes: number
): boolean {
  const s = parseTimeToMinutes(sessionStartTime);
  const a = parseTimeToMinutes(slotStartTime);
  return s >= a && s < a + stepMinutes;
}

export function intervalsOverlap(
  aStart: number,
  aEnd: number,
  bStart: number,
  bEnd: number
): boolean {
  return aStart < bEnd && bStart < aEnd;
}

export function sessionsOverlap(a: Session, b: Session): boolean {
  if (a.dayOfWeek !== b.dayOfWeek) return false;
  const a0 = parseTimeToMinutes(a.startTime);
  const a1 = parseTimeToMinutes(a.endTime);
  const b0 = parseTimeToMinutes(b.startTime);
  const b1 = parseTimeToMinutes(b.endTime);
  return intervalsOverlap(a0, a1, b0, b1);
}

/** Slot helpers for the weekly grid (manual builder, future auto-scheduler hooks). */
export function generateTimeSlots(
  start = "07:00",
  end = "16:00",
  stepMinutes = 30
): string[] {
  const out: string[] = [];
  let cur = parseTimeToMinutes(start);
  const last = parseTimeToMinutes(end);
  while (cur < last) {
    out.push(minutesToTime(cur));
    cur += stepMinutes;
  }
  return out;
}

export function sessionCoversSlot(
  session: Session,
  day: DayOfWeek,
  slotStart: string,
  slotStepMinutes: number
): boolean {
  if (session.dayOfWeek !== day) return false;
  const s0 = parseTimeToMinutes(session.startTime);
  const s1 = parseTimeToMinutes(session.endTime);
  const t0 = parseTimeToMinutes(slotStart);
  const t1 = t0 + slotStepMinutes;
  return intervalsOverlap(s0, s1, t0, t1);
}
