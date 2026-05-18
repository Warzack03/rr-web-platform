"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import type {
  CalendarMatchday,
  MatchFilter,
  MatchFilterOption,
  MatchTeamType,
} from "@/lib/public/team-calendar-content";
import { MatchdaySection } from "@/components/public/matchday-section";
import { MatchFilters } from "@/components/public/match-filters";

type TeamCalendarProps = {
  matchdays: CalendarMatchday[];
  showLiveFeatures?: boolean;
  showVideoActions?: boolean;
  teamType?: MatchTeamType;
  className?: string;
};

const FIRST_TEAM_FILTERS: MatchFilterOption[] = [
  { value: "all", label: "Todos" },
  { value: "live", label: "En vivo" },
  { value: "played", label: "Jugados" },
  { value: "pending", label: "Pendientes" },
];

const ACADEMY_FILTERS: MatchFilterOption[] = [
  { value: "all", label: "Todos" },
  { value: "played", label: "Jugados" },
  { value: "pending", label: "Pendientes" },
];

function matchBelongsToFilter(filter: MatchFilter, status: CalendarMatchday["matches"][number]["status"]) {
  if (filter === "all") {
    return true;
  }

  if (filter === "pending") {
    return status === "pending" || status === "postponed";
  }

  return status === filter;
}

export function TeamCalendar({
  matchdays,
  showLiveFeatures = false,
  showVideoActions = true,
  teamType = "first-team",
  className,
}: TeamCalendarProps) {
  const availableFilters = useMemo(
    () =>
      teamType === "academy" || !showLiveFeatures ? ACADEMY_FILTERS : FIRST_TEAM_FILTERS,
    [showLiveFeatures, teamType],
  );
  const [activeFilter, setActiveFilter] = useState<MatchFilter>("all");

  const safeFilter =
    activeFilter === "live" && !showLiveFeatures
      ? ("all" satisfies MatchFilter)
      : activeFilter;

  const filteredMatchdays = useMemo(
    () =>
      matchdays
        .map((matchday) => ({
          ...matchday,
          matches: matchday.matches.filter((match) => matchBelongsToFilter(safeFilter, match.status)),
        }))
        .filter((matchday) => matchday.matches.length > 0),
    [matchdays, safeFilter],
  );

  return (
    <div className={cn("space-y-10 md:space-y-12", className)}>
      <MatchFilters
        options={availableFilters}
        activeFilter={safeFilter}
        onChange={(filter) => setActiveFilter(filter)}
      />

      {filteredMatchdays.length ? (
        <div className="space-y-10 md:space-y-14">
          {filteredMatchdays.map((matchday) => (
            <MatchdaySection
              key={matchday.id}
              title={matchday.title}
              matches={matchday.matches}
              showLiveFeatures={showLiveFeatures}
              showVideoActions={showVideoActions}
              teamType={teamType}
            />
          ))}
        </div>
      ) : (
        <div className="rr-panel max-w-2xl px-6 py-7">
          <p className="rr-kicker text-[color:var(--rr-gold)]">Calendario</p>
          <p className="mt-3 text-[1.1rem] text-[color:var(--rr-muted)]">
            No hay partidos disponibles para este filtro.
          </p>
        </div>
      )}
    </div>
  );
}
