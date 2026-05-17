import { cn } from "@/lib/utils";
import type { DemoStandingRow } from "@/src/lib/demo-data";

type StandingsTableProps = {
  rows: DemoStandingRow[];
  compact?: boolean;
  title?: string;
};

export function StandingsTable({ rows, compact = false, title }: StandingsTableProps) {
  return (
    <div className="rounded-[22px] border border-[var(--rr-border)] bg-[var(--rr-surface)] p-4 sm:p-5">
      {title ? (
        <h3 className="mb-4 font-display text-2xl uppercase text-white sm:text-3xl">{title}</h3>
      ) : null}
      <div className="-mx-1 overflow-x-auto px-1">
        <table className="min-w-[640px] w-full border-separate border-spacing-y-2 text-left">
          <thead>
            <tr className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--rr-text-soft)]">
              <th className="px-3 py-2">Pos</th>
              <th className="px-3 py-2">Equipo</th>
              <th className="px-3 py-2">PJ</th>
              {!compact ? <th className="px-3 py-2">G</th> : null}
              {!compact ? <th className="px-3 py-2">E</th> : null}
              {!compact ? <th className="px-3 py-2">P</th> : null}
              {!compact ? <th className="px-3 py-2">GF</th> : null}
              {!compact ? <th className="px-3 py-2">GC</th> : null}
              {!compact ? <th className="px-3 py-2">DG</th> : null}
              <th className="px-3 py-2">Pts</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={`${row.position}-${row.teamName}`}
                className={cn(
                  "rounded-[14px] text-sm text-[var(--rr-text-muted)]",
                  row.isOwnTeam ? "bg-[rgba(253,203,88,0.12)] text-white" : "bg-[var(--rr-surface-card-strong)]",
                )}
              >
                <td className="rounded-l-[14px] px-3 py-3 font-semibold text-[var(--rr-accent)]">
                  {row.position}
                </td>
                <td className="px-3 py-3 font-semibold uppercase tracking-[0.08em]">{row.teamName}</td>
                <td className="px-3 py-3">{row.played}</td>
                {!compact ? <td className="px-3 py-3">{row.won}</td> : null}
                {!compact ? <td className="px-3 py-3">{row.drawn}</td> : null}
                {!compact ? <td className="px-3 py-3">{row.lost}</td> : null}
                {!compact ? <td className="px-3 py-3">{row.goalsFor}</td> : null}
                {!compact ? <td className="px-3 py-3">{row.goalsAgainst}</td> : null}
                {!compact ? <td className="px-3 py-3">{row.goalDifference}</td> : null}
                <td className="rounded-r-[14px] px-3 py-3 font-semibold text-white">{row.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
