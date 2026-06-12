import type { ReactNode } from "react";
import { AdminPanel } from "@/components/admin/admin-panel";

type AdminScopePanelProps = {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
  aside?: ReactNode;
};

export function AdminScopePanel({
  eyebrow,
  title,
  description,
  actions,
  aside,
}: AdminScopePanelProps) {
  return (
    <AdminPanel className="border-[rgba(52,112,200,0.24)] px-5 py-4 sm:px-6">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-end">
        <div className="space-y-3">
          <div className="space-y-2">
            <p className="rr-kicker text-[color:var(--rr-gold)]">{eyebrow}</p>
            <div>
              <p className="text-[1rem] font-semibold text-white">{title}</p>
              <p className="mt-1 text-[0.92rem] leading-6 text-[color:var(--rr-muted)]">
                {description}
              </p>
            </div>
          </div>

          {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
        </div>

        {aside ? <div>{aside}</div> : null}
      </div>
    </AdminPanel>
  );
}
