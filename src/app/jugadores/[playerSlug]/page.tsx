import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicSiteLayout } from "@/components/layout/public-site-layout";
import { PlayerDetailPage } from "@/components/public/player-detail-page";
import {
  getAcademyPlayerStaticParamsFromDb,
  getFirstTeamPlayerSlugsFromDb,
  getPublicPlayerDetailFromDb,
} from "@/server/services/public/player-detail";
import { getGlobalPlayerHref } from "@/lib/public/player-routes";

type PlayerDetailRouteProps = {
  params: Promise<{
    playerSlug: string;
  }>;
};

export const revalidate = 300;

export async function generateStaticParams() {
  const [dbFirstTeamPlayerSlugs, dbAcademyParams] = await Promise.all([
    getFirstTeamPlayerSlugsFromDb(),
    getAcademyPlayerStaticParamsFromDb(),
  ]);

  return Array.from(
    new Set([
      ...dbFirstTeamPlayerSlugs,
      ...dbAcademyParams.map((param) => param.playerSlug),
    ]),
  ).map((playerSlug) => ({
    playerSlug,
  }));
}

export async function generateMetadata({
  params,
}: PlayerDetailRouteProps): Promise<Metadata> {
  const { playerSlug } = await params;
  const dbPlayer = await getPublicPlayerDetailFromDb(playerSlug);

  if (!dbPlayer) {
    return {
      title: "Jugador no encontrado | Rising Raimon",
    };
  }

  return {
    title: `${dbPlayer.name} | ${dbPlayer.teamLabel}`,
    description: `Ficha publica de ${dbPlayer.name}, ${dbPlayer.position.toLowerCase()} en la temporada ${dbPlayer.seasonLabel}.`,
    alternates: {
      canonical: getGlobalPlayerHref(playerSlug),
    },
  };
}

export default async function PlayerDetailRoute({
  params,
}: PlayerDetailRouteProps) {
  const { playerSlug } = await params;
  const dbPlayer = await getPublicPlayerDetailFromDb(playerSlug);

  if (dbPlayer) {
    return (
      <PublicSiteLayout activeNav={dbPlayer.teamType === "first-team" ? "primer-equipo" : "equipos"}>
        <PlayerDetailPage player={dbPlayer} />
      </PublicSiteLayout>
    );
  }

  notFound();
}
