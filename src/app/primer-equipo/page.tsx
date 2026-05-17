import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicSiteLayout } from "@/components/layout/public-site-layout";
import { NewsCard } from "@/components/public/news-card";
import { PageHero } from "@/components/public/page-hero";
import {
  MatchPreviewPanel,
  MetricTile,
  RecentResultsStrip,
  StandingSummaryPanel,
  TeamNewsPreview,
  TopScorerPanel,
} from "@/components/public/team-overview-panels";
import { getPublicTeamPageContent } from "@/lib/public/team-page-content";

export const metadata: Metadata = {
  title: "Primer Equipo",
  description: "Resumen publico del Primer Equipo de Rising Raimon.",
};

export default async function FirstTeamPage() {
  const teamSummary = await getPublicTeamPageContent("primer-equipo");

  if (!teamSummary) {
    notFound();
  }

  return (
    <PublicSiteLayout activeNav="primer-equipo">
      <PageHero
        competition={teamSummary.competition}
        season={teamSummary.season}
        title={teamSummary.name}
        coach={teamSummary.coach}
        backgroundImageUrl={teamSummary.heroImageUrl}
        backgroundPosition={teamSummary.heroImagePosition}
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
            <TeamNewsPreview>
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
