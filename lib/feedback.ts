import { SUPPORT_EMAIL } from "@/lib/constants";

export function feedbackFormUrl(): string | undefined {
  if (typeof process === "undefined") return undefined;
  const u = process.env.NEXT_PUBLIC_FEEDBACK_FORM_URL;
  return u && u.trim() ? u.trim() : undefined;
}

/** Numbered prompts for the in-app feedback mailto (no answers stored in-app). */
export const FEEDBACK_MAILTO_BODY = `Hi CaseloadFlow team,

Here is my feedback:

1) Are you a school-based SLP, CF, SLPA, student, or other?

2) What were you trying to do in CaseloadFlow?

3) What felt confusing or frustrating?

4) What would make this useful enough to use during your real scheduling week?

5) What do you currently use instead?

6) Would you want cloud save or accounts later?

7) Would you pay $9–15/month if this saved you time during scheduling?

8) Can I contact you for a 15-minute feedback call? If yes, leave your email below.

Thanks,
`;

export function buildFeedbackMailto(): string {
  const subject = encodeURIComponent("CaseloadFlow feedback");
  const body = encodeURIComponent(FEEDBACK_MAILTO_BODY);
  return `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
}

export function buildResetReasonMailto(reason: string): string {
  const subject = encodeURIComponent(`CaseloadFlow reset: ${reason}`);
  const body = encodeURIComponent(
    `Hi,\n\nI reset my workspace. Reason: ${reason}\n\n(Optional: add more detail here.)\n`
  );
  return `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
}
