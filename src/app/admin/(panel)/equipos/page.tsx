import Link from "next/link";
import { Eye, Pencil, UsersRound } from "lucide-react";
import { AdminListCard } from "@/components/admin/admin-list-card";
import { AdminMetricCard } from "@/components/admin/admin-metric-card";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPanel } from "@/components/admin/admin-panel";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { AdminTable } from "@/components/admin/admin-table";
import { getTeamsForRole } from "@/lib/admin/mock-data";
import { isAdminRole, type AdminRole } from "@/lib/admin/roles";
import { requireAdminSectionAccess } from "@/server/auth/session";

function getActualRole(role: string): AdminRole {
  return isAdminRole(role) ? role : "COACH";
}

function TeamActions({ role, teamSlug }: { role: AdminRole; teamSlug: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href={`/admin/equipos?team=${teamSlug}&view=detalle`}
        className="inline-flex min-h-9 items-center gap-2 rounded-[8px] border border-white/10 px-3 text-[0.85rem] text-[color:var(--rr-muted)] transition hover:text-white"
      >
        <Eye className="h-3.5 w-3.5 text-[color:var(--rr-gold)]" />
        Ver
      </Link>
      {role !== "COACH" ? (
        <>
          <Link
            href={`/admin/equipos?team=${teamSlug}&view=editar`}
            className="inline-flex min-h-9 items-center gap-2 rounded-[8px] border border-[rgba(253,203,88,0.22)] px-3 text-[0.85rem] text-white transition hover:bg-[rgba(253,203,88,0.08)]"
          >
            <Pencil className="h-3.5 w-3.5 text-[color:var(--rr-gold)]" />
            Editar
          </Link>
          <Link
            href={`/admin/equipos?team=${teamSlug}&view=coaches`}
            className="inline-flex min-h-9 items-center gap-2 rounded-[8px] border border-white/10 px-3 text-[0.85rem] text-[color:var(--rr-muted)] transition hover:text-white"
          >
            <UsersRound className="h-3.5 w-3.5 text-[color:var(--rr-gold)]" />
            Entrenadores
          </Link>
        </>
      ) : null}
    </div>
  );
}

export default async function AdminTeamsPage() {
  const user = await requireAdminSectionAccess("teams");
  const actualRole = getActualRole(user.role);
  const teams = getTeamsForRole(actualRole);
  const visibleCount = teams.filter((team) => team.visible).length;
  const firstTeamCount = teams.filter((team) => team.firstTeam).length;

  const tableRows = teams.map((team) => ({
    team: (
      <div className="space-y-1">
        <p className="font-semibold text-white">{team.name}</p>
        <p className="text-[0.9rem] text-[color:var(--rr-muted)]">{team.nextMatchLabel}</p>
      </div>
    ),
    category: (
      <div className="space-y-1">
        <p>{team.category}</p>
        <p className="text-[0.9rem] text-[color:var(--rr-muted)]">{team.season}</p>
      </div>
    ),
    competition: team.competition,
    visibility: (
      <AdminStatusBadge label={team.visible ? "Visible" : "Oculto"} tone={team.visible ? "gold" : "slate"} />
    ),
    state: <AdminStatusBadge label={team.active ? "Activo" : "Inactivo"} tone={team.active ? "success" : "danger"} />,
    coaches: (
      <div className="space-y-1">
        <p>{team.primaryCoach}</p>
        <p className="text-[0.9rem] text-[color:var(--rr-muted)]">
          {team.visibleCoaches.length} visibles
        </p>
      </div>
    ),
    actions: <TeamActions role={actualRole} teamSlug={team.slug} />,
  }));

  return (
    <div className="space-y-6 lg:space-y-8">
      <AdminPageHeader
        eyebrow="Equipos publicos"
        title={actualRole === "COACH" ? "Tu equipo asignado" : "Equipos"}
        description="Listado mock con filtros base, estado publico y acciones preparadas para futuras pantallas de detalle y edicion."
        actions={
          actualRole !== "COACH" ? (
            <Link href="/admin/equipos?nuevo=1" className="rr-button rr-button-primary text-[0.84rem]">
              Nuevo equipo
            </Link>
          ) : undefined
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <AdminMetricCard label="Equipos visibles" value={visibleCount.toString()} detail="Listos para web publica" tone="gold" />
        <AdminMetricCard label="Primer Equipo" value={firstTeamCount.toString()} detail="Con tratamiento premium" tone="blue" />
        <AdminMetricCard label="Categorias" value={new Set(teams.map((team) => team.category)).size.toString()} detail="Senior, juvenil, cadete e infantil" tone="slate" />
      </div>

      <AdminPanel className="p-5 sm:p-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <label className="grid gap-2">
            <span className="rr-kicker text-[0.74rem] text-[color:var(--rr-muted)]">Temporada</span>
            <select className="min-h-11 rounded-[8px] border border-[color:var(--rr-border)] bg-[rgba(7,19,34,0.92)] px-3 text-white">
              <option>2026/2027</option>
              <option>2025/2026</option>
            </select>
          </label>
          <label className="grid gap-2">
            <span className="rr-kicker text-[0.74rem] text-[color:var(--rr-muted)]">Categoria</span>
            <select className="min-h-11 rounded-[8px] border border-[color:var(--rr-border)] bg-[rgba(7,19,34,0.92)] px-3 text-white">
              <option>Todas</option>
              <option>Senior</option>
              <option>Juvenil</option>
              <option>Cadete</option>
              <option>Infantil</option>
            </select>
          </label>
          <label className="grid gap-2">
            <span className="rr-kicker text-[0.74rem] text-[color:var(--rr-muted)]">Visible</span>
            <select className="min-h-11 rounded-[8px] border border-[color:var(--rr-border)] bg-[rgba(7,19,34,0.92)] px-3 text-white">
              <option>Todos</option>
              <option>Solo visibles</option>
              <option>Solo ocultos</option>
            </select>
          </label>
          <label className="grid gap-2">
            <span className="rr-kicker text-[0.74rem] text-[color:var(--rr-muted)]">Activo</span>
            <select className="min-h-11 rounded-[8px] border border-[color:var(--rr-border)] bg-[rgba(7,19,34,0.92)] px-3 text-white">
              <option>Todos</option>
              <option>Activos</option>
              <option>Inactivos</option>
            </select>
          </label>
        </div>
      </AdminPanel>

      <div className="grid gap-3 lg:hidden">
        {teams.map((team) => (
          <AdminListCard
            key={team.slug}
            eyebrow={team.category}
            title={team.name}
            description={team.competition}
            meta={
              <>
                <AdminStatusBadge label={team.visible ? "Visible" : "Oculto"} tone={team.visible ? "gold" : "slate"} />
                <AdminStatusBadge label={team.active ? "Activo" : "Inactivo"} tone={team.active ? "success" : "danger"} />
              </>
            }
            footer={<TeamActions role={actualRole} teamSlug={team.slug} />}
          />
        ))}
      </div>

      <AdminTable
        columns={[
          { key: "team", label: "Equipo" },
          { key: "category", label: "Categoria" },
          { key: "competition", label: "Competicion" },
          { key: "visibility", label: "Visible" },
          { key: "state", label: "Activo" },
          { key: "coaches", label: "Entrenadores" },
          { key: "actions", label: "Acciones" },
        ]}
        rows={tableRows}
      />
    </div>
  );
}
