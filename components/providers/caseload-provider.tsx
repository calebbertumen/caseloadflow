"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { demoAppState, emptyAppState } from "@/lib/mock-data";
import { newId } from "@/lib/id";
import { loadAppState, saveAppState } from "@/lib/storage";
import type {
  AppState,
  AvailabilityBlock,
  Session,
  Student,
} from "@/lib/types";

type CaseloadContextValue = {
  state: AppState;
  hydrated: boolean;
  setState: (next: AppState | ((prev: AppState) => AppState)) => void;
  resetDemo: () => void;
  resetEmpty: () => void;
  setOnboardingCompleted: (done: boolean) => void;
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

function persist(next: AppState) {
  saveAppState(next);
}

export function CaseloadProvider({ children }: { children: React.ReactNode }) {
  const [state, setStateInternal] = useState<AppState>(emptyAppState);
  const [hydrated, setHydrated] = useState(false);

  useLayoutEffect(() => {
    // Hydrate from localStorage after mount (SSR-safe). Intentional one-time sync.
    queueMicrotask(() => {
      setStateInternal(loadAppState());
      setHydrated(true);
    });
  }, []);

  const setState = useCallback(
    (next: AppState | ((prev: AppState) => AppState)) => {
      setStateInternal((prev) => {
        const resolved = typeof next === "function" ? next(prev) : next;
        persist(resolved);
        return resolved;
      });
    },
    []
  );

  const resetDemo = useCallback(() => {
    const next = structuredClone(demoAppState);
    setStateInternal(next);
    persist(next);
  }, []);

  const resetEmpty = useCallback(() => {
    const next = { ...emptyAppState };
    setStateInternal(next);
    persist(next);
  }, []);

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
      setState((prev) => ({
        ...prev,
        students: [...prev.students, student],
      }));
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
      setState((prev) => ({
        ...prev,
        availabilityBlocks: [...prev.availabilityBlocks, block],
      }));
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
      setState((prev) => ({
        ...prev,
        sessions: [...prev.sessions, session],
      }));
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
      setState,
      resetDemo,
      resetEmpty,
      setOnboardingCompleted,
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
      setState,
      resetDemo,
      resetEmpty,
      setOnboardingCompleted,
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
