import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type MatchEventBadgeProps = {
  label: string;
  icon?: LucideIcon;
  tone?: "accent" | "neutral" | "live";
};

export function MatchEventBadge({
  label,
  icon: Icon,
  tone = "neutral",
}: MatchEventBadgeProps) {
  return (
    <span
      className={cn(
        "rr-kicker inline-flex min-h-9 items-center gap-2 border px-3 py-2 text-[0.75rem]",
        tone === "accent" &&
          "border-[rgba(253,203,88,0.28)] bg-[rgba(253,203,88,0.12)] text-[color:var(--rr-gold)]",
        tone === "neutral" &&
          "border-[rgba(255,255,255,0.12)] bg-[rgba(7,15,25,0.34)] text-[color:var(--rr-muted)]",
        tone === "live" &&
          "border-[rgba(255,167,167,0.34)] bg-[rgba(255,167,167,0.12)] text-[#ffb4ab]",
      )}
    >
      {Icon ? <Icon className="h-3.5 w-3.5" strokeWidth={1.9} /> : null}
      <span>{label}</span>
    </span>
  );
}
