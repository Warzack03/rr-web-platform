export type DominantFoot = "left" | "right" | "both" | "unknown";

export type FirstTeamPlayerType = "field" | "goalkeeper";

export type FirstTeamPlayerStats = {
  matchesPlayed: number;
  goals: number;
  assists: number;
  goalsAgainst?: number;
  yellowCards: number;
  redCards: number;
  ownGoals: number;
  mvps: number;
  recoveries?: number;
  shots?: number;
  shotsOnTarget?: number;
  cleanSheets?: number;
  saves?: number;
};

export type FirstTeamSquadPlayer = {
  id: string;
  slug: string;
  firstName: string;
  lastName: string;
  name: string;
  number: number;
  country: string;
  countryFlag: string;
  position: string;
  dominantFoot: DominantFoot;
  imageUrl: string;
  playerType: FirstTeamPlayerType;
  group?: "defensas" | "mediocentros" | "delanteros";
  teamType: "first-team";
  teamLabel: string;
  seasonLabel: string;
  shopHref: string;
  stats: FirstTeamPlayerStats;
};

export type FirstTeamSquadContent = {
  pageTitle: string;
  goalkeepers: FirstTeamSquadPlayer[];
  fieldPlayers: FirstTeamSquadPlayer[];
};

const FIRST_TEAM_PLAYERS: FirstTeamSquadPlayer[] = [
  {
    id: "mark-evans",
    slug: "mark-evans",
    firstName: "Mark",
    lastName: "Evans",
    name: "Mark Evans",
    number: 1,
    country: "Espana",
    countryFlag: "ES",
    position: "Portero",
    dominantFoot: "right",
    imageUrl: "/images/mock/first-team/teo-ibarra.svg",
    playerType: "goalkeeper",
    teamType: "first-team",
    teamLabel: "Primer Equipo",
    seasonLabel: "Temporada 2025/26",
    shopHref: "https://tienda.risingraimon.es",
    stats: {
      matchesPlayed: 32,
      goals: 0,
      assists: 2,
      goalsAgainst: 21,
      yellowCards: 3,
      redCards: 0,
      cleanSheets: 14,
      saves: 118,
      ownGoals: 0,
      mvps: 5,
    },
  },
  {
    id: "nathan-swift",
    slug: "nathan-swift",
    firstName: "Nathan",
    lastName: "Swift",
    name: "Nathan Swift",
    number: 2,
    country: "Inglaterra",
    countryFlag: "GB",
    position: "Defensa",
    dominantFoot: "right",
    imageUrl: "/images/mock/first-team/dario-kestrel.svg",
    playerType: "field",
    group: "defensas",
    teamType: "first-team",
    teamLabel: "Primer Equipo",
    seasonLabel: "Temporada 2025/26",
    shopHref: "https://tienda.risingraimon.es",
    stats: {
      matchesPlayed: 29,
      goals: 1,
      assists: 4,
      yellowCards: 6,
      redCards: 1,
      recoveries: 104,
      shots: 18,
      shotsOnTarget: 7,
      ownGoals: 1,
      mvps: 2,
    },
  },
  {
    id: "jude-sharp",
    slug: "jude-sharp",
    firstName: "Jude",
    lastName: "Sharp",
    name: "Jude Sharp",
    number: 14,
    country: "Japon",
    countryFlag: "JP",
    position: "Mediocentro",
    dominantFoot: "left",
    imageUrl: "/images/mock/first-team/leo-serrano.svg",
    playerType: "field",
    group: "mediocentros",
    teamType: "first-team",
    teamLabel: "Primer Equipo",
    seasonLabel: "Temporada 2025/26",
    shopHref: "https://tienda.risingraimon.es",
    stats: {
      matchesPlayed: 30,
      goals: 8,
      assists: 11,
      yellowCards: 5,
      redCards: 0,
      recoveries: 88,
      shots: 47,
      shotsOnTarget: 22,
      ownGoals: 0,
      mvps: 6,
    },
  },
  {
    id: "kevin-dragonfly",
    slug: "kevin-dragonfly",
    firstName: "Kevin",
    lastName: "Dragonfly",
    name: "Kevin Dragonfly",
    number: 11,
    country: "Italia",
    countryFlag: "IT",
    position: "Delantero",
    dominantFoot: "both",
    imageUrl: "/images/mock/first-team/dario-kestrel.svg",
    playerType: "field",
    group: "delanteros",
    teamType: "first-team",
    teamLabel: "Primer Equipo",
    seasonLabel: "Temporada 2025/26",
    shopHref: "https://tienda.risingraimon.es",
    stats: {
      matchesPlayed: 27,
      goals: 13,
      assists: 5,
      yellowCards: 2,
      redCards: 0,
      recoveries: 33,
      shots: 74,
      shotsOnTarget: 31,
      ownGoals: 0,
      mvps: 4,
    },
  },
  {
    id: "axel-blaze",
    slug: "axel-blaze",
    firstName: "Axel",
    lastName: "Blaze",
    name: "Axel Blaze",
    number: 10,
    country: "Japon",
    countryFlag: "JP",
    position: "Delantero",
    dominantFoot: "right",
    imageUrl: "/images/mock/first-team/noah-carden.svg",
    playerType: "field",
    group: "delanteros",
    teamType: "first-team",
    teamLabel: "Primer Equipo",
    seasonLabel: "Temporada 2025/26",
    shopHref: "https://tienda.risingraimon.es",
    stats: {
      matchesPlayed: 28,
      goals: 18,
      assists: 7,
      yellowCards: 4,
      redCards: 0,
      recoveries: 49,
      shots: 86,
      shotsOnTarget: 41,
      ownGoals: 0,
      mvps: 8,
    },
  },
];

const FIRST_TEAM_SQUAD_CONTENT: FirstTeamSquadContent = {
  pageTitle: "Plantilla - Primer Equipo",
  goalkeepers: FIRST_TEAM_PLAYERS.filter((player) => player.playerType === "goalkeeper"),
  fieldPlayers: FIRST_TEAM_PLAYERS.filter((player) => player.playerType === "field"),
};

export function getFirstTeamSquadContent(): FirstTeamSquadContent {
  return FIRST_TEAM_SQUAD_CONTENT;
}

export function getFirstTeamPlayerDetail(playerSlug: string): FirstTeamSquadPlayer | null {
  return FIRST_TEAM_PLAYERS.find((player) => player.slug === playerSlug) ?? null;
}

export function getFirstTeamPlayerSlugs(): string[] {
  return FIRST_TEAM_PLAYERS.map((player) => player.slug);
}

export function getFirstTeamPlayerHref(playerSlug: string): string | undefined {
  return getFirstTeamPlayerDetail(playerSlug) ? `/jugadores/${playerSlug}` : undefined;
}
