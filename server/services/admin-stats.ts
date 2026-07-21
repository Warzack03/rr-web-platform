import { MatchStatus } from "@prisma/client";
import type { AdminStatsState, AdminMatchPlayerEntry } from "@/lib/admin/admin-stats";
import type { MatchManagementMatch, MatchManagementTeam } from "@/lib/admin/match-management";
import type { AdminPlayer } from "@/lib/admin/player-management";
import {
  buildStatsContextPlayerId,
  type AdminStatsCatalogPlayer,
  type AdminStatsPlayerContext,
  type AdminStatsScreenData,
} from "@/lib/admin/stats-management";
import {
  normalizeAdminPlayerPosition,
  normalizeEditableFoot,
} from "@/lib/admin/player-management";
import type { AuthenticatedAdmin } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";
import { buildPlayerName } from "@/server/services/public/player-mappers";

function toDateInputValue(dateTime: Date | null) {
  if (!dateTime) {
    return "";
  }

  return dateTime.toISOString().slice(0, 10);
}

function toTimeInputValue(dateTime: Date | null) {
  if (!dateTime) {
    return "";
  }

  return dateTime.toISOString().slice(11, 16);
}

function mapMatchdayLabel(matchday: number | null) {
  return matchday && Number.isFinite(matchday) ? `Jornada ${matchday}` : "Jornada pendiente";
}

function mapOwnScore(match: {
  isHome: boolean;
  homeScore: number | null;
  awayScore: number | null;
}) {
  return match.isHome ? match.homeScore : match.awayScore;
}

function mapOpponentScore(match: {
  isHome: boolean;
  homeScore: number | null;
  awayScore: number | null;
}) {
  return match.isHome ? match.awayScore : match.homeScore;
}

function buildEmptyMatchEntry(playerId: string): AdminMatchPlayerEntry {
  return {
    playerId,
    played: false,
    goals: 0,
    assists: 0,
    mvp: 0,
    yellowCards: 0,
    redCards: 0,
    recoveries: 0,
    shots: 0,
    shotsOnTarget: 0,
    ownGoals: 0,
    goalsConceded: 0,
    saves: 0,
    cleanSheets: 0,
  };
}

function createBaseAdminPlayer(input: {
  id: string;
  name: string;
  teamSlug: string;
  number: number;
  position: string | null | undefined;
  foot: string | null | undefined;
  country: string | null | undefined;
}): AdminPlayer {
  return {
    id: input.id,
    name: input.name,
    teamSlug: input.teamSlug,
    number: input.number,
    position: normalizeAdminPlayerPosition(input.position),
    foot: normalizeEditableFoot(input.foot),
    country: input.country?.toUpperCase() ?? "ES",
    minutes: 0,
    matchesPlayed: 0,
    goals: 0,
    assists: 0,
    yellowCards: 0,
    redCards: 0,
    mvp: 0,
    goalsConceded: 0,
    saves: 0,
    cleanSheets: 0,
    recoveries: 0,
    shots: 0,
    shotsOnTarget: 0,
    ownGoals: 0,
    advancedLabel: undefined,
  };
}

function createEmptyCarryOver() {
  return {
    matchesPlayed: 0,
    goals: 0,
    assists: 0,
    mvp: 0,
    yellowCards: 0,
    redCards: 0,
    recoveries: 0,
    shots: 0,
    shotsOnTarget: 0,
    ownGoals: 0,
    goalsConceded: 0,
    saves: 0,
    cleanSheets: 0,
  };
}

