import { ImagePlus } from "lucide-react";
import { CTAButton } from "@/src/components/shared/cta-button";
import { AdminDataTable } from "@/src/components/admin/admin-data-table";
import { AdminPageHeader } from "@/src/components/admin/admin-page-header";
import { AdminPanel } from "@/src/components/admin/admin-panel";
import { getScopedMediaRows } from "@/src/lib/admin-demo";
import { requireAdminSectionAccess } from "@/server/auth/session";

export default async function AdminMediaPage() {
  const user = await requireAdminSectionAccess("media");
  const rows = getScopedMediaRows(user.role);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        badge="Media"
        title="Biblioteca visual"
        description="Galeria y listado de imagenes, cromos, banners y recursos del club."
        action={
          <CTAButton href="/admin/media">
            <ImagePlus className="h-4 w-4" />
            Subir recurso
          </CTAButton>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <AdminPanel title="Galeria">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-2">
            {rows.map((item) => (
              <div
                key={item.id}
                className="rounded-[20px] border border-[var(--rr-border)] bg-[rgba(16,35,61,0.86)] p-4"
              >
                <div className="aspect-[4/3] rounded-[18px] border border-[var(--rr-border)] bg-[radial-gradient(circle_at_top,rgba(253,203,88,0.14),transparent_26%),rgba(8,20,38,0.7)]" />
                <p className="mt-4 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--rr-accent)]">
                  {item.type}
                </p>
                <h3 className="mt-2 font-display text-3xl uppercase text-white">{item.asset}</h3>
                <p className="mt-2 text-sm text-[var(--rr-text-muted)]">
                  {item.team} · {item.usage}
                </p>
              </div>
            ))}
          </div>
        </AdminPanel>

        <AdminPanel title="Listado tecnico">
          <AdminDataTable
            columns={[
              { key: "asset", label: "Asset" },
              { key: "type", label: "Tipo" },
              { key: "team", label: "Equipo" },
              { key: "status", label: "Estado" },
              { key: "updatedAt", label: "Actualizado" },
            ]}
            rows={rows}
          />
        </AdminPanel>
      </div>
    </div>
  );
}
