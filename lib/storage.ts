import {
  CURRENT_SCHEMA_VERSION,
  LEGACY_STORAGE_KEY,
  STORAGE_KEY,
  WORKSPACE_EXPORT_FILE_VERSION,
  WORKSPACE_META_KEY,
} from "./constants";
import { demoAppState, emptyAppState } from "./mock-data";
import type { AppState, WorkspaceExportDocument } from "./types";

type PartialPersisted = Partial<AppState> & Record<string, unknown>;

export interface WorkspaceMeta {
  lastSavedAt: string;
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

export function normalizePersistedState(raw: unknown): AppState {
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

function migrateLegacyIfNeeded(): void {
  if (typeof window === "undefined") return;
  try {
    const next = window.localStorage.getItem(STORAGE_KEY);
    if (next) return;
    const legacy = window.localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!legacy) return;
    const state = normalizePersistedState(JSON.parse(legacy) as unknown);
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...state, schemaVersion: CURRENT_SCHEMA_VERSION })
    );
    window.localStorage.removeItem(LEGACY_STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function loadAppState(): AppState {
  if (typeof window === "undefined") return { ...emptyAppState };
  try {
    migrateLegacyIfNeeded();
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...emptyAppState };
    return normalizePersistedState(JSON.parse(raw) as unknown);
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
    const meta: WorkspaceMeta = { lastSavedAt: new Date().toISOString() };
    window.localStorage.setItem(WORKSPACE_META_KEY, JSON.stringify(meta));
  } catch {
    // ignore quota / private mode
  }
}

export function loadWorkspaceMeta(): WorkspaceMeta | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(WORKSPACE_META_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as unknown;
    if (!isRecord(p) || typeof p.lastSavedAt !== "string") return null;
    return { lastSavedAt: p.lastSavedAt };
  } catch {
    return null;
  }
}

export function buildWorkspaceExportJson(state: AppState): string {
  const doc: WorkspaceExportDocument = {
    caseloadflowWorkspaceFile: WORKSPACE_EXPORT_FILE_VERSION,
    exportedAt: new Date().toISOString(),
    workspace: {
      ...state,
      schemaVersion: CURRENT_SCHEMA_VERSION,
    },
  };
  return JSON.stringify(doc, null, 2);
}

/**
 * Parse a backup file or raw workspace JSON. Returns null if invalid (caller shows error).
 */
export function parseWorkspaceImportJson(text: string): {
  state: AppState | null;
  error: string | null;
} {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return {
      state: null,
      error: "That file is not valid JSON. Choose another file or export a new backup.",
    };
  }

  if (!isRecord(parsed)) {
    return { state: null, error: "This file does not contain a workspace object." };
  }

  let inner: unknown = parsed;

  if (
    typeof parsed.caseloadflowWorkspaceFile === "number" &&
    isRecord(parsed.workspace)
  ) {
    inner = parsed.workspace;
  }

  if (!isRecord(inner)) {
    return { state: null, error: "This does not look like a CaseloadFlow backup." };
  }

  if (!Array.isArray(inner.students) || !Array.isArray(inner.sessions)) {
    return {
      state: null,
      error: "Backup is missing students or sessions arrays. It may be damaged or from another app.",
    };
  }

  const state = normalizePersistedState(inner);
  return { state, error: null };
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

export function suggestedBackupFilename(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `caseloadflow-workspace-${y}-${m}-${day}.json`;
}
