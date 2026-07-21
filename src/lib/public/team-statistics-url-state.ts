import type { PublicPlayerType, PublicTeamType } from "@/lib/public/player-profile-types";
import {
  getStatsColumns,
  type SortDirection,
  type StatSortKey,
} from "@/lib/public/team-statistics-utils";

export type TeamStatisticsInitialState = {
  searchValue: string;
  activeSection: PublicPlayerType;
  sortKey: StatSortKey | null;
  sortDirection: SortDirection;
  showMobileTable: boolean;
};

type SearchParamsRecord = Record<string, string | string[] | undefined>;

const STAT_SORT_KEYS: StatSortKey[] = [
  "player",
  "mvps",
  "matchesPlayed",
  "goals",
  "assists",
  "goalContributions",
  "goalsPerMatch",
  "recoveries",
  "shots",
  "shotsOnTarget",
  "shotAccuracy",
  "cleanSheets",
  "cleanSheetRate",
  "goalsAgainstPerMatch",
  "saves",
  "savesPerMatch",
  "yellowCards",
  "redCards",
  "ownGoals",
];

const DEFAULT_TEAM_STATISTICS_STATE: TeamStatisticsInitialState = {
  searchValue: "",
  activeSection: "field",
  sortKey: null,
  sortDirection: "desc",
  showMobileTable: false,
};

export const TEAM_STATISTICS_PARAM_NAMES = {
  search: "q",
  section: "section",
  sortKey: "sort",
  sortDirection: "dir",
  showMobileTable: "table",
  action: "action",
} as const;

export const TEAM_STATISTICS_ACTIONS = {
  section: (value: PublicPlayerType) => `section:${value}`,
  sort: (value: StatSortKey) => `sort:${value}`,
  toggleSortDirection: "toggle-sort-direction",
  clearSort: "clear-sort",
  toggleMobileTable: "toggle-mobile-table",
} as const;

export function parseTeamStatisticsInitialState(
  input: URLSearchParams | SearchParamsRecord,
  teamType: PublicTeamType,
): TeamStatisticsInitialState {
  const baseState = normalizeTeamStatisticsState(
    {
      searchValue: getStringValue(input, TEAM_STATISTICS_PARAM_NAMES.search)?.trim() ?? "",
      activeSection: parsePlayerType(getStringValue(input, TEAM_STATISTICS_PARAM_NAMES.section)) ?? "field",
      sortKey: parseSortKey(getStringValue(input, TEAM_STATISTICS_PARAM_NAMES.sortKey)),
      sortDirection: parseSortDirection(getStringValue(input, TEAM_STATISTICS_PARAM_NAMES.sortDirection)),
      showMobileTable: parseBooleanFlag(getStringValue(input, TEAM_STATISTICS_PARAM_NAMES.showMobileTable)),
    },
    teamType,
  );
  const action = getStringValue(input, TEAM_STATISTICS_PARAM_NAMES.action);

  if (!action) {
    return baseState;
  }

  return applyTeamStatisticsAction(baseState, action, teamType);
}

export function normalizeTeamStatisticsState(
  state: TeamStatisticsInitialState,
  teamType: PublicTeamType,
): TeamStatisticsInitialState {
  const activeSection = state.activeSection === "goalkeeper" ? "goalkeeper" : "field";
  const validSortKeys = new Set(getStatsColumns(teamType, activeSection).map((column) => column.key));
  const sortKey = state.sortKey && validSortKeys.has(state.sortKey) ? state.sortKey : null;

  return {
    searchValue: state.searchValue,
    activeSection,
    sortKey,
    sortDirection: sortKey ? state.sortDirection : "desc",
    showMobileTable: state.showMobileTable,
  };
}

export function buildTeamStatisticsUrl(
  pathname: string,
  state: TeamStatisticsInitialState,
  teamType: PublicTeamType,
): string {
  const search = buildTeamStatisticsSearchParams(state, teamType).toString();
  return search ? `${pathname}?${search}` : pathname;
}

