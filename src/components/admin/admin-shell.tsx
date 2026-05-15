import type { ReactNode } from "react";
import { Bell, CircleHelp, Search, Settings } from "lucide-react";
import Link from "next/link";
import { AdminNavigation } from "@/src/components/admin/admin-navigation";
import { LogoutButton } from "@/src/components/admin/logout-button";
import { ClubMark } from "@/src/components/shared/club-mark";
import {
  canAccessAdminSection,
  getAdminNavigationForRole,
  roleLabels,
} from "@/server/auth/permissions";
import type { AuthenticatedAdmin } from "@/server/auth/session";

type AdminShellProps = {
  children: ReactNode;
  user: AuthenticatedAdmin;
};

export function AdminShell({ children, user }: AdminShellProps) {
  const navigation = getAdminNavigationForRole(user.role);
  const showSettings = canAccessAdminSection(user.role, "settings");
  const title = user.role === "COACH" ? "Coach Portal" : "Backoffice V1.0";
  const subtitle = user.role === "COACH" ? "Technical staff" : "Backoffice principal";

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#0b1b32_0%,#081426_100%)] text-[var(--rr-text)]">
      <div className="grid min-h-screen lg:grid-cols-[320px_1fr]">
        <aside className="flex flex-col border-r border-[var(--rr-border)] bg-[rgba(12,15,15,0.92)] p-5">
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

          <div className="mt-8 space-y-3 border-t border-[var(--rr-border)] pt-5">
            {showSettings ? (
              <Link
                href="/admin/configuracion"
                className="flex items-center gap-3 rounded-[18px] border border-transparent px-4 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--rr-text-muted)] transition hover:border-[var(--rr-border)] hover:bg-white/5 hover:text-white"
              >
                <Settings className="h-5 w-5" />
                Ajustes
              </Link>
            ) : null}
            <LogoutButton />
          </div>
        </aside>

        <div className="min-w-0">
          <header className="border-b border-[var(--rr-border)] bg-[rgba(8,20,38,0.94)] px-5 py-5 sm:px-8">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
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
                <div className="flex min-w-[260px] items-center gap-3 rounded-full border border-[var(--rr-border)] bg-[rgba(30,32,32,0.58)] px-4 py-3 text-[var(--rr-text-soft)]">
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
          </header>

          <main className="px-5 py-8 sm:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
