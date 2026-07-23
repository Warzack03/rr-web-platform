import type {
  DerivedPlayerStats,
  PlayerCardStatItem,
  PlayerStatSummaryItem,
  PublicPlayerProfile,
  PublicPlayerStats,
  PublicPlayerType,
  PublicTeamType,
  SortDirection,
  StatSortKey,
  StatsColumn,
} from "@/lib/contracts/public";
import { getGlobalPlayerHref } from "@/lib/public/player-routes";
export type {
  DerivedPlayerStats,
  PlayerCardStatItem,
  PlayerStatSummaryItem,
  PublicDerivedPlayerStats,
  PublicPlayerCardStatItem,
  PublicPlayerStatSummaryItem,
  PublicSortDirection,
  PublicStatSortKey,
  PublicStatsColumn,
  PublicTeamStatisticsPageContent,
  SortDirection,
  StatSortKey,
  StatsColumn,
  TeamStatisticsPageContent,
} from "@/lib/contracts/public";

export const STAT_SORT_KEYS: StatSortKey[] = [
  "player",
  "mvps",
  "matchesPlayed",
  "goals",
  "assists",
  "goalContributions",
  "goalsPerMatch",
  "recoveries",
  "shots",
  "shotsOnTarget",
  "shotAccuracy",
  "cleanSheets",
  "cleanSheetRate",
  "goalsAgainstPerMatch",
  "saves",
  "savesPerMatch",
  "yellowCards",
  "redCards",
  "ownGoals",
];

const FIRST_TEAM_FIELD_COLUMNS: StatsColumn[] = [
  { key: "player", label: "Jugador" },
  { key: "mvps", label: "MVP's", mobileLabel: "MVP's" },
  { key: "matchesPlayed", label: "PJ", mobileLabel: "PJ" },
  { key: "goals", label: "Goles", mobileLabel: "Goles" },
  { key: "assists", label: "Asistencias", mobileLabel: "Asist." },
  { key: "goalContributions", label: "G+A", mobileLabel: "G+A" },
  { key: "goalsPerMatch", label: "G/P", mobileLabel: "G/P" },
  { key: "recoveries", label: "Recuperaciones", mobileLabel: "Recup." },
  { key: "shots", label: "Tiros", mobileLabel: "Tiros" },
  { key: "shotsOnTarget", label: "Tiros a puerta", mobileLabel: "T. puerta" },
  { key: "shotAccuracy", label: "Precision Tiro", mobileLabel: "Prec." },
  { key: "yellowCards", label: "T. Amarillas", mobileLabel: "T. Amar." },
  { key: "redCards", label: "T. Rojas", mobileLabel: "T. Rojas" },
  { key: "ownGoals", label: "Goles en propia", mobileLabel: "P.P." },
];

const FIRST_TEAM_GOALKEEPER_COLUMNS: StatsColumn[] = [
  { key: "player", label: "Jugador" },
  { key: "mvps", label: "MVP's", mobileLabel: "MVP's" },
  { key: "matchesPlayed", label: "PJ", mobileLabel: "PJ" },
  { key: "goals", label: "Goles", mobileLabel: "Goles" },
  { key: "assists", label: "Asistencias", mobileLabel: "Asist." },
  { key: "goalContributions", label: "G+A", mobileLabel: "G+A" },
  { key: "cleanSheets", label: "Imbatidos", mobileLabel: "Imbat." },
  { key: "cleanSheetRate", label: "Ratio imbatidos", mobileLabel: "Ratio" },
  { key: "goalsAgainstPerMatch", label: "Encajados/PJ", mobileLabel: "Enc./PJ" },
  { key: "saves", label: "Paradas", mobileLabel: "Paradas" },
  { key: "savesPerMatch", label: "P/P", mobileLabel: "P/P" },
  { key: "yellowCards", label: "T. Amarillas", mobileLabel: "T. Amar." },
  { key: "redCards", label: "T. Rojas", mobileLabel: "T. Rojas" },
  { key: "ownGoals", label: "Goles en propia", mobileLabel: "P.P." },
];

