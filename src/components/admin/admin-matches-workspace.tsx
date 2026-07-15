"use client";

import Link from "next/link";
import { startTransition, useDeferredValue, useEffect, useState } from "react";
import {
  AlertTriangle,
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  CircleDotDashed,
  Eye,
  PenSquare,
  Plus,
  Trophy,
} from "lucide-react";
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
  saveMatchAction,
  saveQuickResultAction,
} from "@/app/admin/(panel)/partidos/actions";
import {
  formatMatchDateLabel,
  getCoachMatchVisualStatus,
  getVisualMatchStatus,
  hasMatchResult,
  isPendingMatchStatus,
  sortMatchManagementMatches,
  type MatchManagementMatch,
  type MatchManagementOpponent,
  type MatchManagementTeam,
  type MatchManagementVenue,
} from "@/lib/admin/match-management-mocks";
import type { AdminRole } from "@/lib/admin/roles";

type AdminMatchesWorkspaceProps = {
  role: AdminRole;
  initialMatches: MatchManagementMatch[];
  initialTeams: MatchManagementTeam[];
  initialOpponentOptions: MatchManagementOpponent[];
  initialVenueOptions: MatchManagementVenue[];
  initialUiState?: "ready" | "error";
  initialSelectedTeamSlug?: string;
};

type ScreenState = "loading" | "ready" | "error";
type MatchDialogState =
  | { mode: "create" }
  | { mode: "edit"; matchId: string }
  | null;

const pageSizeOptions = [10, 20, 50] as const;

function buildInitialFilters(selectedTeamSlug?: string): MatchFiltersValue {
  return {
    season: "all",
    team: selectedTeamSlug ?? "all",
    status: "all",
    competition: "all",
    date: "all",
    search: "",
  };
}

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
    matches.find((match) => getCoachMatchVisualStatus(match) === "pending") ??
    matches.find((match) => getCoachMatchVisualStatus(match) === "played") ??
    matches[0]
  );
}

function getCoachStatusBadge(match: MatchManagementMatch) {
  return getCoachMatchVisualStatus(match) === "played"
    ? { label: "Jugado", tone: "success" as const, pulse: false }
    : { label: "Pendiente", tone: "gold" as const, pulse: false };
}

