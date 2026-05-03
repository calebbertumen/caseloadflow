"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type WorkspaceNudgeKind =
  | "schedule_useful"
  | "export_followup"
  | "reset_reason";

type Ctx = {
  active: WorkspaceNudgeKind | null;
  dismiss: () => void;
  showScheduleUseful: () => void;
  showExportFollowup: () => void;
  showResetReason: () => void;
};

const WorkspaceNudgeContext = createContext<Ctx | null>(null);

export function WorkspaceNudgeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [active, setActive] = useState<WorkspaceNudgeKind | null>(null);

  const dismiss = useCallback(() => setActive(null), []);

  const showScheduleUseful = useCallback(() => {
    setActive("schedule_useful");
  }, []);

  const showExportFollowup = useCallback(() => {
    setActive("export_followup");
  }, []);

  const showResetReason = useCallback(() => {
    setActive("reset_reason");
  }, []);

  useEffect(() => {
    const onExport = () => setActive("export_followup");
    const onReset = () => setActive("reset_reason");
    window.addEventListener("caseloadflow:backup_exported", onExport);
    window.addEventListener("caseloadflow:workspace_reset_done", onReset);
    return () => {
      window.removeEventListener("caseloadflow:backup_exported", onExport);
      window.removeEventListener("caseloadflow:workspace_reset_done", onReset);
    };
  }, []);

  const value = useMemo(
    () => ({
      active,
      dismiss,
      showScheduleUseful,
      showExportFollowup,
      showResetReason,
    }),
    [active, dismiss, showScheduleUseful, showExportFollowup, showResetReason]
  );

  return (
    <WorkspaceNudgeContext.Provider value={value}>
      {children}
    </WorkspaceNudgeContext.Provider>
  );
}

export function useWorkspaceNudges() {
  const ctx = useContext(WorkspaceNudgeContext);
  if (!ctx) {
    throw new Error("useWorkspaceNudges must be used within WorkspaceNudgeProvider");
  }
  return ctx;
}
