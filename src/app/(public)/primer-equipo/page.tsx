import { BadgeInfo, CalendarDays, LayoutList, PlayCircle, ShieldCheck, Trophy } from "lucide-react";
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

const team = getTeamBySlug("primer-equipo");

export default function FirstTeamPage() {
  if (!team) {
    return null;
  }

  const nextMatch = getUpcomingMatch(team.slug);
  const results = getLatestResults(team.slug);
  const players = getTeamPlayers(team.slug);
  const relatedNews = getRelatedNews(team.slug);
  const featuredPlayers = players.slice(0, 2);

  return (
    <div className="space-y-10 pb-20">
      <PageHero
        eyebrow={`${team.category} - Temporada ${team.season}`}
        title={team.name}
        description={team.summary}
        stadium
        meta={
          <>
            <span className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.16em] text-[var(--rr-text-muted)]">
              <BadgeInfo className="h-4 w-4 text-[var(--rr-accent)]" />
              Entrenador: {team.coach}
            </span>
            <span className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.16em] text-[var(--rr-text-muted)]">
              <ShieldCheck className="h-4 w-4 text-[var(--rr-accent)]" />
              Posicion actual {team.position}
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
              <p className="mt-4 font-display text-6xl uppercase text-white sm:text-7xl">{team.position}</p>
              <div className="mt-5 grid grid-cols-3 gap-3">
                <div className="rounded-[16px] bg-black/20 px-3 py-3 text-center">
                  <p className="text-xs uppercase tracking-[0.14em] text-[var(--rr-text-soft)]">Pts</p>
                  <p className="font-display text-2xl text-[var(--rr-accent)] sm:text-3xl">{team.points}</p>
                </div>
                <div className="rounded-[16px] bg-black/20 px-3 py-3 text-center">
                  <p className="text-xs uppercase tracking-[0.14em] text-[var(--rr-text-soft)]">GF</p>
                  <p className="font-display text-2xl text-white sm:text-3xl">{team.goalsFor}</p>
                </div>
                <div className="rounded-[16px] bg-black/20 px-3 py-3 text-center">
                  <p className="text-xs uppercase tracking-[0.14em] text-[var(--rr-text-soft)]">GC</p>
                  <p className="font-display text-2xl text-white sm:text-3xl">{team.goalsAgainst}</p>
                </div>
              </div>
            </div>
          </div>
        }
      />

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-5">
          <SectionHeader eyebrow="Proximo partido" title="Siguiente cita competitiva" />
          {nextMatch ? <MatchCard match={nextMatch} variant="featured" /> : null}

          <div className="grid gap-4 sm:grid-cols-3">
            {results.slice(0, 3).map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <StandingsTable rows={getStandings(team.slug)} title="Clasificacion" />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[22px] border border-[var(--rr-border)] bg-[var(--rr-surface)] p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--rr-accent)]">
                Goles a favor
              </p>
              <p className="mt-3 font-display text-5xl text-white sm:text-6xl">{team.goalsFor}</p>
            </div>
            <div className="rounded-[22px] border border-[var(--rr-border)] bg-[var(--rr-surface)] p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--rr-accent)]">
                Maximo goleador
              </p>
              <p className="mt-3 font-display text-4xl text-white">Axel Blaze</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <SectionHeader
            eyebrow="Plantilla"
            title="Resumen premium del bloque"
            description="La plantilla completa deja de estar embebida aqui y pasa a su propia ruta de cromos."
            action={
              <CTAButton href={getTeamRosterHref(team.slug)} size="sm">
                Ver plantilla completa
              </CTAButton>
            }
          />
          <div className="grid gap-4 md:grid-cols-2">
            {featuredPlayers.map((player) => (
              <PlayerRosterCard key={player.slug} player={player} premium />
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <SectionHeader
            eyebrow="Accesos de equipo"
            title="Plantilla, calendario y clasificacion"
            description="Cada pieza importante del Primer Equipo gana su propia pantalla sin convertir este detalle en una pagina infinita."
          />
          <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
            <TeamAccessCard
              href={getTeamRosterHref(team.slug)}
              label="Plantilla"
              title="Cromos premium"
              description="Pagina dedicada a la plantilla con cromos construidos por elementos."
              icon={LayoutList}
            />
            <TeamAccessCard
              href={getTeamCalendarHref(team.slug)}
              label="Calendario"
              title="Ruta de partidos"
              description="Proximos encuentros, resultados recientes y video externo cuando exista."
              icon={CalendarDays}
            />
            <TeamAccessCard
              href={getTeamStandingsHref(team.slug)}
              label="Clasificacion"
              title="Tabla competitiva"
              description="Posiciones, puntos y contexto de la temporada sin mezclar otros equipos."
              icon={Trophy}
            />
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[22px] border border-[var(--rr-border)] bg-[var(--rr-surface-card)] p-6">
          <SectionHeader
            eyebrow="Estadisticas avanzadas"
            title="Resumen tecnico"
            description="Bloque preparado para enlazar despues con datos reales por jugador y por partido."
          />
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              ["Racha", team.streak],
              ["Plantilla activa", `${team.rosterCount}`],
              ["Goles a favor", `${team.goalsFor}`],
              ["Goles en contra", `${team.goalsAgainst}`],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[18px] border border-[var(--rr-border)] bg-black/15 px-4 py-4">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--rr-accent)]">
                  {label}
                </p>
                <p className="mt-2 font-display text-4xl text-white">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[22px] border border-[var(--rr-border)] bg-[var(--rr-surface)] p-6">
          <SectionHeader
            eyebrow="Video"
            title="Partidos con contenido asociado"
            description="Cuando exista video externo de un partido jugado del Primer Equipo, se destaca aqui."
          />
          <div className="mt-6 rounded-[20px] border border-[var(--rr-border)] bg-[rgba(8,20,38,0.68)] p-5">
            <div className="flex items-center gap-3">
              <PlayCircle className="h-5 w-5 text-[var(--rr-accent)]" />
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--rr-accent)]">
                Resumen extendido
              </p>
            </div>
            <h3 className="mt-4 font-display text-3xl uppercase text-white">
              Victoria 2-1 frente a Zeus FC
            </h3>
            <p className="mt-3 text-base leading-7 text-[var(--rr-text-muted)]">
              Area preparada para futuras URLs externas de video, sin subir archivos al proyecto.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <SectionHeader eyebrow="Noticias relacionadas" title="Actualidad del Primer Equipo" />
        <div className="grid gap-4 lg:grid-cols-3">
          {relatedNews.map((item) => (
            <NewsListItem key={item.slug} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
