import { SectionPlaceholder } from "@/components/admin/section-placeholder";
import { requireAdminSectionAccess } from "@/server/auth/session";

export default async function AdminSeasonsPage() {
  await requireAdminSectionAccess("seasons");

  return (
    <SectionPlaceholder
      eyebrow="Temporadas"
      title="Gestion de temporadas"
      description="La seccion queda protegida para `superadmin` y `manager`, preparada para implementar el CRUD de temporadas en el siguiente paso."
    />
  );
}
