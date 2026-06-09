import type { ReactNode } from "react";
import { AdminPanel } from "@/components/admin/admin-panel";

type AdminEmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export function AdminEmptyState({ title, description, action }: AdminEmptyStateProps) {
  return (
    <AdminPanel className="border-dashed px-6 py-8 text-center">
      <div className="mx-auto max-w-md space-y-3">
        <p className="rr-kicker text-[color:var(--rr-gold)]">Pendiente de evolucion</p>
        <h2 className="rr-display text-[2rem] leading-[0.95] text-white">{title}</h2>
        <p className="text-[0.98rem] leading-6 text-[color:var(--rr-muted)]">{description}</p>
        {action ? <div className="pt-2">{action}</div> : null}
      </div>
    </AdminPanel>
  );
}