const ACADEMY_FIELD_COLUMNS: StatsColumn[] = [
  { key: "player", label: "Jugador" },
  { key: "mvps", label: "MVP's", mobileLabel: "MVP's" },
  { key: "matchesPlayed", label: "PJ", mobileLabel: "PJ" },
  { key: "goals", label: "Goles", mobileLabel: "Goles" },
  { key: "assists", label: "Asistencias", mobileLabel: "Asist." },
  { key: "goalContributions", label: "G+A", mobileLabel: "G+A" },
  { key: "goalsPerMatch", label: "G/P", mobileLabel: "G/P" },
  { key: "yellowCards", label: "T. Amarillas", mobileLabel: "T. Amar." },
  { key: "redCards", label: "T. Rojas", mobileLabel: "T. Rojas" },
  { key: "ownGoals", label: "Goles en propia", mobileLabel: "P.P." },
];

const ACADEMY_GOALKEEPER_COLUMNS: StatsColumn[] = [
  { key: "player", label: "Jugador" },
  { key: "mvps", label: "MVP's", mobileLabel: "MVP's" },
  { key: "matchesPlayed", label: "PJ", mobileLabel: "PJ" },
  { key: "goals", label: "Goles", mobileLabel: "Goles" },
  { key: "assists", label: "Asistencias", mobileLabel: "Asist." },
  { key: "goalContributions", label: "G+A", mobileLabel: "G+A" },
  { key: "cleanSheets", label: "Imbatidos", mobileLabel: "Imbat." },
  { key: "cleanSheetRate", label: "Ratio imbatidos", mobileLabel: "Ratio" },
  { key: "goalsAgainstPerMatch", label: "Encajados/PJ", mobileLabel: "Enc./PJ" },
  { key: "yellowCards", label: "T. Amarillas", mobileLabel: "T. Amar." },
  { key: "redCards", label: "T. Rojas", mobileLabel: "T. Rojas" },
  { key: "ownGoals", label: "Goles en propia", mobileLabel: "P.P." },
];

export function getStatsColumns(teamType: PublicTeamType, playerType: PublicPlayerType): StatsColumn[] {
  if (teamType === "first-team") {
    return playerType === "goalkeeper" ? FIRST_TEAM_GOALKEEPER_COLUMNS : FIRST_TEAM_FIELD_COLUMNS;
  }

  return playerType === "goalkeeper" ? ACADEMY_GOALKEEPER_COLUMNS : ACADEMY_FIELD_COLUMNS;
}

export function calculateDerivedStats(player: PublicPlayerProfile): DerivedPlayerStats {
  return calculateDerivedStatsFromValues(player.stats);
}

export function calculateDerivedStatsFromValues(stats: PublicPlayerStats): DerivedPlayerStats {
  return {
    goalContributions: getGoalContributions(stats),
    goalsPerMatch: safeDivide(stats.goals, stats.matchesPlayed),
    shotAccuracy: safeDivide(stats.shotsOnTarget, stats.shots),
    cleanSheetRate: safeDivide(stats.cleanSheets, stats.matchesPlayed),
    goalsAgainstPerMatch: safeDivide(stats.goalsAgainst, stats.matchesPlayed),
    savesPerMatch: safeDivide(stats.saves, stats.matchesPlayed),
  };
}

export function getGoalContributions(stats: PublicPlayerStats): number {
  return stats.goals + stats.assists;
}

