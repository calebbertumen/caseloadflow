/** Tailwind-aligned tokens for student tags (no dynamic class compilation). */
export const STUDENT_COLOR_OPTIONS = [
  { value: "sky", label: "Sky", swatch: "bg-sky-500" },
  { value: "violet", label: "Violet", swatch: "bg-violet-500" },
  { value: "amber", label: "Amber", swatch: "bg-amber-500" },
  { value: "emerald", label: "Emerald", swatch: "bg-emerald-500" },
  { value: "rose", label: "Rose", swatch: "bg-rose-500" },
  { value: "slate", label: "Slate", swatch: "bg-slate-500" },
] as const;

export type StudentColorToken = (typeof STUDENT_COLOR_OPTIONS)[number]["value"];

export function studentColorDotClass(color: string): string {
  const found = STUDENT_COLOR_OPTIONS.find((c) => c.value === color);
  return found?.swatch ?? "bg-muted-foreground";
}
