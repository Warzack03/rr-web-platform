import { AdminSectionOverview } from "@/components/admin/admin-section-overview";
import { isAdminRole, type AdminRole } from "@/lib/admin/roles";
import { requireAdminSectionAccess } from "@/server/auth/session";

function getActualRole(role: string): AdminRole {
  return isAdminRole(role) ? role : "COACH";
}

export default async function AdminMediaPage() {
  const user = await requireAdminSectionAccess("media");
  return <AdminSectionOverview section="media" role={getActualRole(user.role)} />;
}
