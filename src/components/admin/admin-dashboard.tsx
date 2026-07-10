import Link from "next/link";
import {
  BarChart3,
  CalendarDays,
  Camera,
  CheckCircle2,
  ClipboardList,
  Shield,
  Trophy,
  UsersRound,
} from "lucide-react";
import { MatchStatus, UserRole } from "@prisma/client";
import { AdminMetricCard } from "@/components/admin/admin-metric-card";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPanel } from "@/components/admin/admin-panel";
import { AdminQuickAction } from "@/components/admin/admin-quick-action";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import type { AuthenticatedAdmin } from "@/server/auth/session";
import type { AdminDashboardData } from "@/server/services/admin-dashboard";

type ControlArea = {
  title: string;
  detail: string;
  href: string;
  cta: string;
  icon: typeof CalendarDays;
  status: string;
  tone: "gold" | "blue" | "slate" | "danger" | "success";
};

const publicControlAreas: ControlArea[] = [
  {
    title: "Jornada y resultados",
    detail: "Partidos, rival, campo, hora, marcador, estado y video del Primer Equipo.",
    href: "/admin/partidos",
    cta: "Abrir jornada",
    icon: CalendarDays,
    status: "Movil clave",
    tone: "gold",
  },
  {
    title: "Clasificaciones",
    detail: "Tabla manual por equipo con fila propia destacada y ultima actualizacion.",
    href: "/admin/clasificaciones",
    cta: "Editar tablas",
    icon: Trophy,
    status: "Movil clave",
    tone: "blue",
  },
  {
    title: "Estadisticas",
    detail: "Goles, asistencias, tarjetas, MVP y stats premium del Primer Equipo.",
    href: "/admin/estadisticas",
    cta: "Cargar stats",
    icon: BarChart3,
    status: "Movil clave",
    tone: "gold",
  },
  {
    title: "Plantilla",
    detail: "Altas por equipo, dorsal, posicion publica, capitanias y visibilidad en la plantilla.",
    href: "/admin/asignaciones",
    cta: "Abrir plantilla",
    icon: UsersRound,
    status: "Desktop",
    tone: "blue",
  },
  {
    title: "Fichas y cromos",
    detail: "Ficha publica final, slug, foto, pie, pais, dorsal y variante del cromo.",
    href: "/admin/jugadores",
    cta: "Revisar perfiles",
    icon: UsersRound,
    status: "Desktop",
    tone: "slate",
  },
  {
    title: "Equipos",
    detail: "Estructura publica, entrenadores visibles, competicion y contexto deportivo.",
    href: "/admin/equipos",
    cta: "Gestionar equipos",
    icon: Shield,
    status: "Desktop",
    tone: "blue",
  },
  {
    title: "Media y noticias",
    detail: "Fotos de jugador, logos, banners, covers, noticias y enlaces externos.",
    href: "/admin/media",
    cta: "Abrir media",
    icon: Camera,
    status: "Desktop",
    tone: "slate",
  },
];

function formatMatchDateTime(date: Date | null) {
  if (!date) {
    return "Fecha pendiente";
  }

  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Europe/Madrid",
  })
    .format(date)
    .replace(".", "");
}

function formatMatchStatus(status: MatchStatus) {
  switch (status) {
    case MatchStatus.LIVE:
      return "En juego";
    case MatchStatus.POSTPONED:
      return "Aplazado";
    case MatchStatus.PLAYED:
      return "Jugado";
    case MatchStatus.SCHEDULED:
    default:
      return "Pendiente";
  }
}

function getMatchTone(status: MatchStatus) {
  switch (status) {
    case MatchStatus.LIVE:
      return "danger" as const;
    case MatchStatus.POSTPONED:
      return "slate" as const;
    case MatchStatus.PLAYED:
      return "success" as const;
    case MatchStatus.SCHEDULED:
    default:
      return "gold" as const;
  }
}

