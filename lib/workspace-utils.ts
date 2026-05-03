import { OFFICIAL_DEMO_STUDENT_ID_LIST } from "./constants";
import type { AppState } from "./types";

const OFFICIAL_DEMO_STUDENT_IDS = new Set<string>(OFFICIAL_DEMO_STUDENT_ID_LIST);

export function workspaceHasContent(state: AppState): boolean {
  return (
    state.students.length > 0 ||
    state.sessions.length > 0 ||
    state.availabilityBlocks.length > 0
  );
}

/** True when the workspace matches the shipped sample caseload (fictional data). */
export function isOfficialDemoWorkspace(state: AppState): boolean {
  if (state.students.length !== OFFICIAL_DEMO_STUDENT_IDS.size) return false;
  return state.students.every((s) => OFFICIAL_DEMO_STUDENT_IDS.has(s.id));
}
