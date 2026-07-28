import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicSiteLayout } from "@/components/layout/public-site-layout";
import { TeamOverviewPage } from "@/components/public/team-overview-page";
import { getPublicTeamPageContent } from "@/lib/public/team-page-content";
import { buildPublicPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPublicPageMetadata({
  title: "Primer Equipo",
  description: "Resumen, partidos, clasificación y actualidad del Primer Equipo de Rising Raimon.",
  path: "/primer-equipo",
});

export const revalidate = 300;

export default async function FirstTeamPage() {
  const teamSummary = await getPublicTeamPageContent("primer-equipo");

  if (!teamSummary) {
    notFound();
  }

  return (
    <PublicSiteLayout activeNav="primer-equipo">
      <TeamOverviewPage content={teamSummary} />
    </PublicSiteLayout>
  );
}
