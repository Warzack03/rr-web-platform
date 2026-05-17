import type { ReactNode } from "react";
import Link from "next/link";
import { CalendarDays, ChartNoAxesColumn, Clock3, MapPin, Shield, Trophy } from "lucide-react";
import { SectionLabel } from "@/components/public/section-label";
import { cn } from "@/lib/utils";

type TeamStub = {
  name: string;
  highlight?: boolean;
};

type MatchPreview = {
  home: TeamStub;
  away: TeamStub;
  competition: string;
  dateLabel: string;
  venue: string;
};

type MatchPreviewPanelProps = {
  match: MatchPreview;
};

export function MatchPreviewPanel({ match }: MatchPreviewPanelProps) {
  return (
    <section className="rr-panel relative overflow-hidden p-6 md:p-8">
      <div className="absolute inset-y-0 right-0 hidden w-52 bg-[linear-gradient(270deg,rgba(5,12,22,0.26),transparent)] lg:block" />
      <SectionLabel icon={CalendarDays}>Proximo Partido</SectionLabel>
      <div className="mt-7 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center justify-center gap-6 sm:gap-10 lg:flex-1 lg:justify-start">
          <MatchTeamBadge team={match.home} />
          <div className="rr-display text-[3.3rem] leading-none text-[color:var(--rr-muted)] sm:text-[4rem]">
            VS
          </div>
          <MatchTeamBadge team={match.away} />
        </div>

        <div className="w-full max-w-[16rem] border-l-2 border-[color:var(--rr-gold)] bg-[rgba(7,22,41,0.42)] px-4 py-4 sm:px-5 lg:w-[16rem]">
          <p className="rr-kicker text-[0.88rem] text-[color:var(--rr-gold)]">{match.competition}</p>
          <div className="mt-3 space-y-2 text-[1.22rem] text-white">
            <div className="flex items-center gap-2">
              <Clock3 className="h-4 w-4 text-[color:var(--rr-muted)]" strokeWidth={1.8} />
              <span>{match.dateLabel}</span>
            </div>
            <div className="flex items-center gap-2 text-[color:var(--rr-muted)]">
              <MapPin className="h-4 w-4" strokeWidth={1.8} />
              <span>{match.venue}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MatchTeamBadge({ team }: { team: TeamStub }) {
  return (
    <div className="text-center">
      <div
        className={cn(
          "mx-auto flex h-20 w-20 items-center justify-center rounded-[10px] border bg-[rgba(8,17,28,0.5)] sm:h-24 sm:w-24",
          team.highlight ? "border-[color:var(--rr-gold)]" : "border-[color:var(--rr-border)]",
        )}
      >
        <Shield
          className={cn("h-9 w-9", team.highlight ? "text-[color:var(--rr-gold)]" : "text-[color:var(--rr-muted)]")}
          strokeWidth={1.8}
        />
      </div>
      <div className="rr-kicker mt-3 text-[0.96rem] text-white">{team.name}</div>
    </div>
  );
}

type ResultItem = {
  opponent: string;
  score: string;
  result: "V" | "E" | "D";
};

type RecentResultsStripProps = {
  results: ResultItem[];
};

export function RecentResultsStrip({ results }: RecentResultsStripProps) {
  return (
    <section className="rr-panel-dark p-5 md:p-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="rr-kicker text-[0.96rem] text-[color:var(--rr-muted)]">Ultimos Resultados</h2>
        <div className="rr-bolt-divider w-20" />
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {results.map((result) => {
          const accent =
            result.result === "V"
              ? "border-[color:var(--rr-gold)] text-[color:var(--rr-gold)]"
              : result.result === "D"
                ? "border-[#d64045] text-[#f18386]"
                : "border-white/18 text-[color:var(--rr-muted)]";

          return (
            <article
              key={`${result.opponent}-${result.score}`}
              className="flex items-center justify-between gap-3 border-l-2 border-[color:var(--rr-gold)] bg-[rgba(255,255,255,0.03)] px-4 py-4"
            >
              <span className="text-[1.12rem] text-white/94">{result.opponent}</span>
              <span className="rr-display text-[2rem] leading-none text-white">{result.score}</span>
              <span className={cn("rr-kicker inline-flex border px-2 py-1 text-[0.86rem]", accent)}>
                {result.result}
              </span>
            </article>
          );
        })}
      </div>
    </section>
  );
}

type StandingSummaryPanelProps = {
  competition: string;
  position: string;
  points: number;
  played: number;
  won: number;
};

export function StandingSummaryPanel({
  competition,
  position,
  points,
  played,
  won,
}: StandingSummaryPanelProps) {
  return (
    <section className="rr-panel border-[color:var(--rr-border-strong)] p-6 md:p-8">
      <div className="text-center">
        <p className="rr-kicker text-[0.92rem] text-[color:var(--rr-gold)]">Posicion Actual</p>
        <div className="rr-display mt-4 text-[6rem] leading-none text-white">{position}</div>
        <p className="mt-2 text-[1.15rem] text-[color:var(--rr-muted)]">{competition}</p>
      </div>
      <div className="mt-6 border-t border-white/10 pt-5">
        <div className="grid grid-cols-3 gap-3 text-center">
          <StandingStat label="PTS" value={points} />
          <StandingStat label="PJ" value={played} />
          <StandingStat label="PG" value={won} />
        </div>
        <Link
          href="/primer-equipo/clasificacion"
          className="rr-kicker mt-5 inline-flex text-[0.88rem] text-[color:var(--rr-gold)] transition hover:text-[#ffd46f]"
        >
          Ver clasificacion
        </Link>
      </div>
    </section>
  );
}

function StandingStat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="rr-kicker text-[0.82rem] text-[color:var(--rr-muted)]">{label}</p>
      <p className="rr-display mt-2 text-[2rem] leading-none text-white">{value}</p>
    </div>
  );
}

