export type TeamSectionKey = "overview" | "squad" | "calendar" | "standing" | "statistics";

export type TeamSectionNavLink = {
  key: TeamSectionKey;
  label: string;
  href: string;
};

export function getPublicTeamHref(teamSlug: string): string {
  return teamSlug === "primer-equipo" ? "/primer-equipo" : `/equipos/${teamSlug}`;
}

type TeamSectionLinksInput =
  | {
      teamType: "first-team";
    }
  | {
      teamType: "academy";
      teamSlug: string;
    };

export function getTeamSectionLinks(input: TeamSectionLinksInput): TeamSectionNavLink[] {
  if (input.teamType === "first-team") {
    return [
      { key: "overview", label: "Equipo", href: "/primer-equipo" },
      { key: "squad", label: "Plantilla", href: "/primer-equipo/plantilla" },
      { key: "calendar", label: "Calendario", href: "/primer-equipo/calendario" },
      { key: "standing", label: "Clasificacion", href: "/primer-equipo/clasificacion" },
      { key: "statistics", label: "Estadisticas", href: "/primer-equipo/estadisticas" },
    ];
  }

  const baseHref = `/equipos/${input.teamSlug}`;

  return [
    { key: "overview", label: "Equipo", href: baseHref },
    { key: "squad", label: "Plantilla", href: `${baseHref}/plantilla` },
    { key: "calendar", label: "Calendario", href: `${baseHref}/calendario` },
    { key: "standing", label: "Clasificacion", href: `${baseHref}/clasificacion` },
    { key: "statistics", label: "Estadisticas", href: `${baseHref}/estadisticas` },
  ];
}
