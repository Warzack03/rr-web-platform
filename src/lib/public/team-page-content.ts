import { getAcademyTeamCalendarContent } from "@/lib/public/team-calendar-content";
import { getAcademyPlayerHref } from "@/lib/public/player-profile-content";

export type TeamStub = {
  name: string;
  highlight?: boolean;
};

export type MatchResult = {
  opponent: string;
  score: string;
  result: "V" | "E" | "D";
  label?: string;
  href?: string;
};

export type TeamNewsItem = {
  href: string;
  category: string;
  title: string;
  tone: "ball" | "tactics";
};

export type TeamQuickInfoItem = {
  label: string;
  value: string;
};

export type SquadHighlight = {
  name: string;
  position: string;
  number: number;
};

export type PublicTeamPageContent = {
  slug: string;
  variant: "first-team" | "academy";
  name: string;
  category: string;
  competition: string;
  season: string;
  coaches: string[];
  heroImageUrl?: string;
  heroImagePosition?: string;
  links: {
    squad: string;
    calendar: string;
    standing: string;
    statistics: string;
  };
  nextMatch: {
    home: TeamStub;
    away: TeamStub;
    competition: string;
    dateLabel: string;
    venue: string;
    status: string;
    href?: string;
  };
  recentResults: MatchResult[];
  standing: {
    competition: string;
    position: string;
    points: number;
    played: number;
    won: number;
    href: string;
  };
  metrics: {
    goalsFor: number;
    goalsAgainst: number;
    matchesPlayed: number;
    squadSize: number;
  };
  topScorer?: {
    name: string;
    goals: number;
    href?: string;
  };
  squadPreview?: {
    totalPlayers: number;
    goalkeepers?: number;
    highlights: SquadHighlight[];
    href: string;
  };
  quickInfo?: TeamQuickInfoItem[];
  news: TeamNewsItem[];
};

