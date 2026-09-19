import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicSiteLayout } from "@/components/layout/public-site-layout";
import { PageHero } from "@/components/public/page-hero";
import { TeamStatisticsPage } from "@/components/public/team-statistics-page";
import { getPublicTeamHeroContent } from "@/lib/public/team-page-content";
import { getFirstTeamStatisticsPageContent } from "@/lib/public/team-statistics-content";
import { parseTeamStatisticsInitialState } from "@/lib/public/team-statistics-url-state";
import { buildPublicPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPublicPageMetadata({
  title: "Estadisticas | Primer Equipo",
  description: "Estadísticas públicas de rendimiento del Primer Equipo de Rising Raimon.",
  path: "/primer-equipo/estadisticas",
});

export const revalidate = 300;

type FirstTeamStatisticsRouteProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function FirstTeamStatisticsRoute({
  searchParams,
}: FirstTeamStatisticsRouteProps) {
  const resolvedSearchParams = await searchParams;
  const [content, heroContent] = await Promise.all([
    getFirstTeamStatisticsPageContent(),
    getPublicTeamHeroContent("primer-equipo"),
  ]);

  if (!content || !heroContent) {
    notFound();
  }

  return (
    <PublicSiteLayout activeNav="primer-equipo">
      <PageHero content={heroContent} activeKey="statistics" />
      <TeamStatisticsPage
        content={content}
        initialState={parseTeamStatisticsInitialState(resolvedSearchParams, content.teamType)}
      />
    </PublicSiteLayout>
  );
}
