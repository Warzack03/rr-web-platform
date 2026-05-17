import { UserRole } from "@prisma/client";
import {
  getClubPlayerCount,
  getLatestResults,
  getStandings,
  getTeamMatches,
  getTeamPlayers,
  getUpcomingMatch,
  publicMatches,
  publicNews,
  publicPlayers,
  publicTeams,
  type DemoMatch,
  type DemoStandingRow,
} from "@/src/lib/demo-data";

export type AdminMetric = {
  label: string;
  value: string;
  helper: string;
};

export type AdminQuickAction = {
  label: string;
  href: string;
  description: string;
};

export type AdminAlert = {
  id: string;
  title: string;
  detail: string;
  tone: "gold" | "blue" | "danger";
};

export type AdminNewsRow = {
  id: string;
  title: string;
  team: string;
  status: "Publicada" | "Borrador";
  featured: boolean;
  date: string;
  video: string;
};

export type AdminMediaRow = {
  id: string;
  asset: string;
  type: string;
  team: string;
  usage: string;
  updatedAt: string;
  status: "Publicado" | "Pendiente";
};

export type AdminImportRow = {
  id: string;
  fileName: string;
  entity: string;
  status: "Validado" | "Aplicado" | "Pendiente";
  owner: string;
  updatedAt: string;
  summary: string;
};

export type AdminUserRow = {
  id: string;
  displayName: string;
  email: string;
  role: string;
  access: string;
  teams: string;
  lastAccess: string;
};

export type AdminAssignmentRow = {
  id: string;
  coach: string;
  role: string;
  team: string;
  season: string;
  status: string;
};

export type AdminSeasonRow = {
  id: string;
  season: string;
  status: string;
  teams: string;
  summary: string;
};

export type AdminPlayerRow = {
  id: string;
  player: string;
  team: string;
  position: string;
  dorsal: string;
  pie: string;
  pais: string;
  goles: string;
  asistencias: string;
  participaciones: string;
  estado: string;
};

export type AdminMatchRow = {
  id: string;
  team: string;
  opponent: string;
  competition: string;
  date: string;
  status: string;
  score: string;
  video: string;
};

export type AdminStandingSummary = {
  teamSlug: string;
  teamName: string;
  competition: string;
  season: string;
  rows: DemoStandingRow[];
};

export type AdminStatsRow = {
  id: string;
  player: string;
  team: string;
  match: string;
  goals: string;
  assists: string;
  participation: string;
  rating: string;
  status: string;
};

export type AdminDashboardData = {
  title: string;
  subtitle: string;
  metrics: AdminMetric[];
  quickActions: AdminQuickAction[];
  alerts: AdminAlert[];
  matchRows: AdminMatchRow[];
  newsRows: AdminNewsRow[];
  spotlightPlayers: AdminPlayerRow[];
  standings: AdminStandingSummary[];
};

const coachAssignedTeamSlugs = ["raimon-b"];

const extraNews: AdminNewsRow[] = [
  {
    id: "draft-1",
    title: "Convocatoria previa del Juvenil A",
    team: "Juvenil A",
    status: "Borrador",
    featured: false,
    date: "Hoy",
    video: "Sin video",
  },
  {
    id: "draft-2",
    title: "Resumen del fin de semana de cantera",
    team: "Club",
    status: "Borrador",
    featured: true,
    date: "Ayer",
    video: "Clip RR TV",
  },
];

export const adminNewsRows: AdminNewsRow[] = [
  ...publicNews.map((item, index) => ({
    id: `news-${index + 1}`,
    title: item.title,
    team: item.teamSlugs
      .map((teamSlug) => publicTeams.find((team) => team.slug === teamSlug)?.name ?? teamSlug)
      .join(", "),
    status: (index < 4 ? "Publicada" : "Borrador") as "Publicada" | "Borrador",
    featured: index === 0 || index === 3,
    date: item.publishedLabel,
    video: item.videoLabel ?? "Sin video",
  })),
  ...extraNews,
];

