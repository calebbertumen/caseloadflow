import type { ReactNode } from "react";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNav } from "@/components/landing/landing-nav";
import { MvpPolicyBanner } from "@/components/landing/mvp-policy-banner";

type LegalDocShellProps = {
  title: string;
  children: ReactNode;
};

export function LegalDocShell({ title, children }: LegalDocShellProps) {
  return (
    <div className="flex min-h-full flex-col">
      <LandingNav />
      <main className="flex-1 border-b bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="mx-auto max-w-2xl px-4 py-12 md:px-6 md:py-16">
          <MvpPolicyBanner />
          <article className="mt-10 space-y-6 text-sm leading-relaxed text-muted-foreground md:text-[15px]">
            <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              {title}
            </h1>
            {children}
          </article>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}

export function LegalSectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-heading text-lg font-semibold tracking-tight text-foreground pt-2">
      {children}
    </h2>
  );
}

export function LegalBulletList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-2 pl-5 marker:text-muted-foreground">
      {items.map((item) => (
        <li key={item} className="text-pretty">
          {item}
        </li>
      ))}
    </ul>
  );
}
