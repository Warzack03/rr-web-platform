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
];

const adminSectionKeys: ReadonlySet<AdminSectionKey> = new Set([
  "dashboard",
  "seasons",
  "teams",
  "players",
  "assignments",
  "matches",
  "standings",
  "stats",
  "news",
  "media",
  "imports",
  "users",
  "settings",
]);

export function canAccessAdminSection(_sectionRole: unknown, section: AdminSectionKey) {
  return adminSectionKeys.has(section);
}

export function getAdminNavigation() {
  return adminNavigation;
}
