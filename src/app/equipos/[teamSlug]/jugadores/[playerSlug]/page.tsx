import type { Metadata } from "next";
import { PublicSiteLayout } from "@/components/layout/public-site-layout";
import { PlayerDetailPage } from "@/components/public/player-detail-page";
import { PublicEmptyState } from "@/components/public/public-empty-state";
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
  return getAcademyPlayerStaticParamsFromDb();
}

export async function generateMetadata({
  params,
}: AcademyPlayerDetailRouteProps): Promise<Metadata> {
  const { teamSlug, playerSlug } = await params;
  const player = await getAcademyPlayerDetailFromDb(teamSlug, playerSlug);

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

  if (!dbPlayer || dbPlayer.teamSlug !== teamSlug) {
    return (
      <PublicSiteLayout activeNav="equipos">
        <PublicEmptyState
          title="No hay datos del jugador"
          description="Cuando este jugador tenga una ficha visible en la DB, se mostrara aqui."
        />
      </PublicSiteLayout>
    );
  }

  return (
    <PublicSiteLayout activeNav="equipos" debugDataSource={{ source: "db", note: `${teamSlug}/${playerSlug}` }}>
      <PlayerDetailPage player={dbPlayer} />
    </PublicSiteLayout>
  );
}
