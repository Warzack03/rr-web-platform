import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { requireAdminSectionAccess } from "@/server/auth/session";
import { getAdminDashboardData } from "@/server/services/admin-dashboard";

export const metadata: Metadata = {
  title: "Panel de administracion",
};

type AdminDashboardPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminDashboardPage({}: AdminDashboardPageProps) {
  const user = await requireAdminSectionAccess("dashboard");
  const data = await getAdminDashboardData(user);

  return <AdminDashboard user={user} data={data} />;
}
