import type { CalendarMatch, MatchTeamType } from "@/lib/public/team-calendar-content";

export type MatchDetailScorer = {
  playerName: string;
  minutes: number[];
};

export type PlayerPerformance = {
  id: string;
  shirtNumber: number;
  name: string;
  position: string;
  href?: string;
  goals?: number;
  assists?: number;
  yellowCards?: number;
  redCards?: number;
  ownGoals?: number;
  cleanSheet?: boolean;
  mvp?: boolean;
};

export type MatchDetailContext = {
  teamName: string;
  season: string;
  backToCalendarHref?: string;
  backToCalendarLabel?: string;
  backToTeamHref?: string;
  backToTeamLabel?: string;
};

export type MatchDetailContent = {
  teamType: MatchTeamType;
  match: CalendarMatch;
  stageLabel: string;
  highlightsUrl?: string;
  showHighlights?: boolean;
  showLiveFeatures?: boolean;
  homeScorers: MatchDetailScorer[];
  awayScorers: MatchDetailScorer[];
  playerPerformances: PlayerPerformance[];
  context?: MatchDetailContext;
  previewNote?: string;
};
