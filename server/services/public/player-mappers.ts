import type {
  DominantFoot,
  PublicPlayerGroup,
  PublicPlayerStats,
  PublicPlayerType,
} from "@/lib/public/player-profile-content";

export const COUNTRY_LABELS: Record<string, string> = {
  ES: "Espana",
  PT: "Portugal",
  PL: "Polonia",
  BO: "Bolivia",
  AR: "Argentina",
  BR: "Brasil",
  MA: "Marruecos",
  JP: "Japon",
  GB: "Inglaterra",
  DE: "Alemania",
  IT: "Italia",
  NO: "Noruega",
  IE: "Irlanda",
  FR: "Francia",
  US: "Estados Unidos",
  SE: "Suecia",
};

export type PublicPlayerStatsRow = {
  played: boolean;
  goals: number;
  assists: number;
  mvp: number;
  yellowCards: number;
  redCards: number;
  recoveries: number;
  shots: number;
  shotsOnTarget: number;
  ownGoals: number;
  saves: number;
  goalsAgainst: number;
  cleanSheets: number;
};

export function mapDominantFoot(value: string | null): DominantFoot | undefined {
  if (!value) {
    return undefined;
  }

  const normalizedValue = value.trim().toUpperCase();

  if (normalizedValue === "LEFT" || normalizedValue === "IZQUIERDA") {
    return "left";
  }

  if (normalizedValue === "RIGHT" || normalizedValue === "DERECHA") {
    return "right";
  }

  if (normalizedValue === "BOTH" || normalizedValue === "AMBAS") {
    return "both";
  }

  return "unknown";
}

export function mapPositionLabel(value: string | null) {
  if (!value) {
    return "Jugador";
  }

  const normalizedValue = value.trim().toUpperCase();

  switch (normalizedValue) {
    case "GOALKEEPER":
    case "POR":
    case "PORTERO":
      return "Portero";
    case "DEFENDER":
    case "DEFENSA":
    case "DFC":
      return "Defensa";
    case "MIDFIELDER":
    case "MCO":
    case "MC":
    case "MEDIO":
    case "MEDIOCENTRO":
      return "Mediocentro";
    case "FORWARD":
    case "DELANTERO":
    case "DC":
      return "Delantero";
    case "BANDA":
      return "Banda";
    default:
      return value
        .toLowerCase()
        .split(/[\s_-]+/)
        .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
        .join(" ");
  }
}

export function inferPlayerType(position: string | null): PublicPlayerType {
  const normalizedValue = position?.trim().toUpperCase() ?? "";

  if (normalizedValue === "GOALKEEPER" || normalizedValue === "POR" || normalizedValue === "PORTERO") {
    return "goalkeeper";
  }

  return "field";
}

export function inferPlayerGroup(positionLabel: string): PublicPlayerGroup {
  const normalizedLabel = positionLabel.toLowerCase();

  if (normalizedLabel.includes("defensa") || normalizedLabel.includes("lateral")) {
    return "defensas";
  }

  if (
    normalizedLabel.includes("delantero") ||
    normalizedLabel.includes("extremo") ||
    normalizedLabel.includes("banda")
  ) {
    return "delanteros";
  }

  return "mediocentros";
}

export function buildPlayerName(input: {
  publicName: string | null;
  firstName: string;
  lastName: string;
}) {
  const publicName = input.publicName?.trim();

  if (publicName) {
    return publicName;
  }

  return `${input.firstName} ${input.lastName}`.trim();
}

export function mapCountryLabel(countryCode: string | null) {
  if (!countryCode) {
    return undefined;
  }

  return COUNTRY_LABELS[countryCode.toUpperCase()] ?? countryCode.toUpperCase();
}

export function createEmptyStats(): PublicPlayerStats {
  return {
    matchesPlayed: 0,
    goals: 0,
    assists: 0,
    goalsAgainst: 0,
    yellowCards: 0,
    redCards: 0,
    recoveries: 0,
    shots: 0,
    shotsOnTarget: 0,
    ownGoals: 0,
    saves: 0,
    cleanSheets: 0,
    mvps: 0,
  };
}

export function aggregatePublicPlayerStats(rows: PublicPlayerStatsRow[]): PublicPlayerStats {
  const stats = createEmptyStats();

  for (const row of rows) {
    stats.matchesPlayed += row.played ? 1 : 0;
    stats.goals += row.goals;
    stats.assists += row.assists;
    stats.mvps += row.mvp;
    stats.yellowCards += row.yellowCards;
    stats.redCards += row.redCards;
    stats.recoveries = (stats.recoveries ?? 0) + row.recoveries;
    stats.shots = (stats.shots ?? 0) + row.shots;
    stats.shotsOnTarget = (stats.shotsOnTarget ?? 0) + row.shotsOnTarget;
    stats.ownGoals += row.ownGoals;
    stats.saves = (stats.saves ?? 0) + row.saves;
    stats.goalsAgainst = (stats.goalsAgainst ?? 0) + row.goalsAgainst;
    stats.cleanSheets = (stats.cleanSheets ?? 0) + row.cleanSheets;
  }

  return stats;
}
