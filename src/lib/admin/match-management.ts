export type MatchManagementStatus = "scheduled" | "live" | "played" | "postponed";
export type MatchVisualStatus = "pending" | "live" | "played";
export type CoachMatchVisualStatus = "pending" | "played";

export type MatchManagementTeam = {
  id: string;
  slug: string;
  name: string;
  season: string;
  competition: string;
  isFirstTeam: boolean;
};

export type MatchManagementOpponent = {
  id: string;
  name: string;
  competition: string;
};

export type MatchManagementVenue = {
  id: string;
  name: string;
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

const weekdayLabels = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];
const monthLabels = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

export function getNextMatchdaySuggestion(
  matches: Array<Pick<MatchManagementMatch, "teamSlug" | "matchday">>,
  teamSlug: string,
) {
  const lastMatchday = matches
    .filter((match) => match.teamSlug === teamSlug)
    .map((match) => match.matchday.match(/\d+/)?.[0])
    .filter((value): value is string => Boolean(value))
    .map(Number)
    .filter(Number.isFinite)
    .reduce((highest, value) => Math.max(highest, value), 0);

  return lastMatchday > 0 ? `Jornada ${lastMatchday + 1}` : "Jornada 1";
}

export function isPendingMatchStatus(status: MatchManagementStatus) {
  return status === "scheduled" || status === "postponed";
}

export function getVisualMatchStatus(status: MatchManagementStatus): MatchVisualStatus {
  if (status === "played") return "played";
  if (status === "live") return "live";
  return "pending";
}

export function hasMatchResult(
  match: Pick<MatchManagementMatch, "ownScore" | "opponentScore">,
) {
  return match.ownScore !== null && match.opponentScore !== null;
}

export function getCoachMatchVisualStatus(
  match: Pick<MatchManagementMatch, "ownScore" | "opponentScore">,
): CoachMatchVisualStatus {
  return hasMatchResult(match) ? "played" : "pending";
}

export function getStoredMatchStatus(
  status: MatchVisualStatus,
  hasConfirmedDate: boolean,
): MatchManagementStatus {
  if (status === "played" || status === "live") return status;
  return hasConfirmedDate ? "scheduled" : "postponed";
}

export function formatMatchDateLabel(match: Pick<MatchManagementMatch, "date" | "time">) {
  if (!match.date) return "Fecha por confirmar";
  const date = new Date(`${match.date}T12:00:00`);
  const baseLabel = `${weekdayLabels[date.getDay()]} ${date.getDate()} ${monthLabels[date.getMonth()]}`;
  return match.time ? `${baseLabel} · ${match.time}` : baseLabel;
}

export function getMatchResultLabel(
  match: Pick<MatchManagementMatch, "ownScore" | "opponentScore">,
) {
  return hasMatchResult(match) ? `${match.ownScore} - ${match.opponentScore}` : "PDTE";
}

export function getMatchPublicHref(
  match: Pick<MatchManagementMatch, "id" | "isFirstTeam" | "teamSlug">,
) {
  return match.isFirstTeam
    ? `/primer-equipo/partidos/${match.id}`
    : `/equipos/${match.teamSlug}/partidos/${match.id}`;
}

export function getMatchLocationLabel(match: Pick<MatchManagementMatch, "isHome">) {
  return match.isHome ? "Local" : "Visitante";
}

function getMatchSortTimestamp(match: MatchManagementMatch) {
  return match.date
    ? Date.parse(`${match.date}T${match.time || "12:00"}:00`)
    : Number.POSITIVE_INFINITY;
}

export function sortMatchManagementMatches(matches: MatchManagementMatch[]) {
  return [...matches].sort((left, right) => {
    const leftStatus = getVisualMatchStatus(left.status);
    const rightStatus = getVisualMatchStatus(right.status);
    const group = (status: MatchVisualStatus) => status === "live" ? 0 : status === "pending" ? 1 : 2;
    const groupDifference = group(leftStatus) - group(rightStatus);
    if (groupDifference !== 0) return groupDifference;
    const difference = getMatchSortTimestamp(left) - getMatchSortTimestamp(right);
    return leftStatus === "played" ? -difference : difference;
  });
}

export function sortCoachMatchManagementMatches(matches: MatchManagementMatch[]) {
  return [...matches].sort((left, right) => {
    const leftStatus = getCoachMatchVisualStatus(left);
    const rightStatus = getCoachMatchVisualStatus(right);
    if (leftStatus !== rightStatus) return leftStatus === "pending" ? -1 : 1;
    const difference = getMatchSortTimestamp(left) - getMatchSortTimestamp(right);
    return leftStatus === "played" ? -difference : difference;
  });
}

export const coachPreviewTeamSlugs: readonly string[] = [];