export function AdminMatchesWorkspace({
  role,
  initialMatches,
  initialTeams,
  initialOpponentOptions,
  initialVenueOptions,
  initialUiState = "ready",
  initialSelectedTeamSlug,
}: AdminMatchesWorkspaceProps) {
  const [teams, setTeams] = useState(initialTeams);
  const [allMatches, setAllMatches] = useState(() => sortMatchManagementMatches(initialMatches));
  const [opponentOptions, setOpponentOptions] = useState(initialOpponentOptions);
  const [venueOptions, setVenueOptions] = useState(initialVenueOptions);
  const [filters, setFilters] = useState<MatchFiltersValue>(() =>
    role === "COACH" ? buildInitialFilters() : buildInitialFilters(initialSelectedTeamSlug),
  );
  const [dialogState, setDialogState] = useState<MatchDialogState>(null);
  const [quickResultMatchId, setQuickResultMatchId] = useState<string | null>(null);
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [bannerMessage, setBannerMessage] = useState<string | null>(null);
  const [screenState, setScreenState] = useState<ScreenState>("loading");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<(typeof pageSizeOptions)[number]>(10);
  const [coachTeamSlug, setCoachTeamSlug] = useState<string>(() => {
    const allowedSlug =
      initialSelectedTeamSlug && initialTeams.some((team) => team.slug === initialSelectedTeamSlug)
        ? initialSelectedTeamSlug
        : initialTeams[0]?.slug;

    return allowedSlug ?? "";
  });
  const [isPersisting, setIsPersisting] = useState(false);
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

  const coachTeamOptions = teams.map((team) => ({
    slug: team.slug,
    name: team.name,
  }));
  const allowedTeams =
    role === "COACH" ? teams.filter((team) => team.slug === coachTeamSlug) : teams;
  const allowedTeamSlugs = new Set(allowedTeams.map((team) => team.slug));
  const scopedMatches = sortMatchManagementMatches(
    allMatches.filter((match) => allowedTeamSlugs.has(match.teamSlug)),
  );
  const seasons = Array.from(
    new Set([...allowedTeams.map((team) => team.season), ...scopedMatches.map((match) => match.season)]),
  );
  const competitions = Array.from(
    new Set([
      ...allowedTeams.map((team) => team.competition),
      ...scopedMatches.map((match) => match.competition),
    ]),
  );
  const filteredTeamContext =
    filters.team !== "all" ? allowedTeams.find((team) => team.slug === filters.team) : undefined;
  const allowLiveFilter =
    role !== "COACH" &&
    (filteredTeamContext
      ? filteredTeamContext.isFirstTeam
      : allowedTeams.some((team) => team.isFirstTeam));
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

      if (effectiveStatusFilter !== "all") {
        const matchStatus =
          role === "COACH"
            ? getCoachMatchVisualStatus(match)
            : getVisualMatchStatus(match.status);

        if (matchStatus !== effectiveStatusFilter) {
          return false;
        }
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

  const totalPages = Math.max(1, Math.ceil(filteredMatches.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const pageStartIndex = (safeCurrentPage - 1) * pageSize;
  const pageEndIndex = Math.min(pageStartIndex + pageSize, filteredMatches.length);
  const paginatedMatches = filteredMatches.slice(pageStartIndex, pageEndIndex);
  const visibleMatches = filteredMatches.length > 0 ? filteredMatches : scopedMatches;
  const nextMatch =
    role === "COACH"
      ? scopedMatches.find((match) => getCoachMatchVisualStatus(match) === "pending")
      : scopedMatches.find((match) => getVisualMatchStatus(match.status) !== "played");
  const upcomingMatchesCount = filteredMatches.filter((match) =>
    role === "COACH"
      ? getCoachMatchVisualStatus(match) === "pending"
      : getVisualMatchStatus(match.status) !== "played",
  ).length;
  const pendingMatchesCount = filteredMatches.filter((match) =>
    role === "COACH"
      ? getCoachMatchVisualStatus(match) === "pending"
      : isPendingMatchStatus(match.status),
  ).length;
  const playedMatchesCount = filteredMatches.filter((match) =>
    role === "COACH"
      ? getCoachMatchVisualStatus(match) === "played"
      : match.status === "played",
  ).length;
  const missingResultCount = filteredMatches.filter((match) => !hasMatchResult(match)).length;
  const liveMatchesCount =
    role === "COACH" ? 0 : filteredMatches.filter((match) => match.status === "live").length;
  const coachAssignedTeam = allowedTeams[0];
  const coachFocusMatch = role === "COACH" ? getCoachFocusMatch(visibleMatches) : undefined;
  const selectedCoachMatch =
    role === "COACH"
      ? visibleMatches.find((match) => match.id === selectedMatchId) ?? coachFocusMatch
      : undefined;
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

  function applyServerData(nextData: {
    teams: MatchManagementTeam[];
    matches: MatchManagementMatch[];
    opponentOptions: MatchManagementOpponent[];
    venueOptions: MatchManagementVenue[];
  }) {
    setTeams(nextData.teams);
    setAllMatches(sortMatchManagementMatches(nextData.matches));
    setOpponentOptions(nextData.opponentOptions);
    setVenueOptions(nextData.venueOptions);
  }

  function updateFilters(nextFilters: MatchFiltersValue) {
    setFilters(nextFilters);
    setCurrentPage(1);
  }

  async function saveMatch(nextMatchValue: MatchManagementMatch) {
    setIsPersisting(true);
    const result = await saveMatchAction({
      matchId: dialogState && "matchId" in dialogState ? dialogState.matchId : undefined,
      teamSlug: nextMatchValue.teamSlug,
      season: nextMatchValue.season,
      competition: nextMatchValue.competition,
      matchday: nextMatchValue.matchday,
      opponentName: nextMatchValue.opponentName,
      isHome: nextMatchValue.isHome,
      date: nextMatchValue.date,
      time: nextMatchValue.time,
      venue: nextMatchValue.venue,
      status:
        nextMatchValue.status === "played"
          ? "played"
          : nextMatchValue.status === "live"
            ? "live"
            : "pending",
      ownScore: nextMatchValue.ownScore,
      opponentScore: nextMatchValue.opponentScore,
      highlightsUrl: nextMatchValue.highlightsUrl ?? "",
    });
    setIsPersisting(false);

    if (!result.ok) {
      pushBanner(result.message);
      return;
    }

    applyServerData(result.data);
    setDialogState(null);
    setSelectedMatchId(result.selectedMatchId ?? nextMatchValue.id);
    pushBanner(result.message);
  }

  async function saveQuickResult(nextMatchValue: MatchManagementMatch) {
    setIsPersisting(true);
    const result = await saveQuickResultAction({
      matchId: nextMatchValue.id,
      ownScore: nextMatchValue.ownScore ?? 0,
      opponentScore: nextMatchValue.opponentScore ?? 0,
      date: nextMatchValue.date,
    });
    setIsPersisting(false);

    if (!result.ok) {
      pushBanner(result.message);
      return;
    }

    applyServerData(result.data);
    setQuickResultMatchId(null);
    setSelectedMatchId(result.selectedMatchId ?? nextMatchValue.id);
    pushBanner(result.message);
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <AdminPageHeader
        eyebrow="Calendario operativo"
        title={role === "COACH" ? "Partidos de tu equipo" : "Partidos"}
        description={
          role === "COACH"
            ? "Abre un partido y resuelve el resto desde su detalle."
            : "Ordena el calendario por equipo y estado con acciones claras."
        }
        actions={
          <button
            type="button"
            onClick={() => setDialogState({ mode: "create" })}
            disabled={isPersisting || allowedTeams.length === 0}
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
          title="Un partido, un detalle"
          description="Selecciona el partido y completa resultado, estadisticas y clasificacion."
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
              options={coachTeamOptions}
              value={coachTeamSlug}
              onChange={(nextTeamSlug) => {
                setCoachTeamSlug(nextTeamSlug);
                setFilters(buildInitialFilters());
                setCurrentPage(1);
                setSelectedMatchId(null);
              }}
            />
          }
        />
      ) : null}

      <div
        className={`grid gap-4 ${role === "COACH" ? "md:grid-cols-2 xl:grid-cols-4" : "md:grid-cols-2 xl:grid-cols-5"}`}
      >
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
          label="Sin resultado"
          value={missingResultCount.toString()}
          tone="gold"
          icon={<AlertTriangle className="h-5 w-5" />}
        />
        {role !== "COACH" ? (
          <AdminMetricCard
            label="En vivo"
            value={liveMatchesCount.toString()}
            detail={allowLiveFilter ? "Primer Equipo" : ""}
            tone="danger"
            icon={<Eye className="h-5 w-5" />}
          />
        ) : null}
      </div>

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
        showTeamFilter={role !== "COACH" && allowedTeams.length > 1}
        allowLiveFilter={allowLiveFilter}
        onChange={updateFilters}
        onReset={() => updateFilters(buildInitialFilters(role === "COACH" ? undefined : initialSelectedTeamSlug))}
      />

      {screenState === "loading" ? (
        <div className="space-y-4">
          <div
            className={`grid gap-4 ${role === "COACH" ? "md:grid-cols-2 xl:grid-cols-4" : "md:grid-cols-2 xl:grid-cols-5"}`}
          >
            {Array.from({ length: role === "COACH" ? 4 : 5 }).map((_, index) => (
              <AdminPanel key={index} className="p-5">
                <div className="space-y-3">
                  <div className="h-4 w-24 animate-pulse rounded bg-white/8" />
                  <div className="h-10 w-20 animate-pulse rounded bg-white/6" />
                  <div className="h-4 w-full animate-pulse rounded bg-white/6" />
                </div>
              </AdminPanel>
            ))}
          </div>
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
              <p className="rr-kicker text-[color:var(--rr-gold)]">Vista previa</p>
            </div>
            <h2 className="rr-display text-[2rem] leading-[0.95] text-white">
              No hemos podido cargar la gestion de partidos
            </h2>
            <p className="text-[0.96rem] leading-6 text-[color:var(--rr-muted)]">
              La pantalla contempla un error operativo para revisar jerarquia,
              recuperacion y uso sin datos listos.
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

      {screenState === "ready" && scopedMatches.length === 0 ? (
        <AdminEmptyState
          title="Sin partidos cargados"
          description="Cuando haya calendario real en la temporada activa, esta pantalla mostrara jornadas, previas y resultados por equipo."
          action={
            <button
              type="button"
              onClick={() => setDialogState({ mode: "create" })}
              disabled={isPersisting || allowedTeams.length === 0}
              className="rr-button rr-button-primary text-[0.82rem]"
            >
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
            <button
              type="button"
              onClick={() =>
                updateFilters(buildInitialFilters(role === "COACH" ? undefined : initialSelectedTeamSlug))
              }
              className="rr-button rr-button-secondary text-[0.82rem]"
            >
              Limpiar filtros
            </button>
          }
        />
      ) : null}

      {screenState === "ready" && filteredMatches.length > 0 ? (
        <div className="space-y-3">
          <MatchList
            role={role}
            matches={paginatedMatches}
            disabled={isPersisting}
            selectedMatchId={selectedCoachMatch?.id}
            onViewMatch={(match) => setSelectedMatchId(match.id)}
            onEdit={(match) => setDialogState({ mode: "edit", matchId: match.id })}
            onQuickResult={(match) => setQuickResultMatchId(match.id)}
            onManageHighlights={(match) => setDialogState({ mode: "edit", matchId: match.id })}
          />

          <AdminPanel className="p-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <p className="text-[0.88rem] text-[color:var(--rr-muted)]">
                Mostrando {pageStartIndex + 1}-{pageEndIndex} de {filteredMatches.length} partidos
              </p>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                <label className="flex items-center gap-2 text-[0.84rem] text-[color:var(--rr-muted)]">
                  <span className="rr-kicker text-[0.7rem]">Por pagina</span>
                  <select
                    value={pageSize}
                    onChange={(event) => {
                      setPageSize(Number(event.target.value) as (typeof pageSizeOptions)[number]);
                      setCurrentPage(1);
                    }}
                    className="min-h-10 rounded-[14px] border border-[color:var(--rr-border)] bg-[rgba(255,255,255,0.04)] px-3 text-white outline-none transition focus:border-[rgba(243,203,69,0.48)]"
                  >
                    {pageSizeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex items-center gap-2 text-[0.84rem] text-[color:var(--rr-muted)]">
                  <span className="rr-kicker text-[0.7rem]">Pagina</span>
                  <select
                    value={safeCurrentPage}
                    onChange={(event) => setCurrentPage(Number(event.target.value))}
                    className="min-h-10 rounded-[14px] border border-[color:var(--rr-border)] bg-[rgba(255,255,255,0.04)] px-3 text-white outline-none transition focus:border-[rgba(243,203,69,0.48)]"
                  >
                    {Array.from({ length: totalPages }).map((_, index) => {
                      const pageNumber = index + 1;
                      return (
                        <option key={pageNumber} value={pageNumber}>
                          {pageNumber} de {totalPages}
                        </option>
                      );
                    })}
                  </select>
                </label>

                <div className="grid grid-cols-2 gap-2 sm:flex">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                    disabled={safeCurrentPage === 1}
                    className="rr-button rr-button-secondary min-h-10 justify-center px-3 text-[0.78rem] disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                    disabled={safeCurrentPage === totalPages}
                    className="rr-button rr-button-secondary min-h-10 justify-center px-3 text-[0.78rem] disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    Siguiente
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </AdminPanel>
        </div>
      ) : null}

      {role === "COACH" &&
      screenState === "ready" &&
      filteredMatches.length > 0 &&
      selectedCoachMatch ? (
        <AdminPanel className="border-[rgba(243,203,69,0.28)] p-5 sm:p-6">
          <div className="space-y-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-2">
                <p className="rr-kicker text-[color:var(--rr-gold)]">Detalle del partido</p>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-[1.2rem] font-semibold text-white sm:text-[1.35rem]">
                    {selectedCoachMatch.teamName} vs {selectedCoachMatch.opponentName}
                  </h2>
                  <AdminStatusBadge
                    label={getCoachStatusBadge(selectedCoachMatch).label}
                    tone={getCoachStatusBadge(selectedCoachMatch).tone}
                    pulse={getCoachStatusBadge(selectedCoachMatch).pulse}
                  />
                </div>
                <p className="text-[0.92rem] text-[color:var(--rr-muted)]">
                  {selectedCoachMatch.matchday} · {formatMatchDateLabel(selectedCoachMatch)} ·{" "}
                  {selectedCoachMatch.venue}
                </p>
                <p className="text-[0.92rem] text-[color:var(--rr-muted)]">
                  {hasMatchResult(selectedCoachMatch)
                    ? `Marcador actual: ${selectedCoachMatch.ownScore} - ${selectedCoachMatch.opponentScore}`
                    : "Sin resultado cargado."}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setQuickResultMatchId(selectedCoachMatch.id)}
                disabled={isPersisting}
                className="rr-button rr-button-primary justify-center text-[0.82rem]"
              >
                <Trophy className="h-4 w-4" />
                {getCoachMatchVisualStatus(selectedCoachMatch) === "played"
                  ? "Actualizar resultado"
                  : "Marcar jugado"}
              </button>
            </div>

            <div className="rounded-[16px] border border-white/10 bg-white/4 px-4 py-3 text-[0.9rem] text-[color:var(--rr-muted)]">
              {getCoachMatchVisualStatus(selectedCoachMatch) === "pending"
                ? "Edita la previa si hace falta y marca el resultado cuando termine el partido."
                : "El resultado ya esta cerrado. Desde aqui puedes revisar estadisticas y clasificacion."}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {getCoachMatchVisualStatus(selectedCoachMatch) === "pending" ? (
                <button
                  type="button"
                  onClick={() => setDialogState({ mode: "edit", matchId: selectedCoachMatch.id })}
                  disabled={isPersisting}
                  className="rr-button rr-button-secondary text-[0.82rem]"
                >
                  <PenSquare className="h-4 w-4" />
                  Editar previa
                </button>
              ) : null}
              <Link
                href={`/admin/estadisticas?team=${selectedCoachMatch.teamSlug}&match=${selectedCoachMatch.id}`}
                className="rr-button rr-button-secondary text-[0.82rem]"
              >
                Estadisticas
              </Link>
              <Link
                href={`/admin/clasificaciones?team=${selectedCoachMatch.teamSlug}`}
                className="rr-button rr-button-secondary text-[0.82rem]"
              >
                Clasificacion
              </Link>
            </div>
          </div>
        </AdminPanel>
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
        existingMatches={scopedMatches}
        seasons={seasons.length > 0 ? seasons : [coachAssignedTeam?.season ?? "Sin temporada"]}
        opponentOptions={opponentOptions}
        venueOptions={venueOptions}
        isSaving={isPersisting}
        onClose={() => setDialogState(null)}
        onSave={saveMatch}
      />

      <QuickResultDialog
        key={quickResultMatchId ?? "quick-result-closed"}
        open={quickResultMatchId !== null}
        match={selectedQuickResultMatch}
        isSaving={isPersisting}
        onClose={() => setQuickResultMatchId(null)}
        onSave={saveQuickResult}
      />
    </div>
  );
}
