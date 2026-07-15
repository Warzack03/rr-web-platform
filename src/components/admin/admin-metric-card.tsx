import type { ReactNode } from "react";
import { AdminPanel } from "@/components/admin/admin-panel";
import { cn } from "@/lib/utils";

type AdminMetricCardProps = {
  label: string;
  value: string;
  detail?: string;
  icon?: ReactNode;
  tone?: "gold" | "blue" | "slate" | "danger";
  compact?: boolean;
  className?: string;
};

const accentClasses: Record<NonNullable<AdminMetricCardProps["tone"]>, string> = {
  gold: "border-[rgba(243,203,69,0.28)] before:bg-[linear-gradient(90deg,rgba(243,203,69,0.58),transparent)]",
  blue: "border-[rgba(107,159,255,0.26)] before:bg-[linear-gradient(90deg,rgba(107,159,255,0.5),transparent)]",
  slate: "border-[rgba(255,255,255,0.12)] before:bg-[linear-gradient(90deg,rgba(255,255,255,0.18),transparent)]",
  danger: "border-[rgba(221,108,112,0.34)] before:bg-[linear-gradient(90deg,rgba(221,108,112,0.5),transparent)]",
};

export function AdminMetricCard({
  label,
  value,
  detail,
  icon,
  tone = "gold",
  compact = false,
  className,
}: AdminMetricCardProps) {
  return (
    <AdminPanel
      className={cn(
        "relative overflow-hidden border before:absolute before:inset-x-0 before:top-0 before:h-px",
        compact ? "px-5 py-5" : "px-6 py-6",
        accentClasses[tone],
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className={cn(compact ? "space-y-2.5" : "space-y-3")}>
          <p className="rr-kicker text-[color:var(--rr-muted)]">{label}</p>
          <div className={cn(compact ? "space-y-0.5" : "space-y-1")}>
            <p
              className={cn(
                "rr-display leading-none text-white",
                compact ? "text-[2.05rem]" : "text-[2.35rem]",
              )}
            >
              {value}
            </p>
            {detail ? (
              <p
                className={cn(
                  "text-[color:var(--rr-muted)]",
                  compact ? "text-[0.88rem] leading-5" : "text-[0.95rem] leading-5",
                )}
              >
                {detail}
              </p>
            ) : null}
          </div>
        </div>

        {icon ? (
          <div
            className={cn(
              "flex items-center justify-center rounded-[10px] border border-white/10 bg-white/5 text-[color:var(--rr-gold)]",
              compact ? "h-11 w-11" : "h-12 w-12",
            )}
          >
            {icon}
          </div>
        ) : null}
      </div>
    </AdminPanel>
  );
}
