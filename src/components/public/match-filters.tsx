"use client";

import { cn } from "@/lib/utils";
import type { MatchFilter, MatchFilterOption } from "@/lib/public/team-calendar-content";

type MatchFiltersProps = {
  options: MatchFilterOption[];
  activeFilter: MatchFilter;
  onChange: (filter: MatchFilter) => void;
};

export function MatchFilters({ options, activeFilter, onChange }: MatchFiltersProps) {
  return (
    <div className="-mx-1 overflow-x-auto pb-2">
      <div className="flex min-w-max gap-3 px-1">
        {options.map((option) => {
          const isActive = option.value === activeFilter;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={cn(
                "rr-kicker inline-flex min-h-11 items-center justify-center border px-5 py-3 text-[0.92rem] transition",
                isActive
                  ? "border-[color:var(--rr-gold)] bg-[color:var(--rr-gold)] text-[color:var(--rr-on-gold)]"
                  : "border-[color:var(--rr-border)] bg-[rgba(255,255,255,0.02)] text-[color:var(--rr-text)] hover:border-[color:var(--rr-gold)] hover:text-[color:var(--rr-gold)]",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
