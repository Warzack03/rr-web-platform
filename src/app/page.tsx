import type { Metadata } from "next";
import { PublicSiteLayout } from "@/components/layout/public-site-layout";
import { HomeAcademySummary } from "@/components/public/home-academy-summary";
import { HomeFirstTeamBlock } from "@/components/public/home-first-team-block";
import { HomeHero } from "@/components/public/home-hero";
import { HomeNewsSection } from "@/components/public/home-news-section";
import { PublicEmptyState } from "@/components/public/public-empty-state";
import { getPublicHomePageContentWithSource } from "@/lib/public/home-content";

export const metadata: Metadata = {
  title: "Home",
  description: "Entrada publica a la actualidad, el Primer Equipo y la cantera de Rising Raimon.",
};

export const revalidate = 300;

export default async function HomePage() {
  const result = await getPublicHomePageContentWithSource();
  const content = result?.content;

  if (!content) {
    return (
      <PublicSiteLayout activeNav="home">
        <PublicEmptyState
          title="No hay datos publicados"
          description="Cuando el backoffice tenga temporada, equipos y noticias publicados, la portada se mostrara aqui."
        />
      </PublicSiteLayout>
    );
  }

  return (
    <PublicSiteLayout activeNav="home" debugDataSource={result?.dataSource}>
      <HomeHero content={content.hero} />
      <HomeFirstTeamBlock content={content.firstTeam} />
      <HomeNewsSection content={content.news} />
      <HomeAcademySummary content={content.academy} />
    </PublicSiteLayout>
  );
}
