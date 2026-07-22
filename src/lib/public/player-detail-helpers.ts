import type {
  PublicPlayerStats,
  PublicPlayerStatsLevel,
  PublicPlayerType,
} from "@/lib/public/player-profile-types";
import { getGoalContributions } from "@/lib/public/team-statistics-utils";

export type PlayerStatTone = "default" | "warning" | "danger";
export type PlayerStatIcon =
  | "matches"
  | "goals"
  | "assists"
  | "goalsAgainst"
  | "yellowCard"
  | "redCard"
  | "cleanSheet"
  | "saves"
  | "ownGoals"
  | "mvps"
  | "recoveries"
  | "shots"
  | "shotsOnTarget"
  | "goalContributions"
  | "goalsPerMatch"
  | "assistsPerMatch"
  | "goalsAgainstPerMatch"
  | "shotsPerGoalAgainst"
  | "contributionsPerMatch"
  | "shotsPerMatch"
  | "shotAccuracy"
  | "cleanSheetRate";

export type PlayerStatItem = {
  label: string;
  value: string;
  tone?: PlayerStatTone;
  icon: PlayerStatIcon;
};

export function getPlayerBaseStats(
  playerType: PublicPlayerType,
  stats: PublicPlayerStats,
  statsLevel: PublicPlayerStatsLevel = "advanced",
): PlayerStatItem[] {
  if (playerType === "goalkeeper") {
    if (statsLevel === "basic") {
      return [
        { label: "Partidos jugados", value: formatInteger(stats.matchesPlayed), icon: "matches" },
        { label: "Goles", value: formatInteger(stats.goals), icon: "goals" },
        { label: "Asistencias", value: formatInteger(stats.assists), icon: "assists" },
        {
          label: "Amarillas",
          value: formatInteger(stats.yellowCards),
          tone: "warning",
          icon: "yellowCard",
        },
        {
          label: "Rojas",
          value: formatInteger(stats.redCards),
          tone: "danger",
          icon: "redCard",
        },
        { label: "Imbatidos", value: formatOptionalInteger(stats.cleanSheets), icon: "cleanSheet" },
        { label: "Goles en propia", value: formatInteger(stats.ownGoals), icon: "ownGoals" },
        { label: "MVP's", value: formatInteger(stats.mvps), icon: "mvps" },
      ];
    }

    return [
      { label: "Partidos jugados", value: formatInteger(stats.matchesPlayed), icon: "matches" },
      { label: "Goles", value: formatInteger(stats.goals), icon: "goals" },
      { label: "Asistencias", value: formatInteger(stats.assists), icon: "assists" },
      {
        label: "Encajados",
        value: formatOptionalInteger(stats.goalsAgainst),
        icon: "goalsAgainst",
      },
      {
        label: "Tarjetas amarillas",
        value: formatInteger(stats.yellowCards),
        tone: "warning",
        icon: "yellowCard",
      },
      {
        label: "Tarjetas rojas",
        value: formatInteger(stats.redCards),
        tone: "danger",
        icon: "redCard",
      },
      { label: "Imbatidos", value: formatOptionalInteger(stats.cleanSheets), icon: "cleanSheet" },
      { label: "Paradas", value: formatOptionalInteger(stats.saves), icon: "saves" },
      { label: "Goles en propia", value: formatInteger(stats.ownGoals), icon: "ownGoals" },
      { label: "MVP's", value: formatInteger(stats.mvps), icon: "mvps" },
    ];
  }

  if (statsLevel === "basic") {
    return [
      { label: "Partidos jugados", value: formatInteger(stats.matchesPlayed), icon: "matches" },
      { label: "Goles", value: formatInteger(stats.goals), icon: "goals" },
      { label: "Asistencias", value: formatInteger(stats.assists), icon: "assists" },
      {
        label: "Amarillas",
        value: formatInteger(stats.yellowCards),
        tone: "warning",
        icon: "yellowCard",
      },
      {
        label: "Rojas",
        value: formatInteger(stats.redCards),
        tone: "danger",
        icon: "redCard",
      },
      { label: "Goles en propia", value: formatInteger(stats.ownGoals), icon: "ownGoals" },
      { label: "MVP's", value: formatInteger(stats.mvps), icon: "mvps" },
    ];
  }

  return [
    { label: "Partidos jugados", value: formatInteger(stats.matchesPlayed), icon: "matches" },
    { label: "Goles", value: formatInteger(stats.goals), icon: "goals" },
    { label: "Asistencias", value: formatInteger(stats.assists), icon: "assists" },
    {
      label: "Tarjetas amarillas",
      value: formatInteger(stats.yellowCards),
      tone: "warning",
      icon: "yellowCard",
    },
    {
      label: "Tarjetas rojas",
      value: formatInteger(stats.redCards),
      tone: "danger",
      icon: "redCard",
    },
    { label: "Recuperaciones", value: formatOptionalInteger(stats.recoveries), icon: "recoveries" },
    { label: "Tiros", value: formatOptionalInteger(stats.shots), icon: "shots" },
    {
      label: "Tiros a puerta",
      value: formatOptionalInteger(stats.shotsOnTarget),
      icon: "shotsOnTarget",
    },
    { label: "Goles en propia", value: formatInteger(stats.ownGoals), icon: "ownGoals" },
    { label: "MVP's", value: formatInteger(stats.mvps), icon: "mvps" },
  ];
}

