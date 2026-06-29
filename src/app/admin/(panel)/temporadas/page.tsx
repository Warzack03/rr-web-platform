import { AdminSectionOverview } from "@/components/admin/admin-section-overview";
import { OWNER_ADMIN_ROLE } from "@/lib/admin/roles";
import { requireAdminSectionAccess } from "@/server/auth/session";

export default async function AdminSeasonsPage() {
  const user = await requireAdminSectionAccess("seasons");
  void user;
  return <AdminSectionOverview section="temporadas" role={OWNER_ADMIN_ROLE} />;
}
