import type { Metadata } from "next";
import { unstable_cache } from "next/cache";
import { PublicSiteLayout } from "@/components/layout/public-site-layout";
import { NewsGrid } from "@/components/public/news-grid";
import { NewsHero } from "@/components/public/news-hero";
import { PublicEmptyState } from "@/components/public/public-empty-state";
import { buildPublicPageMetadata } from "@/lib/seo";
import { getPublicNewsArticles } from "@/server/services/public/news-content";

export const metadata: Metadata = buildPublicPageMetadata({
  title: "Noticias",
  description: "Noticias, crónicas y actualidad deportiva de Rising Raimon.",
  path: "/noticias",
});

export const dynamic = "force-dynamic";

const getCachedPublicNewsArticles = unstable_cache(
  getPublicNewsArticles,
  ["public-news-list"],
  { revalidate: 300 },
);

export default async function NewsPage() {
  const articles = await getCachedPublicNewsArticles();
  const featuredArticle = articles.find((article) => article.featured) ?? articles[0];

  if (!featuredArticle) {
    return (
      <PublicSiteLayout activeNav="noticias">
        <PublicEmptyState
          title="No hay noticias publicadas"
          description="Cuando haya noticias visibles, apareceran en esta seccion."
        />
      </PublicSiteLayout>
    );
  }

  const gridArticles = articles.filter((article) => article.slug !== featuredArticle?.slug);

  return (
    <PublicSiteLayout activeNav="noticias">
      <NewsHero article={featuredArticle} />
      <NewsGrid articles={gridArticles} />
    </PublicSiteLayout>
  );
}
