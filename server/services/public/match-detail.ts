import { MatchStatus } from "@prisma/client";
import type {
  MatchDetailContent,
  MatchDetailScorer,
  PlayerPerformance,
} from "@/lib/public/match-detail-content";
import { buildPublicMatchDetailHref } from "@/server/services/public/calendar";
import {
  buildPlayerName,
  mapPositionLabel,
} from "@/server/services/public/player-mappers";

import { prisma } from "@/server/db/prisma";

function isNumericId(value: string) {
  return /^\d+$/.test(value);
}

function buildStageLabel(competitionName: string | null, matchday: number | null) {
  if (competitionName && typeof matchday === "number") {
    return `${competitionName} - Jornada ${matchday}`;
  }

  if (competitionName) {
    return competitionName;
  }

  if (typeof matchday === "number") {
    return `Jornada ${matchday}`;
  }

  return "Partido oficial";
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

function mapPublicMatchStatus(status: MatchStatus, isFirstTeam: boolean) {
  if (status === MatchStatus.PLAYED) {
    return "played" as const;
  }

  if (status === MatchStatus.POSTPONED) {
    return "postponed" as const;
  }

  if (status === MatchStatus.LIVE) {
    return isFirstTeam ? ("live" as const) : ("pending" as const);
  }

  return "pending" as const;
}

function hasRelevantPerformance(row: {
  played: boolean;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  ownGoals: number;
  cleanSheets: number;
}) {
  return (
    row.played ||
    row.goals > 0 ||
    row.assists > 0 ||
    row.yellowCards > 0 ||
    row.redCards > 0 ||
    row.ownGoals > 0 ||
    row.cleanSheets > 0
  );
}

function buildOwnScorers(input: {
  playerPerformances: Array<{
    name: string;
    goals: number;
  }>;
  ownTeamIsHome: boolean;
}) {
  const ownScorers = input.playerPerformances
    .filter((player) => player.goals > 0)
    .flatMap((player) =>
      Array.from({ length: player.goals }, () => ({
        playerName: player.name,
        minutes: [],
      })),
    );

  return {
    homeScorers: input.ownTeamIsHome ? ownScorers : ([] as MatchDetailScorer[]),
    awayScorers: input.ownTeamIsHome ? ([] as MatchDetailScorer[]) : ownScorers,
  };
}

function buildPreviewNote(input: {
  status: MatchStatus;
  summary: string | null;
  isFirstTeam: boolean;
}) {
  const summary = input.summary?.trim();

  if (summary) {
    return summary;
  }

  if (input.status === MatchStatus.POSTPONED) {
    return "Pendiente de nueva fecha";
  }

  if (input.status === MatchStatus.LIVE && !input.isFirstTeam) {
    return "Partido en curso";
  }

  if (input.status === MatchStatus.SCHEDULED || input.status === MatchStatus.LIVE) {
    return "Vista previa del encuentro";
  }

  return undefined;
}

async function getDbMatchDetailBase(matchId: string, teamSlug?: string) {
  if (!isNumericId(matchId)) {
    return null;
  }

  const match = await prisma.match.findFirst({
    where: {
      id: BigInt(matchId),
      deletedAt: null,
      publicVisible: true,
      seasonTeam: {
        active: true,
        publicVisible: true,
        deletedAt: null,
        ...(teamSlug ? { publicSlug: teamSlug } : {}),
      },
    },
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
      seasonId: true,
      seasonTeamId: true,
      competition: {
        select: {
          name: true,
        },
      },
      season: {
        select: {
          name: true,
        },
      },
      seasonTeam: {
        select: {
          id: true,
          publicName: true,
          publicSlug: true,
          competitionName: true,
          team: {
            select: {
              isFirstTeam: true,
            },
          },
        },
      },
    },
  });

  if (!match) {
    return null;
  }

  const statRows = await prisma.playerMatchStats.findMany({
    where: {
      matchId: match.id,
      seasonId: match.seasonId,
      seasonTeamId: match.seasonTeamId,
    },
    orderBy: [{ playerId: "asc" }],
    select: {
      playerId: true,
      played: true,
      goals: true,
      assists: true,
      mvp: true,
      yellowCards: true,
      redCards: true,
      ownGoals: true,
      cleanSheets: true,
      player: {
        select: {
          id: true,
          slug: true,
          firstName: true,
          lastName: true,
          publicName: true,
        },
      },
    },
  });

  const playerIds = statRows.map((row) => row.playerId);

  const assignments =
    playerIds.length > 0
      ? await prisma.teamPlayerAssignment.findMany({
          where: {
            seasonTeamId: match.seasonTeamId,
            seasonId: match.seasonId,
            active: true,
            deletedAt: null,
            playerId: {
              in: playerIds,
            },
          },
          orderBy: [{ displayOrder: "asc" }, { shirtNumber: "asc" }, { id: "asc" }],
          select: {
            playerId: true,
            shirtNumber: true,
            position: true,
          },
        })
      : [];

  return {
    match,
    statRows,
    assignments,
  };
}

