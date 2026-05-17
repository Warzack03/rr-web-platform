import { UserRole } from "@prisma/client";
import { Trophy } from "lucide-react";
import { CTAButton } from "@/src/components/shared/cta-button";
import { MatchCard } from "@/src/components/shared/match-card";
import { StandingsTable } from "@/src/components/public/standings-table";
import { PlayerRosterCard } from "@/src/components/public/player-roster-card";
import { AdminActionCard } from "@/src/components/admin/admin-action-card";
import { AdminAlertCard } from "@/src/components/admin/admin-alert-card";
import { AdminDataTable } from "@/src/components/admin/admin-data-table";
import { AdminPageHeader } from "@/src/components/admin/admin-page-header";
import { AdminPanel } from "@/src/components/admin/admin-panel";
import { AdminSummaryCard } from "@/src/components/admin/admin-summary-card";
import {
  getAdminDashboardData,
  getCoachMobileSummary,
  getScopedImportRows,
  getScopedUserRows,
} from "@/src/lib/admin-demo";
import { requireAdminSectionAccess } from "@/server/auth/session";

export default async function AdminDashboardPage() {
  const user = await requireAdminSectionAccess("dashboard");
  const dashboard = getAdminDashboardData(user.role);

  if (user.role === UserRole.COACH) {
    const coachSummary = getCoachMobileSummary();

    return (
      <div className="space-y-6 lg:space-y-8">
        <AdminPageHeader
          badge="Entrenador"
          title={dashboard.title}
          description={dashboard.subtitle}
          action={<CTAButton href="/admin/partidos">Actualizar partido</CTAButton>}
        />

        <div className="grid gap-4 md:grid-cols-3">
          {dashboard.metrics.map((metric) => (
            <AdminSummaryCard
              key={metric.label}
              title={metric.label}
              value={metric.value}
              helper={metric.helper}
            />
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <AdminPanel title="Equipo asignado">
            <div className="rounded-[20px] border border-[var(--rr-border)] bg-[rgba(8,20,38,0.52)] p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--rr-accent)]">
                {coachSummary.team.category}
              </p>
              <h2 className="mt-3 font-display text-5xl uppercase text-white">
                {coachSummary.team.name}
              </h2>
              <p className="mt-3 text-base leading-7 text-[var(--rr-text-muted)]">
                {coachSummary.team.competition} · Temporada {coachSummary.team.season}
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {[
                  ["Posicion", coachSummary.team.position],
                  ["Puntos", `${coachSummary.team.points}`],
                  ["Racha", coachSummary.team.streak],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-[18px] border border-[var(--rr-border)] bg-black/15 px-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--rr-text-soft)]">
                      {label}
                    </p>
                    <p className="mt-2 font-display text-3xl text-white">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </AdminPanel>

          <AdminPanel title="Tareas pendientes">
            <div className="space-y-3">
              {coachSummary.tasks.map((task) => (
                <AdminActionCard
                  key={task.id}
                  href={task.href}
                  title={task.title}
                  description={`${task.detail} · ${task.status}`}
                />
              ))}
            </div>
          </AdminPanel>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <AdminPanel title="Partidos del equipo">
            <div className="space-y-4">
              {coachSummary.nextMatch ? <MatchCard match={coachSummary.nextMatch} variant="featured" /> : null}
              {coachSummary.lastResult ? <MatchCard match={coachSummary.lastResult} /> : null}
            </div>
          </AdminPanel>

          <AdminPanel title="Avisos">
            <div className="space-y-3">
              {dashboard.alerts.map((alert) => (
                <AdminAlertCard key={alert.id} alert={alert} />
              ))}
            </div>
          </AdminPanel>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <AdminPanel title="Clasificacion resumida">
            <StandingsTable rows={coachSummary.standings} compact />
          </AdminPanel>

          <AdminPanel title="Accesos rapidos">
            <div className="grid gap-3">
              {dashboard.quickActions.map((action) => (
                <AdminActionCard
                  key={action.label}
                  href={action.href}
                  title={action.label}
                  description={action.description}
                />
              ))}
            </div>
          </AdminPanel>
        </div>

        <AdminPanel title="Jugadores destacados">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {coachSummary.players.map((player) => (
              <PlayerRosterCard key={player.slug} player={player} />
            ))}
          </div>
        </AdminPanel>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        badge={user.role === UserRole.SUPERADMIN ? "Superadmin" : "Manager"}
        title={dashboard.title}
        description={dashboard.subtitle}
        action={
          <CTAButton href={user.role === UserRole.SUPERADMIN ? "/admin/importaciones" : "/admin/equipos"}>
            {user.role === UserRole.SUPERADMIN ? "Abrir importaciones" : "Gestionar equipos"}
          </CTAButton>
        }
      />

      <div className={`grid gap-4 ${dashboard.metrics.length === 3 ? "xl:grid-cols-3" : "xl:grid-cols-4"}`}>
        {dashboard.metrics.map((metric, index) => (
          <AdminSummaryCard
            key={metric.label}
            title={metric.label}
            value={metric.value}
            helper={metric.helper}
            accent={index === dashboard.metrics.length - 1 ? "light" : "gold"}
          />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <AdminPanel title="Acciones prioritarias">
          <div className="grid gap-4 md:grid-cols-3">
            {dashboard.quickActions.map((action) => (
              <AdminActionCard
                key={action.label}
                href={action.href}
                title={action.label}
                description={action.description}
              />
            ))}
          </div>
        </AdminPanel>

        <AdminPanel title="Alertas del sistema">
          <div className="space-y-3">
            {dashboard.alerts.map((alert) => (
              <AdminAlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        </AdminPanel>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <AdminPanel title="Partidos y actividad deportiva">
          <AdminDataTable
            columns={[
              { key: "team", label: "Equipo" },
              { key: "opponent", label: "Rival" },
              { key: "competition", label: "Competicion" },
              { key: "date", label: "Fecha" },
              { key: "status", label: "Estado" },
              { key: "score", label: "Resultado" },
            ]}
            rows={dashboard.matchRows}
          />
        </AdminPanel>

        <AdminPanel title="Noticias recientes">
          <AdminDataTable
            columns={[
              { key: "title", label: "Titulo" },
              { key: "team", label: "Equipo" },
              { key: "status", label: "Estado" },
              { key: "date", label: "Fecha" },
            ]}
            rows={dashboard.newsRows}
          />
        </AdminPanel>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <AdminPanel title="Clasificaciones activas">
          <div className="space-y-5">
            {dashboard.standings.map((standing) => (
              <div key={standing.teamSlug} className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--rr-accent)]">
                      {standing.teamName}
                    </p>
                    <p className="text-sm text-[var(--rr-text-soft)]">
                      {standing.competition} · {standing.season}
                    </p>
                  </div>
                  <CTAButton href="/admin/clasificaciones" size="sm" variant="ghost">
                    <Trophy className="h-4 w-4" />
                    Editar
                  </CTAButton>
                </div>
                <StandingsTable rows={standing.rows} compact />
              </div>
            ))}
          </div>
        </AdminPanel>

        <AdminPanel title="Jugadores a seguir">
          <AdminDataTable
            columns={[
              { key: "player", label: "Jugador" },
              { key: "team", label: "Equipo" },
              { key: "goles", label: "Goles" },
              { key: "asistencias", label: "Asistencias" },
              { key: "participaciones", label: "Participacion" },
              { key: "estado", label: "Estado" },
            ]}
            rows={dashboard.spotlightPlayers}
          />
        </AdminPanel>
      </div>

      {user.role === UserRole.SUPERADMIN ? (
        <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <AdminPanel title="Importaciones recientes">
            <AdminDataTable
              columns={[
                { key: "fileName", label: "Archivo" },
                { key: "entity", label: "Entidad" },
                { key: "status", label: "Estado" },
                { key: "owner", label: "Responsable" },
                { key: "summary", label: "Resumen" },
              ]}
              rows={getScopedImportRows(user.role)}
            />
          </AdminPanel>

          <AdminPanel title="Usuarios internos">
            <AdminDataTable
              columns={[
                { key: "displayName", label: "Usuario" },
                { key: "role", label: "Rol" },
                { key: "access", label: "Acceso" },
                { key: "teams", label: "Equipos" },
                { key: "lastAccess", label: "Ultimo acceso" },
              ]}
              rows={getScopedUserRows(user.role)}
            />
          </AdminPanel>
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1fr_1fr_1fr]">
          <AdminActionCard href="/admin/equipos" title="Equipos" description="Visibilidad, estado y temporada activa." />
          <AdminActionCard href="/admin/partidos" title="Partidos" description="Pendientes, jugados, aplazados y en vivo." />
          <AdminActionCard href="/admin/noticias" title="Noticias" description="Publicadas, borradores y destacadas." />
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-3">
        <AdminActionCard href="/admin/partidos" title="Calendario deportivo" description="Revisar proximos partidos y resultados." />
        <AdminActionCard href="/admin/estadisticas" title="Estadisticas" description="Editar goles, asistencias y rendimiento." />
        <AdminActionCard href="/admin/clasificaciones" title="Clasificaciones" description="Mantener la tabla manual al dia." />
      </div>
    </div>
  );
}
