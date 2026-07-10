import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { PublicSiteLayout } from "@/components/layout/public-site-layout";
import { PlayerDetailPage } from "@/components/public/player-detail-page";
import {
  getFirstTeamPlayerDetail,
  getFirstTeamPlayerSlugs,
} from "@/lib/public/first-team-squad-content";
import {
  findAcademyPlayersBySlug,
  getAcademyPlayerHref,
  getAcademyPlayerSlugs,
} from "@/lib/public/player-profile-content";
import type { PublicDataSourceInfo } from "@/lib/public/data-source";
import {
  findPublicAcademyPlayersBySlugFromDb,
  getAcademyPlayerStaticParamsFromDb,
  getFirstTeamPlayerSlugsFromDb,
  getPublicPlayerDetailFromDb,
} from "@/server/services/public/player-detail";

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
      ...getFirstTeamPlayerSlugs(),
      ...getAcademyPlayerSlugs(),
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
  const player = dbPlayer ?? getFirstTeamPlayerDetail(playerSlug);
  const dbAcademyMatches = player ? [] : await findPublicAcademyPlayersBySlugFromDb(playerSlug);
  const academyMatches = dbAcademyMatches.length > 0 ? dbAcademyMatches : findAcademyPlayersBySlug(playerSlug);

  if (!player) {
    if (academyMatches.length === 1) {
      const academyPlayer = academyMatches[0];

      return {
        title: `${academyPlayer.name} | ${academyPlayer.teamLabel}`,
        description: `Ficha publica de ${academyPlayer.name}, ${academyPlayer.position.toLowerCase()} de ${academyPlayer.teamLabel}.`,
      };
    }

    if (academyMatches.length > 1) {
      return {
        title: "Selecciona equipo | Rising Raimon",
        description: `El jugador ${academyMatches[0].name} tiene mas de una ruta disponible en la cantera.`,
      };
    }

    return {
      title: "Jugador no encontrado | Rising Raimon",
    };
  }

  return {
    title: `${player.name} | ${player.teamLabel}`,
    description: `Ficha publica de ${player.name}, ${player.position.toLowerCase()} en la temporada ${player.seasonLabel}.`,
  };
}

export default async function PlayerDetailRoute({
  params,
}: PlayerDetailRouteProps) {
  const { playerSlug } = await params;
  const dbPlayer = await getPublicPlayerDetailFromDb(playerSlug);
  const player = dbPlayer ?? getFirstTeamPlayerDetail(playerSlug);
  const dbAcademyMatches = player ? [] : await findPublicAcademyPlayersBySlugFromDb(playerSlug);
  const academyMatches = dbAcademyMatches.length > 0 ? dbAcademyMatches : findAcademyPlayersBySlug(playerSlug);
  const dataSource: PublicDataSourceInfo = {
    source: dbPlayer || dbAcademyMatches.length > 0 ? "db" : "mock",
    note: playerSlug,
  };

  if (player) {
    return (
      <PublicSiteLayout
        activeNav={player.teamType === "first-team" ? "primer-equipo" : "equipos"}
        debugDataSource={dataSource}
      >
        <PlayerDetailPage player={player} />
      </PublicSiteLayout>
    );
  }

  if (academyMatches.length === 1) {
    const academyPlayer = academyMatches[0];
    redirect(getAcademyPlayerHref(academyPlayer.teamSlug, academyPlayer.slug) ?? "/equipos");
  }

  if (academyMatches.length > 1) {
    const playerName = academyMatches[0].name;

    return (
      <PublicSiteLayout activeNav="equipos" debugDataSource={dataSource}>
        <section className="mx-auto w-full max-w-[1120px] px-5 py-14 md:px-8 md:py-18 xl:px-16">
          <div className="rr-panel max-w-2xl px-8 py-8">
            <p className="rr-kicker text-[color:var(--rr-gold)]">Ruta global</p>
            <h1 className="rr-display mt-4 text-[3.4rem] leading-[0.92] text-white md:text-[4.4rem]">
              {playerName}
            </h1>
            <p className="mt-4 text-[1.05rem] text-[color:var(--rr-muted)]">
              Este jugador aparece en mas de un equipo. Elige la ficha publica correcta.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {academyMatches.map((academyPlayer) => (
              <Link
                key={`${academyPlayer.teamSlug}-${academyPlayer.slug}`}
                href={getAcademyPlayerHref(academyPlayer.teamSlug, academyPlayer.slug) ?? "/equipos"}
                className="rr-panel-dark border border-[color:var(--rr-border)] px-5 py-5 transition hover:-translate-y-0.5 hover:border-[color:var(--rr-border-strong)]"
              >
                <p className="rr-kicker text-[0.78rem] text-[color:var(--rr-gold)]">
                  {academyPlayer.teamLabel}
                </p>
                <h2 className="rr-display mt-3 text-[2.2rem] leading-[0.92] text-white">
                  {academyPlayer.name}
                </h2>
                <p className="mt-2 text-[1rem] text-[color:var(--rr-muted)]">
                  {academyPlayer.position} | {academyPlayer.seasonLabel}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </PublicSiteLayout>
    );
  }

  notFound();
}
