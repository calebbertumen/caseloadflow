"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { buildFeedbackMailto, FEEDBACK_MAILTO_BODY } from "@/lib/feedback";
import {
  buildSafeAnalyticsContext,
  trackEvent,
} from "@/lib/analytics";
import { useCaseload } from "@/components/providers/caseload-provider";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function FeedbackModal({ open, onOpenChange }: Props) {
  const { state } = useCaseload();

  const submitViaEmail = () => {
    trackEvent("feedback_submitted", buildSafeAnalyticsContext(state));
    window.location.href = buildFeedbackMailto();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg" showCloseButton>
        <DialogHeader>
          <DialogTitle>Give feedback</DialogTitle>
          <DialogDescription>
            Your answers are not stored in CaseloadFlow. Use the button below to
            open your email app with these questions prefilled, then send when
            you are ready.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground whitespace-pre-wrap">
          {FEEDBACK_MAILTO_BODY.trim()}
        </div>
        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button type="button" onClick={submitViaEmail}>
            Open email app to send feedback
          </Button>
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
