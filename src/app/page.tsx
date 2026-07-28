import type { Metadata } from "next";
import { PublicSiteLayout } from "@/components/layout/public-site-layout";
import { HomeAcademySummary } from "@/components/public/home-academy-summary";
import { HomeFirstTeamBlock } from "@/components/public/home-first-team-block";
import { HomeHero } from "@/components/public/home-hero";
import { HomeNewsSection } from "@/components/public/home-news-section";
import { PublicEmptyState } from "@/components/public/public-empty-state";
import { getPublicHomePageContent } from "@/lib/public/home-content";
import { buildPublicPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPublicPageMetadata({
  title: "Home",
  description: "Entrada a la actualidad, el Primer Equipo y la cantera de Rising Raimon.",
  path: "/",
});

export const revalidate = 300;

export default async function HomePage() {
  const content = await getPublicHomePageContent();

  if (!content) {
    return (
      <PublicSiteLayout activeNav="home">
        <PublicEmptyState
          title="No hay datos publicados"
          description="La portada se activara cuando haya temporada, equipos y noticias visibles."
        />
      </PublicSiteLayout>
    );
  }

  return (
    <PublicSiteLayout activeNav="home">
      <HomeHero content={content.hero} />
      <HomeFirstTeamBlock content={content.firstTeam} />
      {content.news ? <HomeNewsSection content={content.news} /> : null}
      <HomeAcademySummary content={content.academy} />
    </PublicSiteLayout>
  );
}
