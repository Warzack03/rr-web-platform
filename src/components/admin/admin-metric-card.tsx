import type { ReactNode } from "react";
import { AdminPanel } from "@/components/admin/admin-panel";
import { cn } from "@/lib/utils";

type AdminMetricCardProps = {
  label: string;
  value: string;
  detail?: string;
  icon?: ReactNode;
  tone?: "gold" | "blue" | "slate" | "danger";
};

const accentClasses: Record<NonNullable<AdminMetricCardProps["tone"]>, string> = {
  gold: "border-[rgba(253,203,88,0.22)] before:bg-[linear-gradient(90deg,rgba(253,203,88,0.48),transparent)]",
  blue: "border-[rgba(52,112,200,0.24)] before:bg-[linear-gradient(90deg,rgba(52,112,200,0.48),transparent)]",
  slate: "border-[rgba(255,255,255,0.12)] before:bg-[linear-gradient(90deg,rgba(255,255,255,0.18),transparent)]",
  danger: "border-[rgba(214,64,69,0.3)] before:bg-[linear-gradient(90deg,rgba(214,64,69,0.48),transparent)]",
};

export function AdminMetricCard({
  label,
  value,
  detail,
  icon,
  tone = "gold",
}: AdminMetricCardProps) {
  return (
    <AdminPanel
      className={cn(
        "relative overflow-hidden border px-5 py-5 before:absolute before:inset-x-0 before:top-0 before:h-px",
        accentClasses[tone],
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <p className="rr-kicker text-[color:var(--rr-muted)]">{label}</p>
          <div className="space-y-1">
            <p className="rr-display text-[2.45rem] leading-none text-white">{value}</p>
            {detail ? (
              <p className="text-[0.95rem] leading-5 text-[color:var(--rr-muted)]">{detail}</p>
            ) : null}
          </div>
        </div>

        {icon ? (
          <div className="flex h-11 w-11 items-center justify-center rounded-[8px] border border-white/10 bg-white/5 text-[color:var(--rr-gold)]">
            {icon}
          </div>
        ) : null}
      </div>
    </AdminPanel>
  );
}
