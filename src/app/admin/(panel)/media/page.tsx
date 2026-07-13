import { AdminMediaWorkspace } from "@/components/admin/admin-media-workspace";
import { requireAdminSectionAccess } from "@/server/auth/session";
import { getAdminMediaScreenData } from "@/server/services/admin-media";

export default async function AdminMediaPage() {
  const user = await requireAdminSectionAccess("media");
  const data = await getAdminMediaScreenData(user);

  return <AdminMediaWorkspace initialItems={data.items} />;
}
