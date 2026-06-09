import { getPlayerBaseStats } from "@/lib/public/player-detail-helpers";
import { PlayerStatTile } from "@/components/public/player-stat-tile";
import type {
  PublicPlayerStats,
  PublicPlayerStatsLevel,
  PublicPlayerType,
  PublicTeamType,
} from "@/lib/public/player-profile-content";

type PlayerStatsGridProps = {
  playerType: PublicPlayerType;
  stats: PublicPlayerStats;
  statsLevel?: PublicPlayerStatsLevel;
  teamType?: PublicTeamType;
};

export function PlayerStatsGrid({
  playerType,
  stats,
  statsLevel = "advanced",
  teamType = "first-team",
}: PlayerStatsGridProps) {
  const items = getPlayerBaseStats(playerType, stats, statsLevel);

  return (
    <div
      className={
        teamType === "academy"
          ? "grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
          : "grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
      }
    >
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
