import type { Metadata } from "next";
import {
  LegalBulletList,
  LegalDocShell,
  LegalSectionTitle,
} from "@/components/landing/legal-doc-shell";
import {
  POLICIES_LAST_UPDATED,
  POLICY_DOCUMENT_VERSION,
  SUPPORT_EMAIL,
} from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How CaseloadFlow handles data for school-based SLP scheduling during the MVP beta.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalDocShell title="Privacy Policy">
      <p className="text-pretty text-foreground/90">
        <strong className="font-medium text-foreground">
          CaseloadFlow is for scheduling support only.
        </strong>{" "}
        It is a lightweight weekly planning helper for school-based
        speech-language pathologists. It is{" "}
        <strong className="font-medium text-foreground">not</strong> an electronic
        health record (EHR), not an IEP management system, not a student records
        system, and it does{" "}
        <strong className="font-medium text-foreground">not</strong> guarantee legal,
        educational, clinical, FERPA, HIPAA, or district compliance.
      </p>

      <LegalSectionTitle>What we hope you use it for</LegalSectionTitle>
      <p className="text-pretty">
        The MVP is meant to help you think through weekly therapy blocks, minutes,
        and basic availability—not to store confidential clinical or educational
        records.
      </p>

      <LegalSectionTitle>Please do not enter certain information</LegalSectionTitle>
      <p className="text-pretty">
        To keep risk low during beta,{" "}
        <strong className="font-medium text-foreground">do not enter</strong>:
      </p>
      <LegalBulletList
        items={[
          "Full student legal names",
          "Diagnoses or clinical impressions",
          "IEP documents or long excerpts from official records",
          "Therapy notes or detailed treatment narratives",
          "Medical records or insurance details",
          "Protected health information (PHI) or other highly sensitive personal information",
        ]}
      />

      <LegalSectionTitle>What we recommend instead</LegalSectionTitle>
      <p className="text-pretty">
        For student entries, prefer{" "}
        <strong className="font-medium text-foreground">
          initials, first names only, pseudonyms, or internal nicknames
        </strong>{" "}
        your team already uses on whiteboards or draft schedules. Keep labels just
        specific enough for you to know who is who.
      </p>

      <LegalSectionTitle>Data that may be stored during the MVP</LegalSectionTitle>
      <p className="text-pretty">
        Depending on how you use the app, your device may store:
      </p>
      <LegalBulletList
        items={[
          "Student labels or names as you type them",
          "Grade, teacher, or classroom labels you add",
          "Weekly service-minute targets and related scheduling fields",
          "Availability blocks you define",
          "Planned schedule sessions",
          "Short notes you choose to type in the app",
          "Basic account or contact information only if we add sign-in or a waitlist later (the current MVP does not require accounts)",
        ]}
      />

      <LegalSectionTitle>Product analytics (optional)</LegalSectionTitle>
      <p className="text-pretty">
        CaseloadFlow may use{" "}
        <strong className="font-medium text-foreground">
          privacy-safe, aggregated analytics
        </strong>{" "}
        (for example through PostHog) to understand which parts of the product
        people use and where the experience feels confusing. We do{" "}
        <strong className="font-medium text-foreground">not</strong> intend for
        analytics to receive student names, teacher names, classroom names, free
        text notes, diagnoses, IEP documents, therapy notes, medical records, or
        other sensitive student information. Please continue to avoid entering that
        kind of information in the app, as described above.
      </p>
      <p className="text-pretty">
        If no analytics configuration is provided in your deployment, those
        analytics features stay off and nothing is sent to an analytics vendor
        from this behavior.
      </p>

      <LegalSectionTitle>Where your schedule data lives today</LegalSectionTitle>
      <p className="text-pretty">
        During this MVP,{" "}
        <strong className="font-medium text-foreground">
          workspace data is stored locally in your web browser
        </strong>{" "}
        (for example, using local storage on your device) unless or until optional
        cloud sync is added later with clear notice beforehand. It is not synced to
        CaseloadFlow servers today.
      </p>
      <p className="text-pretty">
        If we introduce cloud storage or accounts, we will update this policy{" "}
        <strong className="font-medium text-foreground">before</strong> those
        features launch so you can make an informed choice.
      </p>

      <LegalSectionTitle>How we use your information</LegalSectionTitle>
      <LegalBulletList
        items={[
          "CaseloadFlow does not sell your data.",
          "CaseloadFlow does not use your in-app content to run advertising.",
          "CaseloadFlow does not knowingly collect personal information directly from children. The product is intended for adult school staff.",
        ]}
      />

      <LegalSectionTitle>Contact</LegalSectionTitle>
      <p className="text-pretty">
        Questions about this policy? Email{" "}
        <a
          className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
          href={`mailto:${SUPPORT_EMAIL}`}
        >
          {SUPPORT_EMAIL}
        </a>
        .
      </p>

      <p className="text-xs text-muted-foreground pt-4 border-t border-border">
        Version {POLICY_DOCUMENT_VERSION} · Last updated: {POLICIES_LAST_UPDATED}
      </p>
    </LegalDocShell>
  );
}
