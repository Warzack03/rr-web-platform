import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { getPreviewRole, isAdminRole, type AdminRole } from "@/lib/admin/roles";
import { requireAdminSectionAccess } from "@/server/auth/session";

type AdminDashboardPageProps = {
  searchParams: Promise<{
    previewRole?: string | string[];
  }>;
};

function getSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function getActualRole(role: string): AdminRole {
  return isAdminRole(role) ? role : "COACH";
}

export default async function AdminDashboardPage({
  searchParams,
}: AdminDashboardPageProps) {
  const user = await requireAdminSectionAccess("dashboard");
  const resolvedSearchParams = await searchParams;
  const actualRole = getActualRole(user.role);
  const previewRole = getPreviewRole(getSingleValue(resolvedSearchParams.previewRole), actualRole);

  return <AdminDashboard role={previewRole} />;
}
