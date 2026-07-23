import Link from "next/link";
import { CalendarClock, CirclePlay, Clock3, MapPin, Radio } from "lucide-react";
import { MatchScore } from "@/components/public/match-score";
import { MatchStatusBadge } from "@/components/public/match-status-badge";
import { TeamBadge } from "@/components/public/team-badge";
import { cn } from "@/lib/utils";
import type { CalendarMatch, MatchTeamType } from "@/lib/contracts/public";

type MatchRowProps = {
  match: CalendarMatch;
  showLiveFeatures?: boolean;
  showVideoActions?: boolean;
  teamType?: MatchTeamType;
};

function getActionContent(
  match: CalendarMatch,
  showLiveFeatures: boolean,
  showVideoActions: boolean,
  teamType: MatchTeamType,
) {
  if (match.status === "postponed" && teamType === "academy" && match.detailHref) {
    return {
      icon: CalendarClock,
      label: match.actionLabel || "Vista previa",
      meta: match.actionHint || match.postponementReason || "Pendiente de nueva fecha",
      buttonLike: true,
      accentClassName:
        "border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.03)] text-[color:var(--rr-muted)] hover:border-[rgba(253,203,88,0.22)] hover:text-white",
    };
  }

  if (match.status === "postponed" && teamType === "academy") {
    return {
      icon: CalendarClock,
      label: match.actionLabel || "Pendiente",
      meta: match.actionHint || match.postponementReason || "Pendiente de nueva fecha",
      buttonLike: false,
      accentClassName:
        "border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.03)] text-[color:var(--rr-muted)]",
    };
  }

  if (match.status === "postponed") {
    return {
      icon: CalendarClock,
      label: "Fecha por confirmar",
      meta: match.postponementReason,
      buttonLike: false,
      accentClassName:
        "border-[rgba(148,163,184,0.18)] bg-[rgba(255,255,255,0.02)] text-[color:var(--rr-muted)]",
    };
  }

  if (match.status === "live" && showLiveFeatures && teamType === "first-team") {
    return {
      icon: Radio,
      label: "Seguir directo",
      meta: match.actionHint,
      buttonLike: true,
      accentClassName:
        "border-[rgba(255,167,167,0.45)] bg-[rgba(255,167,167,0.08)] text-[#ffd2cd] hover:bg-[rgba(255,167,167,0.16)]",
    };
  }

  if (match.status === "played") {
    return {
      icon: CirclePlay,
      label: match.actionLabel || (showVideoActions ? "Ver resumen" : "Ver resultado"),
      meta: match.actionHint,
      buttonLike: true,
      accentClassName:
        "border-[rgba(253,203,88,0.4)] bg-transparent text-[color:var(--rr-gold)] hover:bg-[rgba(253,203,88,0.08)]",
    };
  }

  return {
    icon: Clock3,
    label: match.actionLabel,
    meta: match.actionHint,
    buttonLike:
      match.status !== "pending" ||
      showLiveFeatures ||
      match.actionLabel.toLowerCase().startsWith("ver ") ||
      match.actionLabel.toLowerCase().startsWith("vista"),
    accentClassName:
      "border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.03)] text-[color:var(--rr-muted)] hover:border-[rgba(253,203,88,0.22)] hover:text-white",
  };
}

export function MatchRow({
  match,
  showLiveFeatures = false,
  showVideoActions = true,
  teamType = "first-team",
}: MatchRowProps) {
  const action = getActionContent(match, showLiveFeatures, showVideoActions, teamType);
  const actionClassName = cn(
    "flex min-h-[4.5rem] w-full flex-col justify-center gap-1 border px-4 py-3 text-center lg:max-w-[13rem]",
    action.accentClassName,
  );

  return (
    <article
      className={cn(
        "rr-panel overflow-hidden border px-4 py-4 md:px-5 lg:px-6 lg:py-5",
        "bg-[linear-gradient(180deg,rgba(38,55,83,0.96),rgba(28,43,67,0.96))]",
        match.status === "live" &&
          "border-[rgba(255,167,167,0.35)] shadow-[0_0_0_1px_rgba(255,167,167,0.08),0_20px_44px_rgba(0,0,0,0.24)]",
      )}
    >
      <div className="flex flex-col gap-5 lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1.2fr)_minmax(12rem,0.8fr)] lg:items-center">
        <div className="flex min-w-0 flex-col gap-4">
          <MatchStatusBadge status={match.status} teamType={teamType} />

          <div className="grid gap-2 text-[color:var(--rr-muted)]">
            <p className="rr-kicker text-[0.82rem] text-white">{match.competition}</p>
            <div className="space-y-1">
              <p className="text-[1.35rem] font-semibold leading-none text-white">{match.dateLabel}</p>
              <p className="flex items-center gap-2 text-[1rem]">
                <Clock3 className="h-4 w-4 text-[color:var(--rr-gold)]" strokeWidth={1.8} />
                <span>{match.status === "live" ? match.liveMinute : match.kickoffLabel}</span>
              </p>
              <p className="flex items-center gap-2 text-[1rem]">
                <MapPin className="h-4 w-4 text-[color:var(--rr-gold)]" strokeWidth={1.8} />
                <span>{match.venue}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:gap-5 lg:gap-6">
          <TeamBadge team={match.homeTeam} />
          <MatchScore match={match} showLiveFeatures={showLiveFeatures} teamType={teamType} />
          <TeamBadge team={match.awayTeam} />
        </div>

        <div className="flex min-w-0 justify-stretch lg:justify-end">
          {action.buttonLike && match.detailHref ? (
            <Link
              href={match.detailHref}
              className={cn(actionClassName, "transition hover:-translate-y-0.5")}
            >
              <div className="rr-kicker flex items-center justify-center gap-2 text-[0.82rem] text-current">
                <action.icon className="h-4 w-4" strokeWidth={1.9} />
                <span>{action.label}</span>
              </div>
              {action.meta ? <p className="text-[0.98rem] text-current/84">{action.meta}</p> : null}
            </Link>
          ) : (
            <div className={cn(actionClassName, !action.buttonLike && "items-center")}>
              <div className="rr-kicker flex items-center justify-center gap-2 text-[0.82rem] text-current">
                <action.icon className="h-4 w-4" strokeWidth={1.9} />
                <span>{action.label}</span>
              </div>
              {action.meta ? <p className="text-[0.98rem] text-current/84">{action.meta}</p> : null}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
