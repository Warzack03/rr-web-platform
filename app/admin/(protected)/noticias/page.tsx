import { SectionPlaceholder } from "@/components/admin/section-placeholder";
import { requireAdminSectionAccess } from "@/server/auth/session";

export default async function AdminNewsPage() {
  await requireAdminSectionAccess("news");

  return (
    <SectionPlaceholder
      eyebrow="Noticias"
      title="Gestion editorial"
      description="La seccion de noticias queda protegida para `superadmin` y `manager`, alineada con el workflow draft/published del MVP."
    />
  );
}