const PUBLIC_TEAM_PAGE_MOCKS: Record<string, PublicTeamPageContent> = {
  "primer-equipo": {
    slug: "primer-equipo",
    variant: "first-team",
    name: "Primer Equipo",
    category: "Senior",
    competition: "Primera Division",
    season: "Temporada 2023/24",
    coaches: ["Seymour Hillman"],
    heroImageUrl: undefined,
    heroImagePosition: "center center",
    links: {
      squad: "/primer-equipo/plantilla",
      calendar: "/primer-equipo/calendario",
      standing: "/primer-equipo/clasificacion",
      statistics: "/primer-equipo/estadisticas",
    },
    nextMatch: {
      home: { name: "Rising Raimon", highlight: true },
      away: { name: "Inazuma City" },
      competition: "Liga Profesional - Jornada 3",
      dateLabel: "22 Sep 2024 - 20:45 CET",
      venue: "Estadio Raimon",
      status: "Pendiente",
      href: "/primer-equipo/partidos/j3-inazuma-city",
    },
    recentResults: [
      {
        opponent: "Royal Acad",
        score: "3 - 1",
        result: "V",
        label: "J1",
        href: "/primer-equipo/partidos/j1-royal-acad",
      },
      { opponent: "Kirkwood", score: "1 - 1", result: "E", label: "J0" },
      { opponent: "Alpine", score: "3 - 0", result: "V", label: "Am." },
    ],
    standing: {
      competition: "Primera Division",
      position: "1",
      points: 34,
      played: 14,
      won: 11,
      href: "/primer-equipo/clasificacion",
    },
    metrics: {
      goalsFor: 32,
      goalsAgainst: 8,
      matchesPlayed: 14,
      squadSize: 23,
    },
    topScorer: {
      name: "Axel Blaze",
      goals: 18,
      href: "/jugadores/axel-blaze",
    },
    news: [
      {
        href: "/noticias/preparacion-intensa-para-el-derbi",
        category: "Entrenamiento",
        title: "Preparacion intensa para el derbi",
        tone: "ball",
      },
      {
        href: "/noticias/tactical-masterclass-asegura-el-pase-a-semifinales",
        category: "Tactica",
        title: "Analisis del rival: puntos clave",
        tone: "tactics",
      },
    ],
  },
  "raimon-b": {
    slug: "raimon-b",
    variant: "academy",
    name: "Raimon B",
    category: "Filial",
    competition: "Segunda Autonomica",
    season: "Temporada 2023/24",
    coaches: ["Jude Sharp", 'Celia Hills'],
    heroImageUrl: undefined,
    heroImagePosition: "center top",
    links: {
      squad: "/equipos/raimon-b/plantilla",
      calendar: "/equipos/raimon-b/calendario",
      standing: "/equipos/raimon-b/clasificacion",
      statistics: "/equipos/raimon-b/estadisticas",
    },
    nextMatch: {
      home: { name: "Raimon B", highlight: true },
      away: { name: "Farm Jr." },
      competition: "Segunda Autonomica - Jornada 10",
      dateLabel: "Dom, 01 Dic - 12:30 hrs",
      venue: "Campo Anexo Raimon",
      status: "Pendiente",
    },
    recentResults: [
      { opponent: "Polestar", score: "1 - 0", result: "V", label: "J9" },
      { opponent: "Cloister", score: "2 - 2", result: "E", label: "J8" },
      { opponent: "Otaku FC", score: "0 - 1", result: "D", label: "J7" },
    ],
    standing: {
      competition: "Segunda Autonomica",
      position: "4",
      points: 21,
      played: 10,
      won: 6,
      href: "/equipos/raimon-b/clasificacion",
    },
    metrics: {
      goalsFor: 18,
      goalsAgainst: 11,
      matchesPlayed: 10,
      squadSize: 19,
    },
    topScorer: {
      name: "Nathan Swift",
      goals: 7,
      href: getAcademyPlayerHref("raimon-b", "nathan-swift"),
    },
    squadPreview: {
      totalPlayers: 19,
      goalkeepers: 2,
      href: "/equipos/raimon-b/plantilla",
      highlights: [
        { name: "Sam Kincaid", position: "MC", number: 8 },
        { name: "Nathan Swift", position: "ED", number: 7 },
        { name: "Erik Eagle", position: "DFC", number: 4 },
      ],
    },
    quickInfo: [
      { label: "Categoria", value: "Filial - Academia" },
      { label: "Competicion", value: "Segunda Autonomica" },
      { label: "Temporada", value: "2023/24" },
      { label: "Entrenadores", value: "Jude Sharp, Celia Hills" },
      { label: "Campo habitual", value: "Campo Anexo Raimon" },
    ],
    news: [
      {
        href: "/noticias/celia-hills-la-identidad-del-club-tambien-se-entrena",
        category: "Cantera",
        title: "Raimon B sigue creciendo en casa",
        tone: "ball",
      },
      {
        href: "/noticias/jude-sharp-el-grupo-ha-ganado-madurez",
        category: "Partido",
        title: "Claves del proximo duelo en el anexo",
        tone: "tactics",
      },
    ],
  },
  "juvenil-a": {
    slug: "juvenil-a",
    variant: "academy",
    name: "Juvenil A",
    category: "Juvenil",
    competition: "Preferente Juvenil",
    season: "Temporada 2023/24",
    coaches: ["Mark Evans"],
    heroImageUrl: undefined,
    heroImagePosition: "center top",
    links: {
      squad: "/equipos/juvenil-a/plantilla",
      calendar: "/equipos/juvenil-a/calendario",
      standing: "/equipos/juvenil-a/clasificacion",
      statistics: "/equipos/juvenil-a/estadisticas",
    },
    nextMatch: {
      home: { name: "Juvenil A", highlight: true },
      away: { name: "Royal Acad B" },
      competition: "Preferente Juvenil - Jornada 8",
      dateLabel: "Sab, 14 Oct - 16:00 hrs",
      venue: "Campo 2 Raimon",
      status: "Pendiente",
    },
    recentResults: [
      { opponent: "Inazuma KFC", score: "3 - 1", result: "V", label: "J7" },
      { opponent: "Brain FC", score: "2 - 2", result: "E", label: "J6" },
      { opponent: "Occult", score: "0 - 2", result: "D", label: "J5" },
    ],
    standing: {
      competition: "Preferente Juvenil",
      position: "2",
      points: 16,
      played: 7,
      won: 5,
      href: "/equipos/juvenil-a/clasificacion",
    },
    metrics: {
      goalsFor: 15,
      goalsAgainst: 6,
      matchesPlayed: 7,
      squadSize: 18,
    },
    topScorer: {
      name: "Scott Banyan",
      goals: 5,
      href: getAcademyPlayerHref("juvenil-a", "scott-banyan"),
    },
    squadPreview: {
      totalPlayers: 18,
      goalkeepers: 2,
      href: "/equipos/juvenil-a/plantilla",
      highlights: [
        { name: "Scott Banyan", position: "DC", number: 9 },
        { name: "Tod Ironside", position: "MCO", number: 10 },
        { name: "Jack Wallside", position: "LD", number: 2 },
      ],
    },
    quickInfo: [
      { label: "Categoria", value: "Juvenil" },
      { label: "Competicion", value: "Preferente Juvenil" },
      { label: "Temporada", value: "2023/24" },
      { label: "Entrenadores", value: "Mark Evans" },
      { label: "Campo habitual", value: "Campo 2 Raimon" },
    ],
    news: [
      {
        href: "/noticias/juvenil-a-acelera-su-crecimiento",
        category: "Academia",
        title: "El Juvenil A prepara el derbi con intensidad maxima",
        tone: "ball",
      },
    ],
  },
  "juvenil-b": {
    slug: "juvenil-b",
    variant: "academy",
    name: "Juvenil B",
    category: "Juvenil",
    competition: "Liga Nacional Juvenil",
    season: "Temporada 2023/24",
    coaches: ["Byron Love"],
    heroImageUrl: undefined,
    heroImagePosition: "center top",
    links: {
      squad: "/equipos/juvenil-b/plantilla",
      calendar: "/equipos/juvenil-b/calendario",
      standing: "/equipos/juvenil-b/clasificacion",
      statistics: "/equipos/juvenil-b/estadisticas",
    },
    nextMatch: {
      home: { name: "Juvenil B", highlight: true },
      away: { name: "Royal Acad C" },
      competition: "Liga Nacional Juvenil - Jornada 7",
      dateLabel: "Sab, 21 Oct - 11:30 hrs",
      venue: "Campo 3 Raimon",
      status: "Pendiente",
    },
    recentResults: [
      { opponent: "Occult Jr.", score: "2 - 0", result: "V", label: "J6" },
      { opponent: "Farm B", score: "1 - 1", result: "E", label: "J5" },
      { opponent: "Otaku B", score: "0 - 1", result: "D", label: "J4" },
    ],
    standing: {
      competition: "Liga Nacional Juvenil",
      position: "5",
      points: 11,
      played: 6,
      won: 3,
      href: "/equipos/juvenil-b/clasificacion",
    },
    metrics: {
      goalsFor: 11,
      goalsAgainst: 8,
      matchesPlayed: 6,
      squadSize: 18,
    },
    topScorer: {
      name: "Austin Hobbes",
      goals: 4,
      href: getAcademyPlayerHref("juvenil-b", "austin-hobbes"),
    },
    squadPreview: {
      totalPlayers: 18,
      goalkeepers: 2,
      href: "/equipos/juvenil-b/plantilla",
      highlights: [
        { name: "Austin Hobbes", position: "DC", number: 9 },
        { name: "Hurley Kane", position: "MC", number: 6 },
        { name: "Steve Grim", position: "LI", number: 3 },
      ],
    },
    quickInfo: [
      { label: "Categoria", value: "Juvenil" },
      { label: "Competicion", value: "Liga Nacional Juvenil" },
      { label: "Temporada", value: "2023/24" },
      { label: "Entrenadores", value: "Byron Love" },
      { label: "Campo habitual", value: "Campo 3 Raimon" },
    ],
    news: [],
  },
  "cadete-a": {
    slug: "cadete-a",
    variant: "academy",
    name: "Cadete A",
    category: "Cadete",
    competition: "Division Autonomica",
    season: "Temporada 2023/24",
    coaches: ["Silvia Woods"],
    heroImageUrl: undefined,
    heroImagePosition: "center top",
    links: {
      squad: "/equipos/cadete-a/plantilla",
      calendar: "/equipos/cadete-a/calendario",
      standing: "/equipos/cadete-a/clasificacion",
      statistics: "/equipos/cadete-a/estadisticas",
    },
    nextMatch: {
      home: { name: "Cadete A", highlight: true },
      away: { name: "Zeus Cadete" },
      competition: "Division Autonomica - Jornada 6",
      dateLabel: "Dom, 22 Oct - 10:00 hrs",
      venue: "Campo 4 Raimon",
      status: "Pendiente",
    },
    recentResults: [
      { opponent: "Brain Cadete", score: "3 - 2", result: "V", label: "J5" },
      { opponent: "Kirkwood Cadete", score: "1 - 1", result: "E", label: "J4" },
      { opponent: "Otaku Cadete", score: "2 - 0", result: "V", label: "J3" },
    ],
    standing: {
      competition: "Division Autonomica",
      position: "3",
      points: 10,
      played: 5,
      won: 3,
      href: "/equipos/cadete-a/clasificacion",
    },
    metrics: {
      goalsFor: 12,
      goalsAgainst: 7,
      matchesPlayed: 5,
      squadSize: 17,
    },
    topScorer: {
      name: "Aiden Froste",
      goals: 5,
      href: getAcademyPlayerHref("cadete-a", "aiden-froste"),
    },
    squadPreview: {
      totalPlayers: 17,
      goalkeepers: 2,
      href: "/equipos/cadete-a/plantilla",
      highlights: [
        { name: "Aiden Froste", position: "EI", number: 11 },
        { name: "Shawn Froste", position: "DC", number: 9 },
        { name: "Bobby Shearer", position: "DFC", number: 5 },
      ],
    },
    quickInfo: [
      { label: "Categoria", value: "Cadete" },
      { label: "Competicion", value: "Division Autonomica" },
      { label: "Temporada", value: "2023/24" },
      { label: "Entrenadores", value: "Silvia Woods" },
      { label: "Campo habitual", value: "Campo 4 Raimon" },
    ],
    news: [],
  },
  "infantil-a": {
    slug: "infantil-a",
    variant: "academy",
    name: "Infantil A",
    category: "Infantil",
    competition: "Division Autonomica",
    season: "Temporada 2023/24",
    coaches: ["Camellia Travis"],
    heroImageUrl: undefined,
    heroImagePosition: "center top",
    links: {
      squad: "/equipos/infantil-a/plantilla",
      calendar: "/equipos/infantil-a/calendario",
      standing: "/equipos/infantil-a/clasificacion",
      statistics: "/equipos/infantil-a/estadisticas",
    },
    nextMatch: {
      home: { name: "Infantil A", highlight: true },
      away: { name: "Royal Kids" },
      competition: "Division Autonomica - Jornada 5",
      dateLabel: "Sab, 28 Oct - 09:30 hrs",
      venue: "Campo Escuela Raimon",
      status: "Pendiente",
    },
    recentResults: [
      { opponent: "Farm Kids", score: "2 - 1", result: "V", label: "J4" },
      { opponent: "Cloister Kids", score: "1 - 0", result: "V", label: "J3" },
      { opponent: "Brain Kids", score: "1 - 1", result: "E", label: "J2" },
    ],
    standing: {
      competition: "Division Autonomica",
      position: "2",
      points: 10,
      played: 4,
      won: 3,
      href: "/equipos/infantil-a/clasificacion",
    },
    metrics: {
      goalsFor: 9,
      goalsAgainst: 4,
      matchesPlayed: 4,
      squadSize: 16,
    },
    topScorer: {
      name: "Arion Sherwind",
      goals: 4,
      href: getAcademyPlayerHref("infantil-a", "arion-sherwind"),
    },
    squadPreview: {
      totalPlayers: 16,
      goalkeepers: 2,
      href: "/equipos/infantil-a/plantilla",
      highlights: [
        { name: "Arion Sherwind", position: "MCO", number: 10 },
        { name: "Victor Blade", position: "DC", number: 9 },
        { name: "Riccardo Di Rigo", position: "MC", number: 8 },
      ],
    },
    quickInfo: [
      { label: "Categoria", value: "Infantil" },
      { label: "Competicion", value: "Division Autonomica" },
      { label: "Temporada", value: "2023/24" },
      { label: "Entrenadores", value: "Camellia Travis" },
      { label: "Campo habitual", value: "Campo Escuela Raimon" },
    ],
    news: [],
  },
};