type MetricTileProps = {
  label: string;
  value: number;
  icon?: "attack" | "defense";
};

export function MetricTile({ label, value, icon = "attack" }: MetricTileProps) {
  return (
    <section className="rr-panel-dark flex min-h-[11rem] flex-col justify-between p-5">
      <div className="text-[color:var(--rr-muted)]">
        {icon === "attack" ? (
          <Trophy className="h-5 w-5" strokeWidth={1.8} />
        ) : (
          <Shield className="h-5 w-5" strokeWidth={1.8} />
        )}
      </div>
      <div>
        <div className="rr-display text-[3rem] leading-none text-white">{value}</div>
        <p className="rr-kicker mt-2 text-[0.88rem] text-[color:var(--rr-muted)]">{label}</p>
      </div>
    </section>
  );
}

type TopScorerPanelProps = {
  name: string;
  goals: number;
};

export function TopScorerPanel({ name, goals }: TopScorerPanelProps) {
  return (
    <section className="rr-panel-dark flex items-center gap-4 p-4">
      <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden border border-white/12 bg-[linear-gradient(180deg,#5f656e_0%,#1d2126_100%)]">
        <div className="h-full w-full bg-[radial-gradient(circle_at_50%_26%,rgba(255,255,255,0.18),transparent_18%),linear-gradient(180deg,rgba(255,255,255,0.08),transparent_42%),linear-gradient(180deg,#3f454e_0%,#121519_100%)]" />
      </div>
      <div className="min-w-0">
        <div className="rr-kicker text-[0.82rem] text-[color:var(--rr-gold)]">Maximo Goleador</div>
        <div className="rr-display truncate text-[2.4rem] leading-none text-white">{name}</div>
        <div className="mt-1 text-[1.05rem] text-[color:var(--rr-muted)]">{goals} goles</div>
      </div>
    </section>
  );
}

type TeamNewsPreviewProps = {
  children: ReactNode;
};

export function TeamNewsPreview({ children }: TeamNewsPreviewProps) {
  return (
    <section className="rr-panel-dark p-5 md:p-6">
      <div className="flex items-center gap-3">
        <ChartNoAxesColumn className="h-5 w-5 text-[color:var(--rr-gold)]" strokeWidth={1.8} />
        <h2 className="rr-kicker text-[0.96rem] text-[color:var(--rr-muted)]">
          Actualidad del Primer Equipo
        </h2>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2">{children}</div>
    </section>
  );
}
