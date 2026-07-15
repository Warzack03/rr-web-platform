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
        "group flex items-center justify-between gap-3 rounded-[16px] border text-left transition hover:-translate-y-0.5",
        compact ? "min-h-12 px-4 py-2.5" : "min-h-14 px-4.5 py-3.5",
        accent === "gold"
          ? "border-[rgba(243,203,69,0.3)] bg-[rgba(243,203,69,0.09)] text-white hover:bg-[rgba(243,203,69,0.13)]"
          : "border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.045)] text-white hover:border-[rgba(243,203,69,0.22)] hover:bg-[rgba(255,255,255,0.07)]",
      )}
    >
      <span className={cn("font-semibold text-inherit", compact ? "text-[0.86rem]" : "text-[0.92rem]")}>
        {label}
      </span>
      <ArrowRight className="h-4 w-4 text-[color:var(--rr-gold)] transition group-hover:translate-x-1" />
    </Link>
  );
}
