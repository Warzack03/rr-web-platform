import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicSiteLayout } from "@/components/layout/public-site-layout";
import { HomeAcademySummary } from "@/components/public/home-academy-summary";
import { HomeFirstTeamBlock } from "@/components/public/home-first-team-block";
import { HomeHero } from "@/components/public/home-hero";
import { HomeNewsSection } from "@/components/public/home-news-section";
import { getPublicHomePageContent } from "@/lib/public/home-content";

export const metadata: Metadata = {
  title: "Home",
  description: "Entrada publica a la actualidad, el Primer Equipo y la cantera de Rising Raimon.",
};

export default async function HomePage() {
  const content = await getPublicHomePageContent();

  if (!content) {
    notFound();
  }

  return (
    <PublicSiteLayout activeNav="home">
      <HomeHero content={content.hero} />
      <HomeFirstTeamBlock content={content.firstTeam} />
      <HomeNewsSection content={content.news} />
      <HomeAcademySummary content={content.academy} />
    </PublicSiteLayout>
  );
}
