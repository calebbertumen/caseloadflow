"use client";

import { useEffect } from "react";
import { initPosthog } from "@/lib/analytics";

/** Loads PostHog once on the client when a public key is configured. */
export function PosthogInit() {
  useEffect(() => {
    initPosthog();
  }, []);
  return null;
}
