import { SectionPlaceholder } from "@/components/admin/section-placeholder";
import { requireAdminSectionAccess } from "@/server/auth/session";

export default async function AdminUsersPage() {
  await requireAdminSectionAccess("users");

  return (
    <SectionPlaceholder
      eyebrow="Usuarios"
      title="Gestion de usuarios y permisos"
      description="La gestion de cuentas internas queda reservada a `superadmin`. Esta pagina es el punto de entrada protegido para implementarla sin mezclarla con el login."
    />
  );
}
