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
  getAcademyPlayerSlugs,
  findAcademyPlayersBySlug,
  getAcademyPlayerHref,
} from "@/lib/public/player-profile-content";

type PlayerDetailRouteProps = {
  params: Promise<{
    playerSlug: string;
  }>;
};

export function generateStaticParams() {
  return Array.from(new Set([...getFirstTeamPlayerSlugs(), ...getAcademyPlayerSlugs()])).map(
    (playerSlug) => ({
      playerSlug,
    }),
  );
}

export async function generateMetadata({
  params,
}: PlayerDetailRouteProps): Promise<Metadata> {
  const { playerSlug } = await params;
  const player = getFirstTeamPlayerDetail(playerSlug);
  const academyMatches = findAcademyPlayersBySlug(playerSlug);

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
    description: `Ficha publica de ${player.name}, ${player.position.toLowerCase()} del ${player.teamLabel}.`,
  };
}

export default async function PlayerDetailRoute({
  params,
}: PlayerDetailRouteProps) {
  const { playerSlug } = await params;
  const player = getFirstTeamPlayerDetail(playerSlug);
  const academyMatches = findAcademyPlayersBySlug(playerSlug);

  if (player) {
    return (
      <PublicSiteLayout activeNav="primer-equipo">
        <PlayerDetailPage player={player} />
      </PublicSiteLayout>
    );
  }

  if (academyMatches.length === 1) {
    const academyPlayer = academyMatches[0];
    const academyHref = getAcademyPlayerHref(academyPlayer.teamSlug, academyPlayer.slug);

    if (academyHref) {
      redirect(academyHref);
    }
  }

  if (academyMatches.length > 1) {
    const playerName = academyMatches[0].name;

    return (
      <PublicSiteLayout activeNav="equipos">
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
            {academyMatches.map((academyPlayer) => {
              const academyHref = getAcademyPlayerHref(academyPlayer.teamSlug, academyPlayer.slug);

              if (!academyHref) {
                return null;
              }

              return (
                <Link
                  key={`${academyPlayer.teamSlug}-${academyPlayer.slug}`}
                  href={academyHref}
                  className="rr-panel-dark border border-[color:var(--rr-border)] px-5 py-5 transition hover:-translate-y-0.5 hover:border-[color:var(--rr-border-strong)]"
                >
                  <p className="rr-kicker text-[0.78rem] text-[color:var(--rr-gold)]">
                    {academyPlayer.teamLabel}
                  </p>
                  <h2 className="rr-display mt-3 text-[2.2rem] leading-[0.92] text-white">
                    {academyPlayer.name}
                  </h2>
                  <p className="mt-2 text-[1rem] text-[color:var(--rr-muted)]">
                    {academyPlayer.position} · {academyPlayer.seasonLabel}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      </PublicSiteLayout>
    );
  }

  notFound();
}
