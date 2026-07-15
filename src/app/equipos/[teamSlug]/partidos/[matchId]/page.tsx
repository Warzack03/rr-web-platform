import type { Metadata } from "next";
import { PublicSiteLayout } from "@/components/layout/public-site-layout";
import { MatchDetailPage } from "@/components/public/match-detail-page";
import { PublicEmptyState } from "@/components/public/public-empty-state";
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
    title: `${detail.match.homeTeam.name} vs ${detail.match.awayTeam.name} | ${detail.context?.teamName ?? "Equipo"}`,
    description: `Detalle publico del partido ${detail.match.homeTeam.name} vs ${detail.match.awayTeam.name} de ${detail.context?.teamName ?? "equipo"}.`,
  };
}

export default async function AcademyMatchDetailPage({
  params,
}: AcademyMatchDetailPageProps) {
  const { teamSlug, matchId } = await params;
  const detail = await getAcademyMatchDetailFromDb(teamSlug, matchId);

  if (!detail) {
    return (
      <PublicSiteLayout activeNav="equipos">
        <PublicEmptyState
          title="No hay datos del partido"
          description="Cuando este partido tenga datos visibles en la DB, se mostrara aqui."
        />
      </PublicSiteLayout>
    );
  }

  return (
    <PublicSiteLayout
      activeNav="equipos"
      debugDataSource={{
        source: "db",
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
