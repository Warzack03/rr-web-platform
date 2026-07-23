import type { TeamSectionNavLink } from "@/lib/public/team-section-links";

export type DominantFoot = "left" | "right" | "both" | "unknown";

export type PublicPlayerType = "field" | "goalkeeper";
export type PublicTeamType = "first-team" | "academy";
export type PublicMatchTeamType = PublicTeamType;
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

export type PublicTeamReference = {
  name: string;
  highlight?: boolean;
  logoUrl?: string;
  logoAlt?: string;
};

export type PublicTeamRecentResult = {
  opponent: string;
  score: string;
  result: "V" | "E" | "D";
  label?: string;
  href?: string;
};

export type PublicTeamNewsItem = {
  href: string;
  category: string;
  title: string;
  tone: "ball" | "tactics";
};

export type PublicTeamQuickInfoItem = {
  label: string;
  value: string;
};

export type PublicSquadHighlight = {
  name: string;
  position: string;
  number: number;
  href?: string;
};

export type PublicTeamPageContent = {
  slug: string;
  variant: PublicTeamType;
  name: string;
  category: string;
  competition: string;
  season: string;
  coaches: string[];
  heroImageUrl?: string;
  heroImagePosition?: string;
  links: {
    squad: string;
    calendar: string;
    standing: string;
    statistics: string;
  };
  nextMatch: {
    home: PublicTeamReference;
    away: PublicTeamReference;
    competition: string;
    dateLabel: string;
    venue: string;
    status: string;
    href?: string;
  };
  recentResults: PublicTeamRecentResult[];
  standing: {
    competition: string;
    position: string;
    points: number;
    played: number;
    won: number;
    href: string;
  };
  metrics: {
    goalsFor: number;
    goalsAgainst: number;
    matchesPlayed: number;
    squadSize: number;
  };
  topScorer?: {
    name: string;
    goals: number;
    href?: string;
  };
  squadPreview?: {
    totalPlayers: number;
    goalkeepers?: number;
    highlights: PublicSquadHighlight[];
    href: string;
  };
  quickInfo?: PublicTeamQuickInfoItem[];
  news: PublicTeamNewsItem[];
};

export type PublicCalendarMatchStatus = "played" | "live" | "pending" | "postponed";
export type PublicMatchFilter = "all" | "live" | "played" | "pending";

export type PublicMatchFilterOption = {
  value: PublicMatchFilter;
  label: string;
};

export type PublicCalendarTeam = {
  name: string;
  crestLabel: string;
  isClub?: boolean;
  muted?: boolean;
};

export type PublicCalendarMatch = {
  id: string;
  status: PublicCalendarMatchStatus;
  competition: string;
  dateLabel: string;
  kickoffLabel: string;
  liveMinute?: string;
  venue: string;
  homeTeam: PublicCalendarTeam;
  awayTeam: PublicCalendarTeam;
  homeScore?: number;
  awayScore?: number;
  actionLabel: string;
  actionHint?: string;
  postponementReason?: string;
  detailHref?: string;
};

export type PublicCalendarMatchday = {
  id: string;
  title: string;
  matches: PublicCalendarMatch[];
};

export type PublicTeamCalendarContent = {
  pageTitle: string;
  subtitle: string;
  matchdays: PublicCalendarMatchday[];
};

export type PublicStandingRow = {
  position: number;
  team: string;
  teamSlug?: string;
  logoUrl?: string;
  logoAlt?: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  isClub?: boolean;
};

export type PublicTeamStandingsPageContent = {
  slug: string;
  variant: PublicTeamType;
  title: string;
  subtitle: string;
  season: string;
  teamName: string;
  competition?: string;
  updatedAt?: string;
  backHref: string;
  backLabel: string;
  navLinks: TeamSectionNavLink[];
  rows: PublicStandingRow[];
};

export type PublicStatSortKey =
  | "player"
  | "mvps"
  | "matchesPlayed"
  | "goals"
  | "assists"
  | "goalContributions"
  | "goalsPerMatch"
  | "recoveries"
  | "shots"
  | "shotsOnTarget"
  | "shotAccuracy"
  | "cleanSheets"
  | "cleanSheetRate"
  | "goalsAgainstPerMatch"
  | "saves"
  | "savesPerMatch"
  | "yellowCards"
  | "redCards"
  | "ownGoals";

export type PublicSortDirection = "asc" | "desc";

export type PublicStatsColumn = {
  key: PublicStatSortKey;
  label: string;
  mobileLabel?: string;
};

