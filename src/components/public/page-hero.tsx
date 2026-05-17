import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  meta?: ReactNode;
  actions?: ReactNode;
  rightPanel?: ReactNode;
  stadium?: boolean;
};

export function PageHero({
  eyebrow,
  title,
  description,
  meta,
  actions,
  rightPanel,
  stadium = false,
}: PageHeroProps) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-[28px] border border-[var(--rr-border)] shadow-[var(--rr-shadow)]",
        stadium
          ? "rr-stadium-surface"
          : "bg-[linear-gradient(145deg,rgba(38,60,89,0.94),rgba(8,20,38,0.97))]",
      )}
    >
      <div
        className={cn(
          "grid gap-8 px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12",
          rightPanel ? "lg:grid-cols-[1.15fr_0.85fr]" : "",
        )}
      >
        <div className="flex flex-col justify-end space-y-5">
          {eyebrow ? (
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--rr-accent)]">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="max-w-4xl font-display text-4xl uppercase leading-none text-white sm:text-6xl lg:text-7xl">
            {title}
          </h1>
          {description ? (
            <p className="max-w-3xl text-base leading-7 text-[var(--rr-text-muted)] sm:text-lg">
              {description}
            </p>
          ) : null}
          {meta ? <div className="flex flex-wrap items-center gap-4">{meta}</div> : null}
          {actions ? <div className="flex flex-col gap-3 sm:flex-row">{actions}</div> : null}
        </div>

        {rightPanel ? <div className="flex items-end justify-end">{rightPanel}</div> : null}
      </div>
    </section>
  );
}
