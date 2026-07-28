"use client";

import { cn } from "@/lib/utils";

type NewsCategoryTabsProps = {
  categories: readonly string[];
  activeCategory: string;
  onChange: (category: string) => void;
};

export function NewsCategoryTabs({
  categories,
  activeCategory,
  onChange,
}: NewsCategoryTabsProps) {
  return (
    <div className="-mx-5 overflow-x-auto px-5 md:mx-0 md:px-0" aria-label="Filtrar noticias por categoria">
      <div className="flex min-w-max items-center gap-2 md:gap-3">
        {categories.map((category) => {
          const isActive = category === activeCategory;

          return (
            <button
              key={category}
              type="button"
              onClick={() => onChange(category)}
              aria-pressed={isActive}
              className={cn(
                "rr-kicker min-h-11 border px-4 py-3 text-[0.84rem] transition",
                isActive
                  ? "border-[color:var(--rr-gold)] bg-[rgba(253,203,88,0.12)] text-[color:var(--rr-gold)]"
                  : "border-[color:var(--rr-border)] bg-[rgba(255,255,255,0.02)] text-[color:var(--rr-muted)] hover:border-[color:var(--rr-border-strong)] hover:text-[color:var(--rr-text)]",
              )}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
}
