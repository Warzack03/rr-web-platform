import { UserRole } from "@prisma/client";

export type DemoMatch = {
  id: string;
  teamSlug: string;
  teamName: string;
  opponentName: string;
  competition: string;
  status: "Pendiente" | "En vivo" | "Jugado" | "Aplazado";
  dateLabel: string;
  location: string;
  score?: string;
  videoLabel?: string;
};

export type DemoStandingRow = {
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
  isOwnTeam?: boolean;
};

export type DemoTeam = {
  slug: string;
  name: string;
  category: string;
  competition: string;
  season: string;
  coach: string;
  summary: string;
  accent: "premium" | "standard";
  isFirstTeam: boolean;
  clubTag: string;
  position: string;
  points: number;
  rosterCount: number;
  goalsFor: number;
  goalsAgainst: number;
  streak: string;
  statsSummary: string;
  newsSlugs: string[];
  playerSlugs: string[];
};

export type DemoPlayer = {
  slug: string;
  teamSlug: string;
  teamName: string;
  name: string;
  number: number;
  position: string;
  country: string;
  foot: string;
  premium: boolean;
  isGoalkeeper?: boolean;
  summary: string;
  headlineStats: { label: string; value: string }[];
};

export type DemoNews = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  dateLabel: string;
  publishedLabel: string;
  teamSlugs: string[];
  body: string[];
  videoLabel?: string;
};

export const publicTeams: DemoTeam[] = [
  {
    slug: "primer-equipo",
    name: "Primer Equipo",
    category: "Primera Division",
    competition: "Liga Principal",
    season: "2026/27",
    coach: "Seymour Hillman",
    summary: "El bloque insignia del club, con seguimiento completo, cromos premium y estadisticas avanzadas.",
    accent: "premium",
    isFirstTeam: true,
    clubTag: "Plantilla profesional",
    position: "1",
    points: 34,
    rosterCount: 22,
    goalsFor: 32,
    goalsAgainst: 8,
    streak: "V-V-E-V",
    statsSummary: "Maximo goleador: Axel Blaze",
    newsSlugs: ["victoria-clave-derbi", "analisis-rival", "preparacion-intensa"],
    playerSlugs: ["axel-blaze", "mark-evans", "jude-sharp", "victor-balde"],
  },
  {
    slug: "raimon-b",
    name: "Raimon B",
    category: "Filial - Academia",
    competition: "Preferente Autonomica",
    season: "2026/27",
    coach: "M. Evans",
    summary: "Paso previo al alto rendimiento, con mezcla de desarrollo, competitividad y minutos para el talento joven.",
    accent: "standard",
    isFirstTeam: false,
    clubTag: "Academia",
    position: "2/18",
    points: 16,
    rosterCount: 20,
    goalsFor: 15,
    goalsAgainst: 6,
    streak: "V-E-V-D",
    statsSummary: "Top goleador: S. Swift",
    newsSlugs: ["derbi-academia", "sesion-carga", "objetivo-playoff"],
    playerSlugs: ["s-swift", "leo-stone", "nate-river", "gk-cole"],
  },
  {
    slug: "juvenil-a",
    name: "Juvenil A",
    category: "Sub-19 Nacional",
    competition: "Liga Nacional Juvenil",
    season: "2026/27",
    coach: "D. Wintersea",
    summary: "Escalon de alta exigencia para pulir talento competitivo y prepararlo para la estructura senior.",
    accent: "standard",
    isFirstTeam: false,
    clubTag: "Cantera",
    position: "4/18",
    points: 28,
    rosterCount: 21,
    goalsFor: 24,
    goalsAgainst: 13,
    streak: "V-E-V-V",
    statsSummary: "Objetivo: zona alta",
    newsSlugs: ["objetivo-playoff"],
    playerSlugs: ["akira-frost", "noah-vale"],
  },
  {
    slug: "cadete-a",
    name: "Cadete A",
    category: "Sub-16 Autonomica",
    competition: "Division Autonomica",
    season: "2026/27",
    coach: "T. Raimon",
    summary: "Base del metodo Rising Raimon, con foco tecnico, tactico y crecimiento competitivo.",
    accent: "standard",
    isFirstTeam: false,
    clubTag: "Cantera",
    position: "6/18",
    points: 21,
    rosterCount: 19,
    goalsFor: 18,
    goalsAgainst: 12,
    streak: "E-V-D-V",
    statsSummary: "Metodologia y progresion",
    newsSlugs: ["sesion-carga"],
    playerSlugs: ["ian-pulse", "rui-keller"],
  },
];

