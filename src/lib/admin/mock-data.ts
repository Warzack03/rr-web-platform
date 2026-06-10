import { adminRoleLabels, type AdminRole } from "@/lib/admin/roles";

export type AdminTeamVisibility = "visible" | "hidden";
export type AdminMatchStatus = "scheduled" | "live" | "played" | "postponed";
export type AdminNewsStatus = "published" | "draft";
export type AdminImportStatus = "pending" | "completed" | "conflict";
export type AdminMediaType = "logo" | "banner" | "player-photo" | "card" | "placeholder";

export type AdminMockUser = {
  id: string;
  displayName: string;
  email?: string;
  username?: string;
  role: AdminRole;
  roleLabel: string;
  assignedTeamSlugs: string[];
  note?: string;
};

export type AdminSeason = {
  id: string;
  name: string;
  status: "active" | "archived";
  dateRange: string;
};

export type AdminTeam = {
  id: string;
  slug: string;
  name: string;
  category: string;
  competition: string;
  season: string;
  branch: string;
  visible: boolean;
  active: boolean;
  firstTeam: boolean;
  primaryCoach: string;
  visibleCoaches: string[];
  playerCount: number;
  nextMatchLabel: string;
  accent: string;
};

export type AdminPlayer = {
  id: string;
  name: string;
  teamSlug: string;
  number: number;
  position: "POR" | "DEF" | "MED" | "DEL";
  foot: "Derecha" | "Izquierda" | "Ambas";
  country: string;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  mvp: number;
  cleanSheets: number;
  advancedLabel?: string;
};

export type AdminMatch = {
  id: string;
  teamSlug: string;
  teamName: string;
  opponentName: string;
  matchday: string;
  dateLabel: string;
  venue: string;
  status: AdminMatchStatus;
  home: boolean;
  scoreLabel?: string;
  liveNote?: string;
};

export type AdminStandingRow = {
  position: number;
  teamName: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  ownTeam?: boolean;
};

export type AdminStandingTable = {
  teamSlug: string;
  title: string;
  updatedLabel: string;
  rows: AdminStandingRow[];
};

export type AdminNewsItem = {
  id: string;
  title: string;
  teamSlug: string;
  status: AdminNewsStatus;
  featured: boolean;
  updatedLabel: string;
};

export type AdminMediaItem = {
  id: string;
  label: string;
  type: AdminMediaType;
  updatedLabel: string;
  format: string;
};

export type AdminImportItem = {
  id: string;
  seasonName: string;
  status: AdminImportStatus;
  fileName: string;
  updatedLabel: string;
  conflictCount: number;
};

export type AdminQuickActionItem = {
  label: string;
  href: string;
  accent?: "gold" | "slate";
};

export type AdminMetric = {
  label: string;
  value: string;
  detail: string;
  tone?: "gold" | "blue" | "slate" | "danger";
};

export type AdminDashboardView = {
  heading: string;
  intro: string;
  metrics: AdminMetric[];
  quickActions: AdminQuickActionItem[];
  focusCards: {
    title: string;
    value: string;
    detail: string;
  }[];
};

export type AdminSectionOverviewConfig = {
  title: string;
  eyebrow: string;
  description: string;
  metrics: AdminMetric[];
  highlights: {
    title: string;
    items: string[];
  }[];
};

export const adminMockUsers: AdminMockUser[] = [
  {
    id: "user-superadmin",
    displayName: "Superadmin Demo",
    email: "admin@risingraimon.local",
    username: "superadmin",
    role: "SUPERADMIN",
    roleLabel: adminRoleLabels.SUPERADMIN,
    assignedTeamSlugs: [],
  },
  {
    id: "user-manager",
    displayName: "Manager Demo",
    email: "manager@risingraimon.local",
    username: "manager",
    role: "MANAGER",
    roleLabel: adminRoleLabels.MANAGER,
    assignedTeamSlugs: [],
  },
  {
    id: "user-coach-primer-equipo",
    displayName: "Marcos Varela",
    email: "entrenador_primer_equipo@risingraimon.local",
    username: "entrenador_primer_equipo",
    role: "COACH",
    roleLabel: adminRoleLabels.COACH,
    assignedTeamSlugs: ["primer-equipo"],
    note: "Cuenta demo orientada a uso movil en dia de partido.",
  },
  {
    id: "user-coach-raimon-b",
    displayName: "Sergio Mena",
    email: "entrenador_raimon_b@risingraimon.local",
    username: "entrenador_raimon_b",
    role: "COACH",
    roleLabel: adminRoleLabels.COACH,
    assignedTeamSlugs: ["raimon-b"],
  },
  {
    id: "user-coach-juvenil-a",
    displayName: "Ivan Lobo",
    email: "entrenador_juvenil_a@risingraimon.local",
    username: "entrenador_juvenil_a",
    role: "COACH",
    roleLabel: adminRoleLabels.COACH,
    assignedTeamSlugs: ["juvenil-a"],
  },
  {
    id: "visible-coach-lucia-serrano",
    displayName: "Lucia Serrano",
    role: "COACH",
    roleLabel: "Visible sin cuenta",
    assignedTeamSlugs: ["juvenil-a"],
    note: "Entrenadora visible en web sin acceso interno.",
  },
  {
    id: "visible-coach-marta-solis",
    displayName: "Marta Solis",
    role: "COACH",
    roleLabel: "Visible sin cuenta",
    assignedTeamSlugs: ["cadete-a"],
  },
];

