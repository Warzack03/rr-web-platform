import type { AdminStatsState } from "@/lib/admin/admin-stats";
import type { MatchManagementMatch, MatchManagementTeam } from "@/lib/admin/match-management-mocks";
import type { AdminPlayer } from "@/lib/admin/mock-data";

export type AdminStatsPlayerContext = AdminPlayer & {
  sourcePlayerId: string;
  contextType: "regular" | "guest";
  originTeamSlug?: string;
  originTeamName?: string;
};

export type AdminStatsCatalogPlayer = AdminPlayer & {
  sourcePlayerId: string;
  teamName: string;
};

export type AdminStatsScreenData = {
  activeSeasonName: string | null;
  teams: MatchManagementTeam[];
  matches: MatchManagementMatch[];
  players: AdminStatsPlayerContext[];
  playerCatalog: AdminStatsCatalogPlayer[];
  statsState: AdminStatsState;
  coachTeamOptions: Array<{ slug: string; name: string }>;
};

export function buildStatsContextPlayerId(teamSlug: string, playerId: string) {
  return `${teamSlug}::${playerId}`;
}
