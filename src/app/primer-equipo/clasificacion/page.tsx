import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicSiteLayout } from "@/components/layout/public-site-layout";
import { TeamStandingsPage } from "@/components/public/team-standings-page";
import { getFirstTeamStandingsContentWithSource } from "@/lib/public/team-standings-content";

export const metadata: Metadata = {
  title: "Clasificacion | Primer Equipo",
  description: "Clasificacion publica del Primer Equipo de Rising Raimon.",
};

export const revalidate = 300;

export default async function FirstTeamStandingPage() {
  const result = await getFirstTeamStandingsContentWithSource();
  const content = result?.content;

  if (!content) {
    notFound();
  }

  return (
    <PublicSiteLayout activeNav="primer-equipo" debugDataSource={result?.dataSource}>
      <TeamStandingsPage content={content} />
    </PublicSiteLayout>
  );
}
