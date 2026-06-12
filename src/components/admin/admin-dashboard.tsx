import Link from "next/link";
import {
  AlertTriangle,
  BellRing,
  CalendarDays,
  ClipboardList,
  Newspaper,
  Shield,
  Swords,
  Users,
} from "lucide-react";
import { AdminMetricCard } from "@/components/admin/admin-metric-card";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPanel } from "@/components/admin/admin-panel";
import { AdminQuickAction } from "@/components/admin/admin-quick-action";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import type { AdminRole } from "@/lib/admin/roles";
import {
  adminMockImports,
  adminMockNews,
  adminMockStandings,
  getDashboardView,
  getMatchesForRole,
  getTeamsForRole,
  type AdminImportItem,
  type AdminMatch,
  type AdminNewsItem,
} from "@/lib/admin/mock-data";

type IncidentCard = {
  title: string;
  value: string;
  detail: string;
  href: string;
  cta: string;
  tone: "gold" | "blue" | "slate" | "danger" | "success";
};

function getMetricIcon(index: number) {
  const icons = [
    <Shield key="shield" className="h-5 w-5" />,
    <Users key="users" className="h-5 w-5" />,
    <CalendarDays key="calendar" className="h-5 w-5" />,
    <BellRing key="bell" className="h-5 w-5" />,
  ];

  return icons[index] ?? <Shield className="h-5 w-5" />;
}

function getMatchBadge(status: AdminMatch["status"]) {
  if (status === "live") {
    return {
      label: "En vivo",
      tone: "danger" as const,
      pulse: true,
    };
  }

  if (status === "played") {
    return {
      label: "Jugado",
      tone: "success" as const,
      pulse: false,
    };
  }

  if (status === "postponed") {
    return {
      label: "Aplazado",
      tone: "gold" as const,
      pulse: false,
    };
  }

  return {
    label: "Pendiente",
    tone: "slate" as const,
    pulse: false,
  };
}

function getCoachFocusMatch(matches: AdminMatch[]) {
  return (
    matches.find((match) => match.status === "live") ??
    matches.find((match) => match.status === "scheduled") ??
    matches.find((match) => match.status === "played") ??
    matches[0]
  );
}

function getCoachPrimaryActionLabel(match?: AdminMatch) {
  if (!match) {
    return "Abrir partidos";
  }

  if (match.status === "live") {
    return "Actualizar marcador";
  }

  if (match.status === "played") {
    return "Cerrar resultado";
  }

  if (match.status === "postponed") {
    return "Reprogramar partido";
  }

  return "Preparar previa";
}

function getCoachSupportMessage(match?: AdminMatch) {
  if (!match) {
    return "Abre Partidos para dejar lista la jornada del equipo.";
  }

  if (match.status === "live") {
    return "Cuando cierres el marcador, salta directo a estadisticas y clasificacion.";
  }

  if (match.status === "played") {
    return "Confirma el resultado final y completa estadisticas antes de salir.";
  }

  if (match.status === "postponed") {
    return "Reordena el calendario y revisa si la clasificacion necesita ajuste manual.";
  }

  return "Deja la previa lista y ten a mano clasificacion y estadisticas del mismo equipo.";
}

