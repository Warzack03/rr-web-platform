import { cn } from "@/lib/utils";
import type { CalendarMatchTeam } from "@/lib/public/team-calendar-content";

type TeamBadgeProps = {
  team: CalendarMatchTeam;
};

export function TeamBadge({ team }: TeamBadgeProps) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-2 text-center">
      <div
        className={cn(
          "flex h-14 w-14 items-center justify-center border text-[1.85rem] shadow-[inset_0_0_18px_rgba(0,0,0,0.34)] md:h-16 md:w-16 md:text-[2rem]",
          team.isClub
            ? "border-[rgba(253,203,88,0.28)] bg-[linear-gradient(180deg,rgba(56,68,89,0.96),rgba(34,41,56,0.96))] text-[color:var(--rr-gold)]"
            : "border-[rgba(255,255,255,0.12)] bg-[linear-gradient(180deg,rgba(36,49,73,0.94),rgba(22,31,47,0.94))] text-[color:var(--rr-text)]/78",
          team.muted && "opacity-70 grayscale",
        )}
      >
        <span className="rr-display leading-none">{team.crestLabel}</span>
      </div>
      <span className="rr-kicker max-w-[8.25rem] text-[0.8rem] text-[color:var(--rr-text)]">
        {team.name}
      </span>
    </div>
  );
}
