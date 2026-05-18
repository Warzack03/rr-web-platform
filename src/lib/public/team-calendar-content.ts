export type CalendarMatchStatus = "played" | "live" | "pending" | "postponed";
export type MatchFilter = "all" | "live" | "played" | "pending";
export type MatchTeamType = "first-team" | "academy";

export type MatchFilterOption = {
  value: MatchFilter;
  label: string;
};

export type CalendarMatchTeam = {
  name: string;
  crestLabel: string;
  isClub?: boolean;
  muted?: boolean;
};

export type CalendarMatch = {
  id: string;
  status: CalendarMatchStatus;
  competition: string;
  dateLabel: string;
  kickoffLabel: string;
  liveMinute?: string;
  venue: string;
  homeTeam: CalendarMatchTeam;
  awayTeam: CalendarMatchTeam;
  homeScore?: number;
  awayScore?: number;
  actionLabel: string;
  actionHint?: string;
  postponementReason?: string;
  detailHref?: string;
};

export type CalendarMatchday = {
  id: string;
  title: string;
  matches: CalendarMatch[];
};

export type TeamCalendarContent = {
  pageTitle: string;
  subtitle: string;
  matchdays: CalendarMatchday[];
};

function buildAcademyMatchDetailHref(teamSlug: string, matchId: string) {
  return `/equipos/${teamSlug}/partidos/${matchId}`;
}

function decorateAcademyMatch(teamSlug: string, match: CalendarMatch): CalendarMatch {
  const detailHref = buildAcademyMatchDetailHref(teamSlug, match.id);
  const shouldUsePreviewLabel =
    (match.status === "pending" || match.status === "postponed") &&
    !match.actionLabel.toLowerCase().startsWith("ver") &&
    !match.actionLabel.toLowerCase().startsWith("vista");

  return {
    ...match,
    detailHref,
    actionLabel: shouldUsePreviewLabel ? "Vista previa" : match.actionLabel,
    actionHint:
      match.status === "postponed"
        ? match.actionHint || match.postponementReason || "Pendiente de nueva fecha"
        : match.actionHint,
  };
}

const FIRST_TEAM_CALENDAR: TeamCalendarContent = {
  pageTitle: "Calendario de partidos",
  subtitle: "Primer Equipo - Temporada 2024/2025",
  matchdays: [
    {
      id: "jornada-1",
      title: "Jornada 1",
      matches: [
        {
          id: "j1-royal-acad",
          status: "played",
          competition: "Liga Profesional",
          dateLabel: "15 Sep 2024",
          kickoffLabel: "18:00 CET",
          venue: "Estadio Raimon",
          homeTeam: {
            name: "Rising Raimon",
            crestLabel: "RR",
            isClub: true,
          },
          awayTeam: {
            name: "Royal Acad",
            crestLabel: "RA",
          },
          homeScore: 3,
          awayScore: 1,
          actionLabel: "Ver resumen",
          actionHint: "Resumen y momentos clave",
          detailHref: "/primer-equipo/partidos/j1-royal-acad",
        },
      ],
    },
    {
      id: "jornada-2",
      title: "Jornada 2",
      matches: [
        {
          id: "j2-zeus",
          status: "live",
          competition: "Liga Profesional",
          dateLabel: "Hoy",
          kickoffLabel: "18:30 CET",
          liveMinute: "65'",
          venue: "Estadio Imperial",
          homeTeam: {
            name: "Zeus FC",
            crestLabel: "ZF",
          },
          awayTeam: {
            name: "Rising Raimon",
            crestLabel: "RR",
            isClub: true,
          },
          homeScore: 1,
          awayScore: 0,
          actionLabel: "Seguir directo",
          actionHint: "Minuto a minuto",
          detailHref: "/primer-equipo/partidos/j2-zeus",
        },
      ],
    },
    {
      id: "jornada-3",
      title: "Jornada 3",
      matches: [
        {
          id: "j3-inazuma-city",
          status: "pending",
          competition: "Liga Profesional",
          dateLabel: "22 Sep 2024",
          kickoffLabel: "20:45 CET",
          venue: "Estadio Raimon",
          homeTeam: {
            name: "Rising Raimon",
            crestLabel: "RR",
            isClub: true,
          },
          awayTeam: {
            name: "Inazuma City",
            crestLabel: "IC",
            muted: true,
          },
          actionLabel: "Ver previa",
          actionHint: "Previa del encuentro",
          detailHref: "/primer-equipo/partidos/j3-inazuma-city",
        },
      ],
    },
    {
      id: "jornada-4",
      title: "Jornada 4",
      matches: [
        {
          id: "j4-alpine",
          status: "postponed",
          competition: "Liga Profesional",
          dateLabel: "29 Sep 2024",
          kickoffLabel: "Pendiente",
          venue: "Campo por confirmar",
          homeTeam: {
            name: "Alpine FC",
            crestLabel: "AF",
            muted: true,
          },
          awayTeam: {
            name: "Rising Raimon",
            crestLabel: "RR",
            isClub: true,
          },
          actionLabel: "Fecha por confirmar",
          actionHint: "Partido aplazado",
          postponementReason: "Motivos meteorologicos",
        },
      ],
    },
  ],
};

