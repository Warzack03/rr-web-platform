import type {
  StandingRowData,
  TeamStandingsPageContent,
} from "@/lib/contracts/public";
import { getTeamSectionLinks } from "@/lib/public/team-section-links";
import { getPublicTeamDisplayName } from "@/lib/public/team-display-name";
import { prisma } from "@/server/db/prisma";
import { logServerError } from "@/server/logging/safe-server-log";
import {
  buildStandingTableScopeWhere,
  pickBestStandingTableForTeam,
} from "@/server/services/standing-table-sharing";

type DbSeasonTeam = {
  id: bigint;
  publicName: string;
  publicSlug: string;
  competitionId: bigint | null;
  competitionName: string | null;
  competitions: Array<{
    competitionId: bigint;
    isPrimary: boolean;
    active: boolean;
    publicVisible: boolean;
    displayOrder: number;
    competition: { name: string };
  }>;
  logoMedia: {
    publicUrl: string;
    altText: string | null;
  } | null;
  season: {
    id: bigint;
    name: string;
  };
  team: {
    isFirstTeam: boolean;
  };
};

type StandingTeamLink = {
  publicName: string;
  publicSlug: string;
  team: {
    isFirstTeam: boolean;
  };
  logoMedia: {
    publicUrl: string;
    altText: string | null;
  } | null;
};

function formatUpdatedLabel(date: Date) {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Europe/Madrid",
  })
    .format(date)
    .replace(".", "");
}

function sortRows(rows: StandingRowData[]) {
  return [...rows].sort((left, right) => left.position - right.position);
}

function mapStandingRows(
  rows: Array<{
    position: number;
    teamName: string;
    played: number;
    won: number;
    drawn: number;
    lost: number;
    goalsFor: number;
    goalsAgainst: number;
    goalDifference: number;
    points: number;
    isOwnTeam: boolean;
    opponent: {
      logoMedia: {
        publicUrl: string;
        altText: string | null;
      } | null;
    } | null;
  }>,
  teams: StandingTeamLink[],
): StandingRowData[] {
  const teamByName = new Map(
    teams.map((team) => [normalizeTeamName(team.publicName), team]),
  );

  return sortRows(
    rows.map((row) => {
      const linkedTeam = teamByName.get(normalizeTeamName(row.teamName));
      const opponentLogo = row.opponent?.logoMedia;

      return {
        position: row.position,
        team: linkedTeam
          ? getPublicTeamDisplayName(linkedTeam.publicName, linkedTeam.team.isFirstTeam)
          : row.teamName,
        teamSlug: linkedTeam?.publicSlug,
        logoUrl: linkedTeam?.logoMedia?.publicUrl ?? opponentLogo?.publicUrl,
        logoAlt:
          linkedTeam?.logoMedia?.altText ??
          opponentLogo?.altText ??
          `Escudo ${
            linkedTeam
              ? getPublicTeamDisplayName(linkedTeam.publicName, linkedTeam.team.isFirstTeam)
              : row.teamName
          }`,
        played: row.played,
        won: row.won,
        drawn: row.drawn,
        lost: row.lost,
        goalsFor: row.goalsFor,
        goalsAgainst: row.goalsAgainst,
        goalDifference: row.goalDifference,
        points: row.points,
        isClub: row.isOwnTeam,
      };
    }),
  );
}

function normalizeTeamName(teamName: string) {
  return teamName.trim().toLowerCase();
}

async function getActiveVisibleSeasonTeamBySlug(
  teamSlug: string,
): Promise<DbSeasonTeam | null> {
  const siteSettings = await prisma.siteSettings.findFirst({
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
              competitionId: true,
              competitionName: true,
              competitions: {
                where: { active: true, publicVisible: true },
                orderBy: [{ isPrimary: "desc" }, { displayOrder: "asc" }, { id: "asc" }],
                select: {
                  competitionId: true,
                  isPrimary: true,
                  active: true,
                  publicVisible: true,
                  displayOrder: true,
                  competition: { select: { name: true } },
                },
              },
              logoMedia: {
                select: { publicUrl: true, altText: true },
              },
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
            },
          },
        },
      },
    },
  });

  return siteSettings?.activeSeason?.seasonTeams[0] ?? null;
}