export function getQuickSortOptions(
  teamType: PublicTeamType,
  playerType: PublicPlayerType,
): Array<{ key: StatSortKey; label: string }> {
  if (playerType === "goalkeeper") {
    return teamType === "first-team"
      ? [
          { key: "cleanSheets", label: "Imbatidos" },
          { key: "goalsAgainstPerMatch", label: "Enc./PJ" },
          { key: "saves", label: "Paradas" },
          { key: "mvps", label: "MVP's" },
        ]
      : [
          { key: "cleanSheets", label: "Imbatidos" },
          { key: "goalsAgainstPerMatch", label: "Enc./PJ" },
          { key: "cleanSheetRate", label: "Ratio" },
          { key: "mvps", label: "MVP's" },
        ];
  }

  return [
    { key: "goals", label: "Goles" },
    { key: "goalContributions", label: "G+A" },
    { key: "goalsPerMatch", label: "G/P" },
    { key: "mvps", label: "MVP's" },
  ];
}

export function getMobileSummaryStats(
  player: PublicPlayerProfile,
  teamType: PublicTeamType,
  playerType: PublicPlayerType,
): PlayerStatSummaryItem[] {
  if (playerType === "goalkeeper") {
    const baseItems: PlayerStatSummaryItem[] = [
      { key: "cleanSheets", label: "Imbatidos", value: formatStatValue(player, "cleanSheets") },
      {
        key: "goalsAgainstPerMatch",
        label: "Enc./PJ",
        value: formatStatValue(player, "goalsAgainstPerMatch"),
      },
      {
        key: "goalContributions",
        label: "G+A",
        value: formatStatValue(player, "goalContributions"),
      },
    ];

    if (teamType === "first-team") {
      baseItems.splice(2, 0, {
        key: "saves",
        label: "Paradas",
        value: formatStatValue(player, "saves"),
      });
    } else {
      baseItems.splice(2, 0, {
        key: "mvps",
        label: "MVP's",
        value: formatStatValue(player, "mvps"),
      });
    }

    return baseItems;
  }

  return [
    { key: "goals", label: "Goles", value: formatStatValue(player, "goals") },
    { key: "assists", label: "Asistencias", value: formatStatValue(player, "assists") },
    { key: "mvps", label: "MVP's", value: formatStatValue(player, "mvps") },
    {
      key: "goalContributions",
      label: "G+A",
      value: formatStatValue(player, "goalContributions"),
    },
  ];
}

export function getPlayerCardStats(
  playerType: PublicPlayerType,
  stats: PublicPlayerStats,
  teamType: PublicTeamType,
): PlayerCardStatItem[] {
  if (playerType === "goalkeeper") {
    return teamType === "first-team"
      ? [
          { label: "PJ", value: stats.matchesPlayed },
          { label: "Imbat.", value: formatStatValueFromStats(stats, "cleanSheets") },
          { label: "Paradas", value: formatStatValueFromStats(stats, "saves") },
        ]
      : [
          { label: "PJ", value: stats.matchesPlayed },
          { label: "Enc./PJ", value: formatStatValueFromStats(stats, "goalsAgainstPerMatch") },
          { label: "Imbat.", value: formatStatValueFromStats(stats, "cleanSheets") },
        ];
  }

  return [
    { label: "PJ", value: stats.matchesPlayed },
    { label: "Goles", value: formatStatValueFromStats(stats, "goals") },
    { label: "Asist.", value: formatStatValueFromStats(stats, "assists") },
  ];
}

