import type { Metadata } from "next";
import { PublicSiteLayout } from "@/components/layout/public-site-layout";
import { NewsGrid } from "@/components/public/news-grid";
import { NewsHero } from "@/components/public/news-hero";
import { FEATURED_PUBLIC_NEWS, PUBLIC_NEWS_GRID_ITEMS } from "@/lib/public/news-content";

export const metadata: Metadata = {
  title: "Noticias",
  description: "Centro publico de noticias, cronicas y actualidad de Rising Raimon.",
};

export default function NewsPage() {
  return (
    <PublicSiteLayout activeNav="noticias">
      <NewsHero article={FEATURED_PUBLIC_NEWS} />
      <NewsGrid articles={PUBLIC_NEWS_GRID_ITEMS} />
    </PublicSiteLayout>
  );
}
