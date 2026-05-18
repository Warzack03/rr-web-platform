import Link from "next/link";
import Image from "next/image";
import { Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { DominantFootIndicator } from "@/components/public/dominant-foot-indicator";
import { PlayerStatMiniBox } from "@/components/public/player-stat-mini-box";
import type {
  DominantFoot,
  PublicPlayerStats,
  PublicPlayerType,
  PublicTeamType,
} from "@/lib/public/player-profile-content";

type PremiumPlayerCardProps = {
  name: string;
  number: number;
  country?: string;
  countryFlag?: string;
  position: string;
  dominantFoot?: DominantFoot;
  imageUrl?: string;
  playerType: PublicPlayerType;
  stats: PublicPlayerStats;
  teamType?: PublicTeamType;
  href?: string;
  className?: string;
};

export function PremiumPlayerCard({
  name,
  number,
  country,
  countryFlag,
  position,
  dominantFoot,
  imageUrl,
  playerType,
  stats,
  teamType = "first-team",
  href,
  className,
}: PremiumPlayerCardProps) {
  const isAcademy = teamType === "academy";
  const statItems = buildStatItems(playerType, stats, teamType);

  const content = (
    <article
      className={cn(
        isAcademy
          ? "group relative isolate overflow-hidden border border-white/10 bg-[linear-gradient(180deg,rgba(17,29,46,0.98),rgba(12,22,36,0.98))] shadow-[0_18px_44px_rgba(0,0,0,0.24)] transition duration-300 hover:-translate-y-0.5 hover:border-[color:var(--rr-border-strong)]"
          : "group relative isolate overflow-hidden rounded-lg border border-white/12 bg-[linear-gradient(180deg,rgba(23,39,60,0.98),rgba(14,26,44,0.98))] shadow-[0_28px_60px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-1 hover:border-[color:var(--rr-border-strong)] hover:shadow-[0_32px_70px_rgba(0,0,0,0.42)]",
        className,
      )}
    >
      <div
        className={
          isAcademy
            ? "absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_26%),radial-gradient(circle_at_top_right,rgba(253,203,88,0.1),transparent_18%),linear-gradient(180deg,transparent_0%,rgba(8,16,28,0.18)_55%,rgba(8,16,28,0.64)_100%)]"
            : "absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.14),transparent_26%),radial-gradient(circle_at_top_right,rgba(253,203,88,0.14),transparent_18%),linear-gradient(180deg,transparent_0%,rgba(8,16,28,0.22)_55%,rgba(8,16,28,0.72)_100%)]"
        }
      />
      <div className="absolute inset-x-0 top-0 h-[62%] overflow-hidden">
        {!isAcademy ? (
          <>
            <div className="absolute left-[-24%] top-[-22%] h-52 w-52 rounded-full border border-white/10 opacity-50" />
            <div className="absolute right-[-18%] top-[-24%] h-60 w-60 rounded-full border border-white/10 opacity-50" />
          </>
        ) : null}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,8,13,0.18),rgba(6,10,16,0.56))]" />
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={`${name} - ${position}`}
            fill
            sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 25vw"
            className="object-cover object-top grayscale contrast-125 brightness-95 saturate-0 transition duration-500 group-hover:scale-[1.02] group-hover:grayscale-0 group-hover:brightness-100"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[linear-gradient(180deg,rgba(20,31,48,0.4),rgba(10,18,30,0.88))]">
            <div className="flex h-16 w-16 items-center justify-center border border-[color:var(--rr-border-strong)] bg-[rgba(253,203,88,0.08)]">
              <Shield className="h-7 w-7 text-[color:var(--rr-gold)]" strokeWidth={1.8} />
            </div>
            <span className="rr-kicker text-[0.72rem] text-[color:var(--rr-muted)]">
              Imagen pendiente
            </span>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(180deg,transparent_0%,rgba(12,24,40,0.35)_28%,rgba(14,26,44,1)_100%)]" />
        <div className="absolute left-0 right-0 top-0 flex justify-end p-5">
          <span
            className={
              isAcademy
                ? "rr-display text-[3.8rem] leading-none text-[color:var(--rr-gold)]/22 sm:text-[4.6rem]"
                : "rr-display text-[4.8rem] leading-none text-[color:var(--rr-gold)]/28 sm:text-[5.6rem]"
            }
          >
            {String(number).padStart(2, "0")}
          </span>
        </div>
      </div>

      <div
        className={
          isAcademy
            ? "relative flex min-h-[28rem] flex-col justify-end p-5 pt-[14.5rem]"
            : "relative flex min-h-[31rem] flex-col justify-end p-5 pt-[16rem]"
        }
      >
        <div className="flex flex-col items-start gap-3">
          <div className="min-w-0">
            {countryFlag && country ? (
              <div className="flex items-center gap-2">
                <span className="rr-kicker inline-flex min-w-8 items-center justify-center border border-[color:var(--rr-gold)]/55 bg-[rgba(253,203,88,0.08)] px-1.5 py-0.5 text-[0.62rem] text-[color:var(--rr-gold)]">
                  {countryFlag}
                </span>
                <span className="rr-kicker text-[0.72rem] text-[color:var(--rr-muted)]">{country}</span>
              </div>
            ) : null}
            <h3
              className={
                isAcademy
                  ? "rr-display mt-2 text-[2rem] leading-[0.92] text-white sm:text-[2.35rem]"
                  : "rr-display mt-2 text-[2.35rem] leading-[0.9] text-white sm:text-[2.7rem]"
              }
            >
              {name}
            </h3>
          </div>

          <span
            className={
              isAcademy
                ? "rr-kicker inline-flex max-w-full items-center border border-[color:var(--rr-border)] bg-[rgba(255,255,255,0.03)] px-2.5 py-1 text-center text-[0.58rem] leading-[1.1] text-[color:var(--rr-muted)]"
                : "rr-kicker inline-flex max-w-full items-center border border-[color:var(--rr-gold)] bg-[rgba(253,203,88,0.08)] px-2.5 py-1 text-center text-[0.58rem] leading-[1.1] text-[color:var(--rr-gold)]"
            }
          >
            {playerType === "goalkeeper" ? "Portero" : position}
          </span>
        </div>

        <div
          className={cn(
            "mt-5 grid gap-3",
            statItems.length >= 3 ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2",
          )}
        >
          {statItems.map((item, index) => (
            <PlayerStatMiniBox
              key={item.label}
              label={item.label}
              value={item.value}
              className={cn(statItems.length === 3 && index === 2 && "col-span-2 sm:col-span-1")}
            />
          ))}
        </div>

        {!isAcademy && dominantFoot ? <DominantFootIndicator foot={dominantFoot} className="mt-4" /> : null}
      </div>
    </article>
  );

  if (!href) {
    return content;
  }

  return (
    <Link href={href} className="block focus:outline-none">
      {content}
    </Link>
  );
}

function buildStatItems(
  playerType: PublicPlayerType,
  stats: PublicPlayerStats,
  teamType: PublicTeamType,
) {
  if (playerType === "goalkeeper") {
    return [
      { label: "PJ", value: stats.matchesPlayed },
      { label: "Imbat.", value: stats.cleanSheets ?? "-" },
      { label: teamType === "academy" ? "MVP" : "Paradas", value: teamType === "academy" ? stats.mvps : (stats.saves ?? "-") },
    ];
  }

  return [
    { label: "PJ", value: stats.matchesPlayed },
    { label: "Goles", value: stats.goals ?? "-" },
    { label: "Asist.", value: stats.assists ?? "-" },
  ];
}
