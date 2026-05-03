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
  title: "Terms of Service",
  description:
    "Terms for using the CaseloadFlow MVP beta for school-based SLP scheduling.",
};

export default function TermsOfServicePage() {
  return (
    <LegalDocShell title="Terms of Service">
      <p className="text-pretty text-foreground/90">
        By using CaseloadFlow, you agree to these terms. If you do not agree, please
        do not use the app.
      </p>

      <LegalSectionTitle>Beta / MVP status</LegalSectionTitle>
      <p className="text-pretty">
        CaseloadFlow is offered as an early{" "}
        <strong className="font-medium text-foreground">beta or MVP</strong>. Features,
        layout, and data handling may change, pause, or end without notice. The app
        may contain bugs or downtime.
      </p>

      <LegalSectionTitle>What CaseloadFlow is (and is not)</LegalSectionTitle>
      <p className="text-pretty">
        CaseloadFlow provides{" "}
        <strong className="font-medium text-foreground">
          lightweight organizational support
        </strong>{" "}
        for building weekly therapy-style schedules. It does{" "}
        <strong className="font-medium text-foreground">not</strong> provide legal,
        clinical, educational, compliance, or professional advice. It is{" "}
        <strong className="font-medium text-foreground">not</strong> an EHR,{" "}
        <strong className="font-medium text-foreground">not</strong> an IEP system,{" "}
        <strong className="font-medium text-foreground">not</strong> a student
        records system, and{" "}
        <strong className="font-medium text-foreground">not</strong> a compliance
        system. It is not a substitute for your district’s tools or policies.
      </p>
      <p className="text-pretty">
        <strong className="font-medium text-foreground">
          CaseloadFlow does not guarantee IEP compliance, FERPA compliance, HIPAA
          compliance, district compliance, service delivery compliance, FAPE, or
          Medicaid billing accuracy, and it does not prove that services were
          actually delivered.
        </strong>{" "}
        You remain responsible for official documentation and requirements that
        apply to your role.
      </p>

      <LegalSectionTitle>Your responsibilities</LegalSectionTitle>
      <LegalBulletList
        items={[
          "You are responsible for the accuracy of schedules, minute totals, and any labels you enter.",
          "You are responsible for following school, district, state, FERPA, HIPAA (if applicable), IEP, licensure, and professional requirements that apply to your role.",
          "You should not enter sensitive student records, diagnoses, IEP documents, medical records, protected health information, or confidential district data that you are not allowed to store in a lightweight scheduling helper.",
          "You represent that you have the rights or permission needed for any data you add.",
        ]}
      />

      <LegalSectionTitle>Acceptable use</LegalSectionTitle>
      <LegalBulletList
        items={[
          "Do not use CaseloadFlow for unlawful purposes.",
          "Do not attempt to disrupt the service, probe it in ways that could harm others, or reverse engineer it beyond what normal browsing requires.",
          "Do not enter information you are not authorized to access or use.",
        ]}
      />

      <LegalSectionTitle>Disclaimer of warranties</LegalSectionTitle>
      <p className="text-pretty">
        CaseloadFlow is provided{" "}
        <strong className="font-medium text-foreground">“as is” and “as available.”</strong>{" "}
        To the fullest extent allowed by law, we disclaim all warranties, whether
        express or implied, including implied warranties of merchantability, fitness
        for a particular purpose, and non-infringement.
      </p>

      <LegalSectionTitle>Limitation of liability</LegalSectionTitle>
      <p className="text-pretty">
        To the fullest extent permitted by law, CaseloadFlow and its creators will
        not be liable for any indirect, incidental, special, consequential, or
        punitive damages, or for loss of profits, goodwill, data, or other intangible
        losses, arising out of or related to your use of the MVP—even if we have
        been told that kind of damage is possible.
      </p>
      <p className="text-pretty">
        To the fullest extent permitted by law, our total liability for any claim
        arising from these terms or your use of CaseloadFlow during the free MVP
        period will not exceed the greater of{" "}
        <strong className="font-medium text-foreground">zero dollars</strong> (since
        the beta is currently offered without charge) or{" "}
        <strong className="font-medium text-foreground">fifty U.S. dollars (USD $50)</strong>.
      </p>
      <p className="text-pretty">
        Some jurisdictions do not allow certain limitations; in those places, these
        limits apply only to the extent allowed by applicable law.
      </p>

      <LegalSectionTitle>Contact</LegalSectionTitle>
      <p className="text-pretty">
        Reach us at{" "}
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
