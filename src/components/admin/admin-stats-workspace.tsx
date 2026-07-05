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
  hasAdminMatchEntryImpact,
  cloneAdminStatsState,
  createInitialAdminStatsState,
  getAdminStatFields,
  getMatchEntryForPlayer,
  getSeasonPlayerTotals,
  incrementPlayerMatchStat,
  isMobileAutoAdvanceField,
  isGoalkeeperPlayer,
  splitAdminStatFieldsForMobile,
  togglePlayerMatchParticipation,
  updatePlayerMatchStat,
  type AdminEditableStatFieldKey,
  type AdminMatchPlayerEntry,
} from "@/lib/admin/admin-stats";
import {
  adminMockPlayers,
  adminMockTeams,
  type AdminPlayer,
} from "@/lib/admin/mock-data";
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
type VisibleStatsPlayer = AdminPlayer & {
  contextType: "regular" | "guest";
  originTeamName?: string;
};

const initialMatches = getAllMatchManagementMatches();
const teamNameBySlug = new Map(adminMockTeams.map((team) => [team.slug, team.name]));

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

function areMatchEntriesEqual(
  left: AdminMatchPlayerEntry,
  right: AdminMatchPlayerEntry,
) {
  return (
    left.played === right.played &&
    left.goals === right.goals &&
    left.assists === right.assists &&
    left.mvp === right.mvp &&
    left.yellowCards === right.yellowCards &&
    left.redCards === right.redCards &&
    left.recoveries === right.recoveries &&
    left.shots === right.shots &&
    left.shotsOnTarget === right.shotsOnTarget &&
    left.ownGoals === right.ownGoals &&
    left.goalsConceded === right.goalsConceded &&
    left.saves === right.saves &&
    left.cleanSheets === right.cleanSheets
  );
}

function createGuestPlayerContext(
  player: AdminPlayer,
  targetTeamSlug: string,
): VisibleStatsPlayer {
  return {
    ...player,
    teamSlug: targetTeamSlug,
    minutes: 0,
    matchesPlayed: 0,
    goals: 0,
    assists: 0,
    yellowCards: 0,
    redCards: 0,
    mvp: 0,
    goalsConceded: 0,
    saves: 0,
    cleanSheets: 0,
    recoveries: 0,
    shots: 0,
    shotsOnTarget: 0,
    ownGoals: 0,
    advancedLabel: undefined,
    contextType: "guest",
    originTeamName: teamNameBySlug.get(player.teamSlug),
  };
}