function getDashboardHeading(user: AuthenticatedAdmin, data: AdminDashboardData) {
  if (user.role === UserRole.COACH) {
    return data.assignedTeams[0] ?? "Mi jornada";
  }

  if (user.role === UserRole.MANAGER) {
    return "Control deportivo y publico";
  }

  return "Control global de la web publica";
}

function getDashboardDescription(user: AuthenticatedAdmin, data: AdminDashboardData) {
  if (user.role === UserRole.COACH) {
    return data.assignedTeams.length > 0
      ? `Resumen corto para trabajar solo con ${data.assignedTeams.join(", ")}: jornada, clasificacion y estadisticas del equipo asignado.`
      : "Resumen corto para el trabajo de campo: jornada, clasificacion y estadisticas del equipo asignado.";
  }

  if (user.role === UserRole.MANAGER) {
    return "Vista operativa para coordinar equipos, contenido publico y actualizacion deportiva sin salir del panel.";
  }

  return "Panel principal para vigilar el estado publico del club: temporada activa, equipos visibles, jornada, contenido y revision de importaciones.";
}

function getVisibleControlAreas(role: UserRole) {
  if (role === UserRole.COACH) {
    return publicControlAreas.filter((area) =>
      ["/admin/partidos", "/admin/clasificaciones", "/admin/estadisticas"].includes(area.href),
    );
  }

  if (role === UserRole.MANAGER) {
    return publicControlAreas.filter((area) => area.href !== "/admin/media");
  }

  return publicControlAreas;
}

function getQuickActions(role: UserRole) {
  if (role === UserRole.COACH) {
    return [
      { href: "/admin/partidos", label: "Actualizar resultado" },
      { href: "/admin/estadisticas", label: "Cargar goles y asistencias" },
      { href: "/admin/clasificaciones", label: "Guardar clasificacion", accent: "slate" as const },
    ];
  }

  if (role === UserRole.MANAGER) {
    return [
      { href: "/admin/partidos", label: "Abrir jornada" },
      { href: "/admin/clasificaciones", label: "Actualizar clasificacion" },
      { href: "/admin/noticias", label: "Revisar noticias" },
      { href: "/admin/equipos", label: "Gestionar equipos", accent: "slate" as const },
    ];
  }

  return [
    { href: "/admin/importaciones", label: "Revisar importaciones" },
    { href: "/admin/usuarios", label: "Gestionar usuarios", accent: "slate" as const },
    { href: "/admin/partidos", label: "Abrir jornada" },
    { href: "/admin/noticias", label: "Revisar noticias" },
  ];
}

function getStatusItems(user: AuthenticatedAdmin, data: AdminDashboardData) {
  const items = [
    {
      title: "Cobertura de clasificaciones",
      value:
        data.missingStandingTablesCount > 0
          ? `${data.standingTableCount} tablas reales`
          : "Cobertura completa",
      detail:
        data.missingStandingTablesCount > 0
          ? `${data.missingStandingTablesCount} equipos visibles siguen sin tabla manual publicada.`
          : "Todos los equipos visibles del scope actual ya tienen tabla manual.",
    },
  ];

  if (user.role === UserRole.SUPERADMIN) {
    items.push({
      title: "Importaciones",
      value:
        data.importReviewCount && data.importReviewCount > 0
          ? `${data.importReviewCount} por revisar`
          : "Sin bloqueos",
      detail: data.lastImportLabel ?? "Todavia no hay importaciones registradas.",
    });
  } else if (user.role === UserRole.MANAGER) {
    items.push({
      title: "Noticias",
      value:
        typeof data.draftNewsCount === "number" && data.draftNewsCount > 0
          ? `${data.draftNewsCount} borradores`
          : "Sin borradores",
      detail:
        typeof data.draftNewsCount === "number"
          ? "Contenido pendiente antes de publicar."
          : "Este rol no gestiona noticias.",
    });
  } else {
    items.push({
      title: "Equipos asignados",
      value: data.assignedTeams.length > 0 ? `${data.assignedTeams.length}` : "0",
      detail:
        data.assignedTeams.length > 0
          ? data.assignedTeams.join(", ")
          : "No hay equipos asignados a esta cuenta.",
    });
  }

  if (user.role !== UserRole.COACH) {
    items.push({
      title: "Media",
      value: typeof data.mediaCount === "number" ? `${data.mediaCount}` : "0",
      detail: "Activos visuales registrados en la biblioteca publica.",
    });
  }

  return items;
}

