import { AdminSectionPlaceholder } from "@/src/components/admin/admin-section-placeholder";
import { requireAdminSectionAccess } from "@/server/auth/session";

export default async function AdminUsersPage() {
  await requireAdminSectionAccess("users");

  return (
    <AdminSectionPlaceholder
      eyebrow="Usuarios"
      title="Usuarios y permisos"
      description="Se conserva la proteccion por roles, pero la gestion funcional queda pendiente."
    />
  );
}
