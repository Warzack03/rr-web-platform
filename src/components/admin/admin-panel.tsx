import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type AdminPanelProps = {
  children: ReactNode;
  className?: string;
};

export function AdminPanel({ children, className }: AdminPanelProps) {
  return (
    <section
      className={cn(
        "rounded-[14px] border border-[color:var(--rr-border)] bg-[linear-gradient(180deg,rgba(18,29,47,0.98),rgba(10,18,31,0.98))] shadow-[0_12px_30px_rgba(0,0,0,0.22)]",
        className,
      )}
    >
      {children}
    </section>
  );
}
