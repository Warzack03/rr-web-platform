import Link from "next/link";
import { ArrowRight, CalendarDays, Trophy } from "lucide-react";
import type { DemoMatch, DemoTeam } from "@/src/lib/demo-data";
import { getTeamOverviewHref } from "@/src/lib/team-routes";

type AcademyHighlightCardProps = {
  team: DemoTeam;
  nextMatch: DemoMatch | null;
  lastResult: DemoMatch | null;
};

export function AcademyHighlightCard({
  team,
  nextMatch,
  lastResult,
}: AcademyHighlightCardProps) {
  const summaryMatch = nextMatch ?? lastResult;
  const summaryLabel = nextMatch ? "Proximo partido" : "Ultimo resultado";

  return (
    <article className="rounded-[22px] border border-[var(--rr-border)] bg-[var(--rr-surface)] p-5 transition duration-300 hover:border-[var(--rr-border-strong)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--rr-accent)]">
            {team.category}
          </p>
          <h3 className="mt-2 font-display text-3xl uppercase text-white">{team.name}</h3>
        </div>
        <span className="rounded-full border border-[var(--rr-border)] bg-black/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--rr-text-soft)]">
          {team.competition}
        </span>
      </div>

      <div className="mt-5 rounded-[18px] border border-[var(--rr-border)] bg-[rgba(8,20,38,0.46)] px-4 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--rr-accent)]">
          {summaryLabel}
        </p>
        {summaryMatch ? (
          <>
            <p className="mt-2 font-display text-2xl uppercase text-white">
              {summaryMatch.teamName} {summaryMatch.score ? summaryMatch.score : "VS"}{" "}
              {summaryMatch.opponentName}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-[var(--rr-text-muted)]">
              <span className="inline-flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-[var(--rr-accent)]" />
                {summaryMatch.dateLabel}
              </span>
              <span className="inline-flex items-center gap-2">
                <Trophy className="h-4 w-4 text-[var(--rr-accent)]" />
                {summaryMatch.location}
              </span>
            </div>
          </>
        ) : (
          <p className="mt-2 text-sm text-[var(--rr-text-muted)]">Sin partido destacado por ahora.</p>
        )}
      </div>

      <Link
        href={getTeamOverviewHref(team.slug)}
        className="mt-5 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--rr-accent)]"
      >
        Ver detalle del equipo
        <ArrowRight className="h-4 w-4" />
      </Link>
    </article>
  );
}
