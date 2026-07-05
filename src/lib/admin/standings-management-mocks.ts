import { adminMockSeasons } from "@/lib/admin/mock-data";
import type { AdminRole } from "@/lib/admin/roles";
import { adminTeamManagementTeams } from "@/lib/admin/team-management-mocks";

export type StandingPublicationStatus = "draft" | "published" | "review";

export type StandingManagementTeam = {
  id: string;
  slug: string;
  name: string;
  season: string;
  competition: string;
  category: string;
  isFirstTeam: boolean;
  crestSrc?: string;
};

export type StandingManagementRow = {
  id: string;
  position: number;
  teamName: string;
  teamSlug?: string;
  crestSrc?: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  sanctionPoints: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  isOwnTeam: boolean;
};

export type StandingManagementTable = {
  id: string;
  season: string;
  teamId: string;
  teamSlug: string;
  teamName: string;
  competition: string;
  category: string;
  status: StandingPublicationStatus;
  updatedAt: string;
  updatedBy: string;
  rows: StandingManagementRow[];
};

const managedTeamSlugs = new Set([
  "primer-equipo",
  "raimon-b",
  "juvenil-a",
  "cadete-a",
]);

const teamOrderMap = new Map(
  adminTeamManagementTeams.map((team, index) => [team.slug, index]),
);

const seasonOrderMap = new Map(
  adminMockSeasons.map((season, index) => [season.name, index]),
);

export const standingsManagementTeams: StandingManagementTeam[] = adminTeamManagementTeams
  .filter((team) => managedTeamSlugs.has(team.slug))
  .map((team) => ({
    id: team.id,
    slug: team.slug,
    name: team.name,
    season: team.season,
    competition: team.competition,
    category: team.category,
    isFirstTeam: team.isFirstTeam,
    crestSrc: team.logoUrl,
  }));

export const coachPreviewStandingTeamSlugs = ["raimon-b", "juvenil-a"] as const;

const coachPreviewTeams = standingsManagementTeams.filter((team) =>
  coachPreviewStandingTeamSlugs.includes(
    team.slug as (typeof coachPreviewStandingTeamSlugs)[number],
  ),
);

const teamBySlug = new Map(
  standingsManagementTeams.map((team) => [team.slug, team]),
);

function toSafeInt(value: number, minimum = 0) {
  if (!Number.isFinite(value)) {
    return minimum;
  }

  return Math.max(minimum, Math.trunc(value));
}

function computeGoalDifference(goalsFor: number, goalsAgainst: number) {
  return toSafeInt(goalsFor) - toSafeInt(goalsAgainst);
}

function computeStandingPoints(won: number, drawn: number, sanctionPoints: number) {
  return toSafeInt(won) * 3 + toSafeInt(drawn) - toSafeInt(sanctionPoints);
}

function sanitizeStandingRow(
  row: StandingManagementRow,
  index: number,
): StandingManagementRow {
  const teamName = row.teamName.trim();
  const played = toSafeInt(row.played);
  const won = toSafeInt(row.won);
  const drawn = toSafeInt(row.drawn);
  const lost = toSafeInt(row.lost);
  const sanctionPoints = toSafeInt(row.sanctionPoints);
  const goalsFor = toSafeInt(row.goalsFor);
  const goalsAgainst = toSafeInt(row.goalsAgainst);

  return {
    ...row,
    position: index + 1,
    teamName,
    teamSlug: row.teamSlug?.trim() || undefined,
    crestSrc: row.crestSrc?.trim() || undefined,
    played,
    won,
    drawn,
    lost,
    sanctionPoints,
    goalsFor,
    goalsAgainst,
    goalDifference: computeGoalDifference(goalsFor, goalsAgainst),
    points: computeStandingPoints(won, drawn, sanctionPoints),
    isOwnTeam: Boolean(row.isOwnTeam),
  };
}

export function normalizeStandingRows(rows: StandingManagementRow[]) {
  return rows.map((row, index) => sanitizeStandingRow(row, index));
}

export function normalizeAndSortStandingRows(rows: StandingManagementRow[]) {
  return normalizeStandingRows(rows)
    .sort((left, right) => {
      if (left.points !== right.points) {
        return right.points - left.points;
      }

      if (left.goalDifference !== right.goalDifference) {
        return right.goalDifference - left.goalDifference;
      }

      if (left.goalsFor !== right.goalsFor) {
        return right.goalsFor - left.goalsFor;
      }

      if (left.goalsAgainst !== right.goalsAgainst) {
        return left.goalsAgainst - right.goalsAgainst;
      }

      return left.teamName.localeCompare(right.teamName, "es");
    })
    .map((row, index) => ({
      ...row,
      position: index + 1,
    }));
}

