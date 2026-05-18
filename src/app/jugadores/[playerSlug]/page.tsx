import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicSiteLayout } from "@/components/layout/public-site-layout";
import { PlayerDetailPage } from "@/components/public/player-detail-page";
import {
  getFirstTeamPlayerDetail,
  getFirstTeamPlayerSlugs,
} from "@/lib/public/first-team-squad-content";

type PlayerDetailRouteProps = {
  params: Promise<{
    playerSlug: string;
  }>;
};

export function generateStaticParams() {
  return getFirstTeamPlayerSlugs().map((playerSlug) => ({
    playerSlug,
  }));
}

export async function generateMetadata({
  params,
}: PlayerDetailRouteProps): Promise<Metadata> {
  const { playerSlug } = await params;
  const player = getFirstTeamPlayerDetail(playerSlug);

  if (!player) {
    return {
      title: "Jugador no encontrado | Rising Raimon",
    };
  }

  return {
    title: `${player.name} | ${player.teamLabel}`,
    description: `Ficha publica de ${player.name}, ${player.position.toLowerCase()} del ${player.teamLabel}.`,
  };
}

export default async function PlayerDetailRoute({
  params,
}: PlayerDetailRouteProps) {
  const { playerSlug } = await params;
  const player = getFirstTeamPlayerDetail(playerSlug);

  if (!player) {
    notFound();
  }

  return (
    <PublicSiteLayout activeNav="primer-equipo">
      <PlayerDetailPage player={player} />
    </PublicSiteLayout>
  );
}
