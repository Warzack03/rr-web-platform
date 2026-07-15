import type { ReactNode } from "react";
import type { AdminNavItem } from "@/server/auth/permissions";
import { AdminMobileNav } from "@/components/admin/admin-mobile-nav";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";

type AdminShellProps = {
  children: ReactNode;
  navItems: AdminNavItem[];
};

export function AdminShell({
  children,
  navItems,
}: AdminShellProps) {
  return (
    <div className="rr-admin min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(243,203,69,0.16),transparent_26%),linear-gradient(165deg,#06111d_0%,#0b223d_52%,#07111b_100%)]">
      <div className="mx-auto flex min-h-screen w-full max-w-[1680px]">
        <AdminSidebar navItems={navItems} />

        <div className="flex min-h-screen flex-1 flex-col">
          <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.1)] bg-[rgba(7,22,41,0.78)] px-4 py-3 backdrop-blur-md lg:hidden">
            <div>
              <p className="rr-kicker text-[color:var(--rr-gold)]">Backoffice</p>
              <p className="text-[0.98rem] font-semibold text-white">Operacion deportiva</p>
            </div>
            <AdminMobileNav navItems={navItems} />
          </div>

          <AdminTopbar navItems={navItems} />

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
