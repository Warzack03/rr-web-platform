import { MatchStatus } from "@prisma/client";
import type { PublicPlayerProfile } from "@/lib/public/player-profile-types";
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

type PlayerAssignmentCandidate = {
  shirtNumber: number | null;
  position: string | null;
  player: {
    id: bigint;
    slug: string;
    firstName: string;
    lastName: string;
    publicName: string | null;
    countryCode: string | null;
    preferredFoot: string | null;
    photoMedia: {
      publicUrl: string;
    } | null;
    seasonProfiles: Array<{
      publicPosition: string | null;
    }>;
  };
  seasonTeam: {
    id: bigint;
    publicName: string;
    publicSlug: string;
    season: {
      id: bigint;
      name: string;
    };
    team: {
      isFirstTeam: boolean;
    };
  };
};

type PlayerStatRow = {
  played: boolean;
  goals: number;
  assists: number;
  mvp: number;
  yellowCards: number;
  redCards: number;
  recoveries: number;
  shots: number;
  shotsOnTarget: number;
  ownGoals: number;
  saves: number;
  goalsAgainst: number;
  cleanSheets: number;
};

function buildCandidateTeamRef(candidate: PlayerAssignmentCandidate) {
  return {
    teamSlug: candidate.seasonTeam.publicSlug,
    teamLabel: getPublicTeamDisplayName(
      candidate.seasonTeam.publicName,
      candidate.seasonTeam.team.isFirstTeam,
    ),
    teamType: candidate.seasonTeam.team.isFirstTeam ? ("first-team" as const) : ("academy" as const),
  };
}

function buildGlobalTeamLabel(uniqueTeams: ReturnType<typeof buildCandidateTeamRef>[]) {
  if (uniqueTeams.length === 1) {
    return uniqueTeams[0]?.teamLabel ?? "Rising Raimon";
  }

  return `Rising Raimon | ${uniqueTeams.length} equipos`;
}

function mapCandidatesToGlobalProfile(
  candidates: PlayerAssignmentCandidate[],
  shopUrl: string | null,
  statRows: PlayerStatRow[],
): PublicPlayerProfile {
  const primaryCandidate = candidates[0]!;
  const rawPosition =
    primaryCandidate.position ?? primaryCandidate.player.seasonProfiles[0]?.publicPosition ?? null;
  const position = mapPositionLabel(rawPosition);
  const playerType = inferPlayerType(rawPosition);
  const uniqueTeams = Array.from(
    new Map(
      candidates
        .map((candidate) => buildCandidateTeamRef(candidate))
        .map((team) => [`${team.teamType}:${team.teamSlug}`, team]),
    ).values(),
  );
  const onlyFirstTeamAssignments =
    uniqueTeams.length > 0 && uniqueTeams.every((team) => team.teamType === "first-team");
  const displayName = primaryCandidate.player.publicName?.trim() || undefined;
  const visualTeamType = onlyFirstTeamAssignments ? "first-team" : "academy";

  return {
    id: primaryCandidate.player.id.toString(),
    slug: primaryCandidate.player.slug,
    displayName,
    firstName: primaryCandidate.player.firstName,
    lastName: primaryCandidate.player.lastName,
    name: buildPlayerName(primaryCandidate.player),
    number: primaryCandidate.shirtNumber ?? 0,
    country: mapCountryLabel(primaryCandidate.player.countryCode),
    countryFlag: primaryCandidate.player.countryCode ?? undefined,
    position,
    dominantFoot: mapDominantFoot(primaryCandidate.player.preferredFoot),
    imageUrl: primaryCandidate.player.photoMedia?.publicUrl ?? undefined,
    playerType,
    group: playerType === "field" ? inferPlayerGroup(position) : undefined,
    teamType: visualTeamType,
    statsLevel: onlyFirstTeamAssignments ? "advanced" : "basic",
    teamSlug: primaryCandidate.seasonTeam.publicSlug,
    teamLabel: buildGlobalTeamLabel(uniqueTeams),
    seasonLabel: primaryCandidate.seasonTeam.season.name,
    shopHref: onlyFirstTeamAssignments ? shopUrl ?? undefined : undefined,
    relatedTeams: uniqueTeams,
    stats: aggregatePublicPlayerStats(statRows),
  };
}

async function getActiveSeasonMeta() {
  const siteSettings = await prisma.siteSettings.findFirst({
    orderBy: { updatedAt: "desc" },
    select: {
      shopUrl: true,
      activeSeason: {
        select: {
          id: true,
        },
      },
    },
  });

  return {
    activeSeasonId: siteSettings?.activeSeason?.id ?? null,
    shopUrl: siteSettings?.shopUrl ?? null,
  };
}

