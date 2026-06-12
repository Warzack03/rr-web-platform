"use client";

import Link from "next/link";
import { startTransition, useDeferredValue, useEffect, useState } from "react";
import { AlertTriangle, CalendarClock, CircleDotDashed, Plus, Radio, Trophy } from "lucide-react";
import { AdminFeedbackBanner } from "@/components/admin/admin-feedback-banner";
import { AdminCoachTeamSwitcher } from "@/components/admin/admin-coach-team-switcher";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { MatchFilters, type MatchFiltersValue } from "@/components/admin/match-filters";
import { MatchFormDialog } from "@/components/admin/match-form-dialog";
import { MatchList } from "@/components/admin/match-list";
import { AdminMetricCard } from "@/components/admin/admin-metric-card";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPanel } from "@/components/admin/admin-panel";
import { AdminScopePanel } from "@/components/admin/admin-scope-panel";
import { QuickResultDialog } from "@/components/admin/quick-result-dialog";
import {
  coachPreviewTeamSlugs,
  formatMatchDateLabel,
  getAllMatchManagementMatches,
  getCoachPreviewTeamOptions,
  getMatchManagementTeamsForRole,
  getStoredMatchStatus,
  getVisualMatchStatus,
  isPendingMatchStatus,
  sortMatchManagementMatches,
  type MatchManagementMatch,
} from "@/lib/admin/match-management-mocks";
import type { AdminRole } from "@/lib/admin/roles";

type AdminMatchesWorkspaceProps = {
  role: AdminRole;
  initialUiState?: "ready" | "error";
  initialSelectedTeamSlug?: string;
};

type ScreenState = "loading" | "ready" | "error";
type MatchDialogState =
  | { mode: "create" }
  | { mode: "edit"; matchId: string }
  | null;

const initialFilters: MatchFiltersValue = {
  season: "all",
  team: "all",
  status: "all",
  competition: "all",
  date: "all",
  search: "",
};

function isThisMonth(dateValue: string) {
  if (!dateValue) {
    return false;
  }

  const now = new Date();
  const date = new Date(`${dateValue}T12:00:00`);

  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
}

function isWithinNextSevenDays(dateValue: string) {
  if (!dateValue) {
    return false;
  }

  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end = new Date(start);
  end.setDate(end.getDate() + 7);

  const date = new Date(`${dateValue}T12:00:00`);
  return date >= start && date <= end;
}

function getCoachFocusMatch(matches: MatchManagementMatch[]) {
  return (
    matches.find(
      (match) =>
        match.status === "played" &&
        (match.ownScore === null || match.opponentScore === null),
    ) ??
    matches.find((match) => match.status === "live") ??
    matches.find((match) => getVisualMatchStatus(match.status) === "pending") ??
    matches.find((match) => match.status === "played") ??
    matches[0]
  );
}

function getCoachPrimaryActionLabel(match: MatchManagementMatch) {
  const visualStatus = getVisualMatchStatus(match.status);

  if (visualStatus === "pending") {
    return "Editar previa";
  }

  return visualStatus === "live" ? "Actualizar marcador" : "Revisar resultado";
}

