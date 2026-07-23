import Link from "next/link";
import type { StandingRowData } from "@/lib/contracts/public";
import { StandingTeamCrest } from "@/components/public/standing-team-crest";
import { getPublicTeamHref } from "@/lib/public/team-section-links";
import { cn } from "@/lib/utils";

type MiniStandingsTableProps = {
  rows: StandingRowData[];
  href: string;
  title?: string;
  ctaLabel?: string;
};

export function MiniStandingsTable({
  rows,
  href,
  title = "Clasificacion",
  ctaLabel = "Ver tabla completa",
}: MiniStandingsTableProps) {
  return (
    <section className="rr-panel p-5 md:p-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="rr-kicker text-[0.92rem] text-[color:var(--rr-muted)]">{title}</h2>
        <div className="rr-bolt-divider w-14" />
      </div>

      <div className="mt-5 overflow-hidden border border-white/10 bg-[rgba(7,22,41,0.42)]">
        {rows.map((row) => (
          <MiniStandingsRow key={`${row.position}-${row.team}`} row={row} />
        ))}
      </div>

      <Link
        href={href}
        className="rr-kicker mt-4 inline-flex text-[0.84rem] text-[color:var(--rr-gold)] transition hover:text-[#ffd46f]"
      >
        {ctaLabel}
      </Link>
    </section>
  );
}

function MiniStandingsRow({ row }: { row: StandingRowData }) {
  const teamHref = row.teamSlug ? getPublicTeamHref(row.teamSlug) : undefined;
  const className = cn(
    "group grid grid-cols-[3rem_minmax(0,1fr)_3.4rem] items-center gap-3 border-t border-white/8 px-3 py-3.5 first:border-t-0",
    teamHref && "transition hover:bg-[rgba(255,255,255,0.035)]",
    row.isClub && "bg-[rgba(253,203,88,0.09)] shadow-[inset_3px_0_0_rgba(253,203,88,0.7)]",
  );
  const content = (
    <>
      <span
        className={cn(
          "rr-kicker inline-flex h-9 w-9 items-center justify-center border text-[0.82rem] text-white",
          row.isClub
            ? "border-[color:var(--rr-border-strong)] bg-[rgba(253,203,88,0.12)] font-bold text-[color:var(--rr-gold)]"
            : "border-white/10 text-[color:var(--rr-muted)]",
        )}
      >
        {row.position}
      </span>

      <div className="flex min-w-0 items-center gap-3">
        <StandingTeamCrest
          logoUrl={row.logoUrl}
          logoAlt={row.logoAlt}
          isClub={row.isClub}
          className="h-9 w-9"
          iconClassName="h-4 w-4"
        />
        <div className="min-w-0">
          <p className="truncate text-[1rem] font-semibold text-white transition group-hover:text-[color:var(--rr-gold)]">
            {row.team}
          </p>
          {row.isClub ? (
            <p className="rr-kicker mt-1 text-[0.7rem] text-[color:var(--rr-gold)]">Rising Raimon</p>
          ) : null}
        </div>
      </div>

      <div className="text-center">
        <div className="rr-kicker text-[0.68rem] text-[color:var(--rr-muted)]">PTS</div>
        <div className="rr-display mt-1 text-[1.7rem] leading-none text-white">{row.points}</div>
      </div>
    </>
  );

  if (teamHref) {
    return (
      <Link href={teamHref} className={className}>
        {content}
      </Link>
    );
  }

  return <div className={className}>{content}</div>;
}