export function getFirstTeamCalendarContent(): TeamCalendarContent {
  return FIRST_TEAM_CALENDAR;
}

const ACADEMY_TEAM_CALENDARS: Record<string, TeamCalendarContent> = {
  "raimon-b": {
    pageTitle: "Calendario de partidos",
    subtitle: "Raimon B - Temporada 2023/24",
    matchdays: [
      {
        id: "raimon-b-j1",
        title: "Jornada 1",
        matches: [
          {
            id: "raimon-b-vs-inazuma-c",
            status: "played",
            competition: "Segunda Autonomica",
            dateLabel: "14 Sep 2024",
            kickoffLabel: "16:00 CET",
            venue: "Campo Anexo 1",
            homeTeam: {
              name: "Raimon B",
              crestLabel: "RB",
              isClub: true,
            },
            awayTeam: {
              name: "Inazuma FC C",
              crestLabel: "IC",
            },
            homeScore: 2,
            awayScore: 0,
            actionLabel: "Ver resultado",
            actionHint: "Resumen breve del partido",
          },
        ],
      },
      {
        id: "raimon-b-j2",
        title: "Jornada 2",
        matches: [
          {
            id: "raimon-b-vs-zeus-b",
            status: "pending",
            competition: "Segunda Autonomica",
            dateLabel: "22 Sep 2024",
            kickoffLabel: "10:30 CET",
            venue: "Estadio Municipal Sur",
            homeTeam: {
              name: "Zeus Academy B",
              crestLabel: "ZA",
            },
            awayTeam: {
              name: "Raimon B",
              crestLabel: "RB",
              isClub: true,
            },
            actionLabel: "Ver previa",
            actionHint: "Convocatoria y previa",
          },
        ],
      },
      {
        id: "raimon-b-j3",
        title: "Jornada 3",
        matches: [
          {
            id: "raimon-b-vs-royal-c",
            status: "postponed",
            competition: "Segunda Autonomica",
            dateLabel: "29 Sep 2024",
            kickoffLabel: "Horario por confirmar",
            venue: "Campo Anexo 2",
            homeTeam: {
              name: "Raimon B",
              crestLabel: "RB",
              isClub: true,
            },
            awayTeam: {
              name: "Royal Academy C",
              crestLabel: "RA",
            },
            actionLabel: "Fecha por confirmar",
            actionHint: "Pendiente de nueva fecha",
            postponementReason: "Pendiente de nueva fecha",
          },
        ],
      },
      {
        id: "raimon-b-j4",
        title: "Jornada 4",
        matches: [
          {
            id: "raimon-b-vs-farm-jr",
            status: "pending",
            competition: "Segunda Autonomica",
            dateLabel: "06 Oct 2024",
            kickoffLabel: "12:30 CET",
            venue: "Campo Raimon",
            homeTeam: {
              name: "Farm Jr.",
              crestLabel: "FJ",
            },
            awayTeam: {
              name: "Raimon B",
              crestLabel: "RB",
              isClub: true,
            },
            actionLabel: "Pendiente",
            actionHint: "Partido por disputarse",
          },
        ],
      },
    ],
  },
  "juvenil-a": {
    pageTitle: "Calendario de partidos",
    subtitle: "Juvenil A - Temporada 2023/24",
    matchdays: [
      {
        id: "juvenil-a-j1",
        title: "Jornada 1",
        matches: [
          {
            id: "juvenil-a-vs-brain-fc",
            status: "played",
            competition: "Preferente Juvenil",
            dateLabel: "13 Sep 2024",
            kickoffLabel: "17:00 CET",
            venue: "Campo 2 Raimon",
            homeTeam: {
              name: "Juvenil A",
              crestLabel: "JA",
              isClub: true,
            },
            awayTeam: {
              name: "Brain FC",
              crestLabel: "BF",
            },
            homeScore: 3,
            awayScore: 1,
            actionLabel: "Ver resultado",
            actionHint: "Cronica del encuentro",
          },
        ],
      },
      {
        id: "juvenil-a-j2",
        title: "Jornada 2",
        matches: [
          {
            id: "juvenil-a-vs-royal-b",
            status: "pending",
            competition: "Preferente Juvenil",
            dateLabel: "21 Sep 2024",
            kickoffLabel: "11:30 CET",
            venue: "Ciudad Deportiva Royal",
            homeTeam: {
              name: "Royal Academy B",
              crestLabel: "RA",
            },
            awayTeam: {
              name: "Juvenil A",
              crestLabel: "JA",
              isClub: true,
            },
            actionLabel: "Ver previa",
            actionHint: "Duelo directo por la zona alta",
          },
        ],
      },
      {
        id: "juvenil-a-j3",
        title: "Jornada 3",
        matches: [
          {
            id: "juvenil-a-vs-occult",
            status: "postponed",
            competition: "Preferente Juvenil",
            dateLabel: "28 Sep 2024",
            kickoffLabel: "Fecha por confirmar",
            venue: "Campo 2 Raimon",
            homeTeam: {
              name: "Juvenil A",
              crestLabel: "JA",
              isClub: true,
            },
            awayTeam: {
              name: "Occult Academy",
              crestLabel: "OA",
            },
            actionLabel: "Fecha por confirmar",
            actionHint: "Pendiente de nueva fecha",
            postponementReason: "Pendiente de nueva fecha",
          },
        ],
      },
      {
        id: "juvenil-a-j4",
        title: "Jornada 4",
        matches: [
          {
            id: "juvenil-a-vs-kirkwood",
            status: "pending",
            competition: "Preferente Juvenil",
            dateLabel: "05 Oct 2024",
            kickoffLabel: "10:00 CET",
            venue: "Kirkwood Arena",
            homeTeam: {
              name: "Kirkwood Juvenil",
              crestLabel: "KJ",
            },
            awayTeam: {
              name: "Juvenil A",
              crestLabel: "JA",
              isClub: true,
            },
            actionLabel: "Pendiente",
            actionHint: "Horario confirmado para la manana",
          },
        ],
      },
    ],
  },
};

