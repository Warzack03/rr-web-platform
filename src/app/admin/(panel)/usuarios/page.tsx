import { AdminSectionOverview } from "@/components/admin/admin-section-overview";
import { OWNER_ADMIN_ROLE } from "@/lib/admin/roles";
import { requireAdminSectionAccess } from "@/server/auth/session";

export default async function AdminUsersPage() {
  const user = await requireAdminSectionAccess("users");
  void user;
  return <AdminSectionOverview section="usuarios" role={OWNER_ADMIN_ROLE} />;
}
