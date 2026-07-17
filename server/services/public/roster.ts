import type {
  DominantFoot,
  PublicPlayerProfile,
  PublicPlayerGroup,
  PublicPlayerStats,
  PublicPlayerType,
} from "@/lib/public/player-profile-content";
import { getPublicTeamDisplayName } from "@/lib/public/team-display-name";
import { prisma } from "@/server/db/prisma";
import {
  aggregatePublicPlayerStats,
  buildPlayerName,
  inferPlayerGroup,
  inferPlayerType,
  mapCountryLabel,
  mapDominantFoot,
  mapPositionLabel,
} from "@/server/services/public/player-mappers";

export type PublicRosterPlayerCard = PublicPlayerProfile & {
  dominantFoot?: DominantFoot;
  playerType: PublicPlayerType;
  group?: PublicPlayerGroup;
  stats: PublicPlayerStats;
};

export type PublicRosterContent = {
  pageTitle: string;
  teamSlug: string;
  teamLabel: string;
  seasonLabel: string;
  goalkeepers: PublicRosterPlayerCard[];
  fieldPlayers: PublicRosterPlayerCard[];
};

export async function getPublicRosterContentFromDb(
  teamSlug: string,
): Promise<PublicRosterContent | null> {
  try {
    const siteSettings = await prisma.siteSettings.findFirst({
      orderBy: { updatedAt: "desc" },
      select: {
        shopUrl: true,
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
                season: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
                team: {
                  select: {
                    isFirstTeam: true,
                  },
                },
                assignments: {
                  where: {
                    active: true,
                    deletedAt: null,
                  },
                  orderBy: [{ displayOrder: "asc" }, { shirtNumber: "asc" }, { id: "asc" }],
                  select: {
                    shirtNumber: true,
                    position: true,
                    player: {
                      select: {
                        id: true,
                        slug: true,
                        firstName: true,
                        lastName: true,
                        publicName: true,
                        countryCode: true,
                        preferredFoot: true,
                        photoMedia: {
                          select: {
                            publicUrl: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    const seasonTeam = siteSettings?.activeSeason?.seasonTeams[0];

    if (!seasonTeam) {
      return null;
    }

    const teamDisplayName = getPublicTeamDisplayName(
      seasonTeam.publicName,
      seasonTeam.team.isFirstTeam,
    );

    const playerIds = seasonTeam.assignments.map((assignment) => assignment.player.id);

    const statRows =
      playerIds.length > 0
        ? await prisma.playerMatchStats.findMany({
            where: {
              seasonTeamId: seasonTeam.id,
              seasonId: seasonTeam.season.id,
              playerId: {
                in: playerIds,
              },
            },
            select: {
              playerId: true,
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

    const statMap = new Map<bigint, typeof statRows>();

    for (const row of statRows) {
      const currentRows = statMap.get(row.playerId) ?? [];
      currentRows.push(row);
      statMap.set(row.playerId, currentRows);
    }

    const allPlayers: PublicRosterPlayerCard[] = seasonTeam.assignments.map((assignment) => {
      const playerType = inferPlayerType(assignment.position);
      const positionLabel = mapPositionLabel(assignment.position);
      const displayName = buildPlayerName(assignment.player);

      return {
        id: assignment.player.id.toString(),
        slug: assignment.player.slug,
        displayName: assignment.player.publicName?.trim() || undefined,
        firstName: assignment.player.firstName,
        lastName: assignment.player.lastName,
        name: displayName,
        number: assignment.shirtNumber ?? 0,
        country: mapCountryLabel(assignment.player.countryCode),
        countryFlag: assignment.player.countryCode ?? undefined,
        position: positionLabel,
        dominantFoot: mapDominantFoot(assignment.player.preferredFoot),
        imageUrl: assignment.player.photoMedia?.publicUrl ?? undefined,
        playerType,
        group: playerType === "field" ? inferPlayerGroup(positionLabel) : undefined,
        teamType: seasonTeam.team.isFirstTeam ? "first-team" : "academy",
        statsLevel: seasonTeam.team.isFirstTeam ? "advanced" : "basic",
        teamSlug: seasonTeam.publicSlug,
        teamLabel: teamDisplayName,
        seasonLabel: seasonTeam.season.name,
        shopHref: seasonTeam.team.isFirstTeam ? siteSettings?.shopUrl ?? undefined : undefined,
        stats: aggregatePublicPlayerStats(statMap.get(assignment.player.id) ?? []),
      };
    });

    return {
      pageTitle: seasonTeam.team.isFirstTeam
        ? "Plantilla - Primer Equipo"
        : `Plantilla - ${teamDisplayName}`,
      teamSlug: seasonTeam.publicSlug,
      teamLabel: teamDisplayName,
      seasonLabel: seasonTeam.season.name,
      goalkeepers: allPlayers.filter((player) => player.playerType === "goalkeeper"),
      fieldPlayers: allPlayers.filter((player) => player.playerType === "field"),
    };
  } catch {
    return null;
  }
}
