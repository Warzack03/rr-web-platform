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
import type { PublicTeamPageContent } from "@/lib/contracts/public";

type TeamOverviewPageProps = {
  content: PublicTeamPageContent;
};

export function TeamOverviewPage({ content }: TeamOverviewPageProps) {
  const isFirstTeam = content.variant === "first-team";

  return (
    <>
      <PageHero
        content={content}
        activeKey="overview"
      />

      <section className="mx-auto w-full max-w-[1280px] px-5 py-10 md:px-8 md:py-14 xl:px-16">
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="order-1 lg:col-span-8">
            <MatchPreviewPanel match={content.nextMatch} compact={!isFirstTeam} />
          </div>

          <div className="order-2 lg:col-span-4">
            <StandingSummaryPanel {...content.standing} />
          </div>

          <div className="order-3 lg:col-span-8">
            <RecentResultsStrip
              results={content.recentResults}
              ctaHref={isFirstTeam ? undefined : content.links.calendar}
              ctaLabel={isFirstTeam ? undefined : "Ver calendario"}
            />
          </div>

          <div className="order-4 grid self-start gap-4 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-2">
            <MetricTile label="Goles a Favor" value={content.metrics.goalsFor} />
            <MetricTile label="Goles en Contra" value={content.metrics.goalsAgainst} />
          </div>

          {content.news.length > 0 ? (
            <div className={isFirstTeam ? "order-6 lg:order-5 lg:col-span-8" : "order-5 lg:col-span-8"}>
              <TeamNewsPreview title={isFirstTeam ? "Actualidad del Primer Equipo" : "Noticias relacionadas"}>
                {(isFirstTeam ? content.news : content.news.slice(0, 2)).map((item) => (
                  <NewsCard key={item.title} {...item} />
                ))}
              </TeamNewsPreview>
            </div>
          ) : null}

          {content.topScorer ? (
            <div className={isFirstTeam ? "order-5 lg:order-6 lg:col-span-4" : "order-6 lg:col-span-4"}>
              <TopScorerPanel {...content.topScorer} />
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}
