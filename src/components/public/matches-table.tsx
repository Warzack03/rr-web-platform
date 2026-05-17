import { Film } from "lucide-react";
import type { DemoMatch } from "@/src/lib/demo-data";

type MatchesTableProps = {
  title: string;
  matches: DemoMatch[];
};

export function MatchesTable({ title, matches }: MatchesTableProps) {
  return (
    <section className="rounded-[22px] border border-[var(--rr-border)] bg-[var(--rr-surface)] p-4 sm:p-5">
      <h3 className="mb-4 font-display text-2xl uppercase text-white sm:text-3xl">{title}</h3>
      <div className="space-y-3">
        {matches.map((match) => (
          <article
            key={match.id}
            className="grid gap-3 rounded-[18px] border border-[var(--rr-border)] bg-[var(--rr-surface-card-strong)] px-4 py-4 lg:grid-cols-[1.2fr_1.1fr_0.9fr_0.8fr]"
          >
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--rr-accent)]">
                {match.competition}
              </p>
              <p className="mt-2 font-display text-2xl uppercase text-white sm:text-3xl">
                {match.teamName} {match.score ? match.score : "VS"} {match.opponentName}
              </p>
            </div>
            <div className="text-sm text-[var(--rr-text-muted)]">
              <p>{match.dateLabel}</p>
              <p className="mt-2">{match.location}</p>
            </div>
            <div>
              <span className="rounded-full border border-[var(--rr-border-strong)] bg-[rgba(253,203,88,0.1)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--rr-accent)]">
                {match.status}
              </span>
            </div>
            <div className="flex items-center justify-start lg:justify-end">
              {match.videoLabel ? (
                <span className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.14em] text-[var(--rr-text-soft)]">
                  <Film className="h-4 w-4 text-[var(--rr-accent)]" />
                  {match.videoLabel}
                </span>
              ) : (
                <span className="text-sm uppercase tracking-[0.14em] text-[var(--rr-text-soft)]">
                  Sin video
                </span>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
