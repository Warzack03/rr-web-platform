import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MatchDetailPage } from "@/components/public/match-detail-page";
import { PublicSiteLayout } from "@/components/layout/public-site-layout";
import { buildPublicPageMetadata } from "@/lib/seo";
import {
  getFirstTeamMatchDetailFromDb,
  getFirstTeamMatchDetailIdsFromDb,
} from "@/server/services/public/match-detail";

export const revalidate = 300;

type FirstTeamMatchDetailPageProps = {
  params: Promise<{
    matchId: string;
  }>;
};

export async function generateStaticParams() {
  const dbIds = await getFirstTeamMatchDetailIdsFromDb();

  return dbIds.map((matchId) => ({
    matchId,
  }));
}

export async function generateMetadata({
  params,
}: FirstTeamMatchDetailPageProps): Promise<Metadata> {
  const { matchId } = await params;
  const detail = await getFirstTeamMatchDetailFromDb(matchId);

  if (!detail) {
    return {
      title: "Partido no encontrado | Primer Equipo",
    };
  }

  return {
    ...buildPublicPageMetadata({
      title: `${detail.match.homeTeam.name} vs ${detail.match.awayTeam.name} | Primer Equipo`,
      description: `Detalle público del partido ${detail.match.homeTeam.name} vs ${detail.match.awayTeam.name}.`,
      path: `/primer-equipo/partidos/${matchId}`,
    }),
  };
}

export default async function FirstTeamMatchDetailRoute({
  params,
}: FirstTeamMatchDetailPageProps) {
  const { matchId } = await params;
  const detail = await getFirstTeamMatchDetailFromDb(matchId);

  if (!detail) {
    notFound();
  }

  return (
    <PublicSiteLayout activeNav="primer-equipo">
      <MatchDetailPage
        detail={detail}
        backHref="/primer-equipo/calendario"
        backLabel="Volver al calendario"
      />
    </PublicSiteLayout>
  );
}
