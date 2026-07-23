import { PlayerPerformanceCard } from "@/components/public/player-performance-card";
import type { MatchTeamType } from "@/lib/contracts/public";
import type { PlayerPerformance } from "@/lib/public/match-detail-content";

type PlayerPerformanceGridProps = {
  players: PlayerPerformance[];
  teamType?: MatchTeamType;
};

export function PlayerPerformanceGrid({
  players,
  teamType = "first-team",
}: PlayerPerformanceGridProps) {
  return (
    <section className="space-y-8">
      <div className="flex items-center justify-center">
        <div className="w-full max-w-[11rem]">
          <div className="rr-bolt-divider" />
        </div>
      </div>

      <header className="text-center">
        <h2
          className={
            teamType === "academy"
              ? "rr-display text-[2.8rem] leading-[0.92] text-[color:var(--rr-gold)] md:text-[3.4rem]"
              : "rr-display text-[3.2rem] leading-[0.9] text-[color:var(--rr-gold)] md:text-[4rem]"
          }
        >
          Actuacion del equipo
        </h2>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {players.map((player) => (
          <PlayerPerformanceCard key={player.id} player={player} />
        ))}
      </div>
    </section>
  );
}
