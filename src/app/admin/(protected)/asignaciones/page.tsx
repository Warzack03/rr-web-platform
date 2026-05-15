import { AdminSectionPlaceholder } from "@/src/components/admin/admin-section-placeholder";
import { requireAdminSectionAccess } from "@/server/auth/session";

export default async function AdminAssignmentsPage() {
  await requireAdminSectionAccess("assignments");

  return (
    <AdminSectionPlaceholder
      eyebrow="Asignaciones"
      title="Asignaciones de jugadores y equipos"
      description="Ruta preparada para gestionar relaciones de temporada sin mezclarla con otros modulos."
    />
  );
}
