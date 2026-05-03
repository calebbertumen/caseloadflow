"use client";

import Link from "next/link";
import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

export function LandingPageViewTracker() {
  useEffect(() => {
    trackEvent("landing_viewed", { source: "landing" });
  }, []);
  return null;
}

const landingCtaData = {
  "data-event": "cta_start_free_clicked",
  "data-source": "landing",
} as const;

const landingDemoData = {
  "data-event": "cta_view_demo_clicked",
  "data-source": "landing",
} as const;

export function TrackedStartFreeLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={className}
      {...landingCtaData}
      onClick={() =>
        trackEvent("cta_start_free_clicked", { source: "landing" })
      }
    >
      {children}
    </Link>
  );
}

export function TrackedViewDemoLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={className}
      {...landingDemoData}
      onClick={() =>
        trackEvent("cta_view_demo_clicked", { source: "landing" })
      }
    >
      {children}
    </Link>
  );
}
