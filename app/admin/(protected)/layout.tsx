import { AdminShell } from "@/components/admin/admin-shell";
import { requireAuthenticatedAdmin } from "@/server/auth/session";

export default async function ProtectedAdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await requireAuthenticatedAdmin();

  return <AdminShell user={user}>{children}</AdminShell>;
}
