import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type AdminPageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
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
    <div className={cn("flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between", className)}>
      <div className="max-w-3xl space-y-3">
        <span className="rr-kicker text-[color:var(--rr-gold)]">{eyebrow}</span>
        <div className="space-y-2">
          <h1 className="rr-display text-[2.7rem] leading-[0.92] text-white sm:text-[3.4rem]">
            {title}
          </h1>
          <p className="max-w-2xl text-[1rem] leading-6 text-[color:var(--rr-muted)] sm:text-[1.06rem]">
            {description}
          </p>
        </div>
      </div>

      {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
    </div>
  );
}
