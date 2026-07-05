import Link from "next/link";
import {
  BarChart3,
  CalendarDays,
  Camera,
  ClipboardList,
  Newspaper,
  Shield,
  Trophy,
  UsersRound,
} from "lucide-react";
import { AdminMetricCard } from "@/components/admin/admin-metric-card";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPanel } from "@/components/admin/admin-panel";
import { AdminQuickAction } from "@/components/admin/admin-quick-action";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import type { AdminRole } from "@/lib/admin/roles";
import {
  adminMockImports,
  adminMockMatches,
  adminMockMedia,
  adminMockNews,
  adminMockPlayers,
  adminMockStandings,
  adminMockTeams,
} from "@/lib/admin/mock-data";

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

const publicationChecks = [
  "Cada equipo visible necesita proximo partido, ultimos resultados y clasificacion.",
  "Cada jugador publico necesita foto o placeholder, dorsal, posicion, pais y pie.",
  "Los cromos se generan por capas: la imagen no debe llevar dorsal ni stats incrustadas.",
  "Las stats viven por partido para no mover historico si un jugador cambia de equipo.",
  "Cantera no muestra directos ni highlights; Primer Equipo puede mostrar video externo.",
];

export function AdminDashboard({ role }: { role: AdminRole }) {
  void role;
  const scheduledMatches = adminMockMatches.filter(
    (match) => match.status === "scheduled" || match.status === "postponed",
  );
  const draftNews = adminMockNews.filter((item) => item.status === "draft");
  const visibleTeams = adminMockTeams.filter((team) => team.visible);
  const playersWithoutAdvancedData = adminMockPlayers.filter(
    (player) => player.teamSlug !== "primer-equipo" || !player.advancedLabel,
  );
  const importWarnings = adminMockImports.filter((item) => item.status !== "completed");

  return (
    <div className="space-y-6 lg:space-y-8">
      <AdminPageHeader
        eyebrow="Administrador unico"
        title="Control de la web publica"
        description="Panel de propietario para preparar lo que se ve en la web: equipos, plantilla, fichas, jornada, clasificaciones, estadisticas, noticias y media."
        actions={
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link href="/admin/partidos" className="rr-button rr-button-primary text-[0.84rem]">
              Cerrar jornada
            </Link>
          </div>
        }
      />

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <AdminMetricCard
          label="Equipos visibles"
          value={visibleTeams.length.toString()}
          detail="Estructuras activas en la web"
          tone="gold"
          icon={<Shield className="h-5 w-5" />}
          compact
        />
        <AdminMetricCard
          label="Jornada pendiente"
          value={scheduledMatches.length.toString()}
          detail="Partidos por revisar o cerrar"
          tone="danger"
          icon={<CalendarDays className="h-5 w-5" />}
          compact
        />
        <AdminMetricCard
          label="Jugadores"
          value={adminMockPlayers.length.toString()}
          detail={`${playersWithoutAdvancedData.length} con ficha simple`}
          tone="blue"
          icon={<UsersRound className="h-5 w-5" />}
          compact
        />
        <AdminMetricCard
          label="Media"
          value={adminMockMedia.length.toString()}
          detail={`${draftNews.length} noticia en borrador`}
          tone="slate"
          icon={<Camera className="h-5 w-5" />}
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
              {publicControlAreas.map((area) => {
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
                <p className="rr-kicker text-[color:var(--rr-gold)]">Prioridad movil</p>
                <h2 className="mt-2 text-[1.22rem] font-semibold text-white">
                  Uso rapido en campo
                </h2>
              </div>
              <div className="grid gap-3">
                <AdminQuickAction href="/admin/partidos" label="Actualizar resultado" />
                <AdminQuickAction href="/admin/estadisticas" label="Cargar goles y asistencias" />
                <AdminQuickAction href="/admin/clasificaciones" label="Guardar clasificacion" accent="slate" />
              </div>
            </div>
          </AdminPanel>

          <AdminPanel className="p-5 sm:p-6">
            <div className="space-y-4">
              <div>
                <p className="rr-kicker text-[color:var(--rr-gold)]">Alertas mock</p>
                <h2 className="mt-2 text-[1.22rem] font-semibold text-white">
                  Antes de publicar
                </h2>
              </div>
              <div className="grid gap-3">
                <div className="rounded-[10px] border border-white/10 bg-white/4 px-4 py-3">
                  <p className="font-semibold text-white">
                    {scheduledMatches[0]?.teamName ?? "Sin equipo"} vs{" "}
                    {scheduledMatches[0]?.opponentName ?? "rival pendiente"}
                  </p>
                  <p className="mt-1 text-[0.88rem] text-[color:var(--rr-muted)]">
                    Resultado o fecha por cerrar.
                  </p>
                </div>
                <div className="rounded-[10px] border border-white/10 bg-white/4 px-4 py-3">
                  <p className="font-semibold text-white">
                    {adminMockStandings.length} clasificaciones mock
                  </p>
                  <p className="mt-1 text-[0.88rem] text-[color:var(--rr-muted)]">
                    Faltan tablas para todos los equipos visibles.
                  </p>
                </div>
                <div className="rounded-[10px] border border-white/10 bg-white/4 px-4 py-3">
                  <p className="font-semibold text-white">
                    {importWarnings.length} importaciones por revisar
                  </p>
                  <p className="mt-1 text-[0.88rem] text-[color:var(--rr-muted)]">
                    Mantener como preview hasta integrar datos reales.
                  </p>
                </div>
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
                <p className="rr-kicker text-[color:var(--rr-gold)]">Checklist publica</p>
                <h2 className="text-[1.22rem] font-semibold text-white">
                  Datos que hacen que la web se vea bien
                </h2>
              </div>
              <Newspaper className="h-5 w-5 text-[color:var(--rr-gold)]" />
            </div>
            <div className="grid gap-3">
              {publicationChecks.map((item) => (
                <div
                  key={item}
                  className="rounded-[10px] border border-white/10 bg-[rgba(255,255,255,0.04)] px-4 py-3 text-[0.92rem] leading-5 text-[color:var(--rr-muted)]"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </AdminPanel>

        <AdminPanel className="p-5 sm:p-6">
          <div className="space-y-4">
            <div>
              <p className="rr-kicker text-[color:var(--rr-gold)]">Siguiente fase</p>
              <h2 className="mt-2 text-[1.22rem] font-semibold text-white">
                Mocks primero, datos reales despues
              </h2>
              <p className="mt-2 text-[0.92rem] leading-6 text-[color:var(--rr-muted)]">
                El backoffice debe quedar preparado para editar mocks con la misma forma que tendran los datos reales: equipos, plantilla, fichas de jugador, partidos, tablas, stats, media y noticias.
              </p>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <AdminQuickAction href="/admin/jugadores" label="Editar ficha publica" />
              <AdminQuickAction href="/admin/asignaciones" label="Abrir plantilla" accent="slate" />
              <AdminQuickAction href="/admin/media" label="Preparar fotos" accent="slate" />
              <AdminQuickAction href="/admin/noticias" label="Revisar noticias" />
            </div>
          </div>
        </AdminPanel>
      </div>
    </div>
  );
}
