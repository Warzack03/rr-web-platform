import type { ReactNode } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { getAdminNavigationForRole } from "@/server/auth/permissions";
import { requireAuthenticatedAdmin } from "@/server/auth/session";

export const dynamic = "force-dynamic";

type AdminPanelLayoutProps = {
  children: ReactNode;
};

export default async function AdminPanelLayout({
  children,
}: AdminPanelLayoutProps) {
  const user = await requireAuthenticatedAdmin();
  const navItems = getAdminNavigationForRole(user.role);

  return (
    <AdminShell
      navItems={navItems}
      displayName={user.displayName}
      roleLabel="Administrador"
    >
      {children}
    </AdminShell>
  );
}
