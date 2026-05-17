import { UserRole } from "@prisma/client";
import { BarChart3, Goal, HandHelping, Save } from "lucide-react";
import { CTAButton } from "@/src/components/shared/cta-button";
import { AdminDataTable } from "@/src/components/admin/admin-data-table";
import { AdminPageHeader } from "@/src/components/admin/admin-page-header";
import { AdminPanel } from "@/src/components/admin/admin-panel";
import { getAdminStatsRows } from "@/src/lib/admin-demo";
import { requireAdminSectionAccess } from "@/server/auth/session";

export default async function AdminStatsPage() {
  const user = await requireAdminSectionAccess("stats");
  const rows = getAdminStatsRows(user.role);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        badge="Estadisticas"
        title={user.role === UserRole.COACH ? "Estadisticas del equipo" : "Edicion de estadisticas"}
        description="Modulo pensado para introducir goles, asistencias y rendimiento sin depender todavia de logica real."
        action={
          <CTAButton href="/admin/estadisticas">
            <Save className="h-4 w-4" />
            Guardar borrador
          </CTAButton>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <AdminPanel title="Contexto de edicion">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["Equipo", user.role === UserRole.COACH ? "Raimon B" : "Selector abierto"],
              ["Partido", "Ultimo jugado"],
              ["Estado", "Borrador editable"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[18px] border border-[var(--rr-border)] bg-[rgba(8,20,38,0.5)] px-4 py-4">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--rr-text-soft)]">
                  {label}
                </p>
                <p className="mt-2 font-display text-3xl text-white">{value}</p>
              </div>
            ))}
          </div>
        </AdminPanel>

        <AdminPanel title="Acciones rapidas">
          <div className="grid gap-3">
            <div className="rounded-[18px] border border-[var(--rr-border)] bg-[rgba(8,20,38,0.5)] px-4 py-4 text-sm text-[var(--rr-text-muted)]">
              Prioriza una version simple y usable en movil para entrenador: goles, asistencias y
              contexto de partido.
            </div>
            <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
              {[
                { label: "Goles", icon: Goal },
                { label: "Asistencias", icon: HandHelping },
                { label: "Rating", icon: BarChart3 },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 rounded-[18px] border border-[var(--rr-border)] bg-[rgba(8,20,38,0.5)] px-4 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-white"
                  >
                    <Icon className="h-4 w-4 text-[var(--rr-accent)]" />
                    {item.label}
                  </div>
                );
              })}
            </div>
          </div>
        </AdminPanel>
      </div>

      <AdminPanel title="Registro por jugador">
        <AdminDataTable
          columns={[
            { key: "player", label: "Jugador" },
            { key: "team", label: "Equipo" },
            { key: "match", label: "Partido" },
            { key: "goals", label: "Goles" },
            { key: "assists", label: "Asist." },
            { key: "participation", label: "Gol+" },
            { key: "rating", label: "Rating" },
            { key: "status", label: "Estado" },
          ]}
          rows={rows}
        />
      </AdminPanel>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {rows.slice(0, 4).map((row) => (
          <div
            key={row.id}
            className="rounded-[20px] border border-[var(--rr-border)] bg-[rgba(16,35,61,0.86)] p-4"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--rr-accent)]">
              {row.team}
            </p>
            <h3 className="mt-2 font-display text-3xl uppercase text-white">{row.player}</h3>
            <p className="mt-2 text-sm text-[var(--rr-text-muted)]">{row.match}</p>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                ["G", row.goals],
                ["A", row.assists],
                ["R", row.rating],
              ].map(([label, value]) => (
                <div key={label} className="rounded-[16px] bg-black/15 px-3 py-3 text-center">
                  <p className="text-xs uppercase tracking-[0.14em] text-[var(--rr-text-soft)]">{label}</p>
                  <p className="mt-1 font-display text-2xl text-white">{value}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
