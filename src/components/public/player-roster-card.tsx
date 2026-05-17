import Link from "next/link";
import { ShieldHalf } from "lucide-react";
import type { DemoPlayer } from "@/src/lib/demo-data";
import { cn } from "@/lib/utils";

type PlayerRosterCardProps = {
  player: DemoPlayer;
  premium?: boolean;
};

export function PlayerRosterCard({ player, premium = false }: PlayerRosterCardProps) {
  return (
    <Link
      href={`/jugadores/${player.slug}`}
      className={cn(
        "group block overflow-hidden rounded-[24px] border p-5 transition duration-300 hover:-translate-y-1",
        premium
          ? "border-[var(--rr-border-strong)] bg-[linear-gradient(160deg,rgba(28,47,77,0.96),rgba(7,19,34,0.98))] shadow-[var(--rr-shadow)]"
          : "border-[var(--rr-border)] bg-[var(--rr-surface)]",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="rounded-[22px] border border-[var(--rr-border)] bg-[rgba(8,20,38,0.68)] px-5 py-8">
          <p className="font-display text-5xl uppercase text-[var(--rr-accent)]">{player.number}</p>
        </div>
        <div className="min-w-0 flex-1 text-right">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--rr-accent)]">
            {player.position}
          </p>
          <h3 className="mt-2 font-display text-3xl uppercase leading-none text-white">
            {player.name}
          </h3>
          <p className="mt-2 text-sm uppercase tracking-[0.14em] text-[var(--rr-text-soft)]">
            {player.country} - {player.foot}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-[20px] border border-[var(--rr-border)] bg-black/15 p-4">
        <div className="flex items-center gap-2 text-sm uppercase tracking-[0.14em] text-[var(--rr-text-soft)]">
          <ShieldHalf className="h-4 w-4 text-[var(--rr-accent)]" />
          {player.teamName}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-[16px] bg-[rgba(8,20,38,0.58)] px-3 py-3">
            <p className="text-xs uppercase tracking-[0.14em] text-[var(--rr-text-soft)]">Goles</p>
            <p className="mt-1 font-display text-3xl text-white">{player.goals}</p>
          </div>
          <div className="rounded-[16px] bg-[rgba(8,20,38,0.58)] px-3 py-3">
            <p className="text-xs uppercase tracking-[0.14em] text-[var(--rr-text-soft)]">Asist.</p>
            <p className="mt-1 font-display text-3xl text-white">{player.assists}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
