"use client";

import { startTransition, useDeferredValue, useEffect, useState } from "react";
import {
  AlertTriangle,
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  CircleDotDashed,
  Eye,
  Plus,
  Trophy,
} from "lucide-react";
import { AdminFeedbackBanner } from "@/components/admin/admin-feedback-banner";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { MatchFilters, type MatchFiltersValue } from "@/components/admin/match-filters";
import { MatchFormDialog } from "@/components/admin/match-form-dialog";
import { MatchList } from "@/components/admin/match-list";
import { AdminMetricCard } from "@/components/admin/admin-metric-card";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPanel } from "@/components/admin/admin-panel";
import { QuickResultDialog } from "@/components/admin/quick-result-dialog";
import {
  saveMatchAction,
  saveQuickResultAction,
} from "@/app/admin/(panel)/partidos/actions";
import {
  formatMatchDateLabel,
  getVisualMatchStatus,
  sortMatchManagementMatches,
  type MatchManagementMatch,
  type MatchManagementOpponent,
  type MatchManagementTeam,
  type MatchManagementVenue,
} from "@/lib/admin/match-management";
import {
  adminMatchPageSizeOptions,
  buildInitialMatchFilters,
  canUseLiveMatchFilter,
  filterAdminMatches,
  getAdminMatchMetrics,
  getEffectiveMatchStatusFilter,
  type AdminMatchPageSize,
  type AdminMatchesScreenState,
  type MatchDialogState,
} from "@/lib/admin/match-workspace";

type AdminMatchesWorkspaceProps = {
  initialMatches: MatchManagementMatch[];
  initialTeams: MatchManagementTeam[];
  initialOpponentOptions: MatchManagementOpponent[];
  initialVenueOptions: MatchManagementVenue[];
  initialUiState?: "ready" | "error";
  initialSelectedTeamSlug?: string;
};

type AdminMatchesFeedback = {
  message: string;
  tone: "success" | "danger" | "info";
};

