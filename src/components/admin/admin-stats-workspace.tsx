"use client";

import Link from "next/link";
import { startTransition, useEffect, useState } from "react";
import { AlertTriangle, Check, ShieldCheck, Smartphone, Target, Trophy, Users } from "lucide-react";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { AdminFeedbackBanner } from "@/components/admin/admin-feedback-banner";
import { AdminCoachTeamSwitcher } from "@/components/admin/admin-coach-team-switcher";
import { AdminMetricCard } from "@/components/admin/admin-metric-card";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPanel } from "@/components/admin/admin-panel";
import { AdminScopePanel } from "@/components/admin/admin-scope-panel";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { adminMockPlayers, type AdminPlayer } from "@/lib/admin/mock-data";
import {
  coachPreviewTeamSlugs,
  formatMatchDateLabel,
  getAllMatchManagementMatches,
  getCoachPreviewTeamOptions,
  getMatchManagementTeamsForRole,
  getVisualMatchStatus,
  sortMatchManagementMatches,
} from "@/lib/admin/match-management-mocks";
import type { AdminRole } from "@/lib/admin/roles";

type AdminStatsWorkspaceProps = {
  role: AdminRole;
  initialUiState?: "ready" | "error";
  initialSelectedTeamSlug?: string;
  initialSelectedMatchId?: string;
};

type ScreenState = "loading" | "ready" | "error";

function getInitialCoachTeamSlug(initialSelectedTeamSlug?: string) {
  return coachPreviewTeamSlugs.includes(initialSelectedTeamSlug as (typeof coachPreviewTeamSlugs)[number])
    ? (initialSelectedTeamSlug as string)
    : coachPreviewTeamSlugs[0];
}

function getStatusBadge(status: "pending" | "live" | "played") {
  if (status === "live") {
    return { label: "En vivo", tone: "danger" as const, pulse: true };
  }

  if (status === "played") {
    return { label: "Jugado", tone: "success" as const, pulse: false };
  }

  return { label: "Pendiente", tone: "gold" as const, pulse: false };
}

function updatePlayerStat(
  players: AdminPlayer[],
  playerId: string,
  field: "goals" | "assists" | "yellowCards" | "redCards" | "mvp",
  value: number,
) {
  return players.map((player) =>
    player.id === playerId
      ? {
          ...player,
          [field]: Number.isFinite(value) ? Math.max(0, Math.trunc(value)) : 0,
        }
      : player,
  );
}

