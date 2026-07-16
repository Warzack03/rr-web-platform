import type { Metadata } from "next";
import { PublicSiteLayout } from "@/components/layout/public-site-layout";
import { NewsCard } from "@/components/public/news-card";
import { PageHero, PageHeroIcons } from "@/components/public/page-hero";
import { PublicEmptyState } from "@/components/public/public-empty-state";
import {
  MatchPreviewPanel,
  MetricTile,
  RecentResultsStrip,
  StandingSummaryPanel,
  TeamNewsPreview,
  TopScorerPanel,
} from "@/components/public/team-overview-panels";
import { getPublicAcademyTeamPageContentWithSource } from "@/lib/public/team-page-content";

type TeamDetailPageProps = {
  params: Promise<{
    teamSlug: string;
  }>;
};

export async function generateMetadata({
  params,
}: TeamDetailPageProps): Promise<Metadata> {
  const { teamSlug } = await params;
  const result = await getPublicAcademyTeamPageContentWithSource(teamSlug);
  const teamSummary = result?.content;

  if (!teamSummary) {
    return {
      title: "Equipo no encontrado",
    };
  }

  return {
    title: `${teamSummary.name} | Equipos`,
    description: `Detalle publico de ${teamSummary.name} en Rising Raimon.`,
  };
}

export default async function AcademyTeamDetailPage({
  params,
}: TeamDetailPageProps) {
  const { teamSlug } = await params;
  const result = await getPublicAcademyTeamPageContentWithSource(teamSlug);
  const teamSummary = result?.content;

  if (!teamSummary) {
    return (
      <PublicSiteLayout activeNav="equipos">
        <PublicEmptyState
          title="No hay datos del equipo"
          description="Cuando este equipo tenga datos publicados en la DB, se mostrara su resumen aqui."
        />
      </PublicSiteLayout>
    );
  }

  return (
    <PublicSiteLayout activeNav="equipos" debugDataSource={result?.dataSource}>
      <PageHero
        chips={[
          { label: teamSummary.category, tone: "accent" },
          { label: teamSummary.season },
          { label: teamSummary.competition },
        ]}
        title={teamSummary.name}
        coaches={teamSummary.coaches}
        actions={[
          {
            href: teamSummary.links.squad,
            label: "Plantilla",
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
        variant="academy"
      />

      <section className="mx-auto w-full max-w-[1280px] px-5 py-10 md:px-8 md:py-14 xl:px-16">
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="order-1 lg:col-span-8">
            <MatchPreviewPanel match={teamSummary.nextMatch} compact />
          </div>

          <div className="order-2 lg:col-span-4">
            <StandingSummaryPanel {...teamSummary.standing} />
          </div>

          <div className="order-3 lg:col-span-8">
            <RecentResultsStrip
              results={teamSummary.recentResults}
              ctaHref={teamSummary.links.calendar}
              ctaLabel="Ver calendario"
            />
          </div>

          <div className="order-4 grid gap-4 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-2">
            <MetricTile label="Goles a Favor" value={teamSummary.metrics.goalsFor} />
            <MetricTile label="Goles en Contra" value={teamSummary.metrics.goalsAgainst} />
          </div>

          {teamSummary.news.length > 0 ? (
            <div className="order-5 lg:col-span-8">
              <TeamNewsPreview title="Noticias relacionadas">
                {teamSummary.news.slice(0, 2).map((item) => (
                  <NewsCard key={item.title} {...item} />
                ))}
              </TeamNewsPreview>
            </div>
          ) : null}

          {teamSummary.topScorer ? (
            <div className="order-6 lg:col-span-4">
              <TopScorerPanel {...teamSummary.topScorer} />
            </div>
          ) : null}
        </div>
      </section>
    </PublicSiteLayout>
  );
}
