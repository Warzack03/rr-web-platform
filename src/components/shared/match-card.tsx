import { CalendarDays, MapPin } from "lucide-react";
import type { DemoMatch } from "@/src/lib/demo-data";
import { cn } from "@/lib/utils";

type MatchCardProps = {
  match: DemoMatch;
  variant?: "default" | "featured";
};

export function MatchCard({ match, variant = "default" }: MatchCardProps) {
  return (
    <article
      className={cn(
        "rounded-[22px] border border-[var(--rr-border)]",
        variant === "featured"
          ? "bg-[rgba(8,20,38,0.68)] p-5 sm:p-6"
          : "bg-[var(--rr-surface)] p-4 sm:p-5",
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="rounded-full border border-[var(--rr-border-strong)] bg-[var(--rr-accent)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--rr-bg)]">
          {match.status}
        </span>
        <span className="text-sm uppercase tracking-[0.16em] text-[var(--rr-text-soft)]">
          {match.competition}
        </span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:gap-4">
        <div className="min-w-0">
          <p className="font-display text-2xl uppercase text-white sm:text-4xl">{match.teamName}</p>
        </div>
        <div className="text-center sm:px-2">
          <p className="font-display text-2xl uppercase text-[var(--rr-accent)] sm:text-3xl">
            {match.score ?? "VS"}
          </p>
        </div>
        <div className="min-w-0 sm:text-right">
          <p className="font-display text-2xl uppercase text-[var(--rr-text-muted)] sm:text-4xl">
            {match.opponentName}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 border-t border-[var(--rr-border)] pt-4 text-sm text-[var(--rr-text-soft)] sm:grid-cols-2">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-[var(--rr-accent)]" />
          {match.dateLabel}
        </div>
        <div className="flex items-center gap-2 sm:justify-end">
          <MapPin className="h-4 w-4 text-[var(--rr-accent)]" />
          {match.location}
        </div>
      </div>
    </article>
  );
}
