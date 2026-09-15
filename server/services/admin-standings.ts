import type {
  StandingManagementRow,
  StandingManagementTable,
  StandingManagementTeam,
} from "@/lib/admin/standings-management";
import type { AuthenticatedAdmin } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";
import { normalizeOpponentName } from "@/lib/admin/opponent-management";
import {
  buildStandingTableScopeWhere,
  type StandingScopeTeamRef,
} from "@/server/services/standing-table-sharing";

export type AdminStandingsScreenData = {
  activeSeasonName: string | null;
  teams: StandingManagementTeam[];
  tables: StandingManagementTable[];
};

export type AdminScopedStandingTeam = StandingScopeTeamRef & {
  id: bigint;
  publicSlug: string;
  publicName: string;
  category: string | null;
  publicVisible: boolean;
  season: {
    name: string;
  };
  team: {
    isFirstTeam: boolean;
  };
  logoMedia: {
    publicUrl: string;
  } | null;
};

export type AdminStandingsScope = {
  activeSeason: {
    id: bigint;
    name: string;
  } | null;
  teams: AdminScopedStandingTeam[];
};

function computeGoalDifference(goalsFor: number, goalsAgainst: number) {
  return goalsFor - goalsAgainst;
}

function computeStandingPoints(won: number, drawn: number, sanctionPoints: number) {
  return won * 3 + drawn - sanctionPoints;
}

function mapUpdatedByLabel(
  updatedById: bigint | null,
  userNames: Map<string, string>,
  fallbackName?: string | null,
) {
  if (updatedById) {
    return userNames.get(updatedById.toString()) ?? "Administrador";
  }

  if (fallbackName?.trim()) {
    return fallbackName.trim();
  }

  return "Administrador";
}

export async function getAdminStandingsScope(
  _user: AuthenticatedAdmin,
): Promise<AdminStandingsScope> {
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
    orderBy: [
      { displayOrder: "asc" },
      {
        team: {
          isFirstTeam: "desc",
        },
      },
      { publicName: "asc" },
    ],
    select: {
      id: true,
      publicSlug: true,
      publicName: true,
      category: true,
      competitionId: true,
      competitionName: true,
      publicVisible: true,
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
      logoMedia: {
        select: {
          publicUrl: true,
        },
      },
    },
  });

  return {
    activeSeason,
    teams,
  };
}

