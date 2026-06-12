import { UserRole } from "@prisma/client";

export type AdminSectionKey =
  | "dashboard"
  | "seasons"
  | "teams"
  | "players"
  | "assignments"
  | "matches"
  | "standings"
  | "stats"
  | "news"
  | "media"
  | "imports"
  | "users"
  | "settings";

export type AdminNavItem = {
  href: string;
  label: string;
  section: AdminSectionKey;
  status: "active" | "preview";
};

export const roleLabels: Record<UserRole, string> = {
  [UserRole.SUPERADMIN]: "Superadmin",
  [UserRole.MANAGER]: "Manager",
  [UserRole.COACH]: "Entrenador",
};

export const adminNavigation: AdminNavItem[] = [
  { href: "/admin", label: "Dashboard", section: "dashboard", status: "active" },
  { href: "/admin/partidos", label: "Partidos", section: "matches", status: "active" },
  { href: "/admin/clasificaciones", label: "Clasificaciones", section: "standings", status: "active" },
  { href: "/admin/estadisticas", label: "Estadisticas", section: "stats", status: "active" },
  { href: "/admin/equipos", label: "Equipos", section: "teams", status: "active" },
  { href: "/admin/noticias", label: "Noticias", section: "news", status: "preview" },
  { href: "/admin/jugadores", label: "Jugadores", section: "players", status: "preview" },
  { href: "/admin/asignaciones", label: "Asignaciones", section: "assignments", status: "preview" },
  { href: "/admin/temporadas", label: "Temporadas", section: "seasons", status: "preview" },
  { href: "/admin/media", label: "Media", section: "media", status: "preview" },
  { href: "/admin/importaciones", label: "Importaciones", section: "imports", status: "preview" },
  { href: "/admin/usuarios", label: "Usuarios", section: "users", status: "preview" },
];

const coachNavigation: AdminNavItem[] = [
  { href: "/admin", label: "Mi jornada", section: "dashboard", status: "active" },
  { href: "/admin/partidos", label: "Partidos", section: "matches", status: "active" },
  { href: "/admin/clasificaciones", label: "Clasificacion", section: "standings", status: "active" },
  { href: "/admin/estadisticas", label: "Estadisticas", section: "stats", status: "active" },
  { href: "/admin/equipos", label: "Mi equipo", section: "teams", status: "active" },
];

const adminSectionRoles: Record<AdminSectionKey, UserRole[]> = {
  dashboard: [UserRole.SUPERADMIN, UserRole.MANAGER, UserRole.COACH],
  seasons: [UserRole.SUPERADMIN, UserRole.MANAGER],
  teams: [UserRole.SUPERADMIN, UserRole.MANAGER, UserRole.COACH],
  players: [UserRole.SUPERADMIN, UserRole.MANAGER, UserRole.COACH],
  assignments: [UserRole.SUPERADMIN, UserRole.MANAGER],
  matches: [UserRole.SUPERADMIN, UserRole.MANAGER, UserRole.COACH],
  standings: [UserRole.SUPERADMIN, UserRole.MANAGER, UserRole.COACH],
  stats: [UserRole.SUPERADMIN, UserRole.MANAGER, UserRole.COACH],
  news: [UserRole.SUPERADMIN, UserRole.MANAGER],
  media: [UserRole.SUPERADMIN, UserRole.MANAGER],
  imports: [UserRole.SUPERADMIN],
  users: [UserRole.SUPERADMIN],
  settings: [UserRole.SUPERADMIN],
};

export function canAccessAdminSection(role: UserRole, section: AdminSectionKey) {
  return adminSectionRoles[section].includes(role);
}

export function getAdminNavigationForRole(role: UserRole) {
  const navigation = role === UserRole.COACH ? coachNavigation : adminNavigation;
  return navigation.filter((item) => canAccessAdminSection(role, item.section));
}