export const adminMockSeasons: AdminSeason[] = [
  {
    id: "season-2026-2027",
    name: "2026/2027",
    status: "active",
    dateRange: "Sep 2026 · Jun 2027",
  },
  {
    id: "season-2025-2026",
    name: "2025/2026",
    status: "archived",
    dateRange: "Sep 2025 · Jun 2026",
  },
  {
    id: "season-2024-2025",
    name: "2024/2025",
    status: "archived",
    dateRange: "Sep 2024 · Jun 2025",
  },
];

export const adminMockTeams: AdminTeam[] = [
  {
    id: "team-primer-equipo",
    slug: "primer-equipo",
    name: "Primer Equipo",
    category: "Senior",
    competition: "Liga Autonomica Senior · Grupo 2",
    season: "2026/2027",
    branch: "Madrid",
    visible: true,
    active: true,
    firstTeam: true,
    primaryCoach: "Entrenador Primer Equipo",
    visibleCoaches: ["Marcos Varela", "Lucia Serrano", "Diego Roman"],
    playerCount: 22,
    nextMatchLabel: "Dom 15 Jun · 18:00 · Escuela Sur Madrid",
    accent: "from-[rgba(253,203,88,0.18)] to-[rgba(253,203,88,0.03)]",
  },
  {
    id: "team-raimon-b",
    slug: "raimon-b",
    name: "Raimon B",
    category: "Senior B",
    competition: "Liga Regional Preferente",
    season: "2026/2027",
    branch: "Madrid",
    visible: true,
    active: true,
    firstTeam: false,
    primaryCoach: "Sergio Mena",
    visibleCoaches: ["Sergio Mena", "Claudia Torres"],
    playerCount: 19,
    nextMatchLabel: "Sab 14 Jun · 19:30 · CD Moratalaz B",
    accent: "from-[rgba(52,112,200,0.22)] to-[rgba(52,112,200,0.04)]",
  },
  {
    id: "team-juvenil-a",
    slug: "juvenil-a",
    name: "Juvenil A",
    category: "Juvenil",
    competition: "Liga Juvenil Preferente",
    season: "2026/2027",
    branch: "Madrid",
    visible: true,
    active: true,
    firstTeam: false,
    primaryCoach: "Ivan Lobo",
    visibleCoaches: ["Ivan Lobo", "Lucia Serrano"],
    playerCount: 20,
    nextMatchLabel: "Sab 14 Jun · 11:00 · EF Retiro",
    accent: "from-[rgba(255,255,255,0.1)] to-[rgba(255,255,255,0.02)]",
  },
  {
    id: "team-juvenil-b",
    slug: "juvenil-b",
    name: "Juvenil B",
    category: "Juvenil",
    competition: "Liga Juvenil Municipal",
    season: "2026/2027",
    branch: "Madrid",
    visible: true,
    active: true,
    firstTeam: false,
    primaryCoach: "Noelia Cabal",
    visibleCoaches: ["Noelia Cabal"],
    playerCount: 18,
    nextMatchLabel: "Dom 15 Jun · 10:00 · Colegio Norte",
    accent: "from-[rgba(253,203,88,0.12)] to-[rgba(255,255,255,0.02)]",
  },
  {
    id: "team-cadete-a",
    slug: "cadete-a",
    name: "Cadete A",
    category: "Cadete",
    competition: "Liga Cadete Municipal",
    season: "2026/2027",
    branch: "Madrid",
    visible: true,
    active: true,
    firstTeam: false,
    primaryCoach: "Rafa Nieto",
    visibleCoaches: ["Rafa Nieto", "Marta Solis"],
    playerCount: 18,
    nextMatchLabel: "Sab 14 Jun · 09:30 · AD Chamberi",
    accent: "from-[rgba(52,112,200,0.16)] to-[rgba(255,255,255,0.02)]",
  },
  {
    id: "team-infantil-a",
    slug: "infantil-a",
    name: "Infantil A",
    category: "Infantil",
    competition: "Liga Infantil Municipal",
    season: "2026/2027",
    branch: "Madrid",
    visible: false,
    active: true,
    firstTeam: false,
    primaryCoach: "Hector Blasco",
    visibleCoaches: ["Hector Blasco"],
    playerCount: 17,
    nextMatchLabel: "Pendiente de fecha",
    accent: "from-[rgba(255,255,255,0.08)] to-[rgba(52,112,200,0.04)]",
  },
];