function createFallbackAcademyCalendarContent(
  teamSlug: string,
  teamName: string,
  competition: string,
  season: string,
): TeamCalendarContent {
  const crestLabel = teamName
    .split(" ")
    .map((chunk) => chunk[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return {
    pageTitle: "Calendario de partidos",
    subtitle: `${teamName} - ${season}`,
    matchdays: [
      {
        id: `${teamSlug}-j1`,
        title: "Jornada 1",
        matches: [
          {
            id: `${teamSlug}-j1-played`,
            status: "played",
            competition,
            dateLabel: "14 Sep 2024",
            kickoffLabel: "11:00 CET",
            venue: "Campo Raimon",
            homeTeam: {
              name: teamName,
              crestLabel,
              isClub: true,
            },
            awayTeam: {
              name: "Royal Academy Base",
              crestLabel: "RA",
            },
            homeScore: 2,
            awayScore: 1,
            actionLabel: "Ver resultado",
            actionHint: "Resumen breve del partido",
          },
        ],
      },
      {
        id: `${teamSlug}-j2`,
        title: "Jornada 2",
        matches: [
          {
            id: `${teamSlug}-j2-pending`,
            status: "pending",
            competition,
            dateLabel: "21 Sep 2024",
            kickoffLabel: "10:30 CET",
            venue: "Campo visitante",
            homeTeam: {
              name: "Zeus Academy",
              crestLabel: "ZA",
            },
            awayTeam: {
              name: teamName,
              crestLabel,
              isClub: true,
            },
            actionLabel: "Ver previa",
            actionHint: "Previa disponible",
          },
        ],
      },
      {
        id: `${teamSlug}-j3`,
        title: "Jornada 3",
        matches: [
          {
            id: `${teamSlug}-j3-postponed`,
            status: "postponed",
            competition,
            dateLabel: "28 Sep 2024",
            kickoffLabel: "Fecha por confirmar",
            venue: "Campo Raimon",
            homeTeam: {
              name: teamName,
              crestLabel,
              isClub: true,
            },
            awayTeam: {
              name: "Inazuma Base",
              crestLabel: "IB",
            },
            actionLabel: "Fecha por confirmar",
            actionHint: "Pendiente de nueva fecha",
            postponementReason: "Pendiente de nueva fecha",
          },
        ],
      },
      {
        id: `${teamSlug}-j4`,
        title: "Jornada 4",
        matches: [
          {
            id: `${teamSlug}-j4-pending`,
            status: "pending",
            competition,
            dateLabel: "05 Oct 2024",
            kickoffLabel: "12:00 CET",
            venue: "Campo Municipal Norte",
            homeTeam: {
              name: "Farm Academy",
              crestLabel: "FA",
            },
            awayTeam: {
              name: teamName,
              crestLabel,
              isClub: true,
            },
            actionLabel: "Pendiente",
            actionHint: "Partido por disputarse",
          },
        ],
      },
    ],
  };
}

export function getAcademyTeamCalendarContent(input: {
  slug: string;
  name: string;
  competition: string;
  season: string;
}): TeamCalendarContent {
  const calendar =
    ACADEMY_TEAM_CALENDARS[input.slug] ??
    createFallbackAcademyCalendarContent(input.slug, input.name, input.competition, input.season);

  return {
    ...calendar,
    matchdays: calendar.matchdays.map((matchday) => ({
      ...matchday,
      matches: matchday.matches.map((match) => decorateAcademyMatch(input.slug, match)),
    })),
  };
}

export function getKnownAcademyTeamCalendarSlugs(): string[] {
  return Object.keys(ACADEMY_TEAM_CALENDARS);
}
