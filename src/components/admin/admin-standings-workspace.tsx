"use client";

import Link from "next/link";
import { startTransition, useDeferredValue, useEffect, useState } from "react";
import {
  AlertTriangle,
  ClipboardCopy,
  ClipboardList,
  Eye,
  ListChecks,
  RefreshCcw,
  Save,
  ShieldCheck,
  Trophy,
} from "lucide-react";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { AdminFeedbackBanner } from "@/components/admin/admin-feedback-banner";
import { AdminCoachTeamSwitcher } from "@/components/admin/admin-coach-team-switcher";
import { EditableStandingTable } from "@/components/admin/editable-standing-table";
import { AdminMetricCard } from "@/components/admin/admin-metric-card";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPanel } from "@/components/admin/admin-panel";
import { AdminScopePanel } from "@/components/admin/admin-scope-panel";
import {
  StandingsFilters,
  type StandingsFiltersValue,
} from "@/components/admin/standings-filters";
import { UnsavedChangesBar } from "@/components/admin/unsaved-changes-bar";
import type {
  StandingManagementRow,
  StandingManagementTable,
} from "@/lib/admin/standings-management-mocks";
import {
  getAllStandingsManagementTables,
  getCoachPreviewStandingTeamOptions,
  getResolvedStandingsCoachPreviewTeamSlug,
  getStandingPublicHref,
  getStandingsManagementTeamsForRole,
  normalizeAndSortStandingRows,
  normalizeStandingTable,
  sortStandingsManagementTables,
} from "@/lib/admin/standings-management-mocks";
import type { AdminRole } from "@/lib/admin/roles";

type AdminStandingsWorkspaceProps = {
  role: AdminRole;
  initialUiState?: "ready" | "error";
  initialSelectedTeamSlug?: string;
};

type ScreenState = "loading" | "ready" | "error";
type BannerTone = "success" | "danger";

const initialFilters: StandingsFiltersValue = {
  season: "all",
  team: "all",
  competition: "all",
  search: "",
};

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
    rowErrors.push("Marca un equipo propio para la vista publica y el resumen.");
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

function getRoleActorLabel(role: AdminRole, coachTeamSlug: string) {
  if (role !== "COACH") {
    return role === "SUPERADMIN" ? "Superadmin Demo" : "Manager Demo";
  }

  return coachTeamSlug === "juvenil-a" ? "Ivan Lobo" : "Sergio Mena";
}