export function normalizeStandingTable(
  table: StandingManagementTable,
): StandingManagementTable {
  return {
    ...table,
    rows: normalizeStandingRows(table.rows),
  };
}

function createStandingRow(
  row: Omit<StandingManagementRow, "id" | "goalDifference"> & {
    id?: string;
    goalDifference?: number;
  },
  index: number,
): StandingManagementRow {
  return {
    id: row.id ?? `standing-row-${index + 1}-${row.teamName.toLowerCase().replace(/\s+/g, "-")}`,
    position: row.position,
    teamName: row.teamName,
    teamSlug: row.teamSlug,
    crestSrc: row.crestSrc,
    played: row.played,
    won: row.won,
    drawn: row.drawn,
    lost: row.lost,
    sanctionPoints: row.sanctionPoints,
    goalsFor: row.goalsFor,
    goalsAgainst: row.goalsAgainst,
    goalDifference:
      row.goalDifference ?? computeGoalDifference(row.goalsFor, row.goalsAgainst),
    points: row.points,
    isOwnTeam: row.isOwnTeam,
  };
}

function createStandingTable(
  table: Omit<
    StandingManagementTable,
    "teamId" | "teamName" | "category" | "rows"
  > & {
    teamSlug: string;
    rows: Array<
      Omit<StandingManagementRow, "id" | "goalDifference"> & {
        id?: string;
        goalDifference?: number;
      }
    >;
  },
) {
  const team = teamBySlug.get(table.teamSlug);

  if (!team) {
    throw new Error(`Unknown standings team: ${table.teamSlug}`);
  }

  return normalizeStandingTable({
    ...table,
    teamId: team.id,
    teamName: team.name,
    category: team.category,
    rows: table.rows.map((row, index) =>
      createStandingRow(
        row.isOwnTeam
          ? {
              ...row,
              teamSlug: row.teamSlug ?? team.slug,
              crestSrc: row.crestSrc ?? team.crestSrc,
            }
          : row,
        index,
      ),
    ),
  });
}

