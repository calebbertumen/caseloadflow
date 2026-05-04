"use client";

import { FlaskConical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCaseload } from "@/components/providers/caseload-provider";
import { isOfficialDemoWorkspace } from "@/lib/workspace-utils";
import { cn } from "@/lib/utils";

type Props = {
  /** Larger pill for header row next to save indicator */
  variant?: "compact" | "header";
  className?: string;
};

export function WorkspaceSampleBadge({
  variant = "compact",
  className,
}: Props) {
  const { state, hydrated } = useCaseload();
  if (!hydrated || !isOfficialDemoWorkspace(state)) return null;

  const pill = (
    <Badge
      variant="secondary"
      className={cn(
        "shrink-0 gap-1 border-primary/15 bg-primary/[0.08] font-normal text-primary",
        variant === "header" && "px-2.5 py-1 text-[11px]",
        variant === "compact" && "text-[10px]",
        className
      )}
    >
      <FlaskConical className="size-3 opacity-80" aria-hidden />
      Sample data
    </Badge>
  );

  return (
    <TooltipProvider delay={200}>
      <Tooltip>
        <TooltipTrigger className="inline-flex cursor-default border-0 bg-transparent p-0">
          {pill}
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs text-xs">
          Fictional names and times — safe to explore. For real caseloads, use
          initials or nicknames.
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