export const adminMockPlayers: AdminPlayer[] = [
  {
    id: "player-1",
    name: "Iker Morales",
    teamSlug: "primer-equipo",
    number: 1,
    position: "POR",
    foot: "Derecha",
    country: "ES",
    goals: 0,
    assists: 0,
    yellowCards: 0,
    redCards: 0,
    mvp: 1,
    cleanSheets: 4,
    advancedLabel: "5 paradas por partido",
  },
  {
    id: "player-2",
    name: "Mateo Silva",
    teamSlug: "primer-equipo",
    number: 4,
    position: "DEF",
    foot: "Derecha",
    country: "PT",
    goals: 1,
    assists: 0,
    yellowCards: 3,
    redCards: 0,
    mvp: 1,
    cleanSheets: 0,
    advancedLabel: "11 recuperaciones",
  },
  {
    id: "player-3",
    name: "Sergio Lopez",
    teamSlug: "primer-equipo",
    number: 8,
    position: "MED",
    foot: "Izquierda",
    country: "ES",
    goals: 2,
    assists: 5,
    yellowCards: 2,
    redCards: 0,
    mvp: 2,
    cleanSheets: 0,
    advancedLabel: "2.3 ocasiones creadas",
  },
  {
    id: "player-4",
    name: "Nico Paredes",
    teamSlug: "primer-equipo",
    number: 9,
    position: "DEL",
    foot: "Derecha",
    country: "AR",
    goals: 9,
    assists: 3,
    yellowCards: 1,
    redCards: 0,
    mvp: 4,
    cleanSheets: 0,
    advancedLabel: "3 tiros a puerta",
  },
  {
    id: "player-5",
    name: "Adrian Reyes",
    teamSlug: "juvenil-a",
    number: 1,
    position: "POR",
    foot: "Derecha",
    country: "ES",
    goals: 0,
    assists: 0,
    yellowCards: 0,
    redCards: 0,
    mvp: 1,
    cleanSheets: 5,
  },
  {
    id: "player-6",
    name: "Hugo Martin",
    teamSlug: "juvenil-a",
    number: 7,
    position: "DEL",
    foot: "Izquierda",
    country: "ES",
    goals: 8,
    assists: 2,
    yellowCards: 2,
    redCards: 0,
    mvp: 3,
    cleanSheets: 0,
  },
  {
    id: "player-7",
    name: "Leo Santos",
    teamSlug: "juvenil-a",
    number: 10,
    position: "MED",
    foot: "Derecha",
    country: "BR",
    goals: 4,
    assists: 6,
    yellowCards: 1,
    redCards: 0,
    mvp: 2,
    cleanSheets: 0,
  },
  {
    id: "player-8",
    name: "Pablo Navarro",
    teamSlug: "cadete-a",
    number: 5,
    position: "DEF",
    foot: "Derecha",
    country: "ES",
    goals: 1,
    assists: 1,
    yellowCards: 3,
    redCards: 0,
    mvp: 0,
    cleanSheets: 0,
  },
  {
    id: "player-9",
    name: "Youssef Bennani",
    teamSlug: "cadete-a",
    number: 11,
    position: "DEL",
    foot: "Izquierda",
    country: "MA",
    goals: 7,
    assists: 2,
    yellowCards: 1,
    redCards: 0,
    mvp: 2,
    cleanSheets: 0,
  },
  {
    id: "player-10",
    name: "Gael Ruiz",
    teamSlug: "cadete-a",
    number: 13,
    position: "POR",
    foot: "Derecha",
    country: "ES",
    goals: 0,
    assists: 0,
    yellowCards: 0,
    redCards: 0,
    mvp: 1,
    cleanSheets: 3,
  },
];

