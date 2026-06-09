import { PlayerIdentityBlock } from "@/components/public/player-identity-block";
import { PlayerImagePanel } from "@/components/public/player-image-panel";
import type { PublicPlayerProfile } from "@/lib/public/player-profile-content";

type PlayerHeroProps = {
  player: PublicPlayerProfile;
};

export function PlayerHero({ player }: PlayerHeroProps) {
  const isAcademy = player.teamType === "academy";

  return (
    <section className="relative overflow-hidden border-b border-[color:var(--rr-border)]">
      <div
        className={
          isAcademy
            ? "absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.05),transparent_30%),radial-gradient(circle_at_left,rgba(253,203,88,0.06),transparent_24%)]"
            : "absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_28%),radial-gradient(circle_at_left,rgba(253,203,88,0.08),transparent_24%)]"
        }
      />
      <div
        className={
          isAcademy
            ? "absolute left-1/2 top-12 hidden -translate-x-1/2 text-[10rem] leading-none text-white/[0.025] xl:block"
            : "absolute left-1/2 top-10 hidden -translate-x-1/2 text-[14rem] leading-none text-white/[0.03] xl:block"
        }
      >
        <span className="rr-display">{String(player.number).padStart(2, "0")}</span>
      </div>

      <div
        className={
          isAcademy
            ? "relative mx-auto grid w-full max-w-[1280px] gap-8 px-5 py-10 md:px-8 md:py-14 xl:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)] xl:px-16 xl:py-16"
            : "relative mx-auto grid w-full max-w-[1280px] gap-10 px-5 py-12 md:px-8 md:py-16 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] xl:px-16 xl:py-20"
        }
      >
        <div className="flex items-center">
          <PlayerIdentityBlock player={player} />
        </div>
        <PlayerImagePanel player={player} />
      </div>
    </section>
  );
}
