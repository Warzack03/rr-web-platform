export type DominantFoot = "left" | "right" | "both" | "unknown";

export type PublicPlayerType = "field" | "goalkeeper";
export type PublicTeamType = "first-team" | "academy";
export type PublicPlayerStatsLevel = "advanced" | "basic";
export type PublicPlayerGroup = "defensas" | "mediocentros" | "banda" | "delanteros";

export type PublicPlayerStats = {
  matchesPlayed: number;
  goals: number;
  assists: number;
  goalsAgainst?: number;
  yellowCards: number;
  redCards: number;
  ownGoals: number;
  mvps: number;
  recoveries?: number;
  shots?: number;
  shotsOnTarget?: number;
  cleanSheets?: number;
  saves?: number;
};

export type PublicPlayerProfile = {
  id: string;
  slug: string;
  displayName?: string;
  firstName: string;
  lastName: string;
  name: string;
  number: number;
  country?: string;
  countryFlag?: string;
  position: string;
  dominantFoot?: DominantFoot;
  imageUrl?: string;
  playerType: PublicPlayerType;
  group?: PublicPlayerGroup;
  teamType: PublicTeamType;
  statsLevel: PublicPlayerStatsLevel;
  teamSlug: string;
  teamLabel: string;
  seasonLabel: string;
  shopHref?: string;
  relatedTeams?: Array<{
    teamSlug: string;
    teamLabel: string;
    teamType: PublicTeamType;
  }>;
  stats: PublicPlayerStats;
};
