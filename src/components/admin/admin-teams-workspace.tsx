"use client";

import Link from "next/link";
import { startTransition, useDeferredValue, useEffect, useState } from "react";
import {
  AlertTriangle,
  Eye,
  FolderKanban,
  Layers3,
  Plus,
  ShieldCheck,
  Users,
} from "lucide-react";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { AdminFeedbackBanner } from "@/components/admin/admin-feedback-banner";
import { AdminMetricCard } from "@/components/admin/admin-metric-card";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPanel } from "@/components/admin/admin-panel";
import { AdminScopePanel } from "@/components/admin/admin-scope-panel";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import {
  saveTeamAction,
  toggleTeamActiveAction,
  toggleTeamVisibilityAction,
} from "@/app/admin/(panel)/equipos/actions";
import {
  TeamFilters,
  type TeamFiltersValue,
} from "@/components/admin/team-filters";
import { TeamFormDialog } from "@/components/admin/team-form-dialog";
import { TeamList } from "@/components/admin/team-list";
import type { AdminMediaPickerItem } from "@/lib/admin/media-management";
import type { AdminRole } from "@/lib/admin/roles";
import type { TeamManagementTeam } from "@/lib/admin/team-management-mocks";

type AdminTeamsWorkspaceProps = {
  role: AdminRole;
  initialTeams: TeamManagementTeam[];
  seasonOptions: string[];
  categoryOptions: string[];
  competitionOptions: string[];
  mediaOptions: AdminMediaPickerItem[];
  initialUiState?: "ready" | "error";
};

type DialogState =
  | { mode: "create" }
  | { mode: "edit" | "coaches"; teamId: string }
  | null;

const initialFilters: TeamFiltersValue = {
  season: "all",
  branch: "all",
  visibility: "all",
  activity: "all",
  search: "",
};

function sortTeams(teams: TeamManagementTeam[]) {
  return [...teams].sort(
    (left, right) =>
      right.season.localeCompare(left.season, "es") ||
      left.displayOrder - right.displayOrder ||
      left.name.localeCompare(right.name),
  );
}