export const adminMockMatches: AdminMatch[] = [
  {
    id: "match-101",
    teamSlug: "primer-equipo",
    teamName: "Primer Equipo",
    opponentName: "Escuela Sur Madrid",
    matchday: "Jornada 28",
    dateLabel: "Dom 15 Jun · 18:00",
    venue: "Campo Rising Raimon",
    status: "live",
    home: true,
    scoreLabel: "1 - 0",
    liveNote: "62' · Presion alta y dominio territorial",
  },
  {
    id: "match-102",
    teamSlug: "primer-equipo",
    teamName: "Primer Equipo",
    opponentName: "CD Hortaleza",
    matchday: "Jornada 29",
    dateLabel: "Dom 22 Jun · 17:00",
    venue: "Ciudad Deportiva Sur",
    status: "scheduled",
    home: false,
  },
  {
    id: "match-103",
    teamSlug: "raimon-b",
    teamName: "Raimon B",
    opponentName: "CD Moratalaz B",
    matchday: "Jornada 24",
    dateLabel: "Sab 14 Jun · 19:30",
    venue: "Municipal Moratalaz",
    status: "scheduled",
    home: false,
  },
  {
    id: "match-104",
    teamSlug: "juvenil-a",
    teamName: "Juvenil A",
    opponentName: "EF Retiro",
    matchday: "Jornada 21",
    dateLabel: "Sab 14 Jun · 11:00",
    venue: "Polideportivo Este",
    status: "postponed",
    home: true,
  },
  {
    id: "match-105",
    teamSlug: "juvenil-b",
    teamName: "Juvenil B",
    opponentName: "Colegio Norte",
    matchday: "Jornada 18",
    dateLabel: "Dom 15 Jun · 10:00",
    venue: "Colegio Norte",
    status: "scheduled",
    home: false,
  },
  {
    id: "match-106",
    teamSlug: "cadete-a",
    teamName: "Cadete A",
    opponentName: "AD Chamberi",
    matchday: "Jornada 20",
    dateLabel: "Sab 14 Jun · 09:30",
    venue: "Campo Chamberi",
    status: "played",
    home: false,
    scoreLabel: "2 - 3",
  },
  {
    id: "match-107",
    teamSlug: "infantil-a",
    teamName: "Infantil A",
    opponentName: "EMF Vallecas",
    matchday: "Jornada 19",
    dateLabel: "Fecha por confirmar",
    venue: "Pendiente",
    status: "postponed",
    home: true,
  },
];

export const adminMockStandings: AdminStandingTable[] = [
  {
    teamSlug: "primer-equipo",
    title: "Clasificacion Liga Autonomica Senior",
    updatedLabel: "Actualizado tras jornada 27",
    rows: [
      {
        position: 1,
        teamName: "Rising Raimon",
        played: 27,
        won: 21,
        drawn: 3,
        lost: 3,
        goalsFor: 58,
        goalsAgainst: 21,
        goalDifference: 37,
        points: 66,
        ownTeam: true,
      },
      {
        position: 2,
        teamName: "Union Deportiva Vallecas",
        played: 27,
        won: 19,
        drawn: 4,
        lost: 4,
        goalsFor: 49,
        goalsAgainst: 25,
        goalDifference: 24,
        points: 61,
      },
      {
        position: 3,
        teamName: "CD Hortaleza",
        played: 27,
        won: 18,
        drawn: 5,
        lost: 4,
        goalsFor: 46,
        goalsAgainst: 28,
        goalDifference: 18,
        points: 59,
      },
      {
        position: 4,
        teamName: "Escuela Sur Madrid",
        played: 27,
        won: 15,
        drawn: 6,
        lost: 6,
        goalsFor: 44,
        goalsAgainst: 31,
        goalDifference: 13,
        points: 51,
      },
    ],
  },
  {
    teamSlug: "juvenil-a",
    title: "Clasificacion Liga Juvenil Preferente",
    updatedLabel: "Pendiente de validar jornada 20",
    rows: [
      {
        position: 1,
        teamName: "EF Retiro",
        played: 20,
        won: 15,
        drawn: 3,
        lost: 2,
        goalsFor: 42,
        goalsAgainst: 16,
        goalDifference: 26,
        points: 48,
      },
      {
        position: 2,
        teamName: "Rising Raimon Juvenil A",
        played: 20,
        won: 14,
        drawn: 4,
        lost: 2,
        goalsFor: 38,
        goalsAgainst: 18,
        goalDifference: 20,
        points: 46,
        ownTeam: true,
      },
      {
        position: 3,
        teamName: "Canillas Academy",
        played: 20,
        won: 13,
        drawn: 4,
        lost: 3,
        goalsFor: 35,
        goalsAgainst: 19,
        goalDifference: 16,
        points: 43,
      },
      {
        position: 4,
        teamName: "Atletico Este",
        played: 20,
        won: 10,
        drawn: 5,
        lost: 5,
        goalsFor: 27,
        goalsAgainst: 21,
        goalDifference: 6,
        points: 35,
      },
    ],
  },
];

