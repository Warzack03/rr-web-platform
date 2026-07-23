import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicSiteLayout } from "@/components/layout/public-site-layout";
import { TeamOverviewPage } from "@/components/public/team-overview-page";
import { getPublicTeamPageContent } from "@/lib/public/team-page-content";

export const metadata: Metadata = {
  title: "Primer Equipo",
  description: "Resumen publico del Primer Equipo de Rising Raimon.",
};

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