export const publicMatches: DemoMatch[] = [
  {
    id: "m1",
    teamSlug: "primer-equipo",
    teamName: "Rising Raimon",
    opponentName: "Royal Academy",
    competition: "Futbol Frontier - Jornada 12",
    status: "Pendiente",
    dateLabel: "Sab, 24 Nov · 18:00",
    location: "Estadio Raimon",
  },
  {
    id: "m2",
    teamSlug: "primer-equipo",
    teamName: "Rising Raimon",
    opponentName: "Zeus FC",
    competition: "Futbol Frontier",
    status: "Jugado",
    dateLabel: "Hace 4 dias",
    location: "Visitante",
    score: "2 - 1",
    videoLabel: "Resumen extendido",
  },
  {
    id: "m3",
    teamSlug: "primer-equipo",
    teamName: "Rising Raimon",
    opponentName: "Alpine",
    competition: "Futbol Frontier",
    status: "Jugado",
    dateLabel: "Hace 1 semana",
    location: "Casa",
    score: "3 - 0",
  },
  {
    id: "m4",
    teamSlug: "raimon-b",
    teamName: "Raimon B",
    opponentName: "Royal Academy B",
    competition: "Preferente - J8",
    status: "Pendiente",
    dateLabel: "Sab, 14 Oct · 16:00",
    location: "Campo 2",
  },
  {
    id: "m5",
    teamSlug: "raimon-b",
    teamName: "Raimon B",
    opponentName: "Inazuma Junior",
    competition: "Preferente",
    status: "Jugado",
    dateLabel: "J7",
    location: "Visitante",
    score: "1 - 3",
  },
  {
    id: "m6",
    teamSlug: "raimon-b",
    teamName: "Raimon B",
    opponentName: "Brain FC",
    competition: "Preferente",
    status: "Jugado",
    dateLabel: "J6",
    location: "Casa",
    score: "2 - 2",
  },
  {
    id: "m7",
    teamSlug: "juvenil-a",
    teamName: "Juvenil A",
    opponentName: "Occult",
    competition: "Liga Nacional Juvenil",
    status: "Pendiente",
    dateLabel: "Dom, 12:30",
    location: "Anexo Norte",
  },
  {
    id: "m8",
    teamSlug: "cadete-a",
    teamName: "Cadete A",
    opponentName: "Gemini Storm",
    competition: "Division Autonomica",
    status: "Aplazado",
    dateLabel: "Nueva fecha pendiente",
    location: "Campo Municipal",
  },
];

