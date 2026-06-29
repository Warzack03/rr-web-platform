import { AdminMediaWorkspace } from "@/components/admin/admin-media-workspace";
import { requireAdminSectionAccess } from "@/server/auth/session";

export default async function AdminMediaPage() {
  const user = await requireAdminSectionAccess("media");
  void user;
  return <AdminMediaWorkspace />;
}
