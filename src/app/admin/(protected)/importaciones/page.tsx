import { AdminSectionPlaceholder } from "@/src/components/admin/admin-section-placeholder";
import { requireAdminSectionAccess } from "@/server/auth/session";

export default async function AdminImportsPage() {
  await requireAdminSectionAccess("imports");

  return (
    <AdminSectionPlaceholder
      eyebrow="Importaciones"
      title="Importaciones rr-management"
      description="No se implementa todavia el flujo de subida, validacion ni diff de cambios."
    />
  );
}
