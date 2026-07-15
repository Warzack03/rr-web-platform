import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PublicSiteLayout } from "@/components/layout/public-site-layout";
import { PlayerDetailPage } from "@/components/public/player-detail-page";
import { PublicEmptyState } from "@/components/public/public-empty-state";
import { getAcademyPlayerHref } from "@/lib/public/player-profile-content";
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
  const academyMatches = dbPlayer ? [] : await findPublicAcademyPlayersBySlugFromDb(playerSlug);

  if (!dbPlayer) {
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
    title: `${dbPlayer.name} | ${dbPlayer.teamLabel}`,
    description: `Ficha publica de ${dbPlayer.name}, ${dbPlayer.position.toLowerCase()} en la temporada ${dbPlayer.seasonLabel}.`,
  };
}

export default async function PlayerDetailRoute({
  params,
}: PlayerDetailRouteProps) {
  const { playerSlug } = await params;
  const dbPlayer = await getPublicPlayerDetailFromDb(playerSlug);
  const academyMatches = dbPlayer ? [] : await findPublicAcademyPlayersBySlugFromDb(playerSlug);
  const dataSource: PublicDataSourceInfo = {
    source: "db",
    note: playerSlug,
  };

  if (dbPlayer) {
    return (
      <PublicSiteLayout
        activeNav={dbPlayer.teamType === "first-team" ? "primer-equipo" : "equipos"}
        debugDataSource={dataSource}
      >
        <PlayerDetailPage player={dbPlayer} />
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

  return (
    <PublicSiteLayout activeNav="equipos">
      <PublicEmptyState
        title="No hay datos del jugador"
        description="Cuando este jugador tenga una ficha visible en la DB, se mostrara aqui."
      />
    </PublicSiteLayout>
  );
}
