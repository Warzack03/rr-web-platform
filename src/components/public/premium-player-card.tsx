import Link from "next/link";
import Image from "next/image";
import type {
  DominantFoot,
  FirstTeamPlayerStats,
  FirstTeamPlayerType,
} from "@/lib/public/first-team-squad-content";
import { cn } from "@/lib/utils";
import { DominantFootIndicator } from "@/components/public/dominant-foot-indicator";
import { PlayerStatMiniBox } from "@/components/public/player-stat-mini-box";

type PremiumPlayerCardProps = {
  name: string;
  number: number;
  country: string;
  countryFlag: string;
  position: string;
  dominantFoot: DominantFoot;
  imageUrl: string;
  playerType: FirstTeamPlayerType;
  stats: FirstTeamPlayerStats;
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
  href,
  className,
}: PremiumPlayerCardProps) {
  const statItems = buildStatItems(playerType, stats);

  const content = (
    <article
      className={cn(
        "group relative isolate overflow-hidden rounded-lg border border-white/12 bg-[linear-gradient(180deg,rgba(23,39,60,0.98),rgba(14,26,44,0.98))] shadow-[0_28px_60px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-1 hover:border-[color:var(--rr-border-strong)] hover:shadow-[0_32px_70px_rgba(0,0,0,0.42)]",
        className,
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.14),transparent_26%),radial-gradient(circle_at_top_right,rgba(253,203,88,0.14),transparent_18%),linear-gradient(180deg,transparent_0%,rgba(8,16,28,0.22)_55%,rgba(8,16,28,0.72)_100%)]" />
      <div className="absolute inset-x-0 top-0 h-[62%] overflow-hidden">
        <div className="absolute left-[-24%] top-[-22%] h-52 w-52 rounded-full border border-white/10 opacity-50" />
        <div className="absolute right-[-18%] top-[-24%] h-60 w-60 rounded-full border border-white/10 opacity-50" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,8,13,0.18),rgba(6,10,16,0.56))]" />
        <Image
          src={imageUrl}
          alt={`${name} - ${position}`}
          fill
          sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 25vw"
          className="object-cover object-top grayscale contrast-125 brightness-95 saturate-0 transition duration-500 group-hover:scale-[1.02] group-hover:grayscale-0 group-hover:brightness-100"
        />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(180deg,transparent_0%,rgba(12,24,40,0.35)_28%,rgba(14,26,44,1)_100%)]" />
        <div className="absolute left-0 right-0 top-0 flex justify-end p-5">
          <span className="rr-display text-[4.8rem] leading-none text-[color:var(--rr-gold)]/28 sm:text-[5.6rem]">
            {String(number).padStart(2, "0")}
          </span>
        </div>
      </div>

      <div className="relative flex min-h-[31rem] flex-col justify-end p-5 pt-[16rem]">
        <div className="flex flex-col items-start gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="rr-kicker inline-flex min-w-8 items-center justify-center border border-[color:var(--rr-gold)]/55 bg-[rgba(253,203,88,0.08)] px-1.5 py-0.5 text-[0.62rem] text-[color:var(--rr-gold)]">
                {countryFlag}
              </span>
              <span className="rr-kicker text-[0.72rem] text-[color:var(--rr-muted)]">{country}</span>
            </div>
            <h3 className="rr-display mt-2 text-[2.35rem] leading-[0.9] text-white sm:text-[2.7rem]">{name}</h3>
          </div>

          <span className="rr-kicker inline-flex max-w-full items-center border border-[color:var(--rr-gold)] bg-[rgba(253,203,88,0.08)] px-2.5 py-1 text-center text-[0.58rem] leading-[1.1] text-[color:var(--rr-gold)]">
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

        <DominantFootIndicator foot={dominantFoot} className="mt-4" />
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

function buildStatItems(playerType: FirstTeamPlayerType, stats: FirstTeamPlayerStats) {
  if (playerType === "goalkeeper") {
    return [
      { label: "PJ", value: stats.matchesPlayed },
      { label: "Imbat.", value: stats.cleanSheets ?? "-" },
      { label: "Paradas", value: stats.saves ?? "-" },
    ];
  }

  return [
    { label: "PJ", value: stats.matchesPlayed },
    { label: "Goles", value: stats.goals ?? "-" },
    { label: "Asist.", value: stats.assists ?? "-" },
  ];
}
