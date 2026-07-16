import type { ReactNode } from "react";
import Link from "next/link";
import { CalendarDays, ChartNoAxesColumn, Clock3, MapPin, Shield, Users } from "lucide-react";
import { CTAButton } from "@/components/public/cta-button";
import { SectionLabel } from "@/components/public/section-label";
import type {
  MatchResult,
  SquadHighlight,
  TeamQuickInfoItem,
  TeamStub,
} from "@/lib/public/team-page-content";
import { cn } from "@/lib/utils";

type MatchPreview = {
  home: TeamStub;
  away: TeamStub;
  competition: string;
  dateLabel: string;
  venue: string;
  status?: string;
  href?: string;
  actionLabel?: string;
  actionHref?: string;
  actionExternal?: boolean;
};

type MatchPreviewPanelProps = {
  match: MatchPreview;
  compact?: boolean;
};

export function MatchPreviewPanel({ match, compact = false }: MatchPreviewPanelProps) {
  const actionMatchesPanelHref = Boolean(
    match.href && match.actionHref && match.href === match.actionHref && !match.actionExternal,
  );
  const hasStandaloneAction = Boolean(
    match.actionHref && match.actionLabel && !actionMatchesPanelHref,
  );
  const content = (
    <section
      className={cn(
        "rr-panel relative overflow-hidden p-6 md:p-8",
        match.href &&
          !hasStandaloneAction &&
          "transition hover:-translate-y-0.5 hover:border-[color:var(--rr-border-strong)]",
      )}
    >
      <div className="absolute inset-y-0 right-0 hidden w-52 bg-[linear-gradient(270deg,rgba(5,12,22,0.26),transparent)] lg:block" />
      <div className="flex items-start justify-between gap-4">
        <SectionLabel icon={CalendarDays}>Proximo Partido</SectionLabel>
        {match.status ? (
          <span className="rr-kicker border border-white/12 bg-[rgba(255,255,255,0.04)] px-3 py-2 text-[0.82rem] text-[color:var(--rr-muted)]">
            {match.status}
          </span>
        ) : null}
      </div>
      <div
        className={cn(
          "mt-7 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between",
          compact && "mt-6 gap-6",
        )}
      >
        <div className="flex items-center justify-center gap-6 sm:gap-10 lg:flex-1 lg:justify-start">
          <MatchTeamBadge team={match.home} />
          <div
            className={cn(
              "rr-display leading-none text-[color:var(--rr-muted)]",
              compact ? "text-[2.8rem] sm:text-[3.5rem]" : "text-[3.3rem] sm:text-[4rem]",
            )}
          >
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

      {match.actionHref && match.actionLabel ? (
        <div className="mt-7 flex justify-end border-t border-white/10 pt-5">
          {actionMatchesPanelHref ? (
            <span className="rr-kicker inline-flex min-h-11 items-center border border-[color:var(--rr-gold)] px-4 py-3 text-[0.82rem] text-[color:var(--rr-gold)]">
              {match.actionLabel}
            </span>
          ) : match.actionExternal ? (
            <a
              href={match.actionHref}
              target="_blank"
              rel="noreferrer"
              className="rr-kicker inline-flex min-h-11 items-center border border-[color:var(--rr-gold)] px-4 py-3 text-[0.82rem] text-[color:var(--rr-gold)] transition hover:bg-[rgba(253,203,88,0.08)]"
            >
              {match.actionLabel}
            </a>
          ) : (
            <Link
              href={match.actionHref}
              className="rr-kicker inline-flex min-h-11 items-center border border-[color:var(--rr-gold)] px-4 py-3 text-[0.82rem] text-[color:var(--rr-gold)] transition hover:bg-[rgba(253,203,88,0.08)]"
            >
              {match.actionLabel}
            </Link>
          )}
        </div>
      ) : null}
    </section>
  );

  if (!match.href || hasStandaloneAction) {
    return content;
  }

  return (
    <Link href={match.href} className="block">
      {content}
    </Link>
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

type RecentResultsStripProps = {
  results: MatchResult[];
  title?: string;
  ctaHref?: string;
  ctaLabel?: string;
  layout?: "default" | "compact";
};

export function RecentResultsStrip({
  results,
  title = "Ultimos Resultados",
  ctaHref,
  ctaLabel,
  layout = "default",
}: RecentResultsStripProps) {
  return (
    <section className="rr-panel-dark p-5 md:p-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="rr-kicker text-[0.96rem] text-[color:var(--rr-muted)]">{title}</h2>
        {ctaHref && ctaLabel ? (
          <Link
            href={ctaHref}
            className="rr-kicker text-[0.86rem] text-[color:var(--rr-gold)] transition hover:text-[#ffd46f]"
          >
            {ctaLabel}
          </Link>
        ) : (
          <div className="rr-bolt-divider w-20" />
        )}
      </div>
      <div
        className={cn(
          "mt-5 grid gap-3",
          layout === "compact" ? "grid-cols-1" : "md:grid-cols-3",
        )}
      >
        {results.map((result) => {
          const accent =
            result.result === "V"
              ? "border-[color:var(--rr-gold)] text-[color:var(--rr-gold)]"
              : result.result === "D"
                ? "border-[#d64045] text-[#f18386]"
                : "border-white/18 text-[color:var(--rr-muted)]";

          return (
            <article key={`${result.opponent}-${result.score}`}>
              {result.href ? (
                <Link
                  href={result.href}
                  className="flex items-center justify-between gap-3 border-l-2 border-[color:var(--rr-gold)] bg-[rgba(255,255,255,0.03)] px-4 py-4 transition hover:-translate-y-0.5 hover:bg-[rgba(255,255,255,0.05)]"
                >
                  <div className="min-w-0">
                    {result.label ? (
                      <div className="rr-kicker mb-1 text-[0.72rem] text-[color:var(--rr-muted)]">{result.label}</div>
                    ) : null}
                    <span className="block truncate text-[1.12rem] text-white/94">{result.opponent}</span>
                  </div>
                  <span className="rr-display text-[2rem] leading-none text-white">{result.score}</span>
                  <span className={cn("rr-kicker inline-flex border px-2 py-1 text-[0.86rem]", accent)}>
                    {result.result}
                  </span>
                </Link>
              ) : (
                <div className="flex items-center justify-between gap-3 border-l-2 border-[color:var(--rr-gold)] bg-[rgba(255,255,255,0.03)] px-4 py-4">
                  <div className="min-w-0">
                    {result.label ? (
                      <div className="rr-kicker mb-1 text-[0.72rem] text-[color:var(--rr-muted)]">{result.label}</div>
                    ) : null}
                    <span className="block truncate text-[1.12rem] text-white/94">{result.opponent}</span>
                  </div>
                  <span className="rr-display text-[2rem] leading-none text-white">{result.score}</span>
                  <span className={cn("rr-kicker inline-flex border px-2 py-1 text-[0.86rem]", accent)}>
                    {result.result}
                  </span>
                </div>
              )}
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
  href: string;
  ctaLabel?: string;
};

export function StandingSummaryPanel({
  position,
  points,
  played,
  won,
  href,
  ctaLabel = "Ver clasificacion",
}: StandingSummaryPanelProps) {
  return (
    <section className="rr-panel border-[color:var(--rr-border-strong)] p-6 md:p-8">
      <div className="text-center">
        <p className="rr-kicker text-[0.92rem] text-[color:var(--rr-gold)]">Posicion Actual</p>
        <div className="rr-display mt-4 flex items-start justify-center gap-1 text-white">
          <span className="text-[6rem] leading-none">{position}</span>
          <span className="translate-y-2 text-[2.1rem] leading-none">º</span>
        </div>
      </div>
      <div className="mt-6 border-t border-white/10 pt-5">
        <div className="grid grid-cols-3 gap-3 text-center">
          <StandingStat label="PTS" value={points} />
          <StandingStat label="PJ" value={played} />
          <StandingStat label="PG" value={won} />
        </div>
        <Link
          href={href}
          className="rr-kicker mt-5 inline-flex text-[0.88rem] text-[color:var(--rr-gold)] transition hover:text-[#ffd46f]"
        >
          {ctaLabel}
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
};

export function MetricTile({ label, value }: MetricTileProps) {
  return (
    <section className="rr-panel-dark flex min-h-[8.5rem] flex-col justify-end p-5">
      <div className="rr-display text-[3rem] leading-none text-white">{value}</div>
      <p className="rr-kicker mt-2 text-[0.88rem] text-[color:var(--rr-muted)]">{label}</p>
    </section>
  );
}

type TopScorerPanelProps = {
  name: string;
  goals: number;
  href?: string;
};

export function TopScorerPanel({ name, goals, href }: TopScorerPanelProps) {
  const content = (
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

  if (!href) {
    return content;
  }

  return (
    <Link href={href} className="block transition hover:-translate-y-0.5">
      {content}
    </Link>
  );
}

type TeamNewsPreviewProps = {
  children: ReactNode;
  title?: string;
};

export function TeamNewsPreview({
  children,
  title = "Actualidad del Primer Equipo",
}: TeamNewsPreviewProps) {
  return (
    <section className="rr-panel-dark p-5 md:p-6">
      <div className="flex items-center gap-3">
        <ChartNoAxesColumn className="h-5 w-5 text-[color:var(--rr-gold)]" strokeWidth={1.8} />
        <h2 className="rr-kicker text-[0.96rem] text-[color:var(--rr-muted)]">{title}</h2>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2">{children}</div>
    </section>
  );
}

type SquadPreviewPanelProps = {
  totalPlayers: number;
  goalkeepers?: number;
  highlights: SquadHighlight[];
  href: string;
};

export function SquadPreviewPanel({
  totalPlayers,
  goalkeepers,
  highlights,
  href,
}: SquadPreviewPanelProps) {
  return (
    <section className="rr-panel-dark p-5 md:p-6">
      <div className="flex items-center justify-between gap-4">
        <SectionLabel icon={Users}>Plantilla</SectionLabel>
        <Link
          href={href}
          className="rr-kicker hidden text-[0.86rem] text-[color:var(--rr-gold)] transition hover:text-[#ffd46f] sm:inline-flex"
        >
          Plantilla
        </Link>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="border border-white/10 bg-[rgba(255,255,255,0.03)] p-4">
            <p className="rr-kicker text-[0.82rem] text-[color:var(--rr-muted)]">Jugadores</p>
            <p className="rr-display mt-3 text-[3rem] leading-none text-white">{totalPlayers}</p>
          </div>
          <div className="border border-white/10 bg-[rgba(255,255,255,0.03)] p-4">
            <p className="rr-kicker text-[0.82rem] text-[color:var(--rr-muted)]">Porteros</p>
            <p className="rr-display mt-3 text-[3rem] leading-none text-white">{goalkeepers ?? "-"}</p>
          </div>
        </div>

        <div className="space-y-3">
          {highlights.map((player) => (
            <SquadHighlightItem
              key={`${player.name}-${player.number}`}
              player={player}
            />
          ))}
        </div>
      </div>

      <div className="mt-5 sm:hidden">
        <CTAButton href={href} className="w-full">
          <Users className="h-4 w-4" strokeWidth={1.9} />
          Plantilla
        </CTAButton>
      </div>
    </section>
  );
}

function SquadHighlightItem({ player }: { player: SquadHighlight }) {
  const className =
    "group flex items-center gap-3 border border-white/10 bg-[rgba(255,255,255,0.03)] px-4 py-3 transition hover:border-[color:var(--rr-border-strong)] hover:bg-[rgba(255,255,255,0.05)]";
  const content = (
    <>
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[color:var(--rr-gold)] bg-[rgba(253,203,88,0.08)]">
        <span className="rr-display text-[1.4rem] leading-none text-[color:var(--rr-gold)]">
          {player.number}
        </span>
      </div>
      <div className="min-w-0">
        <p className="rr-display truncate text-[1.8rem] leading-none text-white transition group-hover:text-[color:var(--rr-gold)]">
          {player.name}
        </p>
        <p className="rr-kicker mt-1 text-[0.82rem] text-[color:var(--rr-muted)]">{player.position}</p>
      </div>
    </>
  );

  if (player.href) {
    return (
      <Link href={player.href} className={className}>
        {content}
      </Link>
    );
  }

  return <article className={className}>{content}</article>;
}

type TeamInfoPanelProps = {
  items: TeamQuickInfoItem[];
};

export function TeamInfoPanel({ items }: TeamInfoPanelProps) {
  return (
    <section className="rr-panel-dark p-5 md:p-6">
      <SectionLabel>Informacion Rapida</SectionLabel>
      <div className="mt-5 space-y-3">
        {items.map((item) => (
          <div
            key={`${item.label}-${item.value}`}
            className="border border-white/10 bg-[rgba(255,255,255,0.03)] px-4 py-3"
          >
            <p className="rr-kicker text-[0.78rem] text-[color:var(--rr-muted)]">{item.label}</p>
            <p className="mt-2 text-[1.1rem] text-white">{item.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
