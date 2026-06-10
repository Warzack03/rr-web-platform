"use client";

import Link from "next/link";
import { ArrowUpRight, Shield } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import type { AdminNavItem } from "@/server/auth/permissions";
import { AdminRoleSwitcher } from "@/components/admin/admin-role-switcher";
import { getPreviewRole, type AdminRole } from "@/lib/admin/roles";

type AdminTopbarProps = {
  displayName: string;
  roleLabel: string;
  navItems: AdminNavItem[];
  actualRole: AdminRole;
};

function getCurrentLabel(pathname: string, navItems: AdminNavItem[]) {
  const currentItem = navItems.find((item) =>
    item.href === "/admin" ? pathname === item.href : pathname.startsWith(item.href),
  );

  return currentItem?.label ?? "Admin";
}

export function AdminTopbar({
  displayName,
  roleLabel,
  navItems,
  actualRole,
}: AdminTopbarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentLabel = getCurrentLabel(pathname, navItems);
  const previewRole = getPreviewRole(searchParams.get("previewRole") ?? undefined, actualRole);

  return (
    <header className="sticky top-0 z-20 border-b border-[rgba(255,255,255,0.08)] bg-[rgba(7,18,31,0.88)] backdrop-blur-md">
      <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="rr-kicker text-[color:var(--rr-gold)]">{currentLabel}</p>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-[1.18rem] font-semibold text-white sm:text-[1.26rem]">
                {displayName}
              </h1>
              <span className="inline-flex min-h-8 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 text-[0.84rem] text-[color:var(--rr-muted)]">
                <Shield className="h-3.5 w-3.5 text-[color:var(--rr-gold)]" />
                {roleLabel}
              </span>
            </div>
          </div>

          <Link
            href="/"
            className="hidden min-h-11 items-center gap-2 rounded-[10px] border border-white/10 bg-white/5 px-4 text-[0.92rem] text-[color:var(--rr-muted)] transition hover:text-white md:inline-flex"
          >
            Ver publico
            <ArrowUpRight className="h-4 w-4 text-[color:var(--rr-gold)]" />
          </Link>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl text-[0.94rem] leading-5 text-[color:var(--rr-muted)]">
            Centro de control para el area deportiva y el contenido publico.
          </p>
          <AdminRoleSwitcher actualRole={actualRole} previewRole={previewRole} />
        </div>
      </div>
    </header>
  );
}
