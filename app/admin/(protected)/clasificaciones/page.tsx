import { SectionPlaceholder } from "@/components/admin/section-placeholder";
import { requireAdminSectionAccess } from "@/server/auth/session";

export default async function AdminStandingsPage() {
  await requireAdminSectionAccess("standings");

  return (
    <SectionPlaceholder
      eyebrow="Clasificaciones"
      title="Gestion manual de clasificaciones"
      description="El acceso queda preparado para los roles permitidos del MVP. La edicion manual de tablas se anadira sobre esta base protegida."
    />
  );
}
