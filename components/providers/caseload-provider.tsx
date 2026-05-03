"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { demoAppState, emptyAppState } from "@/lib/mock-data";
import { newId } from "@/lib/id";
import {
  buildSafeAnalyticsContext,
  trackEvent,
} from "@/lib/analytics";
import {
  buildWorkspaceExportJson,
  loadAppState,
  loadWorkspaceMeta,
  parseWorkspaceImportJson,
  saveAppState,
  suggestedBackupFilename,
} from "@/lib/storage";
import type {
  AppState,
  AvailabilityBlock,
  Session,
  Student,
} from "@/lib/types";

const DEBOUNCE_MS = 480;

export type PersistStatus = "saved" | "unsaved" | "saving";

type CaseloadContextValue = {
  state: AppState;
  hydrated: boolean;
  persistStatus: PersistStatus;
  lastSavedAtMs: number | null;
  setState: (next: AppState | ((prev: AppState) => AppState)) => void;
  resetDemo: () => void;
  resetEmpty: () => void;
  resetWorkspace: () => void;
  setOnboardingCompleted: (done: boolean) => void;
  exportWorkspaceBackup: () => void;
  importWorkspaceFromJson: (
    text: string
  ) => { ok: true } | { ok: false; error: string };
  addStudent: (input: Omit<Student, "id" | "unavailableBlockIds">) => Student;
  updateStudent: (id: string, patch: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  addAvailabilityBlock: (
    input: Omit<AvailabilityBlock, "id">
  ) => AvailabilityBlock;
  updateAvailabilityBlock: (
    id: string,
    patch: Partial<AvailabilityBlock>
  ) => void;
  deleteAvailabilityBlock: (id: string) => void;
  addSession: (input: Omit<Session, "id">) => Session;
  updateSession: (id: string, patch: Partial<Session>) => void;
  deleteSession: (id: string) => void;
  updateSettings: (patch: Partial<AppState["settings"]>) => void;
};

const CaseloadContext = createContext<CaseloadContextValue | null>(null);

export function CaseloadProvider({ children }: { children: React.ReactNode }) {
  const [state, setStateInternal] = useState<AppState>(emptyAppState);
  const [hydrated, setHydrated] = useState(false);
  const [persistStatus, setPersistStatus] = useState<PersistStatus>("saved");
  const [lastSavedAtMs, setLastSavedAtMs] = useState<number | null>(null);

  const hydratedRef = useRef(false);
  const stateRef = useRef<AppState>(emptyAppState);
  const persistTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useLayoutEffect(() => {
    stateRef.current = state;
  }, [state]);

  const clearPersistTimer = useCallback(() => {
    if (persistTimerRef.current) {
      clearTimeout(persistTimerRef.current);
      persistTimerRef.current = null;
    }
  }, []);

  const flushSave = useCallback((snapshot: AppState) => {
    saveAppState(snapshot);
    const t = Date.now();
    setLastSavedAtMs(t);
    setPersistStatus("saved");
  }, []);

  const queuePersist = useCallback(() => {
    if (!hydratedRef.current) return;
    setPersistStatus((s) => (s === "saving" ? s : "unsaved"));
    clearPersistTimer();
    persistTimerRef.current = setTimeout(() => {
      persistTimerRef.current = null;
      setPersistStatus("saving");
      flushSave(stateRef.current);
    }, DEBOUNCE_MS);
  }, [clearPersistTimer, flushSave]);

  useLayoutEffect(() => {
    queueMicrotask(() => {
      const loaded = loadAppState();
      stateRef.current = loaded;
      setStateInternal(loaded);
      const meta = loadWorkspaceMeta();
      setLastSavedAtMs(
        meta?.lastSavedAt ? new Date(meta.lastSavedAt).getTime() : null
      );
      hydratedRef.current = true;
      setHydrated(true);
      setPersistStatus("saved");
    });
  }, []);

  const setState = useCallback(
    (next: AppState | ((prev: AppState) => AppState)) => {
      setStateInternal((prev) => {
        const resolved = typeof next === "function" ? next(prev) : next;
        stateRef.current = resolved;
        if (hydratedRef.current) {
          queuePersist();
        }
        return resolved;
      });
    },
    [queuePersist]
  );

  const resetDemo = useCallback(() => {
    clearPersistTimer();
    const next = structuredClone(demoAppState);
    stateRef.current = next;
    setStateInternal(next);
    flushSave(next);
    queueMicrotask(() => {
      trackEvent("demo_loaded", buildSafeAnalyticsContext(next));
    });
  }, [clearPersistTimer, flushSave]);

  const resetEmpty = useCallback(() => {
    clearPersistTimer();
    const next = {
      ...emptyAppState,
      onboardingCompleted: stateRef.current.onboardingCompleted,
    };
    stateRef.current = next;
    setStateInternal(next);
    flushSave(next);
  }, [clearPersistTimer, flushSave]);

  const exportWorkspaceBackup = useCallback(() => {
    const snap = stateRef.current;
    const json = buildWorkspaceExportJson(snap);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = suggestedBackupFilename();
    a.click();
    URL.revokeObjectURL(url);
    queueMicrotask(() => {
      trackEvent("workspace_exported", buildSafeAnalyticsContext(snap));
      window.dispatchEvent(new Event("caseloadflow:backup_exported"));
    });
  }, []);

  const importWorkspaceFromJson = useCallback(
    (text: string): { ok: true } | { ok: false; error: string } => {
      const { state: next, error } = parseWorkspaceImportJson(text);
      if (!next || error) {
        return { ok: false, error: error ?? "Could not read that backup file." };
      }
      clearPersistTimer();
      stateRef.current = next;
      setStateInternal(next);
      flushSave(next);
      queueMicrotask(() => {
        trackEvent("workspace_imported", buildSafeAnalyticsContext(next));
      });
      return { ok: true };
    },
    [clearPersistTimer, flushSave]
  );

  const setOnboardingCompleted = useCallback(
    (done: boolean) => {
      setState((prev) => ({ ...prev, onboardingCompleted: done }));
    },
    [setState]
  );

  const addStudent = useCallback(
    (input: Omit<Student, "id" | "unavailableBlockIds">) => {
      const student: Student = {
        ...input,
        id: newId("stu"),
        unavailableBlockIds: [],
      };
      setState((prev) => {
        const next = {
          ...prev,
          students: [...prev.students, student],
        };
        queueMicrotask(() => {
          trackEvent("student_created", buildSafeAnalyticsContext(next));
        });
        return next;
      });
      return student;
    },
    [setState]
  );

  const updateStudent = useCallback(
    (id: string, patch: Partial<Student>) => {
      setState((prev) => ({
        ...prev,
        students: prev.students.map((s) =>
          s.id === id ? { ...s, ...patch } : s
        ),
      }));
    },
    [setState]
  );

  const deleteStudent = useCallback(
    (id: string) => {
      setState((prev) => ({
        ...prev,
        students: prev.students.filter((s) => s.id !== id),
        sessions: prev.sessions.map((s) => ({
          ...s,
          studentIds: s.studentIds.filter((sid) => sid !== id),
        })),
        availabilityBlocks: prev.availabilityBlocks.map((b) => ({
          ...b,
          studentIds: b.studentIds?.filter((sid) => sid !== id),
        })),
      }));
    },
    [setState]
  );

  const addAvailabilityBlock = useCallback(
    (input: Omit<AvailabilityBlock, "id">) => {
      const block: AvailabilityBlock = { ...input, id: newId("blk") };
      setState((prev) => {
        const next = {
          ...prev,
          availabilityBlocks: [...prev.availabilityBlocks, block],
        };
        queueMicrotask(() => {
          trackEvent(
            "availability_block_created",
            buildSafeAnalyticsContext(next)
          );
        });
        return next;
      });
      return block;
    },
    [setState]
  );

  const updateAvailabilityBlock = useCallback(
    (id: string, patch: Partial<AvailabilityBlock>) => {
      setState((prev) => ({
        ...prev,
        availabilityBlocks: prev.availabilityBlocks.map((b) =>
          b.id === id ? { ...b, ...patch } : b
        ),
      }));
    },
    [setState]
  );

  const deleteAvailabilityBlock = useCallback(
    (id: string) => {
      setState((prev) => ({
        ...prev,
        availabilityBlocks: prev.availabilityBlocks.filter((b) => b.id !== id),
        students: prev.students.map((s) => ({
          ...s,
          unavailableBlockIds: s.unavailableBlockIds.filter((bid) => bid !== id),
        })),
      }));
    },
    [setState]
  );

  const addSession = useCallback(
    (input: Omit<Session, "id">) => {
      const session: Session = { ...input, id: newId("ses") };
      setState((prev) => {
        const next = {
          ...prev,
          sessions: [...prev.sessions, session],
        };
        queueMicrotask(() => {
          trackEvent("session_created", buildSafeAnalyticsContext(next));
        });
        return next;
      });
      return session;
    },
    [setState]
  );

  const updateSession = useCallback(
    (id: string, patch: Partial<Session>) => {
      setState((prev) => ({
        ...prev,
        sessions: prev.sessions.map((s) =>
          s.id === id ? { ...s, ...patch } : s
        ),
      }));
    },
    [setState]
  );

  const deleteSession = useCallback(
    (id: string) => {
      setState((prev) => ({
        ...prev,
        sessions: prev.sessions.filter((s) => s.id !== id),
      }));
    },
    [setState]
  );

  const updateSettings = useCallback(
    (patch: Partial<AppState["settings"]>) => {
      setState((prev) => ({
        ...prev,
        settings: { ...prev.settings, ...patch },
      }));
    },
    [setState]
  );

  const value = useMemo(
    () => ({
      state,
      hydrated,
      persistStatus,
      lastSavedAtMs,
      setState,
      resetDemo,
      resetEmpty,
      resetWorkspace: resetEmpty,
      setOnboardingCompleted,
      exportWorkspaceBackup,
      importWorkspaceFromJson,
      addStudent,
      updateStudent,
      deleteStudent,
      addAvailabilityBlock,
      updateAvailabilityBlock,
      deleteAvailabilityBlock,
      addSession,
      updateSession,
      deleteSession,
      updateSettings,
    }),
    [
      state,
      hydrated,
      persistStatus,
      lastSavedAtMs,
      setState,
      resetDemo,
      resetEmpty,
      setOnboardingCompleted,
      exportWorkspaceBackup,
      importWorkspaceFromJson,
      addStudent,
      updateStudent,
      deleteStudent,
      addAvailabilityBlock,
      updateAvailabilityBlock,
      deleteAvailabilityBlock,
      addSession,
      updateSession,
      deleteSession,
      updateSettings,
    ]
  );

  return (
    <CaseloadContext.Provider value={value}>{children}</CaseloadContext.Provider>
  );
}

export function useCaseload() {
  const ctx = useContext(CaseloadContext);
  if (!ctx) {
    throw new Error("useCaseload must be used within CaseloadProvider");
  }
  return ctx;
}
