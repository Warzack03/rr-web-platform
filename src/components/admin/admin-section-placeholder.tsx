import { AdminPageHeader } from "@/src/components/admin/admin-page-header";
import { AdminPanel } from "@/src/components/admin/admin-panel";

type AdminSectionPlaceholderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function AdminSectionPlaceholder({
  eyebrow,
  title,
  description,
}: AdminSectionPlaceholderProps) {
  return (
    <div className="space-y-8">
      <AdminPageHeader badge={eyebrow} title={title} description={description} />
      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <AdminPanel title="Vista preparada">
          <div className="space-y-4 text-[var(--rr-text-muted)]">
            <p>La estructura ya adopta el nuevo layout del backoffice y queda lista para la fase funcional.</p>
            <div className="grid gap-4 sm:grid-cols-3">
              {["Filtros", "Listado", "Acciones"].map((item) => (
                <div
                  key={item}
                  className="rounded-[18px] border border-dashed border-[var(--rr-border)] bg-white/5 px-4 py-5 text-center text-sm font-semibold uppercase tracking-[0.16em] text-[var(--rr-text-soft)]"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </AdminPanel>
        <AdminPanel title="Estado">
          <p className="text-base leading-7 text-[var(--rr-text-muted)]">
            No se implementa CRUD real en esta iteracion. Se prioriza disposicion, jerarquia y separacion correcta de pantallas.
          </p>
        </AdminPanel>
      </div>
    </div>
  );
}
