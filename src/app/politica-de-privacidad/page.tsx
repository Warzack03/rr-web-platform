import type { Metadata } from "next";
import { PublicSiteLayout } from "@/components/layout/public-site-layout";
import { LegalPage } from "@/components/public/legal-page";
import { privacyPolicyContent } from "@/lib/public/legal-content";

export const metadata: Metadata = {
  title: "Politica de privacidad",
  description: "Politica de privacidad de Rising Raimon.",
};

export default function PrivacyPolicyPage() {
  return (
    <PublicSiteLayout>
      <LegalPage document={privacyPolicyContent} />
    </PublicSiteLayout>
  );
}
