import { notFound, redirect } from "next/navigation";
import { BadgeInfo, CalendarDays, Trophy } from "lucide-react";
import { CTAButton } from "@/src/components/shared/cta-button";
import { MatchCard } from "@/src/components/shared/match-card";
import { SectionHeader } from "@/src/components/shared/section-header";
import { NewsListItem } from "@/src/components/public/news-list-item";
import { PageHero } from "@/src/components/public/page-hero";
import { PlayerCard } from "@/src/components/public/player-card";
import { StandingsTable } from "@/src/components/public/standings-table";
import {
  getLatestResults,
  getRelatedNews,
  getStandings,
  getTeamBySlug,
  getTeamPlayers,
  getUpcomingMatch,
} from "@/src/lib/demo-data";

export default async function TeamDetailPage({
  params,
}: {
  params: Promise<{ teamSlug: string }>;
}) {
  const { teamSlug } = await params;
  const team = getTeamBySlug(teamSlug);

  if (!team) {
    notFound();
  }

  if (team.isFirstTeam) {
    redirect("/primer-equipo");
  }

  const nextMatch = getUpcomingMatch(team.slug);
  const results = getLatestResults(team.slug);
  const players = getTeamPlayers(team.slug);
  const news = getRelatedNews(team.slug);

  return (
    <div className="space-y-10 pb-20">
      <PageHero
        eyebrow={`${team.clubTag} · ${team.season}`}
        title={team.name}
        description={team.summary}
        meta={
          <>
            <span className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.16em] text-[var(--rr-text-muted)]">
              <Trophy className="h-4 w-4 text-[var(--rr-accent)]" />
              {team.competition}
            </span>
            <span className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.16em] text-[var(--rr-text-muted)]">
              <BadgeInfo className="h-4 w-4 text-[var(--rr-accent)]" />
              Entrenador: {team.coach}
            </span>
          </>
        }
        actions={
          <>
            <CTAButton href="/partidos">
              <CalendarDays className="h-4 w-4" />
              Calendario
            </CTAButton>
            <CTAButton href="/clasificaciones" variant="secondary">
              Clasificacion
            </CTAButton>
          </>
        }
        rightPanel={
          <div className="grid w-full max-w-[360px] gap-4">
            <div className="rounded-[22px] border border-[var(--rr-border)] bg-[rgba(8,20,38,0.72)] p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--rr-accent)]">
                Posicion actual
              </p>
              <p className="mt-3 font-display text-6xl text-white">{team.position}</p>
              <p className="mt-3 text-base text-[var(--rr-text-muted)]">{team.competition}</p>
            </div>
          </div>
        }
      />

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-5">
          <SectionHeader eyebrow="Partido destacado" title="Siguiente encuentro" />
          {nextMatch ? <MatchCard match={nextMatch} variant="featured" /> : null}
          <div className="grid gap-4 sm:grid-cols-2">
            {results.slice(0, 2).map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <StandingsTable rows={getStandings(team.slug)} title="Clasificacion manual" />
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["Goles a favor", `${team.goalsFor}`],
              ["Goles en contra", `${team.goalsAgainst}`],
              ["Plantilla", `${team.rosterCount}`],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[20px] border border-[var(--rr-border)] bg-[var(--rr-surface)] p-4">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--rr-accent)]">
                  {label}
                </p>
                <p className="mt-2 font-display text-4xl text-white">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <SectionHeader eyebrow="Plantilla" title="Cromos generados por la web" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {players.map((player) => (
            <PlayerCard key={player.slug} player={player} />
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[22px] border border-[var(--rr-border)] bg-[var(--rr-surface-card)] p-6">
          <SectionHeader
            eyebrow="Estadisticas basicas"
            title="Resumen del equipo"
            description="El detalle estandar es mas simple que el del Primer Equipo, pero conserva contexto y jerarquia."
          />
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              ["Racha", team.streak],
              ["Puntos", `${team.points}`],
              ["Promedio GF", team.statsSummary],
              ["Temporada", team.season],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[18px] border border-[var(--rr-border)] bg-black/15 px-4 py-4">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--rr-accent)]">
                  {label}
                </p>
                <p className="mt-2 font-display text-3xl text-white">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <SectionHeader eyebrow="Actualidad" title="Noticias relacionadas" />
          {news.length > 0 ? (
            news.map((item) => <NewsListItem key={item.slug} item={item} />)
          ) : (
            <div className="rounded-[22px] border border-[var(--rr-border)] bg-[var(--rr-surface)] p-5 text-[var(--rr-text-muted)]">
              Sin noticias relacionadas por ahora.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
