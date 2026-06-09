import { AdminSectionOverview } from "@/components/admin/admin-section-overview";
import { isAdminRole, type AdminRole } from "@/lib/admin/roles";
import { requireAdminSectionAccess } from "@/server/auth/session";

function getActualRole(role: string): AdminRole {
  return isAdminRole(role) ? role : "COACH";
}

export default async function AdminPlayersPage() {
  const user = await requireAdminSectionAccess("players");
  return <AdminSectionOverview section="jugadores" role={getActualRole(user.role)} />;
}
