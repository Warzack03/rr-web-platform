import type {
  PublicPlayerProfile,
  PublicPlayerType,
  PublicTeamType,
} from "@/lib/public/player-profile-types";
import { getGlobalPlayerHref } from "@/lib/public/player-routes";
import type { TeamSectionNavLink } from "@/lib/public/team-section-links";

export type StatSortKey =
  | "player"
  | "mvps"
  | "matchesPlayed"
  | "goals"
  | "assists"
  | "goalContributions"
  | "goalsPerMatch"
  | "recoveries"
  | "shots"
  | "shotsOnTarget"
  | "shotAccuracy"
  | "cleanSheets"
  | "cleanSheetRate"
  | "goalsAgainstPerMatch"
  | "saves"
  | "savesPerMatch"
  | "yellowCards"
  | "redCards"
  | "ownGoals";

export type SortDirection = "asc" | "desc";

export type StatsColumn = {
  key: StatSortKey;
  label: string;
  mobileLabel?: string;
};

export type DerivedPlayerStats = {
  goalContributions: number;
  goalsPerMatch?: number;
  shotAccuracy?: number;
  cleanSheetRate?: number;
  goalsAgainstPerMatch?: number;
  savesPerMatch?: number;
};

export type TeamStatisticsPageContent = {
  teamType: PublicTeamType;
  teamSlug: string;
  teamName: string;
  season: string;
  competition: string;
  category?: string;
  title: string;
  subtitle: string;
  backHref: string;
  backLabel: string;
  navLinks: TeamSectionNavLink[];
  fieldPlayers: PublicPlayerProfile[];
  goalkeepers: PublicPlayerProfile[];
};

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
  { key: "goalsAgainstPerMatch", label: "E/P", mobileLabel: "E/P" },
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
  { key: "goalsAgainstPerMatch", label: "E/P", mobileLabel: "E/P" },
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
  const { stats } = player;

  return {
    goalContributions: stats.goals + stats.assists,
    goalsPerMatch: safeDivide(stats.goals, stats.matchesPlayed),
    shotAccuracy: safeDivide(stats.shotsOnTarget, stats.shots),
    cleanSheetRate: safeDivide(stats.cleanSheets, stats.matchesPlayed),
    goalsAgainstPerMatch: safeDivide(stats.goalsAgainst, stats.matchesPlayed),
    savesPerMatch: safeDivide(stats.saves, stats.matchesPlayed),
  };
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

  const value = getSortValue(player, key);

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
  const value = getSortValue(player, key);

  return typeof value === "number" ? value : undefined;
}

function getSortValue(player: PublicPlayerProfile, key: StatSortKey): number | string | undefined {
  const { stats } = player;
  const derivedStats = calculateDerivedStats(player);

  switch (key) {
    case "player":
      return getPlayerLabel(player);
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