async function buildStandingsPageContentFromDb(
  teamSlug: string,
): Promise<TeamStandingsPageContent | null> {
  const team = await getActiveVisibleSeasonTeamBySlug(teamSlug);

  if (!team) {
    return null;
  }

  const standingTables = await prisma.standingTable.findMany({
    where: buildStandingTableScopeWhere(team.season.id, [team], {
      publicVisible: true,
    }),
    orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
    select: {
      id: true,
      seasonTeamId: true,
      competitionId: true,
      seasonTeam: {
        select: {
          competitionName: true,
        },
      },
      title: true,
      updatedLabel: true,
      updatedAt: true,
      competition: {
        select: {
          name: true,
        },
      },
      rows: {
        orderBy: [{ displayOrder: "asc" }, { position: "asc" }, { id: "asc" }],
        select: {
          position: true,
          teamName: true,
          played: true,
          won: true,
          drawn: true,
          lost: true,
          goalsFor: true,
          goalsAgainst: true,
          goalDifference: true,
          points: true,
          isOwnTeam: true,
          opponent: {
            select: {
              logoMedia: {
                select: { publicUrl: true, altText: true },
              },
            },
          },
        },
      },
    },
  });
  const visibleTeams = await prisma.seasonTeam.findMany({
    where: {
      seasonId: team.season.id,
      active: true,
      publicVisible: true,
      deletedAt: null,
    },
    select: {
      publicName: true,
      publicSlug: true,
      team: {
        select: {
          isFirstTeam: true,
        },
      },
      logoMedia: {
        select: {
          publicUrl: true,
          altText: true,
        },
      },
    },
  });
  const primaryCompetitionId =
    team.competitions.find((participation) => participation.isPrimary)?.competitionId ??
    team.competitions[0]?.competitionId ??
    team.competitionId;
  const standingTable =
    standingTables.find((table) => table.competitionId === primaryCompetitionId) ??
    pickBestStandingTableForTeam(standingTables, team);
  const participationOrder = new Map(
    team.competitions.map((participation, index) => [
      participation.competitionId.toString(),
      participation.isPrimary ? -1 : participation.displayOrder || index,
    ]),
  );
  const tables = standingTables
    .filter((table) => table.rows.length > 0)
    .sort((left, right) => {
      const leftOrder = left.competitionId
        ? participationOrder.get(left.competitionId.toString()) ?? Number.MAX_SAFE_INTEGER
        : Number.MAX_SAFE_INTEGER;
      const rightOrder = right.competitionId
        ? participationOrder.get(right.competitionId.toString()) ?? Number.MAX_SAFE_INTEGER
        : Number.MAX_SAFE_INTEGER;
      return leftOrder - rightOrder;
    })
    .map((table) => ({
      id: table.id.toString(),
      competition:
        table.competition?.name ?? table.seasonTeam.competitionName ?? "Competicion pendiente",
      updatedAt: table.updatedLabel ?? formatUpdatedLabel(table.updatedAt),
      rows: mapStandingRows(table.rows, visibleTeams),
    }));

  const isFirstTeam = team.team.isFirstTeam;
  const teamDisplayName = getPublicTeamDisplayName(team.publicName, isFirstTeam);

  return {
    slug: team.publicSlug,
    variant: isFirstTeam ? "first-team" : "academy",
    title: "Clasificacion",
    subtitle: `${teamDisplayName} - ${team.season.name}`,
    season: team.season.name,
    teamName: teamDisplayName,
    teamLogoUrl: team.logoMedia?.publicUrl,
    teamLogoAlt: team.logoMedia?.altText ?? `Escudo ${teamDisplayName}`,
    competition: standingTable?.competition?.name ?? team.competitionName ?? undefined,
    updatedAt:
      standingTable?.updatedLabel ??
      (standingTable ? formatUpdatedLabel(standingTable.updatedAt) : undefined),
    backHref: isFirstTeam ? "/primer-equipo" : `/equipos/${team.publicSlug}`,
    backLabel: isFirstTeam ? "Volver a Rising Raimon A" : `Volver a ${teamDisplayName}`,
    navLinks: isFirstTeam
      ? getTeamSectionLinks({
          teamType: "first-team",
          hasMultipleStandings: tables.length > 1,
        })
      : getTeamSectionLinks({
          teamType: "academy",
          teamSlug: team.publicSlug,
          hasMultipleStandings: tables.length > 1,
        }),
    rows: mapStandingRows(standingTable?.rows ?? [], visibleTeams),
    tables,
  };
}

export async function getFirstTeamStandingsContentFromDb(): Promise<TeamStandingsPageContent | null> {
  try {
    const content = await buildStandingsPageContentFromDb("primer-equipo");

    if (!content || content.variant !== "first-team") {
      return null;
    }

    return content;
  } catch (error) {
    logServerError("public.standings.firstTeam", error);
    return null;
  }
}

export async function getAcademyTeamStandingsContentFromDb(
  teamSlug: string,
): Promise<TeamStandingsPageContent | null> {
  try {
    const content = await buildStandingsPageContentFromDb(teamSlug);

    if (!content || content.variant !== "academy") {
      return null;
    }

    return content;
  } catch (error) {
    logServerError("public.standings.academyTeam", error, { teamSlug });
    return null;
  }
}