export async function getAdminStatsScope(_user: AuthenticatedAdmin) {
  void _user;

  const siteSettings = await prisma.siteSettings.findFirst({
    orderBy: { updatedAt: "desc" },
    select: {
      activeSeason: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  const activeSeason = siteSettings?.activeSeason ?? null;

  if (!activeSeason) {
    return {
      activeSeason: null,
      teams: [],
    };
  }

  const teams = await prisma.seasonTeam.findMany({
    where: {
      seasonId: activeSeason.id,
      active: true,
      deletedAt: null,
    },
    orderBy: [{ displayOrder: "asc" }, { publicName: "asc" }],
    select: {
      id: true,
      publicSlug: true,
      publicName: true,
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
  });

  return {
    activeSeason,
    teams,
  };
}

export async function getAdminStatsScreenData(
  user: AuthenticatedAdmin,
): Promise<AdminStatsScreenData> {
  const { activeSeason, teams } = await getAdminStatsScope(user);

  if (!activeSeason) {
    return {
      activeSeasonName: null,
      teams: [],
      matches: [],
      players: [],
      playerCatalog: [],
      statsState: {
        carryOverByPlayerId: {},
        matchEntriesByMatchId: {},
      },
    };
  }

  const playedMatches = await prisma.match.findMany({
    where: {
      seasonId: activeSeason.id,
      deletedAt: null,
      status: MatchStatus.PLAYED,
      seasonTeamId: {
        in: teams.map((team) => team.id),
      },
    },
    orderBy: [{ dateTime: "desc" }, { id: "desc" }],
    select: {
      id: true,
      matchday: true,
      opponentName: true,
      isHome: true,
      dateTime: true,
      venue: true,
      status: true,
      homeScore: true,
      awayScore: true,
      videoUrl: true,
      publicVisible: true,
      seasonTeam: {
        select: {
          id: true,
          publicSlug: true,
          publicName: true,
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
      competition: {
        select: {
          name: true,
        },
      },
    },
  });

  const assignments = await prisma.teamPlayerAssignment.findMany({
    where: {
      seasonId: activeSeason.id,
      deletedAt: null,
      seasonTeamId: {
        in: teams.map((team) => team.id),
      },
    },
    orderBy: [{ active: "desc" }, { isPrimary: "desc" }, { id: "desc" }],
    select: {
      id: true,
      playerId: true,
      shirtNumber: true,
      position: true,
      active: true,
      seasonTeam: {
        select: {
          publicSlug: true,
          publicName: true,
        },
      },
      player: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          publicName: true,
          slug: true,
          countryCode: true,
          preferredFoot: true,
        },
      },
    },
  });

  const statRows = await prisma.playerMatchStats.findMany({
    where: {
      seasonId: activeSeason.id,
      seasonTeamId: {
        in: teams.map((team) => team.id),
      },
      matchId: {
        in: playedMatches.map((match) => match.id),
      },
    },
    select: {
      matchId: true,
      playerId: true,
      seasonTeamId: true,
      statRole: true,
      played: true,
      goals: true,
      assists: true,
      mvp: true,
      yellowCards: true,
      redCards: true,
      recoveries: true,
      shots: true,
      shotsOnTarget: true,
      ownGoals: true,
      saves: true,
      goalsAgainst: true,
      cleanSheets: true,
      seasonTeam: {
        select: {
          publicSlug: true,
          publicName: true,
        },
      },
      player: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          publicName: true,
          slug: true,
          countryCode: true,
          preferredFoot: true,
        },
      },
    },
  });

  const catalogRows = await prisma.player.findMany({
    where: {
      deletedAt: null,
      assignments: {
        some: {
          seasonId: activeSeason.id,
          deletedAt: null,
          seasonTeam: {
            active: true,
            deletedAt: null,
          },
        },
      },
    },
    orderBy: [{ publicName: "asc" }, { firstName: "asc" }, { lastName: "asc" }],
    select: {
      id: true,
      firstName: true,
      lastName: true,
      publicName: true,
      slug: true,
      countryCode: true,
      preferredFoot: true,
      assignments: {
        where: {
          seasonId: activeSeason.id,
          deletedAt: null,
        },
        orderBy: [{ active: "desc" }, { isPrimary: "desc" }, { id: "desc" }],
        select: {
          shirtNumber: true,
          position: true,
          seasonTeam: {
            select: {
              publicSlug: true,
              publicName: true,
            },
          },
        },
      },
    },
  });

  const mappedTeams: MatchManagementTeam[] = teams.map((team) => ({
    id: team.id.toString(),
    slug: team.publicSlug,
    name: team.publicName,
    season: team.season.name,
    competition: team.competitionName ?? "Competicion pendiente",
    isFirstTeam: team.team.isFirstTeam,
  }));

  const playerCatalog: AdminStatsCatalogPlayer[] = catalogRows.map((player) => {
    const originAssignment = player.assignments[0];

    return {
      ...createBaseAdminPlayer({
        id: player.id.toString(),
        name: buildPlayerName(player),
        teamSlug: originAssignment?.seasonTeam.publicSlug ?? "",
        number: originAssignment?.shirtNumber ?? 0,
        position: originAssignment?.position,
        foot: player.preferredFoot,
        country: player.countryCode,
      }),
      sourcePlayerId: player.id.toString(),
      teamName: originAssignment?.seasonTeam.publicName ?? "Sin equipo",
    };
  });

  const playerCatalogById = new Map(
    playerCatalog.map((player) => [player.sourcePlayerId, player]),
  );

  const playerContexts = new Map<string, AdminStatsPlayerContext>();

  for (const assignment of assignments) {
    const contextId = buildStatsContextPlayerId(
      assignment.seasonTeam.publicSlug,
      assignment.player.id.toString(),
    );

    if (playerContexts.has(contextId)) {
      continue;
    }

    playerContexts.set(contextId, {
      ...createBaseAdminPlayer({
        id: contextId,
        name: buildPlayerName(assignment.player),
        teamSlug: assignment.seasonTeam.publicSlug,
        number: assignment.shirtNumber ?? 0,
        position: assignment.position,
        foot: assignment.player.preferredFoot,
        country: assignment.player.countryCode,
      }),
      sourcePlayerId: assignment.player.id.toString(),
      contextType: "regular",
      originTeamSlug: assignment.seasonTeam.publicSlug,
      originTeamName: assignment.seasonTeam.publicName,
    });
  }

  for (const statRow of statRows) {
    const sourcePlayerId = statRow.player.id.toString();
    const contextId = buildStatsContextPlayerId(
      statRow.seasonTeam.publicSlug,
      sourcePlayerId,
    );

    if (playerContexts.has(contextId)) {
      continue;
    }

    const catalogPlayer = playerCatalogById.get(sourcePlayerId);

    playerContexts.set(contextId, {
      ...createBaseAdminPlayer({
        id: contextId,
        name: buildPlayerName(statRow.player),
        teamSlug: statRow.seasonTeam.publicSlug,
        number: catalogPlayer?.number ?? 0,
        position:
          statRow.statRole === "GOALKEEPER"
            ? "POR"
            : (catalogPlayer?.position ?? "MED"),
        foot: statRow.player.preferredFoot,
        country: statRow.player.countryCode,
      }),
      sourcePlayerId,
      contextType: "guest",
      originTeamSlug: catalogPlayer?.teamSlug || undefined,
      originTeamName: catalogPlayer?.teamName || undefined,
    });
  }

  const statsState: AdminStatsState = {
    carryOverByPlayerId: Object.fromEntries(
      Array.from(playerContexts.values()).map((player) => [player.id, createEmptyCarryOver()]),
    ),
    matchEntriesByMatchId: Object.fromEntries(
      playedMatches.map((match) => [match.id.toString(), {}]),
    ),
  };

  for (const statRow of statRows) {
    const contextId = buildStatsContextPlayerId(
      statRow.seasonTeam.publicSlug,
      statRow.player.id.toString(),
    );
    const matchId = statRow.matchId.toString();

    const currentEntries = statsState.matchEntriesByMatchId[matchId] ?? {};
    currentEntries[contextId] = {
      ...buildEmptyMatchEntry(contextId),
      played: statRow.played,
      goals: statRow.goals,
      assists: statRow.assists,
      mvp: statRow.mvp,
      yellowCards: statRow.yellowCards,
      redCards: statRow.redCards,
      recoveries: statRow.recoveries,
      shots: statRow.shots,
      shotsOnTarget: statRow.shotsOnTarget,
      ownGoals: statRow.ownGoals,
      goalsConceded: statRow.goalsAgainst,
      saves: statRow.saves,
      cleanSheets: statRow.cleanSheets,
    };
    statsState.matchEntriesByMatchId[matchId] = currentEntries;
  }

  const mappedMatches: MatchManagementMatch[] = playedMatches.map((match) => ({
    id: match.id.toString(),
    teamId: match.seasonTeam.id.toString(),
    teamSlug: match.seasonTeam.publicSlug,
    teamName: match.seasonTeam.publicName,
    season: match.seasonTeam.season.name,
    competition: match.competition?.name ?? match.seasonTeam.competitionName ?? "Competicion pendiente",
    matchday: mapMatchdayLabel(match.matchday),
    opponentName: match.opponentName,
    isHome: match.isHome,
    date: toDateInputValue(match.dateTime),
    time: toTimeInputValue(match.dateTime),
    venue: match.venue ?? "Campo pendiente",
    status: "played",
    ownScore: mapOwnScore(match),
    opponentScore: mapOpponentScore(match),
    highlightsUrl: match.videoUrl ?? undefined,
    detailAvailable: match.publicVisible,
    previewAvailable: true,
    isFirstTeam: match.seasonTeam.team.isFirstTeam,
  }));

  const players = Array.from(playerContexts.values()).sort((left, right) => {
    if (left.teamSlug !== right.teamSlug) {
      return left.teamSlug.localeCompare(right.teamSlug, "es");
    }

    if (left.contextType !== right.contextType) {
      return left.contextType === "regular" ? -1 : 1;
    }

    if (left.number !== right.number) {
      return left.number - right.number;
    }

    return left.name.localeCompare(right.name, "es");
  });

  return {
    activeSeasonName: activeSeason.name,
    teams: mappedTeams,
    matches: mappedMatches,
    players,
    playerCatalog,
    statsState,
  };
}
