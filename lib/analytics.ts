import { detectConflicts } from "@/lib/conflict-utils";
import { sessionDurationMinutes } from "@/lib/schedule-utils";
import type { AppState } from "@/lib/types";
import { isOfficialDemoWorkspace, workspaceHasContent } from "@/lib/workspace-utils";

/** Allowed PostHog event names (no PII in payloads). */
export const ANALYTICS_EVENT_NAMES = [
  "landing_viewed",
  "cta_start_free_clicked",
  "cta_view_demo_clicked",
  "cta_open_workspace_clicked",
  "demo_loaded",
  "blank_workspace_started",
  "student_created",
  "availability_block_created",
  "session_created",
  "conflict_panel_viewed",
  "schedule_printed",
  "workspace_exported",
  "workspace_imported",
  "workspace_reset",
  "feedback_opened",
  "feedback_submitted",
  "beta_interest_clicked",
] as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENT_NAMES)[number];

export type AnalyticsSource =
  | "landing"
  | "onboarding"
  | "dashboard"
  | "students"
  | "availability"
  | "schedule"
  | "conflicts"
  | "export"
  | "settings";

export type StudentCountRange = "0" | "1-10" | "11-30" | "31-60" | "60+";

export type ConflictCountRange = "0" | "1-3" | "4-10" | "10+";

export type ScheduledMinutesRange = "0" | "1-300" | "301-900" | "901+";

/** Only these keys are ever sent to analytics (defense in depth). */
export type SafeAnalyticsProperties = {
  source?: AnalyticsSource;
  workspace_type?: "sample" | "blank";
  student_count_range?: StudentCountRange;
  conflict_count_range?: ConflictCountRange;
  scheduled_minutes_range?: ScheduledMinutesRange;
  has_local_workspace?: boolean;
};

const SAFE_KEYS = new Set<string>([
  "source",
  "workspace_type",
  "student_count_range",
  "conflict_count_range",
  "scheduled_minutes_range",
  "has_local_workspace",
]);

let pathnameForSource = "/";

export function setAnalyticsPathname(path: string) {
  pathnameForSource = path || "/";
}

export function resolveAnalyticsSourceFromPath(
  path: string
): AnalyticsSource {
  const p = path.split("?")[0] || "/";
  if (p === "/" || p === "") return "landing";
  if (p.startsWith("/onboarding")) return "onboarding";
  if (p.startsWith("/demo")) return "landing";
  if (p.startsWith("/dashboard")) return "dashboard";
  if (p.startsWith("/students")) return "students";
  if (p.startsWith("/availability")) return "availability";
  if (p.startsWith("/schedule")) return "schedule";
  if (p.startsWith("/conflicts")) return "conflicts";
  if (p.startsWith("/settings")) return "settings";
  if (p.startsWith("/export")) return "export";
  return "dashboard";
}

export function resolveAnalyticsSource(): AnalyticsSource {
  return resolveAnalyticsSourceFromPath(pathnameForSource);
}

export function inferWorkspaceType(state: AppState): "sample" | "blank" {
  return isOfficialDemoWorkspace(state) ? "sample" : "blank";
}

export function bucketStudentCount(n: number): StudentCountRange {
  if (n <= 0) return "0";
  if (n <= 10) return "1-10";
  if (n <= 30) return "11-30";
  if (n <= 60) return "31-60";
  return "60+";
}

export function bucketConflictCount(n: number): ConflictCountRange {
  if (n <= 0) return "0";
  if (n <= 3) return "1-3";
  if (n <= 10) return "4-10";
  return "10+";
}

export function bucketScheduledMinutes(total: number): ScheduledMinutesRange {
  if (total <= 0) return "0";
  if (total <= 300) return "1-300";
  if (total <= 900) return "301-900";
  return "901+";
}

export function totalCountedScheduleMinutes(state: AppState): number {
  let t = 0;
  for (const s of state.sessions) {
    if (!s.countsTowardMinutes) continue;
    t += sessionDurationMinutes(s);
  }
  return t;
}

export function buildSafeAnalyticsContext(
  state: AppState,
  overrides?: Partial<SafeAnalyticsProperties>
): SafeAnalyticsProperties {
  const conflictCount = detectConflicts(state).length;
  const minutes = totalCountedScheduleMinutes(state);
  const n = state.students.length;
  return {
    source: overrides?.source ?? resolveAnalyticsSource(),
    workspace_type: inferWorkspaceType(state),
    student_count_range: bucketStudentCount(n),
    conflict_count_range: bucketConflictCount(conflictCount),
    scheduled_minutes_range: bucketScheduledMinutes(minutes),
    has_local_workspace: workspaceHasContent(state),
    ...overrides,
  };
}

function sanitizeProps(
  properties?: SafeAnalyticsProperties
): Record<string, string | boolean> | undefined {
  if (!properties) return undefined;
  const out: Record<string, string | boolean> = {};
  for (const [k, v] of Object.entries(properties)) {
    if (!SAFE_KEYS.has(k)) continue;
    if (v === undefined) continue;
    if (typeof v === "boolean") {
      out[k] = v;
      continue;
    }
    if (typeof v === "string") out[k] = v;
  }
  return Object.keys(out).length ? out : undefined;
}

let posthogInitStarted = false;
let posthogClientPromise: Promise<
  import("posthog-js").PostHog | null
> | null = null;

function getPosthogKey(): string | undefined {
  if (typeof process === "undefined") return undefined;
  const k = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  return k && k.trim() ? k.trim() : undefined;
}

function ensurePosthog(): Promise<import("posthog-js").PostHog | null> {
  if (typeof window === "undefined") return Promise.resolve(null);
  const key = getPosthogKey();
  if (!key) return Promise.resolve(null);
  if (!posthogClientPromise) {
    posthogClientPromise = import("posthog-js")
      .then(({ default: posthog }) => {
        if (!posthogInitStarted) {
          const host =
            process.env.NEXT_PUBLIC_POSTHOG_HOST?.trim() ||
            "https://us.i.posthog.com";
          posthog.init(key, {
            api_host: host,
            autocapture: false,
            capture_pageview: false,
            disable_session_recording: true,
            persistence: "localStorage",
          });
          posthogInitStarted = true;
        }
        return posthog;
      })
      .catch(() => {
        posthogClientPromise = null;
        posthogInitStarted = false;
        return null;
      });
  }
  return posthogClientPromise;
}

/** Warm up PostHog on first client paint (optional; first trackEvent also initializes). */
export function initPosthog(): void {
  void ensurePosthog();
}

export function trackEvent(
  name: AnalyticsEventName,
  properties?: SafeAnalyticsProperties
): void {
  if (typeof window === "undefined") return;
  try {
    const props = sanitizeProps(properties);
    void ensurePosthog()
      .then((ph) => {
        if (!ph) return;
        ph.capture(name, props);
      })
      .catch(() => {});
  } catch {
    /* never break the app */
  }
}
