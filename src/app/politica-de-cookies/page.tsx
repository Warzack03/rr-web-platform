import type { Metadata } from "next";
import { PublicSiteLayout } from "@/components/layout/public-site-layout";
import { LegalPage } from "@/components/public/legal-page";
import { cookiesPolicyContent } from "@/lib/public/legal-content";

export const metadata: Metadata = {
  title: "Politica de cookies",
  description: "Politica de cookies de Rising Raimon.",
};

export default function CookiesPolicyPage() {
  return (
    <PublicSiteLayout>
      <LegalPage document={cookiesPolicyContent} />
    </PublicSiteLayout>
  );
}
