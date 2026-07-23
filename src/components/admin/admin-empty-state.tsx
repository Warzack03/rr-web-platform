import type { ReactNode } from "react";
import { AdminPanel } from "@/components/admin/admin-panel";

type AdminEmptyStateProps = {
  eyebrow?: string;
  title: string;
  description: string;
  action?: ReactNode;
};

export function AdminEmptyState({
  eyebrow = "Sin datos",
  title,
  description,
  action,
}: AdminEmptyStateProps) {
  return (
    <AdminPanel className="border-dashed px-6 py-9 text-center">
      <div className="mx-auto max-w-md space-y-3.5">
        <p className="rr-kicker text-[color:var(--rr-gold)]">{eyebrow}</p>
        <h2 className="rr-display text-[2.15rem] leading-[1] text-white">{title}</h2>
        <p className="text-[0.98rem] leading-6 text-[color:var(--rr-muted)]">{description}</p>
        {action ? <div className="pt-2">{action}</div> : null}
      </div>
    </AdminPanel>
  );
}