function mapPlayerPerformances(input: {
  statRows: Array<{
    playerId: bigint;
    played: boolean;
    goals: number;
    assists: number;
    mvp: number;
    yellowCards: number;
    redCards: number;
    ownGoals: number;
    cleanSheets: number;
    player: {
      id: bigint;
      slug: string;
      firstName: string;
      lastName: string;
      publicName: string | null;
    };
  }>;
  assignments: Array<{
    playerId: bigint;
    shirtNumber: number | null;
    position: string | null;
  }>;
  teamSlug: string;
  isFirstTeam: boolean;
}) {
  const assignmentMap = new Map(
    input.assignments.map((assignment) => [assignment.playerId.toString(), assignment]),
  );

  const performances: PlayerPerformance[] = [];

  for (const row of input.statRows) {
    if (!hasRelevantPerformance(row)) {
      continue;
    }

    const assignment = assignmentMap.get(row.playerId.toString());

    performances.push({
      id: row.player.id.toString(),
      shirtNumber: assignment?.shirtNumber ?? 0,
      name: buildPlayerName(row.player),
      position: mapPositionLabel(assignment?.position ?? null),
      href: `/jugadores/${row.player.slug}`,
      goals: row.goals > 0 ? row.goals : undefined,
      assists: row.assists > 0 ? row.assists : undefined,
      yellowCards: row.yellowCards > 0 ? row.yellowCards : undefined,
      redCards: row.redCards > 0 ? row.redCards : undefined,
      ownGoals: row.ownGoals > 0 ? row.ownGoals : undefined,
      cleanSheet: row.cleanSheets > 0 ? true : undefined,
      mvp: row.mvp > 0 ? true : undefined,
    });
  }

  return performances;
}

