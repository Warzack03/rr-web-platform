import { AdminSectionOverview } from "@/components/admin/admin-section-overview";
import { isAdminRole, type AdminRole } from "@/lib/admin/roles";
import { requireAdminSectionAccess } from "@/server/auth/session";

function getActualRole(role: string): AdminRole {
  return isAdminRole(role) ? role : "COACH";
}

export default async function AdminUsersPage() {
  const user = await requireAdminSectionAccess("users");
  return <AdminSectionOverview section="usuarios" role={getActualRole(user.role)} />;
}
