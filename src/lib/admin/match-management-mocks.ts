import type { AdminRole } from "@/lib/admin/roles";
import { adminMockSeasons } from "@/lib/admin/mock-data";
import { adminTeamManagementTeams } from "@/lib/admin/team-management-mocks";

export type MatchManagementStatus = "scheduled" | "live" | "played" | "postponed";
export type MatchVisualStatus = "pending" | "live" | "played";

export type MatchManagementTeam = {
  id: string;
  slug: string;
  name: string;
  season: string;
  competition: string;
  isFirstTeam: boolean;
};

export type MatchManagementMatch = {
  id: string;
  teamId: string;
  teamSlug: string;
  teamName: string;
  season: string;
  competition: string;
  matchday: string;
  opponentName: string;
  isHome: boolean;
  date: string;
  time: string;
  venue: string;
  status: MatchManagementStatus;
  ownScore: number | null;
  opponentScore: number | null;
  highlightsUrl?: string;
  detailAvailable: boolean;
  previewAvailable: boolean;
  isFirstTeam: boolean;
};

const managedTeamSlugs = new Set([
  "primer-equipo",
  "raimon-b",
  "juvenil-a",
  "cadete-a",
]);

const weekdayLabels = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];
const monthLabels = [
  "ene",
  "feb",
  "mar",
  "abr",
  "may",
  "jun",
  "jul",
  "ago",
  "sep",
  "oct",
  "nov",
  "dic",
];

export const matchManagementTeams: MatchManagementTeam[] = adminTeamManagementTeams
  .filter((team) => managedTeamSlugs.has(team.slug))
  .map((team) => ({
    id: team.id,
    slug: team.slug,
    name: team.name,
    season: team.season,
    competition: team.competition,
    isFirstTeam: team.isFirstTeam,
  }));

export const matchManagementSeasonOptions = adminMockSeasons.map((season) => season.name);

export const coachPreviewTeamSlugs = ["raimon-b", "juvenil-a"] as const;

const coachPreviewTeams = matchManagementTeams.filter((team) =>
  coachPreviewTeamSlugs.includes(team.slug as (typeof coachPreviewTeamSlugs)[number]),
);

const teamBySlug = new Map(matchManagementTeams.map((team) => [team.slug, team]));

function createMatch(
  match: Omit<MatchManagementMatch, "teamId" | "teamName" | "season" | "competition" | "isFirstTeam"> & {
    teamSlug: string;
    season?: string;
    competition?: string;
  },
): MatchManagementMatch {
  const team = teamBySlug.get(match.teamSlug);

  if (!team) {
    throw new Error(`Unknown team for match mock: ${match.teamSlug}`);
  }

  return {
    ...match,
    teamId: team.id,
    teamName: team.name,
    season: match.season ?? team.season,
    competition: match.competition ?? team.competition,
    isFirstTeam: team.isFirstTeam,
  };
}

const matchManagementMatches: MatchManagementMatch[] = [
  createMatch({
    id: "match-pe-live-28",
    teamSlug: "primer-equipo",
    matchday: "Jornada 28",
    opponentName: "Escuela Sur Madrid",
    isHome: true,
    date: "2026-06-15",
    time: "18:00",
    venue: "Campo Rising Raimon",
    status: "live",
    ownScore: 1,
    opponentScore: 0,
    detailAvailable: true,
    previewAvailable: true,
  }),
  createMatch({
    id: "match-pe-scheduled-29",
    teamSlug: "primer-equipo",
    matchday: "Jornada 29",
    opponentName: "CD Hortaleza",
    isHome: false,
    date: "2026-06-22",
    time: "17:00",
    venue: "Ciudad Deportiva Sur",
    status: "scheduled",
    ownScore: null,
    opponentScore: null,
    detailAvailable: false,
    previewAvailable: true,
  }),
  createMatch({
    id: "match-pe-played-27",
    teamSlug: "primer-equipo",
    matchday: "Jornada 27",
    opponentName: "Union Vallecas",
    isHome: true,
    date: "2026-06-08",
    time: "19:00",
    venue: "Campo Rising Raimon",
    status: "played",
    ownScore: 3,
    opponentScore: 1,
    detailAvailable: true,
    previewAvailable: true,
  }),
  createMatch({
    id: "match-pe-played-26",
    teamSlug: "primer-equipo",
    matchday: "Jornada 26",
    opponentName: "AD Mostoles",
    isHome: false,
    date: "2026-06-01",
    time: "18:30",
    venue: "Municipal Mostoles Norte",
    status: "played",
    ownScore: 2,
    opponentScore: 2,
    highlightsUrl: "https://www.youtube.com/watch?v=rising-raimon-highlights",
    detailAvailable: true,
    previewAvailable: true,
  }),
  createMatch({
    id: "match-rb-scheduled-24",
    teamSlug: "raimon-b",
    matchday: "Jornada 24",
    opponentName: "CD Moratalaz B",
    isHome: false,
    date: "2026-06-14",
    time: "19:30",
    venue: "Municipal Moratalaz",
    status: "scheduled",
    ownScore: null,
    opponentScore: null,
    detailAvailable: false,
    previewAvailable: true,
  }),
  createMatch({
    id: "match-rb-played-23",
    teamSlug: "raimon-b",
    matchday: "Jornada 23",
    opponentName: "Aravaca B",
    isHome: true,
    date: "2026-06-07",
    time: "20:00",
    venue: "Campo Rising Raimon",
    status: "played",
    ownScore: 2,
    opponentScore: 1,
    detailAvailable: true,
    previewAvailable: true,
  }),
  createMatch({
    id: "match-ja-postponed-21",
    teamSlug: "juvenil-a",
    matchday: "Jornada 21",
    opponentName: "EF Retiro",
    isHome: true,
    date: "",
    time: "",
    venue: "Campo Rising Raimon",
    status: "postponed",
    ownScore: null,
    opponentScore: null,
    detailAvailable: false,
    previewAvailable: true,
  }),
  createMatch({
    id: "match-ja-played-20",
    teamSlug: "juvenil-a",
    matchday: "Jornada 20",
    opponentName: "Canillas Academy",
    isHome: false,
    date: "2026-06-06",
    time: "11:15",
    venue: "Campo Canillas",
    status: "played",
    ownScore: 1,
    opponentScore: 1,
    detailAvailable: true,
    previewAvailable: false,
  }),
  createMatch({
    id: "match-ca-played-20",
    teamSlug: "cadete-a",
    matchday: "Jornada 20",
    opponentName: "AD Chamberi",
    isHome: false,
    date: "2026-06-14",
    time: "09:30",
    venue: "Campo Chamberi",
    status: "played",
    ownScore: 2,
    opponentScore: 3,
    detailAvailable: true,
    previewAvailable: true,
  }),
];

