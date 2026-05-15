import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { DemoNews } from "@/src/lib/demo-data";

type NewsListItemProps = {
  item: DemoNews;
};

export function NewsListItem({ item }: NewsListItemProps) {
  return (
    <Link
      href={`/noticias/${item.slug}`}
      className="group flex flex-col gap-3 rounded-[20px] border border-[var(--rr-border)] bg-[var(--rr-surface)] p-4 transition hover:border-[var(--rr-border-strong)]"
    >
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--rr-accent)]">
          {item.category}
        </span>
        <span className="text-sm text-[var(--rr-text-soft)]">{item.dateLabel}</span>
      </div>
      <h3 className="font-display text-3xl uppercase leading-none text-white">{item.title}</h3>
      <p className="text-base leading-7 text-[var(--rr-text-muted)]">{item.excerpt}</p>
      <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--rr-accent)]">
        Abrir noticia
        <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
