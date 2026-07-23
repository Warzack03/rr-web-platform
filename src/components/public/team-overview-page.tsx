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
import type { PublicTeamPageContent } from "@/lib/contracts/public";

type TeamOverviewPageProps = {
  content: PublicTeamPageContent;
};

export function TeamOverviewPage({ content }: TeamOverviewPageProps) {
  const isFirstTeam = content.variant === "first-team";

  return (
    <>
      <PageHero
        chips={buildTeamHeroChips(content)}
        title={content.name}
        coaches={content.coaches}
        actions={[
          {
            href: content.links.squad,
            label: "Plantilla",
            icon: PageHeroIcons.squad,
          },
          {
            href: content.links.calendar,
            label: "Calendario",
            icon: PageHeroIcons.calendar,
            variant: "secondary",
          },
          {
            href: content.links.standing,
            label: "Clasificacion",
            icon: PageHeroIcons.standing,
            variant: "secondary",
          },
          {
            href: content.links.statistics,
            label: "Estadisticas",
            icon: PageHeroIcons.statistics,
            variant: "secondary",
          },
        ]}
        backgroundImageUrl={content.heroImageUrl}
        backgroundPosition={content.heroImagePosition}
        variant={content.variant}
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

          <div className="order-4 grid gap-4 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-2">
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

function buildTeamHeroChips(content: PublicTeamPageContent) {
  if (content.variant === "first-team") {
    return [
      { label: content.competition, tone: "accent" as const },
      { label: content.season },
    ];
  }

  return [
    { label: content.category, tone: "accent" as const },
    { label: content.season },
    { label: content.competition },
  ];
}
