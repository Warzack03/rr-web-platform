"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import type { AdminNavItem } from "@/server/auth/permissions";

type AdminTopbarProps = {
  navItems: AdminNavItem[];
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

export function AdminTopbar({ navItems }: AdminTopbarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentLabel = getCurrentLabel(pathname, navItems);
  const activeTeam = searchParams.get("team");
  const activeSeason = searchParams.get("season");

  return (
    <header className="sticky top-0 z-20 border-b border-[rgba(255,255,255,0.08)] bg-[rgba(7,18,31,0.88)] backdrop-blur-md">
      <div className="flex flex-col gap-2 px-4 py-2.5 sm:gap-3 sm:px-6 sm:py-3 lg:px-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-1.5 sm:space-y-2">
            <p className="rr-kicker text-[0.76rem] text-[color:var(--rr-gold)]">Backoffice deportivo</p>
            <h1 className="text-[1.12rem] font-semibold text-white sm:text-[1.45rem]">
              {currentLabel}
            </h1>

            <div className="flex flex-wrap items-center gap-1.5 text-[0.78rem] text-[color:var(--rr-muted)] sm:gap-2 sm:text-[0.82rem]">
              {activeTeam ? (
                <span className="inline-flex min-h-8 items-center rounded-full border border-[rgba(253,203,88,0.24)] bg-[rgba(253,203,88,0.08)] px-2.5 text-[color:var(--rr-gold)] sm:px-3">
                  Equipo: {formatSlugLabel(activeTeam)}
                </span>
              ) : null}
              {activeSeason ? (
                <span className="hidden min-h-8 items-center rounded-full border border-white/10 bg-white/5 px-3 md:inline-flex">
                  Temporada: {activeSeason}
                </span>
              ) : null}
            </div>
          </div>

          <div className="flex w-full items-center gap-2 sm:w-auto sm:flex-row sm:items-center lg:items-start">
            <Link
              href="/"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border border-white/10 bg-white/5 text-[0.9rem] text-[color:var(--rr-muted)] transition hover:text-white sm:min-h-10 sm:w-auto sm:gap-2 sm:px-4"
            >
              <span className="hidden sm:inline">Ver publico</span>
              <ArrowUpRight className="h-4 w-4 text-[color:var(--rr-gold)]" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
