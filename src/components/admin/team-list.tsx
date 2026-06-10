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
      <div className="flex flex-wrap gap-2">
        <Link
          href={`/admin/partidos?team=${team.slug}`}
          className="inline-flex min-h-9 items-center gap-2 rounded-[8px] border border-[rgba(253,203,88,0.22)] px-3 text-[0.82rem] text-white transition hover:bg-[rgba(253,203,88,0.08)]"
        >
          <ShieldCheck className="h-3.5 w-3.5 text-[color:var(--rr-gold)]" />
          Ir a mi equipo
        </Link>
        <Link
          href={getPublicPath(team)}
          className="inline-flex min-h-9 items-center gap-2 rounded-[8px] border border-white/10 px-3 text-[0.82rem] text-[color:var(--rr-muted)] transition hover:text-white"
        >
          <Eye className="h-3.5 w-3.5 text-[color:var(--rr-gold)]" />
          Ver publico
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href={getPublicPath(team)}
        className="inline-flex min-h-9 items-center gap-2 rounded-[8px] border border-white/10 px-3 text-[0.82rem] text-[color:var(--rr-muted)] transition hover:text-white"
      >
        <Eye className="h-3.5 w-3.5 text-[color:var(--rr-gold)]" />
        Ver publico
      </Link>

      <button
        type="button"
        onClick={() => onEdit(team)}
        className="inline-flex min-h-9 items-center gap-2 rounded-[8px] border border-[rgba(253,203,88,0.22)] px-3 text-[0.82rem] text-white transition hover:bg-[rgba(253,203,88,0.08)]"
      >
        <Pencil className="h-3.5 w-3.5 text-[color:var(--rr-gold)]" />
        Editar
      </button>

      <button
        type="button"
        onClick={() => onManageCoaches(team)}
        className="inline-flex min-h-9 items-center gap-2 rounded-[8px] border border-white/10 px-3 text-[0.82rem] text-[color:var(--rr-muted)] transition hover:text-white"
      >
        <UsersRound className="h-3.5 w-3.5 text-[color:var(--rr-gold)]" />
        Entrenadores
      </button>

      <button
        type="button"
        onClick={() => onToggleActive(team.id)}
        className="inline-flex min-h-9 items-center gap-2 rounded-[8px] border border-white/10 px-3 text-[0.82rem] text-[color:var(--rr-muted)] transition hover:text-white"
      >
        {team.active ? (
          <ShieldOff className="h-3.5 w-3.5 text-[color:var(--rr-gold)]" />
        ) : (
          <ShieldCheck className="h-3.5 w-3.5 text-[color:var(--rr-gold)]" />
        )}
        {team.active ? "Desactivar" : "Activar"}
      </button>

      <button
        type="button"
        onClick={() => onToggleVisibility(team.id)}
        className="inline-flex min-h-9 items-center gap-2 rounded-[8px] border border-white/10 px-3 text-[0.82rem] text-[color:var(--rr-muted)] transition hover:text-white"
      >
        {team.publicVisible ? (
          <EyeOff className="h-3.5 w-3.5 text-[color:var(--rr-gold)]" />
        ) : (
          <Eye className="h-3.5 w-3.5 text-[color:var(--rr-gold)]" />
        )}
        {team.publicVisible ? "Ocultar" : "Publicar"}
      </button>
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
          /{team.slug} · Orden {team.displayOrder}
        </p>
      </div>
    ),
    category: (
      <div className="space-y-1">
        <p>{team.category}</p>
        <p className="text-[0.88rem] text-[color:var(--rr-muted)]">{team.branch}</p>
      </div>
    ),
    competition: (
      <div className="space-y-1">
        <p>{team.competition}</p>
        <p className="text-[0.88rem] text-[color:var(--rr-muted)]">{team.nextMatchLabel}</p>
      </div>
    ),
    season: team.season,
    visible: <TeamVisibilityBadge publicVisible={team.publicVisible} />,
    active: (
      <AdminStatusBadge
        label={team.active ? "Activo" : "Inactivo"}
        tone={team.active ? "success" : "danger"}
      />
    ),
    firstTeam: team.isFirstTeam ? (
      <AdminStatusBadge label="Primer Equipo" tone="blue" />
    ) : (
      <AdminStatusBadge label="Cantera" tone="slate" />
    ),
    coaches: (
      <div className="space-y-1">
        <p>{team.coaches.filter((coach) => coach.publicVisible).length} visibles</p>
        <p className="text-[0.88rem] text-[color:var(--rr-muted)]">
          Resp. {team.responsibleCoachUser?.username ?? "sin cuenta"}
        </p>
      </div>
    ),
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
            description={`${team.competition} · ${team.season}`}
            meta={
              <>
                <TeamVisibilityBadge publicVisible={team.publicVisible} />
                <AdminStatusBadge
                  label={team.active ? "Activo" : "Inactivo"}
                  tone={team.active ? "success" : "danger"}
                />
                {team.isFirstTeam ? <AdminStatusBadge label="Primer Equipo" tone="blue" /> : null}
              </>
            }
            footer={
              <div className="space-y-4">
                <div className="grid gap-3 rounded-[10px] border border-white/8 bg-white/4 p-3 text-[0.9rem] text-[color:var(--rr-muted)]">
                  <p>Slug: /{team.slug}</p>
                  <p>Rama: {team.branch}</p>
                  <p>Entrenadores visibles: {team.visibleCoaches.join(" · ") || "Sin mostrar"}</p>
                  <p>Responsable: {team.responsibleCoachUser?.username ?? "Sin cuenta"}</p>
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
          { key: "category", label: "Categoria" },
          { key: "competition", label: "Competicion" },
          { key: "season", label: "Temporada" },
          { key: "visible", label: "Visible" },
          { key: "active", label: "Activo" },
          { key: "firstTeam", label: "Primer equipo" },
          { key: "coaches", label: "Entrenadores" },
          { key: "actions", label: "Acciones" },
        ]}
        rows={rows}
      />
    </>
  );
}
