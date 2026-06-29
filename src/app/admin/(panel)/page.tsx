import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { OWNER_ADMIN_ROLE } from "@/lib/admin/roles";
import { requireAdminSectionAccess } from "@/server/auth/session";

type AdminDashboardPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminDashboardPage({}: AdminDashboardPageProps) {
  const user = await requireAdminSectionAccess("dashboard");
  void user;

  return <AdminDashboard role={OWNER_ADMIN_ROLE} />;
}
