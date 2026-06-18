"use client";

import Link from "next/link";
import { startTransition, useDeferredValue, useEffect, useState } from "react";
import {
  AlertTriangle,
  ClipboardList,
  Eye,
  ListChecks,
  Plus,
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
import { StandingPublishActions } from "@/components/admin/standing-publish-actions";
import {
  StandingsFilters,
  type StandingsFiltersValue,
} from "@/components/admin/standings-filters";
import { StandingsSelector } from "@/components/admin/standings-selector";
import { StandingStatusBadge } from "@/components/admin/standing-status-badge";
import { UnsavedChangesBar } from "@/components/admin/unsaved-changes-bar";
import type {
  StandingManagementRow,
  StandingManagementTable,
} from "@/lib/admin/standings-management-mocks";
import {
  buildBlankStandingRows,
  formatStandingUpdatedLabel,
  getAllStandingsManagementTables,
  getCoachPreviewStandingTeamOptions,
  getResolvedStandingsCoachPreviewTeamSlug,
  getStandingPublicHref,
  getStandingsManagementTeamsForRole,
  normalizeStandingTable,
  sortStandingsManagementTables,
  standingsManagementTeams,
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
  category: "all",
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

  if (!row.teamName.trim()) {
    errors.push(`La fila ${index + 1} necesita nombre de equipo.`);
  }

  if (row.position < 1) {
    errors.push(`La fila ${index + 1} necesita una posicion mayor que 0.`);
  }

  const numericFields = [
    ["PJ", row.played],
    ["G", row.won],
    ["E", row.drawn],
    ["P", row.lost],
    ["GF", row.goalsFor],
    ["GC", row.goalsAgainst],
    ["Pts", row.points],
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

function createEmptyStanding(
  teamSlug: string,
  role: AdminRole,
  coachTeamSlug: string,
  existingTables: StandingManagementTable[],
) {
  const team = standingsManagementTeams.find((item) => item.slug === teamSlug);

  if (!team) {
    return null;
  }

  const duplicateCount = existingTables.filter(
    (standing) => standing.teamSlug === teamSlug,
  ).length;

  return normalizeStandingTable({
    id: `standing-${team.slug}-draft-${existingTables.length + 1}`,
    season: team.season,
    teamId: team.id,
    teamSlug: team.slug,
    teamName: team.name,
    competition:
      duplicateCount === 0
        ? team.competition
        : `${team.competition} - Jornada ${duplicateCount + 1}`,
    category: team.category,
    status: "draft",
    updatedAt: new Date().toISOString(),
    updatedBy: getRoleActorLabel(role, coachTeamSlug),
    rows: buildBlankStandingRows(team.name),
  });
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
  const categories = Array.from(
    new Set(scopedTables.map((table) => table.category)),
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

    if (filters.category !== "all" && table.category !== filters.category) {
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
  const canCreateStanding = role !== "COACH";
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

  function moveRowToPosition(
    rows: StandingManagementRow[],
    rowId: string,
    nextPosition: number,
  ) {
    const orderedRows = [...rows];
    const sourceIndex = orderedRows.findIndex((row) => row.id === rowId);

    if (sourceIndex === -1) {
      return rows;
    }

    const [row] = orderedRows.splice(sourceIndex, 1);
    const targetIndex = Math.min(
      Math.max(nextPosition - 1, 0),
      orderedRows.length,
    );

    orderedRows.splice(targetIndex, 0, row);
    return orderedRows.map((item, index) => ({
      ...item,
      position: index + 1,
    }));
  }

  function updateRowField(
    rowId: string,
    field:
      | "teamName"
      | "played"
      | "won"
      | "drawn"
      | "lost"
      | "goalsFor"
      | "goalsAgainst"
      | "points"
      | "position",
    value: string | number,
  ) {
    updateSelectedStanding((standing) => {
      if (field === "position") {
        return {
          ...standing,
          rows: moveRowToPosition(
            standing.rows,
            rowId,
            typeof value === "number" && Number.isFinite(value)
              ? Math.max(1, Math.trunc(value))
              : 1,
          ),
        };
      }

      const rows = standing.rows.map((row) => {
        if (row.id !== rowId) {
          return row;
        }

        if (field === "teamName") {
          return {
            ...row,
            teamName: String(value),
          };
        }

        return {
          ...row,
          [field]:
            typeof value === "number" && Number.isFinite(value)
              ? Math.max(0, Math.trunc(value))
              : 0,
        };
      });

      return {
        ...standing,
        rows,
      };
    });
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

  function addRow() {
    updateSelectedStanding((standing) => ({
      ...standing,
      rows: [
        ...standing.rows,
        {
          id: `standing-row-new-${standing.rows.length + 1}`,
          position: standing.rows.length + 1,
          teamName: `Nuevo rival ${standing.rows.length}`,
          played: 0,
          won: 0,
          drawn: 0,
          lost: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          goalDifference: 0,
          points: 0,
          isOwnTeam: false,
        },
      ],
    }));
  }

  function removeRow(rowId: string) {
    if (!selectedStanding) {
      return;
    }

    if (
      !window.confirm(
        "Esta accion elimina la fila solo en esta vista previa. Quieres continuar?",
      )
    ) {
      return;
    }

    updateSelectedStanding((standing) => ({
      ...standing,
      rows: standing.rows.filter((row) => row.id !== rowId),
    }));
  }

  function moveRow(rowId: string, direction: -1 | 1) {
    if (!selectedStanding) {
      return;
    }

    const sourceIndex = selectedStanding.rows.findIndex((row) => row.id === rowId);

    if (sourceIndex === -1) {
      return;
    }

    updateSelectedStanding((standing) => {
      const orderedRows = [...standing.rows];
      const targetIndex = sourceIndex + direction;

      if (targetIndex < 0 || targetIndex >= orderedRows.length) {
        return standing;
      }

      const [row] = orderedRows.splice(sourceIndex, 1);
      orderedRows.splice(targetIndex, 0, row);

      return {
        ...standing,
        rows: orderedRows.map((item, index) => ({
          ...item,
          position: index + 1,
        })),
      };
    });
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

  function createStanding() {
    const availableTeam =
      allowedTeams.find(
        (team) =>
          !savedTables.some(
            (standing) =>
              standing.teamSlug === team.slug && standing.season === team.season,
          ),
      ) ?? allowedTeams[0];

    if (!availableTeam) {
      pushBanner("No hay equipos disponibles para crear otra tabla.", "danger");
      return;
    }

    const newStanding = createEmptyStanding(
      availableTeam.slug,
      role,
      coachTeamSlug,
      savedTables,
    );

    if (!newStanding) {
      pushBanner("No hemos podido preparar la clasificacion en vista previa.", "danger");
      return;
    }

    startTransition(() => {
      setSavedTables((currentTables) =>
        sortStandingsManagementTables([...currentTables, newStanding]),
      );
      setRequestedStandingId(newStanding.id);
      setFilters((currentFilters) => ({
        ...currentFilters,
        team: role === "COACH" ? currentFilters.team : newStanding.teamSlug,
      }));
    });

    pushBanner("Nueva clasificacion lista para editar. Guardado local de prueba.");
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

    const seedStanding = seedTables.find(
      (table) => table.id === selectedStanding.id,
    );

    if (!seedStanding) {
      pushBanner("No hay una version inicial de prueba disponible para esta tabla.", "danger");
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
        eyebrow={role === "COACH" ? "Edicion rapida" : "Gestion manual"}
        title="Clasificaciones"
        description={
          role === "COACH"
            ? "Ajusta la tabla de tu equipo con un flujo corto, guardado manual claro y prioridad mobile."
            : "Gestion manual de tablas por equipo y competicion, con guardado simple y vista publica a un paso."
        }
        actions={
          canCreateStanding ? (
            <button
              type="button"
              onClick={createStanding}
              className="rr-button rr-button-primary text-[0.84rem]"
            >
              <Plus className="h-4 w-4" />
              Crear clasificacion
            </button>
          ) : undefined
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
          title="Tabla manual simplificada"
          description="Solo ves una clasificacion a la vez. Lo importante aqui es actualizar filas, guardar sin dudas y tener a mano partidos, estadisticas y vista publica."
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
        categories={categories}
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
          <div className="grid gap-4 xl:grid-cols-[0.92fr_1.08fr]">
            <AdminPanel className="p-5">
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-20 animate-pulse rounded-[10px] bg-white/6"
                  />
                ))}
              </div>
            </AdminPanel>
            <AdminPanel className="p-5">
              <div className="space-y-3">
                <div className="h-12 animate-pulse rounded-[10px] bg-white/6" />
                <div className="h-48 animate-pulse rounded-[10px] bg-white/6" />
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
              No hemos podido cargar la gestion de clasificaciones
            </h2>
            <p className="text-[0.96rem] leading-6 text-[color:var(--rr-muted)]">
              La pantalla contempla un error operativo para validar mensajes, layout y
              recuperacion antes de conectar datos reales.
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
          description="Cuando conectemos datos reales o ampliemos los datos de prueba, esta pantalla mostrara tablas manuales por equipo, temporada y competicion."
          action={
            canCreateStanding ? (
              <button
                type="button"
                onClick={createStanding}
                className="rr-button rr-button-primary text-[0.82rem]"
              >
                Crear clasificacion
              </button>
            ) : undefined
          }
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
        <div className="grid gap-4 xl:grid-cols-[0.92fr_1.08fr]">
          <div className="space-y-4">
            <StandingsSelector
              standings={filteredTables}
              selectedStandingId={selectedStanding.id}
              onSelect={setRequestedStandingId}
            />

            <StandingPublishActions
              role={role}
              standing={selectedStanding}
              validationErrors={validationErrors}
              hasUnsavedChanges={hasUnsavedChanges}
              onSave={persistSelectedStanding}
              onDiscard={discardChanges}
              onDuplicate={duplicateStanding}
              onReset={resetStanding}
            />

            <AdminPanel className="p-5 sm:p-6">
              <div className="space-y-3">
                <p className="rr-kicker text-[color:var(--rr-gold)]">
                  Resumen seleccionado
                </p>
                <div className="space-y-2 text-[0.94rem] text-[color:var(--rr-muted)]">
                  <p>{selectedStanding.teamName}</p>
                  <p>{selectedStanding.competition}</p>
                  <p>{formatStandingUpdatedLabel(selectedStanding)}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <StandingStatusBadge status={selectedStanding.status} />
                  <Link
                    href={getStandingPublicHref(selectedStanding)}
                    className="inline-flex items-center gap-2 text-[0.86rem] text-[color:var(--rr-muted)] transition hover:text-white"
                  >
                    Ver en web
                  </Link>
                </div>
              </div>
            </AdminPanel>
          </div>

          <EditableStandingTable
            standing={selectedStanding}
            validationErrors={validationErrors}
            rowErrors={rowErrors}
            onUpdateField={updateRowField}
            onToggleOwnTeam={toggleOwnTeam}
            onAddRow={addRow}
            onRemoveRow={removeRow}
            onMoveRowUp={(rowId) => moveRow(rowId, -1)}
            onMoveRowDown={(rowId) => moveRow(rowId, 1)}
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
