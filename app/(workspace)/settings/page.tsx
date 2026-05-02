"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCaseload } from "@/components/providers/caseload-provider";

const settingsSchema = z.object({
  slpDisplayName: z.string().max(80),
  maxGroupSize: z.number().int().min(2).max(12),
});

type SettingsForm = z.infer<typeof settingsSchema>;

export default function SettingsPage() {
  const { state, hydrated, updateSettings, resetDemo, resetEmpty } =
    useCaseload();
  const form = useForm<SettingsForm>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      slpDisplayName: state.settings.slpDisplayName,
      maxGroupSize: state.settings.maxGroupSize,
    },
  });

  const { reset } = form;

  useEffect(() => {
    if (!hydrated) return;
    reset({
      slpDisplayName: state.settings.slpDisplayName,
      maxGroupSize: state.settings.maxGroupSize,
    });
  }, [hydrated, state.settings.slpDisplayName, state.settings.maxGroupSize, reset]);

  if (!hydrated) {
    return <div className="h-40 animate-pulse rounded-xl bg-muted" />;
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="space-y-1">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Settings
        </h1>
        <p className="text-muted-foreground">
          A small set of preferences — we will grow this carefully so the app
          stays approachable.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Workspace</CardTitle>
          <CardDescription>
            Data is stored in this browser only during the beta.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit((values) => {
              updateSettings({
                slpDisplayName: values.slpDisplayName || "You",
                maxGroupSize: values.maxGroupSize,
              });
            })}
          >
            <div className="space-y-2">
              <Label htmlFor="slp-name">Your name on exports</Label>
              <Input
                id="slp-name"
                placeholder="e.g. Jamie Chen, CCC-SLP"
                {...form.register("slpDisplayName")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-group">Preferred max group size</Label>
              <Input
                id="max-group"
                type="number"
                min={2}
                max={12}
                {...form.register("maxGroupSize", {
                  valueAsNumber: true,
                  setValueAs: (v) =>
                    v === "" || Number.isNaN(Number(v)) ? 4 : Number(v),
                })}
              />
              <p className="text-xs text-muted-foreground">
                Used for gentle warnings when a group session has many students.
              </p>
            </div>
            <Button type="submit">Save settings</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Data tools</CardTitle>
          <CardDescription>
            Reload the sample caseload or wipe this browser’s saved draft.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 sm:flex-row">
          <Button type="button" variant="secondary" onClick={() => resetDemo()}>
            Load sample caseload
          </Button>
          <Button
            type="button"
            variant="outline"
            className="text-destructive hover:text-destructive"
            onClick={() => {
              if (
                window.confirm(
                  "Clear all students, blocks, and sessions from this browser?"
                )
              ) {
                resetEmpty();
              }
            }}
          >
            Clear local data
          </Button>
        </CardContent>
      </Card>

      <Separator className="no-print" />

      <p className="no-print text-center text-xs text-muted-foreground">
        CaseloadFlow beta · Later: optional cloud sync with Supabase on the free
        tier.
      </p>
    </div>
  );
}
