import { AdminSectionPlaceholder } from "@/src/components/admin/admin-section-placeholder";
import { requireAdminSectionAccess } from "@/server/auth/session";

export default async function AdminMediaPage() {
  await requireAdminSectionAccess("media");

  return (
    <AdminSectionPlaceholder
      eyebrow="Media"
      title="Biblioteca de media"
      description="Espacio reservado para logos, fotos, banners y assets publicos del club."
    />
  );
}
