import Link from "next/link";
import { NewsArtwork } from "@/components/public/news-artwork";
import type { PublicNewsArticle } from "@/lib/contracts/public";

type RelatedNewsAsideProps = {
  articles: PublicNewsArticle[];
};

export function RelatedNewsAside({ articles }: RelatedNewsAsideProps) {
  if (articles.length === 0) {
    return null;
  }

  return (
    <aside className="rr-panel h-fit p-5 md:p-6 xl:sticky xl:top-24">
      <div className="flex items-center gap-3">
        <span className="h-7 w-[3px] bg-[color:var(--rr-gold)]" aria-hidden="true" />
        <h2 className="rr-display text-[2.1rem] leading-none text-white">Noticias relacionadas</h2>
      </div>

      <div className="mt-6 space-y-4">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/noticias/${article.slug}`}
            className="group block overflow-hidden rounded-[6px] border border-[color:var(--rr-border)] bg-[rgba(255,255,255,0.02)] transition hover:-translate-y-0.5 hover:border-[color:var(--rr-border-strong)]"
          >
            <NewsArtwork
              imageTone={article.imageTone}
              imageUrl={article.coverImageUrl}
              alt={article.coverImageAlt}
              className="aspect-[16/10] border-b border-[color:var(--rr-border)]"
            />
            <div className="space-y-3 p-4">
              <span className="rr-kicker text-[0.78rem] text-[color:var(--rr-gold)]">{article.category}</span>
              <h3 className="rr-display text-[2rem] leading-[0.95] text-white transition group-hover:text-[color:var(--rr-gold)]">
                {article.title}
              </h3>
              <p className="text-[0.9rem] uppercase tracking-[0.14em] text-[color:var(--rr-muted)]/82">
                {article.dateLabel}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </aside>
  );
}
