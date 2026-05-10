import { UserRole } from "@prisma/client";

export type AdminSectionKey =
  | "dashboard"
  | "seasons"
  | "teams"
  | "players"
  | "matches"
  | "standings"
  | "stats"
  | "news"
  | "imports"
  | "users"
  | "settings";

export type AdminNavItem = {
  href: string;
  label: string;
  section: AdminSectionKey;
};

export const roleLabels: Record<UserRole, string> = {
  [UserRole.SUPERADMIN]: "Superadmin",
  [UserRole.MANAGER]: "Manager",
  [UserRole.COACH]: "Entrenador",
};

export const adminNavigation: AdminNavItem[] = [
  { href: "/admin", label: "Dashboard", section: "dashboard" },
  { href: "/admin/temporadas", label: "Temporadas", section: "seasons" },
  { href: "/admin/equipos", label: "Equipos", section: "teams" },
  { href: "/admin/jugadores", label: "Jugadores", section: "players" },
  { href: "/admin/partidos", label: "Partidos", section: "matches" },
  { href: "/admin/clasificaciones", label: "Clasificaciones", section: "standings" },
  { href: "/admin/estadisticas", label: "Estadisticas", section: "stats" },
  { href: "/admin/noticias", label: "Noticias", section: "news" },
  { href: "/admin/importaciones", label: "Importaciones", section: "imports" },
  { href: "/admin/usuarios", label: "Usuarios", section: "users" },
];

const adminSectionRoles: Record<AdminSectionKey, UserRole[]> = {
  dashboard: [UserRole.SUPERADMIN, UserRole.MANAGER, UserRole.COACH],
  seasons: [UserRole.SUPERADMIN, UserRole.MANAGER],
  teams: [UserRole.SUPERADMIN, UserRole.MANAGER],
  players: [UserRole.SUPERADMIN, UserRole.MANAGER],
  matches: [UserRole.SUPERADMIN, UserRole.MANAGER, UserRole.COACH],
  standings: [UserRole.SUPERADMIN, UserRole.MANAGER, UserRole.COACH],
  stats: [UserRole.SUPERADMIN, UserRole.MANAGER, UserRole.COACH],
  news: [UserRole.SUPERADMIN, UserRole.MANAGER],
  imports: [UserRole.SUPERADMIN],
  users: [UserRole.SUPERADMIN],
  settings: [UserRole.SUPERADMIN],
};

export function canAccessAdminSection(role: UserRole, section: AdminSectionKey) {
  return adminSectionRoles[section].includes(role);
}

export function getAdminNavigationForRole(role: UserRole) {
  return adminNavigation.filter((item) => canAccessAdminSection(role, item.section));
}