export function AdminStandingsWorkspace({
  role,
  initialUiState = "ready",
  initialSelectedTeamSlug,
}: AdminStandingsWorkspaceProps) {
  const [seedTables] = useState(() =>
    sortStandingsManagementTables(getAllStandingsManagementTables()),
  );
  const [savedTables, setSavedTables] = useState(() =>
    sortStandingsManagementTables(getAllStandingsManagementTables()),
  );
  const [draftTables, setDraftTables] = useState<
    Record<string, StandingManagementTable>
  >({});
  const [screenState, setScreenState] = useState<ScreenState>("loading");
  const [banner, setBanner] = useState<{
    message: string;
    tone: BannerTone;
  } | null>(null);
  const [coachTeamSlug, setCoachTeamSlug] = useState<string>(
    getResolvedStandingsCoachPreviewTeamSlug(initialSelectedTeamSlug),
  );
  const [filters, setFilters] = useState<StandingsFiltersValue>({
    ...initialFilters,
    team: role === "COACH" ? "all" : initialSelectedTeamSlug ?? "all",
  });
  const deferredSearch = useDeferredValue(filters.search.trim().toLowerCase());

  const mergedTables = mergeTables(savedTables, draftTables);
  const coachPreviewTeamOptions = getCoachPreviewStandingTeamOptions();
  const allowedTeams = getStandingsManagementTeamsForRole(role, coachTeamSlug);
  const allowedTeamSlugs = new Set(allowedTeams.map((team) => team.slug));
  const scopedTables = mergedTables.filter((table) =>
    allowedTeamSlugs.has(table.teamSlug),
  );
  const seasons = Array.from(new Set(scopedTables.map((table) => table.season)));
  const competitions = Array.from(
    new Set(scopedTables.map((table) => table.competition)),
  );
  const filteredTables = scopedTables.filter((table) => {
    if (filters.season !== "all" && table.season !== filters.season) {
      return false;
    }

    if (filters.team !== "all" && table.teamSlug !== filters.team) {
      return false;
    }

    if (
      filters.competition !== "all" &&
      table.competition !== filters.competition
    ) {
      return false;
    }

    if (!deferredSearch) {
      return true;
    }

    return [table.teamName, table.competition, table.category]
      .join(" ")
      .toLowerCase()
      .includes(deferredSearch);
  });

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
    scopedTables.find((table) => table.id === requestedStandingId)?.id ??
    filteredTables[0]?.id ??
    scopedTables[0]?.id ??
    "";
  const selectedStanding =
    filteredTables.find((table) => table.id === selectedStandingId) ??
    scopedTables.find((table) => table.id === selectedStandingId);
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
  const activeSeason = seasons[0] ?? "2026/2027";
  const publishedCount = scopedTables.filter(
    (standing) => standing.status === "published",
  ).length;
  const attentionCount = scopedTables.filter(
    (standing) => standing.status !== "published",
  ).length;
  const teamsWithStandingCount = new Set(
    scopedTables.map((standing) => standing.teamSlug),
  ).size;
  const selectedCoachTeam = allowedTeams[0];

  function pushBanner(message: string, tone: BannerTone = "success") {
    startTransition(() => setBanner(createBanner(message, tone)));
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
      rows: standing.rows.map((row) => ({
        ...row,
        isOwnTeam: row.id === rowId,
      })),
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

    const updatedStanding = normalizeStandingTable({
      ...selectedStanding,
      rows: normalizeAndSortStandingRows(selectedStanding.rows),
      status: "published",
      updatedAt: new Date().toISOString(),
      updatedBy: getRoleActorLabel(role, coachTeamSlug),
    });

    startTransition(() => {
      setSavedTables((currentTables) =>
        sortStandingsManagementTables(
          currentTables.map((table) =>
            table.id === updatedStanding.id ? updatedStanding : table,
          ),
        ),
      );
      setDraftTables((currentDrafts) => {
        const nextDrafts = { ...currentDrafts };
        delete nextDrafts[updatedStanding.id];
        return nextDrafts;
      });
    });

    pushBanner("Clasificacion guardada.");
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

  function duplicateStanding() {
    if (!selectedStanding) {
      return;
    }

    const duplicate = normalizeStandingTable({
      ...selectedStanding,
      id: `${selectedStanding.id}-copy-${savedTables.length + 1}`,
      competition: `${selectedStanding.competition} - copia`,
      status: "draft",
      updatedAt: new Date().toISOString(),
      updatedBy: getRoleActorLabel(role, coachTeamSlug),
      rows: selectedStanding.rows.map((row) => ({
        ...row,
        id: `${row.id}-copy-${savedTables.length + 1}`,
      })),
    });

    startTransition(() => {
      setSavedTables((currentTables) =>
        sortStandingsManagementTables([...currentTables, duplicate]),
      );
      setRequestedStandingId(duplicate.id);
    });

    pushBanner("Clasificacion duplicada para nueva jornada.");
  }

  function resetStanding() {
    if (!selectedStanding) {
      return;
    }

    if (
      !window.confirm(
        "Se restaurara la version inicial de prueba de esta tabla. Continuar?",
      )
    ) {
      return;
    }

    const seedStanding = seedTables.find((table) => table.id === selectedStanding.id);

    if (!seedStanding) {
      pushBanner(
        "No hay una version inicial de prueba disponible para esta tabla.",
        "danger",
      );
      return;
    }

    startTransition(() => {
      setSavedTables((currentTables) =>
        sortStandingsManagementTables(
          currentTables.map((table) =>
            table.id === seedStanding.id ? seedStanding : table,
          ),
        ),
      );
      setDraftTables((currentDrafts) => {
        const nextDrafts = { ...currentDrafts };
        delete nextDrafts[seedStanding.id];
        return nextDrafts;
      });
    });

    pushBanner("Clasificacion restaurada a la version inicial de prueba.");
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <AdminPageHeader
        eyebrow={role === "COACH" ? "Tabla manual" : "Gestion manual"}
        title="Clasificaciones"
        description={
          role === "COACH"
            ? "Edita la tabla de tu equipo y guarda."
            : "Gestion manual de tablas por equipo y competicion."
        }
      />

      {banner ? (
        <AdminFeedbackBanner
          message={banner.message}
          tone={banner.tone === "danger" ? "danger" : "success"}
        />
      ) : null}

      {role === "COACH" ? (
        <AdminScopePanel
          eyebrow="Flujo de entrenador"
          title="Clasificacion compacta"
          description="Actualiza PJ, G, E, P, GF y GC. El orden final se ajusta al guardar."
          actions={
            <>
              <Link
                href={`/admin/partidos?team=${selectedCoachTeam?.slug ?? ""}`}
                className="rr-button rr-button-secondary text-[0.8rem]"
              >
                Ver partidos
              </Link>
              <Link
                href={`/admin/estadisticas?team=${selectedCoachTeam?.slug ?? ""}`}
                className="rr-button rr-button-secondary text-[0.8rem]"
              >
                Ir a estadisticas
              </Link>
              {selectedStanding ? (
                <Link
                  href={getStandingPublicHref(selectedStanding)}
                  className="rr-button rr-button-secondary text-[0.8rem]"
                >
                  Vista publica
                </Link>
              ) : null}
            </>
          }
          aside={
            <AdminCoachTeamSwitcher
              options={coachPreviewTeamOptions}
              value={coachTeamSlug}
              onChange={(nextCoachTeamSlug) => {
                setCoachTeamSlug(nextCoachTeamSlug);
                setFilters(initialFilters);
              }}
            />
          }
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
        value={filters}
        seasons={seasons}
        teams={allowedTeams.map((team) => ({ slug: team.slug, name: team.name }))}
        competitions={competitions}
        totalStandings={scopedTables.length}
        filteredStandings={filteredTables.length}
        showTeamFilter={role !== "COACH" && allowedTeams.length > 1}
        onChange={setFilters}
        onReset={() =>
          setFilters({
            ...initialFilters,
            team: role === "COACH" ? "all" : initialSelectedTeamSlug ?? "all",
          })
        }
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
                  <div className="h-12 animate-pulse rounded-[10px] bg-white/6" />
                  <div className="h-24 animate-pulse rounded-[10px] bg-white/6" />
                </div>
              </AdminPanel>
            ))}
          </div>
          <AdminPanel className="p-5">
            <div className="h-64 animate-pulse rounded-[10px] bg-white/6" />
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
          description="Cuando ampliemos los datos de prueba, esta pantalla mostrara tablas manuales por equipo."
        />
      ) : null}

      {screenState === "ready" &&
      scopedTables.length > 0 &&
      filteredTables.length === 0 ? (
        <AdminEmptyState
          title="Sin resultados"
          description="Ajusta filtros o cambia la busqueda para volver a ver clasificaciones."
          action={
            <button
              type="button"
              onClick={() =>
                setFilters({
                  ...initialFilters,
                  team: role === "COACH" ? "all" : initialSelectedTeamSlug ?? "all",
                })
              }
              className="rr-button rr-button-secondary text-[0.82rem]"
            >
              Limpiar filtros
            </button>
          }
        />
      ) : null}

      {screenState === "ready" &&
      filteredTables.length > 0 &&
      selectedStanding ? (
        <div className="space-y-4">
          <div className="flex flex-col gap-3 border-b border-white/10 px-1 pb-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-1">
              <p className="rr-kicker text-[color:var(--rr-gold)]">
                {selectedStanding.teamName}
              </p>
              <p className="text-[0.92rem] text-[color:var(--rr-muted)]">
                {selectedStanding.competition} - {selectedStanding.season}
              </p>
              {validationErrors.length > 0 ? (
                <p className="text-[0.86rem] text-[#ffc3bc]">
                  {validationErrors.length} validaciones pendientes antes de guardar.
                </p>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={persistSelectedStanding}
                className="rr-button rr-button-primary min-h-10 px-3 py-2 text-[0.76rem]"
              >
                <Save className="h-4 w-4" />
                {hasUnsavedChanges ? "Guardar" : "Guardar de nuevo"}
              </button>
              {hasUnsavedChanges ? (
                <button
                  type="button"
                  onClick={discardChanges}
                  className="rr-button rr-button-secondary min-h-10 px-3 py-2 text-[0.76rem]"
                >
                  Cancelar
                </button>
              ) : null}
              <Link
                href={getStandingPublicHref(selectedStanding)}
                className="rr-button rr-button-secondary min-h-10 px-3 py-2 text-[0.76rem]"
              >
                <Eye className="h-4 w-4" />
                Ver web
              </Link>
              {role !== "COACH" ? (
                <button
                  type="button"
                  onClick={duplicateStanding}
                  className="rr-button rr-button-secondary min-h-10 px-3 py-2 text-[0.76rem]"
                >
                  <ClipboardCopy className="h-4 w-4" />
                  Duplicar
                </button>
              ) : null}
              {role !== "COACH" ? (
                <button
                  type="button"
                  onClick={resetStanding}
                  className="rr-button rr-button-secondary min-h-10 px-3 py-2 text-[0.76rem]"
                >
                  <RefreshCcw className="h-4 w-4" />
                  Restaurar
                </button>
              ) : null}
            </div>
          </div>

          <EditableStandingTable
            standing={selectedStanding}
            validationErrors={validationErrors}
            rowErrors={rowErrors}
            canToggleOwnTeam={role !== "COACH"}
            onUpdateField={updateRowField}
            onToggleOwnTeam={toggleOwnTeam}
          />
        </div>
      ) : null}

      {screenState === "ready" && hasUnsavedChanges ? (
        <UnsavedChangesBar
          onDiscard={discardChanges}
          onSave={persistSelectedStanding}
        />
      ) : null}
    </div>
  );
}
