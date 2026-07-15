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
        "rounded-[20px] border border-[color:var(--rr-border)] bg-[linear-gradient(160deg,rgba(255,255,255,0.055),rgba(255,255,255,0.028))] shadow-[var(--rr-shadow)] backdrop-blur-md",
        className,
      )}
    >
      {children}
    </section>
  );
}
