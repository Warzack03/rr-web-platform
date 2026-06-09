import { cn } from "@/lib/utils";
import type { CalendarMatch, MatchTeamType } from "@/lib/public/team-calendar-content";

type MatchScoreProps = {
  match: CalendarMatch;
  showLiveFeatures?: boolean;
  teamType?: MatchTeamType;
};

export function MatchScore({
  match,
  showLiveFeatures = false,
  teamType = "first-team",
}: MatchScoreProps) {
  const isAcademyPostponed = match.status === "postponed" && teamType === "academy";
  const accentClassName =
    match.status === "live" && showLiveFeatures
      ? "border-[rgba(255,167,167,0.25)] text-[#ffd2cd]"
      : match.status === "played"
        ? "border-[rgba(253,203,88,0.18)] text-[color:var(--rr-gold)]"
        : "border-[rgba(255,255,255,0.08)] text-[color:var(--rr-text)]";

  const primaryLabel =
    match.status === "postponed" && !isAcademyPostponed
      ? "Aplazado"
      : match.status === "pending" || isAcademyPostponed
        ? "VS"
        : `${match.homeScore} - ${match.awayScore}`;

  const secondaryLabel =
    match.status === "live" && showLiveFeatures
      ? match.liveMinute
      : match.status === "played"
        ? "FT"
        : match.status === "postponed" && !isAcademyPostponed
          ? "Fecha pendiente"
          : isAcademyPostponed
            ? match.actionLabel || match.actionHint || "Fecha pendiente"
          : match.kickoffLabel;

  return (
    <div className="flex min-w-[8rem] flex-col items-center gap-2 text-center md:min-w-[9rem]">
      <div
        className={cn(
          "rr-display flex min-h-[3.25rem] min-w-[8rem] items-center justify-center border bg-[rgba(7,15,25,0.7)] px-3 text-[1.95rem] leading-none shadow-[inset_0_0_16px_rgba(0,0,0,0.46)] md:min-w-[9rem]",
          accentClassName,
          match.status === "postponed" &&
            !isAcademyPostponed &&
            "px-4 text-[1.5rem] text-[color:var(--rr-muted)]",
        )}
      >
        {primaryLabel}
      </div>
      <span
        className={cn(
          "rr-kicker text-[0.78rem]",
          match.status === "live" && showLiveFeatures
            ? "text-[#ffb4ab]"
            : "text-[color:var(--rr-muted)]",
        )}
      >
        {secondaryLabel}
      </span>
    </div>
  );
}
