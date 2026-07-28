import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicSiteLayout } from "@/components/layout/public-site-layout";
import { MatchDetailPage } from "@/components/public/match-detail-page";
import { buildPublicPageMetadata } from "@/lib/seo";
import {
  getAcademyMatchDetailFromDb,
  getAcademyMatchDetailStaticParamsFromDb,
} from "@/server/services/public/match-detail";

export const revalidate = 300;

type AcademyMatchDetailPageProps = {
  params: Promise<{
    teamSlug: string;
    matchId: string;
  }>;
};

export async function generateStaticParams() {
  return getAcademyMatchDetailStaticParamsFromDb();
}

export async function generateMetadata({
  params,
}: AcademyMatchDetailPageProps): Promise<Metadata> {
  const { teamSlug, matchId } = await params;
  const detail = await getAcademyMatchDetailFromDb(teamSlug, matchId);

  if (!detail) {
    return {
      title: "Partido no encontrado | Equipos",
    };
  }

  return {
    ...buildPublicPageMetadata({
      title: `${detail.match.homeTeam.name} vs ${detail.match.awayTeam.name} | ${detail.context?.teamName ?? "Equipo"}`,
      description: `Detalle público del partido ${detail.match.homeTeam.name} vs ${detail.match.awayTeam.name}.`,
      path: `/equipos/${teamSlug}/partidos/${matchId}`,
    }),
  };
}

export default async function AcademyMatchDetailPage({
  params,
}: AcademyMatchDetailPageProps) {
  const { teamSlug, matchId } = await params;
  const detail = await getAcademyMatchDetailFromDb(teamSlug, matchId);

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
