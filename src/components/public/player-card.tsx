import Link from "next/link";
import { ArrowUpRight, ShieldHalf } from "lucide-react";
import type { DemoPlayer } from "@/src/lib/demo-data";
import { cn } from "@/lib/utils";

type PlayerCardProps = {
  player: DemoPlayer;
};

export function PlayerCard({ player }: PlayerCardProps) {
  return (
    <Link
      href={`/jugadores/${player.slug}`}
      className={cn(
        "group overflow-hidden rounded-[22px] border p-4 transition duration-300 hover:-translate-y-1",
        player.premium
          ? "border-[var(--rr-border-strong)] bg-[linear-gradient(145deg,rgba(34,52,80,0.94),rgba(8,20,38,0.96))]"
          : "border-[var(--rr-border)] bg-[var(--rr-surface)]",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="rounded-[18px] border border-[var(--rr-border)] bg-[rgba(8,20,38,0.7)] px-4 py-6 text-center">
          <p className="font-display text-4xl uppercase text-[var(--rr-accent)]">{player.number}</p>
        </div>
        <ArrowUpRight className="h-4 w-4 text-[var(--rr-text-soft)] transition group-hover:text-[var(--rr-accent)]" />
      </div>

      <div className="mt-4">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--rr-accent)]">
          {player.position}
        </p>
        <h3 className="mt-2 font-display text-3xl uppercase leading-none text-white">{player.name}</h3>
        <p className="mt-3 text-base text-[var(--rr-text-muted)]">{player.summary}</p>
      </div>

      <div className="mt-5 flex items-center gap-2 text-sm uppercase tracking-[0.14em] text-[var(--rr-text-soft)]">
        <ShieldHalf className="h-4 w-4 text-[var(--rr-accent)]" />
        {player.teamName}
      </div>
    </Link>
  );
}
