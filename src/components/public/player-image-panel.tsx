import Image from "next/image";
import { Shield } from "lucide-react";
import type { PublicPlayerProfile } from "@/lib/contracts/public";

type PlayerImagePanelProps = {
  player: PublicPlayerProfile;
};

export function PlayerImagePanel({ player }: PlayerImagePanelProps) {
  const isAcademy = player.teamType === "academy";

  return (
    <div
      className={
        isAcademy
          ? "relative isolate min-h-[22rem] overflow-hidden border border-white/10 bg-[linear-gradient(180deg,rgba(8,16,28,0.98),rgba(12,23,38,0.96))] shadow-[0_18px_48px_rgba(0,0,0,0.28)] sm:min-h-[26rem] xl:min-h-[30rem]"
          : "relative isolate min-h-[24rem] overflow-hidden border border-white/10 bg-[linear-gradient(180deg,rgba(6,13,22,0.98),rgba(10,20,34,0.96))] shadow-[0_28px_70px_rgba(0,0,0,0.35)] sm:min-h-[30rem] xl:min-h-[34rem]"
      }
    >
      <div
        className={
          isAcademy
            ? "absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.1),transparent_22%),radial-gradient(circle_at_bottom,rgba(253,203,88,0.08),transparent_34%)]"
            : "absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_22%),radial-gradient(circle_at_bottom,rgba(253,203,88,0.12),transparent_34%)]"
        }
      />
      <div className="absolute inset-x-0 bottom-0 h-36 bg-[linear-gradient(180deg,transparent,rgba(10,20,34,0.9)_68%,rgba(10,20,34,1))]" />
      <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(253,203,88,0.55),transparent)]" />
      {player.imageUrl ? (
        <Image
          src={player.imageUrl}
          alt={`${player.name} - ${player.position}`}
          fill
          sizes="(max-width: 1279px) 100vw, 42vw"
          className="object-cover object-top grayscale contrast-125 brightness-95"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[linear-gradient(180deg,rgba(18,30,48,0.5),rgba(11,20,34,0.9))]">
          <div className="flex h-20 w-20 items-center justify-center border border-[color:var(--rr-border-strong)] bg-[rgba(253,203,88,0.08)]">
            <Shield className="h-9 w-9 text-[color:var(--rr-gold)]" strokeWidth={1.8} />
          </div>
          <div className="text-center">
            <p className="rr-kicker text-[0.8rem] text-[color:var(--rr-gold)]">Imagen pendiente</p>
            <p className="mt-2 text-[0.98rem] text-[color:var(--rr-muted)]">{player.teamLabel}</p>
          </div>
        </div>
      )}
    </div>
  );
}
