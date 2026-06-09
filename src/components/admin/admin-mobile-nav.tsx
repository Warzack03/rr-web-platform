"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import type { AdminNavItem } from "@/server/auth/permissions";
import { getAdminNavIcon } from "@/components/admin/admin-nav-icons";
import { cn } from "@/lib/utils";

type AdminMobileNavProps = {
  navItems: AdminNavItem[];
};

function isCurrentPath(pathname: string, href: string) {
  return href === "/admin" ? pathname === href : pathname.startsWith(href);
}

export function AdminMobileNav({ navItems }: AdminMobileNavProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

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
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
              <div>
                <p className="rr-kicker text-[color:var(--rr-gold)]">Backoffice</p>
                <p className="mt-2 text-[1rem] font-semibold text-white">Navegacion admin</p>
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

            <nav className="flex-1 space-y-1 px-3 py-4">
              {navItems.map((item) => {
                const active = isCurrentPath(pathname, item.href);
                const Icon = getAdminNavIcon(item.section);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex min-h-12 items-center gap-3 rounded-[10px] px-4 py-3 text-[0.98rem] transition",
                      active
                        ? "border border-[rgba(253,203,88,0.26)] bg-[rgba(253,203,88,0.1)] text-white"
                        : "border border-transparent text-[color:var(--rr-muted)] hover:border-white/8 hover:bg-white/5 hover:text-white",
                    )}
                  >
                    <Icon className="h-4.5 w-4.5 text-[color:var(--rr-gold)]" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      ) : null}
    </>
  );
}
