import type { MatchFiltersValue } from "@/components/admin/match-filters";
import {
  getVisualMatchStatus,
  hasMatchResult,
  isPendingMatchStatus,
  sortMatchManagementMatches,
  type MatchManagementMatch,
  type MatchManagementTeam,
} from "@/lib/admin/match-management";

export type AdminMatchesScreenState = "loading" | "ready" | "error";

export const adminMatchPageSizeOptions = [10, 20, 50] as const;
export type AdminMatchPageSize = (typeof adminMatchPageSizeOptions)[number];

export type MatchDialogState =
  | { mode: "create" }
  | { mode: "edit"; matchId: string }
  | null;

export function buildInitialMatchFilters(
  selectedTeamSlug?: string,
): MatchFiltersValue {
  return {
    season: "all",
    team: selectedTeamSlug ?? "all",
    status: "all",
    competition: "all",
    date: "all",
    search: "",
  };
}

export function isMatchDateThisMonth(dateValue: string) {
  if (!dateValue) {
    return false;
  }

  const now = new Date();
  const date = new Date(`${dateValue}T12:00:00`);

  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth()
  );
}

export function isMatchDateWithinNextSevenDays(dateValue: string) {
  if (!dateValue) {
    return false;
  }

  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end = new Date(start);
  end.setDate(end.getDate() + 7);

  const date = new Date(`${dateValue}T12:00:00`);
  return date >= start && date <= end;
}

export function getEffectiveMatchStatusFilter(input: {
  status: MatchFiltersValue["status"];
  teamSlug: MatchFiltersValue["team"];
  teams: MatchManagementTeam[];
}) {
  const allowLiveFilter = canUseLiveMatchFilter(input.teamSlug, input.teams);

  return input.status === "live" && !allowLiveFilter ? "all" : input.status;
}

export function canUseLiveMatchFilter(
  teamSlug: MatchFiltersValue["team"],
  teams: MatchManagementTeam[],
) {
  const filteredTeamContext =
    teamSlug !== "all"
      ? teams.find((team) => team.slug === teamSlug)
      : undefined;

  return filteredTeamContext
    ? filteredTeamContext.isFirstTeam
    : teams.some((team) => team.isFirstTeam);
}

export function filterAdminMatches(input: {
  matches: MatchManagementMatch[];
  filters: MatchFiltersValue;
  effectiveStatusFilter: MatchFiltersValue["status"];
  deferredSearch: string;
}) {
  return sortMatchManagementMatches(
    input.matches.filter((match) => {
      if (input.filters.season !== "all" && match.season !== input.filters.season) {
        return false;
      }

      if (input.filters.team !== "all" && match.teamSlug !== input.filters.team) {
        return false;
      }

      if (
        input.filters.competition !== "all" &&
        match.competition !== input.filters.competition
      ) {
        return false;
      }

      if (input.effectiveStatusFilter !== "all") {
        const matchStatus = getVisualMatchStatus(match.status);

        if (matchStatus !== input.effectiveStatusFilter) {
          return false;
        }
      }

      if (
        input.filters.date === "next-7" &&
        !isMatchDateWithinNextSevenDays(match.date)
      ) {
        return false;
      }

      if (
        input.filters.date === "this-month" &&
        !isMatchDateThisMonth(match.date)
      ) {
        return false;
      }

      if (input.filters.date === "undated" && match.date) {
        return false;
      }

      if (!input.deferredSearch) {
        return true;
      }

      return match.opponentName.toLowerCase().includes(input.deferredSearch);
    }),
  );
}

export function getAdminMatchMetrics(matches: MatchManagementMatch[]) {
  return {
    upcoming: matches.filter((match) => getVisualMatchStatus(match.status) !== "played")
      .length,
    pending: matches.filter((match) => isPendingMatchStatus(match.status)).length,
    played: matches.filter((match) => match.status === "played").length,
    missingResult: matches.filter((match) => !hasMatchResult(match)).length,
    live: matches.filter((match) => match.status === "live").length,
  };
}
