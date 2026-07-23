import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { NewsArticleContent } from "@/components/public/news-article-content";
import { NewsArticleHeader } from "@/components/public/news-article-header";
import { NewsArticleHeroImage } from "@/components/public/news-article-hero-image";
import { RelatedNewsAside } from "@/components/public/related-news-aside";
import { ShareArticleActions } from "@/components/public/share-article-actions";
import type { PublicNewsArticle } from "@/lib/contracts/public";

type NewsArticlePageProps = {
  article: PublicNewsArticle;
  relatedArticles: PublicNewsArticle[];
};

export function NewsArticlePage({ article, relatedArticles }: NewsArticlePageProps) {
  return (
    <section className="mx-auto w-full max-w-[1280px] px-5 py-8 md:px-8 md:py-10 xl:px-16">
      <Link
        href="/noticias"
        className="rr-kicker inline-flex items-center gap-2 text-[0.84rem] text-[color:var(--rr-gold)] transition hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={1.9} />
        Volver a noticias
      </Link>

      <div className="mt-6 grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start">
        <article className="space-y-7">
          <NewsArticleHeroImage
            category={article.category}
            imageTone={article.imageTone}
            alt={article.coverImageAlt}
          />
          <NewsArticleHeader article={article} />
          <div className="rr-bolt-divider" />
          <NewsArticleContent blocks={article.content} />
          <ShareArticleActions title={article.title} />
        </article>

        <RelatedNewsAside articles={relatedArticles} />
      </div>
    </section>
  );
}
