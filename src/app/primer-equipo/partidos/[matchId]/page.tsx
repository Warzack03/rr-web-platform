import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MatchDetailPage } from "@/components/public/match-detail-page";
import { PublicSiteLayout } from "@/components/layout/public-site-layout";
import {
  getFirstTeamMatchDetail,
  getFirstTeamMatchDetailIds,
} from "@/lib/public/first-team-match-detail-content";

type FirstTeamMatchDetailPageProps = {
  params: Promise<{
    matchId: string;
  }>;
};

export function generateStaticParams() {
  return getFirstTeamMatchDetailIds().map((matchId) => ({
    matchId,
  }));
}

export async function generateMetadata({
  params,
}: FirstTeamMatchDetailPageProps): Promise<Metadata> {
  const { matchId } = await params;
  const detail = getFirstTeamMatchDetail(matchId);

  if (!detail) {
    return {
      title: "Partido no encontrado | Primer Equipo",
    };
  }

  return {
    title: `${detail.match.homeTeam.name} vs ${detail.match.awayTeam.name} | Primer Equipo`,
    description: `Detalle publico del partido ${detail.match.homeTeam.name} vs ${detail.match.awayTeam.name}.`,
  };
}

export default async function FirstTeamMatchDetailRoute({
  params,
}: FirstTeamMatchDetailPageProps) {
  const { matchId } = await params;
  const detail = getFirstTeamMatchDetail(matchId);

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
