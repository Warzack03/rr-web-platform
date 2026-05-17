import { CalendarRange } from "lucide-react";
import { CTAButton } from "@/src/components/shared/cta-button";
import { AdminDataTable } from "@/src/components/admin/admin-data-table";
import { AdminPageHeader } from "@/src/components/admin/admin-page-header";
import { AdminPanel } from "@/src/components/admin/admin-panel";
import { adminSeasonRows } from "@/src/lib/admin-demo";
import { requireAdminSectionAccess } from "@/server/auth/session";

export default async function AdminSeasonsPage() {
  await requireAdminSectionAccess("seasons");

  return (
    <div className="space-y-8">
      <AdminPageHeader
        badge="Temporadas"
        title="Gestion de temporadas"
        description="Base visual para activar una temporada, revisar equipos vinculados y conservar historico."
        action={
          <CTAButton href="/admin/temporadas">
            <CalendarRange className="h-4 w-4" />
            Nueva temporada
          </CTAButton>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <AdminPanel title="Temporadas registradas">
          <AdminDataTable
            columns={[
              { key: "season", label: "Temporada" },
              { key: "status", label: "Estado" },
              { key: "teams", label: "Equipos" },
              { key: "summary", label: "Resumen" },
            ]}
            rows={adminSeasonRows}
          />
        </AdminPanel>

        <AdminPanel title="Notas de operacion">
          <div className="space-y-3">
            {[
              "Una temporada se marca activa antes de publicar contenidos.",
              "Las temporadas anteriores quedan accesibles como historico.",
              "La parte funcional real llegara en la fase de CRUD.",
            ].map((note) => (
              <div
                key={note}
                className="rounded-[18px] border border-[var(--rr-border)] bg-[rgba(8,20,38,0.5)] px-4 py-4 text-sm leading-6 text-[var(--rr-text-muted)]"
              >
                {note}
              </div>
            ))}
          </div>
        </AdminPanel>
      </div>
    </div>
  );
}
