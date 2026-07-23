import type { ReactNode } from "react";
import { PlayerCard } from "@/components/public/player-card";
import { SquadPageTitle } from "@/components/public/squad-page-title";
import { SquadSection } from "@/components/public/squad-section";
import { TeamSectionNavigation } from "@/components/public/team-section-navigation";
import type { PublicTeamRosterContent, PublicTeamType } from "@/lib/contracts/public";
import { getGlobalPlayerHref } from "@/lib/public/player-routes";
import {
  getPublicRosterNavLinks,
  groupPublicRosterFieldPlayers,
} from "@/lib/public/team-roster";

type TeamSquadPageProps = {
  squad: PublicTeamRosterContent;
  teamType: PublicTeamType;
  badges?: string[];
};

export function TeamSquadPage({ squad, teamType, badges = [] }: TeamSquadPageProps) {
  const fieldGroups = groupPublicRosterFieldPlayers(squad.fieldPlayers);
  const navLinks = getPublicRosterNavLinks({ teamType, teamSlug: squad.teamSlug });
  const isFirstTeam = teamType === "first-team";

  return (
    <div className="relative overflow-hidden">
      <div
        className={
          isFirstTeam
            ? "absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,rgba(253,203,88,0.12),transparent_56%)]"
            : "absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,rgba(253,203,88,0.08),transparent_58%)]"
        }
      />
      <div
        className={
          isFirstTeam
            ? "absolute inset-x-0 top-28 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)]"
            : "absolute inset-x-0 top-24 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)]"
        }
      />

      <section
        className={
          isFirstTeam
            ? "relative mx-auto w-full max-w-[1344px] px-5 py-16 md:px-8 md:py-20 xl:px-16"
            : "relative mx-auto w-full max-w-[1344px] px-5 py-14 md:px-8 md:py-18 xl:px-16"
        }
      >
        <SquadPageTitle title={squad.pageTitle} />
        <TeamSectionNavigation links={navLinks} activeKey="squad" className="mt-8 justify-center" />

        {badges.length > 0 ? (
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            {badges.map((badge) => (
              <span
                key={badge}
                className="rr-kicker border border-[color:var(--rr-border)] bg-[rgba(255,255,255,0.03)] px-3 py-2 text-[0.76rem] text-[color:var(--rr-muted)]"
              >
                {badge}
              </span>
            ))}
          </div>
        ) : null}

        <div className={isFirstTeam ? "mt-16 space-y-[4.5rem] md:mt-20 md:space-y-24" : "mt-14 space-y-[4rem] md:mt-18 md:space-y-20"}>
          {squad.goalkeepers.length ? (
            <SquadSection title="Porteros">
              <PlayerCardGrid>
                {squad.goalkeepers.map((player) => (
                  <PlayerCard
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
                    teamType={teamType}
                    href={getGlobalPlayerHref(player.slug)}
                    className="h-full"
                  />
                ))}
              </PlayerCardGrid>
            </SquadSection>
          ) : null}

          {fieldGroups.length ? (
            <SquadSection title="Jugadores de Campo">
              <div className="space-y-12">
                {fieldGroups.map((group) => (
                  <section key={group.key} className="space-y-5">
                    <div className="flex items-center gap-3">
                      <span className="h-px flex-1 bg-[linear-gradient(90deg,rgba(253,203,88,0.36),rgba(255,255,255,0.04))]" />
                      <h3 className="rr-kicker text-[0.94rem] text-[color:var(--rr-gold)]">{group.title}</h3>
                      <span className="h-px flex-1 bg-[linear-gradient(90deg,rgba(255,255,255,0.04),rgba(253,203,88,0.36))]" />
                    </div>

                    <PlayerCardGrid>
                      {group.players.map((player) => (
                        <PlayerCard
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
                          teamType={teamType}
                          href={getGlobalPlayerHref(player.slug)}
                          className="h-full"
                        />
                      ))}
                    </PlayerCardGrid>
                  </section>
                ))}
              </div>
            </SquadSection>
          ) : null}
        </div>
      </section>
    </div>
  );
}

function PlayerCardGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">{children}</div>;
}
