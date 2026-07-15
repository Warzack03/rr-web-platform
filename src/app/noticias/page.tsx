import type { Metadata } from "next";
import { PublicSiteLayout } from "@/components/layout/public-site-layout";
import { NewsGrid } from "@/components/public/news-grid";
import { NewsHero } from "@/components/public/news-hero";
import { PublicEmptyState } from "@/components/public/public-empty-state";
import {
  getFeaturedPublicNewsArticle,
  getPublicNewsArticlesWithSource,
} from "@/server/services/public/news-content";

export const metadata: Metadata = {
  title: "Noticias",
  description: "Centro publico de noticias, cronicas y actualidad de Rising Raimon.",
};

export const revalidate = 300;

export default async function NewsPage() {
  const result = await getPublicNewsArticlesWithSource();
  const articles = result.articles;
  const featuredArticle = (await getFeaturedPublicNewsArticle()) ?? articles[0];

  if (!featuredArticle) {
    return (
      <PublicSiteLayout activeNav="noticias" debugDataSource={result.dataSource}>
        <PublicEmptyState
          title="No hay noticias publicadas"
          description="Cuando haya noticias visibles en la DB, apareceran en esta seccion."
        />
      </PublicSiteLayout>
    );
  }

  const gridArticles = articles.filter((article) => article.slug !== featuredArticle?.slug);

  return (
    <PublicSiteLayout activeNav="noticias" debugDataSource={result.dataSource}>
      <NewsHero article={featuredArticle} />
      <NewsGrid articles={gridArticles} />
    </PublicSiteLayout>
  );
}
