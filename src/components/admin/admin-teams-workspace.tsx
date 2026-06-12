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
  Trophy,
} from "lucide-react";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { AdminFeedbackBanner } from "@/components/admin/admin-feedback-banner";
import { AdminMetricCard } from "@/components/admin/admin-metric-card";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPanel } from "@/components/admin/admin-panel";
import { AdminScopePanel } from "@/components/admin/admin-scope-panel";
import {
  TeamFilters,
  type TeamFiltersValue,
} from "@/components/admin/team-filters";
import { TeamFormDialog } from "@/components/admin/team-form-dialog";
import { TeamList } from "@/components/admin/team-list";
import type { AdminRole } from "@/lib/admin/roles";
import {
  adminTeamManagementSeasons,
  getAssignableCoachUsers,
  normalizeTeamManagementTeam,
  type TeamManagementTeam,
  type TeamResponsibleCoachUser,
} from "@/lib/admin/team-management-mocks";

type AdminTeamsWorkspaceProps = {
  role: AdminRole;
  initialTeams: TeamManagementTeam[];
  initialUiState?: "ready" | "error";
};

type DialogState =
  | { mode: "create" }
  | { mode: "edit" | "coaches"; teamId: string }
  | null;

const initialFilters: TeamFiltersValue = {
  season: "all",
  category: "all",
  branch: "all",
  visibility: "all",
  activity: "all",
  search: "",
};

const coachUsers: TeamResponsibleCoachUser[] = getAssignableCoachUsers().map(
  (user) => ({
    id: user.id,
    displayName: user.displayName,
    username: user.username ?? "",
    roleLabel: user.roleLabel,
  }),
);

function sortTeams(teams: TeamManagementTeam[]) {
  return [...teams].sort(
    (left, right) =>
      left.displayOrder - right.displayOrder ||
      left.name.localeCompare(right.name),
  );
}