export const adminMediaRows: AdminMediaRow[] = [
  {
    id: "media-1",
    asset: "Hero primer equipo",
    type: "Banner",
    team: "Primer Equipo",
    usage: "Home publica",
    updatedAt: "Hoy",
    status: "Publicado",
  },
  {
    id: "media-2",
    asset: "Cromo Axel Blaze",
    type: "Cromo premium",
    team: "Primer Equipo",
    usage: "Plantilla premium",
    updatedAt: "Ayer",
    status: "Publicado",
  },
  {
    id: "media-3",
    asset: "Raimon B card set",
    type: "Cromo web",
    team: "Raimon B",
    usage: "Plantilla cantera",
    updatedAt: "Hace 2 dias",
    status: "Publicado",
  },
  {
    id: "media-4",
    asset: "Banners academia",
    type: "Pack de imagenes",
    team: "Club",
    usage: "Noticias y home",
    updatedAt: "Hace 3 dias",
    status: "Pendiente",
  },
];

export const adminImportRows: AdminImportRow[] = [
  {
    id: "import-1",
    fileName: "rr_snapshot_2026_27_teams.csv",
    entity: "Equipos",
    status: "Aplicado",
    owner: "A. Admin",
    updatedAt: "15 mayo 2026",
    summary: "12 equipos sincronizados",
  },
  {
    id: "import-2",
    fileName: "rr_snapshot_2026_27_players.csv",
    entity: "Jugadores",
    status: "Validado",
    owner: "A. Admin",
    updatedAt: "14 mayo 2026",
    summary: "241 jugadores listos",
  },
  {
    id: "import-3",
    fileName: "rr_snapshot_assignments.zip",
    entity: "Asignaciones",
    status: "Pendiente",
    owner: "M. Manager",
    updatedAt: "12 mayo 2026",
    summary: "Diff pendiente de revision",
  },
];

export const adminUserRows: AdminUserRow[] = [
  {
    id: "user-1",
    displayName: "Aaron Admin",
    email: "superadmin@risingraimon.local",
    role: "Superadmin",
    access: "Activo",
    teams: "Global",
    lastAccess: "Hoy 09:12",
  },
  {
    id: "user-2",
    displayName: "Marta Manager",
    email: "manager@risingraimon.local",
    role: "Manager",
    access: "Activo",
    teams: "Global",
    lastAccess: "Hoy 08:31",
  },
  {
    id: "user-3",
    displayName: "Miguel Evans",
    email: "entrenador.raimonb@risingraimon.local",
    role: "Entrenador",
    access: "Activo",
    teams: "Raimon B",
    lastAccess: "Ayer 22:10",
  },
  {
    id: "user-4",
    displayName: "Daniel Wintersea",
    email: "Sin cuenta",
    role: "Entrenador visible",
    access: "Sin acceso",
    teams: "Juvenil A",
    lastAccess: "No aplica",
  },
];

export const adminAssignmentRows: AdminAssignmentRow[] = [
  {
    id: "assign-1",
    coach: "Miguel Evans",
    role: "Entrenador",
    team: "Raimon B",
    season: "2026/27",
    status: "Principal",
  },
  {
    id: "assign-2",
    coach: "Daniel Wintersea",
    role: "Entrenador visible",
    team: "Juvenil A",
    season: "2026/27",
    status: "Publico",
  },
  {
    id: "assign-3",
    coach: "T. Raimon",
    role: "Entrenador visible",
    team: "Cadete A",
    season: "2026/27",
    status: "Publico",
  },
];

export const adminSeasonRows: AdminSeasonRow[] = [
  {
    id: "season-1",
    season: "2026/27",
    status: "Activa",
    teams: "12 equipos",
    summary: "Operacion principal del club",
  },
  {
    id: "season-2",
    season: "2025/26",
    status: "Archivada",
    teams: "10 equipos",
    summary: "Historico consultable",
  },
];

function getScopedTeamSlugs(role: UserRole) {
  return role === UserRole.COACH ? coachAssignedTeamSlugs : publicTeams.map((team) => team.slug);
}

function getScopedTeams(role: UserRole) {
  const teamSlugs = getScopedTeamSlugs(role);
  return publicTeams.filter((team) => teamSlugs.includes(team.slug));
}

export function getScopedStandings(role: UserRole): AdminStandingSummary[] {
  return getScopedTeams(role).map((team) => ({
    teamSlug: team.slug,
    teamName: team.name,
    competition: team.competition,
    season: team.season,
    rows: getStandings(team.slug),
  }));
}

export function getScopedPlayerRows(role: UserRole): AdminPlayerRow[] {
  const teamSlugs = getScopedTeamSlugs(role);

  return publicPlayers
    .filter((player) => teamSlugs.includes(player.teamSlug))
    .map((player) => ({
      id: player.slug,
      player: player.name,
      team: player.teamName,
      position: player.position,
      dorsal: `${player.number}`,
      pie: player.foot,
      pais: player.country,
      goles: `${player.goals}`,
      asistencias: `${player.assists}`,
      participaciones: `${player.goals + player.assists}`,
      estado: player.premium ? "Premium" : "Activo",
    }));
}