export const adminMockNews: AdminNewsItem[] = [
  {
    id: "news-1",
    title: "Rising Raimon cierra una semana clave de entrenamientos",
    teamSlug: "primer-equipo",
    status: "published",
    featured: true,
    updatedLabel: "Hace 3 h",
  },
  {
    id: "news-2",
    title: "Sesion fotografica para cromos del Juvenil A",
    teamSlug: "juvenil-a",
    status: "draft",
    featured: false,
    updatedLabel: "Hace 7 h",
  },
  {
    id: "news-3",
    title: "Cadete A suma otra victoria fuera de casa",
    teamSlug: "cadete-a",
    status: "published",
    featured: false,
    updatedLabel: "Ayer",
  },
];

export const adminMockMedia: AdminMediaItem[] = [
  {
    id: "media-1",
    label: "Logo Principal 2026",
    type: "logo",
    updatedLabel: "Hoy · SVG",
    format: "SVG",
  },
  {
    id: "media-2",
    label: "Banner Primer Equipo",
    type: "banner",
    updatedLabel: "Ayer · 2400x900",
    format: "PNG",
  },
  {
    id: "media-3",
    label: "Foto Nico Paredes",
    type: "player-photo",
    updatedLabel: "Hace 2 dias",
    format: "JPG",
  },
  {
    id: "media-4",
    label: "Cromo premium Primer Equipo",
    type: "card",
    updatedLabel: "Hace 3 dias",
    format: "Layered UI",
  },
  {
    id: "media-5",
    label: "Placeholder rival municipal",
    type: "placeholder",
    updatedLabel: "Hace 1 semana",
    format: "PNG",
  },
];

export const adminMockImports: AdminImportItem[] = [
  {
    id: "import-1",
    seasonName: "2026/2027",
    status: "completed",
    fileName: "rrm-season-2026-06-01.zip",
    updatedLabel: "Aplicada · hace 2 dias",
    conflictCount: 0,
  },
  {
    id: "import-2",
    seasonName: "2026/2027",
    status: "pending",
    fileName: "rrm-season-2026-06-08.zip",
    updatedLabel: "Pendiente de revisar",
    conflictCount: 2,
  },
  {
    id: "import-3",
    seasonName: "2025/2026",
    status: "conflict",
    fileName: "rrm-archive-2025-05-31.zip",
    updatedLabel: "Conflictos en asignaciones",
    conflictCount: 5,
  },
];

export function getAssignedTeamSlugs(role: AdminRole) {
  if (role !== "COACH") {
    return adminMockTeams.map((team) => team.slug);
  }

  return adminMockUsers.find((user) => user.role === "COACH" && user.username)?.assignedTeamSlugs ?? [
    "primer-equipo",
  ];
}

export function getTeamsForRole(role: AdminRole) {
  const allowedTeamSlugs = new Set(getAssignedTeamSlugs(role));
  return adminMockTeams.filter((team) => allowedTeamSlugs.has(team.slug));
}

export function getMatchesForRole(role: AdminRole) {
  const allowedTeamSlugs = new Set(getAssignedTeamSlugs(role));
  return adminMockMatches.filter((match) => allowedTeamSlugs.has(match.teamSlug));
}

export function getPlayersForRole(role: AdminRole) {
  const allowedTeamSlugs = new Set(getAssignedTeamSlugs(role));
  return adminMockPlayers.filter((player) => allowedTeamSlugs.has(player.teamSlug));
}

