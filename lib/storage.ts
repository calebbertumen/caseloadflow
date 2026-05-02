import { CURRENT_SCHEMA_VERSION, STORAGE_KEY } from "./constants";
import { demoAppState, emptyAppState } from "./mock-data";
import type { AppState } from "./types";

type PartialPersisted = Partial<AppState> & Record<string, unknown>;

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function migrate(raw: unknown): AppState {
  if (!isRecord(raw)) return { ...emptyAppState };
  const r = raw as PartialPersisted;
  return {
    ...emptyAppState,
    schemaVersion: CURRENT_SCHEMA_VERSION,
    onboardingCompleted: Boolean(r.onboardingCompleted),
    students: Array.isArray(r.students) ? r.students : [],
    availabilityBlocks: Array.isArray(r.availabilityBlocks)
      ? r.availabilityBlocks
      : [],
    sessions: Array.isArray(r.sessions) ? r.sessions : [],
    settings: isRecord(r.settings)
      ? { ...emptyAppState.settings, ...r.settings }
      : emptyAppState.settings,
  };
}

export function loadAppState(): AppState {
  if (typeof window === "undefined") return { ...emptyAppState };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...emptyAppState };
    return migrate(JSON.parse(raw) as unknown);
  } catch {
    return { ...emptyAppState };
  }
}

export function saveAppState(state: AppState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...state, schemaVersion: CURRENT_SCHEMA_VERSION })
    );
  } catch {
    // ignore quota / private mode
  }
}

export function resetToDemo(): AppState {
  const next = structuredClone(demoAppState);
  saveAppState(next);
  return next;
}

export function resetToEmpty(): AppState {
  const next = { ...emptyAppState };
  saveAppState(next);
  return next;
}
