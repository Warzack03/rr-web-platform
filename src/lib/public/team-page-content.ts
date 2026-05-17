type TeamStub = {
  name: string;
  highlight?: boolean;
};

type MatchResult = {
  opponent: string;
  score: string;
  result: "V" | "E" | "D";
};

type TeamNewsItem = {
  href: string;
  category: string;
  title: string;
  tone: "ball" | "tactics";
};

export type PublicTeamPageContent = {
  slug: string;
  name: string;
  competition: string;
  season: string;
  coach: string;
  heroImageUrl?: string;
  heroImagePosition?: string;
  nextMatch: {
    home: TeamStub;
    away: TeamStub;
    competition: string;
    dateLabel: string;
    venue: string;
  };
  recentResults: MatchResult[];
  standing: {
    competition: string;
    position: string;
    points: number;
    played: number;
    won: number;
  };
  metrics: {
    goalsFor: number;
    goalsAgainst: number;
  };
  topScorer: {
    name: string;
    goals: number;
  };
  news: TeamNewsItem[];
};

const PUBLIC_TEAM_PAGE_MOCKS: Record<string, PublicTeamPageContent> = {
  "primer-equipo": {
    slug: "primer-equipo",
    name: "Primer Equipo",
    competition: "Primera Division",
    season: "Temporada 2023/24",
    coach: "Seymour Hillman",
    heroImageUrl: undefined,
    heroImagePosition: "center center",
    nextMatch: {
      home: { name: "Rising Raimon", highlight: true },
      away: { name: "Royal Academy" },
      competition: "Futbol Frontier - Jornada 12",
      dateLabel: "Sab, 24 Nov - 18:00 hrs",
      venue: "Estadio Raimon",
    },
    recentResults: [
      { opponent: "Zeus FC", score: "2 - 1", result: "V" },
      { opponent: "Kirkwood", score: "1 - 1", result: "E" },
      { opponent: "Alpine", score: "3 - 0", result: "V" },
    ],
    standing: {
      competition: "Primera Division",
      position: "1",
      points: 34,
      played: 14,
      won: 11,
    },
    metrics: {
      goalsFor: 32,
      goalsAgainst: 8,
    },
    topScorer: {
      name: "Axel Blaze",
      goals: 14,
    },
    news: [
      {
        href: "/#noticias",
        category: "Entrenamiento",
        title: "Preparacion intensa para el derbi",
        tone: "ball",
      },
      {
        href: "/#noticias",
        category: "Tactica",
        title: "Analisis del rival: puntos clave",
        tone: "tactics",
      },
    ],
  },
  "raimon-b": {
    slug: "raimon-b",
    name: "Raimon B",
    competition: "Segunda Autonomica",
    season: "Temporada 2023/24",
    coach: "Jude Sharp",
    heroImageUrl: undefined,
    heroImagePosition: "center top",
    nextMatch: {
      home: { name: "Raimon B", highlight: true },
      away: { name: "Farm Jr." },
      competition: "Segunda Autonomica - Jornada 10",
      dateLabel: "Dom, 01 Dic - 12:30 hrs",
      venue: "Campo Anexo Raimon",
    },
    recentResults: [
      { opponent: "Polestar", score: "1 - 0", result: "V" },
      { opponent: "Cloister", score: "2 - 2", result: "E" },
      { opponent: "Otaku FC", score: "0 - 1", result: "D" },
    ],
    standing: {
      competition: "Segunda Autonomica",
      position: "4",
      points: 21,
      played: 10,
      won: 6,
    },
    metrics: {
      goalsFor: 18,
      goalsAgainst: 11,
    },
    topScorer: {
      name: "Kevin Dragonfly",
      goals: 7,
    },
    news: [
      {
        href: "/#noticias",
        category: "Cantera",
        title: "Raimon B sigue creciendo en casa",
        tone: "ball",
      },
      {
        href: "/#noticias",
        category: "Partido",
        title: "Claves del proximo duelo en el anexo",
        tone: "tactics",
      },
    ],
  },
};

export async function getPublicTeamPageContent(
  teamSlug: string,
): Promise<PublicTeamPageContent | null> {
  return PUBLIC_TEAM_PAGE_MOCKS[teamSlug] ?? null;
}
