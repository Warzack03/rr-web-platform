import { MatchStatus } from "@prisma/client";
import type {
  CalendarMatch,
  CalendarMatchStatus,
  CalendarMatchday,
  TeamCalendarContent,
} from "@/lib/public/team-calendar-content";
import { getPublicTeamDisplayName } from "@/lib/public/team-display-name";
import { prisma } from "@/server/db/prisma";

type DbCalendarTeam = {
  id: bigint;
  publicName: string;
  publicSlug: string;
  competitionName: string | null;
  season: {
    name: string;
  };
  team: {
    isFirstTeam: boolean;
  };
};

export function buildPublicMatchDetailHref(input: {
  teamSlug: string;
  isFirstTeam: boolean;
  matchId: string;
}) {
  return input.isFirstTeam
    ? `/primer-equipo/partidos/${input.matchId}`
    : `/equipos/${input.teamSlug}/partidos/${input.matchId}`;
}

function formatDateLabel(date: Date | null) {
  if (!date) {
    return "Fecha pendiente";
  }

  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Europe/Madrid",
  })
    .format(date)
    .replace(".", "");
}

function formatKickoffLabel(date: Date | null) {
  if (!date) {
    return "Horario por confirmar";
  }

  return `${new Intl.DateTimeFormat("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Europe/Madrid",
  }).format(date)} CET`;
}

function buildCrestLabel(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((chunk) => chunk[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 2);
}

function mapCalendarMatchStatus(status: MatchStatus, isFirstTeam: boolean): CalendarMatchStatus {
  if (status === MatchStatus.PLAYED) {
    return "played";
  }

  if (status === MatchStatus.POSTPONED) {
    return isFirstTeam ? "postponed" : "pending";
  }

  if (status === MatchStatus.LIVE) {
    return isFirstTeam ? "live" : "pending";
  }

  return "pending";
}

function buildActionFields(input: {
  status: CalendarMatchStatus;
  isFirstTeam: boolean;
  hasVideoUrl: boolean;
  hasLiveUrl: boolean;
  summary: string | null;
}) {
  if (input.status === "live") {
    return {
      actionLabel: "Seguir directo",
      actionHint: input.hasLiveUrl ? "Cobertura en directo disponible" : "Seguimiento en directo",
    };
  }

  if (input.status === "played") {
    return {
      actionLabel: input.isFirstTeam ? "Ver resumen" : "Ver resultado",
      actionHint: input.hasVideoUrl
        ? "Resumen y momentos clave"
        : input.summary?.trim() || "Resumen pendiente de publicar",
    };
  }

  if (input.status === "postponed") {
    return {
      actionLabel: input.isFirstTeam ? "Fecha por confirmar" : "Pendiente",
      actionHint: input.summary?.trim() || "Pendiente de nueva fecha",
      postponementReason: input.summary?.trim() || "Pendiente de nueva fecha",
    };
  }

  return {
    actionLabel: "Vista previa",
    actionHint: input.summary?.trim() || "Previa del encuentro",
  };
}

function buildMatchdayTitle(matchday: number | null) {
  return typeof matchday === "number" ? `Jornada ${matchday}` : "Sin jornada";
}

function mapCalendarMatch(input: {
  match: {
    id: bigint;
    matchday: number | null;
    dateTime: Date | null;
    venue: string | null;
    isHome: boolean;
    opponentName: string;
    status: MatchStatus;
    homeScore: number | null;
    awayScore: number | null;
    summary: string | null;
    videoUrl: string | null;
    liveUrl: string | null;
    competition: {
      name: string;
    } | null;
  };
  team: DbCalendarTeam;
}): CalendarMatch {
  const { match, team } = input;
  const status = mapCalendarMatchStatus(match.status, team.team.isFirstTeam);
  const displayName = getPublicTeamDisplayName(team.publicName, team.team.isFirstTeam);
  const ownTeam = {
    name: displayName,
    crestLabel: buildCrestLabel(displayName),
    isClub: true,
  };
  const opponentTeam = {
    name: match.opponentName,
    crestLabel: buildCrestLabel(match.opponentName),
    muted: !team.team.isFirstTeam,
  };
  const actionFields = buildActionFields({
    status,
    isFirstTeam: team.team.isFirstTeam,
    hasVideoUrl: Boolean(match.videoUrl),
    hasLiveUrl: Boolean(match.liveUrl),
    summary: match.summary,
  });

  return {
    id: match.id.toString(),
    status,
    competition: match.competition?.name ?? team.competitionName ?? "Competicion pendiente",
    dateLabel: formatDateLabel(match.dateTime),
    kickoffLabel: formatKickoffLabel(match.dateTime),
    venue: match.venue?.trim() || "Campo por confirmar",
    homeTeam: match.isHome ? ownTeam : opponentTeam,
    awayTeam: match.isHome ? opponentTeam : ownTeam,
    homeScore: typeof match.homeScore === "number" ? match.homeScore : undefined,
    awayScore: typeof match.awayScore === "number" ? match.awayScore : undefined,
    detailHref: buildPublicMatchDetailHref({
      teamSlug: team.publicSlug,
      isFirstTeam: team.team.isFirstTeam,
      matchId: match.id.toString(),
    }),
    ...actionFields,
  };
}

function buildCalendarContent(team: DbCalendarTeam, matchdays: CalendarMatchday[]): TeamCalendarContent {
  const displayName = getPublicTeamDisplayName(team.publicName, team.team.isFirstTeam);

  return {
    pageTitle: "Calendario de partidos",
    subtitle: `${displayName} - ${team.season.name}`,
    matchdays,
  };
}

export async function getPublicTeamCalendarContentFromDb(
  teamSlug: string,
): Promise<TeamCalendarContent | null> {
  try {
    const seasonTeam = await prisma.siteSettings.findFirst({
      orderBy: { updatedAt: "desc" },
      select: {
        activeSeason: {
          select: {
            seasonTeams: {
              where: {
                publicSlug: teamSlug,
                active: true,
                publicVisible: true,
                deletedAt: null,
              },
              take: 1,
              select: {
                id: true,
                publicName: true,
                publicSlug: true,
                competitionName: true,
                season: {
                  select: {
                    name: true,
                  },
                },
                team: {
                  select: {
                    isFirstTeam: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const team = seasonTeam?.activeSeason?.seasonTeams[0];

    if (!team) {
      return null;
    }

    const matches = await prisma.match.findMany({
      where: {
        seasonTeamId: team.id,
        deletedAt: null,
        publicVisible: true,
      },
      orderBy: [{ matchday: "asc" }, { dateTime: "asc" }, { id: "asc" }],
      select: {
        id: true,
        matchday: true,
        dateTime: true,
        venue: true,
        isHome: true,
        opponentName: true,
        status: true,
        homeScore: true,
        awayScore: true,
        summary: true,
        videoUrl: true,
        liveUrl: true,
        competition: {
          select: {
            name: true,
          },
        },
      },
    });

    const grouped = new Map<string, CalendarMatchday>();

    for (const match of matches) {
      const key = typeof match.matchday === "number" ? `matchday:${match.matchday}` : `match:${match.id.toString()}`;
      const existing = grouped.get(key);

      if (existing) {
        existing.matches.push(mapCalendarMatch({ match, team }));
        continue;
      }

      grouped.set(key, {
        id: key,
        title: buildMatchdayTitle(match.matchday),
        matches: [mapCalendarMatch({ match, team })],
      });
    }

    return buildCalendarContent(team, Array.from(grouped.values()));
  } catch {
    return null;
  }
}
