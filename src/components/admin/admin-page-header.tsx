import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type AdminPageHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
};

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: AdminPageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between",
        className,
      )}
    >
      <div className="max-w-3xl space-y-2">
        <span className="rr-kicker text-[0.78rem] text-[color:var(--rr-gold)]">{eyebrow}</span>
        <div className="space-y-1.5">
          <h1 className="rr-display text-[2rem] leading-[0.96] text-white sm:text-[2.45rem]">
            {title}
          </h1>
          {description ? (
            <p className="max-w-xl text-[0.94rem] leading-5 text-[color:var(--rr-muted)] sm:text-[0.98rem]">
              {description}
            </p>
          ) : null}
        </div>
      </div>

      {actions ? (
        <div className="flex flex-wrap items-center gap-3 lg:justify-end">{actions}</div>
      ) : null}
    </div>
  );
}
