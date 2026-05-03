export function MvpPolicyBanner() {
  return (
    <aside
      className="rounded-lg border border-border bg-card px-4 py-3 text-sm text-muted-foreground shadow-sm"
      role="note"
    >
      <p className="font-medium text-foreground">Plain-English MVP notice</p>
      <p className="mt-1.5 text-pretty leading-relaxed">
        This page is meant to be readable and practical for our early beta. It is
        not personalized legal advice. If you need legal guidance for your school
        or district, talk to a qualified attorney or your administration.
      </p>
    </aside>
  );
}
