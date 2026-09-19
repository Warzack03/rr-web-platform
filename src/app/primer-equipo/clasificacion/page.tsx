import type { Metadata } from "next";
import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";
import { PublicSiteLayout } from "@/components/layout/public-site-layout";
import { PageHero } from "@/components/public/page-hero";
import { TeamStandingsPage } from "@/components/public/team-standings-page";
import { getPublicTeamHeroContent } from "@/lib/public/team-page-content";
import { buildPublicPageMetadata } from "@/lib/seo";
import { getFirstTeamStandingsContentFromDb } from "@/server/services/public/standings";

export const metadata: Metadata = buildPublicPageMetadata({
  title: "Clasificacion | Primer Equipo",
  description: "Clasificación pública del Primer Equipo de Rising Raimon.",
  path: "/primer-equipo/clasificacion",
});

export const dynamic = "force-dynamic";

const getCachedFirstTeamStandings = unstable_cache(
  getFirstTeamStandingsContentFromDb,
  ["public-first-team-standings"],
  { revalidate: 300 },
);

export default async function FirstTeamStandingPage() {
  const [content, heroContent] = await Promise.all([
    getCachedFirstTeamStandings(),
    getPublicTeamHeroContent("primer-equipo"),
  ]);

  if (!content || !heroContent) {
    notFound();
  }

  return (
    <PublicSiteLayout activeNav="primer-equipo">
      <PageHero content={heroContent} activeKey="standing" />
      <TeamStandingsPage content={content} />
    </PublicSiteLayout>
  );
}
