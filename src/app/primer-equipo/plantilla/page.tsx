import type { Metadata } from "next";
import { PublicSiteLayout } from "@/components/layout/public-site-layout";
import { PremiumPlayerCard } from "@/components/public/premium-player-card";
import { SquadPageTitle } from "@/components/public/squad-page-title";
import { SquadSection } from "@/components/public/squad-section";
import { TeamSectionNavigation } from "@/components/public/team-section-navigation";
import {
  getFirstTeamPlayerHref,
  getFirstTeamSquadContent,
} from "@/lib/public/first-team-squad-content";
import { getTeamSectionLinks } from "@/lib/public/team-section-links";

export const metadata: Metadata = {
  title: "Plantilla | Primer Equipo",
  description: "Plantilla publica del Primer Equipo de Rising Raimon.",
};

export default function FirstTeamSquadPage() {
  const squad = getFirstTeamSquadContent();
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
      key: "delanteros",
      title: "Delanteros",
      players: squad.fieldPlayers.filter((player) => player.group === "delanteros"),
    },
  ];

  return (
    <PublicSiteLayout activeNav="primer-equipo">
      <div className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,rgba(253,203,88,0.12),transparent_56%)]" />
        <div className="absolute inset-x-0 top-28 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)]" />

        <section className="relative mx-auto w-full max-w-[1344px] px-5 py-16 md:px-8 md:py-20 xl:px-16">
          <SquadPageTitle title={squad.pageTitle} />
          <TeamSectionNavigation
            links={getTeamSectionLinks({ teamType: "first-team" })}
            activeKey="squad"
            className="mt-8 justify-center"
          />

          <div className="mt-16 space-y-[4.5rem] md:mt-20 md:space-y-24">
            <SquadSection title="Porteros">
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                {squad.goalkeepers.map((player) => (
                  <PremiumPlayerCard
                    key={player.id}
                    {...player}
                    href={getFirstTeamPlayerHref(player.slug)}
                    className="h-full"
                  />
                ))}
              </div>
            </SquadSection>

            <SquadSection title="Jugadores de Campo">
              <div className="space-y-12">
                {fieldGroups.map((group) =>
                  group.players.length ? (
                    <section key={group.key} className="space-y-5">
                      <div className="flex items-center gap-3">
                        <span className="h-px flex-1 bg-[linear-gradient(90deg,rgba(253,203,88,0.36),rgba(255,255,255,0.04))]" />
                        <h3 className="rr-kicker text-[0.94rem] text-[color:var(--rr-gold)]">{group.title}</h3>
                        <span className="h-px flex-1 bg-[linear-gradient(90deg,rgba(255,255,255,0.04),rgba(253,203,88,0.36))]" />
                      </div>

                      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                        {group.players.map((player) => (
                          <PremiumPlayerCard
                            key={player.id}
                            {...player}
                            href={getFirstTeamPlayerHref(player.slug)}
                            className="h-full"
                          />
                        ))}
                      </div>
                    </section>
                  ) : null,
                )}
              </div>
            </SquadSection>
          </div>
        </section>
      </div>
    </PublicSiteLayout>
  );
}
