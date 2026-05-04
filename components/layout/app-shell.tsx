"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Clock,
  LayoutDashboard,
  Menu,
  Printer,
  Settings,
  Sparkles,
  Users,
} from "lucide-react";
import { setAnalyticsPathname } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ContextualNudgeBanners } from "@/components/feedback/contextual-nudge-banners";
import { FeedbackProvider } from "@/components/feedback/feedback-context";
import { GiveFeedbackButton } from "@/components/feedback/give-feedback-button";
import { WorkspaceNudgeProvider } from "@/components/feedback/workspace-nudge-context";
import { useCaseload } from "@/components/providers/caseload-provider";
import { WorkspaceSampleBadge } from "@/components/workspace/workspace-sample-badge";
import { WorkspaceSaveIndicator } from "@/components/workspace/workspace-save-indicator";
import { isOfficialDemoWorkspace, workspaceHasContent } from "@/lib/workspace-utils";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/students", label: "Students", icon: Users },
  { href: "/availability", label: "Availability", icon: Clock },
  { href: "/schedule", label: "Schedule", icon: CalendarDays },
  { href: "/conflicts", label: "Conflicts", icon: AlertTriangle },
  { href: "/export", label: "Export", icon: Printer },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

function SidebarBottom({ onNavigate }: { onNavigate?: () => void }) {
  const { state, hydrated } = useCaseload();
  const showSample = hydrated && !workspaceHasContent(state);
  const showSampleBadge = hydrated && isOfficialDemoWorkspace(state);

  return (
    <div className="space-y-2 border-t p-4">
      <div className="flex items-center gap-2 rounded-md border border-border/40 bg-muted/20 px-2 py-1.5 text-[10px] leading-snug text-muted-foreground">
        <CheckCircle2 className="size-3 shrink-0 text-primary/90" aria-hidden />
        <span>Browser-saved workspace</span>
      </div>
      {showSampleBadge ? (
        <div className="flex justify-center">
          <WorkspaceSampleBadge variant="compact" />
        </div>
      ) : null}
      {showSample ? (
        <Link
          href="/demo"
          onClick={onNavigate}
          className={cn(
            buttonVariants({ variant: "secondary", size: "sm" }),
            "w-full justify-center gap-1.5"
          )}
        >
          <Sparkles className="size-3.5" aria-hidden />
          Load sample data
        </Link>
      ) : null}
      <GiveFeedbackButton className="w-full" onBeforeOpen={onNavigate} />
      <Link
        href="/"
        onClick={onNavigate}
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "w-full justify-center text-muted-foreground hover:text-foreground"
        )}
      >
        Back to home
      </Link>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setAnalyticsPathname(pathname);
  }, [pathname]);

  const linkClass = (href: string, mobile?: boolean) => {
    const active =
      pathname === href || pathname.startsWith(`${href}/`);
    return cn(
      "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
      active
        ? "bg-primary/10 font-medium text-primary shadow-sm ring-1 ring-primary/10"
        : "text-muted-foreground hover:bg-muted hover:text-foreground",
      mobile && "text-base"
    );
  };

  return (
    <WorkspaceNudgeProvider>
      <FeedbackProvider>
        <div className="flex min-h-[100dvh] bg-muted/30">
          <aside className="no-print sticky top-0 hidden h-[100dvh] w-60 shrink-0 flex-col border-r bg-card md:flex">
            <div className="flex flex-col gap-1 p-4">
              <Link href="/" className="rounded-lg px-2 py-2 hover:bg-muted/80">
                <div className="text-sm font-semibold tracking-tight text-foreground">
                  CaseloadFlow
                </div>
                <p className="text-xs text-muted-foreground">School SLP scheduling</p>
              </Link>
            </div>
            <Separator />
            <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-3" aria-label="Main">
              {nav.map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href}>
                  <span className={linkClass(href)}>
                    <Icon className="size-4 shrink-0 opacity-80" aria-hidden />
                    {label}
                  </span>
                </Link>
              ))}
            </nav>
            <SidebarBottom />
          </aside>

          <div className="flex min-w-0 flex-1 flex-col">
            <header className="no-print sticky top-0 z-10 flex flex-col gap-2 border-b bg-background/80 px-4 py-3 backdrop-blur md:hidden">
              <div className="flex items-center justify-between gap-2">
                <Link href="/dashboard" className="shrink-0 font-semibold">
                  CaseloadFlow
                </Link>
                <Sheet open={open} onOpenChange={setOpen}>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon-sm"
                    aria-label="Open menu"
                    onClick={() => setOpen(true)}
                  >
                    <Menu className="size-4" />
                  </Button>
                  <SheetContent side="right" className="w-[min(100%,320px)]">
                    <SheetHeader>
                      <SheetTitle>Navigate</SheetTitle>
                    </SheetHeader>
                    <nav className="mt-4 flex flex-col gap-1" aria-label="Mobile main">
                      {nav.map(({ href, label, icon: Icon }) => (
                        <Link key={href} href={href} onClick={() => setOpen(false)}>
                          <span className={linkClass(href, true)}>
                            <Icon className="size-4 shrink-0 opacity-80" aria-hidden />
                            {label}
                          </span>
                        </Link>
                      ))}
                      <Separator className="my-3" />
                      <SidebarBottom onNavigate={() => setOpen(false)} />
                    </nav>
                  </SheetContent>
                </Sheet>
              </div>
              <div className="flex flex-wrap items-center justify-end gap-2">
                <WorkspaceSampleBadge variant="header" />
                <WorkspaceSaveIndicator />
              </div>
            </header>
            <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 md:px-8 md:py-8">
              <div className="no-print mb-3 hidden md:flex md:items-center md:justify-end md:gap-2">
                <WorkspaceSampleBadge variant="header" />
                <WorkspaceSaveIndicator />
              </div>
              <ContextualNudgeBanners />
              {children}
            </main>
          </div>
        </div>
      </FeedbackProvider>
    </WorkspaceNudgeProvider>
  );
}
