"use client";

import { startTransition, useEffect, useState } from "react";
import {
  AlertTriangle,
  ClipboardList,
  Eye,
  ListChecks,
  ShieldCheck,
  Trophy,
} from "lucide-react";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { AdminFeedbackBanner } from "@/components/admin/admin-feedback-banner";
import { EditableStandingTable } from "@/components/admin/editable-standing-table";
import { AdminMetricCard } from "@/components/admin/admin-metric-card";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPanel } from "@/components/admin/admin-panel";
import {
  StandingsFilters,
  type StandingsFiltersValue,
} from "@/components/admin/standings-filters";
import { StandingsSelector } from "@/components/admin/standings-selector";
import { UnsavedChangesBar } from "@/components/admin/unsaved-changes-bar";
import {
  createStandingAction,
  saveStandingAction,
} from "@/app/admin/(panel)/clasificaciones/actions";
import type {
  StandingManagementRow,
  StandingManagementTeam,
  StandingManagementTable,
} from "@/lib/admin/standings-management";
import {
  normalizeStandingTable,
} from "@/lib/admin/standings-management";

type AdminStandingsWorkspaceProps = {
  initialUiState?: "ready" | "error";
  initialSelectedTeamSlug?: string;
  initialTables: StandingManagementTable[];
  initialTeams: StandingManagementTeam[];
  activeSeasonLabel?: string;
};

type ScreenState = "loading" | "ready" | "error";
type BannerTone = "success" | "danger";

const initialFilters: StandingsFiltersValue = {
  selectionMode: "team",
  team: "",
  competition: "",
};

function sortStandingsManagementTables(tables: StandingManagementTable[]) {
  return [...tables].sort((left, right) => {
    if (left.season !== right.season) {
      return right.season.localeCompare(left.season);
    }

    if (left.teamName !== right.teamName) {
      return left.teamName.localeCompare(right.teamName, "es");
    }

    return left.competition.localeCompare(right.competition, "es");
  });
}

function mergeTables(
  savedTables: StandingManagementTable[],
  draftTables: Record<string, StandingManagementTable>,
) {
  return sortStandingsManagementTables(
    savedTables.map((table) => draftTables[table.id] ?? table),
  );
}

function createBanner(message: string, tone: BannerTone) {
  return { message, tone };
}

function getRowValidationErrors(row: StandingManagementRow, index: number) {
  const errors: string[] = [];
  const numericFields = [
    ["PJ", row.played],
    ["G", row.won],
    ["E", row.drawn],
    ["P", row.lost],
    ["PTS SA", row.sanctionPoints],
    ["GF", row.goalsFor],
    ["GC", row.goalsAgainst],
  ] as const;

  numericFields.forEach(([label, value]) => {
    if (!Number.isFinite(value) || value < 0) {
      errors.push(`La fila ${index + 1} tiene un valor invalido en ${label}.`);
    }
  });

  return errors;
}

function getStandingValidationErrors(standing: StandingManagementTable) {
  const rowErrors = standing.rows.flatMap((row, index) =>
    getRowValidationErrors(row, index),
  );

  if (standing.rows.length === 0) {
    rowErrors.push("La clasificacion necesita al menos una fila.");
  }

  if (!standing.rows.some((row) => row.isOwnTeam)) {
    rowErrors.push(
      "Marca al menos un equipo del club para la vista publica y el resumen.",
    );
  }

  return rowErrors;
}

function getStandingRowErrorMap(standing: StandingManagementTable) {
  return standing.rows.reduce<Record<string, string[]>>((errorsByRow, row, index) => {
    const rowErrors = getRowValidationErrors(row, index);

    if (rowErrors.length > 0) {
      errorsByRow[row.id] = rowErrors;
    }

    return errorsByRow;
  }, {});
}