export function AdminMatchesWorkspace({
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
    buildInitialMatchFilters(initialSelectedTeamSlug),
  );
  const [dialogState, setDialogState] = useState<MatchDialogState>(null);
  const [quickResultMatchId, setQuickResultMatchId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<AdminMatchesFeedback | null>(null);
  const [screenState, setScreenState] = useState<AdminMatchesScreenState>("loading");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<AdminMatchPageSize>(10);
  const [isPersisting, setIsPersisting] = useState(false);
  const deferredSearch = useDeferredValue(filters.search.trim().toLowerCase());

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setScreenState(initialUiState === "error" ? "error" : "ready");
    }, 280);

    return () => window.clearTimeout(timer);
  }, [initialUiState]);

  useEffect(() => {
    if (!feedback) {
      return;
    }

    const timer = window.setTimeout(() => setFeedback(null), 2400);
    return () => window.clearTimeout(timer);
  }, [feedback]);

  const allowedTeams = teams;
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
  const allowLiveFilter = canUseLiveMatchFilter(filters.team, allowedTeams);
  const effectiveStatusFilter = getEffectiveMatchStatusFilter({
    status: filters.status,
    teamSlug: filters.team,
    teams: allowedTeams,
  });

  const filteredMatches = filterAdminMatches({
    matches: scopedMatches,
    filters,
    effectiveStatusFilter,
    deferredSearch,
  });

  const totalPages = Math.max(1, Math.ceil(filteredMatches.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const pageStartIndex = (safeCurrentPage - 1) * pageSize;
  const pageEndIndex = Math.min(pageStartIndex + pageSize, filteredMatches.length);
  const paginatedMatches = filteredMatches.slice(pageStartIndex, pageEndIndex);
  const nextMatch = scopedMatches.find(
    (match) => getVisualMatchStatus(match.status) !== "played",
  );
  const matchMetrics = getAdminMatchMetrics(filteredMatches);
  const selectedDialogMatch =
    dialogState && "matchId" in dialogState
      ? allMatches.find((match) => match.id === dialogState.matchId)
      : undefined;
  const selectedQuickResultMatch = quickResultMatchId
    ? allMatches.find((match) => match.id === quickResultMatchId)
    : undefined;

  function pushBanner(message: string, tone: AdminMatchesFeedback["tone"] = "success") {
    startTransition(() => setFeedback({ message, tone }));
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
      pushBanner(result.message, "danger");
      return;
    }

    applyServerData(result.data);
    setDialogState(null);
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
      pushBanner(result.message, "danger");
      return;
    }

    applyServerData(result.data);
    setQuickResultMatchId(null);
    pushBanner(result.message);
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <AdminPageHeader
        eyebrow="Calendario operativo"
        title="Partidos"
        description="Ordena el calendario por equipo y estado con acciones claras."
        actions={
          <button
            type="button"
            onClick={() => setDialogState({ mode: "create" })}
            disabled={isPersisting || allowedTeams.length === 0}
            className="rr-button rr-button-primary text-[0.84rem]"
          >
            <Plus className="h-4 w-4" />
            Crear partido
          </button>
        }
      />

      {feedback ? <AdminFeedbackBanner message={feedback.message} tone={feedback.tone} /> : null}

      <div
        className="grid gap-4 md:grid-cols-2 xl:grid-cols-5"
      >
        <AdminMetricCard
          label="Proximos partidos"
          value={matchMetrics.upcoming.toString()}
          detail={nextMatch ? formatMatchDateLabel(nextMatch) : "Sin calendario inmediato"}
          tone="gold"
          icon={<CalendarClock className="h-5 w-5" />}
        />
        <AdminMetricCard
          label="Jugados"
          value={matchMetrics.played.toString()}
          tone="blue"
          icon={<Trophy className="h-5 w-5" />}
        />
        <AdminMetricCard
          label="Pendientes"
          value={matchMetrics.pending.toString()}
          tone="slate"
          icon={<CircleDotDashed className="h-5 w-5" />}
        />
        <AdminMetricCard
          label="Sin resultado"
          value={matchMetrics.missingResult.toString()}
          tone="gold"
          icon={<AlertTriangle className="h-5 w-5" />}
        />
        {true ? (
          <AdminMetricCard
            label="En vivo"
            value={matchMetrics.live.toString()}
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
        showTeamFilter={allowedTeams.length > 1}
        allowLiveFilter={allowLiveFilter}
        onChange={updateFilters}
        onReset={() => updateFilters(buildInitialMatchFilters(initialSelectedTeamSlug))}
      />

      {screenState === "loading" ? (
        <div className="space-y-4">
          <div
            className="grid gap-4 md:grid-cols-2 xl:grid-cols-5"
          >
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
          <div className="grid gap-3">
            {Array.from({ length: 3 }).map((_, index) => (
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
              <p className="rr-kicker text-[color:var(--rr-gold)]">Error</p>
            </div>
            <h2 className="rr-display text-[2rem] leading-[0.95] text-white">
              No hemos podido cargar la gestion de partidos
            </h2>
            <p className="text-[0.96rem] leading-6 text-[color:var(--rr-muted)]">
              Revisa la conexion o vuelve a intentarlo en unos segundos.
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
                updateFilters(buildInitialMatchFilters(initialSelectedTeamSlug))
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
            matches={paginatedMatches}
            disabled={isPersisting}
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
                      setPageSize(Number(event.target.value) as AdminMatchPageSize);
                      setCurrentPage(1);
                    }}
                    className="min-h-10 rounded-[14px] border border-[color:var(--rr-border)] bg-[rgba(255,255,255,0.04)] px-3 text-white outline-none transition focus:border-[rgba(243,203,69,0.48)]"
                  >
                    {adminMatchPageSizeOptions.map((option) => (
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

      <MatchFormDialog
        key={
          dialogState
            ? `${dialogState.mode}-${"matchId" in dialogState ? dialogState.matchId : "new"}`
            : "match-dialog-closed"
        }
        open={dialogState !== null}
        mode={dialogState?.mode ?? "create"}
        match={selectedDialogMatch}
        availableTeams={allowedTeams}
        existingMatches={scopedMatches}
        seasons={seasons.length > 0 ? seasons : ["Sin temporada"]}
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
