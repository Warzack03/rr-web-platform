import { CalendarDays, LayoutList, Trophy } from "lucide-react";
import type {
  DemoMatch,
  DemoPlayer,
  DemoStandingRow,
  DemoTeam,
} from "@/src/lib/demo-data";
import { CTAButton } from "@/src/components/shared/cta-button";
import { MatchCard } from "@/src/components/shared/match-card";
import { SectionHeader } from "@/src/components/shared/section-header";
import { MatchesTable } from "@/src/components/public/matches-table";
import { PageHero } from "@/src/components/public/page-hero";
import { PlayerRosterCard } from "@/src/components/public/player-roster-card";
import { StandingsTable } from "@/src/components/public/standings-table";
import {
  getTeamCalendarHref,
  getTeamOverviewHref,
  getTeamRosterHref,
  getTeamStandingsHref,
} from "@/src/lib/team-routes";

type TeamRosterPageContentProps = {
  team: DemoTeam;
  players: DemoPlayer[];
};

export function TeamRosterPageContent({
  team,
  players,
}: TeamRosterPageContentProps) {
  const premium = team.isFirstTeam;

  return (
    <div className="space-y-10 pb-20">
      <PageHero
        eyebrow={premium ? "Plantilla premium" : "Plantilla del equipo"}
        title={`${team.name} - Plantilla`}
        description="Los cromos viven en su propia pantalla para dar mas aire al detalle general del equipo."
        stadium={premium}
        actions={
          <>
            <CTAButton href={getTeamOverviewHref(team.slug)} variant="secondary">
              Volver al equipo
            </CTAButton>
            <CTAButton href={getTeamCalendarHref(team.slug)}>
              <CalendarDays className="h-4 w-4" />
              Ver calendario
            </CTAButton>
          </>
        }
      />

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <SectionHeader
            eyebrow="Cromos"
            title={premium ? "Bloque premium del Primer Equipo" : "Cromos generados por la web"}
            description="La composicion queda preparada para foto base, dorsal, posicion, pie dominante, bandera y produccion estadistica."
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {players.map((player) => (
              <PlayerRosterCard key={player.slug} player={player} premium={premium} />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[22px] border border-[var(--rr-border)] bg-[var(--rr-surface-card)] p-6">
            <SectionHeader
              eyebrow="Resumen de plantilla"
              title="Contexto rapido"
              description="Bloque de apoyo para no depender de una sola tarjeta protagonista."
            />
            <div className="mt-6 grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
              {[
                ["Jugadores", `${players.length}`],
                ["Competicion", team.competition],
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

          <div className="grid gap-4">
            <CTAButton href={getTeamCalendarHref(team.slug)}>
              <CalendarDays className="h-4 w-4" />
              Calendario del equipo
            </CTAButton>
            <CTAButton href={getTeamStandingsHref(team.slug)} variant="ghost">
              <Trophy className="h-4 w-4" />
              Clasificacion del equipo
            </CTAButton>
          </div>
        </div>
      </section>
    </div>
  );
}

type TeamCalendarPageContentProps = {
  team: DemoTeam;
  nextMatch: DemoMatch | null;
  results: DemoMatch[];
  matches: DemoMatch[];
};

export function TeamCalendarPageContent({
  team,
  nextMatch,
  results,
  matches,
}: TeamCalendarPageContentProps) {
  return (
    <div className="space-y-10 pb-20">
      <PageHero
        eyebrow="Calendario"
        title={`${team.name} - Partidos`}
        description="Cada equipo gana su propio calendario y deja de mezclarse con el resto en una sola pagina global."
        stadium={team.isFirstTeam}
        actions={
          <>
            <CTAButton href={getTeamOverviewHref(team.slug)} variant="secondary">
              Volver al equipo
            </CTAButton>
            <CTAButton href={getTeamRosterHref(team.slug)}>
              <LayoutList className="h-4 w-4" />
              Ver plantilla
            </CTAButton>
          </>
        }
      />

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-5">
          <SectionHeader
            eyebrow="Proximo partido"
            title="Siguiente compromiso"
            description="La vista mantiene la jerarquia del partido principal y deja el historico completo debajo."
          />
          {nextMatch ? <MatchCard match={nextMatch} variant="featured" /> : null}
          <div className="grid gap-4 sm:grid-cols-2">
            {results.slice(0, 2).map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </div>

        <div className="rounded-[22px] border border-[var(--rr-border)] bg-[var(--rr-surface-card)] p-6">
          <SectionHeader
            eyebrow="Resumen"
            title="Contexto competitivo"
            description="Estado actual del equipo dentro de la temporada activa."
          />
          <div className="mt-6 grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
            {[
              ["Competicion", team.competition],
              ["Racha", team.streak],
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
      </section>

      <MatchesTable title="Calendario del equipo" matches={matches} />
    </div>
  );
}

type TeamStandingsPageContentProps = {
  team: DemoTeam;
  rows: DemoStandingRow[];
};

export function TeamStandingsPageContent({
  team,
  rows,
}: TeamStandingsPageContentProps) {
  return (
    <div className="space-y-10 pb-20">
      <PageHero
        eyebrow="Clasificacion"
        title={`${team.name} - Tabla competitiva`}
        description="La clasificacion se lee en contexto de equipo, sin mezclar temporadas ni categorias distintas."
        stadium={team.isFirstTeam}
        actions={
          <>
            <CTAButton href={getTeamOverviewHref(team.slug)} variant="secondary">
              Volver al equipo
            </CTAButton>
            <CTAButton href={getTeamCalendarHref(team.slug)}>
              <CalendarDays className="h-4 w-4" />
              Ver calendario
            </CTAButton>
          </>
        }
      />

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <StandingsTable rows={rows} title={`${team.competition} - ${team.season}`} />

        <div className="rounded-[22px] border border-[var(--rr-border)] bg-[var(--rr-surface-card)] p-6">
          <SectionHeader
            eyebrow="Resumen"
            title="Posicion del equipo"
            description="Lectura corta para acompañar la tabla sin recargar la pantalla."
          />
          <div className="mt-6 grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
            {[
              ["Posicion", team.position],
              ["Puntos", `${team.points}`],
              ["Goles", `${team.goalsFor}-${team.goalsAgainst}`],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[18px] border border-[var(--rr-border)] bg-black/15 px-4 py-4">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--rr-accent)]">
                  {label}
                </p>
                <p className="mt-2 font-display text-3xl text-white">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-3">
            <CTAButton href={getTeamRosterHref(team.slug)}>
              <LayoutList className="h-4 w-4" />
              Ver plantilla
            </CTAButton>
            <CTAButton href={getTeamCalendarHref(team.slug)} variant="ghost">
              <CalendarDays className="h-4 w-4" />
              Ir al calendario
            </CTAButton>
          </div>
        </div>
      </section>
    </div>
  );
}
