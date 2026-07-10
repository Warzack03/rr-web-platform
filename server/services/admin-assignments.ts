import { UserRole } from "@prisma/client";
import type {
  AdminAssignmentPlayerOption,
  AdminAssignmentTeam,
  AdminManagedAssignment,
} from "@/lib/admin/assignment-management";
import {
  formatAdminDateLabel,
  toDateInputValue,
} from "@/lib/admin/assignment-management";
import { normalizeAdminPlayerPosition } from "@/lib/admin/player-management";
import type { AuthenticatedAdmin } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";
import { buildPlayerName } from "@/server/services/public/player-mappers";

export type AdminAssignmentsScreenData = {
  activeSeasonName: string | null;
  teams: AdminAssignmentTeam[];
  assignments: AdminManagedAssignment[];
  playerOptions: AdminAssignmentPlayerOption[];
};

export async function getAdminAssignmentsScope(user: AuthenticatedAdmin) {
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
          },
        })
      : [];

  const scopedTeamIds = assignedPermissions.map((permission) => permission.seasonTeamId);
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
      ...(user.role === UserRole.COACH
        ? {
            id: {
              in: scopedTeamIds.length > 0 ? scopedTeamIds : [BigInt(-1)],
            },
          }
        : {}),
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

export async function getAdminAssignmentsScreenData(
  user: AuthenticatedAdmin,
): Promise<AdminAssignmentsScreenData> {
  const { activeSeason, teams } = await getAdminAssignmentsScope(user);

  if (!activeSeason) {
    return {
      activeSeasonName: null,
      teams: [],
      assignments: [],
      playerOptions: [],
    };
  }

  const assignments = await prisma.teamPlayerAssignment.findMany({
    where: {
      seasonId: activeSeason.id,
      deletedAt: null,
      seasonTeamId: {
        in: teams.map((team) => team.id),
      },
    },
    orderBy: [
      { seasonTeam: { displayOrder: "asc" } },
      { active: "desc" },
      { shirtNumber: "asc" },
      { id: "asc" },
    ],
    select: {
      id: true,
      playerId: true,
      shirtNumber: true,
      position: true,
      isCaptain: true,
      isManualException: true,
      active: true,
      joinedAt: true,
      leftAt: true,
      sourceSystem: true,
      season: {
        select: {
          name: true,
        },
      },
      seasonTeam: {
        select: {
          id: true,
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
          publicVisible: true,
          photoMediaId: true,
        },
      },
    },
  });

  const playerOptionsRows = await prisma.player.findMany({
    where: {
      deletedAt: null,
    },
    orderBy: [{ publicName: "asc" }, { firstName: "asc" }, { lastName: "asc" }],
    select: {
      id: true,
      firstName: true,
      lastName: true,
      publicName: true,
      slug: true,
      publicVisible: true,
      active: true,
      photoMediaId: true,
      assignments: {
        where: {
          seasonId: activeSeason.id,
          active: true,
          deletedAt: null,
        },
        orderBy: [
          { isPrimary: "desc" },
          { seasonTeam: { displayOrder: "asc" } },
          { id: "desc" },
        ],
        select: {
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

  const mappedTeams: AdminAssignmentTeam[] = teams.map((team) => ({
    id: team.id.toString(),
    slug: team.publicSlug,
    name: team.publicName,
    competition: team.competitionName ?? "Competicion pendiente",
    season: team.season.name,
    isFirstTeam: team.team.isFirstTeam,
  }));

  const mappedAssignments: AdminManagedAssignment[] = assignments.map((assignment) => ({
    id: assignment.id.toString(),
    playerId: assignment.player.id.toString(),
    playerSlug: assignment.player.slug,
    teamId: assignment.seasonTeam.id.toString(),
    teamSlug: assignment.seasonTeam.publicSlug,
    teamName: assignment.seasonTeam.publicName,
    season: assignment.season.name,
    publicName: buildPlayerName(assignment.player),
    shirtNumber: assignment.shirtNumber ?? 0,
    publicPosition: normalizeAdminPlayerPosition(assignment.position),
    captain: assignment.isCaptain,
    visible: assignment.player.publicVisible,
    active: assignment.active,
    source:
      assignment.isManualException || !assignment.sourceSystem ? "manual" : "imported",
    hasPhoto: Boolean(assignment.player.photoMediaId),
    joinedAt: toDateInputValue(assignment.joinedAt),
    joinedLabel: assignment.joinedAt
      ? formatAdminDateLabel(assignment.joinedAt)
      : "Alta pendiente",
    leftAt: toDateInputValue(assignment.leftAt),
    leftLabel: assignment.leftAt ? formatAdminDateLabel(assignment.leftAt) : undefined,
  }));

  const mappedPlayerOptions: AdminAssignmentPlayerOption[] = playerOptionsRows.map((player) => ({
    id: player.id.toString(),
    publicName: buildPlayerName(player),
    slug: player.slug,
    visible: player.publicVisible,
    active: player.active,
    hasPhoto: Boolean(player.photoMediaId),
    currentTeamSlugs: player.assignments.map((assignment) => assignment.seasonTeam.publicSlug),
    currentTeamSlug: player.assignments[0]?.seasonTeam.publicSlug,
    currentTeamName:
      player.assignments.length > 0
        ? player.assignments.map((assignment) => assignment.seasonTeam.publicName).join(", ")
        : undefined,
  }));

  return {
    activeSeasonName: activeSeason.name,
    teams: mappedTeams,
    assignments: mappedAssignments,
    playerOptions: mappedPlayerOptions,
  };
}
