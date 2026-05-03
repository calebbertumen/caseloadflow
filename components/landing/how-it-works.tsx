import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TrackedViewDemoLink } from "./landing-tracking";

const steps = [
  {
    step: "1",
    title: "Add your caseload",
    text: "Enter students, teachers, required minutes, and session preferences.",
  },
  {
    step: "2",
    title: "Block unavailable times",
    text: "Add lunch, recess, specials, meetings, classroom restrictions, and student unavailable times.",
  },
  {
    step: "3",
    title: "Build and check your week",
    text: "Place sessions on the weekly grid and review conflicts, missing minutes, and unscheduled students.",
  },
] as const;

export function HowItWorks() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-14">
        <h2 className="text-center font-heading text-2xl font-semibold tracking-tight md:text-3xl">
          Build a schedule in three simple steps.
        </h2>
        <div className="mt-8 grid gap-4 md:mt-10 md:grid-cols-3 md:gap-5">
          {steps.map(({ step, title, text }) => (
            <Card
              key={step}
              className="border-border/80 shadow-sm transition-shadow hover:shadow-md"
            >
              <CardHeader className="pb-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                  Step {step}
                </p>
                <CardTitle className="text-lg">{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-8 flex justify-center md:mt-9">
          <TrackedViewDemoLink
            href="/demo"
            className={cn(
              buttonVariants({ variant: "link" }),
              "h-auto px-0 py-0 text-sm font-medium text-primary underline-offset-4"
            )}
          >
            Try it with sample data
          </TrackedViewDemoLink>
        </div>
      </div>
    </section>
  );
}
