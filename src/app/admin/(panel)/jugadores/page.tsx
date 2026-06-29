import { AdminPlayersWorkspace } from "@/components/admin/admin-players-workspace";
import { requireAdminSectionAccess } from "@/server/auth/session";

export default async function AdminPlayersPage() {
  const user = await requireAdminSectionAccess("players");
  void user;
  return <AdminPlayersWorkspace />;
}
