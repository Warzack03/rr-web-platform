import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type AdminQuickActionProps = {
  href: string;
  label: string;
  accent?: "gold" | "slate";
  compact?: boolean;
};

export function AdminQuickAction({
  href,
  label,
  accent = "gold",
  compact = false,
}: AdminQuickActionProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex items-center justify-between gap-3 rounded-[10px] border text-left transition hover:-translate-y-0.5",
        compact ? "min-h-12 px-3.5 py-2.5" : "min-h-14 px-4 py-3",
        accent === "gold"
          ? "border-[rgba(253,203,88,0.28)] bg-[rgba(253,203,88,0.08)] text-white hover:bg-[rgba(253,203,88,0.12)]"
          : "border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.04)] text-white hover:bg-[rgba(255,255,255,0.08)]",
      )}
    >
      <span className={cn("rr-kicker text-inherit", compact ? "text-[0.7rem]" : "text-[0.74rem]")}>
        {label}
      </span>
      <ArrowRight className="h-4 w-4 text-[color:var(--rr-gold)] transition group-hover:translate-x-1" />
    </Link>
  );
}
