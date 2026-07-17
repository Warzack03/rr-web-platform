import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronLeft, Clock3, Trophy } from "lucide-react";
import type { StandingRowData, TeamStandingsPageContent } from "@/lib/public/team-standings-content";
import { StandingTeamCrest } from "@/components/public/standing-team-crest";
import { getPublicTeamHref } from "@/lib/public/team-section-links";
import { TeamSectionNavigation } from "@/components/public/team-section-navigation";
import { cn } from "@/lib/utils";

type TeamStandingsPageProps = {
  content: TeamStandingsPageContent;
};

export function TeamStandingsPage({ content }: TeamStandingsPageProps) {
  const titleClassName =
    content.variant === "first-team"
      ? "text-[4.2rem] sm:text-[5.5rem] lg:text-[6.4rem]"
      : "text-[3.7rem] sm:text-[4.9rem] lg:text-[5.7rem]";

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top,rgba(253,203,88,0.14),transparent_56%)]" />
      <div className="absolute inset-x-0 top-24 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(52,112,200,0.08),transparent_28%)]" />

      <section className="relative mx-auto w-full max-w-[1280px] px-5 py-16 md:px-8 md:py-20 xl:px-16">
        <header className="max-w-[54rem]">
          <Link
            href={content.backHref}
            className="rr-kicker inline-flex items-center gap-2 text-[0.82rem] text-[color:var(--rr-muted)] transition hover:text-[color:var(--rr-gold)]"
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={1.9} />
            <span>{content.backLabel}</span>
          </Link>

          <StandingsMetaBar
            className="mt-6"
            competition={content.competition}
            season={content.season}
            updatedAt={content.updatedAt}
          />

          <h1 className={cn("rr-display mt-6 leading-[0.9] text-white", titleClassName)}>
            {content.title}
          </h1>
          <p className="mt-4 text-[1.16rem] text-[color:var(--rr-muted)] md:text-[1.32rem]">
            {content.subtitle}
          </p>
          <div className="rr-bolt-divider mt-7 max-w-[21rem]" />
        </header>

        <TeamSectionNavigation links={content.navLinks} activeKey="standing" className="mt-8" />

        <div className="mt-10">
          {content.rows.length > 0 ? (
            <>
              <StandingsTable rows={content.rows} />
              <StandingsMobileTable rows={content.rows} />
            </>
          ) : (
            <StandingsEmptyState />
          )}
        </div>
      </section>
    </div>
  );
}

type StandingsMetaBarProps = {
  competition?: string;
  season: string;
  updatedAt?: string;
  className?: string;
};

export function StandingsMetaBar({
  competition,
  season,
  updatedAt,
  className,
}: StandingsMetaBarProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      {competition ? (
        <span className="rr-chip border-[color:var(--rr-border-strong)] text-[color:var(--rr-gold)]">
          {competition}
        </span>
      ) : null}
      <span className="rr-chip text-[color:var(--rr-muted)]">{season}</span>
      {updatedAt ? (
        <div className="inline-flex items-center gap-2 border border-white/10 bg-[rgba(255,255,255,0.03)] px-3 py-2 text-[0.98rem] text-[color:var(--rr-muted)]">
          <Clock3 className="h-4 w-4 text-[color:var(--rr-gold)]" strokeWidth={1.8} />
          <span>Actualizado: {updatedAt}</span>
        </div>
      ) : null}
    </div>
  );
}

type StandingsTableProps = {
  rows: StandingRowData[];
};

export function StandingsTable({ rows }: StandingsTableProps) {
  return (
    <section className="rr-panel hidden overflow-hidden border-white/15 bg-[rgba(12,35,65,0.82)] shadow-[0_18px_56px_rgba(0,0,0,0.22)] lg:block">
      <table className="w-full table-fixed border-collapse">
        <thead>
          <tr className="border-b border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.025))]">
            <StandingsTableHead className="w-[6.2rem] pl-6 text-left">Pos</StandingsTableHead>
            <StandingsTableHead className="w-[23rem] text-left">Equipo</StandingsTableHead>
            <StandingsTableHead>PJ</StandingsTableHead>
            <StandingsTableHead>G</StandingsTableHead>
            <StandingsTableHead>E</StandingsTableHead>
            <StandingsTableHead>P</StandingsTableHead>
            <StandingsTableHead>GF</StandingsTableHead>
            <StandingsTableHead>GC</StandingsTableHead>
            <StandingsTableHead>DG</StandingsTableHead>
            <StandingsTableHead className="pr-6">Pts</StandingsTableHead>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <StandingRow key={`${row.position}-${row.team}`} row={row} />
          ))}
        </tbody>
      </table>
    </section>
  );
}

