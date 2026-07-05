import type { AdminRole } from "@/lib/admin/roles";
import { adminMockSeasons, adminMockUsers } from "@/lib/admin/mock-data";

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
  logoUrl: string;
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

function getBranchLabel(isFirstTeam: boolean) {
  return isFirstTeam ? "Primer equipo" : "Cantera";
}

export function normalizeTeamManagementTeam(
  team: TeamManagementTeam,
): TeamManagementTeam {
  const visibleCoaches = team.coaches
    .filter((coach) => coach.publicVisible)
    .map((coach) => coach.name);
  const primaryCoach =
    team.coaches.find((coach) => coach.roleLabel === "Entrenador principal")
      ?.name ??
    visibleCoaches[0] ??
    "Sin asignar";

  return {
    ...team,
    branch: getBranchLabel(team.isFirstTeam),
    primaryCoach,
    visibleCoaches,
  };
}

function createTeam(team: Omit<TeamManagementTeam, "primaryCoach" | "visibleCoaches">) {
  return normalizeTeamManagementTeam({
    ...team,
    primaryCoach: "",
    visibleCoaches: [],
  });
}

export const adminTeamManagementTeams: TeamManagementTeam[] = [
  createTeam({
    id: "team-primer-equipo",
    slug: "primer-equipo",
    name: "Primer Equipo",
    category: "Senior",
    competition: "Liga Autonomica Senior - Grupo 2",
    season: "2026/2027",
    branch: "Senior",
    publicVisible: true,
    active: true,
    isFirstTeam: true,
    displayOrder: 1,
    coaches: [
      {
        id: "coach-primer-marcos-varela",
        name: "Marcos Varela",
        roleLabel: "Entrenador principal",
        publicVisible: true,
      },
      {
        id: "coach-primer-lucia-serrano",
        name: "Lucia Serrano",
        roleLabel: "Segundo entrenador",
        publicVisible: true,
      },
      {
        id: "coach-primer-diego-roman",
        name: "Diego Roman",
        roleLabel: "Ayudante",
        publicVisible: true,
      },
    ],
    logoUrl: "mock://team-logo/primer-equipo",
    bannerUrl: "mock://team-banner/primer-equipo",
    playerCount: 22,
    nextMatchLabel: "Dom 15 Jun - 18:00 - Escuela Sur Madrid",
    accent: "from-[rgba(253,203,88,0.18)] to-[rgba(253,203,88,0.03)]",
  }),
  createTeam({
    id: "team-raimon-b",
    slug: "raimon-b",
    name: "Raimon B",
    category: "Senior B",
    competition: "Liga Regional Preferente",
    season: "2026/2027",
    branch: "Senior",
    publicVisible: true,
    active: true,
    isFirstTeam: false,
    displayOrder: 2,
    coaches: [
      {
        id: "coach-raimon-sergio-mena",
        name: "Sergio Mena",
        roleLabel: "Entrenador principal",
        publicVisible: true,
      },
      {
        id: "coach-raimon-claudia-torres",
        name: "Claudia Torres",
        roleLabel: "Ayudante",
        publicVisible: true,
      },
    ],
    logoUrl: "mock://team-logo/raimon-b",
    bannerUrl: "mock://team-banner/raimon-b",
    playerCount: 19,
    nextMatchLabel: "Sab 14 Jun - 19:30 - CD Moratalaz B",
    accent: "from-[rgba(52,112,200,0.22)] to-[rgba(52,112,200,0.04)]",
  }),
  createTeam({
    id: "team-juvenil-a",
    slug: "juvenil-a",
    name: "Juvenil A",
    category: "Juvenil",
    competition: "Liga Juvenil Preferente",
    season: "2026/2027",
    branch: "Cantera",
    publicVisible: true,
    active: true,
    isFirstTeam: false,
    displayOrder: 3,
    coaches: [
      {
        id: "coach-juvenil-a-ivan-lobo",
        name: "Ivan Lobo",
        roleLabel: "Entrenador principal",
        publicVisible: true,
      },
      {
        id: "coach-juvenil-a-lucia-serrano",
        name: "Lucia Serrano",
        roleLabel: "Segundo entrenador",
        publicVisible: true,
      },
    ],
    logoUrl: "mock://team-logo/juvenil-a",
    bannerUrl: "mock://team-banner/juvenil-a",
    playerCount: 20,
    nextMatchLabel: "Sab 14 Jun - 11:00 - EF Retiro",
    accent: "from-[rgba(255,255,255,0.1)] to-[rgba(255,255,255,0.02)]",
  }),
  createTeam({
    id: "team-juvenil-b",
    slug: "juvenil-b",
    name: "Juvenil B",
    category: "Juvenil",
    competition: "Liga Juvenil Municipal",
    season: "2026/2027",
    branch: "Cantera",
    publicVisible: true,
    active: true,
    isFirstTeam: false,
    displayOrder: 4,
    coaches: [
      {
        id: "coach-juvenil-b-noelia-cabal",
        name: "Noelia Cabal",
        roleLabel: "Entrenador principal",
        publicVisible: true,
      },
      {
        id: "coach-juvenil-b-adrian-polo",
        name: "Adrian Polo",
        roleLabel: "Ayudante",
        publicVisible: false,
      },
    ],
    logoUrl: "mock://team-logo/juvenil-b",
    bannerUrl: "mock://team-banner/juvenil-b",
    playerCount: 18,
    nextMatchLabel: "Dom 15 Jun - 10:00 - Colegio Norte",
    accent: "from-[rgba(253,203,88,0.12)] to-[rgba(255,255,255,0.02)]",
  }),
  createTeam({
    id: "team-cadete-a",
    slug: "cadete-a",
    name: "Cadete A",
    category: "Cadete",
    competition: "Liga Cadete Municipal",
    season: "2026/2027",
    branch: "Cantera",
    publicVisible: true,
    active: true,
    isFirstTeam: false,
    displayOrder: 5,
    coaches: [
      {
        id: "coach-cadete-a-rafa-nieto",
        name: "Rafa Nieto",
        roleLabel: "Entrenador principal",
        publicVisible: true,
      },
      {
        id: "coach-cadete-a-marta-solis",
        name: "Marta Solis",
        roleLabel: "Ayudante",
        publicVisible: true,
      },
    ],
    logoUrl: "mock://team-logo/cadete-a",
    bannerUrl: "mock://team-banner/cadete-a",
    playerCount: 18,
    nextMatchLabel: "Sab 14 Jun - 09:30 - AD Chamberi",
    accent: "from-[rgba(52,112,200,0.16)] to-[rgba(255,255,255,0.02)]",
  }),
  createTeam({
    id: "team-infantil-a",
    slug: "infantil-a",
    name: "Infantil A",
    category: "Infantil",
    competition: "Liga Infantil Municipal",
    season: "2026/2027",
    branch: "Formacion",
    publicVisible: false,
    active: true,
    isFirstTeam: false,
    displayOrder: 6,
    coaches: [
      {
        id: "coach-infantil-a-hector-blasco",
        name: "Hector Blasco",
        roleLabel: "Entrenador principal",
        publicVisible: true,
      },
    ],
    logoUrl: "mock://team-logo/infantil-a",
    bannerUrl: "mock://team-banner/infantil-a",
    playerCount: 17,
    nextMatchLabel: "Pendiente de fecha",
    accent: "from-[rgba(255,255,255,0.08)] to-[rgba(52,112,200,0.04)]",
  }),
  createTeam({
    id: "team-cadete-b",
    slug: "cadete-b",
    name: "Cadete B",
    category: "Cadete",
    competition: "Liga Cadete Municipal",
    season: "2025/2026",
    branch: "Cantera",
    publicVisible: false,
    active: false,
    isFirstTeam: false,
    displayOrder: 7,
    coaches: [
      {
        id: "coach-cadete-b-pablo-mena",
        name: "Pablo Mena",
        roleLabel: "Entrenador principal",
        publicVisible: true,
      },
    ],
    logoUrl: "mock://team-logo/cadete-b",
    bannerUrl: "mock://team-banner/cadete-b",
    playerCount: 16,
    nextMatchLabel: "Temporada cerrada",
    accent: "from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.01)]",
  }),
];

export const adminTeamManagementSeasons = adminMockSeasons;

export function getCoachPreviewUser() {
  return (
    adminMockUsers.find((user) => user.id === "user-coach-primer-equipo") ??
    adminMockUsers.find((user) => user.role === "COACH")
  );
}

export function getTeamManagementTeamsForRole(role: AdminRole) {
  if (role !== "COACH") {
    return adminTeamManagementTeams;
  }

  const assignedTeamSlugs = new Set(getCoachPreviewUser()?.assignedTeamSlugs ?? []);
  return adminTeamManagementTeams.filter((team) => assignedTeamSlugs.has(team.slug));
}