export function getNewsForRole(role: AdminRole) {
  if (role === "COACH") {
    return [];
  }

  return adminMockNews;
}

export function getImportsForRole(role: AdminRole) {
  return role === "SUPERADMIN" ? adminMockImports : [];
}

export function getDashboardView(role: AdminRole): AdminDashboardView {
  if (role === "COACH") {
    const assignedTeam = getTeamsForRole(role)[0];
    const teamMatches = getMatchesForRole(role);
    const nextMatch =
      teamMatches.find((match) => match.status === "live" || match.status === "scheduled") ?? teamMatches[0];
    const standing = adminMockStandings.find((table) => table.teamSlug === assignedTeam?.slug);
    const topPlayers = getPlayersForRole(role)
      .sort((left, right) => right.goals + right.assists - (left.goals + left.assists))
      .slice(0, 2);

    return {
      heading: assignedTeam?.name ?? "Equipo asignado",
      intro: "",
      metrics: [
        {
          label: "Proximo paso",
          value: nextMatch?.status === "live" ? "En juego" : "Partido listo",
          detail: nextMatch?.dateLabel ?? "Sin partido asignado",
          tone: nextMatch?.status === "live" ? "danger" : "gold",
        },
        {
          label: "Ultimo resultado",
          value: "2 - 2",
          detail: "Empate frente a Escuela Sur Madrid",
          tone: "blue",
        },
        {
          label: "Clasificacion",
          value: standing?.rows.find((row) => row.ownTeam)?.position.toString() ?? "-",
          detail: standing?.updatedLabel ?? "Tabla pendiente",
          tone: "slate",
        },
      ],
      quickActions: [
        { label: "Actualizar proximo partido", href: "/admin/partidos" },
        { label: "Introducir resultado", href: "/admin/partidos" },
        { label: "Editar clasificacion", href: "/admin/clasificaciones", accent: "slate" },
        { label: "Editar goles y asistencias", href: "/admin/estadisticas" },
      ],
      focusCards: [
        {
          title: "Jugadores a mano",
          value: topPlayers.map((player) => player.name).join(" · "),
          detail: "Referencia directa para registrar la aportacion ofensiva.",
        },
        {
          title: "Pendiente",
          value: "Validar MVP y porterias a cero",
          detail: "Revisa los ultimos datos antes de cerrar el partido.",
        },
      ],
    };
  }

  if (role === "MANAGER") {
    return {
      heading: "Control deportivo y publico",
      intro: "",
      metrics: [
        {
          label: "Temporada activa",
          value: adminMockSeasons[0].name,
          detail: adminMockSeasons[0].dateRange,
          tone: "gold",
        },
        {
          label: "Equipos visibles",
          value: adminMockTeams.filter((team) => team.visible).length.toString(),
          detail: "6 estructuras con identidad publica preparada",
          tone: "blue",
        },
        {
          label: "Proximos partidos",
          value: adminMockMatches.filter((match) => match.status === "scheduled").length.toString(),
          detail: "Pendientes de revisar horario o rival",
          tone: "slate",
        },
        {
          label: "Noticias en borrador",
          value: adminMockNews.filter((item) => item.status === "draft").length.toString(),
          detail: "Piezas pendientes de publicar",
          tone: "gold",
        },
      ],
      quickActions: [
        { label: "Crear noticia", href: "/admin/noticias" },
        { label: "Editar partido", href: "/admin/partidos" },
        { label: "Actualizar clasificacion", href: "/admin/clasificaciones" },
        { label: "Gestionar equipo", href: "/admin/equipos", accent: "slate" },
        { label: "Subir media", href: "/admin/media" },
      ],
      focusCards: [
        {
          title: "Media pendiente",
          value: "4 recursos por revisar",
          detail: "Banners, fotos de jugador y placeholders de rivales.",
        },
        {
          title: "Entradas activas",
          value: "3 publicaciones destacadas",
          detail: "Revisa portada, cantera y primer equipo.",
        },
      ],
    };
  }

  return {
    heading: "Control global del backoffice",
    intro: "",
    metrics: [
      {
        label: "Temporada activa",
        value: adminMockSeasons[0].name,
        detail: adminMockSeasons[0].dateRange,
        tone: "gold",
      },
      {
        label: "Usuarios internos",
        value: adminMockUsers.filter((user) => user.email).length.toString(),
        detail: "Superadmin, manager y entrenador",
        tone: "blue",
      },
      {
        label: "Jugadores activos",
        value: adminMockPlayers.length.toString(),
        detail: "Plantilla disponible en el area deportiva",
        tone: "slate",
      },
      {
        label: "Importaciones recientes",
        value: adminMockImports.length.toString(),
        detail: "1 aplicada, 1 pendiente, 1 con conflictos",
        tone: "danger",
      },
    ],
    quickActions: [
      { label: "Importar desde rr-management", href: "/admin/importaciones" },
      { label: "Gestionar usuarios", href: "/admin/usuarios" },
      { label: "Gestionar equipos", href: "/admin/equipos", accent: "slate" },
      { label: "Revisar noticias", href: "/admin/noticias" },
      { label: "Ver partidos", href: "/admin/partidos" },
    ],
    focusCards: [
      {
        title: "Ultima importacion",
        value: adminMockImports[0].fileName,
        detail: adminMockImports[0].updatedLabel,
      },
      {
        title: "Alertas",
        value: "2 conflictos pendientes",
        detail: "Revisa las asignaciones antes de aplicar cambios.",
      },
    ],
  };
}

