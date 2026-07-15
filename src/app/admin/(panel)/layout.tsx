import type { ReactNode } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { getAdminNavigation } from "@/server/auth/permissions";
import { requireAuthenticatedAdmin } from "@/server/auth/session";

export const dynamic = "force-dynamic";

type AdminPanelLayoutProps = {
  children: ReactNode;
};

export default async function AdminPanelLayout({
  children,
}: AdminPanelLayoutProps) {
  await requireAuthenticatedAdmin();
  const navItems = getAdminNavigation();

  return (
    <AdminShell navItems={navItems}>
      {children}
    </AdminShell>
  );
}
