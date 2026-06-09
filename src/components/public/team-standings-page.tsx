import type { ReactNode } from "react";
import Link from "next/link";
import {
  CalendarDays,
  ChevronLeft,
  Clock3,
  Shield,
  Trophy,
  Users,
} from "lucide-react";
import type {
  StandingRowData,
  TeamStandingsNavLink,
  TeamStandingsPageContent,
} from "@/lib/public/team-standings-content";
import { cn } from "@/lib/utils";

const NAV_ICONS = {
  Equipo: Shield,
  Calendario: CalendarDays,
  Plantilla: Users,
} satisfies Record<TeamStandingsNavLink["label"], typeof Shield>;

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

        <div className="mt-8 flex flex-wrap gap-3">
          {content.navLinks.map((link) => (
            <StandingsNavLink key={link.href} link={link} />
          ))}
        </div>

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

function StandingsNavLink({ link }: { link: TeamStandingsNavLink }) {
  const Icon = NAV_ICONS[link.label];

  return (
    <Link
      href={link.href}
      className="inline-flex min-h-11 items-center gap-2 border border-[color:var(--rr-border)] bg-[rgba(255,255,255,0.03)] px-4 py-3 text-[1rem] text-white transition hover:-translate-y-0.5 hover:border-[color:var(--rr-border-strong)] hover:bg-[rgba(255,255,255,0.05)]"
    >
      <Icon className="h-4 w-4 text-[color:var(--rr-gold)]" strokeWidth={1.9} />
      <span className="rr-kicker text-[0.84rem] text-[color:var(--rr-muted)]">{link.label}</span>
    </Link>
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
    <section className="rr-panel hidden overflow-hidden lg:block">
      <table className="w-full table-fixed border-collapse">
        <thead>
          <tr className="border-b border-white/10 bg-[rgba(255,255,255,0.03)]">
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
    <section className="rr-panel overflow-hidden lg:hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[34rem] border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-[rgba(255,255,255,0.03)]">
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
        "rr-kicker px-2 py-4 text-right text-[0.8rem] text-[color:var(--rr-muted)]",
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
  return (
    <tr
      className={cn(
        "border-t border-white/8 transition hover:bg-[rgba(255,255,255,0.025)]",
        row.isClub && "bg-[rgba(253,203,88,0.08)]",
      )}
    >
      <td className="px-2 py-4 pl-6">
        <div
          className={cn(
            "flex h-11 w-11 items-center justify-center border text-[1.1rem] font-semibold text-white",
            row.isClub
              ? "border-[color:var(--rr-border-strong)] bg-[rgba(253,203,88,0.12)] text-[color:var(--rr-gold)]"
              : "border-white/10 bg-[rgba(255,255,255,0.04)]",
          )}
        >
          {row.position}
        </div>
      </td>
      <td className="px-2 py-4 text-left">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center border",
              row.isClub
                ? "border-[color:var(--rr-border-strong)] bg-[rgba(253,203,88,0.08)]"
                : "border-white/10 bg-[rgba(255,255,255,0.03)]",
            )}
          >
            <Shield
              className={cn(
                "h-5 w-5",
                row.isClub ? "text-[color:var(--rr-gold)]" : "text-[color:var(--rr-muted)]",
              )}
              strokeWidth={1.8}
            />
          </div>
          <div className="min-w-0">
            <p className="text-[1.14rem] font-semibold text-white">{row.team}</p>
            {row.isClub ? (
              <p className="rr-kicker mt-1 text-[0.72rem] text-[color:var(--rr-gold)]">
                Equipo Rising Raimon
              </p>
            ) : null}
          </div>
        </div>
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
      <StandingsValue className="pr-6 text-white">{row.points}</StandingsValue>
    </tr>
  );
}

function StandingsMobileRow({ row }: StandingRowProps) {
  return (
    <tr
      className={cn(
        "border-t border-white/8 transition hover:bg-[rgba(255,255,255,0.025)]",
        row.isClub && "bg-[rgba(253,203,88,0.08)]",
      )}
    >
      <td className="px-2 py-3 pl-4">
        <div
          className={cn(
            "flex h-9 w-9 items-center justify-center border text-[0.96rem] font-semibold",
            row.isClub
              ? "border-[color:var(--rr-border-strong)] bg-[rgba(253,203,88,0.12)] text-[color:var(--rr-gold)]"
              : "border-white/10 bg-[rgba(255,255,255,0.04)] text-white",
          )}
        >
          {row.position}
        </div>
      </td>
      <td className="px-2 py-3 text-left">
        <div className="min-w-0">
          <p className="truncate text-[0.98rem] font-semibold text-white">{row.team}</p>
          {row.isClub ? (
            <p className="rr-kicker mt-1 text-[0.66rem] text-[color:var(--rr-gold)]">Rising Raimon</p>
          ) : null}
        </div>
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

function StandingsValue({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <td className={cn("px-2 py-4 text-right text-[1.08rem] text-[color:var(--rr-muted)]", className)}>
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
