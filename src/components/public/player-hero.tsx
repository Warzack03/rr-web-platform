import type { FirstTeamSquadPlayer } from "@/lib/public/first-team-squad-content";
import { PlayerIdentityBlock } from "@/components/public/player-identity-block";
import { PlayerImagePanel } from "@/components/public/player-image-panel";

type PlayerHeroProps = {
  player: FirstTeamSquadPlayer;
};

export function PlayerHero({ player }: PlayerHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-[color:var(--rr-border)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_28%),radial-gradient(circle_at_left,rgba(253,203,88,0.08),transparent_24%)]" />
      <div className="absolute left-1/2 top-10 hidden -translate-x-1/2 text-[14rem] leading-none text-white/[0.03] xl:block">
        <span className="rr-display">{String(player.number).padStart(2, "0")}</span>
      </div>

      <div className="relative mx-auto grid w-full max-w-[1280px] gap-10 px-5 py-12 md:px-8 md:py-16 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] xl:px-16 xl:py-20">
        <div className="flex items-center">
          <PlayerIdentityBlock player={player} />
        </div>
        <PlayerImagePanel player={player} />
      </div>
    </section>
  );
}
