import { MatchStatus, NewsStatus } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { type AuthenticatedAdmin } from "@/server/auth/session";
import {
  buildStandingTableScopeWhere,
  standingTableCoversTeam,
} from "@/server/services/standing-table-sharing";

type DashboardMatch = {
  id: string;
  teamName: string;
  opponentName: string;
  dateTime: Date | null;
  status: AdminDashboardMatchStatus;
};

export type AdminDashboardMatchStatus = "scheduled" | "live" | "played" | "postponed";

type DashboardResult = {
  id: string;
  teamName: string;
  opponentName: string;
  dateTime: Date | null;
  homeScore: number | null;
  awayScore: number | null;
};

export type AdminDashboardData = {
  activeSeasonName: string | null;
  teamCount: number;
  playerCount: number;
  openMatchesCount: number;
  standingTableCount: number;
  missingStandingTablesCount: number;
  draftNewsCount: number | null;
  mediaCount: number | null;
  assignedTeams: string[];
  upcomingMatches: DashboardMatch[];
  recentResults: DashboardResult[];
};

function mapDashboardMatchStatus(status: MatchStatus): AdminDashboardMatchStatus {
  switch (status) {
    case MatchStatus.LIVE:
      return "live";
    case MatchStatus.POSTPONED:
      return "postponed";
    case MatchStatus.PLAYED:
      return "played";
    case MatchStatus.SCHEDULED:
    default:
      return "scheduled";
  }
}

export async function getAdminDashboardData(
  _user: AuthenticatedAdmin,
): Promise<AdminDashboardData> {
  void _user;

  const siteSettings = await prisma.siteSettings.findFirst({
    select: {
      activeSeason: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  const activeSeasonId = siteSettings?.activeSeason?.id ?? null;
  const teamScopeWhere = {
    active: true,
    publicVisible: true,
    deletedAt: null,
    ...(activeSeasonId ? { seasonId: activeSeasonId } : {}),
  };
  const matchScopeWhere = {
    deletedAt: null,
    ...(activeSeasonId ? { seasonId: activeSeasonId } : {}),
  };

  const [
    teamCount,
    playerAssignments,
    openMatchesCount,
    draftNewsCount,
    mediaCount,
    visibleTeams,
    upcomingMatches,
    recentResults,
  ] = await Promise.all([
    prisma.seasonTeam.count({
      where: teamScopeWhere,
    }),
    prisma.teamPlayerAssignment.findMany({
      where: {
        active: true,
        deletedAt: null,
        ...(activeSeasonId ? { seasonId: activeSeasonId } : {}),
        seasonTeam: teamScopeWhere,
      },
      distinct: ["playerId"],
      select: {
        playerId: true,
      },
    }),
    prisma.match.count({
      where: {
        ...matchScopeWhere,
        status: {
          in: [MatchStatus.SCHEDULED, MatchStatus.LIVE, MatchStatus.POSTPONED],
        },
      },
    }),
    prisma.newsPost.count({
      where: {
        deletedAt: null,
        status: NewsStatus.DRAFT,
      },
    }),
    prisma.mediaAsset.count({
      where: {
        deletedAt: null,
      },
    }),
    prisma.seasonTeam.findMany({
      where: teamScopeWhere,
      select: {
        id: true,
        publicName: true,
        competitionId: true,
        competitionName: true,
      },
    }),
    prisma.match.findMany({
      where: {
        ...matchScopeWhere,
        status: {
          in: [MatchStatus.SCHEDULED, MatchStatus.LIVE, MatchStatus.POSTPONED],
        },
      },
      orderBy: [{ dateTime: "asc" }, { id: "asc" }],
      take: 5,
      select: {
        id: true,
        opponentName: true,
        dateTime: true,
        status: true,
        seasonTeam: {
          select: {
            publicName: true,
          },
        },
      },
    }),
    prisma.match.findMany({
      where: {
        ...matchScopeWhere,
        status: MatchStatus.PLAYED,
      },
      orderBy: [{ dateTime: "desc" }, { id: "desc" }],
      take: 4,
      select: {
        id: true,
        opponentName: true,
        dateTime: true,
        homeScore: true,
        awayScore: true,
        seasonTeam: {
          select: {
            publicName: true,
          },
        },
      },
    }),
  ]);

  const standingTables =
    activeSeasonId === null || visibleTeams.length === 0
      ? []
      : await prisma.standingTable.findMany({
          where: buildStandingTableScopeWhere(activeSeasonId, visibleTeams, {
            publicVisible: true,
          }),
          select: {
            seasonTeamId: true,
            competitionId: true,
            seasonTeam: {
              select: {
                competitionName: true,
              },
            },
          },
        });

  const coveredTeamCount = visibleTeams.filter((team) =>
    standingTables.some((table) => standingTableCoversTeam(table, team)),
  ).length;
  const standingTableCount = standingTables.length;
  const missingStandingTablesCount = Math.max(visibleTeams.length - coveredTeamCount, 0);

  return {
    activeSeasonName: siteSettings?.activeSeason?.name ?? null,
    teamCount,
    playerCount: playerAssignments.length,
    openMatchesCount,
    standingTableCount,
    missingStandingTablesCount,
    draftNewsCount,
    mediaCount,
    assignedTeams: [],
    upcomingMatches: upcomingMatches.map((match) => ({
      id: match.id.toString(),
      teamName: match.seasonTeam.publicName,
      opponentName: match.opponentName,
      dateTime: match.dateTime,
      status: mapDashboardMatchStatus(match.status),
    })),
    recentResults: recentResults.map((match) => ({
      id: match.id.toString(),
      teamName: match.seasonTeam.publicName,
      opponentName: match.opponentName,
      dateTime: match.dateTime,
      homeScore: match.homeScore,
      awayScore: match.awayScore,
    })),
  };
}
