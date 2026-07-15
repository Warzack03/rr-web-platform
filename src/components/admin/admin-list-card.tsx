import type { ReactNode } from "react";
import { AdminPanel } from "@/components/admin/admin-panel";

type AdminListCardProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  meta?: ReactNode;
  footer?: ReactNode;
};

export function AdminListCard({
  eyebrow,
  title,
  description,
  meta,
  footer,
}: AdminListCardProps) {
  return (
    <AdminPanel className="p-4 lg:hidden">
      <div className="space-y-3">
        {eyebrow ? <p className="rr-kicker text-[color:var(--rr-gold)]">{eyebrow}</p> : null}
        <div className="space-y-1.5">
          <h3 className="rr-display text-[1.6rem] leading-[0.98] text-white">{title}</h3>
          {description ? (
            <p className="text-[0.96rem] leading-5 text-[color:var(--rr-muted)]">{description}</p>
          ) : null}
        </div>
        {meta ? <div className="flex flex-wrap items-center gap-2">{meta}</div> : null}
        {footer ? <div className="pt-1">{footer}</div> : null}
      </div>
    </AdminPanel>
  );
}
