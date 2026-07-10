import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicSiteLayout } from "@/components/layout/public-site-layout";
import { TeamStandingsPage } from "@/components/public/team-standings-page";
import { getAcademyTeamStandingsContentWithSource } from "@/lib/public/team-standings-content";

type TeamStandingsPageProps = {
  params: Promise<{
    teamSlug: string;
  }>;
};

export const revalidate = 300;

export async function generateMetadata({
  params,
}: TeamStandingsPageProps): Promise<Metadata> {
  const { teamSlug } = await params;
  const result = await getAcademyTeamStandingsContentWithSource(teamSlug);
  const content = result?.content;

  if (!content) {
    return {
      title: "Clasificacion no encontrada",
    };
  }

  return {
    title: `Clasificacion | ${content.teamName}`,
    description: `Clasificacion publica de ${content.teamName} en Rising Raimon.`,
  };
}

export default async function TeamStandingPage({
  params,
}: TeamStandingsPageProps) {
  const { teamSlug } = await params;
  const result = await getAcademyTeamStandingsContentWithSource(teamSlug);
  const content = result?.content;

  if (!content) {
    notFound();
  }

  return (
    <PublicSiteLayout activeNav="equipos" debugDataSource={result?.dataSource}>
      <TeamStandingsPage content={content} />
    </PublicSiteLayout>
  );
}
