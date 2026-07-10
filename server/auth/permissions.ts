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
  [UserRole.SUPERADMIN]: "Administrador",
  [UserRole.MANAGER]: "Administrador",
  [UserRole.COACH]: "Administrador",
};

export const adminNavigation: AdminNavItem[] = [
  { href: "/admin", label: "Panel", section: "dashboard", status: "active" },
  { href: "/admin/partidos", label: "Jornada", section: "matches", status: "active" },
  { href: "/admin/clasificaciones", label: "Clasificaciones", section: "standings", status: "active" },
  { href: "/admin/estadisticas", label: "Estadisticas", section: "stats", status: "active" },
  { href: "/admin/equipos", label: "Equipos", section: "teams", status: "active" },
  { href: "/admin/asignaciones", label: "Plantilla", section: "assignments", status: "active" },
  { href: "/admin/jugadores", label: "Fichas y cromos", section: "players", status: "active" },
  { href: "/admin/media", label: "Media", section: "media", status: "active" },
  { href: "/admin/noticias", label: "Noticias", section: "news", status: "active" },
  { href: "/admin/temporadas", label: "Temporadas", section: "seasons", status: "active" },
  { href: "/admin/importaciones", label: "Importaciones", section: "imports", status: "active" },
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
  return adminSectionRoles[section]?.includes(role) ?? false;
}

export function getAdminNavigationForRole(role: UserRole) {
  return adminNavigation.filter((item) => canAccessAdminSection(role, item.section));
}
