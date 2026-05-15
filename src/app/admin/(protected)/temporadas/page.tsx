import { AdminSectionPlaceholder } from "@/src/components/admin/admin-section-placeholder";
import { requireAdminSectionAccess } from "@/server/auth/session";

export default async function AdminSeasonsPage() {
  await requireAdminSectionAccess("seasons");

  return (
    <AdminSectionPlaceholder
      eyebrow="Temporadas"
      title="Gestion de temporadas"
      description="La base visual ya esta preparada; la parte funcional se implementara en la siguiente fase."
    />
  );
}
