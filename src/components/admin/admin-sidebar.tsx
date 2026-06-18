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
          "flex items-center gap-3 rounded-[10px] transition",
          active
            ? isPreview
              ? "min-h-10 border border-white/10 bg-[rgba(255,255,255,0.05)] px-3 py-2 text-white"
              : "min-h-11 border border-[rgba(253,203,88,0.26)] bg-[rgba(253,203,88,0.1)] px-4 py-2.5 text-white"
            : isPreview
              ? "min-h-10 border border-transparent px-3 py-2 text-[color:var(--rr-muted)] opacity-72 hover:bg-white/4 hover:text-white"
              : "min-h-11 border border-transparent px-4 py-2.5 text-[color:var(--rr-muted)] hover:border-white/8 hover:bg-white/5 hover:text-white",
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
          <span className="ml-auto inline-flex items-center rounded-full border border-white/8 bg-transparent px-1.5 py-0.5 text-[0.58rem] uppercase tracking-[0.12em] text-[color:var(--rr-muted)]">
            Vista previa
          </span>
        ) : null}
      </Link>
    );
  }

  return (
    <aside className="hidden w-[17rem] shrink-0 border-r border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(8,18,31,0.97),rgba(8,18,31,0.9))] lg:flex lg:min-h-screen lg:flex-col">
      <div className="border-b border-[rgba(255,255,255,0.08)] px-5 py-5">
        <p className="rr-kicker text-[0.76rem] text-[color:var(--rr-gold)]">Backoffice</p>
        <h2 className="mt-2 text-[1.28rem] font-semibold text-white">Operacion deportiva</h2>
        <p className="mt-1 text-[0.88rem] text-[color:var(--rr-muted)]">
          Panel de trabajo para web publica y competicion.
        </p>

        <div className="mt-4 rounded-[10px] border border-white/10 bg-white/5 px-4 py-3">
          <p className="rr-kicker text-[0.68rem] text-[color:var(--rr-gold)]">{roleLabel}</p>
          <p className="mt-2 text-[0.96rem] font-semibold text-white">{displayName}</p>
          <p className="mt-1 text-[0.82rem] text-[color:var(--rr-muted)]">Sesion activa</p>
        </div>
      </div>

      <nav className="flex-1 space-y-4 px-3 py-4">
        <div className="space-y-1">
          {activeItems.map(renderNavItem)}
        </div>

        {previewItems.length > 0 ? (
          <div className="space-y-2 border-t border-[rgba(255,255,255,0.08)] pt-4">
            <div className="space-y-1 px-4">
              <p className="text-[0.68rem] uppercase tracking-[0.16em] text-[color:var(--rr-muted)] opacity-80">
                Vista previa
              </p>
              <p className="text-[0.78rem] leading-5 text-[color:var(--rr-muted)] opacity-72">
                Modulos definidos, pero aun sin flujo completo.
              </p>
            </div>
            <div className="space-y-0.5">
              {previewItems.map(renderNavItem)}
            </div>
          </div>
        ) : null}
      </nav>

      <div className="border-t border-[rgba(255,255,255,0.08)] p-3">
        <Link
          href="/admin/login"
          className="flex min-h-11 items-center justify-between rounded-[10px] border border-white/10 bg-white/5 px-4 text-[0.9rem] text-[color:var(--rr-muted)] transition hover:text-white"
        >
          <span>Cambiar sesion</span>
          <LogOut className="h-4 w-4 text-[color:var(--rr-gold)]" />
        </Link>
      </div>
    </aside>
  );
}
