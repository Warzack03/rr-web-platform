export type DominantFoot = "left" | "right" | "both" | "unknown";

export type PublicPlayerType = "field" | "goalkeeper";
export type PublicTeamType = "first-team" | "academy";
export type PublicPlayerStatsLevel = "advanced" | "basic";
export type PublicPlayerGroup = "defensas" | "mediocentros" | "delanteros";

export type PublicPlayerStats = {
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

export type PublicPlayerProfile = {
  id: string;
  slug: string;
  displayName?: string;
  firstName: string;
  lastName: string;
  name: string;
  number: number;
  country?: string;
  countryFlag?: string;
  position: string;
  dominantFoot?: DominantFoot;
  imageUrl?: string;
  playerType: PublicPlayerType;
  group?: PublicPlayerGroup;
  teamType: PublicTeamType;
  statsLevel: PublicPlayerStatsLevel;
  teamSlug: string;
  teamLabel: string;
  seasonLabel: string;
  shopHref?: string;
  relatedTeams?: Array<{
    teamSlug: string;
    teamLabel: string;
    teamType: PublicTeamType;
  }>;
  stats: PublicPlayerStats;
};

export type AcademySquadPlayer = PublicPlayerProfile & {
  teamType: "academy";
  statsLevel: "basic";
};

export type AcademySquadContent = {
  pageTitle: string;
  teamSlug: string;
  teamLabel: string;
  seasonLabel: string;
  goalkeepers: AcademySquadPlayer[];
  fieldPlayers: AcademySquadPlayer[];
};

type AcademyTeamRosterSeed = {
  teamLabel: string;
  seasonLabel: string;
  players: AcademySquadPlayer[];
};

function createAcademyPlayer(
  input: Omit<AcademySquadPlayer, "teamType" | "statsLevel">,
): AcademySquadPlayer {
  return {
    ...input,
    group:
      input.playerType === "field" ? (input.group ?? inferPlayerGroupFromPosition(input.position)) : undefined,
    teamType: "academy",
    statsLevel: "basic",
  };
}

function inferPlayerGroupFromPosition(position: string): PublicPlayerGroup {
  const normalizedPosition = position.toLowerCase();

  if (normalizedPosition.includes("defensa") || normalizedPosition.includes("lateral")) {
    return "defensas";
  }

  if (
    normalizedPosition.includes("delantero") ||
    normalizedPosition.includes("extremo") ||
    normalizedPosition.includes("banda")
  ) {
    return "delanteros";
  }

  return "mediocentros";
}

type AcademyDepthTemplate = Omit<
  AcademySquadPlayer,
  "id" | "teamSlug" | "teamLabel" | "seasonLabel" | "teamType" | "statsLevel"
>;

const ACADEMY_GOALKEEPER_DEPTH_TEMPLATES: AcademyDepthTemplate[] = [
  {
    slug: "owen-frost",
    firstName: "Owen",
    lastName: "Frost",
    name: "Owen Frost",
    number: 13,
    country: "Francia",
    countryFlag: "FR",
    position: "Portero",
    dominantFoot: "left",
    imageUrl: "/images/mock/first-team/teo-ibarra.svg",
    playerType: "goalkeeper",
    stats: {
      matchesPlayed: 6,
      goals: 0,
      assists: 0,
      goalsAgainst: 5,
      yellowCards: 0,
      redCards: 0,
      cleanSheets: 2,
      ownGoals: 0,
      mvps: 1,
    },
  },
  {
    slug: "mateo-rios",
    firstName: "Mateo",
    lastName: "Rios",
    name: "Mateo Rios",
    number: 25,
    country: "Espana",
    countryFlag: "ES",
    position: "Portero",
    dominantFoot: "right",
    imageUrl: undefined,
    playerType: "goalkeeper",
    stats: {
      matchesPlayed: 4,
      goals: 0,
      assists: 0,
      goalsAgainst: 4,
      yellowCards: 0,
      redCards: 0,
      cleanSheets: 1,
      ownGoals: 0,
      mvps: 0,
    },
  },
];

const ACADEMY_FIELD_DEPTH_TEMPLATES: AcademyDepthTemplate[] = [
  {
    slug: "liam-doyle",
    firstName: "Liam",
    lastName: "Doyle",
    name: "Liam Doyle",
    number: 12,
    country: "Irlanda",
    countryFlag: "IE",
    position: "Defensa",
    dominantFoot: "right",
    imageUrl: "/images/mock/first-team/dario-kestrel.svg",
    playerType: "field",
    group: "defensas",
    stats: {
      matchesPlayed: 9,
      goals: 1,
      assists: 1,
      yellowCards: 2,
      redCards: 0,
      ownGoals: 0,
      mvps: 0,
    },
  },
  {
    slug: "marco-rivera",
    firstName: "Marco",
    lastName: "Rivera",
    name: "Marco Rivera",
    number: 14,
    country: "Espana",
    countryFlag: "ES",
    position: "Lateral",
    dominantFoot: "left",
    imageUrl: "/images/mock/first-team/leo-serrano.svg",
    playerType: "field",
    group: "defensas",
    stats: {
      matchesPlayed: 10,
      goals: 0,
      assists: 2,
      yellowCards: 1,
      redCards: 0,
      ownGoals: 0,
      mvps: 0,
    },
  },
  {
    slug: "hugo-costa",
    firstName: "Hugo",
    lastName: "Costa",
    name: "Hugo Costa",
    number: 15,
    country: "Portugal",
    countryFlag: "PT",
    position: "Mediocentro",
    dominantFoot: "both",
    imageUrl: "/images/mock/first-team/teo-ibarra.svg",
    playerType: "field",
    group: "mediocentros",
    stats: {
      matchesPlayed: 11,
      goals: 2,
      assists: 3,
      yellowCards: 2,
      redCards: 0,
      ownGoals: 0,
      mvps: 1,
    },
  },
  {
    slug: "ivan-orozco",
    firstName: "Ivan",
    lastName: "Orozco",
    name: "Ivan Orozco",
    number: 17,
    country: "Espana",
    countryFlag: "ES",
    position: "Mediapunta",
    dominantFoot: "right",
    imageUrl: "/images/mock/first-team/noah-carden.svg",
    playerType: "field",
    group: "mediocentros",
    stats: {
      matchesPlayed: 10,
      goals: 3,
      assists: 2,
      yellowCards: 1,
      redCards: 0,
      ownGoals: 0,
      mvps: 1,
    },
  },
  {
    slug: "leo-santos",
    firstName: "Leo",
    lastName: "Santos",
    name: "Leo Santos",
    number: 19,
    country: "Brasil",
    countryFlag: "BR",
    position: "Extremo",
    dominantFoot: "right",
    imageUrl: undefined,
    playerType: "field",
    group: "delanteros",
    stats: {
      matchesPlayed: 9,
      goals: 3,
      assists: 2,
      yellowCards: 0,
      redCards: 0,
      ownGoals: 0,
      mvps: 1,
    },
  },
  {
    slug: "diego-salvat",
    firstName: "Diego",
    lastName: "Salvat",
    name: "Diego Salvat",
    number: 21,
    country: "Argentina",
    countryFlag: "AR",
    position: "Delantero",
    dominantFoot: "left",
    imageUrl: "/images/mock/first-team/dario-kestrel.svg",
    playerType: "field",
    group: "delanteros",
    stats: {
      matchesPlayed: 8,
      goals: 4,
      assists: 1,
      yellowCards: 1,
      redCards: 0,
      ownGoals: 0,
      mvps: 1,
    },
  },
];

function buildAcademyDepthPlayers(
  teamSlug: string,
  teamLabel: string,
  seasonLabel: string,
  templates: AcademyDepthTemplate[],
) {
  return templates.map((template) =>
    createAcademyPlayer({
      ...template,
      id: `${teamSlug}-${template.slug}`,
      teamSlug,
      teamLabel,
      seasonLabel,
    }),
  );
}

function ensureMinimumAcademyDepth(
  teamSlug: string,
  teamLabel: string,
  seasonLabel: string,
  players: AcademySquadPlayer[],
) {
  const goalkeepers = players.filter((player) => player.playerType === "goalkeeper");
  const fieldPlayers = players.filter((player) => player.playerType === "field");
  const nextPlayers = [...players];

  if (goalkeepers.length < 2) {
    nextPlayers.push(
      ...buildAcademyDepthPlayers(
        teamSlug,
        teamLabel,
        seasonLabel,
        ACADEMY_GOALKEEPER_DEPTH_TEMPLATES.slice(0, 2 - goalkeepers.length),
      ),
    );
  }

  if (fieldPlayers.length < 8) {
    nextPlayers.push(
      ...buildAcademyDepthPlayers(
        teamSlug,
        teamLabel,
        seasonLabel,
        ACADEMY_FIELD_DEPTH_TEMPLATES.slice(0, 8 - fieldPlayers.length),
      ),
    );
  }

  return nextPlayers;
}

const ACADEMY_TEAM_ROSTER_SEEDS: Record<string, AcademyTeamRosterSeed> = {
  "raimon-b": {
    teamLabel: "Raimon B",
    seasonLabel: "Temporada 2023/24",
    players: [
      createAcademyPlayer({
        id: "raimon-b-alex-zabel",
        slug: "alex-zabel",
        firstName: "Alex",
        lastName: "Zabel",
        name: "Alex Zabel",
        number: 1,
        country: "Alemania",
        countryFlag: "DE",
        position: "Portero",
        dominantFoot: "right",
        imageUrl: undefined,
        playerType: "goalkeeper",
        teamSlug: "raimon-b",
        teamLabel: "Raimon B",
        seasonLabel: "Temporada 2023/24",
        stats: {
          matchesPlayed: 16,
          goals: 0,
          assists: 1,
          goalsAgainst: 14,
          yellowCards: 1,
          redCards: 0,
          cleanSheets: 7,
          ownGoals: 0,
          mvps: 2,
        },
      }),
      createAcademyPlayer({
        id: "raimon-b-erik-eagle",
        slug: "erik-eagle",
        firstName: "Erik",
        lastName: "Eagle",
        name: "Erik Eagle",
        number: 4,
        country: "Suecia",
        countryFlag: "SE",
        position: "Defensa",
        dominantFoot: "right",
        imageUrl: "/images/mock/first-team/dario-kestrel.svg",
        playerType: "field",
        teamSlug: "raimon-b",
        teamLabel: "Raimon B",
        seasonLabel: "Temporada 2023/24",
        stats: {
          matchesPlayed: 18,
          goals: 2,
          assists: 1,
          yellowCards: 5,
          redCards: 0,
          ownGoals: 1,
          mvps: 1,
        },
      }),
      createAcademyPlayer({
        id: "raimon-b-jack-wallside",
        slug: "jack-wallside",
        firstName: "Jack",
        lastName: "Wallside",
        name: "Jack Wallside",
        number: 3,
        country: "Espana",
        countryFlag: "ES",
        position: "Lateral",
        dominantFoot: "left",
        imageUrl: "/images/mock/first-team/leo-serrano.svg",
        playerType: "field",
        teamSlug: "raimon-b",
        teamLabel: "Raimon B",
        seasonLabel: "Temporada 2023/24",
        stats: {
          matchesPlayed: 17,
          goals: 0,
          assists: 3,
          yellowCards: 3,
          redCards: 0,
          ownGoals: 0,
          mvps: 0,
        },
      }),
      createAcademyPlayer({
        id: "raimon-b-sam-kincaid",
        slug: "sam-kincaid",
        firstName: "Sam",
        lastName: "Kincaid",
        name: "Sam Kincaid",
        number: 8,
        country: "Inglaterra",
        countryFlag: "GB",
        position: "Mediocentro",
        dominantFoot: "both",
        imageUrl: "/images/mock/first-team/teo-ibarra.svg",
        playerType: "field",
        teamSlug: "raimon-b",
        teamLabel: "Raimon B",
        seasonLabel: "Temporada 2023/24",
        stats: {
          matchesPlayed: 18,
          goals: 4,
          assists: 6,
          yellowCards: 4,
          redCards: 0,
          ownGoals: 0,
          mvps: 3,
        },
      }),
      createAcademyPlayer({
        id: "raimon-b-nathan-swift",
        slug: "nathan-swift",
        firstName: "Nathan",
        lastName: "Swift",
        name: "Nathan Swift",
        number: 7,
        country: "Inglaterra",
        countryFlag: "GB",
        position: "Extremo",
        dominantFoot: "right",
        imageUrl: "/images/mock/first-team/noah-carden.svg",
        playerType: "field",
        teamSlug: "raimon-b",
        teamLabel: "Raimon B",
        seasonLabel: "Temporada 2023/24",
        stats: {
          matchesPlayed: 18,
          goals: 7,
          assists: 5,
          yellowCards: 2,
          redCards: 0,
          ownGoals: 0,
          mvps: 4,
        },
      }),
      createAcademyPlayer({
        id: "raimon-b-austin-hobbes",
        slug: "austin-hobbes",
        firstName: "Austin",
        lastName: "Hobbes",
        name: "Austin Hobbes",
        number: 9,
        country: "Estados Unidos",
        countryFlag: "US",
        position: "Delantero",
        dominantFoot: "right",
        imageUrl: undefined,
        playerType: "field",
        teamSlug: "raimon-b",
        teamLabel: "Raimon B",
        seasonLabel: "Temporada 2023/24",
        stats: {
          matchesPlayed: 15,
          goals: 5,
          assists: 2,
          yellowCards: 1,
          redCards: 1,
          ownGoals: 0,
          mvps: 2,
        },
      }),
    ],
  },
  "juvenil-a": {
    teamLabel: "Juvenil A",
    seasonLabel: "Temporada 2023/24",
    players: [
      createAcademyPlayer({
        id: "juvenil-a-matt-carter",
        slug: "matt-carter",
        firstName: "Matt",
        lastName: "Carter",
        name: "Matt Carter",
        number: 1,
        country: "Espana",
        countryFlag: "ES",
        position: "Portero",
        dominantFoot: "right",
        imageUrl: "/images/mock/first-team/teo-ibarra.svg",
        playerType: "goalkeeper",
        teamSlug: "juvenil-a",
        teamLabel: "Juvenil A",
        seasonLabel: "Temporada 2023/24",
        stats: {
          matchesPlayed: 12,
          goals: 0,
          assists: 0,
          goalsAgainst: 9,
          yellowCards: 0,
          redCards: 0,
          cleanSheets: 5,
          ownGoals: 0,
          mvps: 1,
        },
      }),
      createAcademyPlayer({
        id: "juvenil-a-jack-wallside",
        slug: "jack-wallside",
        firstName: "Jack",
        lastName: "Wallside",
        name: "Jack Wallside",
        number: 2,
        country: "Espana",
        countryFlag: "ES",
        position: "Lateral",
        dominantFoot: "right",
        imageUrl: "/images/mock/first-team/dario-kestrel.svg",
        playerType: "field",
        teamSlug: "juvenil-a",
        teamLabel: "Juvenil A",
        seasonLabel: "Temporada 2023/24",
        stats: {
          matchesPlayed: 13,
          goals: 1,
          assists: 3,
          yellowCards: 2,
          redCards: 0,
          ownGoals: 0,
          mvps: 1,
        },
      }),
      createAcademyPlayer({
        id: "juvenil-a-erik-eagle",
        slug: "erik-eagle",
        firstName: "Erik",
        lastName: "Eagle",
        name: "Erik Eagle",
        number: 4,
        country: "Suecia",
        countryFlag: "SE",
        position: "Defensa",
        dominantFoot: "right",
        imageUrl: undefined,
        playerType: "field",
        teamSlug: "juvenil-a",
        teamLabel: "Juvenil A",
        seasonLabel: "Temporada 2023/24",
        stats: {
          matchesPlayed: 13,
          goals: 0,
          assists: 1,
          yellowCards: 4,
          redCards: 0,
          ownGoals: 0,
          mvps: 0,
        },
      }),
      createAcademyPlayer({
        id: "juvenil-a-tod-ironside",
        slug: "tod-ironside",
        firstName: "Tod",
        lastName: "Ironside",
        name: "Tod Ironside",
        number: 10,
        country: "Inglaterra",
        countryFlag: "GB",
        position: "Mediapunta",
        dominantFoot: "both",
        imageUrl: "/images/mock/first-team/leo-serrano.svg",
        playerType: "field",
        teamSlug: "juvenil-a",
        teamLabel: "Juvenil A",
        seasonLabel: "Temporada 2023/24",
        stats: {
          matchesPlayed: 12,
          goals: 4,
          assists: 5,
          yellowCards: 3,
          redCards: 0,
          ownGoals: 0,
          mvps: 3,
        },
      }),
      createAcademyPlayer({
        id: "juvenil-a-scott-banyan",
        slug: "scott-banyan",
        firstName: "Scott",
        lastName: "Banyan",
        name: "Scott Banyan",
        number: 9,
        country: "Japon",
        countryFlag: "JP",
        position: "Delantero",
        dominantFoot: "left",
        imageUrl: "/images/mock/first-team/noah-carden.svg",
        playerType: "field",
        teamSlug: "juvenil-a",
        teamLabel: "Juvenil A",
        seasonLabel: "Temporada 2023/24",
        stats: {
          matchesPlayed: 13,
          goals: 5,
          assists: 2,
          yellowCards: 1,
          redCards: 0,
          ownGoals: 0,
          mvps: 4,
        },
      }),
    ],
  },
  "juvenil-b": {
    teamLabel: "Juvenil B",
    seasonLabel: "Temporada 2023/24",
    players: [
      createAcademyPlayer({
        id: "juvenil-b-darren-lachance",
        slug: "darren-lachance",
        firstName: "Darren",
        lastName: "LaChance",
        name: "Darren LaChance",
        number: 1,
        country: "Francia",
        countryFlag: "FR",
        position: "Portero",
        dominantFoot: "right",
        imageUrl: undefined,
        playerType: "goalkeeper",
        teamSlug: "juvenil-b",
        teamLabel: "Juvenil B",
        seasonLabel: "Temporada 2023/24",
        stats: {
          matchesPlayed: 10,
          goals: 0,
          assists: 0,
          goalsAgainst: 11,
          yellowCards: 1,
          redCards: 0,
          cleanSheets: 3,
          ownGoals: 0,
          mvps: 1,
        },
      }),
      createAcademyPlayer({
        id: "juvenil-b-steve-grim",
        slug: "steve-grim",
        firstName: "Steve",
        lastName: "Grim",
        name: "Steve Grim",
        number: 3,
        country: "Escocia",
        countryFlag: "GB",
        position: "Lateral",
        dominantFoot: "left",
        imageUrl: "/images/mock/first-team/dario-kestrel.svg",
        playerType: "field",
        teamSlug: "juvenil-b",
        teamLabel: "Juvenil B",
        seasonLabel: "Temporada 2023/24",
        stats: {
          matchesPlayed: 11,
          goals: 1,
          assists: 2,
          yellowCards: 2,
          redCards: 0,
          ownGoals: 0,
          mvps: 0,
        },
      }),
      createAcademyPlayer({
        id: "juvenil-b-hurley-kane",
        slug: "hurley-kane",
        firstName: "Hurley",
        lastName: "Kane",
        name: "Hurley Kane",
        number: 6,
        country: "Irlanda",
        countryFlag: "IE",
        position: "Mediocentro",
        dominantFoot: "right",
        imageUrl: "/images/mock/first-team/leo-serrano.svg",
        playerType: "field",
        teamSlug: "juvenil-b",
        teamLabel: "Juvenil B",
        seasonLabel: "Temporada 2023/24",
        stats: {
          matchesPlayed: 11,
          goals: 2,
          assists: 4,
          yellowCards: 3,
          redCards: 0,
          ownGoals: 0,
          mvps: 2,
        },
      }),
      createAcademyPlayer({
        id: "juvenil-b-austin-hobbes",
        slug: "austin-hobbes",
        firstName: "Austin",
        lastName: "Hobbes",
        name: "Austin Hobbes",
        number: 9,
        country: "Estados Unidos",
        countryFlag: "US",
        position: "Delantero",
        dominantFoot: "right",
        imageUrl: "/images/mock/first-team/noah-carden.svg",
        playerType: "field",
        teamSlug: "juvenil-b",
        teamLabel: "Juvenil B",
        seasonLabel: "Temporada 2023/24",
        stats: {
          matchesPlayed: 11,
          goals: 4,
          assists: 1,
          yellowCards: 2,
          redCards: 0,
          ownGoals: 0,
          mvps: 3,
        },
      }),
      createAcademyPlayer({
        id: "juvenil-b-caleb-stonewall",
        slug: "caleb-stonewall",
        firstName: "Caleb",
        lastName: "Stonewall",
        name: "Caleb Stonewall",
        number: 5,
        country: "Portugal",
        countryFlag: "PT",
        position: "Defensa",
        dominantFoot: "right",
        imageUrl: undefined,
        playerType: "field",
        teamSlug: "juvenil-b",
        teamLabel: "Juvenil B",
        seasonLabel: "Temporada 2023/24",
        stats: {
          matchesPlayed: 10,
          goals: 0,
          assists: 1,
          yellowCards: 4,
          redCards: 1,
          ownGoals: 0,
          mvps: 0,
        },
      }),
    ],
  },
  "cadete-a": {
    teamLabel: "Cadete A",
    seasonLabel: "Temporada 2023/24",
    players: [
      createAcademyPlayer({
        id: "cadete-a-quentin-cinco",
        slug: "quentin-cinco",
        firstName: "Quentin",
        lastName: "Cinco",
        name: "Quentin Cinco",
        number: 1,
        country: "Espana",
        countryFlag: "ES",
        position: "Portero",
        dominantFoot: "right",
        imageUrl: undefined,
        playerType: "goalkeeper",
        teamSlug: "cadete-a",
        teamLabel: "Cadete A",
        seasonLabel: "Temporada 2023/24",
        stats: {
          matchesPlayed: 9,
          goals: 0,
          assists: 0,
          goalsAgainst: 7,
          yellowCards: 0,
          redCards: 0,
          cleanSheets: 4,
          ownGoals: 0,
          mvps: 1,
        },
      }),
      createAcademyPlayer({
        id: "cadete-a-bobby-shearer",
        slug: "bobby-shearer",
        firstName: "Bobby",
        lastName: "Shearer",
        name: "Bobby Shearer",
        number: 5,
        country: "Escocia",
        countryFlag: "GB",
        position: "Defensa",
        dominantFoot: "right",
        imageUrl: "/images/mock/first-team/dario-kestrel.svg",
        playerType: "field",
        teamSlug: "cadete-a",
        teamLabel: "Cadete A",
        seasonLabel: "Temporada 2023/24",
        stats: {
          matchesPlayed: 9,
          goals: 1,
          assists: 0,
          yellowCards: 2,
          redCards: 0,
          ownGoals: 0,
          mvps: 1,
        },
      }),
      createAcademyPlayer({
        id: "cadete-a-jordan-greenway",
        slug: "jordan-greenway",
        firstName: "Jordan",
        lastName: "Greenway",
        name: "Jordan Greenway",
        number: 8,
        country: "Irlanda",
        countryFlag: "IE",
        position: "Mediocentro",
        dominantFoot: "both",
        imageUrl: "/images/mock/first-team/leo-serrano.svg",
        playerType: "field",
        teamSlug: "cadete-a",
        teamLabel: "Cadete A",
        seasonLabel: "Temporada 2023/24",
        stats: {
          matchesPlayed: 9,
          goals: 2,
          assists: 3,
          yellowCards: 1,
          redCards: 0,
          ownGoals: 0,
          mvps: 2,
        },
      }),
      createAcademyPlayer({
        id: "cadete-a-shawn-froste",
        slug: "shawn-froste",
        firstName: "Shawn",
        lastName: "Froste",
        name: "Shawn Froste",
        number: 9,
        country: "Noruega",
        countryFlag: "NO",
        position: "Delantero",
        dominantFoot: "right",
        imageUrl: "/images/mock/first-team/noah-carden.svg",
        playerType: "field",
        teamSlug: "cadete-a",
        teamLabel: "Cadete A",
        seasonLabel: "Temporada 2023/24",
        stats: {
          matchesPlayed: 9,
          goals: 4,
          assists: 2,
          yellowCards: 0,
          redCards: 0,
          ownGoals: 0,
          mvps: 3,
        },
      }),
      createAcademyPlayer({
        id: "cadete-a-aiden-froste",
        slug: "aiden-froste",
        firstName: "Aiden",
        lastName: "Froste",
        name: "Aiden Froste",
        number: 11,
        country: "Noruega",
        countryFlag: "NO",
        position: "Extremo",
        dominantFoot: "left",
        imageUrl: undefined,
        playerType: "field",
        teamSlug: "cadete-a",
        teamLabel: "Cadete A",
        seasonLabel: "Temporada 2023/24",
        stats: {
          matchesPlayed: 8,
          goals: 3,
          assists: 2,
          yellowCards: 1,
          redCards: 0,
          ownGoals: 0,
          mvps: 2,
        },
      }),
    ],
  },
  "infantil-a": {
    teamLabel: "Infantil A",
    seasonLabel: "Temporada 2023/24",
    players: [
      createAcademyPlayer({
        id: "infantil-a-xavier-foster",
        slug: "xavier-foster",
        firstName: "Xavier",
        lastName: "Foster",
        name: "Xavier Foster",
        number: 1,
        country: "Espana",
        countryFlag: "ES",
        position: "Portero",
        dominantFoot: "right",
        imageUrl: undefined,
        playerType: "goalkeeper",
        teamSlug: "infantil-a",
        teamLabel: "Infantil A",
        seasonLabel: "Temporada 2023/24",
        stats: {
          matchesPlayed: 8,
          goals: 0,
          assists: 0,
          goalsAgainst: 5,
          yellowCards: 0,
          redCards: 0,
          cleanSheets: 4,
          ownGoals: 0,
          mvps: 1,
        },
      }),
      createAcademyPlayer({
        id: "infantil-a-gabriel-garcia",
        slug: "gabriel-garcia",
        firstName: "Gabriel",
        lastName: "Garcia",
        name: "Gabriel Garcia",
        number: 3,
        country: "Espana",
        countryFlag: "ES",
        position: "Lateral",
        dominantFoot: "left",
        imageUrl: "/images/mock/first-team/dario-kestrel.svg",
        playerType: "field",
        teamSlug: "infantil-a",
        teamLabel: "Infantil A",
        seasonLabel: "Temporada 2023/24",
        stats: {
          matchesPlayed: 8,
          goals: 0,
          assists: 2,
          yellowCards: 1,
          redCards: 0,
          ownGoals: 0,
          mvps: 0,
        },
      }),
      createAcademyPlayer({
        id: "infantil-a-riccardo-di-rigo",
        slug: "riccardo-di-rigo",
        firstName: "Riccardo",
        lastName: "Di Rigo",
        name: "Riccardo Di Rigo",
        number: 8,
        country: "Italia",
        countryFlag: "IT",
        position: "Mediocentro",
        dominantFoot: "right",
        imageUrl: "/images/mock/first-team/leo-serrano.svg",
        playerType: "field",
        teamSlug: "infantil-a",
        teamLabel: "Infantil A",
        seasonLabel: "Temporada 2023/24",
        stats: {
          matchesPlayed: 8,
          goals: 1,
          assists: 3,
          yellowCards: 0,
          redCards: 0,
          ownGoals: 0,
          mvps: 2,
        },
      }),
      createAcademyPlayer({
        id: "infantil-a-arion-sherwind",
        slug: "arion-sherwind",
        firstName: "Arion",
        lastName: "Sherwind",
        name: "Arion Sherwind",
        number: 10,
        country: "Japon",
        countryFlag: "JP",
        position: "Mediapunta",
        dominantFoot: "both",
        imageUrl: "/images/mock/first-team/noah-carden.svg",
        playerType: "field",
        teamSlug: "infantil-a",
        teamLabel: "Infantil A",
        seasonLabel: "Temporada 2023/24",
        stats: {
          matchesPlayed: 8,
          goals: 3,
          assists: 4,
          yellowCards: 1,
          redCards: 0,
          ownGoals: 0,
          mvps: 3,
        },
      }),
      createAcademyPlayer({
        id: "infantil-a-victor-blade",
        slug: "victor-blade",
        firstName: "Victor",
        lastName: "Blade",
        name: "Victor Blade",
        number: 9,
        country: "Japon",
        countryFlag: "JP",
        position: "Delantero",
        dominantFoot: "right",
        imageUrl: undefined,
        playerType: "field",
        teamSlug: "infantil-a",
        teamLabel: "Infantil A",
        seasonLabel: "Temporada 2023/24",
        stats: {
          matchesPlayed: 8,
          goals: 4,
          assists: 1,
          yellowCards: 0,
          redCards: 0,
          ownGoals: 0,
          mvps: 2,
        },
      }),
    ],
  },
};

const ACADEMY_TEAM_ROSTERS: Record<string, AcademyTeamRosterSeed> = Object.fromEntries(
  Object.entries(ACADEMY_TEAM_ROSTER_SEEDS).map(([teamSlug, seed]) => [
    teamSlug,
    {
      ...seed,
      players: ensureMinimumAcademyDepth(teamSlug, seed.teamLabel, seed.seasonLabel, seed.players),
    },
  ]),
);

export function getAcademyTeamSquadContent(teamSlug: string): AcademySquadContent | null {
  const seed = ACADEMY_TEAM_ROSTERS[teamSlug];

  if (!seed) {
    return null;
  }

  return {
    pageTitle: `Plantilla - ${seed.teamLabel}`,
    teamSlug,
    teamLabel: seed.teamLabel,
    seasonLabel: seed.seasonLabel,
    goalkeepers: seed.players.filter((player) => player.playerType === "goalkeeper"),
    fieldPlayers: seed.players.filter((player) => player.playerType === "field"),
  };
}

export function getAcademyPlayerDetail(
  teamSlug: string,
  playerSlug: string,
): AcademySquadPlayer | null {
  const squad = getAcademyTeamSquadContent(teamSlug);

  if (!squad) {
    return null;
  }

  return (
    squad.goalkeepers.find((player) => player.slug === playerSlug) ??
    squad.fieldPlayers.find((player) => player.slug === playerSlug) ??
    null
  );
}

export function getAcademyPlayerHref(teamSlug: string, playerSlug: string): string | undefined {
  return `/equipos/${teamSlug}/jugadores/${playerSlug}`;
}

export function findAcademyPlayersBySlug(playerSlug: string): AcademySquadPlayer[] {
  return Object.values(ACADEMY_TEAM_ROSTERS).flatMap((seed) =>
    seed.players.filter((player) => player.slug === playerSlug),
  );
}

export function getAcademyPlayerSlugs(): string[] {
  return Array.from(
    new Set(
      Object.values(ACADEMY_TEAM_ROSTERS).flatMap((seed) => seed.players.map((player) => player.slug)),
    ),
  );
}

export function getAcademyPlayerStaticParams(): Array<{
  teamSlug: string;
  playerSlug: string;
}> {
  return Object.entries(ACADEMY_TEAM_ROSTERS).flatMap(([teamSlug, seed]) =>
    seed.players.map((player) => ({
      teamSlug,
      playerSlug: player.slug,
    })),
  );
}
