import { AdminSectionPlaceholder } from "@/src/components/admin/admin-section-placeholder";
import { requireAdminSectionAccess } from "@/server/auth/session";

export default async function AdminMatchesPage() {
  await requireAdminSectionAccess("matches");

  return (
    <AdminSectionPlaceholder
      eyebrow="Partidos"
      title="Partidos y resultados"
      description="En esta fase solo dejamos lista la carcasa visual del modulo."
    />
  );
}