export function getPlayerDerivedMetrics(
  playerType: PublicPlayerType,
  stats: PublicPlayerStats,
  statsLevel: PublicPlayerStatsLevel = "advanced",
): PlayerStatItem[] {
  const goalContributions = getGoalContributions(stats);

  if (playerType === "goalkeeper") {
    if (statsLevel === "basic") {
      const items: PlayerStatItem[] = [
        {
          label: "Participaciones de gol",
          value: formatInteger(goalContributions),
          icon: "goalContributions",
        },
        {
          label: "Encajados por partido",
          value: formatRatio(stats.goalsAgainst, stats.matchesPlayed),
          icon: "goalsAgainstPerMatch",
        },
        {
          label: "Ratio de imbatidos",
          value: formatPercentage(stats.cleanSheets, stats.matchesPlayed),
          icon: "cleanSheetRate",
        },
      ];

      if (goalContributions > 0) {
        items.push({
          label: "Participaciones por partido",
          value: formatRatio(goalContributions, stats.matchesPlayed),
          icon: "contributionsPerMatch",
        });
      }

      return items;
    }

    return [
      {
        label: "Participaciones de gol",
        value: formatInteger(goalContributions),
        icon: "goalContributions",
      },
      {
        label: "Encajados por partido",
        value: formatRatio(stats.goalsAgainst, stats.matchesPlayed),
        icon: "goalsAgainstPerMatch",
      },
      {
        label: "Paradas por partido",
        value: formatRatio(stats.saves, stats.matchesPlayed),
        icon: "saves",
      },
      {
        label: "% imbatidos",
        value: formatPercentage(stats.cleanSheets, stats.matchesPlayed),
        icon: "cleanSheetRate",
      },
      {
        label: "Tiros por gol encajado",
        value: formatRatio(sum(stats.saves, stats.goalsAgainst), stats.goalsAgainst ?? 0),
        icon: "shotsPerGoalAgainst",
      },
    ];
  }

  if (statsLevel === "basic") {
    return [
      {
        label: "Participaciones de gol",
        value: formatInteger(goalContributions),
        icon: "goalContributions",
      },
      {
        label: "Goles por partido",
        value: formatRatio(stats.goals, stats.matchesPlayed),
        icon: "goalsPerMatch",
      },
      {
        label: "Asistencias por partido",
        value: formatRatio(stats.assists, stats.matchesPlayed),
        icon: "assistsPerMatch",
      },
      {
        label: "Participaciones por partido",
        value: formatRatio(goalContributions, stats.matchesPlayed),
        icon: "contributionsPerMatch",
      },
    ];
  }

  return [
    {
      label: "Participaciones de gol",
      value: formatInteger(goalContributions),
      icon: "goalContributions",
    },
    {
      label: "Goles por partido",
      value: formatRatio(stats.goals, stats.matchesPlayed),
      icon: "goalsPerMatch",
    },
    {
      label: "Asistencias por partido",
      value: formatRatio(stats.assists, stats.matchesPlayed),
      icon: "assistsPerMatch",
    },
    {
      label: "Participaciones por partido",
      value: formatRatio(goalContributions, stats.matchesPlayed),
      icon: "contributionsPerMatch",
    },
    {
      label: "Tiros por partido",
      value: formatRatio(stats.shots, stats.matchesPlayed),
      icon: "shotsPerMatch",
    },
    {
      label: "Precision de tiro",
      value: formatPercentage(stats.shotsOnTarget, stats.shots),
      icon: "shotAccuracy",
    },
  ];
}

function formatInteger(value: number): string {
  return Intl.NumberFormat("es-ES", { maximumFractionDigits: 0 }).format(value);
}

function formatOptionalInteger(value?: number): string {
  return typeof value === "number" ? formatInteger(value) : "-";
}

function formatRatio(value: number | undefined, total: number): string {
  if (typeof value !== "number" || total <= 0) {
    return "-";
  }

  return Intl.NumberFormat("es-ES", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value / total);
}

function formatPercentage(value: number | undefined, total: number | undefined): string {
  if (typeof value !== "number" || typeof total !== "number" || total <= 0) {
    return "-";
  }

  return Intl.NumberFormat("es-ES", {
    style: "percent",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value / total);
}

function sum(...values: Array<number | undefined>): number | undefined {
  if (values.some((value) => typeof value !== "number")) {
    return undefined;
  }

  let total = 0;

  for (const value of values) {
    total += value as number;
  }

  return total;
}
