"use client";

import Link from "next/link";
import { startTransition, useEffect, useState } from "react";
import { AlertTriangle, ShieldCheck, Target, Trophy, Users } from "lucide-react";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { AdminFeedbackBanner } from "@/components/admin/admin-feedback-banner";
import { AdminCoachTeamSwitcher } from "@/components/admin/admin-coach-team-switcher";
import { AdminMetricCard } from "@/components/admin/admin-metric-card";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPanel } from "@/components/admin/admin-panel";
import { PlayerStatsMobileCard } from "@/components/admin/player-stats-mobile-card";
import { AdminScopePanel } from "@/components/admin/admin-scope-panel";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import {
  getAdminStatFields,
  incrementPlayerStat,
  isMobileAutoAdvanceField,
  isGoalkeeperPlayer,
  splitAdminStatFieldsForMobile,
  updatePlayerStat,
  type AdminStatFieldKey,
} from "@/lib/admin/admin-stats";
import { adminMockPlayers, type AdminPlayer } from "@/lib/admin/mock-data";
import {
  coachPreviewTeamSlugs,
  formatMatchDateLabel,
  getAllMatchManagementMatches,
  getCoachMatchVisualStatus,
  getCoachPreviewTeamOptions,
  getMatchManagementTeamsForRole,
  getVisualMatchStatus,
  sortCoachMatchManagementMatches,
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
type MobileStatsSection = "outfield" | "goalkeepers";
type MobileStatsViewMode = "list" | "focused";
type MobilePlayerReviewState = "pending" | "reviewed" | "edited";

function getInitialCoachTeamSlug(initialSelectedTeamSlug?: string) {
  return coachPreviewTeamSlugs.includes(
    initialSelectedTeamSlug as (typeof coachPreviewTeamSlugs)[number],
  )
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
  const [requestedTeamSlug, setRequestedTeamSlug] = useState<string>(
    initialSelectedTeamSlug ?? "",
  );
  const [requestedMatchId, setRequestedMatchId] = useState<string>(
    initialSelectedMatchId ?? "",
  );
  const [mobileSection, setMobileSection] = useState<MobileStatsSection>(
    "outfield",
  );
  const [mobileViewMode, setMobileViewMode] = useState<MobileStatsViewMode>("list");
  const [focusedPlayerIndex, setFocusedPlayerIndex] = useState(0);
  const [reviewedPlayerIds, setReviewedPlayerIds] = useState<string[]>([]);
  const [autoAdvanceEnabled, setAutoAdvanceEnabled] = useState(true);

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
      : allowedTeams.find((team) => team.slug === requestedTeamSlug)?.slug ??
        allowedTeams[0]?.slug ??
        "";
  const selectedTeam = allowedTeams.find((team) => team.slug === resolvedTeamSlug);
  const rawMatches = getAllMatchManagementMatches().filter(
    (match) => match.teamSlug === resolvedTeamSlug,
  );
  const matches =
    role === "COACH"
      ? sortCoachMatchManagementMatches(rawMatches)
      : sortMatchManagementMatches(rawMatches);
  const selectedMatch =
    matches.find((match) => match.id === requestedMatchId) ??
    matches.find((match) =>
      role === "COACH"
        ? getCoachMatchVisualStatus(match) === "pending"
        : getVisualMatchStatus(match.status) !== "played",
    ) ??
    matches[0];
  const players = allPlayers.filter((player) => player.teamSlug === resolvedTeamSlug);
  const savedTeamPlayers = savedPlayers.filter(
    (player) => player.teamSlug === resolvedTeamSlug,
  );
  const selectedMatchStatus = selectedMatch
    ? role === "COACH"
      ? getCoachMatchVisualStatus(selectedMatch)
      : getVisualMatchStatus(selectedMatch.status)
    : null;
  const statusBadge = selectedMatchStatus ? getStatusBadge(selectedMatchStatus) : null;
  const topContributor = [...players].sort(
    (left, right) =>
      right.goals + right.assists - (left.goals + left.assists),
  )[0];
  const hasUnsavedChanges =
    JSON.stringify(players) !== JSON.stringify(savedTeamPlayers);
  const goalkeepers = players.filter((player) => isGoalkeeperPlayer(player));
  const outfieldPlayers = players.filter((player) => !isGoalkeeperPlayer(player));
  const outfieldFields = getAdminStatFields({
    isFirstTeam: Boolean(selectedTeam?.isFirstTeam),
    isGoalkeeper: false,
  });
  const goalkeeperFields = getAdminStatFields({
    isFirstTeam: Boolean(selectedTeam?.isFirstTeam),
    isGoalkeeper: true,
  });
  const mobileOutfieldFields = splitAdminStatFieldsForMobile(
    outfieldFields,
    false,
  );
  const mobileGoalkeeperFields = splitAdminStatFieldsForMobile(
    goalkeeperFields,
    true,
  );
  const hasOutfieldPlayers = outfieldPlayers.length > 0;
  const hasGoalkeepers = goalkeepers.length > 0;
  const effectiveMobileSection =
    mobileSection === "outfield" && !hasOutfieldPlayers && hasGoalkeepers
      ? "goalkeepers"
      : mobileSection === "goalkeepers" && !hasGoalkeepers && hasOutfieldPlayers
        ? "outfield"
        : mobileSection;
  const mobileVisiblePlayers =
    effectiveMobileSection === "goalkeepers" ? goalkeepers : outfieldPlayers;
  const mobileVisibleFields =
    effectiveMobileSection === "goalkeepers"
      ? mobileGoalkeeperFields
      : mobileOutfieldFields;
  const effectiveFocusedPlayerIndex = Math.min(
    focusedPlayerIndex,
    Math.max(0, mobileVisiblePlayers.length - 1),
  );
  const focusedMobilePlayer = mobileVisiblePlayers[effectiveFocusedPlayerIndex];

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
    field: AdminStatFieldKey,
    value: number,
  ) {
    setReviewedPlayerIds((currentIds) =>
      currentIds.includes(playerId) ? currentIds : [...currentIds, playerId],
    );
    setAllPlayers((currentPlayers) =>
      updatePlayerStat(currentPlayers, playerId, field, value),
    );
  }

  function handleAdjustPlayer(
    playerId: string,
    field: AdminStatFieldKey,
    delta: number,
  ) {
    setReviewedPlayerIds((currentIds) =>
      currentIds.includes(playerId) ? currentIds : [...currentIds, playerId],
    );
    setAllPlayers((currentPlayers) =>
      incrementPlayerStat(currentPlayers, playerId, field, delta),
    );

    if (
      mobileViewMode === "focused" &&
      autoAdvanceEnabled &&
      delta > 0 &&
      isMobileAutoAdvanceField(field) &&
      focusedMobilePlayer?.id === playerId &&
      focusedPlayerIndex < mobileVisiblePlayers.length - 1
    ) {
      setFocusedPlayerIndex((current) =>
        Math.min(mobileVisiblePlayers.length - 1, current + 1),
      );
    }
  }

  function markPlayerReviewed(playerId: string) {
    setReviewedPlayerIds((currentIds) =>
      currentIds.includes(playerId) ? currentIds : [...currentIds, playerId],
    );
  }

  function getPlayerReviewState(player: AdminPlayer): MobilePlayerReviewState {
    const savedPlayer = savedTeamPlayers.find(
      (candidate) => candidate.id === player.id,
    );
    const hasChanges =
      savedPlayer !== undefined &&
      JSON.stringify(player) !== JSON.stringify(savedPlayer);

    if (hasChanges) {
      return "edited";
    }

    return reviewedPlayerIds.includes(player.id) ? "reviewed" : "pending";
  }

  const pendingPlayerCount = players.filter(
    (player) => getPlayerReviewState(player) === "pending",
  ).length;

  function canChangeMatch(nextMatchId: string) {
    if (
      role !== "COACH" ||
      nextMatchId === (selectedMatch?.id ?? "") ||
      pendingPlayerCount === 0
    ) {
      return true;
    }

    return window.confirm(
      `Todavia quedan ${pendingPlayerCount} ${
        pendingPlayerCount === 1 ? "jugador pendiente" : "jugadores pendientes"
      } sin revisar en este partido. ¿Quieres cambiar igualmente?`,
    );
  }

  function goToPreviousFocusedPlayer() {
    setFocusedPlayerIndex(Math.max(0, effectiveFocusedPlayerIndex - 1));
  }

  function goToNextFocusedPlayer() {
    if (!focusedMobilePlayer) {
      return;
    }

    markPlayerReviewed(focusedMobilePlayer.id);
    setFocusedPlayerIndex(
      Math.min(mobileVisiblePlayers.length - 1, effectiveFocusedPlayerIndex + 1),
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <AdminPageHeader
        eyebrow={role === "COACH" ? "Partido y plantilla" : "Control de estadisticas"}
        title="Estadisticas"
        description={
          role === "COACH"
            ? "Elige partido, edita lo importante y guarda."
            : "Selecciona equipo y partido para actualizar la tabla."
        }
        actions={
          <Link
            href={`/admin/partidos?team=${selectedTeam?.slug ?? ""}`}
            className="hidden sm:inline-flex rr-button rr-button-secondary text-[0.84rem]"
          >
            Ir a partidos
          </Link>
        }
      />

      {bannerMessage ? <AdminFeedbackBanner message={bannerMessage} /> : null}

      {role === "COACH" ? (
        <>
          <AdminPanel className="p-4 sm:hidden">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <p className="rr-kicker text-[color:var(--rr-gold)]">
                  Flujo de entrenador
                </p>
                <p className="text-[0.98rem] font-semibold text-white">
                  Partido, estadisticas y guardado rapido
                </p>
                <p className="text-[0.88rem] text-[color:var(--rr-muted)]">
                  Cambia de equipo o vuelve a partidos sin salir del flujo.
                </p>
              </div>

              <AdminCoachTeamSwitcher
                options={coachPreviewTeamOptions}
                value={coachTeamSlug}
                onChange={setCoachTeamSlug}
              />

              <div className="grid gap-2">
                <Link
                  href={`/admin/partidos?team=${selectedTeam?.slug ?? ""}`}
                  className="rr-button rr-button-secondary w-full justify-center text-[0.8rem]"
                >
                  Ver partidos
                </Link>
                <Link
                  href={`/admin/clasificaciones?team=${selectedTeam?.slug ?? ""}`}
                  className="rr-button rr-button-secondary w-full justify-center text-[0.8rem]"
                >
                  Editar clasificacion
                </Link>
              </div>
            </div>
          </AdminPanel>

          <div className="hidden sm:block">
            <AdminScopePanel
              eyebrow="Flujo de entrenador"
              title="Una tabla por partido"
              description="Resultado, estadisticas y clasificacion del mismo equipo."
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
          </div>
        </>
      ) : null}

      {role === "COACH" && selectedMatch ? (
        <AdminPanel className="hidden border-[rgba(253,203,88,0.24)] p-5 sm:block sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <p className="rr-kicker text-[color:var(--rr-gold)]">Partido activo</p>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-[1.12rem] font-semibold text-white sm:text-[1.25rem]">
                  {selectedTeam?.name} vs {selectedMatch.opponentName}
                </h2>
                {statusBadge ? (
                  <AdminStatusBadge
                    label={statusBadge.label}
                    tone={statusBadge.tone}
                    pulse={statusBadge.pulse}
                  />
                ) : null}
              </div>
              <p className="text-[0.92rem] text-[color:var(--rr-muted)]">
                {selectedMatch.matchday} · {formatMatchDateLabel(selectedMatch)} ·{" "}
                {selectedMatch.venue}
              </p>
            </div>

            <button
              type="button"
              onClick={saveStats}
              className="rr-button rr-button-primary justify-center text-[0.82rem]"
            >
              Guardar estadisticas
            </button>
          </div>
        </AdminPanel>
      ) : null}

      <div className="hidden gap-4 md:grid md:grid-cols-2 xl:grid-cols-4">
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
          detail={selectedTeam?.isFirstTeam ? "Campos ampliados" : "Campos base"}
          tone="slate"
          icon={<Users className="h-5 w-5" />}
        />
        <AdminMetricCard
          label="Aportacion actual"
          value={topContributor ? `#${topContributor.number}` : "-"}
          detail={
            topContributor
              ? `${topContributor.name} · ${topContributor.goals + topContributor.assists} acciones`
              : "Sin referencia"
          }
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
                  <div
                    key={index}
                    className="h-24 animate-pulse rounded-[10px] bg-white/6"
                  />
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
              La pantalla contempla un error operativo para validar estados y
              jerarquia antes de conectar datos reales.
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
          description="Amplia los datos de prueba o cambia de equipo para revisar la tabla."
        />
      ) : null}

      {screenState === "ready" && players.length > 0 ? (
        <div className="space-y-4">
          <AdminPanel className="p-5 sm:p-6">
            <div className="space-y-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-2">
                  <div className="sm:hidden">
                    <p className="rr-kicker text-[color:var(--rr-gold)]">Edicion actual</p>
                    <p className="mt-1 text-[1rem] font-semibold text-white">
                      {selectedTeam?.name ?? "Sin equipo"}
                    </p>
                  </div>
                  <div className="hidden sm:block">
                    <p className="rr-kicker text-[color:var(--rr-gold)]">Contexto</p>
                    <h2 className="rr-display mt-2 text-[1.85rem] leading-[0.96] text-white">
                      Seleccion activa
                    </h2>
                  </div>
                </div>
                <div className="rounded-[12px] border border-white/10 bg-[rgba(255,255,255,0.04)] px-4 py-4 text-[0.9rem] text-[color:var(--rr-muted)]">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span>Ultimo guardado: {formatSavedTime(lastSavedAt)}</span>
                    <span
                      className={
                        hasUnsavedChanges
                          ? "text-[color:var(--rr-gold)]"
                          : "text-[color:var(--rr-muted)]"
                      }
                    >
                      {hasUnsavedChanges
                        ? "Cambios sin guardar"
                        : "Sin cambios pendientes"}
                    </span>
                  </div>
                </div>
              </div>

              <div
                className={`grid gap-4 ${
                  role !== "COACH" ? "xl:grid-cols-[18rem_minmax(0,1fr)]" : ""
                }`}
              >
                {role !== "COACH" ? (
                  <label className="grid gap-2">
                    <span className="rr-kicker text-[0.74rem] text-[color:var(--rr-muted)]">
                      Equipo
                    </span>
                  <select
                    value={resolvedTeamSlug}
                    onChange={(event) => {
                      setRequestedTeamSlug(event.target.value);
                      setFocusedPlayerIndex(0);
                      setReviewedPlayerIds([]);
                    }}
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
                  <span className="rr-kicker text-[0.74rem] text-[color:var(--rr-muted)]">
                    Partido
                  </span>
                  <select
                    value={selectedMatch?.id ?? ""}
                    onChange={(event) => {
                      const nextMatchId = event.target.value;

                      if (!canChangeMatch(nextMatchId)) {
                        return;
                      }

                      setRequestedMatchId(nextMatchId);
                      setFocusedPlayerIndex(0);
                      setReviewedPlayerIds([]);
                    }}
                    className="min-h-11 rounded-[8px] border border-[color:var(--rr-border)] bg-[rgba(7,19,34,0.92)] px-3 text-white outline-none transition focus:border-[rgba(253,203,88,0.45)]"
                  >
                    {matches.map((match) => (
                      <option key={match.id} value={match.id}>
                        {match.matchday} · {match.opponentName} ·{" "}
                        {formatMatchDateLabel(match)}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

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
            </div>
          </AdminPanel>

          <AdminPanel className="p-5 sm:p-6">
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="rr-kicker text-[color:var(--rr-gold)]">
                    {role === "COACH" ? "Carga rapida" : "Tabla editable"}
                  </p>
                  <h2 className="rr-display mt-2 text-[1.35rem] leading-[0.98] text-white sm:text-[1.85rem] sm:leading-[0.96]">
                    Estadisticas por jugador
                  </h2>
                  <p className="mt-1 text-[0.88rem] text-[color:var(--rr-muted)]">
                    Abre una ficha, corrige lo importante y guarda al final.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={saveStats}
                  className={`rr-button rr-button-primary text-[0.84rem] ${
                    role === "COACH" ? "hidden lg:inline-flex" : ""
                  }`}
                >
                  Guardar
                </button>
              </div>

              <div className="space-y-4 lg:hidden">
                {(hasOutfieldPlayers || hasGoalkeepers) && (
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {hasOutfieldPlayers ? (
                        <button
                          type="button"
                          onClick={() => {
                            setMobileSection("outfield");
                            setFocusedPlayerIndex(0);
                          }}
                          className={`rounded-full border px-3 py-2 text-[0.82rem] font-medium transition ${
                            effectiveMobileSection === "outfield"
                              ? "border-[rgba(253,203,88,0.32)] bg-[rgba(253,203,88,0.12)] text-[color:var(--rr-gold)]"
                              : "border-white/10 bg-white/5 text-[color:var(--rr-muted)]"
                          }`}
                        >
                          Jugadores ({outfieldPlayers.length})
                        </button>
                      ) : null}

                      {hasGoalkeepers ? (
                        <button
                          type="button"
                          onClick={() => {
                            setMobileSection("goalkeepers");
                            setFocusedPlayerIndex(0);
                          }}
                          className={`rounded-full border px-3 py-2 text-[0.82rem] font-medium transition ${
                            effectiveMobileSection === "goalkeepers"
                              ? "border-[rgba(253,203,88,0.32)] bg-[rgba(253,203,88,0.12)] text-[color:var(--rr-gold)]"
                              : "border-white/10 bg-white/5 text-[color:var(--rr-muted)]"
                          }`}
                        >
                          Porteros ({goalkeepers.length})
                        </button>
                      ) : null}
                    </div>

                    <div className="grid grid-cols-2 gap-2 rounded-[12px] border border-white/10 bg-white/4 p-1">
                      <button
                        type="button"
                        onClick={() => setMobileViewMode("list")}
                        className={`rounded-[10px] px-3 py-2 text-[0.82rem] font-medium transition ${
                          mobileViewMode === "list"
                            ? "bg-[rgba(253,203,88,0.14)] text-[color:var(--rr-gold)]"
                            : "text-[color:var(--rr-muted)]"
                        }`}
                      >
                        Vista lista
                      </button>
                      <button
                        type="button"
                        onClick={() => setMobileViewMode("focused")}
                        className={`rounded-[10px] px-3 py-2 text-[0.82rem] font-medium transition ${
                          mobileViewMode === "focused"
                            ? "bg-[rgba(253,203,88,0.14)] text-[color:var(--rr-gold)]"
                            : "text-[color:var(--rr-muted)]"
                        }`}
                      >
                        Uno a uno
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-[0.8rem]">
                      <div className="rounded-[10px] border border-white/10 bg-white/4 px-3 py-2 text-[color:var(--rr-muted)]">
                        Pendientes:{" "}
                        <span className="font-semibold text-white">
                          {
                            mobileVisiblePlayers.filter(
                              (player) => getPlayerReviewState(player) === "pending",
                            ).length
                          }
                        </span>
                      </div>
                      <div className="rounded-[10px] border border-[rgba(52,112,200,0.24)] bg-[rgba(52,112,200,0.08)] px-3 py-2 text-[#9fc4ff]">
                        Revisados:{" "}
                        <span className="font-semibold text-white">
                          {
                            mobileVisiblePlayers.filter(
                              (player) => getPlayerReviewState(player) === "reviewed",
                            ).length
                          }
                        </span>
                      </div>
                      <div className="rounded-[10px] border border-[rgba(253,203,88,0.24)] bg-[rgba(253,203,88,0.08)] px-3 py-2 text-[color:var(--rr-gold)]">
                        Editados:{" "}
                        <span className="font-semibold text-white">
                          {
                            mobileVisiblePlayers.filter(
                              (player) => getPlayerReviewState(player) === "edited",
                            ).length
                          }
                        </span>
                      </div>
                    </div>

                    {mobileViewMode === "focused" && focusedMobilePlayer ? (
                      <div className="space-y-3 rounded-[12px] border border-[rgba(253,203,88,0.2)] bg-[rgba(253,203,88,0.06)] px-4 py-3 text-[0.88rem] text-[color:var(--rr-muted)]">
                        <div>
                          Jugador {effectiveFocusedPlayerIndex + 1} de {mobileVisiblePlayers.length}
                        </div>
                        <label className="flex items-center justify-between gap-3 rounded-[10px] border border-white/10 bg-[rgba(7,19,34,0.42)] px-3 py-3">
                          <div>
                            <p className="text-[0.88rem] font-medium text-white">
                              Autoavance
                            </p>
                            <p className="text-[0.78rem] text-[color:var(--rr-muted)]">
                              Salta al siguiente tras MVP, TA, TR o porteria a 0.
                            </p>
                          </div>
                          <button
                            type="button"
                            role="switch"
                            aria-checked={autoAdvanceEnabled}
                            onClick={() => setAutoAdvanceEnabled((current) => !current)}
                            className={`relative inline-flex h-7 w-12 shrink-0 rounded-full border transition ${
                              autoAdvanceEnabled
                                ? "border-[rgba(253,203,88,0.28)] bg-[rgba(253,203,88,0.16)]"
                                : "border-white/10 bg-white/6"
                            }`}
                          >
                            <span
                              className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                                autoAdvanceEnabled ? "left-6" : "left-1"
                              }`}
                            />
                          </button>
                        </label>
                      </div>
                    ) : null}
                  </div>
                )}

                {mobileViewMode === "focused" && focusedMobilePlayer ? (
                  <div className="space-y-3">
                    <PlayerStatsMobileCard
                      key={focusedMobilePlayer.id}
                      player={focusedMobilePlayer}
                      savedPlayer={savedTeamPlayers.find(
                        (savedPlayer) => savedPlayer.id === focusedMobilePlayer.id,
                      )}
                      primaryFields={mobileVisibleFields.primaryFields}
                      secondaryFields={mobileVisibleFields.secondaryFields}
                      reviewState={getPlayerReviewState(focusedMobilePlayer)}
                      onUpdatePlayer={handleUpdatePlayer}
                      onAdjustPlayer={handleAdjustPlayer}
                    />

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={goToPreviousFocusedPlayer}
                        disabled={effectiveFocusedPlayerIndex === 0}
                        className="rr-button rr-button-secondary justify-center text-[0.82rem] disabled:cursor-not-allowed disabled:opacity-45"
                      >
                        Jugador anterior
                      </button>
                      <button
                        type="button"
                        onClick={goToNextFocusedPlayer}
                        disabled={effectiveFocusedPlayerIndex >= mobileVisiblePlayers.length - 1}
                        className="rr-button rr-button-primary justify-center text-[0.82rem] disabled:cursor-not-allowed disabled:opacity-45"
                      >
                        Siguiente jugador
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {mobileVisiblePlayers.map((player) => (
                      <PlayerStatsMobileCard
                        key={player.id}
                        player={player}
                        savedPlayer={savedTeamPlayers.find(
                          (savedPlayer) => savedPlayer.id === player.id,
                        )}
                        primaryFields={mobileVisibleFields.primaryFields}
                        secondaryFields={mobileVisibleFields.secondaryFields}
                        reviewState={getPlayerReviewState(player)}
                        onUpdatePlayer={handleUpdatePlayer}
                        onAdjustPlayer={handleAdjustPlayer}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="hidden space-y-6 lg:block">
                {outfieldPlayers.length > 0 ? (
                  <section className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="rr-kicker text-[color:var(--rr-gold)]">
                        Jugadores
                      </p>
                      <p className="text-[0.84rem] text-[color:var(--rr-muted)]">
                        {outfieldPlayers.length} jugadores
                      </p>
                    </div>

                    <div className="grid gap-4 xl:grid-cols-2 2xl:grid-cols-3">
                      {outfieldPlayers.map((player) => (
                        <PlayerStatsMobileCard
                          key={player.id}
                          player={player}
                          savedPlayer={savedTeamPlayers.find(
                            (savedPlayer) => savedPlayer.id === player.id,
                          )}
                          primaryFields={mobileOutfieldFields.primaryFields}
                          secondaryFields={mobileOutfieldFields.secondaryFields}
                          reviewState={getPlayerReviewState(player)}
                          defaultShowMore
                          className="h-full"
                          onUpdatePlayer={handleUpdatePlayer}
                          onAdjustPlayer={handleAdjustPlayer}
                        />
                      ))}
                    </div>
                  </section>
                ) : null}

                {goalkeepers.length > 0 ? (
                  <section className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="rr-kicker text-[color:var(--rr-gold)]">
                        Porteros
                      </p>
                      <p className="text-[0.84rem] text-[color:var(--rr-muted)]">
                        {goalkeepers.length} {goalkeepers.length === 1 ? "portero" : "porteros"}
                      </p>
                    </div>

                    <div className="grid gap-4 xl:grid-cols-2 2xl:grid-cols-3">
                      {goalkeepers.map((player) => (
                        <PlayerStatsMobileCard
                          key={player.id}
                          player={player}
                          savedPlayer={savedTeamPlayers.find(
                            (savedPlayer) => savedPlayer.id === player.id,
                          )}
                          primaryFields={mobileGoalkeeperFields.primaryFields}
                          secondaryFields={mobileGoalkeeperFields.secondaryFields}
                          reviewState={getPlayerReviewState(player)}
                          defaultShowMore
                          className="h-full"
                          onUpdatePlayer={handleUpdatePlayer}
                          onAdjustPlayer={handleAdjustPlayer}
                        />
                      ))}
                    </div>
                  </section>
                ) : null}
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
