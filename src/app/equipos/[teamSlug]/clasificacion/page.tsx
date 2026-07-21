import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicSiteLayout } from "@/components/layout/public-site-layout";
import { TeamStandingsPage } from "@/components/public/team-standings-page";
import { getAcademyTeamStandingsContent } from "@/lib/public/team-standings-content";
import { getPublicNonFirstTeamSlugsFromDb } from "@/server/services/public/teams";

type TeamStandingsPageProps = {
  params: Promise<{
    teamSlug: string;
  }>;
};

export const revalidate = 300;

export async function generateStaticParams() {
  const teamSlugs = await getPublicNonFirstTeamSlugsFromDb();

  return teamSlugs.map((teamSlug) => ({
    teamSlug,
  }));
}

export async function generateMetadata({
  params,
}: TeamStandingsPageProps): Promise<Metadata> {
  const { teamSlug } = await params;
  const content = await getAcademyTeamStandingsContent(teamSlug);

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
  const content = await getAcademyTeamStandingsContent(teamSlug);

  if (!content) {
    notFound();
  }

  return (
    <PublicSiteLayout activeNav="equipos">
      <TeamStandingsPage content={content} />
    </PublicSiteLayout>
  );
}
