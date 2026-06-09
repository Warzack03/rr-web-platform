import { AdminSectionOverview } from "@/components/admin/admin-section-overview";
import { isAdminRole, type AdminRole } from "@/lib/admin/roles";
import { requireAdminSectionAccess } from "@/server/auth/session";

function getActualRole(role: string): AdminRole {
  return isAdminRole(role) ? role : "COACH";
}

export default async function AdminNewsPage() {
  const user = await requireAdminSectionAccess("news");
  return <AdminSectionOverview section="noticias" role={getActualRole(user.role)} />;
}
