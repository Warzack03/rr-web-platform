import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicSiteLayout } from "@/components/layout/public-site-layout";
import { TeamSquadPage } from "@/components/public/team-squad-page";
import { getPublicAcademyTeamPageContent } from "@/lib/public/team-page-content";
import { buildPublicPageMetadata } from "@/lib/seo";
import { getPublicRosterContentFromDb } from "@/server/services/public/roster";
import { getPublicNonFirstTeamSlugsFromDb } from "@/server/services/public/teams";

type TeamPlaceholderPageProps = {
  params: Promise<{
    teamSlug: string;
  }>;
};

export const revalidate = 300;

export async function generateStaticParams() {
  const teamSlugs = await getPublicNonFirstTeamSlugsFromDb();

  return teamSlugs.map((teamSlug) => ({
    teamSlug,
  }));
}

export async function generateMetadata({
  params,
}: TeamPlaceholderPageProps): Promise<Metadata> {
  const { teamSlug } = await params;
  const teamSummary = await getPublicAcademyTeamPageContent(teamSlug);

  if (!teamSummary) {
    return {
      title: "Plantilla no encontrada | Equipos",
    };
  }

  return {
    ...buildPublicPageMetadata({
      title: `Plantilla | ${teamSummary.name}`,
      description: `Plantilla pública y cromos de ${teamSummary.name}.`,
      path: `/equipos/${teamSummary.slug}/plantilla`,
      imageUrl: teamSummary.heroImageUrl,
    }),
  };
}

export default async function AcademyTeamSquadRoute({
  params,
}: TeamPlaceholderPageProps) {
  const { teamSlug } = await params;
  const teamSummary = await getPublicAcademyTeamPageContent(teamSlug);
  const dbSquad = await getPublicRosterContentFromDb(teamSlug);

  if (!teamSummary) {
    notFound();
  }

  if (!dbSquad) {
    notFound();
  }

  return (
    <PublicSiteLayout activeNav="equipos">
      <TeamSquadPage
        squad={dbSquad}
        teamType="academy"
        badges={[teamSummary.competition, teamSummary.season]}
      />
    </PublicSiteLayout>
  );
}