export function getSectionOverview(section: string, role: AdminRole): AdminSectionOverviewConfig {
  const isCoach = role === "COACH";

  switch (section) {
    case "temporadas":
      return {
        title: "Temporadas",
        eyebrow: "Planificacion deportiva",
        description: "Controla la temporada activa y consulta el historico del club.",
        metrics: [
          { label: "Temporada viva", value: "1", detail: "2026/2027 en foco", tone: "gold" },
          { label: "Historicas", value: "2", detail: "Listas para consulta", tone: "slate" },
        ],
        highlights: [
          {
            title: "Lo siguiente",
            items: ["Activar temporada", "Cerrar temporadas antiguas", "Revisar fechas clave"],
          },
          {
            title: "Temporadas",
            items: adminMockSeasons.map((season) => `${season.name} · ${season.status}`),
          },
        ],
      };
    case "jugadores":
      return {
        title: "Jugadores",
        eyebrow: isCoach ? "Consulta rapida" : "Plantilla publica",
        description: "",
        metrics: [
          { label: "Jugadores", value: adminMockPlayers.length.toString(), detail: "Porteros y jugadores de campo", tone: "gold" },
          { label: "Con stats", value: "10", detail: "Datos basicos y avanzados", tone: "blue" },
        ],
        highlights: [
          {
            title: "Equipo visible",
            items: getPlayersForRole(role)
              .slice(0, 4)
              .map((player) => `${player.number} · ${player.name} · ${player.position}`),
          },
          {
            title: "Ficha publica",
            items: ["Nombre publico", "Dorsal", "Posicion", "Pais", "Visibilidad", "Foto via media"],
          },
        ],
      };
    case "asignaciones":
      return {
        title: "Asignaciones",
        eyebrow: "Relacion jugador-equipo",
        description: "Organiza la relacion entre jugador, equipo y temporada.",
        metrics: [
          { label: "Equipos cubiertos", value: "6", detail: "Con categorias diferentes", tone: "gold" },
          { label: "Cambios manuales", value: "2", detail: "Casos que requeriran confirmacion", tone: "slate" },
        ],
        highlights: [
          {
            title: "Campos clave",
            items: ["Alta por temporada", "Dorsal por asignacion", "Capitan", "Orden visual"],
          },
          {
            title: "Notas",
            items: ["No mover stats historicas", "Permitir excepciones manuales", "Cerrar asignaciones previas"],
          },
        ],
      };
    case "clasificaciones":
      return {
        title: "Clasificaciones",
        eyebrow: isCoach ? "Uso rapido en campo" : "Clasificacion por equipo",
        description: "Consulta y actualiza la clasificacion de cada equipo.",
        metrics: [
          { label: "Tablas", value: adminMockStandings.length.toString(), detail: "Primer Equipo y cantera", tone: "gold" },
          { label: "Equipo destacado", value: "2", detail: "Filas marcadas como propias", tone: "blue" },
        ],
        highlights: [
          {
            title: "Actualizacion",
            items: adminMockStandings.map((standing) => `${standing.title} · ${standing.updatedLabel}`),
          },
          {
            title: "Campos clave",
            items: ["PJ", "PG", "PE", "PP", "GF", "GC", "DG", "PTS"],
          },
        ],
      };
    case "noticias":
      return {
        title: "Noticias",
        eyebrow: "Editorial publica",
        description: "Gestiona titulares, estado editorial y piezas destacadas.",
        metrics: [
          { label: "Publicadas", value: adminMockNews.filter((item) => item.status === "published").length.toString(), detail: "Listas para portada", tone: "gold" },
          { label: "Borradores", value: adminMockNews.filter((item) => item.status === "draft").length.toString(), detail: "Pendientes de revision", tone: "slate" },
        ],
        highlights: [
          {
            title: "Titulares",
            items: adminMockNews.map((item) => `${item.title} · ${item.updatedLabel}`),
          },
          {
            title: "Campos clave",
            items: ["Titulo", "Slug", "Extracto", "Bloques", "Imagen", "Video externo", "Relacion con equipos"],
          },
        ],
      };
    case "media":
      return {
        title: "Media",
        eyebrow: "Activos publicos",
        description: "Biblioteca visual para logos, banners, retratos y cromos.",
        metrics: [
          { label: "Recursos", value: adminMockMedia.length.toString(), detail: "Logo, banner, foto, cromo y placeholder", tone: "gold" },
          { label: "Pendientes", value: "2", detail: "Fotos y banners por validar", tone: "blue" },
        ],
        highlights: [
          {
            title: "Ultimos recursos",
            items: adminMockMedia.map((item) => `${item.label} · ${item.updatedLabel}`),
          },
          {
            title: "Usos",
            items: ["Logo de equipo", "Banner", "Foto de jugador", "Cromo", "Logo rival", "Cover de noticia"],
          },
        ],
      };
    case "importaciones":
      return {
        title: "Importaciones",
        eyebrow: "Solo superadmin",
        description: "Revisa el estado de cada importacion y los posibles conflictos.",
        metrics: [
          { label: "Aplicadas", value: adminMockImports.filter((item) => item.status === "completed").length.toString(), detail: "Historial reciente", tone: "gold" },
          { label: "Con conflictos", value: adminMockImports.filter((item) => item.status === "conflict").length.toString(), detail: "Requieren revision", tone: "danger" },
        ],
        highlights: [
          {
            title: "Ultimos lotes",
            items: adminMockImports.map((item) => `${item.fileName} · ${item.updatedLabel}`),
          },
          {
            title: "Proceso",
            items: ["Subir archivo", "Validar", "Revisar cambios", "Resolver conflictos", "Aplicar importacion"],
          },
        ],
      };
    case "usuarios":
      return {
        title: "Usuarios",
        eyebrow: "Acceso interno",
        description: "Gestiona cuentas internas, roles y acceso por equipo.",
        metrics: [
          { label: "Cuentas", value: adminMockUsers.filter((user) => user.email).length.toString(), detail: "Roles principales ya cubiertos", tone: "gold" },
          { label: "Visibles sin cuenta", value: "1", detail: "Coach publico no autenticado", tone: "slate" },
        ],
        highlights: [
          {
            title: "Usuarios",
            items: adminMockUsers.map((user) => `${user.displayName} · ${user.roleLabel}`),
          },
          {
            title: "Acciones",
            items: ["Alta de usuario", "Cambio de rol", "Asignacion de equipos", "Desactivacion"],
          },
        ],
      };
    default:
      return {
        title: "Backoffice",
        eyebrow: "Resumen",
        description: "Area preparada para seguir ampliando la operativa del club.",
        metrics: [
          { label: "Rutas activas", value: "12", detail: "Publico y admin alineados", tone: "gold" },
          { label: "Estado", value: "Activo", detail: "Estructura lista para seguir avanzando", tone: "slate" },
        ],
        highlights: [
          {
            title: "Siguientes pasos",
            items: ["Completar pantallas", "Afinar acciones", "Revisar flujos", "Pulir permisos"],
          },
        ],
      };
  }
}

export function getTeamBySlug(teamSlug: string) {
  return adminMockTeams.find((team) => team.slug === teamSlug);
}

export function getStandingByTeamSlug(teamSlug: string) {
  return adminMockStandings.find((table) => table.teamSlug === teamSlug);
}

export function getMediaTypeLabel(type: AdminMediaType) {
  switch (type) {
    case "logo":
      return "Logo";
    case "banner":
      return "Banner";
    case "player-photo":
      return "Foto";
    case "card":
      return "Cromo";
    case "placeholder":
      return "Placeholder";
  }
}