export function getScopedMatchRows(role: UserRole): AdminMatchRow[] {
  const teamSlugs = getScopedTeamSlugs(role);

  return publicMatches
    .filter((match) => teamSlugs.includes(match.teamSlug))
    .map((match) => ({
      id: match.id,
      team: match.teamName,
      opponent: match.opponentName,
      competition: match.competition,
      date: match.dateLabel,
      status: match.status,
      score: match.score ?? "Pendiente",
      video: match.videoLabel ?? "Sin video",
    }));
}

export function getScopedNewsRows(role: UserRole) {
  if (role === UserRole.COACH) {
    return adminNewsRows.filter((item) => item.team.includes("Raimon B")).slice(0, 3);
  }

  return adminNewsRows;
}

export function getScopedMediaRows(role: UserRole) {
  if (role === UserRole.COACH) {
    return adminMediaRows.filter((item) => item.team === "Raimon B");
  }

  return adminMediaRows;
}

export function getScopedImportRows(role: UserRole) {
  return role === UserRole.SUPERADMIN ? adminImportRows : [];
}

export function getScopedUserRows(role: UserRole) {
  return role === UserRole.SUPERADMIN ? adminUserRows : [];
}

export function getCoachTasks() {
  return [
    {
      id: "task-1",
      title: "Confirmar proximo partido",
      detail: "Raimon B vs Royal Academy B",
      href: "/admin/partidos",
      status: "Pendiente",
    },
    {
      id: "task-2",
      title: "Actualizar clasificacion",
      detail: "Preferente - Jornada 8",
      href: "/admin/clasificaciones",
      status: "Hoy",
    },
    {
      id: "task-3",
      title: "Registrar goles y asistencias",
      detail: "Partido vs Inazuma Junior",
      href: "/admin/estadisticas",
      status: "Pendiente",
    },
  ];
}

