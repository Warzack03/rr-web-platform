import { MatchStatus, NewsStatus, UserRole } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { type AuthenticatedAdmin } from "@/server/auth/session";

type DashboardMatch = {
  id: string;
  teamName: string;
  opponentName: string;
  dateTime: Date | null;
  status: MatchStatus;
};

export type AdminDashboardData = {
  activeSeasonName: string | null;
  teamCount: number;
  pendingResultsCount: number;
  draftNewsCount: number | null;
  lastImportLabel: string | null;
  assignedTeams: string[];
  upcomingMatches: DashboardMatch[];
};

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

  const seasonTeamFilter =
    user.role === UserRole.COACH
      ? {
          seasonTeamId: {
            in: assignedTeamIds.length > 0 ? assignedTeamIds : [BigInt(-1)],
          },
        }
      : {};

  const [siteSettings, teamCount, pendingResultsCount, draftNewsCount, lastImport, upcomingMatches] =
    await Promise.all([
      prisma.siteSettings.findFirst({
        include: {
          activeSeason: {
            select: { name: true },
          },
        },
        orderBy: { updatedAt: "desc" },
      }),
      prisma.seasonTeam.count({
        where: {
          active: true,
          publicVisible: true,
          deletedAt: null,
          ...(user.role === UserRole.COACH
            ? {
                id: {
                  in: assignedTeamIds.length > 0 ? assignedTeamIds : [BigInt(-1)],
                },
              }
            : {}),
        },
      }),
      prisma.match.count({
        where: {
          deletedAt: null,
          status: {
            in: [MatchStatus.SCHEDULED, MatchStatus.LIVE],
          },
          ...seasonTeamFilter,
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
      user.role === UserRole.SUPERADMIN
        ? prisma.importBatch.findFirst({
            orderBy: { updatedAt: "desc" },
            select: {
              fileName: true,
              status: true,
            },
          })
        : Promise.resolve(null),
      prisma.match.findMany({
        where: {
          deletedAt: null,
          dateTime: {
            gte: new Date(),
          },
          ...seasonTeamFilter,
        },
        orderBy: { dateTime: "asc" },
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
    ]);

  return {
    activeSeasonName: siteSettings?.activeSeason?.name ?? null,
    teamCount,
    pendingResultsCount,
    draftNewsCount,
    lastImportLabel: lastImport ? `${lastImport.fileName ?? "importacion"} · ${lastImport.status}` : null,
    assignedTeams,
    upcomingMatches: upcomingMatches.map((match) => ({
      id: match.id.toString(),
      teamName: match.seasonTeam.publicName,
      opponentName: match.opponentName,
      dateTime: match.dateTime,
      status: match.status,
    })),
  };
}