async function getPlayerCandidatesBySlug(
  activeSeasonId: bigint,
  playerSlug: string,
): Promise<PlayerAssignmentCandidate[]> {
  const seasonTeams = await prisma.seasonTeam.findMany({
    where: {
      seasonId: activeSeasonId,
      active: true,
      publicVisible: true,
      deletedAt: null,
      assignments: {
        some: {
          active: true,
          deletedAt: null,
          player: {
            slug: playerSlug,
            active: true,
            publicVisible: true,
            deletedAt: null,
          },
        },
      },
    },
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
          player: {
            slug: playerSlug,
            active: true,
            publicVisible: true,
            deletedAt: null,
          },
        },
        orderBy: [{ isPrimary: "desc" }, { displayOrder: "asc" }, { id: "asc" }],
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
              seasonProfiles: {
                where: {
                  seasonId: activeSeasonId,
                },
                take: 1,
                select: {
                  publicPosition: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: [{ publicName: "asc" }, { id: "asc" }],
  });

  return seasonTeams
    .flatMap((seasonTeam) =>
      seasonTeam.assignments.map((assignment) => ({
        ...assignment,
        seasonTeam,
      })),
    )
    .sort((left, right) => {
      if (left.seasonTeam.team.isFirstTeam !== right.seasonTeam.team.isFirstTeam) {
        return left.seasonTeam.team.isFirstTeam ? -1 : 1;
      }

      return left.seasonTeam.publicName.localeCompare(right.seasonTeam.publicName, "es", {
        sensitivity: "base",
      });
    });
}

export async function getPublicPlayerDetailFromDb(
  playerSlug: string,
): Promise<PublicPlayerProfile | null> {
  try {
    const { activeSeasonId, shopUrl } = await getActiveSeasonMeta();

    if (!activeSeasonId) {
      return null;
    }

    const candidates = await getPlayerCandidatesBySlug(activeSeasonId, playerSlug);

    if (candidates.length === 0) {
      return null;
    }

    const statRows = await prisma.playerMatchStats.findMany({
      where: {
        seasonId: activeSeasonId,
        playerId: candidates[0].player.id,
        played: true,
        seasonTeamId: {
          in: candidates.map((candidate) => candidate.seasonTeam.id),
        },
        match: {
          status: MatchStatus.PLAYED,
          publicVisible: true,
          deletedAt: null,
        },
      },
      select: {
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
    });

    return mapCandidatesToGlobalProfile(candidates, shopUrl, statRows);
  } catch {
    return null;
  }
}

async function getPublicPlayerRouteIndexFromDb() {
  try {
    const { activeSeasonId } = await getActiveSeasonMeta();

    if (!activeSeasonId) {
      return [];
    }

    return await prisma.seasonTeam.findMany({
      where: {
        seasonId: activeSeasonId,
        active: true,
        publicVisible: true,
        deletedAt: null,
      },
      select: {
        publicSlug: true,
        team: {
          select: {
            isFirstTeam: true,
          },
        },
        assignments: {
          where: {
            active: true,
            deletedAt: null,
            player: {
              active: true,
              publicVisible: true,
              deletedAt: null,
            },
          },
          select: {
            player: {
              select: {
                slug: true,
              },
            },
          },
          orderBy: [{ displayOrder: "asc" }, { id: "asc" }],
        },
      },
      orderBy: [{ publicName: "asc" }, { id: "asc" }],
    });
  } catch {
    return [];
  }
}

export async function getFirstTeamPlayerSlugsFromDb(): Promise<string[]> {
  const seasonTeams = await getPublicPlayerRouteIndexFromDb();

  return Array.from(
    new Set(
      seasonTeams
        .filter((seasonTeam) => seasonTeam.team.isFirstTeam)
        .flatMap((seasonTeam) => seasonTeam.assignments.map((assignment) => assignment.player.slug)),
    ),
  );
}

export async function getAcademyPlayerStaticParamsFromDb(): Promise<
  Array<{
    teamSlug: string;
    playerSlug: string;
  }>
> {
  const seasonTeams = await getPublicPlayerRouteIndexFromDb();

  return Array.from(
    new Map(
      seasonTeams
        .filter((seasonTeam) => !seasonTeam.team.isFirstTeam)
        .flatMap((seasonTeam) =>
          seasonTeam.assignments.map((assignment) => ({
            teamSlug: seasonTeam.publicSlug,
            playerSlug: assignment.player.slug,
          })),
        )
        .map((param) => [`${param.teamSlug}:${param.playerSlug}`, param]),
    ).values(),
  );
}