export function AdminMatchesWorkspace({
  role,
  initialUiState = "ready",
  initialSelectedTeamSlug,
}: AdminMatchesWorkspaceProps) {
  const [allMatches, setAllMatches] = useState(() =>
    sortMatchManagementMatches(getAllMatchManagementMatches()),
  );
  const [filters, setFilters] = useState<MatchFiltersValue>(initialFilters);
  const [dialogState, setDialogState] = useState<MatchDialogState>(null);
  const [quickResultMatchId, setQuickResultMatchId] = useState<string | null>(null);
  const [bannerMessage, setBannerMessage] = useState<string | null>(null);
  const [screenState, setScreenState] = useState<ScreenState>("loading");
  const [coachTeamSlug, setCoachTeamSlug] = useState<string>(
    coachPreviewTeamSlugs.includes(initialSelectedTeamSlug as (typeof coachPreviewTeamSlugs)[number])
      ? (initialSelectedTeamSlug as string)
      : coachPreviewTeamSlugs[0],
  );
  const deferredSearch = useDeferredValue(filters.search.trim().toLowerCase());

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
  const allowedTeamSlugs = new Set(allowedTeams.map((team) => team.slug));
  const scopedMatches = sortMatchManagementMatches(
    allMatches.filter((match) => allowedTeamSlugs.has(match.teamSlug)),
  );

  const seasons = Array.from(new Set(scopedMatches.map((match) => match.season)));
  const competitions = Array.from(new Set(scopedMatches.map((match) => match.competition)));
  const filteredTeamContext =
    filters.team !== "all"
      ? allowedTeams.find((team) => team.slug === filters.team)
      : undefined;
  const allowLiveFilter = filteredTeamContext
    ? filteredTeamContext.isFirstTeam
    : allowedTeams.some((team) => team.isFirstTeam);
  const effectiveStatusFilter =
    filters.status === "live" && !allowLiveFilter ? "all" : filters.status;

  const filteredMatches = sortMatchManagementMatches(
    scopedMatches.filter((match) => {
      if (filters.season !== "all" && match.season !== filters.season) {
        return false;
      }

      if (filters.team !== "all" && match.teamSlug !== filters.team) {
        return false;
      }

      if (filters.competition !== "all" && match.competition !== filters.competition) {
        return false;
      }

      if (
        effectiveStatusFilter !== "all" &&
        getVisualMatchStatus(match.status) !== effectiveStatusFilter
      ) {
        return false;
      }

      if (filters.date === "next-7" && !isWithinNextSevenDays(match.date)) {
        return false;
      }

      if (filters.date === "this-month" && !isThisMonth(match.date)) {
        return false;
      }

      if (filters.date === "undated" && match.date) {
        return false;
      }

      if (!deferredSearch) {
        return true;
      }

      return match.opponentName.toLowerCase().includes(deferredSearch);
    }),
  );

  const nextMatch = scopedMatches.find((match) => getVisualMatchStatus(match.status) !== "played");
  const upcomingMatchesCount = filteredMatches.filter(
    (match) => getVisualMatchStatus(match.status) !== "played",
  ).length;
  const pendingMatchesCount = filteredMatches.filter((match) => isPendingMatchStatus(match.status)).length;
  const playedMatchesCount = filteredMatches.filter((match) => match.status === "played").length;
  const liveMatchesCount = filteredMatches.filter((match) => match.status === "live").length;
  const missingResultCount = filteredMatches.filter(
    (match) =>
      match.status === "played" && (match.ownScore === null || match.opponentScore === null),
  ).length;
  const coachAssignedTeam = allowedTeams[0];
  const coachFocusMatch = role === "COACH" ? getCoachFocusMatch(scopedMatches) : undefined;

  const selectedDialogMatch =
    dialogState && "matchId" in dialogState
      ? allMatches.find((match) => match.id === dialogState.matchId)
      : undefined;
  const selectedQuickResultMatch = quickResultMatchId
    ? allMatches.find((match) => match.id === quickResultMatchId)
    : undefined;

  function pushBanner(message: string) {
    startTransition(() => setBannerMessage(message));
  }

  function saveMatch(nextMatchValue: MatchManagementMatch) {
    startTransition(() => {
      setAllMatches((currentMatches) =>
        sortMatchManagementMatches(
          currentMatches.some((match) => match.id === nextMatchValue.id)
            ? currentMatches.map((match) =>
                match.id === nextMatchValue.id ? nextMatchValue : match,
              )
            : [...currentMatches, nextMatchValue],
        ),
      );
      setDialogState(null);
    });

    pushBanner(
      dialogState?.mode === "create" ? "Partido creado en mock." : "Partido actualizado.",
    );
  }

  function saveQuickResult(nextMatchValue: MatchManagementMatch) {
    setAllMatches((currentMatches) =>
      sortMatchManagementMatches(
        currentMatches.map((match) =>
          match.id === nextMatchValue.id ? nextMatchValue : match,
        ),
      ),
    );
    setQuickResultMatchId(null);
    pushBanner("Resultado actualizado.");
  }

  function markAsPending(match: MatchManagementMatch) {
    setAllMatches((currentMatches) =>
      sortMatchManagementMatches(
        currentMatches.map((currentMatch) =>
          currentMatch.id === match.id
            ? {
                ...currentMatch,
                status: getStoredMatchStatus("pending", Boolean(currentMatch.date)),
                ownScore: null,
                opponentScore: null,
              }
            : currentMatch,
        ),
      ),
    );

    pushBanner(`${match.teamName} vuelve a estado pendiente.`);
  }

  function markAsLive(match: MatchManagementMatch) {
    if (!match.isFirstTeam) {
      return;
    }

    setAllMatches((currentMatches) =>
      sortMatchManagementMatches(
        currentMatches.map((currentMatch) =>
          currentMatch.id === match.id ? { ...currentMatch, status: "live" } : currentMatch,
        ),
      ),
    );

    pushBanner(`${match.teamName} queda marcado en vivo.`);
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <AdminPageHeader
        eyebrow="Calendario operativo"
        title={role === "COACH" ? "Partidos de tu equipo" : "Partidos"}
        description={
          role === "COACH"
            ? "Prioriza la previa, el resultado y el salto rapido hacia clasificacion o estadisticas desde movil."
            : "Ordena el calendario por equipo y estado con acciones claras para previa, resultado y seguimiento publico."
        }
        actions={
          <button
            type="button"
            onClick={() => setDialogState({ mode: "create" })}
            className="rr-button rr-button-primary text-[0.84rem]"
          >
            <Plus className="h-4 w-4" />
            {role === "COACH" ? "Anadir proximo partido" : "Crear partido"}
          </button>
        }
      />

      {bannerMessage ? <AdminFeedbackBanner message={bannerMessage} /> : null}

      {role === "COACH" ? (
        <AdminScopePanel
          eyebrow="Flujo de entrenador"
          title="Cerrar jornada sin navegar de mas"
          description="Tu accion principal aqui es dejar listo el proximo partido o marcar el resultado. El resto del flujo salta directo a clasificacion y estadisticas del mismo equipo."
          actions={
            <>
              <Link
                href={`/admin/clasificaciones?team=${coachAssignedTeam?.slug ?? ""}`}
                className="rr-button rr-button-secondary text-[0.8rem]"
              >
                Editar clasificacion
              </Link>
              <Link
                href={`/admin/estadisticas?team=${coachAssignedTeam?.slug ?? ""}`}
                className="rr-button rr-button-secondary text-[0.8rem]"
              >
                Editar estadisticas
              </Link>
            </>
          }
          aside={
            <AdminCoachTeamSwitcher
              options={coachPreviewTeamOptions}
              value={coachTeamSlug}
              onChange={(nextTeamSlug) => {
                setCoachTeamSlug(nextTeamSlug);
                setFilters(initialFilters);
              }}
            />
          }
        />
      ) : null}

      {role === "COACH" && coachFocusMatch ? (
        <AdminPanel className="border-[rgba(253,203,88,0.24)] p-5 sm:p-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-2">
                <p className="rr-kicker text-[color:var(--rr-gold)]">Siguiente paso</p>
                <div>
                  <h2 className="text-[1.12rem] font-semibold text-white sm:text-[1.25rem]">
                    {coachFocusMatch.teamName} vs {coachFocusMatch.opponentName}
                  </h2>
                  <p className="mt-1 text-[0.92rem] leading-5 text-[color:var(--rr-muted)]">
                    {coachFocusMatch.matchday} · {formatMatchDateLabel(coachFocusMatch)} · {coachFocusMatch.venue}
                  </p>
                </div>
              </div>

              <AdminStatusBadge
                label={
                  getVisualMatchStatus(coachFocusMatch.status) === "live"
                    ? "En vivo"
                    : getVisualMatchStatus(coachFocusMatch.status) === "played"
                      ? "Jugado"
                      : "Pendiente"
                }
                tone={
                  getVisualMatchStatus(coachFocusMatch.status) === "live"
                    ? "danger"
                    : getVisualMatchStatus(coachFocusMatch.status) === "played"
                      ? "success"
                      : "gold"
                }
                pulse={getVisualMatchStatus(coachFocusMatch.status) === "live"}
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
              <div className="rounded-[10px] border border-white/10 bg-white/4 px-4 py-3 text-[0.9rem] text-[color:var(--rr-muted)]">
                {getVisualMatchStatus(coachFocusMatch.status) === "pending"
                  ? "Completa rival, fecha y campo antes del fin de semana."
                  : "Actualiza el marcador y deja listo el salto a estadisticas o clasificacion."}
              </div>

              <button
                type="button"
                onClick={() =>
                  getVisualMatchStatus(coachFocusMatch.status) === "pending"
                    ? setDialogState({ mode: "edit", matchId: coachFocusMatch.id })
                    : setQuickResultMatchId(coachFocusMatch.id)
                }
                className="rr-button rr-button-primary justify-center text-[0.82rem]"
              >
                {getCoachPrimaryActionLabel(coachFocusMatch)}
              </button>
            </div>
          </div>
        </AdminPanel>
      ) : null}

      {role === "COACH" ? (
        <MatchFilters
          value={{
            ...filters,
            status: effectiveStatusFilter,
          }}
          seasons={seasons}
          teams={allowedTeams.map((team) => ({ slug: team.slug, name: team.name }))}
          competitions={competitions}
          totalMatches={scopedMatches.length}
          filteredMatches={filteredMatches.length}
          showTeamFilter={false}
          allowLiveFilter={allowLiveFilter}
          onChange={setFilters}
          onReset={() => setFilters(initialFilters)}
        />
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <AdminMetricCard
          label="Proximos partidos"
          value={upcomingMatchesCount.toString()}
          detail={nextMatch ? formatMatchDateLabel(nextMatch) : "Sin calendario inmediato"}
          tone="gold"
          icon={<CalendarClock className="h-5 w-5" />}
        />
        <AdminMetricCard
          label="Jugados"
          value={playedMatchesCount.toString()}
          tone="blue"
          icon={<Trophy className="h-5 w-5" />}
        />
        <AdminMetricCard
          label="Pendientes"
          value={pendingMatchesCount.toString()}
          tone="slate"
          icon={<CircleDotDashed className="h-5 w-5" />}
        />
        <AdminMetricCard
          label="En vivo"
          value={liveMatchesCount.toString()}
          detail={allowLiveFilter ? "Primer Equipo" : ""}
          tone="danger"
          icon={<Radio className="h-5 w-5" />}
        />
        <AdminMetricCard
          label="Sin resultado"
          value={missingResultCount.toString()}
          tone="gold"
          icon={<AlertTriangle className="h-5 w-5" />}
        />
      </div>

      {role !== "COACH" ? (
        <MatchFilters
          value={{
            ...filters,
            status: effectiveStatusFilter,
          }}
          seasons={seasons}
          teams={allowedTeams.map((team) => ({ slug: team.slug, name: team.name }))}
          competitions={competitions}
          totalMatches={scopedMatches.length}
          filteredMatches={filteredMatches.length}
          showTeamFilter={allowedTeams.length > 1}
          allowLiveFilter={allowLiveFilter}
          onChange={setFilters}
          onReset={() => setFilters(initialFilters)}
        />
      ) : null}

      {screenState === "loading" ? (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <AdminPanel key={index} className="p-5">
                <div className="space-y-3">
                  <div className="h-4 w-24 animate-pulse rounded bg-white/8" />
                  <div className="h-10 w-20 animate-pulse rounded bg-white/6" />
                  <div className="h-4 w-full animate-pulse rounded bg-white/6" />
                </div>
              </AdminPanel>
            ))}
          </div>
          <AdminPanel className="p-5">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-11 animate-pulse rounded-[8px] bg-white/6" />
              ))}
            </div>
          </AdminPanel>
          <div className="grid gap-3">
            {Array.from({ length: role === "COACH" ? 2 : 3 }).map((_, index) => (
              <AdminPanel key={index} className="p-5">
                <div className="space-y-3">
                  <div className="h-5 w-32 animate-pulse rounded bg-white/8" />
                  <div className="h-10 animate-pulse rounded bg-white/6" />
                  <div className="h-10 animate-pulse rounded bg-white/6" />
                </div>
              </AdminPanel>
            ))}
          </div>
        </div>
      ) : null}

      {screenState === "error" ? (
        <AdminPanel className="border-[rgba(214,64,69,0.34)] p-6">
          <div className="max-w-2xl space-y-3">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-[color:var(--rr-gold)]" />
              <p className="rr-kicker text-[color:var(--rr-gold)]">Estado mock</p>
            </div>
            <h2 className="rr-display text-[2rem] leading-[0.95] text-white">
              No hemos podido cargar la gestion de partidos
            </h2>
            <p className="text-[0.96rem] leading-6 text-[color:var(--rr-muted)]">
              La pantalla contempla un error operativo para revisar jerarquia, recuperacion y
              uso sin datos listos.
            </p>
            <button type="button" onClick={() => setScreenState("ready")} className="rr-button rr-button-primary text-[0.82rem]">
              Reintentar
            </button>
          </div>
        </AdminPanel>
      ) : null}

      {screenState === "ready" && scopedMatches.length === 0 ? (
        <AdminEmptyState
          title="Sin partidos cargados"
          description="Cuando conectemos datos reales, esta pantalla mostrara calendario, previas y resultados por equipo."
          action={
            <button type="button" onClick={() => setDialogState({ mode: "create" })} className="rr-button rr-button-primary text-[0.82rem]">
              Crear primer partido
            </button>
          }
        />
      ) : null}

      {screenState === "ready" && scopedMatches.length > 0 && filteredMatches.length === 0 ? (
        <AdminEmptyState
          title="Sin resultados"
          description="Ajusta filtros o busca otro rival para volver a ver partidos."
          action={
            <button type="button" onClick={() => setFilters(initialFilters)} className="rr-button rr-button-secondary text-[0.82rem]">
              Limpiar filtros
            </button>
          }
        />
      ) : null}

      {screenState === "ready" && filteredMatches.length > 0 ? (
        <MatchList
          role={role}
          matches={filteredMatches}
          onEdit={(match) => setDialogState({ mode: "edit", matchId: match.id })}
          onQuickResult={(match) => setQuickResultMatchId(match.id)}
          onSetPending={markAsPending}
          onSetLive={markAsLive}
          onManageHighlights={(match) => setDialogState({ mode: "edit", matchId: match.id })}
        />
      ) : null}

      <MatchFormDialog
        key={
          dialogState
            ? `${dialogState.mode}-${"matchId" in dialogState ? dialogState.matchId : "new"}`
            : "match-dialog-closed"
        }
        open={dialogState !== null}
        mode={dialogState?.mode ?? "create"}
        role={role}
        match={selectedDialogMatch}
        availableTeams={allowedTeams}
        seasons={seasons.length > 0 ? seasons : [coachAssignedTeam?.season ?? "2026/2027"]}
        onClose={() => setDialogState(null)}
        onSave={saveMatch}
      />

      <QuickResultDialog
        key={quickResultMatchId ?? "quick-result-closed"}
        open={quickResultMatchId !== null}
        match={selectedQuickResultMatch}
        onClose={() => setQuickResultMatchId(null)}
        onSave={saveQuickResult}
      />
    </div>
  );
}
