import { AdminSectionPlaceholder } from "@/src/components/admin/admin-section-placeholder";
import { requireAdminSectionAccess } from "@/server/auth/session";

export default async function AdminStatsPage() {
  await requireAdminSectionAccess("stats");

  return (
    <AdminSectionPlaceholder
      eyebrow="Estadisticas"
      title="Estadisticas del equipo"
      description="La capa visual ya contempla este modulo, pero no hay edicion funcional todavia."
    />
  );
}