export type PublicPlayerStatSummaryItem = {
  key: PublicStatSortKey;
  label: string;
  value: string;
};

export type PublicPlayerCardStatItem = {
  label: string;
  value: number | string;
};

export type PublicDerivedPlayerStats = {
  goalContributions: number;
  goalsPerMatch?: number;
  shotAccuracy?: number;
  cleanSheetRate?: number;
  goalsAgainstPerMatch?: number;
  savesPerMatch?: number;
};

export type PublicTeamStatisticsPageContent = {
  teamType: PublicTeamType;
  teamSlug: string;
  teamName: string;
  season: string;
  competition: string;
  category?: string;
  title: string;
  subtitle: string;
  backHref: string;
  backLabel: string;
  navLinks: TeamSectionNavLink[];
  fieldPlayers: PublicPlayerProfile[];
  goalkeepers: PublicPlayerProfile[];
};

export type PublicRosterPlayerCard = PublicPlayerProfile;

export type PublicTeamRosterContent = {
  pageTitle: string;
  teamSlug: string;
  teamLabel: string;
  seasonLabel: string;
  goalkeepers: PublicRosterPlayerCard[];
  fieldPlayers: PublicRosterPlayerCard[];
};

export const publicNewsCategoryLabels = [
  "Todas",
  "Cronica",
  "Club",
  "Cantera",
  "Entrevista",
] as const;

export type PublicNewsCategory = Exclude<(typeof publicNewsCategoryLabels)[number], "Todas">;

export type PublicNewsImageTone =
  | "stadium-night"
  | "locker-room"
  | "academy-surge"
  | "press-room"
  | "training-ground"
  | "crowd-lights";

export type PublicNewsArticleImage = {
  tone: PublicNewsImageTone;
  alt: string;
  caption?: string;
};

export type PublicNewsParagraphBlock = {
  type: "paragraph";
  text: string;
};

export type PublicNewsHeadingBlock = {
  type: "heading";
  text: string;
};

export type PublicNewsQuoteBlock = {
  type: "quote";
  text: string;
  attribution?: string;
};

export type PublicNewsImageBlock = {
  type: "image";
  image: PublicNewsArticleImage;
};

export type PublicNewsImageGridBlock = {
  type: "imageGrid";
  images: PublicNewsArticleImage[];
};

export type PublicNewsLinkBlock = {
  type: "link";
  label: string;
  href: string;
  description?: string;
  external?: boolean;
};

export type PublicNewsContentBlock =
  | PublicNewsParagraphBlock
  | PublicNewsHeadingBlock
  | PublicNewsQuoteBlock
  | PublicNewsImageBlock
  | PublicNewsImageGridBlock
  | PublicNewsLinkBlock;

export type PublicNewsArticle = {
  slug: string;
  title: string;
  excerpt: string;
  category: PublicNewsCategory;
  date: string;
  dateLabel: string;
  author: string;
  imageTone: PublicNewsImageTone;
  coverImageAlt: string;
  featured: boolean;
  relatedTeam?: string;
  relatedTeams?: string[];
  badge?: string;
  relatedSlugs?: string[];
  content: PublicNewsContentBlock[];
};

export type PublicMediaImage = {
  url: string;
  alt: string;
  width?: number;
  height?: number;
};

export type PublicMediaReference = {
  publicUrl: string;
  altText?: string;
  mimeType?: string;
  width?: number;
  height?: number;
};

export type MatchTeamType = PublicMatchTeamType;
export type CalendarMatchStatus = PublicCalendarMatchStatus;
export type MatchFilter = PublicMatchFilter;
export type MatchFilterOption = PublicMatchFilterOption;
export type CalendarMatchTeam = PublicCalendarTeam;
export type CalendarMatch = PublicCalendarMatch;
export type CalendarMatchday = PublicCalendarMatchday;
export type TeamCalendarContent = PublicTeamCalendarContent;
export type StandingRowData = PublicStandingRow;
export type TeamStandingsPageContent = PublicTeamStandingsPageContent;
export type StatSortKey = PublicStatSortKey;
export type SortDirection = PublicSortDirection;
export type StatsColumn = PublicStatsColumn;
export type PlayerStatSummaryItem = PublicPlayerStatSummaryItem;
export type PlayerCardStatItem = PublicPlayerCardStatItem;
export type DerivedPlayerStats = PublicDerivedPlayerStats;
export type TeamStatisticsPageContent = PublicTeamStatisticsPageContent;
