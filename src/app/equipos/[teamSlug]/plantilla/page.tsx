import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicSiteLayout } from "@/components/layout/public-site-layout";
import { PremiumPlayerCard } from "@/components/public/premium-player-card";
import { SquadPageTitle } from "@/components/public/squad-page-title";
import { SquadSection } from "@/components/public/squad-section";
import { TeamSectionNavigation } from "@/components/public/team-section-navigation";
import { TeamRoutePlaceholder } from "@/components/public/team-route-placeholder";
import {
  getAcademyPlayerHref,
  getAcademyTeamSquadContent,
} from "@/lib/public/player-profile-content";
import type { PublicDataSourceInfo } from "@/lib/public/data-source";
import { getPublicAcademyTeamPageContent } from "@/lib/public/team-page-content";
import { getTeamSectionLinks } from "@/lib/public/team-section-links";
import { getPublicRosterContentFromDb } from "@/server/services/public/roster";

type TeamPlaceholderPageProps = {
  params: Promise<{
    teamSlug: string;
  }>;
};

export async function generateMetadata({
  params,
}: TeamPlaceholderPageProps): Promise<Metadata> {
  const { teamSlug } = await params;
  const teamSummary = await getPublicAcademyTeamPageContent(teamSlug);

  if (!teamSummary) {
    return {
      title: "Plantilla no encontrada | Equipos",
    };
  }

  return {
    title: `Plantilla | ${teamSummary.name}`,
    description: `Plantilla publica de ${teamSummary.name} en Rising Raimon.`,
  };
}

export default async function TeamSquadPage({
  params,
}: TeamPlaceholderPageProps) {
  const { teamSlug } = await params;
  const teamSummary = await getPublicAcademyTeamPageContent(teamSlug);
  const dbSquad = await getPublicRosterContentFromDb(teamSlug);
  const squad = dbSquad ?? getAcademyTeamSquadContent(teamSlug);
  const dataSource: PublicDataSourceInfo = {
    source: dbSquad ? "db" : "mock",
    note: teamSlug,
  };

  if (!teamSummary) {
    notFound();
  }

  if (!squad) {
    return (
      <PublicSiteLayout activeNav="equipos" debugDataSource={dataSource}>
        <TeamRoutePlaceholder
          eyebrow={teamSummary.name}
          title="Plantilla"
          description="Plantilla pendiente de publicar."
        />
      </PublicSiteLayout>
    );
  }

  const fieldGroups = [
    {
      key: "defensas",
      title: "Defensas",
      players: squad.fieldPlayers.filter((player) => player.group === "defensas"),
    },
    {
      key: "mediocentros",
      title: "Mediocentros",
      players: squad.fieldPlayers.filter((player) => player.group === "mediocentros"),
    },
    {
      key: "banda",
      title: "Bandas",
      players: squad.fieldPlayers.filter((player) => player.group === "banda"),
    },
    {
      key: "delanteros",
      title: "Delanteros",
      players: squad.fieldPlayers.filter((player) => player.group === "delanteros"),
    },
  ] as const;

  return (
    <PublicSiteLayout activeNav="equipos" debugDataSource={dataSource}>
      <div className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,rgba(253,203,88,0.08),transparent_58%)]" />
        <div className="absolute inset-x-0 top-24 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)]" />

        <section className="relative mx-auto w-full max-w-[1344px] px-5 py-14 md:px-8 md:py-18 xl:px-16">
          <SquadPageTitle title={squad.pageTitle} />
          <TeamSectionNavigation
            links={getTeamSectionLinks({ teamType: "academy", teamSlug })}
            activeKey="squad"
            className="mt-8 justify-center"
          />

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <span className="rr-kicker border border-[color:var(--rr-border)] bg-[rgba(255,255,255,0.03)] px-3 py-2 text-[0.76rem] text-[color:var(--rr-muted)]">
              {teamSummary.competition}
            </span>
            <span className="rr-kicker border border-[color:var(--rr-border)] bg-[rgba(255,255,255,0.03)] px-3 py-2 text-[0.76rem] text-[color:var(--rr-muted)]">
              {teamSummary.season}
            </span>
          </div>

          <div className="mt-14 space-y-[4rem] md:mt-18 md:space-y-20">
            {squad.goalkeepers.length ? (
              <SquadSection title="Porteros">
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                  {squad.goalkeepers.map((player) => (
                    <PremiumPlayerCard
                      key={player.id}
                      name={player.name}
                      number={player.number}
                      country={player.country}
                      countryFlag={player.countryFlag}
                      position={player.position}
                      dominantFoot={player.dominantFoot}
                      imageUrl={player.imageUrl}
                      playerType={player.playerType}
                      stats={player.stats}
                      teamType="academy"
                      href={getAcademyPlayerHref(teamSlug, player.slug)}
                      className="h-full"
                    />
                  ))}
                </div>
              </SquadSection>
            ) : null}

            {squad.fieldPlayers.length ? (
              <SquadSection title="Jugadores de Campo">
                <div className="space-y-12">
                  {fieldGroups.map((group) =>
                    group.players.length ? (
                      <section key={group.key} className="space-y-5">
                        <div className="flex items-center gap-3">
                          <span className="h-px flex-1 bg-[linear-gradient(90deg,rgba(253,203,88,0.36),rgba(255,255,255,0.04))]" />
                          <h3 className="rr-kicker text-[0.94rem] text-[color:var(--rr-gold)]">
                            {group.title}
                          </h3>
                          <span className="h-px flex-1 bg-[linear-gradient(90deg,rgba(255,255,255,0.04),rgba(253,203,88,0.36))]" />
                        </div>

                        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                          {group.players.map((player) => (
                            <PremiumPlayerCard
                              key={player.id}
                              name={player.name}
                              number={player.number}
                              country={player.country}
                              countryFlag={player.countryFlag}
                              position={player.position}
                              dominantFoot={player.dominantFoot}
                              imageUrl={player.imageUrl}
                              playerType={player.playerType}
                              stats={player.stats}
                              teamType="academy"
                              href={getAcademyPlayerHref(teamSlug, player.slug)}
                              className="h-full"
                            />
                          ))}
                        </div>
                      </section>
                    ) : null,
                  )}
                </div>
              </SquadSection>
            ) : null}
          </div>
        </section>
      </div>
    </PublicSiteLayout>
  );
}
