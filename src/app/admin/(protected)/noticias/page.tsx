import { AdminSectionPlaceholder } from "@/src/components/admin/admin-section-placeholder";
import { requireAdminSectionAccess } from "@/server/auth/session";

export default async function AdminNewsPage() {
  await requireAdminSectionAccess("news");

  return (
    <AdminSectionPlaceholder
      eyebrow="Noticias"
      title="Gestion editorial"
      description="La estructura visual queda lista para el futuro workflow de borrador y publicacion."
    />
  );
}