export function sortPlayers(
  players: PublicPlayerProfile[],
  sortKey: StatSortKey | null,
  sortDirection: SortDirection,
): PublicPlayerProfile[] {
  if (!sortKey) {
    return [...players];
  }

  return [...players].sort((left, right) => {
    const leftValue = getSortValue(left, sortKey);
    const rightValue = getSortValue(right, sortKey);

    if (typeof leftValue === "string" || typeof rightValue === "string") {
      const leftText = typeof leftValue === "string" ? leftValue : "";
      const rightText = typeof rightValue === "string" ? rightValue : "";
      const comparison = leftText.localeCompare(rightText, "es", { sensitivity: "base" });

      if (comparison !== 0) {
        return sortDirection === "asc" ? comparison : -comparison;
      }

      return getPlayerLabel(left).localeCompare(getPlayerLabel(right), "es", { sensitivity: "base" });
    }

    if (typeof leftValue !== "number" && typeof rightValue !== "number") {
      return getPlayerLabel(left).localeCompare(getPlayerLabel(right), "es", { sensitivity: "base" });
    }

    if (typeof leftValue !== "number") {
      return 1;
    }

    if (typeof rightValue !== "number") {
      return -1;
    }

    if (leftValue === rightValue) {
      return getPlayerLabel(left).localeCompare(getPlayerLabel(right), "es", { sensitivity: "base" });
    }

    return sortDirection === "asc" ? leftValue - rightValue : rightValue - leftValue;
  });
}

export function getPlayerDetailHref(player: PublicPlayerProfile): string {
  return getGlobalPlayerHref(player.slug);
}

export function getPlayerLabel(player: PublicPlayerProfile): string {
  return player.displayName ?? player.name;
}

export function formatStatValue(player: PublicPlayerProfile, key: StatSortKey): string {
  if (key === "player") {
    return getPlayerLabel(player);
  }

  return formatStatValueFromStats(player.stats, key);
}

export function formatStatValueFromStats(stats: PublicPlayerStats, key: Exclude<StatSortKey, "player">): string {
  const value = getStatValueFromStats(stats, key);

  if (typeof value !== "number") {
    return "-";
  }

  if (key === "shotAccuracy" || key === "cleanSheetRate") {
    return Intl.NumberFormat("es-ES", {
      style: "percent",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }

  if (key === "goalsPerMatch" || key === "goalsAgainstPerMatch" || key === "savesPerMatch") {
    return formatDecimal(value);
  }

  return Intl.NumberFormat("es-ES", {
    maximumFractionDigits: 0,
  }).format(value);
}

export function getStatMetricValue(player: PublicPlayerProfile, key: StatSortKey): number | undefined {
  const value = key === "player" ? undefined : getStatValueFromStats(player.stats, key);

  return typeof value === "number" ? value : undefined;
}

function getSortValue(player: PublicPlayerProfile, key: StatSortKey): number | string | undefined {
  return key === "player" ? getPlayerLabel(player) : getStatValueFromStats(player.stats, key);
}

function getStatValueFromStats(
  stats: PublicPlayerStats,
  key: Exclude<StatSortKey, "player">,
): number | undefined {
  const derivedStats = calculateDerivedStatsFromValues(stats);

  switch (key) {
    case "mvps":
      return stats.mvps;
    case "matchesPlayed":
      return stats.matchesPlayed;
    case "goals":
      return stats.goals;
    case "assists":
      return stats.assists;
    case "goalContributions":
      return derivedStats.goalContributions;
    case "goalsPerMatch":
      return derivedStats.goalsPerMatch;
    case "recoveries":
      return stats.recoveries;
    case "shots":
      return stats.shots;
    case "shotsOnTarget":
      return stats.shotsOnTarget;
    case "shotAccuracy":
      return derivedStats.shotAccuracy;
    case "cleanSheets":
      return stats.cleanSheets;
    case "cleanSheetRate":
      return derivedStats.cleanSheetRate;
    case "goalsAgainstPerMatch":
      return derivedStats.goalsAgainstPerMatch;
    case "saves":
      return stats.saves;
    case "savesPerMatch":
      return derivedStats.savesPerMatch;
    case "yellowCards":
      return stats.yellowCards;
    case "redCards":
      return stats.redCards;
    case "ownGoals":
      return stats.ownGoals;
    default:
      return undefined;
  }
}

function safeDivide(value: number | undefined, total: number | undefined) {
  if (typeof value !== "number" || typeof total !== "number" || total <= 0) {
    return undefined;
  }

  return value / total;
}

function formatDecimal(value: number) {
  return Intl.NumberFormat("es-ES", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}
