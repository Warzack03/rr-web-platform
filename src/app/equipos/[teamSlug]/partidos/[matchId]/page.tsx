import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicSiteLayout } from "@/components/layout/public-site-layout";
import { MatchDetailPage } from "@/components/public/match-detail-page";
import {
  getAcademyMatchDetail,
  getAcademyMatchDetailStaticParams,
} from "@/lib/public/academy-match-detail-content";
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
  const [mockParams, dbParams] = await Promise.all([
    getAcademyMatchDetailStaticParams(),
    getAcademyMatchDetailStaticParamsFromDb(),
  ]);

  return Array.from(
    new Map(
      [...dbParams, ...mockParams].map((item) => [`${item.teamSlug}:${item.matchId}`, item]),
    ).values(),
  );
}

export async function generateMetadata({
  params,
}: AcademyMatchDetailPageProps): Promise<Metadata> {
  const { teamSlug, matchId } = await params;
  const detail =
    (await getAcademyMatchDetailFromDb(teamSlug, matchId)) ??
    (await getAcademyMatchDetail(teamSlug, matchId));

  if (!detail) {
    return {
      title: "Partido no encontrado | Equipos",
    };
  }

  return {
    title: `${detail.match.homeTeam.name} vs ${detail.match.awayTeam.name} | ${detail.context?.teamName ?? "Equipo"}`,
    description: `Detalle publico del partido ${detail.match.homeTeam.name} vs ${detail.match.awayTeam.name} de ${detail.context?.teamName ?? "equipo"}.`,
  };
}

export default async function AcademyMatchDetailPage({
  params,
}: AcademyMatchDetailPageProps) {
  const { teamSlug, matchId } = await params;
  const dbDetail = await getAcademyMatchDetailFromDb(teamSlug, matchId);
  const detail = dbDetail ?? (await getAcademyMatchDetail(teamSlug, matchId));

  if (!detail) {
    notFound();
  }

  return (
    <PublicSiteLayout
      activeNav="equipos"
      debugDataSource={{
        source: dbDetail ? "db" : "mock",
        note: `${teamSlug}/${matchId}`,
      }}
    >
      <MatchDetailPage
        detail={detail}
        backHref={`/equipos/${teamSlug}/calendario`}
        backLabel="Volver al calendario"
      />
    </PublicSiteLayout>
  );
}