function getManagerIncidents(
  role: AdminRole,
  matches: AdminMatch[],
  draftNews: AdminNewsItem[],
  imports: AdminImportItem[],
): IncidentCard[] {
  const matchesWithoutResult = matches.filter(
    (match) => match.status === "scheduled" || match.status === "postponed",
  );
  const importConflicts = imports.filter((item) => item.status === "conflict");
  const pendingImports = imports.filter((item) => item.status === "pending");

  const baseIncidents: IncidentCard[] = [
    {
      title: "Noticias en borrador",
      value: draftNews.length.toString(),
      detail:
        draftNews[0]?.title ?? "No hay noticias pendientes de revisar ahora mismo.",
      href: "/admin/noticias",
      cta: draftNews.length > 0 ? "Revisar noticias" : "Abrir noticias",
      tone: draftNews.length > 0 ? "gold" : "success",
    },
    {
      title: "Partidos sin cerrar",
      value: matchesWithoutResult.length.toString(),
      detail:
        matchesWithoutResult[0] != null
          ? `${matchesWithoutResult[0].teamName} - ${matchesWithoutResult[0].opponentName}`
          : "No hay partidos pendientes de seguimiento inmediato.",
      href: "/admin/partidos",
      cta: matchesWithoutResult.length > 0 ? "Ir a partidos" : "Ver agenda",
      tone: matchesWithoutResult.length > 0 ? "danger" : "success",
    },
  ];

  if (role === "SUPERADMIN") {
    baseIncidents.push({
      title: "Importaciones con conflicto",
      value: importConflicts.length.toString(),
      detail:
        importConflicts[0] != null
          ? `${importConflicts[0].fileName} - ${importConflicts[0].conflictCount} conflictos`
          : pendingImports[0] != null
            ? `${pendingImports[0].fileName} - pendiente de validar`
            : "No hay conflictos ni importaciones pendientes.",
      href: "/admin/importaciones",
      cta:
        importConflicts.length > 0 || pendingImports.length > 0
          ? "Abrir importaciones"
          : "Ver historial",
      tone: importConflicts.length > 0 ? "danger" : pendingImports.length > 0 ? "gold" : "success",
    });
  } else {
    baseIncidents.push({
      title: "Equipos por revisar",
      value: getTeamsForRole(role).filter((team) => !team.visible).length.toString(),
      detail: "Comprueba visibilidad publica y contexto competitivo de cada estructura.",
      href: "/admin/equipos",
      cta: "Revisar equipos",
      tone: "blue",
    });
  }

  return baseIncidents;
}

