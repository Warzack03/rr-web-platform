import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicSiteLayout } from "@/components/layout/public-site-layout";
import { PageHero } from "@/components/public/page-hero";
import { TeamStandingsPage } from "@/components/public/team-standings-page";
import { getPublicTeamHeroContent } from "@/lib/public/team-page-content";
import { buildPublicPageMetadata } from "@/lib/seo";
import { getAcademyTeamStandingsContentFromDb } from "@/server/services/public/standings";
import { getPublicNonFirstTeamSlugsFromDb } from "@/server/services/public/teams";

type TeamStandingsPageProps = {
  params: Promise<{
    teamSlug: string;
  }>;
};

export const revalidate = 300;

export async function generateStaticParams() {
  if (process.env.NEXT_PHASE === "phase-production-build") {
    return [];
  }

  const teamSlugs = await getPublicNonFirstTeamSlugsFromDb();

  return teamSlugs.map((teamSlug) => ({
    teamSlug,
  }));
}

export async function generateMetadata({
  params,
}: TeamStandingsPageProps): Promise<Metadata> {
  const { teamSlug } = await params;
  const content = await getAcademyTeamStandingsContentFromDb(teamSlug);

  if (!content) {
    return {
      title: "Clasificacion no encontrada",
    };
  }

  return {
    ...buildPublicPageMetadata({
      title: `Clasificacion | ${content.teamName}`,
      description: `Clasificación pública de ${content.teamName}.`,
      path: `/equipos/${content.slug}/clasificacion`,
    }),
  };
}

export default async function TeamStandingPage({
  params,
}: TeamStandingsPageProps) {
  const { teamSlug } = await params;
  const [content, heroContent] = await Promise.all([
    getAcademyTeamStandingsContentFromDb(teamSlug),
    getPublicTeamHeroContent(teamSlug),
  ]);

  if (!content || !heroContent || heroContent.variant !== "academy") {
    notFound();
  }

  return (
    <PublicSiteLayout activeNav="equipos">
      <PageHero content={heroContent} activeKey="standing" />
      <TeamStandingsPage content={content} />
    </PublicSiteLayout>
  );
}