export function buildTeamStatisticsSearchParams(
  state: TeamStatisticsInitialState,
  teamType: PublicTeamType,
): URLSearchParams {
  const normalizedState = normalizeTeamStatisticsState(state, teamType);
  const params = new URLSearchParams();

  const normalizedSearchValue = normalizedState.searchValue.trim();

  if (normalizedSearchValue) {
    params.set(TEAM_STATISTICS_PARAM_NAMES.search, normalizedSearchValue);
  }

  if (normalizedState.activeSection !== DEFAULT_TEAM_STATISTICS_STATE.activeSection) {
    params.set(TEAM_STATISTICS_PARAM_NAMES.section, normalizedState.activeSection);
  }

  if (normalizedState.sortKey) {
    params.set(TEAM_STATISTICS_PARAM_NAMES.sortKey, normalizedState.sortKey);
  }

  if (normalizedState.sortDirection !== DEFAULT_TEAM_STATISTICS_STATE.sortDirection) {
    params.set(TEAM_STATISTICS_PARAM_NAMES.sortDirection, normalizedState.sortDirection);
  }

  if (normalizedState.showMobileTable) {
    params.set(TEAM_STATISTICS_PARAM_NAMES.showMobileTable, "1");
  }

  return params;
}

function applyTeamStatisticsAction(
  state: TeamStatisticsInitialState,
  action: string,
  teamType: PublicTeamType,
): TeamStatisticsInitialState {
  if (action.startsWith("section:")) {
    const nextSection = parsePlayerType(action.slice("section:".length));

    if (!nextSection) {
      return state;
    }

    return normalizeTeamStatisticsState(
      {
        ...state,
        activeSection: nextSection,
      },
      teamType,
    );
  }

  if (action.startsWith("sort:")) {
    const nextSortKey = parseSortKey(action.slice("sort:".length));

    if (!nextSortKey) {
      return state;
    }

    return normalizeTeamStatisticsState(
      {
        ...state,
        sortKey: nextSortKey,
        sortDirection:
          state.sortKey === nextSortKey
            ? toggleSortDirection(state.sortDirection)
            : nextSortKey === "player"
              ? "asc"
              : "desc",
      },
      teamType,
    );
  }

  if (action === TEAM_STATISTICS_ACTIONS.toggleSortDirection) {
    if (!state.sortKey) {
      return state;
    }

    return normalizeTeamStatisticsState(
      {
        ...state,
        sortDirection: toggleSortDirection(state.sortDirection),
      },
      teamType,
    );
  }

  if (action === TEAM_STATISTICS_ACTIONS.clearSort) {
    return normalizeTeamStatisticsState(
      {
        ...state,
        sortKey: null,
        sortDirection: "desc",
      },
      teamType,
    );
  }

  if (action === TEAM_STATISTICS_ACTIONS.toggleMobileTable) {
    return normalizeTeamStatisticsState(
      {
        ...state,
        showMobileTable: !state.showMobileTable,
      },
      teamType,
    );
  }

  return state;
}

function getStringValue(input: URLSearchParams | SearchParamsRecord, key: string) {
  if (input instanceof URLSearchParams) {
    const values = input.getAll(key);
    return values.length > 0 ? values[values.length - 1] : undefined;
  }

  const value = input[key];

  if (Array.isArray(value)) {
    return value.length > 0 ? value[value.length - 1] : undefined;
  }

  return value;
}

function parsePlayerType(value: string | undefined): PublicPlayerType | undefined {
  return value === "field" || value === "goalkeeper" ? value : undefined;
}

function parseSortKey(value: string | undefined): StatSortKey | null {
  return value && STAT_SORT_KEYS.includes(value as StatSortKey) ? (value as StatSortKey) : null;
}

function parseSortDirection(value: string | undefined): SortDirection {
  return value === "asc" ? "asc" : "desc";
}

function parseBooleanFlag(value: string | undefined) {
  return value === "1" || value === "true";
}

function toggleSortDirection(direction: SortDirection): SortDirection {
  return direction === "asc" ? "desc" : "asc";
}