export function AdminStatsWorkspace({
  role,
  initialUiState = "ready",
  initialSelectedTeamSlug,
  initialSelectedMatchId,
}: AdminStatsWorkspaceProps) {
  const [screenState, setScreenState] = useState<ScreenState>("loading");
  const [bannerMessage, setBannerMessage] = useState<string | null>(null);
  const [statsState, setStatsState] = useState(() =>
    createInitialAdminStatsState(adminMockPlayers, initialMatches),
  );
  const [savedStatsState, setSavedStatsState] = useState(() =>
    createInitialAdminStatsState(adminMockPlayers, initialMatches),
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
  const [pendingGuestPlayerId, setPendingGuestPlayerId] = useState<string>("");
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
  const rawMatches = initialMatches.filter(
    (match) => match.teamSlug === resolvedTeamSlug && match.status === "played",
  );
  const matches =
    role === "COACH"
      ? sortCoachMatchManagementMatches(rawMatches)
      : sortMatchManagementMatches(rawMatches);
  const selectedMatch =
    matches.find((match) => match.id === requestedMatchId) ?? matches[0];
  const regularTeamPlayers = adminMockPlayers.filter(
    (player) => player.teamSlug === resolvedTeamSlug,
  );
  const regularTeamPlayerIds = new Set(
    regularTeamPlayers.map((player) => player.id),
  );
  const guestPlayerIds = Array.from(
    new Set(
      matches.flatMap((match) =>
        Object.entries(statsState.matchEntriesByMatchId[match.id] ?? {})
          .filter(
            ([playerId, entry]) =>
              !regularTeamPlayerIds.has(playerId) && hasAdminMatchEntryImpact(entry),
          )
          .map(([playerId]) => playerId),
      ),
    ),
  );
  const guestPlayers = guestPlayerIds
    .map((playerId) => adminMockPlayers.find((player) => player.id === playerId))
    .filter((player): player is AdminPlayer => Boolean(player))
    .map((player) => createGuestPlayerContext(player, resolvedTeamSlug));
  const visiblePlayerSeeds: VisibleStatsPlayer[] = [
    ...regularTeamPlayers.map((player) => ({
      ...player,
      contextType: "regular" as const,
    })),
    ...guestPlayers,
  ];
  const addableGuestPlayers = adminMockPlayers.filter(
    (player) =>
      player.teamSlug !== resolvedTeamSlug &&
      !regularTeamPlayerIds.has(player.id) &&
      !guestPlayerIds.includes(player.id),
  );
  const players: VisibleStatsPlayer[] = visiblePlayerSeeds.map((player) => ({
    ...getSeasonPlayerTotals(player, statsState),
    contextType: player.contextType,
    originTeamName: player.originTeamName,
  }));
  const selectedMatchStatus = selectedMatch
    ? role === "COACH"
      ? getCoachMatchVisualStatus(selectedMatch)
      : getVisualMatchStatus(selectedMatch.status)
    : null;
  const statusBadge = selectedMatchStatus ? getStatusBadge(selectedMatchStatus) : null;
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

  const selectedMatchEntries: Record<string, AdminMatchPlayerEntry> = selectedMatch
    ? Object.fromEntries(
        visiblePlayerSeeds.map((player) => [
          player.id,
          getMatchEntryForPlayer(statsState, selectedMatch.id, player.id),
        ]),
      )
    : {};

  const savedSelectedMatchEntries: Record<string, AdminMatchPlayerEntry> = selectedMatch
    ? Object.fromEntries(
        visiblePlayerSeeds.map((player) => [
          player.id,
          getMatchEntryForPlayer(savedStatsState, selectedMatch.id, player.id),
        ]),
      )
    : {};

  const hasUnsavedChanges = Boolean(selectedMatch) &&
    visiblePlayerSeeds.some((player) => {
      const currentEntry = selectedMatchEntries[player.id];
      const savedEntry = savedSelectedMatchEntries[player.id];

      return (
        currentEntry !== undefined &&
        savedEntry !== undefined &&
        !areMatchEntriesEqual(currentEntry, savedEntry)
      );
    });

  const selectedMatchPlayedCount = selectedMatch
    ? visiblePlayerSeeds.filter((player) => selectedMatchEntries[player.id]?.played).length
    : 0;
  const selectedMatchActionCount = selectedMatch
    ? visiblePlayerSeeds.reduce((total, player) => {
        const entry = selectedMatchEntries[player.id];
        return total + (entry?.goals ?? 0) + (entry?.assists ?? 0);
      }, 0)
    : 0;

  function pushBanner(message: string) {
    startTransition(() => setBannerMessage(message));
  }

  function saveStats() {
    setSavedStatsState(cloneAdminStatsState(statsState));
    setLastSavedAt(new Date());
    pushBanner("Participacion y estadisticas del partido guardadas.");
  }

  function resetReviewContext() {
    setFocusedPlayerIndex(0);
    setReviewedPlayerIds([]);
    setPendingGuestPlayerId("");
  }

  function handleUpdatePlayer(
    playerId: string,
    field: AdminEditableStatFieldKey,
    value: number,
  ) {
    if (!selectedMatch) {
      return;
    }

    setReviewedPlayerIds((currentIds) =>
      currentIds.includes(playerId) ? currentIds : [...currentIds, playerId],
    );
    setStatsState((currentState) =>
      updatePlayerMatchStat(currentState, selectedMatch.id, playerId, field, value),
    );
  }

  function handleAdjustPlayer(
    playerId: string,
    field: AdminEditableStatFieldKey,
    delta: number,
  ) {
    if (!selectedMatch) {
      return;
    }

    setReviewedPlayerIds((currentIds) =>
      currentIds.includes(playerId) ? currentIds : [...currentIds, playerId],
    );
    setStatsState((currentState) =>
      incrementPlayerMatchStat(currentState, selectedMatch.id, playerId, field, delta),
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

  function handleTogglePlayed(playerId: string) {
    if (!selectedMatch) {
      return;
    }

    setReviewedPlayerIds((currentIds) =>
      currentIds.includes(playerId) ? currentIds : [...currentIds, playerId],
    );
    setStatsState((currentState) =>
      togglePlayerMatchParticipation(currentState, selectedMatch.id, playerId),
    );
  }

  function handleAddGuestPlayer() {
    if (!selectedMatch || !pendingGuestPlayerId) {
      return;
    }

    const guestPlayer = adminMockPlayers.find(
      (player) => player.id === pendingGuestPlayerId,
    );

    if (!guestPlayer) {
      return;
    }

    setReviewedPlayerIds((currentIds) =>
      currentIds.includes(guestPlayer.id) ? currentIds : [...currentIds, guestPlayer.id],
    );
    setStatsState((currentState) =>
      togglePlayerMatchParticipation(currentState, selectedMatch.id, guestPlayer.id),
    );
    setPendingGuestPlayerId("");
    setMobileSection(isGoalkeeperPlayer(guestPlayer) ? "goalkeepers" : "outfield");
    pushBanner(`Jugador puntual anadido: ${guestPlayer.name}.`);
  }

  function markPlayerReviewed(playerId: string) {
    setReviewedPlayerIds((currentIds) =>
      currentIds.includes(playerId) ? currentIds : [...currentIds, playerId],
    );
  }

  function getPlayerReviewState(player: AdminPlayer): MobilePlayerReviewState {
    if (!selectedMatch) {
      return "pending";
    }

    const currentEntry = selectedMatchEntries[player.id];
    const savedEntry = savedSelectedMatchEntries[player.id];
    const hasChanges =
      currentEntry !== undefined &&
      savedEntry !== undefined &&
      !areMatchEntriesEqual(currentEntry, savedEntry);

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
      } sin revisar en este partido. Quieres cambiar igualmente?`,
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
        eyebrow={role === "COACH" ? "Partido y acumulado" : "Control de estadisticas"}
        title="Estadisticas"
        description={
          role === "COACH"
            ? "Elige el partido activo, marca quien ha jugado y carga sus stats. El acumulado y las medias se recalculan en la misma pantalla."
            : "Selecciona equipo y partido activo para cargar la participacion y mantener visible el acumulado de temporada."
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
                  Partido activo y acumulado a la vista
                </p>
                <p className="text-[0.88rem] text-[color:var(--rr-muted)]">
                  Carga quien ha jugado y que ha hecho, sin perder el total de temporada.
                </p>
              </div>

              <AdminCoachTeamSwitcher
                options={coachPreviewTeamOptions}
                value={coachTeamSlug}
                onChange={(nextCoachTeamSlug) => {
                  setCoachTeamSlug(nextCoachTeamSlug);
                  resetReviewContext();
                }}
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
              title="Una carga por partido, una lectura acumulada"
              description="Arriba eliges el partido que estas cerrando. Debajo decides quien ha jugado y ves a la vez el acumulado de temporada."
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
                  onChange={(nextCoachTeamSlug) => {
                    setCoachTeamSlug(nextCoachTeamSlug);
                    resetReviewContext();
                  }}
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
              <p className="text-[0.86rem] text-[color:var(--rr-muted)]">
                {selectedMatchPlayedCount} de {players.length} jugadores marcados como participantes.
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
          label="Partido activo"
          value={selectedMatch?.matchday ?? "-"}
          detail={selectedMatch ? formatMatchDateLabel(selectedMatch) : "Sin partido"}
          tone="blue"
          icon={<Trophy className="h-5 w-5" />}
        />
        <AdminMetricCard
          label="Han jugado"
          value={selectedMatch ? selectedMatchPlayedCount.toString() : "-"}
          detail={
            selectedMatch
              ? `de ${players.length} jugadores visibles`
              : "Sin partido seleccionado"
          }
          tone="slate"
          icon={<Users className="h-5 w-5" />}
        />
        <AdminMetricCard
          label="Jugadores puntuales"
          value={guestPlayers.length.toString()}
          detail={
            selectedMatch
              ? `${selectedMatchActionCount} acciones en el partido activo`
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
          description="Amplia los datos de prueba o cambia de equipo para revisar la carga de partido."
        />
      ) : null}

      {screenState === "ready" && players.length > 0 && matches.length === 0 ? (
        <AdminEmptyState
          title="Sin partidos jugados"
          description="Las estadisticas solo se cargan desde partidos ya cerrados."
        />
      ) : null}

      {screenState === "ready" && players.length > 0 && selectedMatch ? (
        <div className="space-y-4">
          <AdminPanel className="p-5 sm:p-6">
            <div className="space-y-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="space-y-2">
                  <p className="rr-kicker text-[color:var(--rr-gold)]">
                    Contexto de carga
                  </p>
                  <h2 className="text-[1.18rem] font-semibold text-white sm:text-[1.35rem]">
                    El partido define la participacion. El acumulado permanece visible.
                  </h2>
                  <p className="text-[0.9rem] text-[color:var(--rr-muted)]">
                    Marca quien ha jugado en {selectedMatch.matchday} y carga ahi sus acciones. La temporada y las medias se recalculan al momento.
                  </p>
                </div>

                <div className="rounded-[10px] border border-white/10 bg-white/4 px-4 py-3 text-[0.84rem] text-[color:var(--rr-muted)]">
                  Ultimo guardado:{" "}
                  <span
                    className={
                      hasUnsavedChanges
                        ? "text-[color:var(--rr-gold)]"
                        : "text-[color:var(--rr-muted)]"
                    }
                  >
                    {formatSavedTime(lastSavedAt)}
                  </span>
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
                        resetReviewContext();
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
                    Partido activo
                  </span>
                  <select
                    value={selectedMatch.id}
                    onChange={(event) => {
                      const nextMatchId = event.target.value;

                      if (!canChangeMatch(nextMatchId)) {
                        return;
                      }

                      setRequestedMatchId(nextMatchId);
                      resetReviewContext();
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

              <div className="rounded-[12px] border border-white/10 bg-[rgba(255,255,255,0.04)] px-4 py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-[1rem] font-semibold text-white">
                      {selectedTeam?.name} vs {selectedMatch.opponentName}
                    </p>
                    <p className="mt-1 text-[0.92rem] text-[color:var(--rr-muted)]">
                      {selectedMatch.matchday} · {formatMatchDateLabel(selectedMatch)} ·{" "}
                      {selectedMatch.venue}
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

              <div className="grid gap-3 rounded-[12px] border border-[rgba(52,112,200,0.24)] bg-[rgba(52,112,200,0.06)] px-4 py-3 xl:grid-cols-[auto_minmax(16rem,22rem)_auto] xl:items-center">
                <p className="rr-kicker text-[#9fc4ff]">Jugador puntual</p>

                <div className="grid gap-3 sm:grid-cols-[minmax(16rem,22rem)_auto] xl:col-span-2">
                  <select
                    value={pendingGuestPlayerId}
                    onChange={(event) => setPendingGuestPlayerId(event.target.value)}
                    className="min-h-11 rounded-[8px] border border-[color:var(--rr-border)] bg-[rgba(7,19,34,0.92)] px-3 text-white outline-none transition focus:border-[rgba(253,203,88,0.45)]"
                  >
                    <option value="">Selecciona un jugador</option>
                    {addableGuestPlayers.map((player) => (
                      <option key={player.id} value={player.id}>
                        {player.name} · {teamNameBySlug.get(player.teamSlug) ?? player.teamSlug}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={handleAddGuestPlayer}
                    disabled={!pendingGuestPlayerId}
                    className="rr-button rr-button-secondary justify-center text-[0.82rem] disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    Anadir al partido
                  </button>
                </div>
              </div>
            </div>
          </AdminPanel>

          <AdminPanel className="p-5 sm:p-6">
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="rr-kicker text-[color:var(--rr-gold)]">
                    {role === "COACH" ? "Carga por partido" : "Partido y temporada"}
                  </p>
                  <h2 className="rr-display mt-2 text-[1.35rem] leading-[0.98] text-white sm:text-[1.85rem] sm:leading-[0.96]">
                    Participacion, acumulado y medias
                  </h2>
                  <p className="mt-1 text-[0.88rem] text-[color:var(--rr-muted)]">
                    Cada card muestra el total de temporada y, debajo, lo que suma el partido activo.
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
                      matchEntry={selectedMatchEntries[focusedMobilePlayer.id]}
                      savedMatchEntry={savedSelectedMatchEntries[focusedMobilePlayer.id]}
                      isGuestPlayer={focusedMobilePlayer.contextType === "guest"}
                      guestOriginTeamName={focusedMobilePlayer.originTeamName}
                      primaryFields={mobileVisibleFields.primaryFields}
                      secondaryFields={mobileVisibleFields.secondaryFields}
                      reviewState={getPlayerReviewState(focusedMobilePlayer)}
                      selectedMatchLabel={selectedMatch.matchday}
                      statsLevel={selectedTeam?.isFirstTeam ? "advanced" : "basic"}
                      onTogglePlayed={handleTogglePlayed}
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
                        matchEntry={selectedMatchEntries[player.id]}
                        savedMatchEntry={savedSelectedMatchEntries[player.id]}
                        isGuestPlayer={player.contextType === "guest"}
                        guestOriginTeamName={player.originTeamName}
                        primaryFields={mobileVisibleFields.primaryFields}
                        secondaryFields={mobileVisibleFields.secondaryFields}
                        reviewState={getPlayerReviewState(player)}
                        selectedMatchLabel={selectedMatch.matchday}
                        statsLevel={selectedTeam?.isFirstTeam ? "advanced" : "basic"}
                        onTogglePlayed={handleTogglePlayed}
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
                          matchEntry={selectedMatchEntries[player.id]}
                          savedMatchEntry={savedSelectedMatchEntries[player.id]}
                          isGuestPlayer={player.contextType === "guest"}
                          guestOriginTeamName={player.originTeamName}
                          primaryFields={mobileOutfieldFields.primaryFields}
                          secondaryFields={mobileOutfieldFields.secondaryFields}
                          reviewState={getPlayerReviewState(player)}
                          selectedMatchLabel={selectedMatch.matchday}
                          statsLevel={selectedTeam?.isFirstTeam ? "advanced" : "basic"}
                          className="h-full"
                          onTogglePlayed={handleTogglePlayed}
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
                          matchEntry={selectedMatchEntries[player.id]}
                          savedMatchEntry={savedSelectedMatchEntries[player.id]}
                          isGuestPlayer={player.contextType === "guest"}
                          guestOriginTeamName={player.originTeamName}
                          primaryFields={mobileGoalkeeperFields.primaryFields}
                          secondaryFields={mobileGoalkeeperFields.secondaryFields}
                          reviewState={getPlayerReviewState(player)}
                          selectedMatchLabel={selectedMatch.matchday}
                          statsLevel={selectedTeam?.isFirstTeam ? "advanced" : "basic"}
                          className="h-full"
                          onTogglePlayed={handleTogglePlayed}
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
                          ? "Hay cambios pendientes en este partido."
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