export function getAllMatchManagementMatches() {
  return matchManagementMatches.map((match) => ({ ...match }));
}

export function getCoachPreviewTeamOptions() {
  return coachPreviewTeams.map((team) => ({
    slug: team.slug,
    name: team.name,
  }));
}

export function getResolvedCoachPreviewTeamSlug(preferredSlug?: string) {
  return coachPreviewTeamSlugs.includes(preferredSlug as (typeof coachPreviewTeamSlugs)[number])
    ? preferredSlug
    : coachPreviewTeamSlugs[0];
}

export function getMatchManagementTeamsForRole(
  role: AdminRole,
  preferredCoachTeamSlug?: string,
) {
  if (role !== "COACH") {
    return matchManagementTeams;
  }

  const selectedCoachTeamSlug = getResolvedCoachPreviewTeamSlug(preferredCoachTeamSlug);
  return matchManagementTeams.filter((team) => team.slug === selectedCoachTeamSlug);
}

export function getMatchManagementMatchesForRole(
  role: AdminRole,
  preferredCoachTeamSlug?: string,
) {
  const allowedTeamSlugs = new Set(
    getMatchManagementTeamsForRole(role, preferredCoachTeamSlug).map((team) => team.slug),
  );

  return getAllMatchManagementMatches().filter((match) => allowedTeamSlugs.has(match.teamSlug));
}

export function isPendingMatchStatus(status: MatchManagementStatus) {
  return status === "scheduled" || status === "postponed";
}

export function getVisualMatchStatus(status: MatchManagementStatus): MatchVisualStatus {
  if (status === "played") {
    return "played";
  }

  if (status === "live") {
    return "live";
  }

  return "pending";
}

export function getStoredMatchStatus(
  status: MatchVisualStatus,
  hasConfirmedDate: boolean,
): MatchManagementStatus {
  if (status === "played" || status === "live") {
    return status;
  }

  return hasConfirmedDate ? "scheduled" : "postponed";
}

export function formatMatchDateLabel(match: Pick<MatchManagementMatch, "date" | "time">) {
  if (!match.date) {
    return "Fecha por confirmar";
  }

  const date = new Date(`${match.date}T12:00:00`);
  const baseLabel = `${weekdayLabels[date.getDay()]} ${date.getDate()} ${monthLabels[date.getMonth()]}`;

  return match.time ? `${baseLabel} · ${match.time}` : baseLabel;
}

export function getMatchResultLabel(match: Pick<MatchManagementMatch, "ownScore" | "opponentScore">) {
  if (match.ownScore === null || match.opponentScore === null) {
    return "VS";
  }

  return `${match.ownScore} - ${match.opponentScore}`;
}

export function getMatchPublicHref(match: Pick<MatchManagementMatch, "id" | "isFirstTeam" | "teamSlug">) {
  return match.isFirstTeam
    ? `/primer-equipo/partidos/${match.id}`
    : `/equipos/${match.teamSlug}/partidos/${match.id}`;
}

export function getMatchLocationLabel(match: Pick<MatchManagementMatch, "isHome">) {
  return match.isHome ? "Local" : "Visitante";
}

function getMatchSortTimestamp(match: MatchManagementMatch) {
  if (!match.date) {
    return Number.POSITIVE_INFINITY;
  }

  return Date.parse(`${match.date}T${match.time || "12:00"}:00`);
}

export function sortMatchManagementMatches(matches: MatchManagementMatch[]) {
  return [...matches].sort((left, right) => {
    const leftVisualStatus = getVisualMatchStatus(left.status);
    const rightVisualStatus = getVisualMatchStatus(right.status);

    const leftGroup = leftVisualStatus === "live" ? 0 : leftVisualStatus === "pending" ? 1 : 2;
    const rightGroup = rightVisualStatus === "live" ? 0 : rightVisualStatus === "pending" ? 1 : 2;

    if (leftGroup !== rightGroup) {
      return leftGroup - rightGroup;
    }

    const leftTimestamp = getMatchSortTimestamp(left);
    const rightTimestamp = getMatchSortTimestamp(right);

    if (leftVisualStatus === "played") {
      return rightTimestamp - leftTimestamp;
    }

    return leftTimestamp - rightTimestamp;
  });
}
