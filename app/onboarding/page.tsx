"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Sparkles, Table2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCaseload } from "@/components/providers/caseload-provider";

export default function OnboardingPage() {
  const router = useRouter();
  const { resetDemo, resetEmpty, setOnboardingCompleted } = useCaseload();
  const [step, setStep] = useState(0);

  const finish = (mode: "demo" | "empty") => {
    if (mode === "demo") resetDemo();
    else resetEmpty();
    setOnboardingCompleted(true);
    router.push("/dashboard");
  };

  if (step === 0) {
    return (
      <div className="mx-auto flex min-h-[80vh] max-w-lg flex-col justify-center gap-6 px-4 py-12">
        <div className="space-y-2 text-center">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Welcome
          </p>
          <h1 className="font-heading text-3xl font-semibold tracking-tight">
            Let’s set up your first week in CaseloadFlow.
          </h1>
          <p className="text-muted-foreground text-pretty">
            No accounts yet — your browser saves everything locally while we are
            in beta. You can start from a sample caseload or a clean slate.
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">What happens next?</CardTitle>
            <CardDescription>
              You will land on the dashboard with quick actions to add students,
              mark unavailable times, and build a Monday–Friday schedule.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-end gap-2">
            <Link href="/" className={cn(buttonVariants({ variant: "ghost" }))}>
              Back
            </Link>
            <Button onClick={() => setStep(1)}>
              Continue
              <ArrowRight className="size-4" data-icon="inline-end" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-2xl flex-col justify-center gap-6 px-4 py-12">
      <div className="space-y-2 text-center">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Choose how you want to begin
        </h1>
        <p className="text-sm text-muted-foreground">
          You can reset or reload the demo anytime from Settings.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-primary/20">
          <CardHeader>
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Sparkles className="size-4" aria-hidden />
            </div>
            <CardTitle className="text-base">Load sample caseload</CardTitle>
            <CardDescription>
              See a tiny school week with students, blocks, and sessions already
              in place.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Best if you want to explore in under a minute.
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => finish("demo")}>
              Use sample data
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <Table2 className="size-4" aria-hidden />
            </div>
            <CardTitle className="text-base">Start empty</CardTitle>
            <CardDescription>
              Begin with a blank dashboard and add your real caseload step by
              step.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Best if you already know your weekly rhythm.
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => finish("empty")}
            >
              Start from scratch
            </Button>
          </CardFooter>
        </Card>
      </div>
      <div className="flex justify-center">
        <Button variant="ghost" size="sm" onClick={() => setStep(0)}>
          Back
        </Button>
      </div>
    </div>
  );
}