const standingsManagementTables: StandingManagementTable[] = [
  createStandingTable({
    id: "standing-primer-equipo-2026",
    season: "2026/2027",
    teamSlug: "primer-equipo",
    competition: "Liga Autonomica Senior - Grupo 2",
    status: "published",
    updatedAt: "2026-06-10T09:15:00.000Z",
    updatedBy: "Manager Demo",
    rows: [
      {
        position: 1,
        teamName: "Rising Raimon",
        played: 27,
        won: 21,
        drawn: 3,
        lost: 3,
        sanctionPoints: 0,
        goalsFor: 58,
        goalsAgainst: 21,
        points: 66,
        isOwnTeam: true,
      },
      {
        position: 2,
        teamName: "Union Deportiva Vallecas",
        played: 27,
        won: 19,
        drawn: 4,
        lost: 4,
        sanctionPoints: 0,
        goalsFor: 49,
        goalsAgainst: 25,
        points: 61,
        isOwnTeam: false,
      },
      {
        position: 3,
        teamName: "CD Hortaleza",
        played: 27,
        won: 18,
        drawn: 5,
        lost: 4,
        sanctionPoints: 0,
        goalsFor: 46,
        goalsAgainst: 28,
        points: 59,
        isOwnTeam: false,
      },
      {
        position: 4,
        teamName: "Escuela Sur Madrid",
        played: 27,
        won: 15,
        drawn: 6,
        lost: 6,
        sanctionPoints: 0,
        goalsFor: 44,
        goalsAgainst: 31,
        points: 51,
        isOwnTeam: false,
      },
      {
        position: 5,
        teamName: "AD Mostoles",
        played: 27,
        won: 14,
        drawn: 4,
        lost: 9,
        sanctionPoints: 0,
        goalsFor: 39,
        goalsAgainst: 34,
        points: 46,
        isOwnTeam: false,
      },
    ],
  }),
  createStandingTable({
    id: "standing-raimon-b-2026",
    season: "2026/2027",
    teamSlug: "raimon-b",
    competition: "Liga Regional Preferente",
    status: "published",
    updatedAt: "2026-06-09T19:40:00.000Z",
    updatedBy: "Sergio Mena",
    rows: [
      {
        position: 1,
        teamName: "Outeiro FC",
        played: 15,
        won: 11,
        drawn: 3,
        lost: 1,
        sanctionPoints: 0,
        goalsFor: 32,
        goalsAgainst: 12,
        points: 36,
        isOwnTeam: false,
      },
      {
        position: 2,
        teamName: "Vallejo Sporting",
        played: 15,
        won: 10,
        drawn: 4,
        lost: 1,
        sanctionPoints: 0,
        goalsFor: 28,
        goalsAgainst: 14,
        points: 34,
        isOwnTeam: false,
      },
      {
        position: 3,
        teamName: "Merida United",
        played: 15,
        won: 10,
        drawn: 2,
        lost: 3,
        sanctionPoints: 0,
        goalsFor: 25,
        goalsAgainst: 15,
        points: 32,
        isOwnTeam: false,
      },
      {
        position: 4,
        teamName: "Raimon B",
        played: 15,
        won: 9,
        drawn: 4,
        lost: 2,
        sanctionPoints: 0,
        goalsFor: 22,
        goalsAgainst: 11,
        points: 31,
        isOwnTeam: true,
      },
      {
        position: 5,
        teamName: "San Felipe City",
        played: 15,
        won: 8,
        drawn: 5,
        lost: 2,
        sanctionPoints: 0,
        goalsFor: 19,
        goalsAgainst: 14,
        points: 29,
        isOwnTeam: false,
      },
      {
        position: 6,
        teamName: "Athletic Club",
        played: 15,
        won: 8,
        drawn: 2,
        lost: 5,
        sanctionPoints: 0,
        goalsFor: 24,
        goalsAgainst: 20,
        points: 26,
        isOwnTeam: false,
      },
    ],
  }),
  createStandingTable({
    id: "standing-juvenil-a-2026",
    season: "2026/2027",
    teamSlug: "juvenil-a",
    competition: "Liga Juvenil Preferente",
    status: "draft",
    updatedAt: "2026-06-08T16:05:00.000Z",
    updatedBy: "Ivan Lobo",
    rows: [
      {
        position: 1,
        teamName: "EF Retiro",
        played: 20,
        won: 15,
        drawn: 3,
        lost: 2,
        sanctionPoints: 0,
        goalsFor: 42,
        goalsAgainst: 16,
        points: 48,
        isOwnTeam: false,
      },
      {
        position: 2,
        teamName: "Juvenil A",
        played: 20,
        won: 14,
        drawn: 4,
        lost: 2,
        sanctionPoints: 0,
        goalsFor: 38,
        goalsAgainst: 18,
        points: 46,
        isOwnTeam: true,
      },
      {
        position: 3,
        teamName: "Canillas Academy",
        played: 20,
        won: 13,
        drawn: 4,
        lost: 3,
        sanctionPoints: 0,
        goalsFor: 35,
        goalsAgainst: 19,
        points: 43,
        isOwnTeam: false,
      },
      {
        position: 4,
        teamName: "Atletico Este",
        played: 20,
        won: 10,
        drawn: 5,
        lost: 5,
        sanctionPoints: 0,
        goalsFor: 27,
        goalsAgainst: 21,
        points: 35,
        isOwnTeam: false,
      },
    ],
  }),
  createStandingTable({
    id: "standing-cadete-a-2026",
    season: "2026/2027",
    teamSlug: "cadete-a",
    competition: "Liga Cadete Municipal",
    status: "review",
    updatedAt: "2026-06-07T12:30:00.000Z",
    updatedBy: "Manager Demo",
    rows: [
      {
        position: 1,
        teamName: "Racing Chamberi",
        played: 18,
        won: 14,
        drawn: 2,
        lost: 2,
        sanctionPoints: 0,
        goalsFor: 41,
        goalsAgainst: 15,
        points: 44,
        isOwnTeam: false,
      },
      {
        position: 2,
        teamName: "Cadete A",
        played: 18,
        won: 13,
        drawn: 3,
        lost: 2,
        sanctionPoints: 0,
        goalsFor: 36,
        goalsAgainst: 17,
        points: 42,
        isOwnTeam: true,
      },
      {
        position: 3,
        teamName: "AD Chamberi",
        played: 18,
        won: 11,
        drawn: 4,
        lost: 3,
        sanctionPoints: 0,
        goalsFor: 29,
        goalsAgainst: 19,
        points: 37,
        isOwnTeam: false,
      },
      {
        position: 4,
        teamName: "EMF Vallecas",
        played: 18,
        won: 8,
        drawn: 5,
        lost: 5,
        sanctionPoints: 0,
        goalsFor: 24,
        goalsAgainst: 22,
        points: 29,
        isOwnTeam: false,
      },
    ],
  }),
];