export function getAdminDashboardData(role: UserRole): AdminDashboardData {
  if (role === UserRole.COACH) {
    const team = publicTeams.find((item) => item.slug === coachAssignedTeamSlugs[0])!;

    return {
      title: "Panel del entrenador",
      subtitle: `${team.name} · ${team.competition}`,
      metrics: [
        { label: "Plantilla", value: `${team.rosterCount}`, helper: "Jugadores asignados" },
        { label: "Proximo partido", value: "1", helper: "Pendiente de validar" },
        { label: "Clasificacion", value: `${team.position}`, helper: "Posicion actual" },
      ],
      quickActions: [
        {
          label: "Actualizar proximo partido",
          href: "/admin/partidos",
          description: "Fecha, sede y estado",
        },
        {
          label: "Editar clasificacion",
          href: "/admin/clasificaciones",
          description: "Puntos, PJ y posiciones",
        },
        {
          label: "Registrar estadisticas",
          href: "/admin/estadisticas",
          description: "Goles, asistencias y rendimiento",
        },
      ],
      alerts: [
        {
          id: "coach-alert-1",
          title: "Video pendiente de enlazar",
          detail: "Ultimo partido jugado sin clip asociado.",
          tone: "blue",
        },
        {
          id: "coach-alert-2",
          title: "Clasificacion sin revisar",
          detail: "Actualiza la jornada 8 antes de las 21:00.",
          tone: "gold",
        },
      ],
      matchRows: getScopedMatchRows(role).slice(0, 4),
      newsRows: getScopedNewsRows(role),
      spotlightPlayers: getScopedPlayerRows(role).slice(0, 4),
      standings: getScopedStandings(role),
    };
  }

  if (role === UserRole.MANAGER) {
    return {
      title: "Operacion deportiva",
      subtitle: "Vision global de equipos, contenidos y competicion",
      metrics: [
        { label: "Equipos visibles", value: `${publicTeams.length}`, helper: "Temporada activa" },
        { label: "Jugadores", value: `${getClubPlayerCount()}`, helper: "En plantilla" },
        { label: "Partidos", value: `${publicMatches.length}`, helper: "Con estado definido" },
        { label: "Borradores", value: `${adminNewsRows.filter((item) => item.status === "Borrador").length}`, helper: "Listos para revisar" },
      ],
      quickActions: [
        { label: "Gestionar equipos", href: "/admin/equipos", description: "Visibilidad, categoria y estado" },
        { label: "Revisar noticias", href: "/admin/noticias", description: "Publicadas, borradores y destacadas" },
        { label: "Actualizar estadisticas", href: "/admin/estadisticas", description: "Rendimiento por partido" },
      ],
      alerts: [
        {
          id: "manager-alert-1",
          title: "Dos noticias siguen en borrador",
          detail: "Pendientes de revision editorial.",
          tone: "gold",
        },
        {
          id: "manager-alert-2",
          title: "Media de cantera pendiente",
          detail: "Banners de academia sin publicar.",
          tone: "blue",
        },
      ],
      matchRows: getScopedMatchRows(role).slice(0, 6),
      newsRows: getScopedNewsRows(role).slice(0, 5),
      spotlightPlayers: getScopedPlayerRows(role).slice(0, 6),
      standings: getScopedStandings(role).slice(0, 2),
    };
  }

  return {
    title: "Control global del club",
    subtitle: "Backoffice maestro con usuarios, importaciones y supervision deportiva",
    metrics: [
      { label: "Temporada", value: "2026/27", helper: "Activa" },
      { label: "Equipos", value: `${publicTeams.length}`, helper: "Visibles en web" },
      { label: "Usuarios", value: `${adminUserRows.length}`, helper: "Internos y visibles" },
      { label: "Importaciones", value: `${adminImportRows.length}`, helper: "Ultimos procesos" },
    ],
    quickActions: [
      { label: "Abrir importaciones", href: "/admin/importaciones", description: "Validar snapshot rr-management" },
      { label: "Gestionar usuarios", href: "/admin/usuarios", description: "Roles y acceso interno" },
      { label: "Revisar equipos", href: "/admin/equipos", description: "Visibilidad y temporada" },
    ],
    alerts: [
      {
        id: "admin-alert-1",
        title: "Snapshot listo para aplicar",
        detail: "241 jugadores validados en rr_snapshot_2026_27_players.csv.",
        tone: "gold",
      },
      {
        id: "admin-alert-2",
        title: "Un entrenador visible no tiene cuenta",
        detail: "Daniel Wintersea figura como coach publico sin acceso al admin.",
        tone: "danger",
      },
    ],
    matchRows: getScopedMatchRows(role).slice(0, 6),
    newsRows: getScopedNewsRows(role).slice(0, 5),
    spotlightPlayers: getScopedPlayerRows(role).slice(0, 5),
    standings: getScopedStandings(role).slice(0, 2),
  };
}

export function getCoachMobileSummary() {
  const team = publicTeams.find((item) => item.slug === coachAssignedTeamSlugs[0])!;
  const nextMatch = getUpcomingMatch(team.slug);
  const lastResult = getLatestResults(team.slug)[0] ?? null;

  return {
    team,
    nextMatch,
    lastResult,
    tasks: getCoachTasks(),
    players: getTeamPlayers(team.slug).slice(0, 4),
    standings: getStandings(team.slug),
  };
}

export function getClubOverviewMock() {
  return {
    activeSeason: "2026/27",
    visibleTeams: publicTeams.length,
    totalPlayers: getClubPlayerCount(),
    upcomingMatches: publicTeams
      .map((team) => getUpcomingMatch(team.slug))
      .filter(Boolean) as DemoMatch[],
    recentResults: publicTeams.flatMap((team) => getLatestResults(team.slug)).slice(0, 4),
    highlightedAcademy: publicTeams.filter((team) => !team.isFirstTeam).slice(0, 3),
    recentNews: publicNews.slice(0, 4),
  };
}

export function getAdminStatsRows(role: UserRole): AdminStatsRow[] {
  const teamSlugs = getScopedTeamSlugs(role);

  return publicPlayers
    .filter((player) => teamSlugs.includes(player.teamSlug))
    .slice(0, 8)
    .map((player, index) => {
      const teamMatches = getTeamMatches(player.teamSlug);
      const match = teamMatches.find((item) => item.status === "Jugado") ?? teamMatches[0];

      return {
        id: `${player.slug}-${index}`,
        player: player.name,
        team: player.teamName,
        match: match ? `${match.teamName} vs ${match.opponentName}` : "Sin partido",
        goals: `${player.goals}`,
        assists: `${player.assists}`,
        participation: `${player.goals + player.assists}`,
        rating: player.premium ? "8.4" : "7.1",
        status: match?.status ?? "Pendiente",
      };
    });
}
