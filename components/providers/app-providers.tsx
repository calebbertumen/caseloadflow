"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { PosthogInit } from "@/components/analytics/posthog-init";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CaseloadProvider } from "./caseload-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <PosthogInit />
      <TooltipProvider>
        <CaseloadProvider>{children}</CaseloadProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
