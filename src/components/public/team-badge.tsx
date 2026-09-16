import { TeamCrest } from "@/components/public/team-crest";
import { cn } from "@/lib/utils";
import type { CalendarMatchTeam } from "@/lib/contracts/public";

type TeamBadgeProps = {
  team: CalendarMatchTeam;
};

export function TeamBadge({ team }: TeamBadgeProps) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-2 text-center">
      <TeamCrest
        name={team.name}
        logoUrl={team.crestUrl}
        logoAlt={team.crestAlt}
        fallbackLabel={team.crestLabel}
        isClub={team.isClub}
        className={cn(
          "h-14 w-14 shadow-[inset_0_0_18px_rgba(0,0,0,0.34)] md:h-16 md:w-16",
          team.isClub
            ? "border-[rgba(253,203,88,0.28)] bg-[linear-gradient(180deg,rgba(56,68,89,0.96),rgba(34,41,56,0.96))]"
            : "border-[rgba(255,255,255,0.12)] bg-[linear-gradient(180deg,rgba(36,49,73,0.94),rgba(22,31,47,0.94))]",
          team.muted && "opacity-70 grayscale",
        )}
        imageClassName="h-full w-full p-1.5"
        initialsClassName="text-[1.85rem] md:text-[2rem]"
      />
      <span className="rr-kicker max-w-[8.25rem] text-[0.8rem] text-[color:var(--rr-text)]">
        {team.name}
      </span>
    </div>
  );
}
