import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { DemoNews } from "@/src/lib/demo-data";

type NewsCardProps = {
  item: DemoNews;
};

export function NewsCard({ item }: NewsCardProps) {
  return (
    <Link
      href={`/noticias/${item.slug}`}
      className="block rounded-[22px] border border-[var(--rr-border)] bg-[var(--rr-surface)] p-5 transition duration-300 hover:border-[var(--rr-border-strong)]"
    >
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--rr-accent)]">
          {item.category}
        </span>
        <span className="text-sm text-[var(--rr-text-soft)]">{item.dateLabel}</span>
      </div>
      <h3 className="mt-4 font-display text-3xl uppercase leading-none text-white">{item.title}</h3>
      <p className="mt-4 text-base leading-7 text-[var(--rr-text-muted)]">{item.excerpt}</p>
      <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--rr-accent)]">
        Leer mas
        <ChevronRight className="h-4 w-4" />
      </div>
    </Link>
  );
}