export async function getAdminStandingsScreenData(
  user: AuthenticatedAdmin,
): Promise<AdminStandingsScreenData> {
  const { activeSeason, teams } = await getAdminStandingsScope(user);

  if (!activeSeason) {
    return {
      activeSeasonName: null,
      teams: [],
      tables: [],
    };
  }

  const standings = await prisma.standingTable.findMany({
    where: buildStandingTableScopeWhere(activeSeason.id, teams),
    orderBy: [
      {
        seasonTeam: {
          displayOrder: "asc",
        },
      },
      { updatedAt: "desc" },
      { id: "desc" },
    ],
    select: {
      id: true,
      title: true,
      sourceLabel: true,
      publicVisible: true,
      updatedAt: true,
      updatedById: true,
      competitionId: true,
      competition: {
        select: {
          name: true,
        },
      },
      seasonTeam: {
        select: {
          id: true,
          publicSlug: true,
          publicName: true,
          category: true,
          competitionName: true,
          logoMedia: {
            select: {
              publicUrl: true,
            },
          },
        },
      },
      rows: {
        orderBy: [{ displayOrder: "asc" }, { position: "asc" }, { id: "asc" }],
        select: {
          id: true,
          opponentId: true,
          position: true,
          teamName: true,
          played: true,
          won: true,
          drawn: true,
          lost: true,
          goalsFor: true,
          goalsAgainst: true,
          points: true,
          isOwnTeam: true,
          opponent: {
            select: {
              logoMedia: { select: { publicUrl: true } },
            },
          },
        },
      },
    },
  });

  const updatedByIds = Array.from(
    new Set(
      standings
        .map((standing) => standing.updatedById)
        .filter((value): value is bigint => value !== null),
    ),
  );

  const competitionIds = Array.from(
    new Set(
      standings
        .map((standing) => standing.competitionId)
        .filter((value): value is bigint => value !== null),
    ),
  );
  const opponents =
    competitionIds.length > 0
      ? await prisma.opponent.findMany({
          where: {
            competitionId: { in: competitionIds },
            active: true,
            deletedAt: null,
          },
          orderBy: [{ name: "asc" }],
          select: {
            id: true,
            competitionId: true,
            name: true,
            logoMedia: { select: { publicUrl: true } },
          },
        })
      : [];
  const opponentsByCompetition = new Map<string, typeof opponents>();

  for (const opponent of opponents) {
    const key = opponent.competitionId.toString();
    opponentsByCompetition.set(key, [
      ...(opponentsByCompetition.get(key) ?? []),
      opponent,
    ]);
  }

  const updatedByUsers =
    updatedByIds.length > 0
      ? await prisma.user.findMany({
          where: {
            id: {
              in: updatedByIds,
            },
          },
          select: {
            id: true,
            displayName: true,
          },
        })
      : [];

  const updatedByNameMap = new Map(
    updatedByUsers.map((item) => [item.id.toString(), item.displayName]),
  );
  const teamMap = new Map(teams.map((team) => [team.id.toString(), team]));
  const teamByNameMap = new Map(
    teams.map((team) => [team.publicName.trim().toLowerCase(), team]),
  );

  const mappedTeams: StandingManagementTeam[] = teams.map((team) => ({
    id: team.id.toString(),
    slug: team.publicSlug,
    name: team.publicName,
    season: team.season.name,
    competition: team.competitionName ?? "Competicion pendiente",
    category: team.category ?? (team.team.isFirstTeam ? "Senior" : "Cantera"),
    isFirstTeam: team.team.isFirstTeam,
    crestSrc: team.logoMedia?.publicUrl ?? undefined,
  }));

  const mappedTables: StandingManagementTable[] = standings.map((standing) => {
    const ownTeam = teamMap.get(standing.seasonTeam.id.toString());
    const ownTeamSlug = ownTeam?.publicSlug ?? standing.seasonTeam.publicSlug;
    const ownTeamCrest =
      ownTeam?.logoMedia?.publicUrl ?? standing.seasonTeam.logoMedia?.publicUrl ?? undefined;

    const persistedRows: StandingManagementRow[] = standing.rows.map((row) => {
      const sanctionPoints = Math.max(row.won * 3 + row.drawn - row.points, 0);
      const matchedTeam =
        row.isOwnTeam
          ? teamByNameMap.get(row.teamName.trim().toLowerCase()) ?? ownTeam
          : undefined;

      return {
        id: row.id.toString(),
        position: row.position,
        teamName: row.teamName,
        teamSlug: row.isOwnTeam ? matchedTeam?.publicSlug ?? ownTeamSlug : undefined,
        crestSrc:
          row.isOwnTeam
            ? matchedTeam?.logoMedia?.publicUrl ?? ownTeamCrest
            : row.opponent?.logoMedia?.publicUrl ?? undefined,
        played: row.played,
        won: row.won,
        drawn: row.drawn,
        lost: row.lost,
        sanctionPoints,
        goalsFor: row.goalsFor,
        goalsAgainst: row.goalsAgainst,
        goalDifference: computeGoalDifference(row.goalsFor, row.goalsAgainst),
        points: computeStandingPoints(row.won, row.drawn, sanctionPoints),
        isOwnTeam: row.isOwnTeam,
      };
    });
    const persistedOpponentIds = new Set(
      standing.rows
        .map((row) => row.opponentId?.toString())
        .filter((value): value is string => Boolean(value)),
    );
    const persistedExternalNames = new Set(
      standing.rows
        .filter((row) => !row.isOwnTeam)
        .map((row) => normalizeOpponentName(row.teamName)),
    );
    const catalogOpponents = standing.competitionId
      ? opponentsByCompetition.get(standing.competitionId.toString()) ?? []
      : [];
    const missingOpponents = catalogOpponents.filter(
      (opponent) =>
        !persistedOpponentIds.has(opponent.id.toString()) &&
        !persistedExternalNames.has(normalizeOpponentName(opponent.name)),
    );
    const rows: StandingManagementRow[] = [
      ...persistedRows,
      ...missingOpponents.map((opponent, index) => ({
        id: `catalog-opponent-${opponent.id.toString()}`,
        position: persistedRows.length + index + 1,
        teamName: opponent.name,
        crestSrc: opponent.logoMedia?.publicUrl ?? undefined,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        sanctionPoints: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0,
        isOwnTeam: false,
      })),
    ];

    return {
      id: standing.id.toString(),
      season: activeSeason.name,
      teamId: standing.seasonTeam.id.toString(),
      teamSlug: standing.seasonTeam.publicSlug,
      teamName: standing.seasonTeam.publicName,
      competition:
        standing.competition?.name ??
        standing.seasonTeam.competitionName ??
        "Competicion pendiente",
      category:
        standing.seasonTeam.category ??
        (teamMap.get(standing.seasonTeam.id.toString())?.team.isFirstTeam
          ? "Senior"
          : "Cantera"),
      status: standing.publicVisible && missingOpponents.length === 0 ? "published" : "review",
      updatedAt: standing.updatedAt.toISOString(),
      updatedBy: mapUpdatedByLabel(
        standing.updatedById,
        updatedByNameMap,
        standing.sourceLabel,
      ),
      rows,
    };
  });

  return {
    activeSeasonName: activeSeason.name,
    teams: mappedTeams,
    tables: mappedTables,
  };
}
