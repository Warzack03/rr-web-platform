import { SectionPlaceholder } from "@/components/admin/section-placeholder";
import { requireAdminSectionAccess } from "@/server/auth/session";

export default async function AdminStatsPage() {
  await requireAdminSectionAccess("stats");

  return (
    <SectionPlaceholder
      eyebrow="Estadisticas"
      title="Gestion de estadisticas"
      description="La capa de permisos ya contempla el acceso de entrenadores solo sobre equipos asignados. El CRUD de estadisticas llegara despues."
    />
  );
}
