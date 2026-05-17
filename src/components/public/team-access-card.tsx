import Link from "next/link";
import type { LucideIcon } from "lucide-react";

type TeamAccessCardProps = {
  href: string;
  label: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

export function TeamAccessCard({
  href,
  label,
  title,
  description,
  icon: Icon,
}: TeamAccessCardProps) {
  return (
    <Link
      href={href}
      className="group rounded-[22px] border border-[var(--rr-border)] bg-[var(--rr-surface)] p-5 transition duration-300 hover:-translate-y-1 hover:border-[var(--rr-border-strong)]"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="rounded-full bg-[var(--rr-accent)]/10 p-3 text-[var(--rr-accent)]">
          <Icon className="h-5 w-5" />
        </div>
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--rr-text-soft)]">
          {label}
        </span>
      </div>

      <div className="mt-5 space-y-3">
        <h3 className="font-display text-3xl uppercase text-white">{title}</h3>
        <p className="text-base leading-7 text-[var(--rr-text-muted)]">{description}</p>
      </div>
    </Link>
  );
}
