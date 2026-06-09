import { AdminSectionOverview } from "@/components/admin/admin-section-overview";
import { isAdminRole, type AdminRole } from "@/lib/admin/roles";
import { requireAdminSectionAccess } from "@/server/auth/session";

function getActualRole(role: string): AdminRole {
  return isAdminRole(role) ? role : "COACH";
}

export default async function AdminStandingsPage() {
  const user = await requireAdminSectionAccess("standings");
  return <AdminSectionOverview section="clasificaciones" role={getActualRole(user.role)} />;
}
