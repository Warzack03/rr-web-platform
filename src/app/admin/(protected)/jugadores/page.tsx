import { AdminSectionPlaceholder } from "@/src/components/admin/admin-section-placeholder";
import { requireAdminSectionAccess } from "@/server/auth/session";

export default async function AdminPlayersPage() {
  await requireAdminSectionAccess("players");

  return (
    <AdminSectionPlaceholder
      eyebrow="Jugadores"
      title="Gestion de jugadores"
      description="Queda pendiente conectar listados, filtros y permisos reales de edicion."
    />
  );
}
