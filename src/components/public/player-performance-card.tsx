import Link from "next/link";
import { Star } from "lucide-react";
import { PlayerEventIcon } from "@/components/public/player-event-icon";
import { cn } from "@/lib/utils";
import type { PlayerPerformance } from "@/lib/public/match-detail-content";

type PlayerPerformanceCardProps = {
  player: PlayerPerformance;
};

export function PlayerPerformanceCard({
  player,
}: PlayerPerformanceCardProps) {
  const content = (
    <article
      className={cn(
        "relative overflow-hidden border border-[color:var(--rr-border)] bg-[linear-gradient(180deg,rgba(38,55,83,0.98),rgba(29,44,67,0.98))] px-5 py-5 shadow-[0_20px_44px_rgba(0,0,0,0.18)]",
        player.mvp && "border-[rgba(253,203,88,0.28)]",
        player.href &&
          "transition hover:-translate-y-0.5 hover:border-[color:var(--rr-border-strong)]",
      )}
    >
      {player.mvp ? (
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(253,203,88,0.07),transparent_52%)]" />
      ) : null}

      <div className="relative flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <span className="rr-display w-12 text-center text-[3rem] leading-none text-[rgba(253,203,88,0.42)]">
            {player.shirtNumber}
          </span>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="rr-display truncate text-[2rem] leading-[0.9] text-white">
                {player.name}
              </h3>
              {player.mvp ? (
                <Star
                  className="h-4 w-4 shrink-0 text-[color:var(--rr-gold)]"
                  fill="currentColor"
                  strokeWidth={1.8}
                />
              ) : null}
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.92rem] text-[color:var(--rr-muted)]">
              <span className="rr-kicker text-[0.76rem] text-[color:var(--rr-text)]/82">
                {player.position}
              </span>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
          {player.goals ? (
            <PlayerEventIcon type="goals" count={player.goals} />
          ) : null}
          {player.assists ? (
            <PlayerEventIcon type="assists" count={player.assists} />
          ) : null}
          {player.mvp ? <PlayerEventIcon type="mvp" /> : null}
          {player.yellowCards ? <PlayerEventIcon type="yellowCard" /> : null}
          {player.redCards ? <PlayerEventIcon type="redCard" /> : null}
          {player.cleanSheet ? <PlayerEventIcon type="cleanSheet" /> : null}
          {player.ownGoals ? (
            <PlayerEventIcon type="ownGoals" count={player.ownGoals} />
          ) : null}
        </div>
      </div>
    </article>
  );

  if (!player.href) {
    return content;
  }

  return (
    <Link href={player.href} className="block focus:outline-none">
      {content}
    </Link>
  );
}
