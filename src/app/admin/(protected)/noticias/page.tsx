import { PenSquare, Star } from "lucide-react";
import { CTAButton } from "@/src/components/shared/cta-button";
import { AdminDataTable } from "@/src/components/admin/admin-data-table";
import { AdminPageHeader } from "@/src/components/admin/admin-page-header";
import { AdminPanel } from "@/src/components/admin/admin-panel";
import { adminNewsRows } from "@/src/lib/admin-demo";
import { requireAdminSectionAccess } from "@/server/auth/session";

export default async function AdminNewsPage() {
  await requireAdminSectionAccess("news");

  return (
    <div className="space-y-8">
      <AdminPageHeader
        badge="Noticias"
        title="Gestion editorial"
        description="Listado claro de publicadas, borradores y destacadas con enfoque deportivo y visual."
        action={
          <CTAButton href="/admin/noticias">
            <PenSquare className="h-4 w-4" />
            Nueva noticia
          </CTAButton>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <AdminPanel title="Listado editorial">
          <AdminDataTable
            columns={[
              { key: "title", label: "Titulo" },
              { key: "team", label: "Equipo" },
              { key: "status", label: "Estado" },
              { key: "featured", label: "Destacada" },
              { key: "date", label: "Fecha" },
              { key: "video", label: "Video" },
            ]}
            rows={adminNewsRows.map((item) => ({
              ...item,
              featured: item.featured ? "Si" : "No",
            }))}
          />
        </AdminPanel>

        <AdminPanel title="Resumen editorial">
          <div className="grid gap-3">
            {[
              ["Publicadas", `${adminNewsRows.filter((item) => item.status === "Publicada").length}`],
              ["Borradores", `${adminNewsRows.filter((item) => item.status === "Borrador").length}`],
              ["Destacadas", `${adminNewsRows.filter((item) => item.featured).length}`],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[18px] border border-[var(--rr-border)] bg-[rgba(8,20,38,0.5)] px-4 py-4">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--rr-accent)]">
                  {label}
                </p>
                <p className="mt-2 font-display text-4xl text-white">{value}</p>
              </div>
            ))}
            <div className="rounded-[18px] border border-[var(--rr-border)] bg-[rgba(8,20,38,0.5)] px-4 py-4 text-sm text-[var(--rr-text-muted)]">
              Las noticias mantienen resumen, equipo relacionado, estado y video externo opcional.
            </div>
          </div>
        </AdminPanel>
      </div>

      <AdminPanel title="Bloques destacados">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {adminNewsRows
            .filter((item) => item.featured)
            .slice(0, 3)
            .map((item) => (
              <div
                key={item.id}
                className="rounded-[20px] border border-[var(--rr-border)] bg-[rgba(16,35,61,0.86)] p-4"
              >
                <div className="flex items-center gap-3">
                  <Star className="h-4 w-4 text-[var(--rr-accent)]" />
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--rr-accent)]">
                    {item.team}
                  </p>
                </div>
                <h3 className="mt-3 font-display text-3xl uppercase text-white">{item.title}</h3>
                <p className="mt-3 text-sm text-[var(--rr-text-muted)]">
                  {item.status} · {item.date}
                </p>
              </div>
            ))}
        </div>
      </AdminPanel>
    </div>
  );
}
