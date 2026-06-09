import type { ReactNode } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { adminRoleLabels, isAdminRole, type AdminRole } from "@/lib/admin/roles";
import { getAdminNavigationForRole } from "@/server/auth/permissions";
import { requireAuthenticatedAdmin } from "@/server/auth/session";

export const dynamic = "force-dynamic";

type AdminPanelLayoutProps = {
  children: ReactNode;
};

function getActualRole(role: string): AdminRole {
  return isAdminRole(role) ? role : "COACH";
}

export default async function AdminPanelLayout({
  children,
}: AdminPanelLayoutProps) {
  const user = await requireAuthenticatedAdmin();
  const actualRole = getActualRole(user.role);
  const navItems = getAdminNavigationForRole(user.role);

  return (
    <AdminShell
      navItems={navItems}
      displayName={user.displayName}
      roleLabel={adminRoleLabels[actualRole]}
      actualRole={actualRole}
    >
      {children}
    </AdminShell>
  );
}
