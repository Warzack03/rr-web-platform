import { Upload } from "lucide-react";
import { CTAButton } from "@/src/components/shared/cta-button";
import { AdminDataTable } from "@/src/components/admin/admin-data-table";
import { AdminPageHeader } from "@/src/components/admin/admin-page-header";
import { AdminPanel } from "@/src/components/admin/admin-panel";
import { getScopedImportRows } from "@/src/lib/admin-demo";
import { requireAdminSectionAccess } from "@/server/auth/session";

export default async function AdminImportsPage() {
  const user = await requireAdminSectionAccess("imports");
  const rows = getScopedImportRows(user.role);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        badge="Importaciones"
        title="Importaciones rr-management"
        description="Pantalla preparada para diffs, validacion y aplicacion controlada de snapshots."
        action={
          <CTAButton href="/admin/importaciones">
            <Upload className="h-4 w-4" />
            Nueva importacion
          </CTAButton>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <AdminPanel title="Procesos recientes">
          <AdminDataTable
            columns={[
              { key: "fileName", label: "Archivo" },
              { key: "entity", label: "Entidad" },
              { key: "status", label: "Estado" },
              { key: "owner", label: "Responsable" },
              { key: "updatedAt", label: "Fecha" },
              { key: "summary", label: "Resumen" },
            ]}
            rows={rows}
          />
        </AdminPanel>

        <AdminPanel title="Flujo futuro">
          <div className="space-y-3">
            {[
              "1. Subida de snapshot CSV o ZIP",
              "2. Validacion tecnica de columnas",
              "3. Diff visual antes de aplicar",
              "4. Merge controlado sin borrado destructivo",
            ].map((step) => (
              <div
                key={step}
                className="rounded-[18px] border border-[var(--rr-border)] bg-[rgba(8,20,38,0.5)] px-4 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-white"
              >
                {step}
              </div>
            ))}
          </div>
        </AdminPanel>
      </div>
    </div>
  );
}
