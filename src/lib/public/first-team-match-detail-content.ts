import type { CalendarMatch } from "@/lib/public/team-calendar-content";
import { getFirstTeamCalendarContent } from "@/lib/public/team-calendar-content";
import type { MatchDetailContent } from "@/lib/public/match-detail-content";
import { getFirstTeamPlayerHref } from "@/lib/public/first-team-squad-content";

export type FirstTeamMatchDetail = MatchDetailContent;

type FirstTeamMatchDetailSeed = Omit<FirstTeamMatchDetail, "match" | "teamType">;

const FIRST_TEAM_MATCH_DETAIL_SEEDS: Record<string, FirstTeamMatchDetailSeed> = {
  "j1-royal-acad": {
    stageLabel: "Liga Profesional - Jornada 1",
    highlightsUrl:
      "https://www.youtube.com/results?search_query=Rising+Raimon+Royal+Acad+highlights",
    showHighlights: true,
    homeScorers: [
      { playerName: "Axel Blaze", minutes: [15, 72] },
      { playerName: "Jude Sharp", minutes: [44] },
    ],
    awayScorers: [{ playerName: "David Samford", minutes: [30] }],
    playerPerformances: [
      {
        id: "mark-evans",
        shirtNumber: 1,
        name: "Mark Evans",
        position: "Portero",
        href: getFirstTeamPlayerHref("mark-evans"),
      },
      {
        id: "jack-wallside",
        shirtNumber: 3,
        name: "Jack Wallside",
        position: "Defensa",
      },
      {
        id: "nathan-swift",
        shirtNumber: 2,
        name: "Nathan Swift",
        position: "Defensa",
        href: getFirstTeamPlayerHref("nathan-swift"),
        yellowCards: 1,
      },
      {
        id: "jude-sharp",
        shirtNumber: 14,
        name: "Jude Sharp",
        position: "Centrocampista",
        href: getFirstTeamPlayerHref("jude-sharp"),
        goals: 1,
        assists: 1,
      },
      {
        id: "kevin-dragonfly",
        shirtNumber: 11,
        name: "Kevin Dragonfly",
        position: "Delantero",
        href: getFirstTeamPlayerHref("kevin-dragonfly"),
      },
      {
        id: "axel-blaze",
        shirtNumber: 10,
        name: "Axel Blaze",
        position: "Delantero",
        href: getFirstTeamPlayerHref("axel-blaze"),
        goals: 2,
        mvp: true,
      },
    ],
  },
  "j2-zeus": {
    stageLabel: "Liga Profesional - Jornada 2",
    homeScorers: [{ playerName: "Byron Love", minutes: [29] }],
    awayScorers: [],
    playerPerformances: [
      {
        id: "mark-evans",
        shirtNumber: 1,
        name: "Mark Evans",
        position: "Portero",
        href: getFirstTeamPlayerHref("mark-evans"),
      },
      {
        id: "nathan-swift",
        shirtNumber: 2,
        name: "Nathan Swift",
        position: "Defensa",
        href: getFirstTeamPlayerHref("nathan-swift"),
        yellowCards: 1,
      },
      {
        id: "jack-wallside",
        shirtNumber: 3,
        name: "Jack Wallside",
        position: "Defensa",
      },
      {
        id: "jude-sharp",
        shirtNumber: 14,
        name: "Jude Sharp",
        position: "Centrocampista",
        href: getFirstTeamPlayerHref("jude-sharp"),
        assists: 1,
      },
      {
        id: "axel-blaze",
        shirtNumber: 10,
        name: "Axel Blaze",
        position: "Delantero",
        href: getFirstTeamPlayerHref("axel-blaze"),
        mvp: true,
      },
      {
        id: "kevin-dragonfly",
        shirtNumber: 11,
        name: "Kevin Dragonfly",
        position: "Delantero",
        href: getFirstTeamPlayerHref("kevin-dragonfly"),
      },
    ],
  },
  "j3-inazuma-city": {
    stageLabel: "Liga Profesional - Jornada 3",
    homeScorers: [],
    awayScorers: [],
    playerPerformances: [],
  },
};

function getFirstTeamCalendarMatchById(matchId: string): CalendarMatch | null {
  const calendar = getFirstTeamCalendarContent();

  for (const matchday of calendar.matchdays) {
    const match = matchday.matches.find((item) => item.id === matchId);

    if (match) {
      return match;
    }
  }

  return null;
}

export function getFirstTeamMatchDetail(matchId: string): FirstTeamMatchDetail | null {
  const match = getFirstTeamCalendarMatchById(matchId);
  const seed = FIRST_TEAM_MATCH_DETAIL_SEEDS[matchId];

  if (!match || !seed) {
    return null;
  }

  return {
    teamType: "first-team",
    match,
    showLiveFeatures: true,
    ...seed,
  };
}

export function getFirstTeamMatchDetailHref(matchId: string): string | undefined {
  return getFirstTeamMatchDetail(matchId) ? `/primer-equipo/partidos/${matchId}` : undefined;
}

export function getFirstTeamMatchDetailIds(): string[] {
  return Object.keys(FIRST_TEAM_MATCH_DETAIL_SEEDS).filter((matchId) =>
    Boolean(getFirstTeamCalendarMatchById(matchId)),
  );
}
