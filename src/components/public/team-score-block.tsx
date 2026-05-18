import { cn } from "@/lib/utils";
import type { CalendarMatchTeam } from "@/lib/public/team-calendar-content";

type TeamScoreBlockProps = {
  team: CalendarMatchTeam;
  align?: "left" | "right";
};

export function TeamScoreBlock({
  team,
  align = "left",
}: TeamScoreBlockProps) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-col items-center gap-5",
        align === "left" ? "lg:items-start lg:text-left" : "lg:items-end lg:text-right",
      )}
    >
      <div
        className={cn(
          "flex h-28 w-28 items-center justify-center border shadow-[inset_0_0_26px_rgba(0,0,0,0.28)] md:h-32 md:w-32",
          team.isClub
            ? "border-[rgba(253,203,88,0.78)] bg-[rgba(11,27,50,0.78)] text-[color:var(--rr-gold)]"
            : "border-[rgba(255,255,255,0.12)] bg-[rgba(40,45,48,0.82)] text-[color:var(--rr-text)]/78",
          team.muted && "opacity-72 grayscale",
        )}
      >
        <span className="rr-display text-[4.2rem] leading-none">{team.crestLabel}</span>
      </div>

      <div className="min-w-0">
        <p className="rr-display max-w-[12rem] text-[2.35rem] leading-[0.9] text-white md:text-[2.8rem]">
          {team.name}
        </p>
      </div>
    </div>
  );
}
