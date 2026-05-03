"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useCaseload } from "@/components/providers/caseload-provider";

export default function DemoPage() {
  const router = useRouter();
  const { resetDemo } = useCaseload();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    resetDemo();
    router.replace("/dashboard");
  }, [resetDemo, router]);

  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-2 px-4 text-center">
      <p className="text-sm font-medium text-foreground">Loading sample workspace…</p>
      <p className="max-w-sm text-sm text-muted-foreground">
        Fictional students, blocks, and sessions load so you can try conflicts and
        printing in under a minute.
      </p>
    </div>
  );
}
