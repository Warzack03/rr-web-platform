import Link from "next/link";
import { Eye, Pencil, Trophy } from "lucide-react";
import { AdminListCard } from "@/components/admin/admin-list-card";
import { AdminMetricCard } from "@/components/admin/admin-metric-card";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPanel } from "@/components/admin/admin-panel";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { AdminTable } from "@/components/admin/admin-table";
import { getMatchesForRole } from "@/lib/admin/mock-data";
import { isAdminRole, type AdminRole } from "@/lib/admin/roles";
import { requireAdminSectionAccess } from "@/server/auth/session";

function getActualRole(role: string): AdminRole {
  return isAdminRole(role) ? role : "COACH";
}

function getMatchStatusProps(status: string) {
  switch (status) {
    case "live":
      return { label: "En vivo", tone: "danger" as const, pulse: true };
    case "played":
      return { label: "Jugado", tone: "success" as const, pulse: false };
    case "postponed":
      return { label: "Pendiente", tone: "slate" as const, pulse: false };
    default:
      return { label: "Pendiente", tone: "gold" as const, pulse: false };
  }
}

function MatchActions({ role, matchId }: { role: AdminRole; matchId: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href={`/admin/partidos?match=${matchId}&view=resultado`}
        className="inline-flex min-h-9 items-center gap-2 rounded-[8px] border border-[rgba(253,203,88,0.22)] px-3 text-[0.85rem] text-white transition hover:bg-[rgba(253,203,88,0.08)]"
      >
        <Trophy className="h-3.5 w-3.5 text-[color:var(--rr-gold)]" />
        Resultado
      </Link>
      <Link
        href={`/admin/partidos?match=${matchId}&view=preview`}
        className="inline-flex min-h-9 items-center gap-2 rounded-[8px] border border-white/10 px-3 text-[0.85rem] text-[color:var(--rr-muted)] transition hover:text-white"
      >
        <Eye className="h-3.5 w-3.5 text-[color:var(--rr-gold)]" />
        Vista previa
      </Link>
      {role !== "COACH" ? (
        <Link
          href={`/admin/partidos?match=${matchId}&view=editar`}
          className="inline-flex min-h-9 items-center gap-2 rounded-[8px] border border-white/10 px-3 text-[0.85rem] text-[color:var(--rr-muted)] transition hover:text-white"
        >
          <Pencil className="h-3.5 w-3.5 text-[color:var(--rr-gold)]" />
          Editar
        </Link>
      ) : null}
    </div>
  );
}

export default async function AdminMatchesPage() {
  const user = await requireAdminSectionAccess("matches");
  const actualRole = getActualRole(user.role);
  const matches = getMatchesForRole(actualRole);
  const liveCount = matches.filter((match) => match.status === "live").length;
  const pendingCount = matches.filter((match) => match.status === "scheduled" || match.status === "postponed").length;
  const playedCount = matches.filter((match) => match.status === "played").length;

  const rows = matches.map((match) => {
    const statusProps = getMatchStatusProps(match.status);

    return {
      fixture: (
        <div className="space-y-1">
          <p className="font-semibold text-white">
            {match.teamName} vs {match.opponentName}
          </p>
          <p className="text-[0.9rem] text-[color:var(--rr-muted)]">{match.matchday}</p>
        </div>
      ),
      team: match.teamName,
      status: <AdminStatusBadge label={statusProps.label} tone={statusProps.tone} pulse={statusProps.pulse} />,
      date: (
        <div className="space-y-1">
          <p>{match.dateLabel}</p>
          <p className="text-[0.9rem] text-[color:var(--rr-muted)]">{match.venue}</p>
        </div>
      ),
      result: match.scoreLabel ?? "Pendiente",
      actions: <MatchActions role={actualRole} matchId={match.id} />,
    };
  });

  return (
    <div className="space-y-6 lg:space-y-8">
      <AdminPageHeader
        eyebrow="Calendario y resultados"
        title={actualRole === "COACH" ? "Partidos de tu equipo" : "Partidos"}
        description="Listado mock con estados, filtros operativos y accesos rapidos para actualizar resultado, abrir vista previa o preparar la edicion."
        actions={
          <Link href="/admin/partidos?draft=1" className="rr-button rr-button-secondary text-[0.84rem]">
            Abrir ultimo partido
          </Link>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <AdminMetricCard label="En vivo" value={liveCount.toString()} detail="Seguimiento inmediato del Primer Equipo" tone="danger" />
        <AdminMetricCard label="Pendientes" value={pendingCount.toString()} detail="Incluye aplazados tratados como pendientes" tone="gold" />
        <AdminMetricCard label="Jugados" value={playedCount.toString()} detail="Listos para completar estadisticas" tone="blue" />
      </div>

      <AdminPanel className="p-5 sm:p-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <label className="grid gap-2">
            <span className="rr-kicker text-[0.74rem] text-[color:var(--rr-muted)]">Equipo</span>
            <select className="min-h-11 rounded-[8px] border border-[color:var(--rr-border)] bg-[rgba(7,19,34,0.92)] px-3 text-white">
              <option>Todos</option>
              {Array.from(new Set(matches.map((match) => match.teamName))).map((teamName) => (
                <option key={teamName}>{teamName}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-2">
            <span className="rr-kicker text-[0.74rem] text-[color:var(--rr-muted)]">Estado</span>
            <select className="min-h-11 rounded-[8px] border border-[color:var(--rr-border)] bg-[rgba(7,19,34,0.92)] px-3 text-white">
              <option>Todos</option>
              <option>Pendiente</option>
              <option>En vivo</option>
              <option>Jugado</option>
            </select>
          </label>
          <label className="grid gap-2">
            <span className="rr-kicker text-[0.74rem] text-[color:var(--rr-muted)]">Fecha</span>
            <select className="min-h-11 rounded-[8px] border border-[color:var(--rr-border)] bg-[rgba(7,19,34,0.92)] px-3 text-white">
              <option>Proximos 7 dias</option>
              <option>Hoy</option>
              <option>Este mes</option>
            </select>
          </label>
          <label className="grid gap-2">
            <span className="rr-kicker text-[0.74rem] text-[color:var(--rr-muted)]">Vista</span>
            <select className="min-h-11 rounded-[8px] border border-[color:var(--rr-border)] bg-[rgba(7,19,34,0.92)] px-3 text-white">
              <option>Listado operativo</option>
              <option>Solo resultados</option>
              <option>Solo proximos</option>
            </select>
          </label>
        </div>
      </AdminPanel>

      <div className="grid gap-3 lg:hidden">
        {matches.map((match) => {
          const statusProps = getMatchStatusProps(match.status);

          return (
            <AdminListCard
              key={match.id}
              eyebrow={match.matchday}
              title={`${match.teamName} vs ${match.opponentName}`}
              description={`${match.dateLabel} · ${match.venue}`}
              meta={
                <>
                  <AdminStatusBadge label={statusProps.label} tone={statusProps.tone} pulse={statusProps.pulse} />
                  {match.scoreLabel ? <AdminStatusBadge label={match.scoreLabel} tone="blue" /> : null}
                </>
              }
              footer={<MatchActions role={actualRole} matchId={match.id} />}
            />
          );
        })}
      </div>

      <AdminTable
        columns={[
          { key: "fixture", label: "Partido" },
          { key: "team", label: "Equipo" },
          { key: "status", label: "Estado" },
          { key: "date", label: "Fecha" },
          { key: "result", label: "Resultado" },
          { key: "actions", label: "Acciones" },
        ]}
        rows={rows}
      />
    </div>
  );
}
