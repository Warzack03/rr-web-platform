import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type AdminPanelProps = {
  title?: string;
  children: ReactNode;
  className?: string;
};

export function AdminPanel({ title, children, className }: AdminPanelProps) {
  return (
    <section
      className={cn(
        "rounded-[22px] border border-[var(--rr-border)] bg-[rgba(39,58,88,0.72)] p-4 sm:p-5",
        className,
      )}
    >
      {title ? (
        <h2 className="mb-4 font-display text-2xl uppercase text-white sm:text-3xl">{title}</h2>
      ) : null}
      {children}
    </section>
  );
}
