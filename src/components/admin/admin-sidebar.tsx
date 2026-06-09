"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import type { AdminNavItem } from "@/server/auth/permissions";
import { getAdminNavIcon } from "@/components/admin/admin-nav-icons";
import { cn } from "@/lib/utils";

type AdminSidebarProps = {
  displayName: string;
  roleLabel: string;
  navItems: AdminNavItem[];
};

function isCurrentPath(pathname: string, href: string) {
  return href === "/admin" ? pathname === href : pathname.startsWith(href);
}

export function AdminSidebar({
  displayName,
  roleLabel,
  navItems,
}: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-[18.5rem] shrink-0 border-r border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(8,18,31,0.96),rgba(8,18,31,0.88))] lg:flex lg:min-h-screen lg:flex-col">
      <div className="border-b border-[rgba(255,255,255,0.08)] px-6 py-6">
        <p className="rr-kicker text-[color:var(--rr-gold)]">Rising Raimon admin</p>
        <h2 className="rr-display mt-3 text-[2.35rem] leading-[0.92] text-white">
          Operacion deportiva
        </h2>
        <div className="mt-4 rounded-[10px] border border-white/10 bg-white/5 px-4 py-3">
          <p className="text-[1rem] font-semibold text-white">{displayName}</p>
          <p className="rr-kicker mt-1 text-[0.72rem] text-[color:var(--rr-muted)]">{roleLabel}</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const Icon = getAdminNavIcon(item.section);
          const active = isCurrentPath(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-h-12 items-center gap-3 rounded-[10px] px-4 py-3 text-[0.98rem] transition",
                active
                  ? "border border-[rgba(253,203,88,0.26)] bg-[rgba(253,203,88,0.1)] text-white"
                  : "border border-transparent text-[color:var(--rr-muted)] hover:border-white/8 hover:bg-white/5 hover:text-white",
              )}
            >
              <Icon
                className={cn(
                  "h-4.5 w-4.5 shrink-0",
                  active ? "text-[color:var(--rr-gold)]" : "text-[color:var(--rr-muted)]",
                )}
              />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[rgba(255,255,255,0.08)] p-3">
        <Link
          href="/admin/login"
          className="flex min-h-11 items-center justify-between rounded-[10px] border border-white/10 bg-white/5 px-4 text-[0.92rem] text-[color:var(--rr-muted)] transition hover:text-white"
        >
          <span>Cambiar sesion</span>
          <LogOut className="h-4 w-4 text-[color:var(--rr-gold)]" />
        </Link>
      </div>
    </aside>
  );
}
