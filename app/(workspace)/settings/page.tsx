"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Download, RotateCcw, Sparkles, Upload } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useCaseload } from "@/components/providers/caseload-provider";
import {
  buildSafeAnalyticsContext,
  trackEvent,
} from "@/lib/analytics";
import { betaListMailto, LOCAL_DATA_LIMITATION } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { workspaceHasContent } from "@/lib/workspace-utils";

const settingsSchema = z.object({
  slpDisplayName: z.string().max(80),
  maxGroupSize: z.number().int().min(2).max(12),
});

type SettingsForm = z.infer<typeof settingsSchema>;

type ConfirmKind = "reset" | "import" | "sample" | null;

export default function SettingsPage() {
  const {
    state,
    hydrated,
    updateSettings,
    resetDemo,
    resetWorkspace,
    exportWorkspaceBackup,
    importWorkspaceFromJson,
  } = useCaseload();

  const form = useForm<SettingsForm>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      slpDisplayName: state.settings.slpDisplayName,
      maxGroupSize: state.settings.maxGroupSize,
    },
  });

  const { reset } = form;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [confirm, setConfirm] = useState<ConfirmKind>(null);
  const [importError, setImportError] = useState<string | null>(null);

  useEffect(() => {
    if (!hydrated) return;
    reset({
      slpDisplayName: state.settings.slpDisplayName,
      maxGroupSize: state.settings.maxGroupSize,
    });
  }, [hydrated, state.settings.slpDisplayName, state.settings.maxGroupSize, reset]);

  const runImportFromFile = useCallback(
    (file: File) => {
      setImportError(null);
      const reader = new FileReader();
      reader.onload = () => {
        const text = typeof reader.result === "string" ? reader.result : "";
        const result = importWorkspaceFromJson(text);
        if (!result.ok) {
          setImportError(result.error);
          return;
        }
        setConfirm(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      };
      reader.onerror = () => {
        setImportError("Could not read that file. Try again or pick a different file.");
      };
      reader.readAsText(file);
    },
    [importWorkspaceFromJson]
  );

  const requestImport = () => {
    setImportError(null);
    if (workspaceHasContent(state)) {
      setConfirm("import");
    } else if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const confirmImportReplace = () => {
    setConfirm(null);
    fileInputRef.current?.click();
  };

  const requestSample = () => {
    if (workspaceHasContent(state)) setConfirm("sample");
    else resetDemo();
  };

  if (!hydrated) {
    return <div className="h-40 animate-pulse rounded-xl bg-muted" />;
  }

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Settings & backup
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
          Manage your local workspace, export backups, and update simple scheduling
          defaults.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground">1. Workspace basics</h2>
        <Card className="border-border/80 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Workspace basics</CardTitle>
            <CardDescription>
              Your name on exports and the max group size used in conflict checks.
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
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground">2. Local browser saving</h2>
        <Card className="border-border/80 bg-muted/30 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Local browser saving</CardTitle>
            <CardDescription className="text-muted-foreground">
              Your workspace is stored only in this browser. {LOCAL_DATA_LIMITATION}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button type="button" variant="secondary" onClick={() => exportWorkspaceBackup()}>
              <Download className="size-4" />
              Export backup
            </Button>
            <p className="text-xs text-muted-foreground">
              Import and reset options are in Backup & restore below.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground">3. Backup & restore</h2>
        <Card className="border-border/80 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Backup & restore</CardTitle>
            <CardDescription>
              Export a JSON file you can store outside the browser. Import it on this
              or another computer to restore your workspace.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              className="sr-only"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) runImportFromFile(f);
              }}
            />
            <Button type="button" variant="secondary" onClick={() => exportWorkspaceBackup()}>
              <Download className="size-4" />
              Export backup
            </Button>
            <Button type="button" variant="outline" onClick={requestImport}>
              <Upload className="size-4" />
              Import backup
            </Button>
            <Button type="button" variant="outline" onClick={requestSample}>
              <Sparkles className="size-4" />
              Load sample data
            </Button>
            <Button type="button" variant="destructive" onClick={() => setConfirm("reset")}>
              <RotateCcw className="size-4" />
              Reset workspace
            </Button>
            {importError ? (
              <Alert variant="destructive">
                <AlertDescription>{importError}</AlertDescription>
              </Alert>
            ) : null}
          </CardContent>
        </Card>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground">4. Future cloud save</h2>
        <Card className="border-border/60 bg-muted/20 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-normal text-muted-foreground">
              Future cloud save
            </CardTitle>
            <CardDescription>
              Want cloud save later? Tell us what would make CaseloadFlow worth using
              weekly.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href={betaListMailto()}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
              onClick={() =>
                trackEvent("beta_interest_clicked", buildSafeAnalyticsContext(state))
              }
            >
              Email beta list
            </Link>
          </CardContent>
        </Card>
      </section>

      <Separator className="no-print" />

      <Dialog open={confirm === "reset"} onOpenChange={(o) => !o && setConfirm(null)}>
        <DialogContent showCloseButton>
          <DialogHeader>
            <DialogTitle>Reset workspace?</DialogTitle>
            <DialogDescription>
              This removes all students, availability blocks, and sessions from this
              browser. Export a backup first if you want to keep a copy.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => setConfirm(null)}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                const snap = state;
                resetWorkspace();
                trackEvent("workspace_reset", buildSafeAnalyticsContext(snap));
                window.dispatchEvent(new Event("caseloadflow:workspace_reset_done"));
                setConfirm(null);
              }}
            >
              Reset workspace
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={confirm === "import"} onOpenChange={(o) => !o && setConfirm(null)}>
        <DialogContent showCloseButton>
          <DialogHeader>
            <DialogTitle>Replace current workspace?</DialogTitle>
            <DialogDescription>
              Importing will overwrite students, blocks, sessions, and settings in
              this browser with the backup file. This cannot be undone without
              another backup.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => setConfirm(null)}>
              Cancel
            </Button>
            <Button type="button" onClick={confirmImportReplace}>
              Choose backup file
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={confirm === "sample"} onOpenChange={(o) => !o && setConfirm(null)}>
        <DialogContent showCloseButton>
          <DialogHeader>
            <DialogTitle>Replace with sample data?</DialogTitle>
            <DialogDescription>
              Loading the sample will replace your current students, blocks, and
              sessions. Export a backup first if you need to keep what you have.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => setConfirm(null)}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => {
                resetDemo();
                setConfirm(null);
              }}
            >
              Load sample data
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
