import { CalendarDays, Shield, UserRound } from "lucide-react";
import type { PublicNewsArticle } from "@/lib/public/news-content";

type NewsArticleHeaderProps = {
  article: PublicNewsArticle;
};

export function NewsArticleHeader({ article }: NewsArticleHeaderProps) {
  return (
    <header className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <span className="rr-chip border-[color:var(--rr-border)] bg-[rgba(255,255,255,0.03)] text-[color:var(--rr-gold)]">
          {article.category}
        </span>
        {article.relatedTeam ? (
          <span className="rr-chip border-[color:var(--rr-border)] bg-[rgba(255,255,255,0.03)] text-[color:var(--rr-muted)]">
            {article.relatedTeam}
          </span>
        ) : null}
      </div>

      <h1 className="rr-display text-[3.35rem] leading-[0.92] text-white sm:text-[4rem] lg:text-[4.8rem]">
        {article.title}
      </h1>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-[0.92rem] uppercase tracking-[0.16em] text-[color:var(--rr-muted)]/88">
        <span className="inline-flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-[color:var(--rr-gold)]" strokeWidth={1.9} />
          {article.dateLabel}
        </span>
        <span className="inline-flex items-center gap-2">
          <UserRound className="h-4 w-4 text-[color:var(--rr-gold)]" strokeWidth={1.9} />
          {article.author}
        </span>
        {article.relatedTeam ? (
          <span className="inline-flex items-center gap-2">
            <Shield className="h-4 w-4 text-[color:var(--rr-gold)]" strokeWidth={1.9} />
            {article.relatedTeam}
          </span>
        ) : null}
      </div>

      <p className="max-w-[46rem] text-[1.05rem] leading-7 text-[color:var(--rr-muted)] md:text-[1.1rem]">
        {article.excerpt}
      </p>
    </header>
  );
}