export function getAllStandingsManagementTables() {
  return standingsManagementTables.map((table) =>
    normalizeStandingTable({
      ...table,
      rows: table.rows.map((row) => ({ ...row })),
    }),
  );
}

export function sortStandingsManagementTables(
  tables: StandingManagementTable[],
) {
  return [...tables].sort((left, right) => {
    const leftSeasonOrder = seasonOrderMap.get(left.season) ?? Number.MAX_SAFE_INTEGER;
    const rightSeasonOrder = seasonOrderMap.get(right.season) ?? Number.MAX_SAFE_INTEGER;

    if (leftSeasonOrder !== rightSeasonOrder) {
      return leftSeasonOrder - rightSeasonOrder;
    }

    const leftTeamOrder = teamOrderMap.get(left.teamSlug) ?? Number.MAX_SAFE_INTEGER;
    const rightTeamOrder = teamOrderMap.get(right.teamSlug) ?? Number.MAX_SAFE_INTEGER;

    if (leftTeamOrder !== rightTeamOrder) {
      return leftTeamOrder - rightTeamOrder;
    }

    return left.competition.localeCompare(right.competition);
  });
}

export function getCoachPreviewStandingTeamOptions() {
  return coachPreviewTeams.map((team) => ({
    slug: team.slug,
    name: team.name,
  }));
}

export function getResolvedStandingsCoachPreviewTeamSlug(
  preferredSlug?: string,
): string {
  return coachPreviewStandingTeamSlugs.includes(
    preferredSlug as (typeof coachPreviewStandingTeamSlugs)[number],
  )
    ? (preferredSlug as string)
    : coachPreviewStandingTeamSlugs[0];
}

export function getStandingsManagementTeamsForRole(
  role: AdminRole,
  preferredCoachTeamSlug?: string,
) {
  if (role !== "COACH") {
    return standingsManagementTeams;
  }

  const selectedCoachTeamSlug =
    getResolvedStandingsCoachPreviewTeamSlug(preferredCoachTeamSlug);

  return standingsManagementTeams.filter(
    (team) => team.slug === selectedCoachTeamSlug,
  );
}

export function getStandingsManagementTablesForRole(
  role: AdminRole,
  preferredCoachTeamSlug?: string,
) {
  const allowedTeamSlugs = new Set(
    getStandingsManagementTeamsForRole(role, preferredCoachTeamSlug).map(
      (team) => team.slug,
    ),
  );

  return sortStandingsManagementTables(
    getAllStandingsManagementTables().filter((table) =>
      allowedTeamSlugs.has(table.teamSlug),
    ),
  );
}

export function getStandingPublicHref(
  table: Pick<StandingManagementTable, "teamSlug">,
) {
  return table.teamSlug === "primer-equipo"
    ? "/primer-equipo/clasificacion"
    : `/equipos/${table.teamSlug}/clasificacion`;
}

export function formatStandingUpdatedLabel(
  table: Pick<StandingManagementTable, "updatedAt" | "updatedBy">,
) {
  const date = new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(table.updatedAt));

  return `${date} - ${table.updatedBy}`;
}

export function buildBlankStandingRows(teamName: string) {
  const team = standingsManagementTeams.find((item) => item.name === teamName);

  return normalizeStandingRows([
    {
      id: `${teamName.toLowerCase().replace(/\s+/g, "-")}-own`,
      position: 1,
      teamName,
      teamSlug: team?.slug,
      crestSrc: team?.crestSrc,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      sanctionPoints: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
      isOwnTeam: true,
    },
    {
      id: `${teamName.toLowerCase().replace(/\s+/g, "-")}-rival-1`,
      position: 2,
      teamName: "Nuevo rival 1",
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
    },
    {
      id: `${teamName.toLowerCase().replace(/\s+/g, "-")}-rival-2`,
      position: 3,
      teamName: "Nuevo rival 2",
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
    },
  ]);
}
