import type { FirstTeamPlayerStats, FirstTeamPlayerType } from "@/lib/public/first-team-squad-content";
import { getPlayerDerivedMetrics } from "@/lib/public/player-detail-helpers";
import { PlayerStatTile } from "@/components/public/player-stat-tile";

type PlayerDerivedMetricsProps = {
  playerType: FirstTeamPlayerType;
  stats: FirstTeamPlayerStats;
};

export function PlayerDerivedMetrics({
  playerType,
  stats,
}: PlayerDerivedMetricsProps) {
  const items = getPlayerDerivedMetrics(playerType, stats);

  return (
    <section className="rr-panel border-[color:var(--rr-border-strong)] px-5 py-5 md:px-6">
      <div className="flex items-center gap-3">
        <span className="rr-kicker text-[0.82rem] text-[color:var(--rr-gold)]">Metricas derivadas</span>
        <div className="h-px flex-1 bg-[linear-gradient(90deg,rgba(253,203,88,0.4),transparent)]" />
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
        {items.map((item) => (
          <PlayerStatTile
            key={item.label}
            label={item.label}
            value={item.value}
            icon={item.icon}
          />
        ))}
      </div>
    </section>
  );
}
