import { MatchStatIcon } from "@/components/public/match-stat-icon";
import { cn } from "@/lib/utils";
import type { MatchDetailScorer } from "@/lib/public/match-detail-content";

type GoalScorersListProps = {
  scorers: MatchDetailScorer[];
  align?: "left" | "right";
  title?: string;
};

function formatScorerMinutes(minutes: number[]) {
  return minutes.map((minute) => `${minute}'`).join(", ");
}

export function GoalScorersList({
  scorers,
  align = "left",
  title,
}: GoalScorersListProps) {
  const isRight = align === "right";

  return (
    <div
      className={cn(
        "flex min-h-[4.75rem] flex-col justify-center gap-2",
        isRight ? "items-end text-right" : "items-start text-left",
      )}
    >
      {title ? (
        <p className="rr-kicker text-[0.74rem] text-[color:var(--rr-muted)]">{title}</p>
      ) : null}
      {scorers.map((scorer, index) => (
        <div
          key={`${scorer.playerName}-${formatScorerMinutes(scorer.minutes)}-${index}`}
          className={cn(
            "flex items-center gap-2 text-[1.02rem] text-[color:var(--rr-text)]",
            isRight && "flex-row-reverse",
          )}
        >
          <MatchStatIcon type="goal" size={15} className="h-4 w-4" />
          <span>
            {scorer.playerName}
            {scorer.minutes.length > 0 ? ` (${formatScorerMinutes(scorer.minutes)})` : ""}
          </span>
        </div>
      ))}
    </div>
  );
}
