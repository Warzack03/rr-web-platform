import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicSiteLayout } from "@/components/layout/public-site-layout";
import { PlayerDetailPage } from "@/components/public/player-detail-page";
import {
  getAcademyPlayerDetail,
  getAcademyPlayerStaticParams,
} from "@/lib/public/player-profile-content";

type AcademyPlayerDetailRouteProps = {
  params: Promise<{
    teamSlug: string;
    playerSlug: string;
  }>;
};

export function generateStaticParams() {
  return getAcademyPlayerStaticParams();
}

export async function generateMetadata({
  params,
}: AcademyPlayerDetailRouteProps): Promise<Metadata> {
  const { teamSlug, playerSlug } = await params;
  const player = getAcademyPlayerDetail(teamSlug, playerSlug);

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
  const player = getAcademyPlayerDetail(teamSlug, playerSlug);

  if (!player || player.teamSlug !== teamSlug) {
    notFound();
  }

  return (
    <PublicSiteLayout activeNav="equipos">
      <PlayerDetailPage player={player} />
    </PublicSiteLayout>
  );
}
