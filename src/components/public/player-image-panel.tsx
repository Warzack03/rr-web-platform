import Image from "next/image";
import type { FirstTeamSquadPlayer } from "@/lib/public/first-team-squad-content";

type PlayerImagePanelProps = {
  player: FirstTeamSquadPlayer;
};

export function PlayerImagePanel({ player }: PlayerImagePanelProps) {
  return (
    <div className="relative isolate min-h-[24rem] overflow-hidden border border-white/10 bg-[linear-gradient(180deg,rgba(6,13,22,0.98),rgba(10,20,34,0.96))] shadow-[0_28px_70px_rgba(0,0,0,0.35)] sm:min-h-[30rem] xl:min-h-[34rem]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_22%),radial-gradient(circle_at_bottom,rgba(253,203,88,0.12),transparent_34%)]" />
      <div className="absolute inset-x-0 bottom-0 h-36 bg-[linear-gradient(180deg,transparent,rgba(10,20,34,0.9)_68%,rgba(10,20,34,1))]" />
      <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(253,203,88,0.55),transparent)]" />
      <Image
        src={player.imageUrl}
        alt={`${player.name} - ${player.position}`}
        fill
        sizes="(max-width: 1279px) 100vw, 42vw"
        className="object-cover object-top grayscale contrast-125 brightness-95"
      />
    </div>
  );
}
