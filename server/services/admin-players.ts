import { UserRole } from "@prisma/client";
import type { AdminManagedPlayer } from "@/lib/admin/player-management";
import {
  normalizeAdminPlayerPosition,
  normalizeEditableFoot,
} from "@/lib/admin/player-management";
import type { AuthenticatedAdmin } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";
import {
  COUNTRY_LABELS,
  aggregatePublicPlayerStats,
  buildPlayerName,
} from "@/server/services/public/player-mappers";

export type AdminPlayersScreenData = {
  activeSeasonName: string | null;
  players: AdminManagedPlayer[];
  teams: Array<{ slug: string; name: string }>;
  countryOptions: Array<{ value: string; label: string }>;
};

type ScopedAssignment = {
  id: bigint;
  playerId: bigint;
  shirtNumber: number | null;
  position: string | null;
  seasonTeam: {
    id: bigint;
    publicSlug: string;
    publicName: string;
    season: {
      name: string;
    };
    team: {
      isFirstTeam: boolean;
    };
  };
  player: {
    id: bigint;
    firstName: string;
    lastName: string;
    publicName: string | null;
    slug: string;
    countryCode: string | null;
    preferredFoot: string | null;
    publicVisible: boolean;
    active: boolean;
    photoMedia: {
      publicUrl: string;
    } | null;
  };
};

function buildCountryOptions(players: AdminManagedPlayer[]) {
  return Array.from(
    new Map(
      players
        .map((player) => player.country.trim().toUpperCase())
        .filter(Boolean)
        .map((countryCode) => [
          countryCode,
          {
            value: countryCode,
            label: COUNTRY_LABELS[countryCode] ?? countryCode,
          },
        ]),
    ).values(),
  ).sort((left, right) => left.label.localeCompare(right.label, "es"));
}

export async function getAdminPlayersScreenData(
  user: AuthenticatedAdmin,
): Promise<AdminPlayersScreenData> {
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
          seasonTeams: {
            where: {
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

  const activeSeason = siteSettings?.activeSeason ?? null;

  if (!activeSeason) {
    return {
      activeSeasonName: null,
      players: [],
      teams: [],
      countryOptions: [],
    };
  }

  const primaryAssignments = await prisma.teamPlayerAssignment.findMany({
    where: {
      seasonId: activeSeason.id,
      active: true,
      deletedAt: null,
      ...(user.role === UserRole.COACH
        ? {
            seasonTeamId: {
              in: scopedTeamIds.length > 0 ? scopedTeamIds : [BigInt(-1)],
            },
          }
        : {}),
    },
    orderBy: [
      { isPrimary: "desc" },
      { displayOrder: "asc" },
      { shirtNumber: "asc" },
      { id: "asc" },
    ],
    select: {
      id: true,
      playerId: true,
      shirtNumber: true,
      position: true,
      seasonTeam: {
        select: {
          id: true,
          publicSlug: true,
          publicName: true,
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
      player: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          publicName: true,
          slug: true,
          countryCode: true,
          preferredFoot: true,
          publicVisible: true,
          active: true,
          photoMedia: {
            select: {
              publicUrl: true,
            },
          },
        },
      },
    },
  });

  const uniqueAssignments = Array.from(
    new Map(primaryAssignments.map((assignment) => [assignment.playerId.toString(), assignment])).values(),
  ) as ScopedAssignment[];

  const playerIds = uniqueAssignments.map((assignment) => assignment.playerId);
  const seasonTeamIds = Array.from(
    new Set(uniqueAssignments.map((assignment) => assignment.seasonTeam.id.toString())),
  ).map((value) => BigInt(value));

  const statRows =
    playerIds.length > 0
      ? await prisma.playerMatchStats.findMany({
          where: {
            seasonId: activeSeason.id,
            playerId: {
              in: playerIds,
            },
            seasonTeamId: {
              in: seasonTeamIds,
            },
          },
          select: {
            playerId: true,
            seasonTeamId: true,
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
          },
        })
      : [];

  const statsMap = new Map<string, typeof statRows>();

  for (const row of statRows) {
    const key = `${row.playerId.toString()}:${row.seasonTeamId.toString()}`;
    const currentRows = statsMap.get(key) ?? [];
    currentRows.push(row);
    statsMap.set(key, currentRows);
  }

  const players: AdminManagedPlayer[] = uniqueAssignments.map((assignment) => {
    const stats = aggregatePublicPlayerStats(
      statsMap.get(`${assignment.playerId.toString()}:${assignment.seasonTeam.id.toString()}`) ?? [],
    );

    return {
      id: assignment.player.id.toString(),
      publicName: buildPlayerName(assignment.player),
      slug: assignment.player.slug,
      visible: assignment.player.publicVisible,
      active: assignment.player.active,
      photoUrl: assignment.player.photoMedia?.publicUrl ?? undefined,
      teamSlug: assignment.seasonTeam.publicSlug,
      teamName: assignment.seasonTeam.publicName,
      teamType: assignment.seasonTeam.team.isFirstTeam ? "first-team" : "academy",
      season: assignment.seasonTeam.season.name,
      number: assignment.shirtNumber ?? 0,
      position: normalizeAdminPlayerPosition(assignment.position),
      foot: normalizeEditableFoot(assignment.player.preferredFoot),
      country: assignment.player.countryCode?.toUpperCase() ?? "ES",
      matchesPlayed: stats.matchesPlayed,
      goals: stats.goals ?? 0,
      assists: stats.assists ?? 0,
      yellowCards: stats.yellowCards ?? 0,
      redCards: stats.redCards ?? 0,
      mvp: stats.mvps ?? 0,
      goalsConceded: stats.goalsAgainst ?? 0,
      saves: stats.saves ?? 0,
      cleanSheets: stats.cleanSheets ?? 0,
      recoveries: stats.recoveries ?? 0,
      shots: stats.shots ?? 0,
      shotsOnTarget: stats.shotsOnTarget ?? 0,
      ownGoals: stats.ownGoals ?? 0,
    };
  });

  const countryOptions = buildCountryOptions(players);
  const defaultCountryCodes = ["ES", "PT", "AR", "BR", "MA"];

  for (const countryCode of defaultCountryCodes) {
    if (!countryOptions.some((option) => option.value === countryCode)) {
      countryOptions.push({
        value: countryCode,
        label: COUNTRY_LABELS[countryCode] ?? countryCode,
      });
    }
  }

  countryOptions.sort((left, right) => left.label.localeCompare(right.label, "es"));

  return {
    activeSeasonName: activeSeason.name,
    players: players.sort((left, right) => {
      if (left.teamType !== right.teamType) {
        return left.teamType === "first-team" ? -1 : 1;
      }

      if (left.teamName !== right.teamName) {
        return left.teamName.localeCompare(right.teamName, "es");
      }

      if (left.number !== right.number) {
        return left.number - right.number;
      }

      return left.publicName.localeCompare(right.publicName, "es");
    }),
    teams: activeSeason.seasonTeams.map((team) => ({
      slug: team.publicSlug,
      name: team.publicName,
    })),
    countryOptions,
  };
}
