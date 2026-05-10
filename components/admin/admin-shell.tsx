import type { ReactNode } from "react";
import { ArrowUpRight, ShieldCheck, Sparkles } from "lucide-react";
import { AdminFooter } from "@/components/admin/admin-footer";
import { LogoutButton } from "@/components/admin/logout-button";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
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
  const canAccessSettings = canAccessAdminSection(user.role, "settings");

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.18),_transparent_18%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.12),_transparent_20%),linear-gradient(180deg,_#020617_0%,_#0f172a_100%)] text-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-[1680px] flex-col gap-5 px-4 py-4 xl:px-6">
        <header className="rounded-[32px] border border-white/10 bg-slate-950/60 px-5 py-5 backdrop-blur xl:px-7 xl:py-6">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
            <div className="max-w-4xl space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg-amber-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-amber-200">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Rising Raimon
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-300">
                  <Sparkles className="h-3.5 w-3.5" />
                  Backoffice MVP
                </span>
              </div>

              <div className="space-y-3">
                <h1 className="max-w-4xl text-3xl font-semibold leading-tight text-white md:text-4xl xl:text-[2.9rem]">
                  Admin deportivo
                </h1>
                <p className="max-w-3xl text-sm leading-7 text-slate-400 md:text-[15px]">
                  Control interno claro y visual.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4 xl:min-w-[360px] xl:max-w-[420px]">
              <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-base font-semibold text-white">{user.displayName}</p>
                    <p className="mt-1 text-sm text-slate-400">@{user.username}</p>
                  </div>
                  <span className="inline-flex rounded-full border border-amber-300/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">
                    {roleLabels[user.role]}
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-white/8 bg-slate-950/55 px-3 py-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Estado
                    </p>
                    <p className="mt-1 text-sm text-slate-300">Acceso activo</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-amber-200" />
                </div>
              </div>

              <div className="flex justify-start xl:justify-end">
                <LogoutButton showSettings={canAccessSettings} />
              </div>
            </div>
          </div>
        </header>

        <section className="rounded-[32px] border border-white/10 bg-slate-950/55 px-4 py-4 backdrop-blur xl:px-6">
          <AdminSidebar items={navigation} />
        </section>

        <main className="flex-1 rounded-[32px] border border-white/10 bg-slate-950/50 p-5 backdrop-blur xl:p-7">
          {children}
        </main>

        <AdminFooter />
      </div>
    </div>
  );
}
