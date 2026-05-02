"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  AlertTriangle,
  CalendarDays,
  Clock,
  LayoutDashboard,
  Menu,
  Printer,
  Settings,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/students", label: "Students", icon: Users },
  { href: "/availability", label: "Availability", icon: Clock },
  { href: "/schedule", label: "Schedule", icon: CalendarDays },
  { href: "/conflicts", label: "Conflicts", icon: AlertTriangle },
  { href: "/export", label: "Export", icon: Printer },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const linkClass = (href: string, mobile?: boolean) => {
    const active =
      pathname === href || pathname.startsWith(`${href}/`);
    return cn(
      "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
      active
        ? "bg-primary/10 font-medium text-primary"
        : "text-muted-foreground hover:bg-muted hover:text-foreground",
      mobile && "text-base"
    );
  };

  return (
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
        <nav className="flex flex-1 flex-col gap-0.5 p-3" aria-label="Main">
          {nav.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}>
              <span className={linkClass(href)}>
                <Icon className="size-4 shrink-0 opacity-80" aria-hidden />
                {label}
              </span>
            </Link>
          ))}
        </nav>
        <div className="mt-auto border-t p-4">
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "w-full"
            )}
          >
            Back to home
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="no-print sticky top-0 z-10 flex items-center justify-between gap-3 border-b bg-background/80 px-4 py-3 backdrop-blur md:hidden">
          <Link href="/dashboard" className="font-semibold">
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
                <Separator className="my-2" />
                <Link href="/" onClick={() => setOpen(false)}>
                  <span className={linkClass("/", true)}>Back to home</span>
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </header>
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}
