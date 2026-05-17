import Link from "next/link";
import { ArrowRight } from "lucide-react";

type AdminActionCardProps = {
  href: string;
  title: string;
  description: string;
};

export function AdminActionCard({
  href,
  title,
  description,
}: AdminActionCardProps) {
  return (
    <Link
      href={href}
      className="group rounded-[20px] border border-[var(--rr-border)] bg-[rgba(8,20,38,0.52)] p-4 transition duration-300 hover:-translate-y-1 hover:border-[var(--rr-border-strong)]"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-display text-3xl uppercase text-white">{title}</p>
          <p className="mt-3 text-base leading-6 text-[var(--rr-text-muted)]">{description}</p>
        </div>
        <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-[var(--rr-accent)] transition group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
