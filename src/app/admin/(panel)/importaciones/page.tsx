import { AdminSectionOverview } from "@/components/admin/admin-section-overview";
import { isAdminRole, type AdminRole } from "@/lib/admin/roles";
import { requireAdminSectionAccess } from "@/server/auth/session";

function getActualRole(role: string): AdminRole {
  return isAdminRole(role) ? role : "COACH";
}

export default async function AdminImportsPage() {
  const user = await requireAdminSectionAccess("imports");
  return <AdminSectionOverview section="importaciones" role={getActualRole(user.role)} />;
}
