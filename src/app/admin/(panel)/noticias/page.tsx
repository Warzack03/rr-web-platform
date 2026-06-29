import { AdminSectionOverview } from "@/components/admin/admin-section-overview";
import { OWNER_ADMIN_ROLE } from "@/lib/admin/roles";
import { requireAdminSectionAccess } from "@/server/auth/session";

export default async function AdminNewsPage() {
  const user = await requireAdminSectionAccess("news");
  void user;
  return <AdminSectionOverview section="noticias" role={OWNER_ADMIN_ROLE} />;
}