function buildDbMatchDetailContent(input: Awaited<ReturnType<typeof getDbMatchDetailBase>>): MatchDetailContent | null {
  if (!input) {
    return null;
  }

  const { match, statRows, assignments } = input;
  const isFirstTeam = match.seasonTeam.team.isFirstTeam;
  const status = mapPublicMatchStatus(match.status, isFirstTeam);
  const ownTeam = {
    name: match.seasonTeam.publicName,
    crestLabel: buildCrestLabel(match.seasonTeam.publicName),
    isClub: true,
  };
  const opponentTeam = {
    name: match.opponentName,
    crestLabel: buildCrestLabel(match.opponentName),
    muted: !isFirstTeam,
  };
  const playerPerformances = mapPlayerPerformances({
    statRows,
    assignments,
    teamSlug: match.seasonTeam.publicSlug,
    isFirstTeam,
  });
  const scorers = buildOwnScorers({
    playerPerformances: playerPerformances.map((player) => ({
      name: player.name,
      goals: player.goals ?? 0,
    })),
    ownTeamIsHome: match.isHome,
  });

  return {
    teamType: isFirstTeam ? "first-team" : "academy",
    match: {
      id: match.id.toString(),
      status,
      competition: match.competition?.name ?? match.seasonTeam.competitionName ?? "Competicion pendiente",
      dateLabel: formatDateLabel(match.dateTime),
      kickoffLabel: formatKickoffLabel(match.dateTime),
      venue: match.venue?.trim() || "Campo por confirmar",
      homeTeam: match.isHome ? ownTeam : opponentTeam,
      awayTeam: match.isHome ? opponentTeam : ownTeam,
      homeScore: typeof match.homeScore === "number" ? match.homeScore : undefined,
      awayScore: typeof match.awayScore === "number" ? match.awayScore : undefined,
      actionLabel:
        status === "played"
          ? isFirstTeam
            ? "Ver resumen"
            : "Ver resultado"
          : "Vista previa",
      actionHint: match.summary?.trim() || undefined,
      detailHref: buildPublicMatchDetailHref({
        teamSlug: match.seasonTeam.publicSlug,
        isFirstTeam,
        matchId: match.id.toString(),
      }),
    },
    stageLabel: buildStageLabel(
      match.competition?.name ?? match.seasonTeam.competitionName ?? null,
      match.matchday,
    ),
    highlightsUrl: isFirstTeam ? match.videoUrl ?? undefined : undefined,
    showHighlights: isFirstTeam ? Boolean(match.videoUrl) : false,
    showLiveFeatures: isFirstTeam,
    homeScorers: scorers.homeScorers,
    awayScorers: scorers.awayScorers,
    playerPerformances,
    context: isFirstTeam
      ? undefined
      : {
          teamName: match.seasonTeam.publicName,
          season: match.season.name,
          backToCalendarHref: `/equipos/${match.seasonTeam.publicSlug}/calendario`,
          backToCalendarLabel: "Volver al calendario",
          backToTeamHref: `/equipos/${match.seasonTeam.publicSlug}`,
          backToTeamLabel: `Volver a ${match.seasonTeam.publicName}`,
        },
    previewNote: buildPreviewNote({
      status: match.status,
      summary: match.summary,
      isFirstTeam,
    }),
  };
}

export async function getFirstTeamMatchDetailFromDb(
  matchId: string,
): Promise<MatchDetailContent | null> {
  try {
    const detail = buildDbMatchDetailContent(await getDbMatchDetailBase(matchId));

    if (!detail || detail.teamType !== "first-team") {
      return null;
    }

    return detail;
  } catch {
    return null;
  }
}

export async function getAcademyMatchDetailFromDb(
  teamSlug: string,
  matchId: string,
): Promise<MatchDetailContent | null> {
  try {
    const detail = buildDbMatchDetailContent(await getDbMatchDetailBase(matchId, teamSlug));

    if (!detail || detail.teamType !== "academy") {
      return null;
    }

    return detail;
  } catch {
    return null;
  }
}

export async function getFirstTeamMatchDetailIdsFromDb(): Promise<string[]> {
  try {
    const matches = await prisma.match.findMany({
      where: {
        deletedAt: null,
        publicVisible: true,
        seasonTeam: {
          active: true,
          publicVisible: true,
          deletedAt: null,
          team: {
            isFirstTeam: true,
          },
        },
      },
      select: {
        id: true,
      },
      orderBy: [{ dateTime: "asc" }, { id: "asc" }],
    });

    return matches.map((match) => match.id.toString());
  } catch {
    return [];
  }
}

export async function getAcademyMatchDetailStaticParamsFromDb(): Promise<
  Array<{
    teamSlug: string;
    matchId: string;
  }>
> {
  try {
    const matches = await prisma.match.findMany({
      where: {
        deletedAt: null,
        publicVisible: true,
        seasonTeam: {
          active: true,
          publicVisible: true,
          deletedAt: null,
          team: {
            isFirstTeam: false,
          },
        },
      },
      select: {
        id: true,
        seasonTeam: {
          select: {
            publicSlug: true,
          },
        },
      },
      orderBy: [{ dateTime: "asc" }, { id: "asc" }],
    });

    return matches.map((match) => ({
      teamSlug: match.seasonTeam.publicSlug,
      matchId: match.id.toString(),
    }));
  } catch {
    return [];
  }
}
