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
        "rounded-[10px] border border-[color:var(--rr-border)] bg-[linear-gradient(180deg,rgba(19,30,49,0.98),rgba(11,21,37,0.96))] shadow-[0_18px_48px_rgba(0,0,0,0.28)]",
        className,
      )}
    >
      {children}
    </section>
  );
}
