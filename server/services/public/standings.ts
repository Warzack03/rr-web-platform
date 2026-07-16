import type {
  StandingRowData,
  TeamStandingsPageContent,
} from "@/lib/public/team-standings-content";
import { getTeamSectionLinks } from "@/lib/public/team-section-links";
import { prisma } from "@/server/db/prisma";
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
  }>,
  teams: StandingTeamLink[],
): StandingRowData[] {
  const teamByName = new Map(
    teams.map((team) => [normalizeTeamName(team.publicName), team.publicSlug]),
  );

  return sortRows(
    rows.map((row) => ({
      position: row.position,
      team: row.teamName,
      teamSlug: teamByName.get(normalizeTeamName(row.teamName)),
      played: row.played,
      won: row.won,
      drawn: row.drawn,
      lost: row.lost,
      goalsFor: row.goalsFor,
      goalsAgainst: row.goalsAgainst,
      goalDifference: row.goalDifference,
      points: row.points,
      isClub: row.isOwnTeam,
    })),
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
    },
  });
  const standingTable = pickBestStandingTableForTeam(standingTables, team);

  const isFirstTeam = team.team.isFirstTeam;

  return {
    slug: team.publicSlug,
    variant: isFirstTeam ? "first-team" : "academy",
    title: "Clasificacion",
    subtitle: `${team.publicName} - ${team.season.name}`,
    season: team.season.name,
    teamName: team.publicName,
    competition: standingTable?.competition?.name ?? team.competitionName ?? undefined,
    updatedAt:
      standingTable?.updatedLabel ??
      (standingTable ? formatUpdatedLabel(standingTable.updatedAt) : undefined),
    backHref: isFirstTeam ? "/primer-equipo" : `/equipos/${team.publicSlug}`,
    backLabel: isFirstTeam ? "Volver al Primer Equipo" : `Volver a ${team.publicName}`,
    navLinks: isFirstTeam
      ? getTeamSectionLinks({
          teamType: "first-team",
        })
      : getTeamSectionLinks({
          teamType: "academy",
          teamSlug: team.publicSlug,
        }),
    rows: mapStandingRows(standingTable?.rows ?? [], visibleTeams),
  };
}

export async function getFirstTeamStandingsContentFromDb(): Promise<TeamStandingsPageContent | null> {
  try {
    const content = await buildStandingsPageContentFromDb("primer-equipo");

    if (!content || content.variant !== "first-team") {
      return null;
    }

    return content;
  } catch {
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
  } catch {
    return null;
  }
}