export function AdminTeamsWorkspace({
  role,
  initialTeams,
  seasonOptions,
  categoryOptions,
  competitionOptions,
  mediaOptions,
  initialUiState = "ready",
}: AdminTeamsWorkspaceProps) {
  const [teams, setTeams] = useState(() => sortTeams(initialTeams));
  const [filters, setFilters] = useState<TeamFiltersValue>(initialFilters);
  const [dialogState, setDialogState] = useState<DialogState>(null);
  const [bannerMessage, setBannerMessage] = useState<string | null>(null);
  const [isPersisting, setIsPersisting] = useState(false);
  const [screenState, setScreenState] = useState<"loading" | "ready" | "error">(
    "loading",
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

  const filteredTeams = sortTeams(
    teams.filter((team) => {
      if (filters.season !== "all" && team.season !== filters.season) {
        return false;
      }

      if (filters.branch !== "all" && team.branch !== filters.branch) {
        return false;
      }

      if (filters.visibility === "visible" && !team.publicVisible) {
        return false;
      }

      if (filters.visibility === "hidden" && team.publicVisible) {
        return false;
      }

      if (filters.activity === "active" && !team.active) {
        return false;
      }

      if (filters.activity === "inactive" && team.active) {
        return false;
      }

      if (!deferredSearch) {
        return true;
      }

      return [
        team.name,
        team.slug,
        team.category,
        team.competition,
        team.season,
        team.visibleCoaches.join(" "),
      ]
        .join(" ")
        .toLowerCase()
        .includes(deferredSearch);
    }),
  );

  const seasons = Array.from(new Set([...seasonOptions, ...teams.map((team) => team.season)]));
  const categories = Array.from(
    new Set([...categoryOptions, ...teams.map((team) => team.category)]),
  );
  const branches = Array.from(new Set(teams.map((team) => team.branch)));
  const resolvedCompetitionOptions = Array.from(
    new Set([...competitionOptions, ...teams.map((team) => team.competition).filter(Boolean)]),
  ).sort((left, right) => left.localeCompare(right, "es"));
  const totalTeams = teams.length;
  const visibleTeams = teams.filter((team) => team.publicVisible).length;
  const activeTeams = teams.filter((team) => team.active).length;
  const academyTeams = teams.filter((team) => !team.isFirstTeam).length;
  const selectedCoachTeam = teams[0];
  const selectedTeam =
    dialogState && "teamId" in dialogState
      ? teams.find((team) => team.id === dialogState.teamId)
      : undefined;

  const canManageTeams = role !== "COACH";

  function pushBanner(message: string) {
    startTransition(() => setBannerMessage(message));
  }

  function openCreateDialog() {
    if (seasons.length === 0) {
      pushBanner("Necesitas crear una temporada antes de dar de alta equipos.");
      return;
    }

    setDialogState({ mode: "create" });
  }

  function openEditDialog(team: TeamManagementTeam) {
    setDialogState({ mode: "edit", teamId: team.id });
  }

  function openCoachDialog(team: TeamManagementTeam) {
    setDialogState({ mode: "coaches", teamId: team.id });
  }

  async function saveTeam(nextTeam: TeamManagementTeam) {
    setIsPersisting(true);

    const result = await saveTeamAction({
      seasonTeamId:
        dialogState && "teamId" in dialogState && /^\d+$/.test(dialogState.teamId)
          ? dialogState.teamId
          : undefined,
      name: nextTeam.name,
      slug: nextTeam.slug,
      category: nextTeam.category,
      competition: nextTeam.competition,
      season: nextTeam.season,
      publicVisible: nextTeam.publicVisible,
      active: nextTeam.active,
      isFirstTeam: nextTeam.isFirstTeam,
      displayOrder: nextTeam.displayOrder,
      coaches: nextTeam.coaches.map((coach) => ({
        id: coach.id,
        name: coach.name,
        roleLabel: coach.roleLabel,
        publicVisible: coach.publicVisible,
      })),
      logoMediaId: nextTeam.logoMediaId,
      logoUrl: nextTeam.logoUrl,
      bannerMediaId: nextTeam.bannerMediaId,
      bannerUrl: nextTeam.bannerUrl,
    });

    setIsPersisting(false);

    if (!result.ok) {
      pushBanner(result.message);
      return;
    }

    setTeams(sortTeams(result.data.teams));
    setDialogState(null);
    pushBanner(result.message);
  }

  async function toggleActive(teamId: string) {
    setIsPersisting(true);
    const result = await toggleTeamActiveAction({ seasonTeamId: teamId });
    setIsPersisting(false);

    if (!result.ok) {
      pushBanner(result.message);
      return;
    }

    setTeams(sortTeams(result.data.teams));
    pushBanner(result.message);
  }

  async function toggleVisibility(teamId: string) {
    setIsPersisting(true);
    const result = await toggleTeamVisibilityAction({ seasonTeamId: teamId });
    setIsPersisting(false);

    if (!result.ok) {
      pushBanner(result.message);
      return;
    }

    setTeams(sortTeams(result.data.teams));
    pushBanner(result.message);
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <AdminPageHeader
        eyebrow={role === "COACH" ? "Solo consulta" : "Estructura deportiva"}
        title={role === "COACH" ? "Mi equipo" : "Equipos"}
        description={
          role === "COACH"
            ? "Consulta el contexto publico y deportivo de tu equipo. Desde aqui no editas estructura global: solo revisas contexto y saltas al modulo que toca."
            : "Controla visibilidad, entrenadores y contexto deportivo sin salir del patron operativo del backoffice."
        }
        actions={
          canManageTeams ? (
            <button
              type="button"
              onClick={openCreateDialog}
              disabled={isPersisting || seasons.length === 0}
              className="rr-button rr-button-primary text-[0.84rem]"
            >
              <Plus className="h-4 w-4" />
              Crear equipo
            </button>
          ) : undefined
        }
      />

      {bannerMessage ? <AdminFeedbackBanner message={bannerMessage} /> : null}

      {role === "COACH" ? (
        <AdminScopePanel
          eyebrow="Consulta de entrenador"
          title="Solo contexto de tu equipo"
          description="Revisa identidad publica, entrenadores visibles y estado general del equipo. Para actuar, salta a partidos, clasificacion o estadisticas."
          actions={
            <>
              <Link
                href="/admin/partidos"
                className="rr-button rr-button-secondary text-[0.8rem]"
              >
                Abrir partidos del equipo
              </Link>
              <Link
                href="/admin/clasificaciones"
                className="rr-button rr-button-secondary text-[0.8rem]"
              >
                Consultar clasificacion
              </Link>
              <Link
                href="/admin/estadisticas"
                className="rr-button rr-button-secondary text-[0.8rem]"
              >
                Consultar estadisticas
              </Link>
            </>
          }
          aside={
            <div className="rounded-[16px] border border-white/10 bg-white/5 px-4 py-3">
              <AdminStatusBadge label="Solo consulta" tone="slate" />
              <p className="mt-2 text-[0.84rem] leading-5 text-[color:var(--rr-muted)]">
                Sin cambios de estructura, visibilidad o entrenadores desde esta vista.
              </p>
            </div>
          }
        />
      ) : null}

      {role === "COACH" ? (
        <div className="grid gap-4 md:grid-cols-3">
          <AdminMetricCard
            label="Estado web"
            value={selectedCoachTeam?.publicVisible ? "Visible" : "Oculto"}
            detail="Como aparece ahora mismo en la web"
            tone={selectedCoachTeam?.publicVisible ? "gold" : "danger"}
            icon={<Eye className="h-5 w-5" />}
          />
          <AdminMetricCard
            label="Estado interno"
            value={selectedCoachTeam?.active ? "Activo" : "Inactivo"}
            detail="Disponibilidad deportiva del equipo"
            tone={selectedCoachTeam?.active ? "blue" : "danger"}
            icon={<ShieldCheck className="h-5 w-5" />}
          />
          <AdminMetricCard
            label="Entrenadores visibles"
            value={selectedCoachTeam?.visibleCoaches.length.toString() ?? "0"}
            detail={selectedCoachTeam?.primaryCoach ?? "Sin entrenador visible"}
            tone="blue"
            icon={<Users className="h-5 w-5" />}
          />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <AdminMetricCard
            label="Total equipos"
            value={totalTeams.toString()}
            tone="gold"
            icon={<Layers3 className="h-5 w-5" />}
          />
          <AdminMetricCard
            label="Visibles en web"
            value={visibleTeams.toString()}
            detail="Listos para consumo publico"
            tone="blue"
            icon={<Eye className="h-5 w-5" />}
          />
          <AdminMetricCard
            label="Activos"
            value={activeTeams.toString()}
            detail="Estructuras deportivas disponibles"
            tone="slate"
            icon={<ShieldCheck className="h-5 w-5" />}
          />
          <AdminMetricCard
            label="Cantera"
            value={academyTeams.toString()}
            detail="Equipos que no son primer equipo"
            tone="gold"
            icon={<FolderKanban className="h-5 w-5" />}
          />
        </div>
      )}

      {role !== "COACH" ? (
        <TeamFilters
          value={filters}
          seasons={seasons}
          branches={branches}
          totalTeams={teams.length}
          filteredTeams={filteredTeams.length}
          onChange={setFilters}
          onReset={() => setFilters(initialFilters)}
        />
      ) : null}

      {screenState === "loading" ? (
        <div className="space-y-4">
          {role !== "COACH" ? (
            <AdminPanel className="p-5">
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-11 animate-pulse rounded-[14px] bg-white/6"
                  />
                ))}
              </div>
            </AdminPanel>
          ) : null}
          <div className="grid gap-3">
            {Array.from({ length: role === "COACH" ? 1 : 3 }).map((_, index) => (
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
              No hemos podido cargar la gestion de equipos
            </h2>
            <p className="text-[0.96rem] leading-6 text-[color:var(--rr-muted)]">
              La pantalla contempla un error operativo para validar mensajes,
              recuperacion y layout sin datos.
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

      {screenState === "ready" && teams.length === 0 ? (
        <AdminEmptyState
          title="No hay equipos cargados"
          description="Cuando conectemos la fuente real o anadamos datos de prueba, esta pantalla mostrara la estructura deportiva del club."
          action={
            canManageTeams ? (
              <button
                type="button"
                onClick={openCreateDialog}
                disabled={isPersisting || seasons.length === 0}
                className="rr-button rr-button-primary text-[0.82rem]"
              >
                Crear primer equipo
              </button>
            ) : undefined
          }
        />
      ) : null}

      {screenState === "ready" && teams.length > 0 && filteredTeams.length === 0 ? (
        <AdminEmptyState
          title="Sin resultados"
          description="Ajusta los filtros o la busqueda para volver a ver equipos."
          action={
            <button
              type="button"
              onClick={() => setFilters(initialFilters)}
              className="rr-button rr-button-secondary text-[0.82rem]"
            >
              Limpiar filtros
            </button>
          }
        />
      ) : null}

      {screenState === "ready" && filteredTeams.length > 0 ? (
        <TeamList
          role={role}
          teams={filteredTeams}
          disabled={isPersisting}
          onEdit={openEditDialog}
          onManageCoaches={openCoachDialog}
          onToggleActive={toggleActive}
          onToggleVisibility={toggleVisibility}
        />
      ) : null}

      <TeamFormDialog
        key={
          dialogState
            ? `${dialogState.mode}-${"teamId" in dialogState ? dialogState.teamId : "new"}`
            : "team-dialog-closed"
        }
        open={dialogState !== null}
        mode={dialogState?.mode ?? "create"}
        team={selectedTeam}
        existingTeams={teams}
        isSaving={isPersisting}
        seasons={seasons}
        categories={categories}
        competitionOptions={resolvedCompetitionOptions}
        mediaOptions={mediaOptions}
        onClose={() => setDialogState(null)}
        onSave={saveTeam}
      />
    </div>
  );
}