export function AdminStandingsWorkspace({
  initialUiState = "ready",
  initialSelectedTeamSlug,
  initialTables,
  initialTeams,
  activeSeasonLabel,
}: AdminStandingsWorkspaceProps) {
  const [savedTables, setSavedTables] = useState(() =>
    sortStandingsManagementTables(initialTables),
  );
  const [draftTables, setDraftTables] = useState<
    Record<string, StandingManagementTable>
  >({});
  const [screenState, setScreenState] = useState<ScreenState>("loading");
  const [banner, setBanner] = useState<{
    message: string;
    tone: BannerTone;
  } | null>(null);
  const [isPersisting, setIsPersisting] = useState(false);
  const [filters, setFilters] = useState<StandingsFiltersValue>(initialFilters);

  const mergedTables = mergeTables(savedTables, draftTables);
  const allowedTeams = initialTeams;
  const allowedTeamSlugs = new Set(allowedTeams.map((team) => team.slug));
  const scopedTables = mergedTables.filter((table) =>
    allowedTeamSlugs.has(table.teamSlug),
  );
  const seasons = Array.from(new Set(scopedTables.map((table) => table.season)));
  const defaultTeamSlug =
    initialSelectedTeamSlug ??
    allowedTeams[0]?.slug ??
    "";
  const competitions = Array.from(
    new Set(allowedTeams.map((team) => team.competition)),
  );
  const defaultCompetition = competitions[0] ?? "";
  const canSelectByTeam = allowedTeams.length > 1;
  const activeFilters: StandingsFiltersValue = {
    selectionMode: canSelectByTeam ? filters.selectionMode : "competition",
    team:
      allowedTeams.some((team) => team.slug === filters.team)
        ? filters.team
        : defaultTeamSlug,
    competition: competitions.includes(filters.competition)
      ? filters.competition
      : defaultCompetition,
  };
  const filteredTables = scopedTables.filter((table) =>
    activeFilters.selectionMode === "team"
      ? table.teamSlug === activeFilters.team ||
        table.rows.some((row) => row.teamSlug === activeFilters.team)
      : table.competition === activeFilters.competition,
  );

  const [requestedStandingId, setRequestedStandingId] = useState<string>(
    filteredTables[0]?.id ?? scopedTables[0]?.id ?? "",
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setScreenState(initialUiState === "error" ? "error" : "ready");
    }, 280);

    return () => window.clearTimeout(timer);
  }, [initialUiState]);

  useEffect(() => {
    if (!banner) {
      return;
    }

    const timer = window.setTimeout(() => setBanner(null), 2600);
    return () => window.clearTimeout(timer);
  }, [banner]);

  const selectedStandingId =
    filteredTables.find((table) => table.id === requestedStandingId)?.id ??
    filteredTables[0]?.id ??
    "";
  const selectedStanding =
    filteredTables.find((table) => table.id === selectedStandingId);
  const savedSelectedStanding = savedTables.find(
    (table) => table.id === selectedStanding?.id,
  );
  const validationErrors = selectedStanding
    ? getStandingValidationErrors(selectedStanding)
    : [];
  const rowErrors = selectedStanding
    ? getStandingRowErrorMap(selectedStanding)
    : {};
  const hasUnsavedChanges =
    Boolean(selectedStanding && savedSelectedStanding) &&
    JSON.stringify(selectedStanding) !== JSON.stringify(savedSelectedStanding);
  const activeSeason = activeSeasonLabel ?? seasons[0] ?? "Sin temporada";
  const publishedCount = scopedTables.filter(
    (standing) => standing.status === "published",
  ).length;
  const attentionCount = scopedTables.filter(
    (standing) => standing.status !== "published",
  ).length;
  const teamsWithStandingCount = new Set(
    scopedTables.map((standing) => standing.teamSlug),
  ).size;

  function pushBanner(message: string, tone: BannerTone = "success") {
    startTransition(() => setBanner(createBanner(message, tone)));
  }

  function resetFilters() {
    setFilters({
      selectionMode: canSelectByTeam ? "team" : "competition",
      team: defaultTeamSlug,
      competition: defaultCompetition,
    });
  }

  function updateSelectedStanding(
    transform: (standing: StandingManagementTable) => StandingManagementTable,
  ) {
    if (!selectedStanding) {
      return;
    }

    setDraftTables((currentDrafts) => {
      const baseStanding = currentDrafts[selectedStanding.id] ?? selectedStanding;

      return {
        ...currentDrafts,
        [selectedStanding.id]: normalizeStandingTable(transform(baseStanding)),
      };
    });
  }

  function updateRowField(
    rowId: string,
    field:
      | "played"
      | "won"
      | "drawn"
      | "lost"
      | "sanctionPoints"
      | "goalsFor"
      | "goalsAgainst",
    value: number,
  ) {
    updateSelectedStanding((standing) => ({
      ...standing,
      rows: standing.rows.map((row) =>
        row.id === rowId
          ? {
              ...row,
              [field]: Number.isFinite(value) ? Math.max(0, Math.trunc(value)) : 0,
            }
          : row,
      ),
    }));
  }

  function toggleOwnTeam(rowId: string) {
    updateSelectedStanding((standing) => ({
      ...standing,
      rows: standing.rows.map((row) =>
        row.id === rowId
          ? {
              ...row,
              isOwnTeam: !row.isOwnTeam,
            }
          : row,
      ),
    }));
  }

  function persistSelectedStanding() {
    if (!selectedStanding || !savedSelectedStanding) {
      return;
    }

    const errors = getStandingValidationErrors(selectedStanding);

    if (errors.length > 0) {
      pushBanner(errors[0], "danger");
      return;
    }

    setIsPersisting(true);

    void saveStandingAction({
      standingId: selectedStanding.id,
      rows: selectedStanding.rows,
    })
      .then((result) => {
        if (!result.ok) {
          pushBanner(result.message, "danger");
          return;
        }

        startTransition(() => {
          setSavedTables(sortStandingsManagementTables(result.data.tables));
          setDraftTables({});
          setRequestedStandingId(result.selectedStandingId);
        });

        pushBanner(result.message);
      })
      .catch(() => {
        pushBanner("No hemos podido guardar la clasificacion.", "danger");
      })
      .finally(() => {
        setIsPersisting(false);
      });
  }

  function discardChanges() {
    if (!selectedStanding) {
      return;
    }

    setDraftTables((currentDrafts) => {
      const nextDrafts = { ...currentDrafts };
      delete nextDrafts[selectedStanding.id];
      return nextDrafts;
    });

    pushBanner("Cambios cancelados.");
  }

  function createStandingFromCurrentSelection() {
    setIsPersisting(true);

    void createStandingAction({
      selectionMode: activeFilters.selectionMode,
      teamSlug: activeFilters.team || undefined,
      competition: activeFilters.competition || undefined,
    })
      .then((result) => {
        if (!result.ok) {
          pushBanner(result.message, "danger");
          return;
        }

        startTransition(() => {
          setSavedTables(sortStandingsManagementTables(result.data.tables));
          setDraftTables({});
          setRequestedStandingId(result.selectedStandingId);
        });

        pushBanner(result.message);
      })
      .catch(() => {
        pushBanner("No hemos podido crear la clasificacion.", "danger");
      })
      .finally(() => {
        setIsPersisting(false);
      });
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <AdminPageHeader
        eyebrow="Gestion manual"
        title="Clasificaciones"
        description={
          "Gestion manual de tablas por equipo y competicion."
        }
      />

      {banner ? (
        <AdminFeedbackBanner
          message={banner.message}
          tone={banner.tone === "danger" ? "danger" : "success"}
        />
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <AdminMetricCard
          label="Clasificaciones activas"
          value={scopedTables.length.toString()}
          detail="Tablas visibles para este rol"
          tone="gold"
          icon={<ClipboardList className="h-5 w-5" />}
        />
        <AdminMetricCard
          label="Listas para web"
          value={publishedCount.toString()}
          detail="Ultima version ya guardada"
          tone="blue"
          icon={<Eye className="h-5 w-5" />}
        />
        <AdminMetricCard
          label="Equipos con tabla"
          value={teamsWithStandingCount.toString()}
          detail="Cobertura por estructura deportiva"
          tone="slate"
          icon={<Trophy className="h-5 w-5" />}
        />
        <AdminMetricCard
          label="Requieren repaso"
          value={attentionCount.toString()}
          detail="Tablas aun no cerradas"
          tone="danger"
          icon={<ListChecks className="h-5 w-5" />}
        />
        <AdminMetricCard
          label="Temporada activa"
          value={activeSeason}
          detail="Contexto principal del panel"
          tone="gold"
          icon={<ShieldCheck className="h-5 w-5" />}
        />
      </div>

      <StandingsFilters
        value={activeFilters}
        teams={allowedTeams.map((team) => ({ slug: team.slug, name: team.name }))}
        competitions={competitions}
        totalStandings={scopedTables.length}
        filteredStandings={filteredTables.length}
        showTeamFilter={canSelectByTeam}
        onChange={setFilters}
        onReset={resetFilters}
      />

      {screenState === "loading" ? (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <AdminPanel key={index} className="p-5">
                <div className="space-y-3">
                  <div className="h-4 w-24 animate-pulse rounded bg-white/8" />
                  <div className="h-10 w-28 animate-pulse rounded bg-white/6" />
                  <div className="h-4 w-full animate-pulse rounded bg-white/6" />
                </div>
              </AdminPanel>
            ))}
          </div>
          <div className="grid gap-4 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <AdminPanel key={index} className="p-5">
                <div className="space-y-3">
                  <div className="h-12 animate-pulse rounded-[16px] bg-white/6" />
                  <div className="h-24 animate-pulse rounded-[16px] bg-white/6" />
                </div>
              </AdminPanel>
            ))}
          </div>
          <AdminPanel className="p-5">
            <div className="h-64 animate-pulse rounded-[16px] bg-white/6" />
          </AdminPanel>
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
              No hemos podido cargar la gestion de clasificaciones
            </h2>
            <p className="text-[0.96rem] leading-6 text-[color:var(--rr-muted)]">
              La pantalla contempla un error operativo para validar mensajes,
              layout y recuperacion antes de conectar datos reales.
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

      {screenState === "ready" && scopedTables.length === 0 ? (
        <AdminEmptyState
          title="Sin clasificaciones cargadas"
          description="Todavia no hay tablas reales para este alcance. El siguiente paso natural es crear o cargar la clasificacion manual de la competicion correspondiente."
          action={
            allowedTeams.length > 0 ? (
              <button
                type="button"
                onClick={createStandingFromCurrentSelection}
                disabled={isPersisting}
                className="rr-button rr-button-primary text-[0.82rem]"
              >
                {isPersisting ? "Creando..." : "Crear clasificacion"}
              </button>
            ) : null
          }
        />
      ) : null}

      {screenState === "ready" &&
      scopedTables.length > 0 &&
      filteredTables.length === 0 ? (
        <AdminEmptyState
          title="Sin resultados"
          description="No hay una tabla real para esta seleccion. Puedes ajustar filtros o crear la clasificacion manual desde este contexto."
          action={
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={resetFilters}
                className="rr-button rr-button-secondary text-[0.82rem]"
              >
                Limpiar filtros
              </button>
              <button
                type="button"
                onClick={createStandingFromCurrentSelection}
                disabled={isPersisting}
                className="rr-button rr-button-primary text-[0.82rem]"
              >
                {isPersisting ? "Creando..." : "Crear clasificacion"}
              </button>
            </div>
          }
        />
      ) : null}

      {screenState === "ready" &&
      filteredTables.length > 0 &&
      selectedStanding ? (
        <div className="space-y-4">
          {filteredTables.length > 1 ? (
            <StandingsSelector
              standings={filteredTables}
              selectedStandingId={selectedStandingId}
              onSelect={setRequestedStandingId}
            />
          ) : null}

          <div className="flex flex-col gap-3 border-b border-white/10 px-1 pb-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-1">
              <p className="rr-kicker text-[color:var(--rr-gold)]">
                {selectedStanding.teamName}
              </p>
              <p className="text-[0.92rem] text-[color:var(--rr-muted)]">
                {selectedStanding.competition} - {selectedStanding.season}
              </p>
              {validationErrors.length > 0 ? (
                <p className="text-[0.86rem] text-[#ffc1c4]">
                  {validationErrors.length} validaciones pendientes antes de guardar.
                </p>
              ) : null}
            </div>
          </div>

          <EditableStandingTable
            standing={selectedStanding}
            validationErrors={validationErrors}
            rowErrors={rowErrors}
            canToggleOwnTeam
            onUpdateField={updateRowField}
            onToggleOwnTeam={toggleOwnTeam}
          />
        </div>
      ) : null}

      {screenState === "ready" && hasUnsavedChanges ? (
        <UnsavedChangesBar
          onDiscard={discardChanges}
          onSave={persistSelectedStanding}
          isSaving={isPersisting}
        />
      ) : null}
    </div>
  );
}
