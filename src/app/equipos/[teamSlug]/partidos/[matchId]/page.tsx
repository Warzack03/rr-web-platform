import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicSiteLayout } from "@/components/layout/public-site-layout";
import { MatchDetailPage } from "@/components/public/match-detail-page";
import {
  getAcademyMatchDetail,
  getAcademyMatchDetailStaticParams,
} from "@/lib/public/academy-match-detail-content";
import { getPublicAcademyTeamPageContent } from "@/lib/public/team-page-content";

type AcademyMatchDetailPageProps = {
  params: Promise<{
    teamSlug: string;
    matchId: string;
  }>;
};

export async function generateStaticParams() {
  return getAcademyMatchDetailStaticParams();
}

export async function generateMetadata({
  params,
}: AcademyMatchDetailPageProps): Promise<Metadata> {
  const { teamSlug, matchId } = await params;
  const team = await getPublicAcademyTeamPageContent(teamSlug);
  const detail = await getAcademyMatchDetail(teamSlug, matchId);

  if (!team || !detail) {
    return {
      title: "Partido no encontrado | Equipos",
    };
  }

  return {
    title: `${detail.match.homeTeam.name} vs ${detail.match.awayTeam.name} | ${team.name}`,
    description: `Detalle publico del partido ${detail.match.homeTeam.name} vs ${detail.match.awayTeam.name} de ${team.name}.`,
  };
}

export default async function AcademyMatchDetailPage({
  params,
}: AcademyMatchDetailPageProps) {
  const { teamSlug, matchId } = await params;
  const detail = await getAcademyMatchDetail(teamSlug, matchId);

  if (!detail) {
    notFound();
  }

  return (
    <PublicSiteLayout activeNav="equipos">
      <MatchDetailPage
        detail={detail}
        backHref={`/equipos/${teamSlug}/calendario`}
        backLabel="Volver al calendario"
      />
    </PublicSiteLayout>
  );
}
