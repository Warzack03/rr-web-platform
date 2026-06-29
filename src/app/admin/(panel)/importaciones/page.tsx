import { AdminSectionOverview } from "@/components/admin/admin-section-overview";
import { OWNER_ADMIN_ROLE } from "@/lib/admin/roles";
import { requireAdminSectionAccess } from "@/server/auth/session";

export default async function AdminImportsPage() {
  const user = await requireAdminSectionAccess("imports");
  void user;
  return <AdminSectionOverview section="importaciones" role={OWNER_ADMIN_ROLE} />;
}
