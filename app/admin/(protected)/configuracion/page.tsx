import { SectionPlaceholder } from "@/components/admin/section-placeholder";
import { requireAdminSectionAccess } from "@/server/auth/session";

export default async function AdminSettingsPage() {
  await requireAdminSectionAccess("settings");

  return (
    <SectionPlaceholder
      eyebrow="Configuracion"
      title="Configuracion general"
      description="La configuracion sensible sigue cerrada a `superadmin`. La autenticacion y el layout base ya dejan esta ruta lista sin abrir permisos de mas."
    />
  );
}