export function AdminDashboard({ role }: { role: AdminRole }) {
  const view = getDashboardView(role);
  const teams = getTeamsForRole(role);
  const matches = getMatchesForRole(role);
  const draftNews =
    role === "COACH"
      ? []
      : adminMockNews.filter((item) => item.status === "draft");
  const imports = role === "SUPERADMIN" ? adminMockImports : [];

  if (role === "COACH") {
    const assignedTeam = teams[0];
    const focusMatch = getCoachFocusMatch(matches);
    const matchBadge = focusMatch ? getMatchBadge(focusMatch.status) : null;
    const standing = adminMockStandings.find(
      (table) => table.teamSlug === assignedTeam?.slug,
    );
    const ownRow = standing?.rows.find((row) => row.ownTeam);
    const recentMatches = matches.slice(0, 2);

    return (
      <div className="space-y-6 lg:space-y-8">
        <AdminPageHeader
          eyebrow="Mi jornada"
          title="Mi jornada"
          description={
            assignedTeam
              ? `${assignedTeam.name}. Empieza por el partido activo y despues cierra clasificacion y estadisticas del mismo equipo.`
              : "Empieza por el partido activo y termina la jornada sin salirte del flujo deportivo."
          }
          actions={
            <Link
              href="/admin/partidos"
              className="rr-button rr-button-primary text-[0.84rem]"
            >
              Abrir partidos
            </Link>
          }
        />

        <div className="grid gap-4 xl:grid-cols-[1.18fr_0.82fr]">
          <AdminPanel className="p-5 sm:p-6">
            <div className="space-y-5">
              <div className="space-y-2">
                <p className="rr-kicker text-[color:var(--rr-gold)]">
                  Siguiente paso
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-[1.5rem] font-semibold text-white sm:text-[1.7rem]">
                    {focusMatch
                      ? `${focusMatch.teamName} vs ${focusMatch.opponentName}`
                      : "Sin partido en foco"}
                  </h2>
                  {matchBadge ? (
                    <AdminStatusBadge
                      label={matchBadge.label}
                      tone={matchBadge.tone}
                      pulse={matchBadge.pulse}
                    />
                  ) : null}
                </div>
                <p className="text-[0.95rem] leading-6 text-[color:var(--rr-muted)]">
                  {focusMatch
                    ? `${focusMatch.matchday} - ${focusMatch.dateLabel} - ${focusMatch.venue}`
                    : "No hay un partido cargado para esta vista."}
                </p>
                <p className="text-[0.95rem] leading-6 text-[color:var(--rr-muted)]">
                  {getCoachSupportMessage(focusMatch)}
                </p>
              </div>

              {focusMatch?.scoreLabel || focusMatch?.liveNote ? (
                <div className="rounded-[10px] border border-[rgba(253,203,88,0.18)] bg-[rgba(253,203,88,0.06)] px-4 py-4">
                  <p className="rr-kicker text-[color:var(--rr-gold)]">
                    Estado rapido
                  </p>
                  {focusMatch.scoreLabel ? (
                    <p className="mt-2 text-[1.1rem] font-semibold text-white">
                      Marcador: {focusMatch.scoreLabel}
                    </p>
                  ) : null}
                  {focusMatch.liveNote ? (
                    <p className="mt-2 text-[0.92rem] leading-6 text-[color:var(--rr-muted)]">
                      {focusMatch.liveNote}
                    </p>
                  ) : null}
                </div>
              ) : null}

              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                <Link
                  href="/admin/partidos"
                  className="rr-button rr-button-primary text-[0.84rem]"
                >
                  {getCoachPrimaryActionLabel(focusMatch)}
                </Link>
                <Link
                  href="/admin/estadisticas"
                  className="rr-button rr-button-secondary text-[0.84rem]"
                >
                  Abrir estadisticas
                </Link>
                <Link
                  href="/admin/clasificaciones"
                  className="rr-button rr-button-secondary text-[0.84rem]"
                >
                  Abrir clasificacion
                </Link>
              </div>
            </div>
          </AdminPanel>

          <div className="grid gap-4">
            <AdminPanel className="p-5 sm:p-6">
              <div className="space-y-3">
                <p className="rr-kicker text-[color:var(--rr-gold)]">
                  Resumen rapido
                </p>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                  <div className="rounded-[10px] border border-white/10 bg-[rgba(255,255,255,0.04)] px-4 py-4">
                    <p className="rr-kicker text-[color:var(--rr-muted)]">
                      Clasificacion
                    </p>
                    <p className="mt-2 text-[1.2rem] font-semibold text-white">
                      {ownRow ? `${ownRow.position}a posicion` : "Sin tabla"}
                    </p>
                    <p className="mt-1 text-[0.9rem] leading-5 text-[color:var(--rr-muted)]">
                      {standing?.updatedLabel ?? "Pendiente de revisar"}
                    </p>
                  </div>

                  <div className="rounded-[10px] border border-white/10 bg-[rgba(255,255,255,0.04)] px-4 py-4">
                    <p className="rr-kicker text-[color:var(--rr-muted)]">
                      Ultimo resultado
                    </p>
                    <p className="mt-2 text-[1.2rem] font-semibold text-white">
                      {recentMatches.find((match) => match.scoreLabel)?.scoreLabel ??
                        "Sin marcador"}
                    </p>
                    <p className="mt-1 text-[0.9rem] leading-5 text-[color:var(--rr-muted)]">
                      Revisa estadisticas y clasificacion al cerrar el partido.
                    </p>
                  </div>
                </div>
              </div>
            </AdminPanel>

            <AdminPanel className="p-5 sm:p-6">
              <div className="space-y-3">
                <p className="rr-kicker text-[color:var(--rr-gold)]">
                  Atajos reales
                </p>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                  {view.quickActions.slice(0, 3).map((action) => (
                    <AdminQuickAction
                      key={action.label}
                      href={action.href}
                      label={action.label}
                      accent={action.accent}
                    />
                  ))}
                </div>
              </div>
            </AdminPanel>
          </div>
        </div>

        <AdminPanel className="p-5 sm:p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="rr-kicker text-[color:var(--rr-gold)]">
                  Agenda inmediata
                </p>
                <h2 className="text-[1.25rem] font-semibold text-white">
                  Lo que tienes a mano hoy
                </h2>
              </div>
              <CalendarDays className="h-5 w-5 text-[color:var(--rr-gold)]" />
            </div>

            <div className="grid gap-3">
              {recentMatches.map((match) => {
                const badge = getMatchBadge(match.status);

                return (
                  <div
                    key={match.id}
                    className="rounded-[10px] border border-white/10 bg-[rgba(255,255,255,0.04)] px-4 py-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-[1rem] font-semibold text-white">
                          {match.teamName} vs {match.opponentName}
                        </p>
                        <p className="mt-1 text-[0.9rem] text-[color:var(--rr-muted)]">
                          {match.matchday} - {match.dateLabel}
                        </p>
                      </div>
                      <AdminStatusBadge
                        label={badge.label}
                        tone={badge.tone}
                        pulse={badge.pulse}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </AdminPanel>
      </div>
    );
  }

  const incidents = getManagerIncidents(role, matches, draftNews, imports);
  const visibleTeams = teams.slice(0, 3);
  const highlightedMatches = matches.slice(0, 3);

  return (
    <div className="space-y-6 lg:space-y-8">
      <AdminPageHeader
        eyebrow={role === "SUPERADMIN" ? "Control global" : "Bandeja operativa"}
        title={view.heading}
        description={view.intro}
        actions={
          <Link
            href={role === "SUPERADMIN" ? "/admin/importaciones" : "/admin/partidos"}
            className="rr-button rr-button-secondary text-[0.84rem]"
          >
            {role === "SUPERADMIN" ? "Abrir importaciones" : "Abrir agenda"}
          </Link>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
        <AdminPanel className="p-5 sm:p-6">
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="rr-kicker text-[color:var(--rr-gold)]">
                  Bandeja de trabajo
                </p>
                <h2 className="text-[1.35rem] font-semibold text-white">
                  Empieza por aqui
                </h2>
              </div>
              <AlertTriangle className="h-5 w-5 text-[color:var(--rr-gold)]" />
            </div>

            <div className="grid gap-3">
              {incidents.map((incident) => (
                <div
                  key={incident.title}
                  className="rounded-[10px] border border-white/10 bg-[rgba(255,255,255,0.04)] px-4 py-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="rr-kicker text-[color:var(--rr-muted)]">
                        {incident.title}
                      </p>
                      <p className="text-[1.15rem] font-semibold text-white">
                        {incident.value}
                      </p>
                    </div>
                    <AdminStatusBadge label={incident.cta} tone={incident.tone} />
                  </div>
                  <p className="mt-3 text-[0.92rem] leading-6 text-[color:var(--rr-muted)]">
                    {incident.detail}
                  </p>
                  <Link
                    href={incident.href}
                    className="mt-4 inline-flex text-[0.86rem] font-semibold text-[color:var(--rr-gold)] transition hover:text-white"
                  >
                    {incident.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </AdminPanel>

        <AdminPanel className="p-5 sm:p-6">
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="rr-kicker text-[color:var(--rr-gold)]">
                  Atajos del dia
                </p>
                <h2 className="text-[1.35rem] font-semibold text-white">
                  Acciones frecuentes
                </h2>
              </div>
              <Swords className="hidden h-5 w-5 text-[color:var(--rr-gold)] sm:block" />
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {view.quickActions.slice(0, 4).map((action) => (
                <AdminQuickAction
                  key={action.label}
                  href={action.href}
                  label={action.label}
                  accent={action.accent}
                />
              ))}
            </div>
          </div>
        </AdminPanel>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {view.metrics.map((metric, index) => (
          <AdminMetricCard
            key={metric.label}
            label={metric.label}
            value={metric.value}
            detail={metric.detail}
            tone={metric.tone}
            icon={getMetricIcon(index)}
          />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr_0.9fr]">
        <AdminPanel className="p-5 sm:p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="rr-kicker text-[color:var(--rr-gold)]">
                  Partidos a vigilar
                </p>
                <h2 className="text-[1.25rem] font-semibold text-white">
                  Agenda en seguimiento
                </h2>
              </div>
              <CalendarDays className="h-5 w-5 text-[color:var(--rr-gold)]" />
            </div>

            <div className="grid gap-3">
              {highlightedMatches.map((match) => {
                const badge = getMatchBadge(match.status);

                return (
                  <div
                    key={match.id}
                    className="rounded-[10px] border border-white/10 bg-[rgba(255,255,255,0.04)] px-4 py-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="text-[1rem] font-semibold text-white">
                        {match.teamName} vs {match.opponentName}
                      </p>
                      <AdminStatusBadge
                        label={badge.label}
                        tone={badge.tone}
                        pulse={badge.pulse}
                      />
                    </div>
                    <p className="mt-2 text-[0.9rem] text-[color:var(--rr-muted)]">
                      {match.matchday} - {match.dateLabel}
                    </p>
                    <p className="mt-1 text-[0.9rem] text-[color:var(--rr-muted)]">
                      {match.venue}
                      {match.scoreLabel ? ` - ${match.scoreLabel}` : ""}
                    </p>
                  </div>
                );
              })}
            </div>

            <Link
              href="/admin/partidos"
              className="inline-flex text-[0.86rem] font-semibold text-[color:var(--rr-gold)] transition hover:text-white"
            >
              Ir a partidos
            </Link>
          </div>
        </AdminPanel>

        <AdminPanel className="p-5 sm:p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="rr-kicker text-[color:var(--rr-gold)]">
                  {role === "SUPERADMIN" ? "Importaciones" : "Noticias"}
                </p>
                <h2 className="text-[1.25rem] font-semibold text-white">
                  {role === "SUPERADMIN" ? "Estado del feed" : "Contenido a cerrar"}
                </h2>
              </div>
              {role === "SUPERADMIN" ? (
                <BellRing className="h-5 w-5 text-[color:var(--rr-gold)]" />
              ) : (
                <Newspaper className="h-5 w-5 text-[color:var(--rr-gold)]" />
              )}
            </div>

            <div className="grid gap-3">
              {role === "SUPERADMIN"
                ? imports.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="rounded-[10px] border border-white/10 bg-[rgba(255,255,255,0.04)] px-4 py-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-[0.98rem] font-semibold text-white">
                          {item.fileName}
                        </p>
                        <AdminStatusBadge
                          label={
                            item.status === "completed"
                              ? "Aplicada"
                              : item.status === "pending"
                                ? "Pendiente"
                                : "Conflicto"
                          }
                          tone={
                            item.status === "completed"
                              ? "success"
                              : item.status === "pending"
                                ? "gold"
                                : "danger"
                          }
                        />
                      </div>
                      <p className="mt-2 text-[0.9rem] text-[color:var(--rr-muted)]">
                        {item.seasonName} - {item.updatedLabel}
                      </p>
                    </div>
                  ))
                : draftNews.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-[10px] border border-white/10 bg-[rgba(255,255,255,0.04)] px-4 py-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-[0.98rem] font-semibold text-white">
                          {item.title}
                        </p>
                        <AdminStatusBadge label="Borrador" tone="gold" />
                      </div>
                      <p className="mt-2 text-[0.9rem] text-[color:var(--rr-muted)]">
                        {item.updatedLabel}
                      </p>
                    </div>
                  ))}
            </div>

            <Link
              href={role === "SUPERADMIN" ? "/admin/importaciones" : "/admin/noticias"}
              className="inline-flex text-[0.86rem] font-semibold text-[color:var(--rr-gold)] transition hover:text-white"
            >
              {role === "SUPERADMIN" ? "Abrir importaciones" : "Abrir noticias"}
            </Link>
          </div>
        </AdminPanel>

        <AdminPanel className="p-5 sm:p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="rr-kicker text-[color:var(--rr-gold)]">
                  Equipos en foco
                </p>
                <h2 className="text-[1.25rem] font-semibold text-white">
                  Estructura visible
                </h2>
              </div>
              <ClipboardList className="h-5 w-5 text-[color:var(--rr-gold)]" />
            </div>

            <div className="grid gap-3">
              {visibleTeams.map((team) => (
                <div
                  key={team.slug}
                  className="rounded-[10px] border border-white/10 bg-[rgba(255,255,255,0.04)] px-4 py-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-[0.98rem] font-semibold text-white">
                      {team.name}
                    </p>
                    <AdminStatusBadge
                      label={team.visible ? "Visible" : "Oculto"}
                      tone={team.visible ? "gold" : "slate"}
                    />
                  </div>
                  <p className="mt-2 text-[0.9rem] text-[color:var(--rr-muted)]">
                    {team.competition}
                  </p>
                  <p className="mt-1 text-[0.9rem] text-[color:var(--rr-muted)]">
                    {team.playerCount} jugadores
                  </p>
                </div>
              ))}
            </div>

            <Link
              href="/admin/equipos"
              className="inline-flex text-[0.86rem] font-semibold text-[color:var(--rr-gold)] transition hover:text-white"
            >
              Ir a equipos
            </Link>
          </div>
        </AdminPanel>
      </div>
    </div>
  );
}