export function AdminTeamsWorkspace({
  role,
  initialTeams,
  initialUiState = "ready",
}: AdminTeamsWorkspaceProps) {
  const [teams, setTeams] = useState(() => sortTeams(initialTeams));
  const [filters, setFilters] = useState<TeamFiltersValue>(initialFilters);
  const [dialogState, setDialogState] = useState<DialogState>(null);
  const [bannerMessage, setBannerMessage] = useState<string | null>(null);
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

      if (filters.category !== "all" && team.category !== filters.category) {
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

  const seasons = Array.from(new Set(teams.map((team) => team.season)));
  const categories = Array.from(new Set(teams.map((team) => team.category)));
  const branches = Array.from(new Set(teams.map((team) => team.branch)));
  const totalTeams = teams.length;
  const visibleTeams = teams.filter((team) => team.publicVisible).length;
  const activeTeams = teams.filter((team) => team.active).length;
  const academyTeams = teams.filter((team) => !team.isFirstTeam).length;
  const firstTeam = teams.find((team) => team.isFirstTeam);
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
    setDialogState({ mode: "create" });
  }

  function openEditDialog(team: TeamManagementTeam) {
    setDialogState({ mode: "edit", teamId: team.id });
  }

  function openCoachDialog(team: TeamManagementTeam) {
    setDialogState({ mode: "coaches", teamId: team.id });
  }

  function saveTeam(nextTeam: TeamManagementTeam) {
    startTransition(() => {
      setTeams((currentTeams) => {
        const teamToSave = normalizeTeamManagementTeam(nextTeam);
        const nextTeams = currentTeams.some((team) => team.id === teamToSave.id)
          ? currentTeams.map((team) =>
              team.id === teamToSave.id
                ? teamToSave
                : team.isFirstTeam && teamToSave.isFirstTeam
                  ? normalizeTeamManagementTeam({ ...team, isFirstTeam: false })
                  : team,
            )
          : [
              ...currentTeams.map((team) =>
                team.isFirstTeam && teamToSave.isFirstTeam
                  ? normalizeTeamManagementTeam({ ...team, isFirstTeam: false })
                  : team,
              ),
              teamToSave,
            ];

        return sortTeams(nextTeams);
      });
      setDialogState(null);
    });

    pushBanner(
      dialogState?.mode === "create" ? "Equipo creado en mock." : "Cambios guardados.",
    );
  }

  function toggleActive(teamId: string) {
    setTeams((currentTeams) =>
      currentTeams.map((team) =>
        team.id === teamId
          ? normalizeTeamManagementTeam({ ...team, active: !team.active })
          : team,
      ),
    );

    const updatedTeam = teams.find((team) => team.id === teamId);
    if (updatedTeam) {
      pushBanner(
        updatedTeam.active
          ? `${updatedTeam.name} pasa a inactivo.`
          : `${updatedTeam.name} vuelve a estar activo.`,
      );
    }
  }

  function toggleVisibility(teamId: string) {
    setTeams((currentTeams) =>
      currentTeams.map((team) =>
        team.id === teamId
          ? normalizeTeamManagementTeam({
              ...team,
              publicVisible: !team.publicVisible,
            })
          : team,
      ),
    );

    const updatedTeam = teams.find((team) => team.id === teamId);
    if (updatedTeam) {
      pushBanner(
        updatedTeam.publicVisible
          ? `${updatedTeam.name} se oculta de la web.`
          : `${updatedTeam.name} vuelve a ser publico.`,
      );
    }
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <AdminPageHeader
        eyebrow="Estructura deportiva"
        title={role === "COACH" ? "Mi equipo" : "Equipos"}
        description={
          role === "COACH"
            ? "Consulta el contexto publico de tu equipo y usa esta pantalla como apoyo rapido, no como panel de gestion global."
            : "Controla visibilidad, responsables y contexto deportivo sin salir del patron operativo del backoffice."
        }
        actions={
          canManageTeams ? (
            <button
              type="button"
              onClick={openCreateDialog}
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
          description="Aqui no gestionas estructura global. Revisa identidad publica, responsables visibles y salta a partidos, clasificacion o estadisticas."
          actions={
            <>
              <Link
                href="/admin/partidos"
                className="rr-button rr-button-secondary text-[0.8rem]"
              >
                Ir a partidos
              </Link>
              <Link
                href="/admin/clasificaciones"
                className="rr-button rr-button-secondary text-[0.8rem]"
              >
                Ir a clasificacion
              </Link>
              <Link
                href="/admin/estadisticas"
                className="rr-button rr-button-secondary text-[0.8rem]"
              >
                Ir a estadisticas
              </Link>
            </>
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
            detail={selectedCoachTeam?.primaryCoach ?? "Sin responsable visible"}
            tone="blue"
            icon={<Trophy className="h-5 w-5" />}
          />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
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
          <AdminMetricCard
            label="Primer Equipo"
            value={firstTeam?.name ?? "-"}
            detail={
              firstTeam
                ? `${firstTeam.competition} Â· ${firstTeam.season}`
                : "Sin equipo destacado"
            }
            tone="blue"
            icon={<Trophy className="h-5 w-5" />}
          />
        </div>
      )}

      {role !== "COACH" ? (
        <TeamFilters
          value={filters}
          seasons={seasons}
          categories={categories}
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
                    className="h-11 animate-pulse rounded-[8px] bg-white/6"
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
              <p className="rr-kicker text-[color:var(--rr-gold)]">Estado mock</p>
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
          description="Cuando conectemos la fuente real o anadas mocks, esta pantalla mostrara la estructura deportiva del club."
          action={
            canManageTeams ? (
              <button
                type="button"
                onClick={openCreateDialog}
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
        seasons={adminTeamManagementSeasons.map((season) => season.name)}
        categories={categories}
        branches={branches}
        availableCoachUsers={coachUsers}
        onClose={() => setDialogState(null)}
        onSave={saveTeam}
      />
    </div>
  );
}
