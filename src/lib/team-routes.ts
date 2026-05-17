export function getTeamOverviewHref(teamSlug: string) {
  return teamSlug === "primer-equipo" ? "/primer-equipo" : `/equipos/${teamSlug}`;
}

export function getTeamRosterHref(teamSlug: string) {
  return teamSlug === "primer-equipo"
    ? "/primer-equipo/plantilla"
    : `/equipos/${teamSlug}/plantilla`;
}

export function getTeamCalendarHref(teamSlug: string) {
  return teamSlug === "primer-equipo"
    ? "/primer-equipo/calendario"
    : `/equipos/${teamSlug}/calendario`;
}

export function getTeamStandingsHref(teamSlug: string) {
  return teamSlug === "primer-equipo"
    ? "/primer-equipo/clasificacion"
    : `/equipos/${teamSlug}/clasificacion`;
}
