import { AlertTriangle, Info, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AdminAlert } from "@/src/lib/admin-demo";

const iconMap = {
  gold: Sparkles,
  blue: Info,
  danger: AlertTriangle,
} as const;

type AdminAlertCardProps = {
  alert: AdminAlert;
};

export function AdminAlertCard({ alert }: AdminAlertCardProps) {
  const Icon = iconMap[alert.tone];

  return (
    <article
      className={cn(
        "rounded-[20px] border p-4",
        alert.tone === "gold" && "border-[var(--rr-border-strong)] bg-[rgba(253,203,88,0.08)]",
        alert.tone === "blue" && "border-[var(--rr-border)] bg-[rgba(30,47,71,0.48)]",
        alert.tone === "danger" && "border-[rgba(255,180,171,0.25)] bg-[rgba(147,0,10,0.12)]",
      )}
    >
      <div className="flex items-start gap-3">
        <div className="rounded-full bg-black/20 p-2 text-[var(--rr-accent)]">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-white">{alert.title}</p>
          <p className="mt-2 text-sm leading-6 text-[var(--rr-text-muted)]">{alert.detail}</p>
        </div>
      </div>
    </article>
  );
}