export const standingsByTeam: Record<string, DemoStandingRow[]> = {
  "primer-equipo": [
    { position: 1, teamName: "Rising Raimon", played: 14, won: 11, drawn: 1, lost: 2, goalsFor: 32, goalsAgainst: 8, goalDifference: 24, points: 34, isOwnTeam: true },
    { position: 2, teamName: "Royal Academy", played: 14, won: 10, drawn: 2, lost: 2, goalsFor: 28, goalsAgainst: 11, goalDifference: 17, points: 32 },
    { position: 3, teamName: "Zeus FC", played: 14, won: 9, drawn: 3, lost: 2, goalsFor: 26, goalsAgainst: 14, goalDifference: 12, points: 30 },
    { position: 4, teamName: "Alpine", played: 14, won: 8, drawn: 2, lost: 4, goalsFor: 22, goalsAgainst: 15, goalDifference: 7, points: 26 },
  ],
  "raimon-b": [
    { position: 1, teamName: "Royal Academy B", played: 7, won: 6, drawn: 0, lost: 1, goalsFor: 18, goalsAgainst: 5, goalDifference: 13, points: 18 },
    { position: 2, teamName: "Raimon B", played: 7, won: 5, drawn: 1, lost: 1, goalsFor: 15, goalsAgainst: 6, goalDifference: 9, points: 16, isOwnTeam: true },
    { position: 3, teamName: "Zeus B", played: 7, won: 4, drawn: 2, lost: 1, goalsFor: 11, goalsAgainst: 7, goalDifference: 4, points: 14 },
    { position: 4, teamName: "Brain FC B", played: 7, won: 3, drawn: 1, lost: 3, goalsFor: 12, goalsAgainst: 12, goalDifference: 0, points: 10 },
  ],
  "juvenil-a": [
    { position: 1, teamName: "Teikoku", played: 10, won: 8, drawn: 1, lost: 1, goalsFor: 24, goalsAgainst: 7, goalDifference: 17, points: 25 },
    { position: 2, teamName: "Genesis", played: 10, won: 7, drawn: 2, lost: 1, goalsFor: 21, goalsAgainst: 9, goalDifference: 12, points: 23 },
    { position: 3, teamName: "Juvenil A", played: 10, won: 7, drawn: 1, lost: 2, goalsFor: 19, goalsAgainst: 11, goalDifference: 8, points: 22, isOwnTeam: true },
  ],
  "cadete-a": [
    { position: 1, teamName: "Occult", played: 9, won: 7, drawn: 1, lost: 1, goalsFor: 20, goalsAgainst: 8, goalDifference: 12, points: 22 },
    { position: 2, teamName: "Gemini Storm", played: 9, won: 6, drawn: 2, lost: 1, goalsFor: 17, goalsAgainst: 7, goalDifference: 10, points: 20 },
    { position: 6, teamName: "Cadete A", played: 9, won: 4, drawn: 3, lost: 2, goalsFor: 18, goalsAgainst: 12, goalDifference: 6, points: 15, isOwnTeam: true },
  ],
};

export const publicPlayers: DemoPlayer[] = [
  {
    slug: "axel-blaze",
    teamSlug: "primer-equipo",
    teamName: "Primer Equipo",
    name: "Axel Blaze",
    number: 10,
    position: "Delantero",
    country: "Japon",
    foot: "Derecho",
    premium: true,
    summary: "Referencia ofensiva del Primer Equipo y foco principal del ataque posicional.",
    headlineStats: [
      { label: "Partidos jugados", value: "142" },
      { label: "Goles", value: "118" },
      { label: "Asistencias", value: "34" },
      { label: "Tiros a puerta", value: "194" },
      { label: "MVPs", value: "8" },
      { label: "Recuperaciones", value: "85" },
    ],
  },
  {
    slug: "mark-evans",
    teamSlug: "primer-equipo",
    teamName: "Primer Equipo",
    name: "Mark Evans",
    number: 1,
    position: "Portero",
    country: "Espana",
    foot: "Izquierdo",
    premium: true,
    isGoalkeeper: true,
    summary: "Portero de alto rendimiento, liderazgo competitivo y lectura avanzada de area.",
    headlineStats: [
      { label: "MVPs", value: "5" },
      { label: "Tiros recibidos", value: "173" },
      { label: "Goles", value: "0" },
      { label: "Asistencias", value: "2" },
      { label: "Amarillas", value: "3" },
      { label: "Rojas", value: "0" },
    ],
  },
  {
    slug: "s-swift",
    teamSlug: "raimon-b",
    teamName: "Raimon B",
    name: "S. Swift",
    number: 9,
    position: "Delantero",
    country: "Espana",
    foot: "Derecho",
    premium: false,
    summary: "Ataque vertical y remate rapido en el ultimo tercio.",
    headlineStats: [
      { label: "Goles", value: "5" },
      { label: "Asistencias", value: "2" },
      { label: "Partidos", value: "7" },
      { label: "Tiros", value: "21" },
    ],
  },
  {
    slug: "gk-cole",
    teamSlug: "raimon-b",
    teamName: "Raimon B",
    name: "Cole Keeper",
    number: 13,
    position: "Portero",
    country: "Portugal",
    foot: "Derecho",
    premium: false,
    isGoalkeeper: true,
    summary: "Portero de academia con buen juego aereo y salida limpia.",
    headlineStats: [
      { label: "Paradas", value: "19" },
      { label: "Porterias a cero", value: "3" },
      { label: "Partidos", value: "6" },
      { label: "Goles en contra", value: "6" },
    ],
  },
];

