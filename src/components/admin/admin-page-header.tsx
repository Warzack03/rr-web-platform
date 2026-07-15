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
        "flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between",
        className,
      )}
    >
      <div className="max-w-3xl space-y-2.5">
        <span className="rr-kicker text-[color:var(--rr-gold)]">{eyebrow}</span>
        <div className="space-y-2">
          <h1 className="rr-display text-[2.15rem] leading-[1] text-white sm:text-[2.65rem]">
            {title}
          </h1>
          {description ? (
            <p className="max-w-2xl text-[0.95rem] leading-6 text-[color:var(--rr-muted)] sm:text-[1rem]">
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
