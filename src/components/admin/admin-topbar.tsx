"use client";

import Link from "next/link";
import { ArrowUpRight, Shield, UserCircle2 } from "lucide-react";
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

function formatSlugLabel(value: string) {
  return value
    .split("-")
    .filter(Boolean)
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(" ");
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
  const activeTeam = searchParams.get("team");
  const activeSeason = searchParams.get("season");
  const isPreviewMode = previewRole !== actualRole;

  return (
    <header className="sticky top-0 z-20 border-b border-[rgba(255,255,255,0.08)] bg-[rgba(7,18,31,0.88)] backdrop-blur-md">
      <div className="flex flex-col gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <p className="rr-kicker text-[0.76rem] text-[color:var(--rr-gold)]">Backoffice deportivo</p>
            <h1 className="text-[1.25rem] font-semibold text-white sm:text-[1.45rem]">
              {currentLabel}
            </h1>

            <div className="flex flex-wrap items-center gap-2 text-[0.82rem] text-[color:var(--rr-muted)]">
              <span className="inline-flex min-h-8 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 text-white">
                <Shield className="h-3.5 w-3.5 text-[color:var(--rr-gold)]" />
                {roleLabel}
              </span>
              {activeTeam ? (
                <span className="inline-flex min-h-8 items-center rounded-full border border-[rgba(253,203,88,0.24)] bg-[rgba(253,203,88,0.08)] px-3 text-[color:var(--rr-gold)]">
                  Equipo: {formatSlugLabel(activeTeam)}
                </span>
              ) : null}
              {activeSeason ? (
                <span className="inline-flex min-h-8 items-center rounded-full border border-white/10 bg-white/5 px-3">
                  Temporada: {activeSeason}
                </span>
              ) : null}
              {isPreviewMode ? (
                <span className="inline-flex min-h-8 items-center rounded-full border border-white/10 bg-white/5 px-3">
                  Vista de prueba
                </span>
              ) : null}
              <span className="inline-flex min-h-8 items-center gap-2 rounded-full border border-transparent px-1">
                <UserCircle2 className="h-3.5 w-3.5 text-[color:var(--rr-gold)]" />
                {displayName}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center lg:items-start">
            <Link
              href="/"
              className="inline-flex min-h-10 items-center gap-2 rounded-[10px] border border-white/10 bg-white/5 px-4 text-[0.9rem] text-[color:var(--rr-muted)] transition hover:text-white"
            >
              Ver publico
              <ArrowUpRight className="h-4 w-4 text-[color:var(--rr-gold)]" />
            </Link>

            <AdminRoleSwitcher actualRole={actualRole} previewRole={previewRole} />
          </div>
        </div>

        <div className="text-[0.82rem] text-[color:var(--rr-muted)]">
          Opera con foco en contexto, permisos y salida publica visible.
        </div>
      </div>
    </header>
  );
}
