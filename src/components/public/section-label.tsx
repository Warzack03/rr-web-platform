import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type SectionLabelProps = {
  icon?: LucideIcon;
  children: ReactNode;
  className?: string;
};

export function SectionLabel({ icon: Icon, children, className }: SectionLabelProps) {
  return (
    <div className={cn("flex items-center justify-between gap-4", className)}>
      <div className="flex items-center gap-3">
        {Icon ? <Icon className="h-5 w-5 text-[color:var(--rr-gold)]" strokeWidth={1.9} /> : null}
        <h2 className="rr-display text-[2.1rem] leading-none text-[color:var(--rr-gold)] md:text-[2.6rem]">
          {children}
        </h2>
      </div>
    </div>
  );
}
