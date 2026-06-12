import type { ReactNode } from "react";
import type { AdminNavItem } from "@/server/auth/permissions";
import { AdminMobileNav } from "@/components/admin/admin-mobile-nav";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import type { AdminRole } from "@/lib/admin/roles";

type AdminShellProps = {
  children: ReactNode;
  navItems: AdminNavItem[];
  displayName: string;
  roleLabel: string;
  actualRole: AdminRole;
};

export function AdminShell({
  children,
  navItems,
  displayName,
  roleLabel,
  actualRole,
}: AdminShellProps) {
  return (
    <div className="rr-shell min-h-screen bg-[linear-gradient(180deg,#102543_0%,var(--rr-bg)_42%,#081120_100%)]">
      <div className="mx-auto flex min-h-screen w-full max-w-[1680px]">
        <AdminSidebar displayName={displayName} roleLabel={roleLabel} navItems={navItems} />

        <div className="flex min-h-screen flex-1 flex-col">
          <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.08)] px-4 py-2.5 lg:hidden">
            <div>
              <p className="rr-kicker text-[0.68rem] text-[color:var(--rr-gold)]">Backoffice</p>
              <p className="text-[0.95rem] font-semibold text-white">Operacion deportiva</p>
            </div>
            <AdminMobileNav
              navItems={navItems}
              displayName={displayName}
              roleLabel={roleLabel}
            />
          </div>

          <AdminTopbar
            displayName={displayName}
            roleLabel={roleLabel}
            navItems={navItems}
            actualRole={actualRole}
          />

          <main className="flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
