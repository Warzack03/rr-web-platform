import type { Prisma } from "@prisma/client";

export type StandingScopeTeamRef = {
  id: bigint;
  publicName: string;
  competitionId: bigint | null;
  competitionName: string | null;
};

type StandingTableCoverageCandidate = {
  seasonTeamId: bigint;
  competitionId: bigint | null;
  seasonTeam: {
    competitionName: string | null;
  };
};

type StandingRowCandidate = {
  teamName: string;
  isOwnTeam: boolean;
};

export function buildStandingTableScopeWhere(
  seasonId: bigint,
  teams: StandingScopeTeamRef[],
  options?: {
    publicVisible?: boolean;
  },
): Prisma.StandingTableWhereInput {
  const teamIds = teams.map((team) => team.id);
  const competitionIds = Array.from(
    new Set(
      teams
        .map((team) => team.competitionId)
        .filter((competitionId): competitionId is bigint => competitionId !== null),
    ),
  );
  const competitionNames = Array.from(
    new Set(
      teams
        .map((team) => team.competitionName?.trim())
        .filter((competitionName): competitionName is string => Boolean(competitionName)),
    ),
  );

  const orWhere: Prisma.StandingTableWhereInput[] = [];

  if (teamIds.length > 0) {
    orWhere.push({
      seasonTeamId: {
        in: teamIds,
      },
    });
  }

  if (competitionIds.length > 0) {
    orWhere.push({
      competitionId: {
        in: competitionIds,
      },
    });
  }

  if (competitionNames.length > 0) {
    orWhere.push({
      competitionId: null,
      seasonTeam: {
        competitionName: {
          in: competitionNames,
        },
      },
    });
  }

  return {
    seasonId,
    deletedAt: null,
    ...(options?.publicVisible === undefined
      ? {}
      : {
          publicVisible: options.publicVisible,
        }),
    ...(orWhere.length > 0
      ? {
          OR: orWhere,
        }
      : {
          id: BigInt(-1),
        }),
  };
}

export function standingTableCoversTeam(
  table: StandingTableCoverageCandidate,
  team: StandingScopeTeamRef,
) {
  if (table.seasonTeamId === team.id) {
    return true;
  }

  if (table.competitionId && team.competitionId) {
    return table.competitionId === team.competitionId;
  }

  const tableCompetitionName = table.seasonTeam.competitionName?.trim().toLowerCase();
  const teamCompetitionName = team.competitionName?.trim().toLowerCase();

  if (!tableCompetitionName || !teamCompetitionName) {
    return false;
  }

  return tableCompetitionName === teamCompetitionName;
}

export function pickBestStandingTableForTeam<T extends StandingTableCoverageCandidate>(
  tables: T[],
  team: StandingScopeTeamRef,
): T | null {
  if (tables.length === 0) {
    return null;
  }

  const exactMatch = tables.find((table) => table.seasonTeamId === team.id);

  if (exactMatch) {
    return exactMatch;
  }

  const sharedCompetitionMatch = tables.find((table) => standingTableCoversTeam(table, team));

  return sharedCompetitionMatch ?? null;
}

export function findOwnStandingRowForTeam<T extends StandingRowCandidate>(
  rows: T[],
  teamPublicName: string,
): T | null {
  const normalizedTeamName = teamPublicName.trim().toLowerCase();
  const ownRows = rows.filter((row) => row.isOwnTeam);
  const exactOwnRow = ownRows.find(
    (row) => row.teamName.trim().toLowerCase() === normalizedTeamName,
  );

  if (exactOwnRow) {
    return exactOwnRow;
  }

  return ownRows[0] ?? rows[0] ?? null;
}
