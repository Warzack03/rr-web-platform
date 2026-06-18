"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import type { AdminNavItem } from "@/server/auth/permissions";
import { getAdminNavIcon } from "@/components/admin/admin-nav-icons";
import { cn } from "@/lib/utils";

type AdminMobileNavProps = {
  navItems: AdminNavItem[];
  displayName: string;
  roleLabel: string;
};

function isCurrentPath(pathname: string, href: string) {
  return href === "/admin" ? pathname === href : pathname.startsWith(href);
}

function getCurrentLabel(pathname: string, navItems: AdminNavItem[]) {
  const currentItem = navItems.find((item) =>
    item.href === "/admin" ? pathname === item.href : pathname.startsWith(item.href),
  );

  return currentItem?.label ?? "Admin";
}

function formatSlugLabel(value: string) {
  return value
    .split("-")
    .filter(Boolean)
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(" ");
}

export function AdminMobileNav({
  navItems,
  displayName,
  roleLabel,
}: AdminMobileNavProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const currentLabel = getCurrentLabel(pathname, navItems);
  const activeTeam = searchParams.get("team");
  const activeItems = navItems.filter((item) => item.status === "active");
  const previewItems = navItems.filter((item) => item.status === "preview");

  function renderNavItem(item: AdminNavItem) {
    const active = isCurrentPath(pathname, item.href);
    const Icon = getAdminNavIcon(item.section);
    const isPreview = item.status === "preview";

    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={() => setOpen(false)}
        className={cn(
          "flex items-center gap-3 rounded-[10px] transition",
          active
            ? isPreview
              ? "min-h-10 border border-white/10 bg-[rgba(255,255,255,0.05)] px-3 py-2.5 text-white"
              : "min-h-11 border border-[rgba(253,203,88,0.26)] bg-[rgba(253,203,88,0.1)] px-4 py-3 text-white"
            : isPreview
              ? "min-h-10 border border-transparent px-3 py-2.5 text-[color:var(--rr-muted)] opacity-72 hover:bg-white/4 hover:text-white"
              : "min-h-11 border border-transparent px-4 py-3 text-[color:var(--rr-muted)] hover:border-white/8 hover:bg-white/5 hover:text-white",
        )}
      >
        <Icon
          className={cn(
            isPreview ? "h-4 w-4" : "h-4.5 w-4.5",
            active && !isPreview ? "text-[color:var(--rr-gold)]" : "text-[color:var(--rr-muted)]",
          )}
        />
        <span className={cn(isPreview ? "text-[0.9rem]" : undefined)}>{item.label}</span>
        {isPreview ? (
          <span className="ml-auto inline-flex items-center rounded-full border border-white/8 bg-transparent px-1.5 py-0.5 text-[0.58rem] uppercase tracking-[0.12em] text-[color:var(--rr-muted)]">
            Vista previa
          </span>
        ) : null}
      </Link>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-[10px] border border-[color:var(--rr-border)] bg-[rgba(255,255,255,0.05)] text-white lg:hidden"
        aria-label="Abrir navegacion admin"
      >
        <Menu className="h-5 w-5 text-[color:var(--rr-gold)]" />
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 bg-[rgba(4,10,18,0.82)] backdrop-blur-sm lg:hidden">
          <div className="ml-auto flex h-full w-[86vw] max-w-[22rem] flex-col border-l border-white/10 bg-[linear-gradient(180deg,rgba(8,18,31,0.98),rgba(8,18,31,0.96))]">
            <div className="border-b border-white/10 px-5 py-5">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <p className="rr-kicker text-[color:var(--rr-gold)]">Backoffice</p>
                  <div>
                    <p className="text-[1rem] font-semibold text-white">{currentLabel}</p>
                    <p className="mt-1 text-[0.86rem] text-[color:var(--rr-muted)]">
                      Sesion de {displayName}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-white/10 bg-white/5 text-white"
                  aria-label="Cerrar navegacion admin"
                >
                  <X className="h-4.5 w-4.5 text-[color:var(--rr-gold)]" />
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="inline-flex min-h-8 items-center rounded-full border border-white/10 bg-white/5 px-3 text-[0.78rem] text-white">
                  {roleLabel}
                </span>
                {activeTeam ? (
                  <span className="inline-flex min-h-8 items-center rounded-full border border-[rgba(253,203,88,0.24)] bg-[rgba(253,203,88,0.08)] px-3 text-[0.78rem] text-[color:var(--rr-gold)]">
                    Equipo: {formatSlugLabel(activeTeam)}
                  </span>
                ) : null}
              </div>
            </div>

            <nav className="flex-1 space-y-4 px-3 py-4">
              <div className="space-y-1">
                {activeItems.map(renderNavItem)}
              </div>

              {previewItems.length > 0 ? (
                <div className="space-y-2 border-t border-white/10 pt-4">
                  <div className="space-y-1 px-4">
                    <p className="text-[0.68rem] uppercase tracking-[0.16em] text-[color:var(--rr-muted)] opacity-80">
                      Vista previa
                    </p>
                    <p className="text-[0.78rem] leading-5 text-[color:var(--rr-muted)] opacity-72">
                      Rutas de alcance, aun sin flujo completo.
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    {previewItems.map(renderNavItem)}
                  </div>
                </div>
              ) : null}
            </nav>

            <div className="border-t border-white/10 px-5 py-4 text-[0.84rem] text-[color:var(--rr-muted)]">
              Los modulos de vista previa siguen visibles para referencia, no como flujo principal.
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
