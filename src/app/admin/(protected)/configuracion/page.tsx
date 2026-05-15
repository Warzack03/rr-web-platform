import { AdminSectionPlaceholder } from "@/src/components/admin/admin-section-placeholder";
import { requireAdminSectionAccess } from "@/server/auth/session";

export default async function AdminSettingsPage() {
  await requireAdminSectionAccess("settings");

  return (
    <AdminSectionPlaceholder
      eyebrow="Configuracion"
      title="Configuracion general"
      description="Se preparara mas adelante cuando el resto de modulos base este estable."
    />
  );
}
