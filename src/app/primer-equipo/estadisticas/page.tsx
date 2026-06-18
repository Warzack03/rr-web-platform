import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicSiteLayout } from "@/components/layout/public-site-layout";
import { TeamStatisticsPage } from "@/components/public/team-statistics-page";
import { getFirstTeamStatisticsPageContent } from "@/lib/public/team-statistics-content";
import { parseTeamStatisticsInitialState } from "@/lib/public/team-statistics-url-state";

export const metadata: Metadata = {
  title: "Estadisticas | Primer Equipo",
  description: "Estadisticas resumen del Primer Equipo de Rising Raimon.",
};

type FirstTeamStatisticsRouteProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function FirstTeamStatisticsRoute({
  searchParams,
}: FirstTeamStatisticsRouteProps) {
  const resolvedSearchParams = await searchParams;
  const content = await getFirstTeamStatisticsPageContent();

  if (!content) {
    notFound();
  }

  return (
    <PublicSiteLayout activeNav="primer-equipo">
      <TeamStatisticsPage
        content={content}
        initialState={parseTeamStatisticsInitialState(resolvedSearchParams, content.teamType)}
      />
    </PublicSiteLayout>
  );
}
