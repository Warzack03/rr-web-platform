import { notFound, redirect } from "next/navigation";
import { BadgeInfo, CalendarDays, LayoutList, Trophy, Users } from "lucide-react";
import { CTAButton } from "@/src/components/shared/cta-button";
import { MatchCard } from "@/src/components/shared/match-card";
import { SectionHeader } from "@/src/components/shared/section-header";
import { NewsListItem } from "@/src/components/public/news-list-item";
import { PageHero } from "@/src/components/public/page-hero";
import { PlayerRosterCard } from "@/src/components/public/player-roster-card";
import { StandingsTable } from "@/src/components/public/standings-table";
import { TeamAccessCard } from "@/src/components/public/team-access-card";
import {
  getLatestResults,
  getRelatedNews,
  getStandings,
  getTeamBySlug,
  getTeamPlayers,
  getUpcomingMatch,
} from "@/src/lib/demo-data";
import {
  getTeamCalendarHref,
  getTeamRosterHref,
  getTeamStandingsHref,
} from "@/src/lib/team-routes";

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
  const featuredPlayers = players.slice(0, 2);

  return (
    <div className="space-y-10 pb-20">
      <PageHero
        eyebrow={`${team.clubTag} - ${team.season}`}
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
            <CTAButton href={getTeamCalendarHref(team.slug)}>
              <CalendarDays className="h-4 w-4" />
              Calendario
            </CTAButton>
            <CTAButton href={getTeamStandingsHref(team.slug)} variant="secondary">
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
              <p className="mt-3 font-display text-5xl text-white sm:text-6xl">{team.position}</p>
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

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <SectionHeader
            eyebrow="Plantilla"
            title="Resumen de jugadores"
            description="La plantilla completa se mueve a una pagina dedicada de cromos para que este detalle respire mejor."
            action={
              <CTAButton href={getTeamRosterHref(team.slug)} size="sm">
                Ver plantilla completa
              </CTAButton>
            }
          />
          <div className="grid gap-4 md:grid-cols-2">
            {featuredPlayers.map((player) => (
              <PlayerRosterCard key={player.slug} player={player} />
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <SectionHeader
            eyebrow="Accesos del equipo"
            title="Secciones propias"
            description="Calendario, clasificacion y plantilla dejan de mezclarse con el detalle general."
          />
          <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
            <TeamAccessCard
              href={getTeamRosterHref(team.slug)}
              label="Plantilla"
              title="Cromos del equipo"
              description="Pagina especifica con plantilla completa y acceso a cada ficha de jugador."
              icon={LayoutList}
            />
            <TeamAccessCard
              href={getTeamCalendarHref(team.slug)}
              label="Calendario"
              title="Partidos del equipo"
              description="Estado de encuentros, proximos compromisos y ultimos resultados."
              icon={CalendarDays}
            />
            <TeamAccessCard
              href={getTeamStandingsHref(team.slug)}
              label="Clasificacion"
              title="Tabla manual"
              description="Posicion, puntos y rivales directos dentro de la competicion actual."
              icon={Trophy}
            />
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[22px] border border-[var(--rr-border)] bg-[var(--rr-surface-card)] p-6">
          <SectionHeader
            eyebrow="Estadisticas basicas"
            title="Resumen del equipo"
            description="El detalle estandar conserva contexto competitivo y accesos claros sin cargar la pagina con toda la plantilla."
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

      <section className="rounded-[22px] border border-[var(--rr-border)] bg-[var(--rr-surface-card)] p-6">
        <SectionHeader
          eyebrow="Cuerpo tecnico"
          title="Entrenadores visibles"
          description="Bloque breve para reforzar el contexto del equipo sin convertir la pantalla en una plantilla completa."
        />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-[20px] border border-[var(--rr-border)] bg-black/15 p-5">
            <div className="inline-flex rounded-full bg-[var(--rr-accent)]/10 p-3 text-[var(--rr-accent)]">
              <Users className="h-5 w-5" />
            </div>
            <p className="mt-4 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--rr-accent)]">
              Entrenador principal
            </p>
            <p className="mt-2 font-display text-3xl uppercase text-white">{team.coach}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
