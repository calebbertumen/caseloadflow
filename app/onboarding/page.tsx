"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { HardDrive, Info, Shield, Sparkles, Table2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCaseload } from "@/components/providers/caseload-provider";
import {
  buildSafeAnalyticsContext,
  trackEvent,
} from "@/lib/analytics";
import { PRIVACY_REMINDER_COPY } from "@/lib/constants";
import { emptyAppState } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { workspaceHasContent } from "@/lib/workspace-utils";

export default function OnboardingPage() {
  const router = useRouter();
  const { state, resetDemo, resetEmpty, setOnboardingCompleted } = useCaseload();
  const [sampleDialogOpen, setSampleDialogOpen] = useState(false);
  const [blankDialogOpen, setBlankDialogOpen] = useState(false);

  const goToDashboard = () => {
    setOnboardingCompleted(true);
    router.push("/dashboard");
  };

  const startWithDemo = () => {
    resetDemo();
    goToDashboard();
  };

  const startBlankWorkspace = () => {
    resetEmpty();
    trackEvent(
      "blank_workspace_started",
      buildSafeAnalyticsContext(
        { ...emptyAppState, onboardingCompleted: true },
        { source: "onboarding" }
      )
    );
    setBlankDialogOpen(false);
    goToDashboard();
  };

  const tryLoadSample = () => {
    if (workspaceHasContent(state)) setSampleDialogOpen(true);
    else startWithDemo();
  };

  const tryStartBlank = () => {
    if (workspaceHasContent(state)) setBlankDialogOpen(true);
    else startBlankWorkspace();
  };

  return (
    <div className="mx-auto flex min-h-[85dvh] max-w-4xl flex-col justify-center gap-6 px-4 py-10 md:gap-7 md:py-12">
      <header className="space-y-2 text-center md:space-y-3">
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          Choose how you want to begin
        </h1>
        <p className="mx-auto max-w-xl text-sm leading-relaxed text-muted-foreground text-pretty md:text-base">
          Start with sample data to explore the workflow, or begin with a blank
          schedule and build your real week step by step.
        </p>
      </header>

      <Card className="border-border/80 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold md:text-lg">
            <Info
              className="size-5 shrink-0 text-primary"
              aria-hidden
            />
            Before you start
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          <div className="flex gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <HardDrive className="size-4" aria-hidden />
            </div>
            <div className="min-w-0 space-y-2 text-sm leading-relaxed text-muted-foreground">
              <p className="font-medium text-foreground">Local save</p>
              <p>
                No account needed. Your workspace is saved only in this browser.
              </p>
              <p>
                To move devices or keep a backup, export your workspace file later
                from Settings.
              </p>
            </div>
          </div>
          <Separator />
          <div className="flex gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <Shield className="size-4" aria-hidden />
            </div>
            <div className="min-w-0 space-y-1 text-sm leading-relaxed text-muted-foreground">
              <p className="font-medium text-foreground">Privacy reminder</p>
              <p>{PRIVACY_REMINDER_COPY}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 md:gap-5">
        <Card className="overflow-hidden border-primary/30 bg-gradient-to-b from-primary/[0.07] to-card shadow-md ring-1 ring-primary/15 transition-shadow hover:shadow-lg">
          <CardHeader className="space-y-3 pb-2">
            <Badge className="w-fit border-primary/25 bg-primary/15 font-normal text-primary">
              Recommended for first-time users
            </Badge>
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <Sparkles className="size-5" aria-hidden />
            </div>
            <CardTitle className="text-lg font-semibold leading-snug md:text-xl">
              Start with sample data
            </CardTitle>
            <CardDescription className="text-sm leading-relaxed text-muted-foreground">
              Load a full fictional week: multiple students, unavailable blocks, a
              busy grid, minute gaps, and example conflicts you can fix or ignore.
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2 text-sm text-muted-foreground">
            Best if you want to see value in under a minute — nothing here is a real
            student record.
          </CardContent>
          <CardFooter className="flex flex-col items-stretch gap-2 border-t bg-muted/20 pt-4">
            <Button type="button" className="w-full" size="lg" onClick={tryLoadSample}>
              Use sample data
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Great for a quick tour
            </p>
          </CardFooter>
        </Card>

        <Card className="border-border/80 bg-card shadow-sm transition-shadow hover:border-muted-foreground/25 hover:shadow-md">
          <CardHeader className="space-y-3 pb-2">
            <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <Table2 className="size-5" aria-hidden />
            </div>
            <CardTitle className="text-lg font-semibold leading-snug md:text-xl">
              Start from scratch
            </CardTitle>
            <CardDescription className="text-sm leading-relaxed text-muted-foreground">
              Open a blank workspace and build your own schedule step by step.
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2 text-sm text-muted-foreground">
            Best if you are ready to enter your real caseload now.
          </CardContent>
          <CardFooter className="flex flex-col items-stretch gap-2 border-t bg-muted/10 pt-4">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="w-full border-muted-foreground/25 bg-background"
              onClick={tryStartBlank}
            >
              Start blank schedule
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Use your own students and schedule
            </p>
          </CardFooter>
        </Card>
      </div>

      <p className="text-center text-xs leading-relaxed text-muted-foreground md:text-sm">
        Next, you&apos;ll land in the dashboard where you can add students, block
        unavailable times, and build your Monday-Friday schedule.
      </p>
      <p className="text-center text-[11px] text-muted-foreground md:text-xs">
        You can reset your workspace or reload sample data anytime from Settings.
      </p>

      <div className="flex justify-center pt-1">
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "text-muted-foreground"
          )}
        >
          Back to home
        </Link>
      </div>

      <Dialog open={sampleDialogOpen} onOpenChange={setSampleDialogOpen}>
        <DialogContent showCloseButton>
          <DialogHeader>
            <DialogTitle>Replace current workspace?</DialogTitle>
            <DialogDescription>
              You already have students, sessions, or blocks saved in this
              browser. Loading the sample will replace them. Export a backup from
              Settings first if you need to keep your work.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => setSampleDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => {
                setSampleDialogOpen(false);
                startWithDemo();
              }}
            >
              Load sample anyway
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={blankDialogOpen} onOpenChange={setBlankDialogOpen}>
        <DialogContent showCloseButton>
          <DialogHeader>
            <DialogTitle>Start with a blank workspace?</DialogTitle>
            <DialogDescription>
              This removes all students, availability blocks, and sessions saved
              in this browser so you can begin fresh. Export a backup from
              Settings first if you need to keep what you have.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => setBlankDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={startBlankWorkspace}>
              Clear and start blank
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
