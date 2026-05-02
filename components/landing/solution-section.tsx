import { Check } from "lucide-react";

const bullets = [
  "Organize your caseload in plain English fields",
  "Build weekly therapy blocks on a clear Monday–Friday grid",
  "Spot conflicts before you commit to a schedule",
  "Track required minutes against what you actually scheduled",
  "Print or export a calm, readable weekly view",
];

export function SolutionSection() {
  return (
    <section className="border-y bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-semibold tracking-tight">
            A gentle workflow that respects how schools really run.
          </h2>
          <p className="mt-3 text-muted-foreground text-pretty">
            CaseloadFlow is designed to feel supportive, not clinical. You stay
            in control with a manual builder — we surface the risks and the
            minutes so nothing slips through the cracks.
          </p>
        </div>
        <ul className="mx-auto mt-10 grid max-w-3xl gap-3 sm:grid-cols-2">
          {bullets.map((b) => (
            <li
              key={b}
              className="flex items-start gap-3 rounded-xl border bg-card p-4 text-sm shadow-sm"
            >
              <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Check className="size-3.5" aria-hidden />
              </span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
