"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { Bell, CircleHelp, Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AdminNavigation, adminIconMap } from "@/src/components/admin/admin-navigation";
import { LogoutButton } from "@/src/components/admin/logout-button";
import { ClubMark } from "@/src/components/shared/club-mark";
import {
  canAccessAdminSection,
  getAdminNavigationForRole,
  roleLabels,
} from "@/server/auth/permissions";
import type { AuthenticatedAdmin } from "@/server/auth/session";
import { cn } from "@/lib/utils";

type AdminShellProps = {
  children: ReactNode;
  user: AuthenticatedAdmin;
};

export function AdminShell({ children, user }: AdminShellProps) {
  const pathname = usePathname();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const navigation = getAdminNavigationForRole(user.role);
  const showSettings = canAccessAdminSection(user.role, "settings");
  const title = user.role === "COACH" ? "Coach Portal" : "Backoffice Deportivo";
  const subtitle = user.role === "COACH" ? "Technical staff" : "Operacion interna del club";

  const mobileTabs = useMemo(() => {
    if (user.role === "COACH") {
      return navigation.filter((item) =>
        ["/admin", "/admin/partidos", "/admin/clasificaciones", "/admin/estadisticas"].includes(
          item.href,
        ),
      );
    }

    return navigation.filter((item) =>
      ["/admin", "/admin/equipos", "/admin/partidos", "/admin/noticias"].includes(item.href),
    );
  }, [navigation, user.role]);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#0b1b32_0%,#081426_100%)] text-[var(--rr-text)]">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-[300px_1fr]">
        <aside className="hidden border-r border-[var(--rr-border)] bg-[rgba(12,15,15,0.92)] p-5 lg:flex lg:flex-col">
          <div className="flex items-center gap-4 rounded-[22px] border border-[var(--rr-border)] bg-[rgba(39,58,88,0.42)] p-4">
            <ClubMark />
            <div>
              <p className="font-display text-4xl uppercase text-[var(--rr-accent)]">{title}</p>
              <p className="text-base text-[var(--rr-text-muted)]">{subtitle}</p>
            </div>
          </div>

          <div className="mt-8 flex-1">
            <AdminNavigation items={navigation} />
          </div>

          <div className="mt-8 border-t border-[var(--rr-border)] pt-5">
            <LogoutButton showSettings={showSettings} />
          </div>
        </aside>

        <div className="min-w-0">
          <header className="sticky top-0 z-40 border-b border-[var(--rr-border)] bg-[rgba(8,20,38,0.94)] backdrop-blur-xl">
            <div className="px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between gap-3 lg:hidden">
                <div className="flex min-w-0 items-center gap-3">
                  <ClubMark compact />
                  <div className="min-w-0">
                    <p className="truncate font-display text-3xl uppercase text-[var(--rr-accent)]">
                      {user.role === "COACH" ? "Coach Portal" : "Rising Raimon"}
                    </p>
                    <p className="truncate text-xs uppercase tracking-[0.16em] text-[var(--rr-text-soft)]">
                      {roleLabels[user.role]}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsNavOpen(true)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--rr-border)] bg-white/5 text-[var(--rr-text)] transition hover:border-[var(--rr-border-strong)] hover:text-[var(--rr-accent)]"
                  aria-label="Abrir navegacion del admin"
                >
                  <Menu className="h-5 w-5" />
                </button>
              </div>

              <div className="hidden flex-col gap-4 lg:flex xl:flex-row xl:items-center xl:justify-between">
                <div className="flex items-center gap-8">
                  <p className="font-display text-4xl uppercase text-[var(--rr-accent)]">
                    {user.role === "COACH" ? "Rising Raimon Academy" : "Rising Raimon"}
                  </p>
                  <div className="hidden items-center gap-8 xl:flex">
                    <span className="border-b-2 border-[var(--rr-accent)] pb-1 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--rr-accent)]">
                      Dashboard
                    </span>
                    <span className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--rr-text-muted)]">
                      Soporte
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 xl:justify-end">
                  <div className="hidden min-w-[220px] items-center gap-3 rounded-full border border-[var(--rr-border)] bg-[rgba(30,32,32,0.58)] px-4 py-3 text-[var(--rr-text-soft)] md:flex xl:min-w-[260px]">
                    <Search className="h-5 w-5" />
                    <span className="text-sm">Buscar...</span>
                  </div>
                  <Bell className="h-5 w-5 text-[var(--rr-text-muted)]" />
                  <CircleHelp className="h-5 w-5 text-[var(--rr-text-muted)]" />
                  <div className="flex items-center gap-3 rounded-full border border-[var(--rr-border)] bg-[rgba(8,20,38,0.65)] px-3 py-2">
                    <ClubMark compact />
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-white">
                        {user.displayName}
                      </p>
                      <p className="text-xs uppercase tracking-[0.16em] text-[var(--rr-text-soft)]">
                        {roleLabels[user.role]}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="px-4 py-6 pb-24 sm:px-6 lg:px-8 lg:py-8 lg:pb-8">{children}</main>
        </div>
      </div>

      {isNavOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Cerrar navegacion del admin"
            onClick={() => setIsNavOpen(false)}
            className="absolute inset-0 bg-[rgba(4,9,16,0.72)] backdrop-blur-sm"
          />
          <aside className="relative z-10 flex h-full w-[min(88vw,360px)] flex-col border-r border-[var(--rr-border)] bg-[rgba(8,20,38,0.98)] p-4 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)]">
            <div className="flex items-center justify-between gap-4 rounded-[22px] border border-[var(--rr-border)] bg-[rgba(39,58,88,0.42)] p-4">
              <div className="flex items-center gap-3">
                <ClubMark compact />
                <div>
                  <p className="font-display text-3xl uppercase text-[var(--rr-accent)]">{title}</p>
                  <p className="text-sm text-[var(--rr-text-muted)]">{subtitle}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsNavOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--rr-border)] bg-white/5 text-[var(--rr-text)]"
                aria-label="Cerrar menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 flex-1 overflow-y-auto">
              <AdminNavigation items={navigation} onNavigate={() => setIsNavOpen(false)} />
            </div>

            <div className="mt-6 border-t border-[var(--rr-border)] pt-4">
              <div className="mb-4 rounded-[18px] border border-[var(--rr-border)] bg-[rgba(8,20,38,0.65)] px-4 py-3">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-white">
                  {user.displayName}
                </p>
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--rr-text-soft)]">
                  {roleLabels[user.role]}
                </p>
              </div>
              <LogoutButton showSettings={showSettings} />
            </div>
          </aside>
        </div>
      ) : null}

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--rr-border)] bg-[rgba(8,20,38,0.96)] px-2 py-2 backdrop-blur-xl lg:hidden">
        <div className="grid grid-cols-5 gap-2">
          {mobileTabs.map((item) => {
            const Icon = adminIconMap[item.section];
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 rounded-[16px] px-2 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] transition",
                  isActive
                    ? "bg-[rgba(253,203,88,0.12)] text-[var(--rr-accent)]"
                    : "text-[var(--rr-text-soft)] hover:text-white",
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}

          <button
            type="button"
            onClick={() => setIsNavOpen(true)}
            className="flex flex-col items-center justify-center gap-1 rounded-[16px] px-2 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--rr-text-soft)] transition hover:text-white"
          >
            <Menu className="h-4 w-4" />
            <span>Menu</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
