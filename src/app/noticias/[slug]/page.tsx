import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicSiteLayout } from "@/components/layout/public-site-layout";
import { NewsArticlePage } from "@/components/public/news-article-page";
import {
  getPublicNewsArticles,
  getResolvedPublicNewsArticleBySlug,
  getResolvedRelatedPublicNewsArticles,
} from "@/server/services/public/news-content";

type NewsDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const revalidate = 300;

export async function generateStaticParams() {
  const articles = await getPublicNewsArticles();

  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: NewsDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getResolvedPublicNewsArticleBySlug(slug);

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
  const article = await getResolvedPublicNewsArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = await getResolvedRelatedPublicNewsArticles(slug);

  return (
    <PublicSiteLayout activeNav="noticias">
      <NewsArticlePage article={article} relatedArticles={relatedArticles} />
    </PublicSiteLayout>
  );
}
