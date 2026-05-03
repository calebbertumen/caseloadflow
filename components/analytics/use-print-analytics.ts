"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import type { AnalyticsSource } from "@/lib/analytics";
import {
  buildSafeAnalyticsContext,
  trackEvent,
} from "@/lib/analytics";
import type { AppState } from "@/lib/types";

/**
 * Fires schedule_printed when the user opens the print dialog from this page,
 * and optionally shows a follow-up nudge after print closes (afterprint).
 */
export function usePrintAnalytics(
  state: AppState,
  source: AnalyticsSource,
  onAfterPrint?: () => void
) {
  const stateRef = useRef(state);
  const afterRef = useRef(onAfterPrint);

  useLayoutEffect(() => {
    stateRef.current = state;
    afterRef.current = onAfterPrint;
  }, [state, onAfterPrint]);

  useEffect(() => {
    const before = () => {
      trackEvent(
        "schedule_printed",
        buildSafeAnalyticsContext(stateRef.current, { source })
      );
    };
    const after = () => {
      afterRef.current?.();
    };
    window.addEventListener("beforeprint", before);
    window.addEventListener("afterprint", after);
    return () => {
      window.removeEventListener("beforeprint", before);
      window.removeEventListener("afterprint", after);
    };
  }, [source]);
}