export const publicNews: DemoNews[] = [
  {
    slug: "victoria-clave-derbi",
    title: "Victoria clave para consolidar el liderato",
    category: "Primer Equipo",
    excerpt: "El equipo resolvio un partido de alta tension con una actuacion coral y control del ritmo competitivo.",
    dateLabel: "Hace 2 dias",
    publishedLabel: "12 mayo 2026",
    teamSlugs: ["primer-equipo"],
    body: [
      "La estructura del Primer Equipo vuelve a dejar una imagen solida en una jornada de maxima exigencia.",
      "El plan de partido tuvo control, agresividad tras perdida y una lectura madura de los tiempos del encuentro.",
      "La victoria refuerza la identidad competitiva del proyecto y alimenta el tramo decisivo de la temporada.",
    ],
    videoLabel: "Resumen del partido",
  },
  {
    slug: "analisis-rival",
    title: "Analisis del rival: puntos clave antes del siguiente encuentro",
    category: "Tactica",
    excerpt: "La semana se enfoca en ajustes de presion, vigilancias y ocupacion del area rival.",
    dateLabel: "Ayer",
    publishedLabel: "13 mayo 2026",
    teamSlugs: ["primer-equipo"],
    body: [
      "El cuerpo tecnico concentra la semana en detalles de comportamiento sin balon y escalones de presion.",
      "La estructura ofensiva buscara mas continuidad entre extremos, punta y segunda linea.",
    ],
  },
  {
    slug: "preparacion-intensa",
    title: "Preparacion intensa para el derbi de la semana",
    category: "Entrenamiento",
    excerpt: "Carga controlada, automatismos y foco total en la transicion defensiva.",
    dateLabel: "Hoy",
    publishedLabel: "15 mayo 2026",
    teamSlugs: ["primer-equipo"],
    body: [
      "La semana de trabajo sube intensidad sin perder claridad en los objetivos tacticos.",
      "El derbi servira tambien para medir la madurez del bloque en un contexto de maxima exigencia emocional.",
    ],
  },
  {
    slug: "derbi-academia",
    title: "El Raimon B prepara el derbi con intensidad maxima",
    category: "Academia",
    excerpt: "El filial quiere consolidar su posicion en la tabla frente a un rival directo.",
    dateLabel: "Hoy",
    publishedLabel: "15 mayo 2026",
    teamSlugs: ["raimon-b"],
    body: [
      "El grupo trabaja una semana de detalle competitivo y ajuste fino en fase defensiva.",
      "La plantilla mantiene un buen equilibrio entre desarrollo y exigencia de resultados.",
    ],
  },
  {
    slug: "sesion-carga",
    title: "Nueva sesion de carga y metodologia para la cantera",
    category: "Club",
    excerpt: "La academia mantiene su enfoque en progresion, contexto competitivo y crecimiento tecnico.",
    dateLabel: "Hace 3 dias",
    publishedLabel: "10 mayo 2026",
    teamSlugs: ["raimon-b", "cadete-a"],
    body: [
      "La metodologia del club busca coherencia entre categorias y una identidad clara de juego.",
      "La coordinacion entre equipos ayuda a acelerar la adaptacion de los perfiles jovenes.",
    ],
  },
  {
    slug: "objetivo-playoff",
    title: "Juvenil A refuerza su objetivo de cerrar la fase en puestos altos",
    category: "Cantera",
    excerpt: "El equipo mantiene una buena dinamica y busca dar continuidad a su crecimiento competitivo.",
    dateLabel: "Hace 1 semana",
    publishedLabel: "08 mayo 2026",
    teamSlugs: ["juvenil-a"],
    body: [
      "El grupo sostiene una linea ascendente en rendimiento, con protagonismo desde la presion y la ocupacion racional de espacios.",
      "La exigencia del tramo final servira para medir el paso real de varios perfiles hacia el siguiente escalon.",
    ],
  },
];

