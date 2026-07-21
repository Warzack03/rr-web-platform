export type TeamCoachRoleLabel =
  | "Entrenador principal"
  | "Segundo entrenador"
  | "Ayudante";

export type TeamManagementCoach = {
  id: string;
  name: string;
  roleLabel: TeamCoachRoleLabel;
  publicVisible: boolean;
};

export type TeamManagementTeam = {
  id: string;
  slug: string;
  name: string;
  category: string;
  competition: string;
  season: string;
  branch: string;
  publicVisible: boolean;
  active: boolean;
  isFirstTeam: boolean;
  displayOrder: number;
  coaches: TeamManagementCoach[];
  logoMediaId?: string;
  logoUrl: string;
  bannerMediaId?: string;
  bannerUrl: string;
  playerCount: number;
  nextMatchLabel: string;
  accent: string;
  primaryCoach: string;
  visibleCoaches: string[];
};

export const teamCoachRoleOptions: TeamCoachRoleLabel[] = [
  "Entrenador principal",
  "Segundo entrenador",
  "Ayudante",
];

export function normalizeTeamManagementTeam(
  team: TeamManagementTeam,
): TeamManagementTeam {
  const visibleCoaches = team.coaches
    .filter((coach) => coach.publicVisible)
    .map((coach) => coach.name);
  const primaryCoach =
    team.coaches.find((coach) => coach.roleLabel === "Entrenador principal")?.name ??
    visibleCoaches[0] ??
    "Sin asignar";

  return {
    ...team,
    branch: team.isFirstTeam ? "Primer equipo" : "Cantera",
    primaryCoach,
    visibleCoaches,
  };
}
