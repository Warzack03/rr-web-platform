import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicSiteLayout } from "@/components/layout/public-site-layout";
import { PlayerDetailPage } from "@/components/public/player-detail-page";
import {
  getAcademyPlayerDetail,
  getAcademyPlayerStaticParams,
} from "@/lib/public/player-profile-content";
import type { PublicDataSourceInfo } from "@/lib/public/data-source";
import {
  getAcademyPlayerDetailFromDb,
  getAcademyPlayerStaticParamsFromDb,
} from "@/server/services/public/player-detail";

type AcademyPlayerDetailRouteProps = {
  params: Promise<{
    teamSlug: string;
    playerSlug: string;
  }>;
};

export const revalidate = 300;

export async function generateStaticParams() {
  const [dbParams, mockParams] = await Promise.all([
    getAcademyPlayerStaticParamsFromDb(),
    Promise.resolve(getAcademyPlayerStaticParams()),
  ]);

  return Array.from(
    new Map(
      [...dbParams, ...mockParams].map((param) => [`${param.teamSlug}:${param.playerSlug}`, param]),
    ).values(),
  );
}

export async function generateMetadata({
  params,
}: AcademyPlayerDetailRouteProps): Promise<Metadata> {
  const { teamSlug, playerSlug } = await params;
  const player =
    (await getAcademyPlayerDetailFromDb(teamSlug, playerSlug)) ?? getAcademyPlayerDetail(teamSlug, playerSlug);

  if (!player) {
    return {
      title: "Jugador no encontrado | Equipos",
    };
  }

  return {
    title: `${player.name} | ${player.teamLabel}`,
    description: `Ficha publica de ${player.name}, ${player.position.toLowerCase()} de ${player.teamLabel}.`,
  };
}

export default async function AcademyPlayerDetailRoute({
  params,
}: AcademyPlayerDetailRouteProps) {
  const { teamSlug, playerSlug } = await params;
  const dbPlayer = await getAcademyPlayerDetailFromDb(teamSlug, playerSlug);
  const player = dbPlayer ?? getAcademyPlayerDetail(teamSlug, playerSlug);
  const dataSource: PublicDataSourceInfo = {
    source: dbPlayer ? "db" : "mock",
    note: `${teamSlug}/${playerSlug}`,
  };

  if (!player || player.teamSlug !== teamSlug) {
    notFound();
  }

  return (
    <PublicSiteLayout activeNav="equipos" debugDataSource={dataSource}>
      <PlayerDetailPage player={player} />
    </PublicSiteLayout>
  );
}