function getNextAcademyMatchFromCalendar(team: PublicTeamPageContent) {
  const calendar = getAcademyTeamCalendarContent({
    slug: team.slug,
    name: team.name,
    competition: team.competition,
    season: team.season,
  });

  for (const matchday of calendar.matchdays) {
    const nextMatch = matchday.matches.find(
      (match) => match.status === "pending" || match.status === "postponed",
    );

    if (nextMatch) {
      return {
        home: {
          name: nextMatch.homeTeam.name,
          highlight: nextMatch.homeTeam.isClub,
        },
        away: {
          name: nextMatch.awayTeam.name,
          highlight: nextMatch.awayTeam.isClub,
        },
        competition: `${nextMatch.competition} - ${matchday.title}`,
        dateLabel: `${nextMatch.dateLabel} - ${nextMatch.kickoffLabel}`,
        venue: nextMatch.venue,
        status: "Pendiente",
        href: nextMatch.detailHref,
      };
    }
  }

  return team.nextMatch;
}

function getAcademyRecentResultsFromCalendar(team: PublicTeamPageContent) {
  const calendar = getAcademyTeamCalendarContent({
    slug: team.slug,
    name: team.name,
    competition: team.competition,
    season: team.season,
  });

  return calendar.matchdays
    .flatMap((matchday) =>
      matchday.matches
        .filter((match) => match.status === "played")
        .map((match) => {
          const clubIsHome = Boolean(match.homeTeam.isClub);
          const goalsFor = clubIsHome ? match.homeScore : match.awayScore;
          const goalsAgainst = clubIsHome ? match.awayScore : match.homeScore;
          const opponent = clubIsHome ? match.awayTeam.name : match.homeTeam.name;

          let result: MatchResult["result"] = "E";

          if ((goalsFor ?? 0) > (goalsAgainst ?? 0)) {
            result = "V";
          } else if ((goalsFor ?? 0) < (goalsAgainst ?? 0)) {
            result = "D";
          }

          return {
            opponent,
            score: `${goalsFor ?? "-"} - ${goalsAgainst ?? "-"}`,
            result,
            label: matchday.title.replace("Jornada ", "J"),
            href: match.detailHref,
          };
        }),
    )
    .slice(0, 3);
}

export async function getPublicTeamPageContent(
  teamSlug: string,
): Promise<PublicTeamPageContent | null> {
  return PUBLIC_TEAM_PAGE_MOCKS[teamSlug] ?? null;
}

export async function getPublicAcademyTeamPageContent(
  teamSlug: string,
): Promise<PublicTeamPageContent | null> {
  const team = PUBLIC_TEAM_PAGE_MOCKS[teamSlug];

  if (!team || team.variant !== "academy") {
    return null;
  }

  return {
    ...team,
    nextMatch: getNextAcademyMatchFromCalendar(team),
    recentResults: getAcademyRecentResultsFromCalendar(team),
  };
}
