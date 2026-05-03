"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { feedbackFormUrl } from "@/lib/feedback";
import {
  buildSafeAnalyticsContext,
  trackEvent,
} from "@/lib/analytics";
import { useCaseload } from "@/components/providers/caseload-provider";
import { FeedbackModal } from "./feedback-modal";

type Ctx = {
  openFeedback: () => void;
  closeFeedback: () => void;
};

const FeedbackContext = createContext<Ctx | null>(null);

export function FeedbackProvider({ children }: { children: React.ReactNode }) {
  const { state } = useCaseload();
  const [open, setOpen] = useState(false);

  const closeFeedback = useCallback(() => setOpen(false), []);

  const openFeedback = useCallback(() => {
    const url = feedbackFormUrl();
    trackEvent("feedback_opened", buildSafeAnalyticsContext(state));
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
      return;
    }
    setOpen(true);
  }, [state]);

  const value = useMemo(
    () => ({ openFeedback, closeFeedback }),
    [openFeedback, closeFeedback]
  );

  return (
    <FeedbackContext.Provider value={value}>
      {children}
      <FeedbackModal open={open} onOpenChange={setOpen} />
    </FeedbackContext.Provider>
  );
}

export function useFeedbackLauncher() {
  const ctx = useContext(FeedbackContext);
  if (!ctx) {
    throw new Error("useFeedbackLauncher must be used within FeedbackProvider");
  }
  return ctx;
}
