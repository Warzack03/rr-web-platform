import type { Metadata } from "next";
import { PublicSiteLayout } from "@/components/layout/public-site-layout";
import { LegalPage } from "@/components/public/legal-page";
import { privacyPolicyContent } from "@/lib/public/legal-content";
import { buildPublicPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPublicPageMetadata({
  title: "Politica de privacidad",
  description: "Politica de privacidad de Rising Raimon.",
  path: "/politica-de-privacidad",
});

export default function PrivacyPolicyPage() {
  return (
    <PublicSiteLayout>
      <LegalPage document={privacyPolicyContent} />
    </PublicSiteLayout>
  );
}
