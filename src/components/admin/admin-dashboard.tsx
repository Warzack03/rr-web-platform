import Link from "next/link";
import {
  BellRing,
  CalendarDays,
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
  getDashboardView,
  getMatchesForRole,
  getTeamsForRole,
} from "@/lib/admin/mock-data";

type AdminDashboardProps = {
  role: AdminRole;
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

function getMatchTone(status: string) {
  if (status === "live") {
    return "danger" as const;
  }

  if (status === "played") {
    return "success" as const;
  }

  return "slate" as const;
}

export function AdminDashboard({ role }: AdminDashboardProps) {
  const view = getDashboardView(role);
  const teams = getTeamsForRole(role).slice(0, role === "COACH" ? 1 : 3);
  const matches = getMatchesForRole(role).slice(0, role === "COACH" ? 2 : 4);
  const draftNews = role === "COACH" ? [] : adminMockNews.filter((item) => item.status === "draft");
  const imports = role === "SUPERADMIN" ? adminMockImports.slice(0, 2) : [];

  return (
    <div className="space-y-6 lg:space-y-8">
      <AdminPageHeader
        eyebrow={role === "COACH" ? "Operacion movil" : "Dashboard operativo"}
        title={view.heading}
        description={view.intro}
        actions={
          <Link href="/admin/partidos" className="rr-button rr-button-secondary text-[0.84rem]">
            Abrir agenda
          </Link>
        }
      />

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

      <div className="grid gap-4 xl:grid-cols-[1.25fr_0.95fr]">
        <AdminPanel className="p-5 sm:p-6">
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="rr-kicker text-[color:var(--rr-gold)]">Accesos rapidos</p>
                <h2 className="rr-display mt-2 text-[2rem] leading-[0.95] text-white">
                  Operar sin rodeos
                </h2>
              </div>
              <Swords className="hidden h-5 w-5 text-[color:var(--rr-gold)] sm:block" />
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {view.quickActions.map((action) => (
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

        <AdminPanel className="p-5 sm:p-6">
          <div className="space-y-5">
            <div>
              <p className="rr-kicker text-[color:var(--rr-gold)]">Foco del dia</p>
              <h2 className="rr-display mt-2 text-[2rem] leading-[0.95] text-white">
                Que vigilar ahora
              </h2>
            </div>

            <div className="grid gap-3">
              {view.focusCards.map((card) => (
                <div
                  key={card.title}
                  className="rounded-[10px] border border-white/10 bg-[rgba(255,255,255,0.04)] px-4 py-4"
                >
                  <p className="rr-kicker text-[color:var(--rr-muted)]">{card.title}</p>
                  <p className="mt-2 text-[1.08rem] font-semibold text-white">{card.value}</p>
                  <p className="mt-1 text-[0.94rem] leading-5 text-[color:var(--rr-muted)]">
                    {card.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </AdminPanel>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.08fr_1fr_0.92fr]">
        <AdminPanel className="p-5 sm:p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="rr-kicker text-[color:var(--rr-gold)]">Equipos</p>
                <h2 className="rr-display mt-2 text-[2rem] leading-[0.95] text-white">
                  Vista rapida
                </h2>
              </div>
              <Shield className="h-5 w-5 text-[color:var(--rr-gold)]" />
            </div>

            <div className="grid gap-3">
              {teams.map((team) => (
                <div
                  key={team.slug}
                  className="rounded-[10px] border border-white/10 bg-[rgba(255,255,255,0.04)] px-4 py-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[1.05rem] font-semibold text-white">{team.name}</p>
                      <p className="text-[0.92rem] text-[color:var(--rr-muted)]">{team.competition}</p>
                    </div>
                    <AdminStatusBadge
                      label={team.visible ? "Visible" : "Oculto"}
                      tone={team.visible ? "gold" : "slate"}
                    />
                  </div>
                  <p className="mt-3 text-[0.92rem] text-[color:var(--rr-muted)]">
                    {team.playerCount} jugadores · {team.nextMatchLabel}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </AdminPanel>

        <AdminPanel className="p-5 sm:p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="rr-kicker text-[color:var(--rr-gold)]">Partidos</p>
                <h2 className="rr-display mt-2 text-[2rem] leading-[0.95] text-white">
                  Agenda operativa
                </h2>
              </div>
              <CalendarDays className="h-5 w-5 text-[color:var(--rr-gold)]" />
            </div>

            <div className="grid gap-3">
              {matches.map((match) => (
                <div
                  key={match.id}
                  className="rounded-[10px] border border-white/10 bg-[rgba(255,255,255,0.04)] px-4 py-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-[1rem] font-semibold text-white">
                      {match.teamName} vs {match.opponentName}
                    </p>
                    <AdminStatusBadge
                      label={match.status === "live" ? "En vivo" : match.status === "played" ? "Jugado" : match.status === "postponed" ? "Pendiente" : "Pendiente"}
                      tone={getMatchTone(match.status)}
                      pulse={match.status === "live"}
                    />
                  </div>
                  <p className="mt-3 text-[0.92rem] text-[color:var(--rr-muted)]">
                    {match.matchday} · {match.dateLabel}
                  </p>
                  <p className="mt-1 text-[0.92rem] text-[color:var(--rr-muted)]">
                    {match.venue}
                    {match.scoreLabel ? ` · ${match.scoreLabel}` : ""}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </AdminPanel>

        <AdminPanel className="p-5 sm:p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="rr-kicker text-[color:var(--rr-gold)]">
                  {role === "SUPERADMIN" ? "Importaciones" : "Editorial"}
                </p>
                <h2 className="rr-display mt-2 text-[2rem] leading-[0.95] text-white">
                  {role === "SUPERADMIN" ? "Ultimo estado" : "Contenido"}
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
                ? imports.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-[10px] border border-white/10 bg-[rgba(255,255,255,0.04)] px-4 py-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-[0.98rem] font-semibold text-white">{item.fileName}</p>
                        <AdminStatusBadge
                          label={
                            item.status === "completed"
                              ? "Aplicada"
                              : item.status === "pending"
                                ? "Pendiente"
                                : "Conflictos"
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
                      <p className="mt-2 text-[0.92rem] text-[color:var(--rr-muted)]">
                        {item.seasonName} · {item.updatedLabel}
                      </p>
                    </div>
                  ))
                : draftNews.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-[10px] border border-white/10 bg-[rgba(255,255,255,0.04)] px-4 py-4"
                    >
                      <p className="text-[0.98rem] font-semibold text-white">{item.title}</p>
                      <p className="mt-2 text-[0.92rem] text-[color:var(--rr-muted)]">
                        {item.updatedLabel}
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
