import { Link2 } from "lucide-react";
import { CTAButton } from "@/src/components/shared/cta-button";
import { AdminDataTable } from "@/src/components/admin/admin-data-table";
import { AdminPageHeader } from "@/src/components/admin/admin-page-header";
import { AdminPanel } from "@/src/components/admin/admin-panel";
import { adminAssignmentRows } from "@/src/lib/admin-demo";
import { requireAdminSectionAccess } from "@/server/auth/session";

export default async function AdminAssignmentsPage() {
  await requireAdminSectionAccess("assignments");

  return (
    <div className="space-y-8">
      <AdminPageHeader
        badge="Asignaciones"
        title="Asignaciones de equipos"
        description="Vista base para relacionar entrenadores, equipos y temporada activa sin mezclar otros modulos."
        action={
          <CTAButton href="/admin/asignaciones">
            <Link2 className="h-4 w-4" />
            Nueva asignacion
          </CTAButton>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <AdminPanel title="Relaciones activas">
          <AdminDataTable
            columns={[
              { key: "coach", label: "Entrenador" },
              { key: "role", label: "Perfil" },
              { key: "team", label: "Equipo" },
              { key: "season", label: "Temporada" },
              { key: "status", label: "Estado" },
            ]}
            rows={adminAssignmentRows}
          />
        </AdminPanel>

        <AdminPanel title="Contexto">
          <div className="space-y-3">
            {[
              "Manager y superadmin pueden preparar asignaciones.",
              "El entrenador solo opera sobre equipos asignados.",
              "Puede existir coach publico sin cuenta interna.",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[18px] border border-[var(--rr-border)] bg-[rgba(8,20,38,0.5)] px-4 py-4 text-sm leading-6 text-[var(--rr-text-muted)]"
              >
                {item}
              </div>
            ))}
          </div>
        </AdminPanel>
      </div>
    </div>
  );
}
