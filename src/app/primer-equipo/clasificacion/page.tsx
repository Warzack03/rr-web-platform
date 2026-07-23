import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicSiteLayout } from "@/components/layout/public-site-layout";
import { TeamStandingsPage } from "@/components/public/team-standings-page";
import { getFirstTeamStandingsContentFromDb } from "@/server/services/public/standings";

export const metadata: Metadata = {
  title: "Clasificacion | Primer Equipo",
  description: "Clasificacion publica del Primer Equipo de Rising Raimon.",
};

export const revalidate = 300;

export default async function FirstTeamStandingPage() {
  const content = await getFirstTeamStandingsContentFromDb();

  if (!content) {
    notFound();
  }

  return (
    <PublicSiteLayout activeNav="primer-equipo">
      <TeamStandingsPage content={content} />
    </PublicSiteLayout>
  );
}
