import { CircleDashed } from "lucide-react";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  title: string;
  description: string;
  compact?: boolean;
};

export function EmptyState({ title, description, compact = false }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-[24px] border border-dashed border-[var(--rr-border)] bg-[var(--rr-surface)]",
        compact ? "px-4 py-4" : "px-5 py-6 sm:px-6 sm:py-7",
      )}
    >
      <div className="flex items-start gap-3">
        <div className="rounded-full bg-[var(--rr-accent)]/10 p-2 text-[var(--rr-accent)]">
          <CircleDashed className="h-4 w-4" />
        </div>
        <div>
          <h3 className="font-display text-2xl uppercase text-white">{title}</h3>
          <p className="mt-2 text-base leading-7 text-[var(--rr-text-muted)]">{description}</p>
        </div>
      </div>
    </div>
  );
}
