import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicSiteLayout } from "@/components/layout/public-site-layout";
import { TeamStatisticsPage } from "@/components/public/team-statistics-page";
import { getAcademyTeamStatisticsPageContent } from "@/lib/public/team-statistics-content";
import { parseTeamStatisticsInitialState } from "@/lib/public/team-statistics-url-state";
import { buildPublicPageMetadata } from "@/lib/seo";
import { getPublicNonFirstTeamSlugsFromDb } from "@/server/services/public/teams";

type TeamStatisticsRouteProps = {
  params: Promise<{
    teamSlug: string;
  }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
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
}: TeamStatisticsRouteProps): Promise<Metadata> {
  const { teamSlug } = await params;
  const content = await getAcademyTeamStatisticsPageContent(teamSlug);

  if (!content) {
    return {
      title: "Estadisticas no encontradas",
    };
  }

  return {
    ...buildPublicPageMetadata({
      title: `Estadisticas | ${content.teamName}`,
      description: `Estadísticas públicas de rendimiento de ${content.teamName}.`,
      path: `/equipos/${content.teamSlug}/estadisticas`,
    }),
  };
}

export default async function AcademyTeamStatisticsRoute({
  params,
  searchParams,
}: TeamStatisticsRouteProps) {
  const { teamSlug } = await params;
  const resolvedSearchParams = await searchParams;
  const content = await getAcademyTeamStatisticsPageContent(teamSlug);

  if (!content) {
    notFound();
  }

  return (
    <PublicSiteLayout activeNav="equipos">
      <TeamStatisticsPage
        content={content}
        initialState={parseTeamStatisticsInitialState(resolvedSearchParams, content.teamType)}
      />
    </PublicSiteLayout>
  );
}