function formatSavedTime(value: Date | null) {
  if (!value) {
    return "Aun sin guardar";
  }

  return value.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function AdminStatsWorkspace({
  role,
  initialUiState = "ready",
  initialSelectedTeamSlug,
  initialSelectedMatchId,
}: AdminStatsWorkspaceProps) {
  const [screenState, setScreenState] = useState<ScreenState>("loading");
  const [bannerMessage, setBannerMessage] = useState<string | null>(null);
  const [allPlayers, setAllPlayers] = useState<AdminPlayer[]>(() =>
    adminMockPlayers.map((player) => ({ ...player })),
  );
  const [savedPlayers, setSavedPlayers] = useState<AdminPlayer[]>(() =>
    adminMockPlayers.map((player) => ({ ...player })),
  );
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [coachTeamSlug, setCoachTeamSlug] = useState<string>(
    getInitialCoachTeamSlug(initialSelectedTeamSlug),
  );
  const [requestedTeamSlug, setRequestedTeamSlug] = useState<string>(initialSelectedTeamSlug ?? "");
  const [requestedMatchId, setRequestedMatchId] = useState<string>(initialSelectedMatchId ?? "");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setScreenState(initialUiState === "error" ? "error" : "ready");
    }, 280);

    return () => window.clearTimeout(timer);
  }, [initialUiState]);

  useEffect(() => {
    if (!bannerMessage) {
      return;
    }

    const timer = window.setTimeout(() => setBannerMessage(null), 2400);
    return () => window.clearTimeout(timer);
  }, [bannerMessage]);

  const coachPreviewTeamOptions = getCoachPreviewTeamOptions();
  const allowedTeams = getMatchManagementTeamsForRole(role, coachTeamSlug);
  const resolvedTeamSlug =
    role === "COACH"
      ? coachTeamSlug
      : allowedTeams.find((team) => team.slug === requestedTeamSlug)?.slug ?? allowedTeams[0]?.slug ?? "";
  const selectedTeam = allowedTeams.find((team) => team.slug === resolvedTeamSlug);
  const matches = sortMatchManagementMatches(
    getAllMatchManagementMatches().filter((match) => match.teamSlug === resolvedTeamSlug),
  );
  const selectedMatch =
    matches.find((match) => match.id === requestedMatchId) ??
    matches.find((match) => getVisualMatchStatus(match.status) !== "played") ??
    matches[0];
  const players = allPlayers.filter((player) => player.teamSlug === resolvedTeamSlug);
  const savedTeamPlayers = savedPlayers.filter((player) => player.teamSlug === resolvedTeamSlug);
  const statusBadge = selectedMatch ? getStatusBadge(getVisualMatchStatus(selectedMatch.status)) : null;
  const topScorer = [...players].sort((left, right) => right.goals - left.goals)[0];
  const hasUnsavedChanges = JSON.stringify(players) !== JSON.stringify(savedTeamPlayers);

  function pushBanner(message: string) {
    startTransition(() => setBannerMessage(message));
  }

  function saveStats() {
    setSavedPlayers(allPlayers.map((player) => ({ ...player })));
    setLastSavedAt(new Date());
    pushBanner("Estadisticas guardadas. Guardado local de prueba.");
  }

  function handleUpdatePlayer(
    playerId: string,
    field: "goals" | "assists" | "yellowCards" | "redCards" | "mvp",
    value: number,
  ) {
    setAllPlayers((currentPlayers) => updatePlayerStat(currentPlayers, playerId, field, value));
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <AdminPageHeader
        eyebrow={role === "COACH" ? "Carga rapida" : "Control de estadisticas"}
        title="Estadisticas"
        description={
          role === "COACH"
            ? "Registra el partido de tu equipo con foco en movil, contexto claro y atajos directos."
            : "Selecciona equipo y partido para registrar aportacion ofensiva, tarjetas y cierre operativo de jornada."
        }
        actions={
          <Link href="/admin/partidos" className="rr-button rr-button-secondary text-[0.84rem]">
            Ir a partidos
          </Link>
        }
      />

      {bannerMessage ? <AdminFeedbackBanner message={bannerMessage} /> : null}

      {role === "COACH" ? (
        <AdminScopePanel
          eyebrow="Flujo de entrenador"
          title="Una jornada, un equipo, una accion clara"
          description="Aqui solo cargas el partido del equipo asignado. Primero confirma el contexto, luego registra goles, asistencias, tarjetas y MVP sin perder de vista el resultado."
          actions={
            <>
              <Link
                href={`/admin/partidos?team=${selectedTeam?.slug ?? ""}`}
                className="rr-button rr-button-secondary text-[0.8rem]"
              >
                Ver partidos
              </Link>
              <Link
                href={`/admin/clasificaciones?team=${selectedTeam?.slug ?? ""}`}
                className="rr-button rr-button-secondary text-[0.8rem]"
              >
                Editar clasificacion
              </Link>
            </>
          }
          aside={
            <AdminCoachTeamSwitcher
              options={coachPreviewTeamOptions}
              value={coachTeamSlug}
              onChange={setCoachTeamSlug}
            />
          }
        />
      ) : null}

      {role === "COACH" && selectedMatch ? (
        <AdminPanel className="border-[rgba(253,203,88,0.24)] p-5 sm:p-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-2">
                <p className="rr-kicker text-[color:var(--rr-gold)]">Siguiente paso</p>
                <div>
                  <h2 className="text-[1.12rem] font-semibold text-white sm:text-[1.25rem]">
                    Cargar estadisticas de {selectedTeam?.name}
                  </h2>
                  <p className="mt-1 text-[0.92rem] leading-5 text-[color:var(--rr-muted)]">
                    {selectedMatch.matchday} · {selectedMatch.opponentName} · {formatMatchDateLabel(selectedMatch)}
                  </p>
                </div>
              </div>

              {statusBadge ? (
                <AdminStatusBadge
                  label={statusBadge.label}
                  tone={statusBadge.tone}
                  pulse={statusBadge.pulse}
                />
              ) : null}
            </div>

            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
              <div className="rounded-[10px] border border-white/10 bg-white/4 px-4 py-3 text-[0.9rem] text-[color:var(--rr-muted)]">
                {hasUnsavedChanges
                  ? "Tienes cambios sin guardar en esta jornada."
                  : "Selecciona jugadores, registra aportaciones y guarda al terminar."}
              </div>

              <button
                type="button"
                onClick={saveStats}
                className="rr-button rr-button-primary justify-center text-[0.82rem]"
              >
                Guardar estadisticas
              </button>
            </div>
          </div>
        </AdminPanel>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AdminMetricCard
          label="Equipo activo"
          value={selectedTeam?.name ?? "-"}
          detail={selectedTeam?.competition ?? "Sin equipo"}
          tone="gold"
          icon={<ShieldCheck className="h-5 w-5" />}
        />
        <AdminMetricCard
          label="Partido elegido"
          value={selectedMatch?.matchday ?? "-"}
          detail={selectedMatch ? formatMatchDateLabel(selectedMatch) : "Sin partido"}
          tone="blue"
          icon={<Trophy className="h-5 w-5" />}
        />
        <AdminMetricCard
          label="Jugadores editables"
          value={players.length.toString()}
          detail={selectedTeam?.isFirstTeam ? "Incluye capa avanzada del Primer Equipo" : "Carga reducida para cantera"}
          tone="slate"
          icon={<Users className="h-5 w-5" />}
        />
        <AdminMetricCard
          label="Goleador actual"
          value={topScorer ? `#${topScorer.number}` : "-"}
          detail={topScorer ? `${topScorer.name} · ${topScorer.goals} goles` : "Sin referencia"}
          tone="gold"
          icon={<Target className="h-5 w-5" />}
        />
      </div>

      {screenState === "loading" ? (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <AdminPanel key={index} className="p-5">
                <div className="space-y-3">
                  <div className="h-4 w-24 animate-pulse rounded bg-white/8" />
                  <div className="h-10 w-28 animate-pulse rounded bg-white/6" />
                  <div className="h-4 w-full animate-pulse rounded bg-white/6" />
                </div>
              </AdminPanel>
            ))}
          </div>
          <div className="grid gap-4 xl:grid-cols-[0.92fr_1.08fr]">
            <AdminPanel className="p-5">
              <div className="space-y-3">
                <div className="h-12 animate-pulse rounded-[10px] bg-white/6" />
                <div className="h-24 animate-pulse rounded-[10px] bg-white/6" />
              </div>
            </AdminPanel>
            <AdminPanel className="p-5">
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="h-24 animate-pulse rounded-[10px] bg-white/6" />
                ))}
              </div>
            </AdminPanel>
          </div>
        </div>
      ) : null}

      {screenState === "error" ? (
        <AdminPanel className="border-[rgba(214,64,69,0.34)] p-6">
          <div className="max-w-2xl space-y-3">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-[color:var(--rr-gold)]" />
              <p className="rr-kicker text-[color:var(--rr-gold)]">Vista previa</p>
            </div>
            <h2 className="rr-display text-[2rem] leading-[0.95] text-white">
              No hemos podido cargar la carga de estadisticas
            </h2>
            <p className="text-[0.96rem] leading-6 text-[color:var(--rr-muted)]">
              La pantalla contempla un error operativo para validar estados y jerarquia antes de conectar datos reales.
            </p>
            <button
              type="button"
              onClick={() => setScreenState("ready")}
              className="rr-button rr-button-primary text-[0.82rem]"
            >
              Reintentar
            </button>
          </div>
        </AdminPanel>
      ) : null}

      {screenState === "ready" && players.length === 0 ? (
        <AdminEmptyState
          title="Sin jugadores para editar"
          description="Amplia los datos de prueba o cambia de equipo para revisar la carga de estadisticas."
        />
      ) : null}

      {screenState === "ready" && players.length > 0 ? (
        <div className="grid gap-4 xl:grid-cols-[0.92fr_1.08fr]">
          <AdminPanel className="p-5 sm:p-6">
            <div className="space-y-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="rr-kicker text-[color:var(--rr-gold)]">Contexto del partido</p>
                  <h2 className="rr-display mt-2 text-[1.85rem] leading-[0.96] text-white">
                    Listo para editar
                  </h2>
                </div>
                <Smartphone className="h-5 w-5 text-[color:var(--rr-gold)]" />
              </div>

              {role !== "COACH" ? (
                <label className="grid gap-2">
                  <span className="rr-kicker text-[0.74rem] text-[color:var(--rr-muted)]">Equipo</span>
                  <select
                    value={resolvedTeamSlug}
                    onChange={(event) => setRequestedTeamSlug(event.target.value)}
                    className="min-h-11 rounded-[8px] border border-[color:var(--rr-border)] bg-[rgba(7,19,34,0.92)] px-3 text-white outline-none transition focus:border-[rgba(253,203,88,0.45)]"
                  >
                    {allowedTeams.map((team) => (
                      <option key={team.slug} value={team.slug}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                </label>
              ) : null}

              <label className="grid gap-2">
                <span className="rr-kicker text-[0.74rem] text-[color:var(--rr-muted)]">Partido</span>
                <select
                  value={selectedMatch?.id ?? ""}
                  onChange={(event) => setRequestedMatchId(event.target.value)}
                  className="min-h-11 rounded-[8px] border border-[color:var(--rr-border)] bg-[rgba(7,19,34,0.92)] px-3 text-white outline-none transition focus:border-[rgba(253,203,88,0.45)]"
                >
                  {matches.map((match) => (
                    <option key={match.id} value={match.id}>
                      {match.matchday} · {match.opponentName} · {formatMatchDateLabel(match)}
                    </option>
                  ))}
                </select>
              </label>

              {selectedMatch ? (
                <div className="rounded-[12px] border border-white/10 bg-[rgba(255,255,255,0.04)] px-4 py-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-[1rem] font-semibold text-white">
                        {selectedTeam?.name} vs {selectedMatch.opponentName}
                      </p>
                      <p className="mt-1 text-[0.92rem] text-[color:var(--rr-muted)]">
                        {formatMatchDateLabel(selectedMatch)} · {selectedMatch.venue}
                      </p>
                    </div>
                    {statusBadge ? (
                      <AdminStatusBadge
                        label={statusBadge.label}
                        tone={statusBadge.tone}
                        pulse={statusBadge.pulse}
                      />
                    ) : null}
                  </div>
                </div>
              ) : null}

              <div className="rounded-[12px] border border-white/10 bg-[rgba(255,255,255,0.04)] px-4 py-4">
                <p className="rr-kicker text-[color:var(--rr-gold)]">Que registrar</p>
                <div className="mt-3 grid gap-2 text-[0.95rem] text-[color:var(--rr-muted)]">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[color:var(--rr-gold)]" />
                    Goles y asistencias
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[color:var(--rr-gold)]" />
                    MVP y tarjetas
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[color:var(--rr-gold)]" />
                    {selectedTeam?.isFirstTeam ? "Capa avanzada del Primer Equipo" : "Carga reducida para cantera"}
                  </div>
                </div>
              </div>

              {role === "COACH" ? (
                <div className="rounded-[12px] border border-white/10 bg-[rgba(255,255,255,0.04)] px-4 py-4 text-[0.9rem] text-[color:var(--rr-muted)]">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span>Ultimo guardado: {formatSavedTime(lastSavedAt)}</span>
                    <span className={hasUnsavedChanges ? "text-[color:var(--rr-gold)]" : "text-[color:var(--rr-muted)]"}>
                      {hasUnsavedChanges ? "Cambios sin guardar" : "Sin cambios pendientes"}
                    </span>
                  </div>
                </div>
              ) : null}
            </div>
          </AdminPanel>

          <AdminPanel className="p-5 sm:p-6">
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="rr-kicker text-[color:var(--rr-gold)]">Carga del partido</p>
                  <h2 className="rr-display mt-2 text-[1.85rem] leading-[0.96] text-white">
                    Aportacion por jugador
                  </h2>
                </div>
                <button type="button" onClick={saveStats} className="rr-button rr-button-primary text-[0.84rem]">
                  Guardar
                </button>
              </div>

              <div className="grid gap-3">
                {players.map((player) => (
                  <div
                    key={player.id}
                    className="rounded-[12px] border border-white/10 bg-[rgba(255,255,255,0.04)] px-4 py-4"
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
                      {selectedTeam?.isFirstTeam && player.advancedLabel ? (
                        <AdminStatusBadge label={player.advancedLabel} tone="blue" />
                      ) : null}
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5">
                      {[
                        ["Goles", "goals", player.goals],
                        ["Asist.", "assists", player.assists],
                        ["MVP", "mvp", player.mvp],
                        ["Amar.", "yellowCards", player.yellowCards],
                        ["Rojas", "redCards", player.redCards],
                      ].map(([label, field, value]) => (
                        <label key={field} className="grid gap-1">
                          <span className="rr-kicker text-[0.68rem] text-[color:var(--rr-muted)]">{label}</span>
                          <input
                            type="number"
                            min={0}
                            value={value}
                            onChange={(event) =>
                              handleUpdatePlayer(
                                player.id,
                                field as "goals" | "assists" | "yellowCards" | "redCards" | "mvp",
                                Number(event.target.value),
                              )
                            }
                            className="min-h-10 rounded-[8px] border border-white/10 bg-[rgba(7,19,34,0.92)] px-3 text-white outline-none transition focus:border-[rgba(253,203,88,0.45)]"
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {role === "COACH" ? (
                <div className="sticky bottom-4 z-10">
                  <div className="rounded-[12px] border border-[rgba(253,203,88,0.24)] bg-[rgba(10,18,31,0.96)] px-4 py-4 shadow-[0_12px_30px_rgba(0,0,0,0.22)]">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="text-[0.9rem] text-[color:var(--rr-muted)]">
                        {hasUnsavedChanges
                          ? "Hay cambios pendientes en esta jornada."
                          : "Todo guardado. Puedes volver a partidos o clasificacion."}
                      </div>

                      <div className="flex flex-col gap-3 sm:flex-row">
                        <Link
                          href={`/admin/partidos?team=${selectedTeam?.slug ?? ""}`}
                          className="rr-button rr-button-secondary text-[0.8rem]"
                        >
                          Volver a partidos
                        </Link>
                        <button
                          type="button"
                          onClick={saveStats}
                          className="rr-button rr-button-primary text-[0.8rem]"
                        >
                          Guardar estadisticas
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </AdminPanel>
        </div>
      ) : null}
    </div>
  );
}