function StandingsMobileTable({ rows }: StandingsTableProps) {
  return (
    <section className="rr-panel overflow-hidden border-white/15 bg-[rgba(12,35,65,0.82)] lg:hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[34rem] border-collapse">
          <thead>
            <tr className="border-b border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.025))]">
              <StandingsTableHead className="w-14 pl-4 text-left">Pos</StandingsTableHead>
              <StandingsTableHead className="min-w-[11rem] text-left">Equipo</StandingsTableHead>
              <StandingsTableHead className="w-14">PJ</StandingsTableHead>
              <StandingsTableHead className="w-14">G</StandingsTableHead>
              <StandingsTableHead className="w-14">E</StandingsTableHead>
              <StandingsTableHead className="w-14">P</StandingsTableHead>
              <StandingsTableHead className="w-16">DG</StandingsTableHead>
              <StandingsTableHead className="w-16 pr-4">Pts</StandingsTableHead>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <StandingsMobileRow key={`${row.position}-${row.team}`} row={row} />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function StandingsTableHead({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <th
      className={cn(
        "rr-kicker px-2 py-4 text-center text-[0.8rem] text-[color:var(--rr-muted)]",
        className,
      )}
    >
      {children}
    </th>
  );
}

type StandingRowProps = {
  row: StandingRowData;
};

export function StandingRow({ row }: StandingRowProps) {
  const teamHref = row.teamSlug ? getPublicTeamHref(row.teamSlug) : undefined;
  const teamIdentity = <StandingTeamIdentity row={row} compact={false} />;

  return (
    <tr
      className={cn(
        "border-t border-white/8 transition hover:bg-[rgba(255,255,255,0.035)]",
        row.isClub && "bg-[rgba(253,203,88,0.09)] shadow-[inset_4px_0_0_rgba(253,203,88,0.75)]",
      )}
    >
      <td className="px-2 py-4 pl-6">
        <div
          className={cn(
            "flex h-11 w-11 items-center justify-center border text-[1.1rem] font-bold text-white",
            row.isClub
              ? "border-[color:var(--rr-border-strong)] bg-[rgba(253,203,88,0.12)] text-[color:var(--rr-gold)]"
              : "border-white/10 bg-[rgba(255,255,255,0.04)]",
          )}
        >
          {row.position}
        </div>
      </td>
      <td className="px-2 py-4 text-left">
        {teamHref ? (
          <Link href={teamHref} className="group inline-flex max-w-full items-center gap-3">
            {teamIdentity}
          </Link>
        ) : (
          <div className="flex items-center gap-3">{teamIdentity}</div>
        )}
      </td>
      <StandingsValue>{row.played}</StandingsValue>
      <StandingsValue>{row.won}</StandingsValue>
      <StandingsValue>{row.drawn}</StandingsValue>
      <StandingsValue>{row.lost}</StandingsValue>
      <StandingsValue>{row.goalsFor}</StandingsValue>
      <StandingsValue>{row.goalsAgainst}</StandingsValue>
      <StandingsValue className={row.goalDifference > 0 ? "text-[color:var(--rr-gold)]" : undefined}>
        {formatGoalDifference(row.goalDifference)}
      </StandingsValue>
      <StandingsValue className="pr-6 text-[1.16rem] font-bold text-white">{row.points}</StandingsValue>
    </tr>
  );
}

function StandingsMobileRow({ row }: StandingRowProps) {
  const teamHref = row.teamSlug ? getPublicTeamHref(row.teamSlug) : undefined;
  const teamIdentity = <StandingTeamIdentity row={row} compact />;

  return (
    <tr
      className={cn(
        "border-t border-white/8 transition hover:bg-[rgba(255,255,255,0.035)]",
        row.isClub && "bg-[rgba(253,203,88,0.09)] shadow-[inset_3px_0_0_rgba(253,203,88,0.75)]",
      )}
    >
      <td className="px-2 py-3 pl-4">
        <div
          className={cn(
            "flex h-9 w-9 items-center justify-center border text-[0.96rem] font-bold",
            row.isClub
              ? "border-[color:var(--rr-border-strong)] bg-[rgba(253,203,88,0.12)] text-[color:var(--rr-gold)]"
              : "border-white/10 bg-[rgba(255,255,255,0.04)] text-white",
          )}
        >
          {row.position}
        </div>
      </td>
      <td className="px-2 py-3 text-left">
        {teamHref ? (
          <Link href={teamHref} className="group block min-w-0">
            {teamIdentity}
          </Link>
        ) : (
          teamIdentity
        )}
      </td>
      <StandingsValue className="py-3 text-[0.95rem]">{row.played}</StandingsValue>
      <StandingsValue className="py-3 text-[0.95rem]">{row.won}</StandingsValue>
      <StandingsValue className="py-3 text-[0.95rem]">{row.drawn}</StandingsValue>
      <StandingsValue className="py-3 text-[0.95rem]">{row.lost}</StandingsValue>
      <StandingsValue
        className={cn(
          "py-3 text-[0.95rem]",
          row.goalDifference > 0 ? "text-[color:var(--rr-gold)]" : undefined,
        )}
      >
        {formatGoalDifference(row.goalDifference)}
      </StandingsValue>
      <StandingsValue className="py-3 pr-4 text-[0.98rem] font-semibold text-white">
        {row.points}
      </StandingsValue>
    </tr>
  );
}

function StandingTeamIdentity({
  row,
  compact,
}: {
  row: StandingRowData;
  compact: boolean;
}) {
  if (compact) {
    return (
      <div className="flex min-w-0 items-center gap-2.5">
        <StandingTeamCrest
          logoUrl={row.logoUrl}
          logoAlt={row.logoAlt}
          isClub={row.isClub}
          className="h-8 w-8"
          iconClassName="h-4 w-4"
        />
        <div className="min-w-0">
          <p className="truncate text-[0.98rem] font-semibold text-white transition group-hover:text-[color:var(--rr-gold)]">
            {row.team}
          </p>
          {row.isClub ? (
            <p className="rr-kicker mt-1 text-[0.66rem] text-[color:var(--rr-gold)]">Rising Raimon</p>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <>
      <StandingTeamCrest
        logoUrl={row.logoUrl}
        logoAlt={row.logoAlt}
        isClub={row.isClub}
        className="h-11 w-11"
      />
      <div className="min-w-0">
        <p className="text-[1.14rem] font-semibold text-white transition group-hover:text-[color:var(--rr-gold)]">
          {row.team}
        </p>
        {row.isClub ? (
          <p className="rr-kicker mt-1 text-[0.72rem] text-[color:var(--rr-gold)]">
            Equipo Rising Raimon
          </p>
        ) : null}
      </div>
    </>
  );
}

function StandingsValue({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <td
      className={cn(
        "px-2 py-4 text-center text-[1.08rem] font-semibold tabular-nums text-[color:var(--rr-muted)]",
        className,
      )}
    >
      {children}
    </td>
  );
}

function StandingsEmptyState() {
  return (
    <section className="rr-panel max-w-[36rem] p-8">
      <div className="inline-flex h-12 w-12 items-center justify-center border border-[color:var(--rr-border-strong)] bg-[rgba(253,203,88,0.08)]">
        <Trophy className="h-5 w-5 text-[color:var(--rr-gold)]" strokeWidth={1.8} />
      </div>
      <h2 className="rr-display mt-5 text-[2.7rem] leading-none text-white">Clasificacion pendiente</h2>
      <p className="mt-3 text-[1.05rem] text-[color:var(--rr-muted)]">
        La tabla completa se publicara en cuanto este disponible.
      </p>
    </section>
  );
}

function formatGoalDifference(value: number) {
  return value > 0 ? `+${value}` : `${value}`;
}
