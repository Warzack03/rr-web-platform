import Link from "next/link";
import { ArrowUpRight, Shield } from "lucide-react";
import type { DemoTeam } from "@/src/lib/demo-data";
import { getTeamOverviewHref } from "@/src/lib/team-routes";
import { cn } from "@/lib/utils";

type TeamCardProps = {
  team: DemoTeam;
};

export function TeamCard({ team }: TeamCardProps) {
  return (
    <Link
      href={getTeamOverviewHref(team.slug)}
      className={cn(
        "block overflow-hidden rounded-[22px] border p-5 transition duration-300 hover:-translate-y-1",
        team.accent === "premium"
          ? "border-[var(--rr-border-strong)] bg-[linear-gradient(150deg,rgba(30,47,71,0.95),rgba(8,20,38,0.96))] shadow-[var(--rr-shadow)]"
          : "border-[var(--rr-border)] bg-[var(--rr-surface)]",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="rounded-full bg-[var(--rr-accent)]/10 p-3 text-[var(--rr-accent)]">
          <Shield className="h-5 w-5" />
        </div>
        <ArrowUpRight className="h-4 w-4 text-[var(--rr-text-soft)]" />
      </div>

      <div className="mt-5 space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--rr-accent)]">
          {team.category}
        </p>
        <h3 className="font-display text-3xl uppercase text-white">{team.name}</h3>
        <p className="text-base text-[var(--rr-text-muted)]">{team.competition}</p>
        <p className="pt-3 text-sm leading-6 text-[var(--rr-text-soft)]">{team.summary}</p>
      </div>
    </Link>
  );
}
