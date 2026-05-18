import type { FirstTeamPlayerStats, FirstTeamPlayerType } from "@/lib/public/first-team-squad-content";
import { getPlayerBaseStats } from "@/lib/public/player-detail-helpers";
import { PlayerStatTile } from "@/components/public/player-stat-tile";

type PlayerStatsGridProps = {
  playerType: FirstTeamPlayerType;
  stats: FirstTeamPlayerStats;
};

export function PlayerStatsGrid({ playerType, stats }: PlayerStatsGridProps) {
  const items = getPlayerBaseStats(playerType, stats);

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <PlayerStatTile
          key={item.label}
          label={item.label}
          value={item.value}
          icon={item.icon}
          tone={item.tone}
        />
      ))}
    </div>
  );
}
