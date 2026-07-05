"use client";

import Link from "next/link";
import {
  Eye,
  EyeOff,
  Pencil,
  ShieldCheck,
  ShieldOff,
  UsersRound,
} from "lucide-react";
import { AdminListCard } from "@/components/admin/admin-list-card";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { AdminTable } from "@/components/admin/admin-table";
import { TeamVisibilityBadge } from "@/components/admin/team-visibility-badge";
import type { AdminRole } from "@/lib/admin/roles";
import type { TeamManagementTeam } from "@/lib/admin/team-management-mocks";
import { cn } from "@/lib/utils";

type TeamListProps = {
  role: AdminRole;
  teams: TeamManagementTeam[];
  onEdit: (team: TeamManagementTeam) => void;
  onManageCoaches: (team: TeamManagementTeam) => void;
  onToggleActive: (teamId: string) => void;
  onToggleVisibility: (teamId: string) => void;
};

function TeamActions({
  role,
  team,
  onEdit,
  onManageCoaches,
  onToggleActive,
  onToggleVisibility,
}: {
  role: AdminRole;
  team: TeamManagementTeam;
  onEdit: (team: TeamManagementTeam) => void;
  onManageCoaches: (team: TeamManagementTeam) => void;
  onToggleActive: (teamId: string) => void;
  onToggleVisibility: (teamId: string) => void;
}) {
  const iconButtonClassName =
    "inline-flex h-9 w-9 items-center justify-center rounded-[8px] border border-white/10 bg-white/5 text-[color:var(--rr-muted)] transition hover:border-[rgba(253,203,88,0.26)] hover:text-white";

  if (role === "COACH") {
    return (
      <div className="space-y-2">
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/admin/partidos?team=${team.slug}`}
            className="rr-button rr-button-primary min-h-9 px-3 text-[0.78rem]"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            Abrir partidos del equipo
          </Link>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-2 text-[0.82rem] text-[color:var(--rr-muted)]">
          <Link
            href={`/admin/clasificaciones?team=${team.slug}`}
            className="inline-flex items-center gap-2 transition hover:text-white"
          >
            Consultar clasificacion
          </Link>
          <Link
            href={`/admin/estadisticas?team=${team.slug}`}
            className="inline-flex items-center gap-2 transition hover:text-white"
          >
            Consultar estadisticas
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-w-fit flex-nowrap items-center gap-2">
      <button
        type="button"
        onClick={() => onEdit(team)}
        className={iconButtonClassName}
        aria-label="Editar equipo"
        title="Editar equipo"
      >
        <Pencil className="h-4 w-4" />
      </button>

      <button
        type="button"
        onClick={() => onManageCoaches(team)}
        className={iconButtonClassName}
        aria-label="Editar entrenadores"
        title="Editar entrenadores"
      >
        <UsersRound className="h-4 w-4" />
      </button>

      <button
        type="button"
        onClick={() => onToggleActive(team.id)}
        className={cn(
          iconButtonClassName,
          team.active
            ? "text-[color:var(--rr-gold)]"
            : "border-[rgba(214,64,69,0.26)] text-[#ffb4b0]",
        )}
        aria-label={team.active ? "Pasar a inactivo" : "Reactivar equipo"}
        title={team.active ? "Pasar a inactivo" : "Reactivar equipo"}
      >
        {team.active ? (
          <ShieldOff className="h-4 w-4" />
        ) : (
          <ShieldCheck className="h-4 w-4" />
        )}
      </button>

      <button
        type="button"
        onClick={() => onToggleVisibility(team.id)}
        className={cn(
          iconButtonClassName,
          team.publicVisible
            ? "text-[color:var(--rr-gold)]"
            : "border-[rgba(214,64,69,0.26)] text-[#ffb4b0]",
        )}
        aria-label={team.publicVisible ? "Ocultar de la web" : "Mostrar en la web"}
        title={team.publicVisible ? "Ocultar de la web" : "Mostrar en la web"}
      >
        {team.publicVisible ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}

function TeamCoachSummary({
  team,
}: {
  team: TeamManagementTeam;
}) {
  const visibleCoachNames =
    team.visibleCoaches.length > 0 ? team.visibleCoaches : [team.primaryCoach];

  return (
    <div className="space-y-1 whitespace-nowrap">
      {visibleCoachNames.map((coachName) => (
        <p key={coachName}>{coachName}</p>
      ))}
    </div>
  );
}

export function TeamList({
  role,
  teams,
  onEdit,
  onManageCoaches,
  onToggleActive,
  onToggleVisibility,
}: TeamListProps) {
  const rows = teams.map((team) => ({
    team: (
      <div className="space-y-1">
        <p className="font-semibold text-white">{team.name}</p>
        <p className="text-[0.88rem] text-[color:var(--rr-muted)]">{team.category}</p>
      </div>
    ),
    context: <p>{team.competition}</p>,
    players: <p>{team.playerCount}</p>,
    state: (
      <div className="flex min-w-fit flex-nowrap gap-1.5">
        <TeamVisibilityBadge publicVisible={team.publicVisible} />
        <AdminStatusBadge
          label={team.active ? "Activo" : "Inactivo"}
          tone={team.active ? "success" : "danger"}
        />
        <AdminStatusBadge
          label={team.isFirstTeam ? "Primer Equipo" : "Cantera"}
          tone={team.isFirstTeam ? "blue" : "slate"}
        />
      </div>
    ),
    coaches: <TeamCoachSummary team={team} />,
    actions: (
      <TeamActions
        role={role}
        team={team}
        onEdit={onEdit}
        onManageCoaches={onManageCoaches}
        onToggleActive={onToggleActive}
        onToggleVisibility={onToggleVisibility}
      />
    ),
  }));

  return (
    <>
      <div className="grid gap-3 lg:hidden">
        {teams.map((team) => (
          <AdminListCard
            key={team.id}
            eyebrow={team.category}
            title={team.name}
            description={team.competition}
            meta={
              <>
                <TeamVisibilityBadge publicVisible={team.publicVisible} />
                <AdminStatusBadge
                  label={team.active ? "Activo" : "Inactivo"}
                  tone={team.active ? "success" : "danger"}
                />
                <AdminStatusBadge
                  label={team.isFirstTeam ? "Primer Equipo" : "Cantera"}
                  tone={team.isFirstTeam ? "blue" : "slate"}
                />
                {role === "COACH" ? (
                  <AdminStatusBadge label="Consulta" tone="slate" />
                ) : null}
              </>
            }
            footer={
              <div className="space-y-4">
                <div className="rounded-[10px] border border-white/8 bg-white/4 p-3 text-[0.9rem] text-[color:var(--rr-muted)]">
                  <p className="text-white">{team.competition}</p>
                  <p className="mt-1">{team.playerCount} jugadores</p>
                  {team.visibleCoaches.length > 0 ? (
                    <p className="mt-2">{team.visibleCoaches.join(" - ")}</p>
                  ) : null}
                  {role === "COACH" ? (
                    <p className="mt-2">
                      Solo consultas contexto. Para actuar, salta a partidos, clasificacion o estadisticas.
                    </p>
                  ) : null}
                </div>
                <TeamActions
                  role={role}
                  team={team}
                  onEdit={onEdit}
                  onManageCoaches={onManageCoaches}
                  onToggleActive={onToggleActive}
                  onToggleVisibility={onToggleVisibility}
                />
              </div>
            }
          />
        ))}
      </div>

      <AdminTable
        columns={[
          { key: "team", label: "Equipo", className: "w-[16rem]" },
          { key: "context", label: "Contexto deportivo", className: "w-[22%]" },
          { key: "players", label: "Jugadores", className: "w-24" },
          { key: "state", label: "Estado publico", className: "w-[25rem]" },
          { key: "coaches", label: "Entrenador", className: "w-[14rem]" },
          { key: "actions", label: "Acciones", className: "w-[12rem]" },
        ]}
        rows={rows}
      />
    </>
  );
}
