import type { CalendarMatch, MatchTeamType } from "@/lib/contracts/public";
import { MatchRow } from "@/components/public/match-row";

type MatchdaySectionProps = {
  title: string;
  matches: CalendarMatch[];
  showLiveFeatures?: boolean;
  showVideoActions?: boolean;
  teamType?: MatchTeamType;
};

export function MatchdaySection({
  title,
  matches,
  showLiveFeatures = false,
  showVideoActions = true,
  teamType = "first-team",
}: MatchdaySectionProps) {
  return (
    <section className="space-y-4 md:space-y-5">
      <div className="flex items-center gap-3">
        <span className="h-10 w-1 bg-[color:var(--rr-gold)]" />
        <h2 className="rr-display text-[2.2rem] leading-none text-[color:var(--rr-gold)] sm:text-[2.5rem]">
          {title}
        </h2>
      </div>

      <div className="space-y-4">
        {matches.map((match) => (
          <MatchRow
            key={match.id}
            match={match}
            showLiveFeatures={showLiveFeatures}
            showVideoActions={showVideoActions}
            teamType={teamType}
          />
        ))}
      </div>
    </section>
  );
}
