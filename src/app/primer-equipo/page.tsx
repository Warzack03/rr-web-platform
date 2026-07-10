import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicSiteLayout } from "@/components/layout/public-site-layout";
import { NewsCard } from "@/components/public/news-card";
import { PageHero, PageHeroIcons } from "@/components/public/page-hero";
import {
  MatchPreviewPanel,
  MetricTile,
  RecentResultsStrip,
  StandingSummaryPanel,
  TeamNewsPreview,
  TopScorerPanel,
} from "@/components/public/team-overview-panels";
import { getPublicTeamPageContentWithSource } from "@/lib/public/team-page-content";

export const metadata: Metadata = {
  title: "Primer Equipo",
  description: "Resumen publico del Primer Equipo de Rising Raimon.",
};

export default async function FirstTeamPage() {
  const result = await getPublicTeamPageContentWithSource("primer-equipo");
  const teamSummary = result?.content;

  if (!teamSummary || !teamSummary.topScorer) {
    notFound();
  }

  return (
    <PublicSiteLayout activeNav="primer-equipo" debugDataSource={result?.dataSource}>
      <PageHero
        chips={[
          { label: teamSummary.competition, tone: "accent" },
          { label: teamSummary.season },
        ]}
        title={teamSummary.name}
        coaches={teamSummary.coaches}
        actions={[
          {
            href: teamSummary.links.squad,
            label: "Ver plantilla",
            icon: PageHeroIcons.squad,
          },
          {
            href: teamSummary.links.calendar,
            label: "Calendario",
            icon: PageHeroIcons.calendar,
            variant: "secondary",
          },
          {
            href: teamSummary.links.standing,
            label: "Clasificacion",
            icon: PageHeroIcons.standing,
            variant: "secondary",
          },
          {
            href: teamSummary.links.statistics,
            label: "Estadisticas",
            icon: PageHeroIcons.statistics,
            variant: "secondary",
          },
        ]}
        backgroundImageUrl={teamSummary.heroImageUrl}
        backgroundPosition={teamSummary.heroImagePosition}
        variant="first-team"
      />

      <section className="mx-auto w-full max-w-[1280px] px-5 py-10 md:px-8 md:py-14 xl:px-16">
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="order-1 lg:col-span-8">
            <MatchPreviewPanel match={teamSummary.nextMatch} />
          </div>

          <div className="order-2 lg:col-span-4">
            <StandingSummaryPanel {...teamSummary.standing} />
          </div>

          <div className="order-3 lg:col-span-8">
            <RecentResultsStrip results={teamSummary.recentResults} />
          </div>

          <div className="order-4 grid gap-4 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-2">
            <MetricTile label="Goles a Favor" value={teamSummary.metrics.goalsFor} />
            <MetricTile label="Goles en Contra" value={teamSummary.metrics.goalsAgainst} />
          </div>

          <div className="order-6 lg:order-5 lg:col-span-8">
            <TeamNewsPreview title="Actualidad del Primer Equipo">
              {teamSummary.news.map((item) => (
                <NewsCard key={item.title} {...item} />
              ))}
            </TeamNewsPreview>
          </div>

          <div className="order-5 lg:order-6 lg:col-span-4">
            <TopScorerPanel {...teamSummary.topScorer} />
          </div>
        </div>
      </section>
    </PublicSiteLayout>
  );
}
