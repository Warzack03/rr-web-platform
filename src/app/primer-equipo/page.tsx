import type { Metadata } from "next";
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
import { PublicSiteLayout } from "@/components/layout/public-site-layout";

export const metadata: Metadata = {
  title: "Primer Equipo",
  description: "Resumen publico del Primer Equipo de Rising Raimon.",
};

const teamSummary = {
  competition: "Primera Division",
  season: "Temporada 2023/24",
  coach: "Seymour Hillman",
  heroImageUrl: undefined as string | undefined,
  nextMatch: {
    home: { name: "Rising Raimon", highlight: true },
    away: { name: "Royal Academy" },
    competition: "Futbol Frontier - Jornada 12",
    dateLabel: "Sab, 24 Nov - 18:00 hrs",
    venue: "Estadio Raimon",
  },
  recentResults: [
    { opponent: "Zeus FC", score: "2 - 1", result: "V" as const },
    { opponent: "Kirkwood", score: "1 - 1", result: "E" as const },
    { opponent: "Alpine", score: "3 - 0", result: "V" as const },
  ],
  standing: {
    competition: "Primera Division",
    position: "1",
    points: 34,
    played: 14,
    won: 11,
  },
  metrics: {
    goalsFor: 32,
    goalsAgainst: 8,
  },
  topScorer: {
    name: "Axel Blaze",
    goals: 14,
  },
  news: [
    {
      href: "/#noticias",
      category: "Entrenamiento",
      title: "Preparacion intensa para el derbi",
      tone: "ball" as const,
    },
    {
      href: "/#noticias",
      category: "Tactica",
      title: "Analisis del rival: puntos clave",
      tone: "tactics" as const,
    },
  ],
};

export default function FirstTeamPage() {
  return (
    <PublicSiteLayout activeNav="primer-equipo">
      <PageHero
        competition={teamSummary.competition}
        season={teamSummary.season}
        title="Primer Equipo"
        coach={teamSummary.coach}
        backgroundImageUrl={teamSummary.heroImageUrl}
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
            <MetricTile label="Goles a Favor" value={teamSummary.metrics.goalsFor} icon="attack" />
            <MetricTile
              label="Goles en Contra"
              value={teamSummary.metrics.goalsAgainst}
              icon="defense"
            />
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
