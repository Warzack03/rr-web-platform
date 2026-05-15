import { AdminSectionPlaceholder } from "@/src/components/admin/admin-section-placeholder";
import { requireAdminSectionAccess } from "@/server/auth/session";

export default async function AdminStandingsPage() {
  await requireAdminSectionAccess("standings");

  return (
    <AdminSectionPlaceholder
      eyebrow="Clasificaciones"
      title="Clasificaciones manuales"
      description="Se implementara mas adelante con formularios y validacion sobre datos reales."
    />
  );
}
