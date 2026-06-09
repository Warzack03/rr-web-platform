import { AdminSectionOverview } from "@/components/admin/admin-section-overview";
import { isAdminRole, type AdminRole } from "@/lib/admin/roles";
import { requireAdminSectionAccess } from "@/server/auth/session";

function getActualRole(role: string): AdminRole {
  return isAdminRole(role) ? role : "COACH";
}

export default async function AdminAssignmentsPage() {
  const user = await requireAdminSectionAccess("assignments");
  return <AdminSectionOverview section="asignaciones" role={getActualRole(user.role)} />;
}
