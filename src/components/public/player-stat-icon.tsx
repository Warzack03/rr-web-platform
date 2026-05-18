import {
  Activity,
  CalendarDays,
  Crosshair,
  Gauge,
  Hand,
  Percent,
  Shield,
  ShieldCheck,
  Star,
  Target,
  TriangleAlert,
  TrendingUp,
  Undo2,
} from "lucide-react";
import { MatchStatIcon } from "@/components/public/match-stat-icon";
import type {
  PlayerStatIcon as PlayerStatIconType,
  PlayerStatTone,
} from "@/lib/public/player-detail-helpers";
import { cn } from "@/lib/utils";

type PlayerStatIconProps = {
  icon: PlayerStatIconType;
  tone?: PlayerStatTone;
};

export function PlayerStatIcon({
  icon,
  tone = "default",
}: PlayerStatIconProps) {
  if (icon === "goals" || icon === "assists") {
    return (
      <span className="flex h-4 w-4 items-center justify-center opacity-90">
        <MatchStatIcon
          type={icon === "goals" ? "goal" : "assist"}
          size={14}
          className="h-4 w-4"
        />
      </span>
    );
  }

  if (icon === "yellowCard" || icon === "redCard") {
    return (
      <span
        className={cn(
          "block h-3.5 w-[0.7rem] border",
          icon === "yellowCard"
            ? "border-[rgba(253,203,88,0.55)] bg-[color:var(--rr-gold)]"
            : "border-[rgba(214,64,69,0.6)] bg-[color:var(--rr-danger)]",
        )}
      />
    );
  }

  const iconClassName = cn(
    "h-4 w-4",
    tone === "warning"
      ? "text-[color:var(--rr-gold)]"
      : tone === "danger"
        ? "text-[color:var(--rr-danger)]"
        : "text-[color:var(--rr-gold)]/82",
  );

  const Icon =
    icon === "matches"
      ? CalendarDays
      : icon === "goalsAgainst"
        ? Shield
      : icon === "cleanSheet"
        ? ShieldCheck
        : icon === "saves"
          ? Hand
          : icon === "ownGoals"
            ? TriangleAlert
            : icon === "mvps"
              ? Star
              : icon === "recoveries"
                ? Undo2
                : icon === "shots"
                  ? Target
                  : icon === "shotsOnTarget"
                    ? Target
                    : icon === "goalContributions"
                      ? Activity
                      : icon === "goalsAgainstPerMatch"
                        ? Shield
                        : icon === "shotsPerGoalAgainst"
                          ? Target
                        : icon === "contributionsPerMatch"
                          ? Gauge
                          : icon === "shotsPerMatch"
                            ? Target
                            : icon === "shotAccuracy"
                              ? Crosshair
                              : icon === "cleanSheetRate"
                                ? Percent
                                : TrendingUp;

  return <Icon className={iconClassName} strokeWidth={1.8} />;
}
