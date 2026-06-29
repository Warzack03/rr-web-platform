import { AdminAssignmentsWorkspace } from "@/components/admin/admin-assignments-workspace";
import { requireAdminSectionAccess } from "@/server/auth/session";

export default async function AdminAssignmentsPage() {
  const user = await requireAdminSectionAccess("assignments");
  void user;
  return <AdminAssignmentsWorkspace />;
}
