import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import {
  getAcademyPlayerStaticParamsFromDb,
} from "@/server/services/public/player-detail";
import { getGlobalPlayerHref } from "@/lib/public/player-routes";
import { buildPublicPageMetadata } from "@/lib/seo";

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
  const { playerSlug } = await params;

  return {
    ...buildPublicPageMetadata({
      title: "Ficha global de jugador",
      description: "La ficha canónica del jugador está disponible en su URL global.",
      path: getGlobalPlayerHref(playerSlug),
    }),
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function AcademyPlayerDetailRoute({
  params,
}: AcademyPlayerDetailRouteProps) {
  const { playerSlug } = await params;

  permanentRedirect(getGlobalPlayerHref(playerSlug));
}
