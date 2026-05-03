declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_POSTHOG_KEY?: string;
    NEXT_PUBLIC_POSTHOG_HOST?: string;
    NEXT_PUBLIC_FEEDBACK_FORM_URL?: string;
  }
}
