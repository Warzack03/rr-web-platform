import Link from "next/link";
import { Check, Smartphone } from "lucide-react";
import { AdminMetricCard } from "@/components/admin/admin-metric-card";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPanel } from "@/components/admin/admin-panel";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import {
  getMatchesForRole,
  getPlayersForRole,
  getStandingByTeamSlug,
  getTeamBySlug,
  getTeamsForRole,
} from "@/lib/admin/mock-data";
import { isAdminRole, type AdminRole } from "@/lib/admin/roles";
import { requireAdminSectionAccess } from "@/server/auth/session";

function getActualRole(role: string): AdminRole {
  return isAdminRole(role) ? role : "COACH";
}

export default async function AdminStatsPage() {
  const user = await requireAdminSectionAccess("stats");
  const actualRole = getActualRole(user.role);
  const teams = getTeamsForRole(actualRole);
  const selectedTeam = teams[0];
  const matches = getMatchesForRole(actualRole).filter((match) => match.teamSlug === selectedTeam?.slug);
  const selectedMatch = matches.find((match) => match.status !== "played") ?? matches[0];
  const players = getPlayersForRole(actualRole).filter((player) => player.teamSlug === selectedTeam?.slug);
  const standing = selectedTeam ? getStandingByTeamSlug(selectedTeam.slug) : undefined;
  const ownStandingRow = standing?.rows.find((row) => row.ownTeam);
  const teamMeta = selectedTeam ? getTeamBySlug(selectedTeam.slug) : undefined;

  return (
    <div className="space-y-6 lg:space-y-8">
      <AdminPageHeader
        eyebrow={actualRole === "COACH" ? "Mobile first" : "Control de estadisticas"}
        title="Estadisticas"
        description="Selecciona equipo y partido para registrar goles, asistencias, tarjetas y datos clave."
        actions={
          <Link href="/admin/partidos" className="rr-button rr-button-secondary text-[0.84rem]">
            Ir a partidos
          </Link>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <AdminMetricCard label="Equipo activo" value={selectedTeam?.name ?? "-"} detail={teamMeta?.competition ?? "Sin equipo"} tone="gold" />
        <AdminMetricCard label="Partido elegido" value={selectedMatch?.matchday ?? "-"} detail={selectedMatch?.dateLabel ?? "Pendiente"} tone="blue" />
        <AdminMetricCard label="Clasificacion" value={ownStandingRow?.position ? `#${ownStandingRow.position}` : "-"} detail={standing?.updatedLabel ?? "Sin tabla"} tone="slate" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <AdminPanel className="p-5 sm:p-6">
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="rr-kicker text-[color:var(--rr-gold)]">Contexto rapido</p>
                <h2 className="rr-display mt-2 text-[2rem] leading-[0.95] text-white">
                  Preparado para campo
                </h2>
              </div>
              <Smartphone className="h-5 w-5 text-[color:var(--rr-gold)]" />
            </div>

            <div className="grid gap-4">
              <label className="grid gap-2">
                <span className="rr-kicker text-[0.74rem] text-[color:var(--rr-muted)]">Equipo</span>
                <select className="min-h-11 rounded-[8px] border border-[color:var(--rr-border)] bg-[rgba(7,19,34,0.92)] px-3 text-white">
                  {teams.map((team) => (
                    <option key={team.slug}>{team.name}</option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2">
                <span className="rr-kicker text-[0.74rem] text-[color:var(--rr-muted)]">Partido</span>
                <select className="min-h-11 rounded-[8px] border border-[color:var(--rr-border)] bg-[rgba(7,19,34,0.92)] px-3 text-white">
                  {matches.map((match) => (
                    <option key={match.id}>
                      {match.matchday} · {match.opponentName}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="grid gap-3">
              <div className="rounded-[10px] border border-white/10 bg-[rgba(255,255,255,0.04)] px-4 py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-[1rem] font-semibold text-white">
                    {selectedTeam?.name} vs {selectedMatch?.opponentName}
                  </p>
                  <AdminStatusBadge
                    label={selectedMatch?.status === "live" ? "En vivo" : selectedMatch?.status === "played" ? "Jugado" : "Pendiente"}
                    tone={selectedMatch?.status === "live" ? "danger" : selectedMatch?.status === "played" ? "success" : "gold"}
                    pulse={selectedMatch?.status === "live"}
                  />
                </div>
                <p className="mt-2 text-[0.94rem] text-[color:var(--rr-muted)]">
                  {selectedMatch?.dateLabel} · {selectedMatch?.venue}
                </p>
              </div>

              <div className="rounded-[10px] border border-white/10 bg-[rgba(255,255,255,0.04)] px-4 py-4">
                <p className="rr-kicker text-[color:var(--rr-gold)]">Checklist</p>
                <div className="mt-3 grid gap-2 text-[0.95rem] text-[color:var(--rr-muted)]">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[color:var(--rr-gold)]" />
                    Goles y asistencias por jugador
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[color:var(--rr-gold)]" />
                    Tarjetas y MVP
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[color:var(--rr-gold)]" />
                    Porteria a cero y stats avanzadas del Primer Equipo
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AdminPanel>

        <AdminPanel className="p-5 sm:p-6">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="rr-kicker text-[color:var(--rr-gold)]">Carga del partido</p>
                <h2 className="rr-display mt-2 text-[2rem] leading-[0.95] text-white">
                  Jugadores y aportacion
                </h2>
              </div>
              <button type="button" className="rr-button rr-button-primary text-[0.84rem]">
                Guardar
              </button>
            </div>

            <div className="grid gap-4">
              {players.map((player) => (
                <div
                  key={player.id}
                  className="rounded-[10px] border border-white/10 bg-[rgba(255,255,255,0.04)] px-4 py-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-[1rem] font-semibold text-white">
                        #{player.number} · {player.name}
                      </p>
                      <p className="mt-1 text-[0.92rem] text-[color:var(--rr-muted)]">
                        {player.position} · {player.country} · {player.foot}
                      </p>
                    </div>
                    {player.advancedLabel ? <AdminStatusBadge label={player.advancedLabel} tone="blue" /> : null}
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
                    <label className="grid gap-1">
                      <span className="rr-kicker text-[0.68rem] text-[color:var(--rr-muted)]">Goles</span>
                      <input
                        type="number"
                        min={0}
                        defaultValue={player.goals}
                        className="min-h-10 rounded-[8px] border border-white/10 bg-[rgba(7,19,34,0.92)] px-3 text-white"
                      />
                    </label>
                    <label className="grid gap-1">
                      <span className="rr-kicker text-[0.68rem] text-[color:var(--rr-muted)]">Asist.</span>
                      <input
                        type="number"
                        min={0}
                        defaultValue={player.assists}
                        className="min-h-10 rounded-[8px] border border-white/10 bg-[rgba(7,19,34,0.92)] px-3 text-white"
                      />
                    </label>
                    <label className="grid gap-1">
                      <span className="rr-kicker text-[0.68rem] text-[color:var(--rr-muted)]">Amar.</span>
                      <input
                        type="number"
                        min={0}
                        defaultValue={player.yellowCards}
                        className="min-h-10 rounded-[8px] border border-white/10 bg-[rgba(7,19,34,0.92)] px-3 text-white"
                      />
                    </label>
                    <label className="grid gap-1">
                      <span className="rr-kicker text-[0.68rem] text-[color:var(--rr-muted)]">Rojas</span>
                      <input
                        type="number"
                        min={0}
                        defaultValue={player.redCards}
                        className="min-h-10 rounded-[8px] border border-white/10 bg-[rgba(7,19,34,0.92)] px-3 text-white"
                      />
                    </label>
                    <label className="grid gap-1">
                      <span className="rr-kicker text-[0.68rem] text-[color:var(--rr-muted)]">MVP</span>
                      <input
                        type="number"
                        min={0}
                        defaultValue={player.mvp}
                        className="min-h-10 rounded-[8px] border border-white/10 bg-[rgba(7,19,34,0.92)] px-3 text-white"
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AdminPanel>
      </div>
    </div>
  );
}
