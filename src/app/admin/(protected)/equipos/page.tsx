import { UserRole } from "@prisma/client";
import { CirclePlus, Filter } from "lucide-react";
import { CTAButton } from "@/src/components/shared/cta-button";
import { AdminDataTable } from "@/src/components/admin/admin-data-table";
import { AdminPageHeader } from "@/src/components/admin/admin-page-header";
import { AdminPanel } from "@/src/components/admin/admin-panel";
import { adminTeamRows } from "@/src/lib/demo-data";
import { requireAdminSectionAccess } from "@/server/auth/session";

export default async function AdminTeamsPage() {
  const user = await requireAdminSectionAccess("teams");

  const visibleRows =
    user.role === UserRole.COACH
      ? adminTeamRows.filter((team) => team.id === "raimon-b")
      : adminTeamRows;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        badge="Equipos"
        title="Gestion de equipos"
        description="Pantalla rehecha para parecerse mucho mas a la referencia de gestion, con filtros, tabla clara y acciones preparadas."
        action={
          user.role === UserRole.COACH ? null : (
            <CTAButton href="/admin/equipos">
              <CirclePlus className="h-4 w-4" />
              Crear nuevo equipo
            </CTAButton>
          )
        }
      />

      <AdminPanel>
        <div className="grid gap-4 xl:grid-cols-[1fr_1fr_1fr_auto]">
          {[
            ["Temporada", "2026/2027"],
            ["Categoria", user.role === UserRole.COACH ? "Asignadas" : "Todas"],
            ["Estado", "Todos"],
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
              className="inline-flex items-center gap-2 rounded-[16px] border border-[var(--rr-border-strong)] px-5 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--rr-accent)]"
            >
              <Filter className="h-4 w-4" />
              Filtrar
            </button>
          </div>
        </div>
      </AdminPanel>

      <AdminPanel>
        <AdminDataTable
          columns={[
            { key: "name", label: "Equipo" },
            { key: "category", label: "Categoria" },
            { key: "competition", label: "Competicion" },
            { key: "season", label: "Temporada" },
            { key: "visible", label: "Visible" },
            { key: "active", label: "Activo" },
            { key: "isFirstTeam", label: "Primer Equipo" },
          ]}
          rows={visibleRows}
        />
        <p className="mt-5 text-sm text-[var(--rr-text-soft)]">
          Mostrando {visibleRows.length} de {adminTeamRows.length} equipos.
        </p>
      </AdminPanel>
    </div>
  );
}
