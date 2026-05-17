import { UserRole } from "@prisma/client";
import { CirclePlus, Filter, LayoutGrid } from "lucide-react";
import { CTAButton } from "@/src/components/shared/cta-button";
import { AdminActionCard } from "@/src/components/admin/admin-action-card";
import { AdminDataTable } from "@/src/components/admin/admin-data-table";
import { AdminPageHeader } from "@/src/components/admin/admin-page-header";
import { AdminPanel } from "@/src/components/admin/admin-panel";
import { AdminSummaryCard } from "@/src/components/admin/admin-summary-card";
import { publicTeams } from "@/src/lib/demo-data";
import { requireAdminSectionAccess } from "@/server/auth/session";

export default async function AdminTeamsPage() {
  const user = await requireAdminSectionAccess("teams");
  const visibleTeams =
    user.role === UserRole.COACH
      ? publicTeams.filter((team) => team.slug === "raimon-b")
      : publicTeams;

  const rows = visibleTeams.map((team) => ({
    id: team.slug,
    name: team.name,
    category: team.category,
    competition: team.competition,
    season: team.season,
    visible: team.slug !== "juvenil-a",
    active: true,
    firstTeam: team.isFirstTeam ? "Si" : "No",
  }));

  return (
    <div className="space-y-8">
      <AdminPageHeader
        badge="Equipos"
        title="Gestion de equipos"
        description="Vista deportiva con jerarquia clara, filtros visibles y acceso rapido a configuracion por equipo."
        action={
          user.role === UserRole.COACH ? null : (
            <CTAButton href="/admin/equipos">
              <CirclePlus className="h-4 w-4" />
              Crear equipo
            </CTAButton>
          )
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <AdminSummaryCard title="Equipos visibles" value={`${visibleTeams.length}`} helper="Temporada activa" />
        <AdminSummaryCard
          title="Primer Equipo"
          value={visibleTeams.some((team) => team.isFirstTeam) ? "1" : "0"}
          helper="Ruta premium"
          accent="light"
        />
        <AdminSummaryCard
          title="Categorias"
          value={`${new Set(visibleTeams.map((team) => team.category)).size}`}
          helper="Bloques deportivos"
        />
      </div>

      <AdminPanel>
        <div className="grid gap-4 lg:grid-cols-[1fr_1fr_1fr_auto]">
          {[
            ["Temporada", "2026/27"],
            ["Categoria", user.role === UserRole.COACH ? "Asignadas" : "Todas"],
            ["Estado", "Activo + visibles"],
          ].map(([label, value]) => (
            <div key={label} className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--rr-text-soft)]">
                {label}
              </p>
              <div className="rounded-[16px] border border-[var(--rr-border)] bg-[rgba(30,32,32,0.64)] px-4 py-4 text-base text-white">
                {value}
              </div>
            </div>
          ))}
          <div className="flex items-end">
            <button
              type="button"
              className="inline-flex w-full items-center justify-center gap-2 rounded-[16px] border border-[var(--rr-border-strong)] px-5 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--rr-accent)] lg:w-auto"
            >
              <Filter className="h-4 w-4" />
              Filtrar
            </button>
          </div>
        </div>
      </AdminPanel>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <AdminPanel title="Listado de equipos">
          <AdminDataTable
            columns={[
              { key: "name", label: "Equipo" },
              { key: "category", label: "Categoria" },
              { key: "competition", label: "Competicion" },
              { key: "season", label: "Temporada" },
              { key: "visible", label: "Visible" },
              { key: "active", label: "Activo" },
              { key: "firstTeam", label: "Primer equipo" },
            ]}
            rows={rows}
          />
          <p className="mt-5 text-sm text-[var(--rr-text-soft)]">
            Mostrando {visibleTeams.length} equipos en esta vista.
          </p>
        </AdminPanel>

        <AdminPanel title={user.role === UserRole.COACH ? "Mi equipo" : "Acciones por bloque"}>
          <div className="grid gap-3">
            {user.role === UserRole.COACH ? (
              <AdminActionCard
                href="/admin/partidos"
                title="Actualizar Raimon B"
                description="Modificar proximo partido, resultado y clasificacion del equipo asignado."
              />
            ) : (
              <>
                <AdminActionCard
                  href="/admin/jugadores"
                  title="Revisar plantilla"
                  description="Acceder a jugadores, dorsales y posicion por equipo."
                />
                <AdminActionCard
                  href="/admin/partidos"
                  title="Ajustar calendario"
                  description="Corregir estados de partido y proximas jornadas."
                />
                <AdminActionCard
                  href="/admin/clasificaciones"
                  title="Editar clasificaciones"
                  description="Actualizar puntos y posiciones manuales."
                />
              </>
            )}
          </div>
        </AdminPanel>
      </div>

      <AdminPanel title="Tarjetas rapidas de equipo">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {visibleTeams.map((team) => (
            <div
              key={team.slug}
              className="rounded-[20px] border border-[var(--rr-border)] bg-[rgba(8,20,38,0.52)] p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--rr-accent)]">
                    {team.category}
                  </p>
                  <h3 className="mt-2 font-display text-3xl uppercase text-white">{team.name}</h3>
                </div>
                <LayoutGrid className="h-5 w-5 text-[var(--rr-text-soft)]" />
              </div>
              <p className="mt-3 text-sm leading-6 text-[var(--rr-text-muted)]">{team.competition}</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-[16px] bg-black/15 px-3 py-3">
                  <p className="text-xs uppercase tracking-[0.14em] text-[var(--rr-text-soft)]">Coach</p>
                  <p className="mt-1 text-sm text-white">{team.coach}</p>
                </div>
                <div className="rounded-[16px] bg-black/15 px-3 py-3">
                  <p className="text-xs uppercase tracking-[0.14em] text-[var(--rr-text-soft)]">Pos.</p>
                  <p className="mt-1 text-sm text-white">{team.position}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </AdminPanel>
    </div>
  );
}
