"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { AdminNavItem } from "@/server/auth/permissions";
import { getAdminNavIcon } from "@/components/admin/admin-nav-icons";
import { cn } from "@/lib/utils";

type AdminSidebarProps = {
  navItems: AdminNavItem[];
};

function isCurrentPath(pathname: string, href: string) {
  return href === "/admin" ? pathname === href : pathname.startsWith(href);
}

export function AdminSidebar({ navItems }: AdminSidebarProps) {
  const pathname = usePathname();
  const activeItems = navItems.filter((item) => item.status === "active");
  const previewItems = navItems.filter((item) => item.status === "preview");

  function renderNavItem(item: AdminNavItem) {
    const Icon = getAdminNavIcon(item.section);
    const active = isCurrentPath(pathname, item.href);
    const isPreview = item.status === "preview";

    return (
      <Link
        key={item.href}
        href={item.href}
        className={cn(
          "flex items-center gap-3 rounded-[14px] transition",
          active
            ? isPreview
              ? "min-h-10 border border-white/10 bg-[rgba(255,255,255,0.06)] px-3 py-2 text-white shadow-[0_12px_26px_rgba(0,0,0,0.12)]"
              : "min-h-11 border border-[rgba(243,203,69,0.34)] bg-[rgba(243,203,69,0.12)] px-4 py-2.5 text-white shadow-[0_14px_30px_rgba(0,0,0,0.14)]"
            : isPreview
              ? "min-h-10 border border-transparent px-3 py-2 text-[color:var(--rr-muted)] opacity-80 hover:bg-white/5 hover:text-white"
              : "min-h-11 border border-transparent px-4 py-2.5 text-[color:var(--rr-muted)] hover:border-white/10 hover:bg-white/5 hover:text-white",
        )}
      >
        <Icon
          className={cn(
            "shrink-0",
            isPreview ? "h-4 w-4" : "h-4.5 w-4.5",
            active && !isPreview
              ? "text-[color:var(--rr-gold)]"
              : "text-[color:var(--rr-muted)]",
          )}
        />
        <span className={cn("font-medium", isPreview ? "text-[0.88rem]" : undefined)}>
          {item.label}
        </span>
        {isPreview ? (
          <span className="ml-auto inline-flex items-center rounded-full border border-white/10 bg-white/4 px-2 py-0.5 text-[0.64rem] font-semibold text-[color:var(--rr-muted)]">
            Preview
          </span>
        ) : null}
      </Link>
    );
  }

  return (
    <aside className="hidden w-[18rem] shrink-0 border-r border-[rgba(255,255,255,0.1)] bg-[linear-gradient(180deg,rgba(6,17,29,0.98)_0%,rgba(12,35,65,0.96)_100%)] lg:flex lg:min-h-screen lg:flex-col">
      <div className="border-b border-[rgba(255,255,255,0.1)] px-5 py-6">
        <p className="rr-kicker text-[color:var(--rr-gold)]">Rising Raimon</p>
        <h2 className="mt-2 text-[1.34rem] font-semibold text-white">Backoffice deportivo</h2>
        <p className="mt-1 text-[0.9rem] leading-5 text-[color:var(--rr-muted)]">
          Control publico y competicion.
        </p>
      </div>

      <nav className="flex-1 space-y-5 px-3.5 py-5">
        <div className="space-y-1">
          {activeItems.map(renderNavItem)}
        </div>

        {previewItems.length > 0 ? (
          <div className="space-y-3 border-t border-[rgba(255,255,255,0.1)] pt-5">
            <div className="space-y-1 px-4">
              <p className="text-[0.76rem] font-semibold text-[color:var(--rr-muted)] opacity-90">
                Otros accesos
              </p>
              <p className="text-[0.8rem] leading-5 text-[color:var(--rr-muted)] opacity-75">
                Herramientas disponibles para el panel.
              </p>
            </div>
            <div className="space-y-0.5">
              {previewItems.map(renderNavItem)}
            </div>
          </div>
        ) : null}
      </nav>
    </aside>
  );
}
