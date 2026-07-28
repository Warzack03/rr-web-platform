import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicSiteLayout } from "@/components/layout/public-site-layout";
import { TeamOverviewPage } from "@/components/public/team-overview-page";
import { getPublicAcademyTeamPageContent } from "@/lib/public/team-page-content";
import { buildPublicPageMetadata } from "@/lib/seo";
import { getPublicNonFirstTeamSlugsFromDb } from "@/server/services/public/teams";

type TeamDetailPageProps = {
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
}: TeamDetailPageProps): Promise<Metadata> {
  const { teamSlug } = await params;
  const teamSummary = await getPublicAcademyTeamPageContent(teamSlug);

  if (!teamSummary) {
    return {
      title: "Equipo no encontrado",
    };
  }

  return {
    ...buildPublicPageMetadata({
      title: `${teamSummary.name} | Equipos`,
      description: `Resumen público de ${teamSummary.name}: plantilla, calendario, clasificación y estadísticas.`,
      path: `/equipos/${teamSummary.slug}`,
      imageUrl: teamSummary.heroImageUrl,
    }),
  };
}

export default async function AcademyTeamDetailPage({
  params,
}: TeamDetailPageProps) {
  const { teamSlug } = await params;
  const teamSummary = await getPublicAcademyTeamPageContent(teamSlug);

  if (!teamSummary) {
    notFound();
  }

  return (
    <PublicSiteLayout activeNav="equipos">
      <TeamOverviewPage content={teamSummary} />
    </PublicSiteLayout>
  );
}
