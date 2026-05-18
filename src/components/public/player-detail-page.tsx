import type { FirstTeamSquadPlayer } from "@/lib/public/first-team-squad-content";
import { PlayerDerivedMetrics } from "@/components/public/player-derived-metrics";
import { PlayerHero } from "@/components/public/player-hero";
import { PlayerShopCTA } from "@/components/public/player-shop-cta";
import { PlayerStatsGrid } from "@/components/public/player-stats-grid";

type PlayerDetailPageProps = {
  player: FirstTeamSquadPlayer;
};

export function PlayerDetailPage({ player }: PlayerDetailPageProps) {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_top,rgba(253,203,88,0.1),transparent_58%)]" />

      <PlayerHero player={player} />

      <section className="relative mx-auto w-full max-w-[1280px] px-5 py-12 md:px-8 md:py-16 xl:px-16">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <h2 className="rr-display text-[3.2rem] leading-[0.92] text-white md:text-[4rem]">
            Rendimiento <span className="text-[color:var(--rr-gold)]">Tecnico</span>
          </h2>
          <div className="w-full max-w-[20rem] xl:w-[20rem]">
            <div className="rr-bolt-divider" />
          </div>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)]">
          <PlayerStatsGrid playerType={player.playerType} stats={player.stats} />
          <PlayerDerivedMetrics playerType={player.playerType} stats={player.stats} />
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-[1280px] px-5 pb-12 md:px-8 md:pb-16 xl:px-16 xl:pb-20">
        <PlayerShopCTA player={player} />
      </section>
    </div>
  );
}
