import { ImportStatus, MatchStatus, NewsStatus, UserRole } from "@prisma/client";
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
  status: MatchStatus;
};

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
  lastImportLabel: string | null;
  importReviewCount: number | null;
  assignedTeams: string[];
  upcomingMatches: DashboardMatch[];
  recentResults: DashboardResult[];
};

function mapImportStatusLabel(status: ImportStatus) {
  switch (status) {
    case ImportStatus.UPLOADED:
      return "Subida";
    case ImportStatus.VALIDATED:
      return "Validada";
    case ImportStatus.APPLIED:
      return "Aplicada";
    case ImportStatus.FAILED:
      return "Fallida";
    case ImportStatus.CANCELLED:
      return "Cancelada";
  }
}

export async function getAdminDashboardData(
  user: AuthenticatedAdmin,
): Promise<AdminDashboardData> {
  const assignedPermissions =
    user.role === UserRole.COACH
      ? await prisma.coachTeamPermission.findMany({
          where: {
            userId: user.id,
            active: true,
            seasonTeam: {
              active: true,
              deletedAt: null,
            },
          },
          select: {
            seasonTeamId: true,
            seasonTeam: {
              select: {
                publicName: true,
              },
            },
          },
        })
      : [];

  const assignedTeamIds = assignedPermissions.map((permission) => permission.seasonTeamId);
  const assignedTeams = assignedPermissions.map((permission) => permission.seasonTeam.publicName);
  const scopedTeamIds = assignedTeamIds.length > 0 ? assignedTeamIds : [BigInt(-1)];

  const siteSettings = await prisma.siteSettings.findFirst({
    include: {
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
    ...(user.role === UserRole.COACH
      ? {
          id: {
            in: scopedTeamIds,
          },
        }
      : {}),
  };
  const matchScopeWhere = {
    deletedAt: null,
    ...(activeSeasonId ? { seasonId: activeSeasonId } : {}),
    ...(user.role === UserRole.COACH
      ? {
          seasonTeamId: {
            in: scopedTeamIds,
          },
        }
      : {}),
  };

  const [
    teamCount,
    playerAssignments,
    openMatchesCount,
    draftNewsCount,
    mediaCount,
    visibleTeams,
    lastImport,
    importReviewCount,
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
    user.role === UserRole.COACH
      ? Promise.resolve(null)
      : prisma.newsPost.count({
          where: {
            deletedAt: null,
            status: NewsStatus.DRAFT,
          },
        }),
    user.role === UserRole.COACH
      ? Promise.resolve(null)
      : prisma.mediaAsset.count({
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
    user.role === UserRole.SUPERADMIN
      ? prisma.importBatch.findFirst({
          orderBy: { updatedAt: "desc" },
          select: {
            fileName: true,
            status: true,
          },
        })
      : Promise.resolve(null),
    user.role === UserRole.SUPERADMIN
      ? prisma.importBatch.count({
          where: {
            ...(activeSeasonId ? { seasonId: activeSeasonId } : {}),
            status: {
              not: ImportStatus.APPLIED,
            },
          },
        })
      : Promise.resolve(null),
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
    lastImportLabel: lastImport
      ? `${lastImport.fileName ?? "importacion"} · ${mapImportStatusLabel(lastImport.status)}`
      : null,
    importReviewCount,
    assignedTeams,
    upcomingMatches: upcomingMatches.map((match) => ({
      id: match.id.toString(),
      teamName: match.seasonTeam.publicName,
      opponentName: match.opponentName,
      dateTime: match.dateTime,
      status: match.status,
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
