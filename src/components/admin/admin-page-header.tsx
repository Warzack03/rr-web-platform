import type { ReactNode } from "react";

type AdminPageHeaderProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  badge?: string;
};

export function AdminPageHeader({
  title,
  description,
  action,
  badge,
}: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
      <div className="space-y-3">
        {badge ? (
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--rr-accent)]">
            {badge}
          </p>
        ) : null}
        <h1 className="font-display text-4xl uppercase leading-none text-white sm:text-5xl xl:text-6xl">
          {title}
        </h1>
        {description ? (
          <p className="max-w-3xl text-base leading-7 text-[var(--rr-text-muted)] sm:text-lg">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
