"use client";

import Link from "next/link";
import { Eye, EyeOff, Pencil, ShieldCheck, ShieldOff, UsersRound } from "lucide-react";
import { AdminListCard } from "@/components/admin/admin-list-card";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { AdminTable } from "@/components/admin/admin-table";
import { TeamVisibilityBadge } from "@/components/admin/team-visibility-badge";
import type { AdminRole } from "@/lib/admin/roles";
import type { TeamManagementTeam } from "@/lib/admin/team-management-mocks";

type TeamListProps = {
  role: AdminRole;
  teams: TeamManagementTeam[];
  onEdit: (team: TeamManagementTeam) => void;
  onManageCoaches: (team: TeamManagementTeam) => void;
  onToggleActive: (teamId: string) => void;
  onToggleVisibility: (teamId: string) => void;
};

function getPublicPath(team: TeamManagementTeam) {
  return team.isFirstTeam ? "/primer-equipo" : `/equipos/${team.slug}`;
}

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
  if (role === "COACH") {
    return (
      <div className="space-y-2">
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/admin/partidos?team=${team.slug}`}
            className="rr-button rr-button-primary min-h-9 px-3 text-[0.78rem]"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            Ir a partidos
          </Link>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-2 text-[0.82rem] text-[color:var(--rr-muted)]">
          <Link
            href={`/admin/clasificaciones?team=${team.slug}`}
            className="inline-flex items-center gap-2 transition hover:text-white"
          >
            Ver clasificacion
          </Link>
          <Link
            href={`/admin/estadisticas?team=${team.slug}`}
            className="inline-flex items-center gap-2 transition hover:text-white"
          >
            Ver estadisticas
          </Link>
          <Link
            href={getPublicPath(team)}
            className="inline-flex items-center gap-2 transition hover:text-white"
          >
            <Eye className="h-3.5 w-3.5 text-[color:var(--rr-gold)]" />
            Ver publico
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onEdit(team)}
          className="rr-button rr-button-primary min-h-9 px-3 text-[0.78rem]"
        >
          <Pencil className="h-3.5 w-3.5" />
          Editar equipo
        </button>

        <button
          type="button"
          onClick={() => onManageCoaches(team)}
          className="rr-button rr-button-secondary min-h-9 px-3 text-[0.78rem]"
        >
          <UsersRound className="h-3.5 w-3.5" />
          Entrenadores
        </button>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-2 text-[0.82rem] text-[color:var(--rr-muted)]">
        <Link
          href={getPublicPath(team)}
          className="inline-flex items-center gap-2 transition hover:text-white"
        >
          <Eye className="h-3.5 w-3.5 text-[color:var(--rr-gold)]" />
          Ver publico
        </Link>

        <button
          type="button"
          onClick={() => onToggleVisibility(team.id)}
          className="inline-flex items-center gap-2 transition hover:text-white"
        >
          {team.publicVisible ? (
            <EyeOff className="h-3.5 w-3.5 text-[color:var(--rr-gold)]" />
          ) : (
            <Eye className="h-3.5 w-3.5 text-[color:var(--rr-gold)]" />
          )}
          {team.publicVisible ? "Ocultar de web" : "Mostrar en web"}
        </button>

        <button
          type="button"
          onClick={() => onToggleActive(team.id)}
          className="inline-flex items-center gap-2 transition hover:text-white"
        >
          {team.active ? (
            <ShieldOff className="h-3.5 w-3.5 text-[color:var(--rr-gold)]" />
          ) : (
            <ShieldCheck className="h-3.5 w-3.5 text-[color:var(--rr-gold)]" />
          )}
          {team.active ? "Pasar a inactivo" : "Reactivar"}
        </button>
      </div>
    </div>
  );
}

function TeamCoachSummary({
  team,
  role,
}: {
  team: TeamManagementTeam;
  role: AdminRole;
}) {
  return (
    <div className="space-y-1">
      <p>{team.responsibleCoachUser?.displayName ?? team.primaryCoach}</p>
      {role !== "COACH" ? (
        <p className="text-[0.88rem] text-[color:var(--rr-muted)]">
          {team.responsibleCoachUser
            ? "Cuenta responsable vinculada"
            : "Sin cuenta interna asignada"}
        </p>
      ) : (
        <p className="text-[0.88rem] text-[color:var(--rr-muted)]">
          Consulta de contexto. La estructura global no se edita desde aqui.
        </p>
      )}
      {team.visibleCoaches.length > 0 ? (
        <p className="text-[0.88rem] text-[color:var(--rr-muted)]">
          {team.visibleCoaches.length} visibles Â· {team.visibleCoaches.join(" Â· ")}
        </p>
      ) : null}
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
        <p className="text-[0.88rem] text-[color:var(--rr-muted)]">
          {team.category} Â· {team.season}
        </p>
        <p className="text-[0.82rem] text-[color:var(--rr-muted)]">/{team.slug}</p>
      </div>
    ),
    context: (
      <div className="space-y-1">
        <p>{team.competition}</p>
        <p className="text-[0.88rem] text-[color:var(--rr-muted)]">
          {team.playerCount} jugadores Â· {team.nextMatchLabel}
        </p>
      </div>
    ),
    state: (
      <div className="flex max-w-[16rem] flex-wrap gap-2">
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
    coaches: <TeamCoachSummary team={team} role={role} />,
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
            description={`${team.competition} Â· ${team.season}`}
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
                  <p className="text-white">
                    {team.responsibleCoachUser?.displayName ?? team.primaryCoach}
                  </p>
                  <p className="mt-1">{team.playerCount} jugadores Â· {team.nextMatchLabel}</p>
                  {team.visibleCoaches.length > 0 ? (
                    <p className="mt-2">{team.visibleCoaches.join(" Â· ")}</p>
                  ) : null}
                  {role === "COACH" ? (
                    <p className="mt-2">
                      No puedes editar estructura, visibilidad ni responsables desde esta vista.
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
          { key: "team", label: "Equipo" },
          { key: "context", label: "Contexto deportivo" },
          { key: "state", label: "Estado publico" },
          { key: "coaches", label: "Responsable" },
          { key: "actions", label: "Acciones" },
        ]}
        rows={rows}
      />
    </>
  );
}
