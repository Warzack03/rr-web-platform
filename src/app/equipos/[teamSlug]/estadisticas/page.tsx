import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicSiteLayout } from "@/components/layout/public-site-layout";
import { TeamStatisticsPage } from "@/components/public/team-statistics-page";
import { getAcademyTeamStatisticsPageContent } from "@/lib/public/team-statistics-content";

type TeamStatisticsRouteProps = {
  params: Promise<{
    teamSlug: string;
  }>;
};

export async function generateMetadata({
  params,
}: TeamStatisticsRouteProps): Promise<Metadata> {
  const { teamSlug } = await params;
  const content = await getAcademyTeamStatisticsPageContent(teamSlug);

  if (!content) {
    return {
      title: "Estadisticas no encontradas",
    };
  }

  return {
    title: `Estadisticas | ${content.teamName}`,
    description: `Estadisticas resumen del equipo ${content.teamName} en Rising Raimon.`,
  };
}

export default async function AcademyTeamStatisticsRoute({
  params,
}: TeamStatisticsRouteProps) {
  const { teamSlug } = await params;
  const content = await getAcademyTeamStatisticsPageContent(teamSlug);

  if (!content) {
    notFound();
  }

  return (
    <PublicSiteLayout activeNav="equipos">
      <TeamStatisticsPage content={content} />
    </PublicSiteLayout>
  );
}
