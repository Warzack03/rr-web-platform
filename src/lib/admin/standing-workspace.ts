import type { StandingsFiltersValue } from "@/components/admin/standings-filters";
import type {
  StandingManagementRow,
  StandingManagementTable,
} from "@/lib/admin/standings-management";

export type AdminStandingsScreenState = "loading" | "ready" | "error";
export type AdminStandingsBannerTone = "success" | "danger";

export const initialStandingsFilters: StandingsFiltersValue = {
  selectionMode: "team",
  team: "",
  competition: "",
};

export function sortStandingsManagementTables(
  tables: StandingManagementTable[],
) {
  return [...tables].sort((left, right) => {
    if (left.season !== right.season) {
      return right.season.localeCompare(left.season);
    }

    if (left.teamName !== right.teamName) {
      return left.teamName.localeCompare(right.teamName, "es");
    }

    return left.competition.localeCompare(right.competition, "es");
  });
}

export function mergeStandingTables(
  savedTables: StandingManagementTable[],
  draftTables: Record<string, StandingManagementTable>,
) {
  return sortStandingsManagementTables(
    savedTables.map((table) => draftTables[table.id] ?? table),
  );
}

export function createStandingBanner(
  message: string,
  tone: AdminStandingsBannerTone,
) {
  return { message, tone };
}

export function getStandingRowValidationErrors(
  row: StandingManagementRow,
  index: number,
) {
  const errors: string[] = [];
  const numericFields = [
    ["PJ", row.played],
    ["G", row.won],
    ["E", row.drawn],
    ["P", row.lost],
    ["PTS SA", row.sanctionPoints],
    ["GF", row.goalsFor],
    ["GC", row.goalsAgainst],
  ] as const;

  numericFields.forEach(([label, value]) => {
    if (!Number.isFinite(value) || value < 0) {
      errors.push(`La fila ${index + 1} tiene un valor invalido en ${label}.`);
    }
  });

  return errors;
}

export function getStandingValidationErrors(
  standing: StandingManagementTable,
) {
  const rowErrors = standing.rows.flatMap((row, index) =>
    getStandingRowValidationErrors(row, index),
  );

  if (standing.rows.length === 0) {
    rowErrors.push("La clasificacion necesita al menos una fila.");
  }

  if (!standing.rows.some((row) => row.isOwnTeam)) {
    rowErrors.push(
      "Marca al menos un equipo del club para la vista publica y el resumen.",
    );
  }

  return rowErrors;
}

export function getStandingRowErrorMap(standing: StandingManagementTable) {
  return standing.rows.reduce<Record<string, string[]>>(
    (errorsByRow, row, index) => {
      const rowErrors = getStandingRowValidationErrors(row, index);

      if (rowErrors.length > 0) {
        errorsByRow[row.id] = rowErrors;
      }

      return errorsByRow;
    },
    {},
  );
}
