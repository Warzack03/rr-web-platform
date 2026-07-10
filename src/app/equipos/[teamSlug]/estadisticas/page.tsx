import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicSiteLayout } from "@/components/layout/public-site-layout";
import { TeamStatisticsPage } from "@/components/public/team-statistics-page";
import { getAcademyTeamStatisticsPageContentWithSource } from "@/lib/public/team-statistics-content";
import { parseTeamStatisticsInitialState } from "@/lib/public/team-statistics-url-state";

type TeamStatisticsRouteProps = {
  params: Promise<{
    teamSlug: string;
  }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const revalidate = 300;

export async function generateMetadata({
  params,
}: TeamStatisticsRouteProps): Promise<Metadata> {
  const { teamSlug } = await params;
  const result = await getAcademyTeamStatisticsPageContentWithSource(teamSlug);
  const content = result?.content;

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
  searchParams,
}: TeamStatisticsRouteProps) {
  const { teamSlug } = await params;
  const resolvedSearchParams = await searchParams;
  const result = await getAcademyTeamStatisticsPageContentWithSource(teamSlug);
  const content = result?.content;

  if (!content) {
    notFound();
  }

  return (
    <PublicSiteLayout activeNav="equipos" debugDataSource={result?.dataSource}>
      <TeamStatisticsPage
        content={content}
        initialState={parseTeamStatisticsInitialState(resolvedSearchParams, content.teamType)}
      />
    </PublicSiteLayout>
  );
}
