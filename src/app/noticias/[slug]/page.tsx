import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicSiteLayout } from "@/components/layout/public-site-layout";
import { NewsArticlePage } from "@/components/public/news-article-page";
import {
  getPublicNewsArticleBySlug,
  getRelatedPublicNewsArticles,
  PUBLIC_NEWS_ARTICLES,
} from "@/lib/public/news-content";

type NewsDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  return PUBLIC_NEWS_ARTICLES.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: NewsDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getPublicNewsArticleBySlug(slug);

  if (!article) {
    return {
      title: "Noticia no encontrada",
    };
  }

  return {
    title: article.title,
    description: article.excerpt,
  };
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug } = await params;
  const article = getPublicNewsArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = getRelatedPublicNewsArticles(slug);

  return (
    <PublicSiteLayout activeNav="noticias">
      <NewsArticlePage article={article} relatedArticles={relatedArticles} />
    </PublicSiteLayout>
  );
}