export const sponsorPlaceholders = [
  "Patrocinador principal",
  "Partner tecnico",
  "Academy partner",
  "Colaborador local",
];

export const adminTeamRows = publicTeams.map((team, index) => ({
  id: team.slug,
  name: team.isFirstTeam ? "Raimon A" : team.name,
  category: team.category,
  competition: team.competition,
  season: team.season,
  visible: index !== 2,
  active: true,
  isFirstTeam: team.isFirstTeam,
}));

export function getTeamBySlug(teamSlug: string) {
  return publicTeams.find((team) => team.slug === teamSlug) ?? null;
}

export function getPlayerBySlug(playerSlug: string) {
  return publicPlayers.find((player) => player.slug === playerSlug) ?? null;
}

export function getNewsBySlug(newsSlug: string) {
  return publicNews.find((news) => news.slug === newsSlug) ?? null;
}

export function getTeamPlayers(teamSlug: string) {
  return publicPlayers.filter((player) => player.teamSlug === teamSlug);
}

export function getTeamMatches(teamSlug: string) {
  return publicMatches.filter((match) => match.teamSlug === teamSlug);
}

export function getUpcomingMatch(teamSlug: string) {
  return getTeamMatches(teamSlug).find((match) => match.status === "Pendiente") ?? null;
}

export function getLatestResults(teamSlug: string) {
  return getTeamMatches(teamSlug).filter((match) => match.status === "Jugado");
}

export function getRelatedNews(teamSlug: string) {
  return publicNews.filter((news) => news.teamSlugs.includes(teamSlug));
}

export function getStandings(teamSlug: string) {
  return standingsByTeam[teamSlug] ?? [];
}

export function getDashboardMock(role: UserRole) {
  if (role === UserRole.COACH) {
    return {
      title: "Panel del entrenador",
      subtitle: "Gestionando: Raimon B (2a Division Regional)",
      metrics: [
        { label: "Plantilla", value: "22", helper: "Jugadores activos" },
        { label: "Lesionados", value: "2", helper: "Seguimiento" },
        { label: "Racha", value: "V-E-V-D", helper: "Ultimos partidos" },
      ],
      quickActions: ["Gestionar jugadores", "Actualizar resultados", "Ver clasificacion"],
    };
  }

  if (role === UserRole.MANAGER) {
    return {
      title: "Temporada 2026/27",
      subtitle: "Operacion deportiva y publicacion de contenidos",
      metrics: [
        { label: "Equipos", value: "12", helper: "Temporada activa" },
        { label: "Jugadores", value: "240", helper: "Publicables" },
        { label: "Prox. partidos", value: "5", helper: "Este fin de semana" },
        { label: "Noticias", value: "3", helper: "Pendientes de revision" },
      ],
      quickActions: ["Editar equipos", "Revisar noticias", "Preparar clasificaciones"],
    };
  }

  return {
    title: "Temporada 2026/27",
    subtitle: "Activa",
    metrics: [
      { label: "Equipos", value: "12", helper: "+2 esta temporada" },
      { label: "Jugadores", value: "240", helper: "Registro completado" },
      { label: "Prox. partidos", value: "5", helper: "Este fin de semana" },
      { label: "Importaciones", value: "2", helper: "Recientes" },
    ],
    quickActions: ["Crear equipo", "Abrir importaciones", "Revisar usuarios"],
  };
}
