import { cn } from "@/lib/utils";
import type { CalendarMatchStatus, MatchTeamType } from "@/lib/public/team-calendar-content";

type MatchStatusBadgeProps = {
  status: CalendarMatchStatus;
  teamType?: MatchTeamType;
};

const STATUS_STYLES: Record<
  CalendarMatchStatus,
  {
    label: string;
    className: string;
    dotClassName?: string;
  }
> = {
  played: {
    label: "Jugado",
    className:
      "border-[rgba(253,203,88,0.28)] bg-[rgba(253,203,88,0.12)] text-[color:var(--rr-gold)]",
  },
  live: {
    label: "En vivo",
    className: "border-[rgba(255,167,167,0.28)] bg-[rgba(255,167,167,0.12)] text-[#ffb4ab]",
    dotClassName: "bg-[#ffb4ab]",
  },
  pending: {
    label: "Pendiente",
    className:
      "border-[rgba(194,206,223,0.18)] bg-[rgba(194,206,223,0.08)] text-[color:var(--rr-muted)]",
  },
  postponed: {
    label: "Aplazado",
    className:
      "border-[rgba(148,163,184,0.22)] bg-[rgba(15,23,42,0.28)] text-[rgba(194,206,223,0.86)]",
  },
};

export function MatchStatusBadge({
  status,
  teamType = "first-team",
}: MatchStatusBadgeProps) {
  const normalizedStatus =
    status === "postponed" && teamType === "academy" ? ("pending" satisfies CalendarMatchStatus) : status;
  const config = STATUS_STYLES[normalizedStatus];

  return (
    <span
      className={cn(
        "rr-kicker inline-flex min-h-8 items-center gap-2 self-start border px-3 py-1.5 text-[0.74rem]",
        config.className,
      )}
    >
      {config.dotClassName ? (
        <span className="relative flex h-2.5 w-2.5 items-center justify-center">
          <span className={cn("absolute inline-flex h-2.5 w-2.5 animate-ping rounded-full opacity-75", config.dotClassName)} />
          <span className={cn("relative inline-flex h-2.5 w-2.5 rounded-full", config.dotClassName)} />
        </span>
      ) : null}
      {config.label}
    </span>
  );
}
