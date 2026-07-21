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

function toSafeInt(value: number, minimum = 0) {
  return Number.isFinite(value) ? Math.max(minimum, Math.trunc(value)) : minimum;
}

function sanitizeStandingRow(row: StandingManagementRow, index: number): StandingManagementRow {
  const won = toSafeInt(row.won);
  const drawn = toSafeInt(row.drawn);
  const goalsFor = toSafeInt(row.goalsFor);
  const goalsAgainst = toSafeInt(row.goalsAgainst);
  const sanctionPoints = toSafeInt(row.sanctionPoints);

  return {
    ...row,
    position: index + 1,
    teamName: row.teamName.trim(),
    teamSlug: row.teamSlug?.trim() || undefined,
    crestSrc: row.crestSrc?.trim() || undefined,
    played: toSafeInt(row.played),
    won,
    drawn,
    lost: toSafeInt(row.lost),
    sanctionPoints,
    goalsFor,
    goalsAgainst,
    goalDifference: goalsFor - goalsAgainst,
    points: won * 3 + drawn - sanctionPoints,
    isOwnTeam: Boolean(row.isOwnTeam),
  };
}

export function normalizeStandingRows(rows: StandingManagementRow[]) {
  return rows.map(sanitizeStandingRow);
}

export function normalizeAndSortStandingRows(rows: StandingManagementRow[]) {
  return normalizeStandingRows(rows)
    .sort((left, right) =>
      right.points - left.points ||
      right.goalDifference - left.goalDifference ||
      right.goalsFor - left.goalsFor ||
      left.goalsAgainst - right.goalsAgainst ||
      left.teamName.localeCompare(right.teamName, "es"),
    )
    .map((row, index) => ({ ...row, position: index + 1 }));
}

export function normalizeStandingTable(table: StandingManagementTable): StandingManagementTable {
  return { ...table, rows: normalizeStandingRows(table.rows) };
}

export function getStandingPublicHref(table: Pick<StandingManagementTable, "teamSlug">) {
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