export function AdminDashboard({
  user,
  data,
}: {
  user: AuthenticatedAdmin;
  data: AdminDashboardData;
}) {
  const controlAreas = getVisibleControlAreas(user.role);
  const quickActions = getQuickActions(user.role);
  const statusItems = getStatusItems(user, data);

  return (
    <div className="space-y-6 lg:space-y-8">
      <AdminPageHeader
        eyebrow="Administrador unico"
        title={getDashboardHeading(user, data)}
        description={getDashboardDescription(user, data)}
        actions={
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link href="/admin/partidos" className="rr-button rr-button-primary text-[0.84rem]">
              Abrir jornada
            </Link>
          </div>
        }
      />

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <AdminMetricCard
          label="Temporada activa"
          value={data.activeSeasonName ?? "Sin temporada"}
          detail={
            user.role === UserRole.COACH && data.assignedTeams.length > 0
              ? data.assignedTeams.join(", ")
              : "Contexto publico activo"
          }
          tone="gold"
          icon={<CalendarDays className="h-5 w-5" />}
          compact
        />
        <AdminMetricCard
          label={user.role === UserRole.COACH ? "Equipos asignados" : "Equipos visibles"}
          value={data.teamCount.toString()}
          detail={
            user.role === UserRole.COACH
              ? "Equipos dentro de tu alcance"
              : "Estructuras activas en la web"
          }
          tone="blue"
          icon={<Shield className="h-5 w-5" />}
          compact
        />
        <AdminMetricCard
          label="Jugadores activos"
          value={data.playerCount.toString()}
          detail="Plantilla publica dentro del scope actual"
          tone="slate"
          icon={<UsersRound className="h-5 w-5" />}
          compact
        />
        <AdminMetricCard
          label="Partidos pendientes"
          value={data.openMatchesCount.toString()}
          detail="Pendientes de revisar, cerrar o reprogramar"
          tone={data.openMatchesCount > 0 ? "danger" : "gold"}
          icon={<ClipboardList className="h-5 w-5" />}
          compact
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.18fr_0.82fr]">
        <AdminPanel className="p-5 sm:p-6">
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="rr-kicker text-[color:var(--rr-gold)]">Mapa de control</p>
                <h2 className="text-[1.35rem] font-semibold text-white">
                  Lo que alimenta la parte publica
                </h2>
              </div>
              <ClipboardList className="h-5 w-5 text-[color:var(--rr-gold)]" />
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {controlAreas.map((area) => {
                const Icon = area.icon;

                return (
                  <Link
                    key={area.title}
                    href={area.href}
                    className="rounded-[10px] border border-white/10 bg-[rgba(255,255,255,0.04)] px-4 py-4 transition hover:border-[rgba(253,203,88,0.25)] hover:bg-[rgba(255,255,255,0.06)]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-[8px] border border-white/10 bg-white/5">
                          <Icon className="h-4.5 w-4.5 text-[color:var(--rr-gold)]" />
                        </span>
                        <div>
                          <p className="font-semibold text-white">{area.title}</p>
                          <p className="mt-1 text-[0.82rem] text-[color:var(--rr-muted)]">
                            {area.cta}
                          </p>
                        </div>
                      </div>
                      <AdminStatusBadge label={area.status} tone={area.tone} />
                    </div>
                    <p className="mt-3 text-[0.9rem] leading-5 text-[color:var(--rr-muted)]">
                      {area.detail}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </AdminPanel>

        <div className="grid gap-4">
          <AdminPanel className="p-5 sm:p-6">
            <div className="space-y-4">
              <div>
                <p className="rr-kicker text-[color:var(--rr-gold)]">Acciones rapidas</p>
                <h2 className="mt-2 text-[1.22rem] font-semibold text-white">
                  Siguiente paso util
                </h2>
              </div>
              <div className="grid gap-3">
                {quickActions.map((action) => (
                  <AdminQuickAction
                    key={`${action.href}-${action.label}`}
                    href={action.href}
                    label={action.label}
                    accent={action.accent}
                  />
                ))}
              </div>
            </div>
          </AdminPanel>

          <AdminPanel className="p-5 sm:p-6">
            <div className="space-y-4">
              <div>
                <p className="rr-kicker text-[color:var(--rr-gold)]">Agenda inmediata</p>
                <h2 className="mt-2 text-[1.22rem] font-semibold text-white">
                  Proximos partidos
                </h2>
              </div>
              <div className="grid gap-3">
                {data.upcomingMatches.length > 0 ? (
                  data.upcomingMatches.map((match) => (
                    <div
                      key={match.id}
                      className="rounded-[10px] border border-white/10 bg-white/4 px-4 py-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-white">
                            {match.teamName} vs {match.opponentName}
                          </p>
                          <p className="mt-1 text-[0.88rem] text-[color:var(--rr-muted)]">
                            {formatMatchDateTime(match.dateTime)}
                          </p>
                        </div>
                        <AdminStatusBadge
                          label={formatMatchStatus(match.status)}
                          tone={getMatchTone(match.status)}
                          pulse={match.status === MatchStatus.LIVE}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[10px] border border-white/10 bg-white/4 px-4 py-4 text-[0.9rem] text-[color:var(--rr-muted)]">
                    No hay partidos pendientes dentro del scope actual.
                  </div>
                )}
              </div>
            </div>
          </AdminPanel>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <AdminPanel className="p-5 sm:p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="rr-kicker text-[color:var(--rr-gold)]">Resultados recientes</p>
                <h2 className="text-[1.22rem] font-semibold text-white">
                  Ultimos cierres registrados
                </h2>
              </div>
              <CheckCircle2 className="h-5 w-5 text-[color:var(--rr-gold)]" />
            </div>
            <div className="grid gap-3">
              {data.recentResults.length > 0 ? (
                data.recentResults.map((match) => (
                  <div
                    key={match.id}
                    className="rounded-[10px] border border-white/10 bg-[rgba(255,255,255,0.04)] px-4 py-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-white">
                          {match.teamName} vs {match.opponentName}
                        </p>
                        <p className="mt-1 text-[0.88rem] text-[color:var(--rr-muted)]">
                          {formatMatchDateTime(match.dateTime)}
                        </p>
                      </div>
                      <AdminStatusBadge
                        label={`${match.homeScore ?? "-"} - ${match.awayScore ?? "-"}`}
                        tone="success"
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[10px] border border-white/10 bg-[rgba(255,255,255,0.04)] px-4 py-4 text-[0.92rem] text-[color:var(--rr-muted)]">
                  Todavia no hay resultados jugados en el scope actual.
                </div>
              )}
            </div>
          </div>
        </AdminPanel>

        <AdminPanel className="p-5 sm:p-6">
          <div className="space-y-4">
            <div>
              <p className="rr-kicker text-[color:var(--rr-gold)]">Estado operativo</p>
              <h2 className="mt-2 text-[1.22rem] font-semibold text-white">
                Lo que necesita atencion ahora
              </h2>
              <p className="mt-2 text-[0.92rem] leading-6 text-[color:var(--rr-muted)]">
                Resumen rapido para detectar huecos reales antes de que se noten en la web publica.
              </p>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {statusItems.map((item) => (
                <div
                  key={item.title}
                  className="rounded-[10px] border border-white/10 bg-[rgba(255,255,255,0.04)] px-4 py-3"
                >
                  <p className="rr-kicker text-[color:var(--rr-gold)]">{item.title}</p>
                  <p className="mt-2 font-semibold text-white">{item.value}</p>
                  <p className="mt-1 text-[0.88rem] leading-5 text-[color:var(--rr-muted)]">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </AdminPanel>
      </div>
    </div>
  );
}
