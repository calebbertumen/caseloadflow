"use client";

import { MessageSquareText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFeedbackLauncher } from "./feedback-context";

export function GiveFeedbackButton({
  className,
  onBeforeOpen,
}: {
  className?: string;
  /** Runs before opening the feedback form or modal (e.g. close mobile nav). */
  onBeforeOpen?: () => void;
}) {
  const { openFeedback } = useFeedbackLauncher();

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={className}
      onClick={() => {
        onBeforeOpen?.();
        openFeedback();
      }}
    >
      <MessageSquareText className="size-4" aria-hidden />
      Give feedback
    </Button>
  );
}
