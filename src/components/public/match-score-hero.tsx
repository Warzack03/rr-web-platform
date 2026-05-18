import { CalendarDays, Clock3, MapPin, Radio, Trophy } from "lucide-react";
import { GoalScorersList } from "@/components/public/goal-scorers-list";
import { HighlightsButton } from "@/components/public/highlights-button";
import { MatchEventBadge } from "@/components/public/match-event-badge";
import { MatchStatusBadge } from "@/components/public/match-status-badge";
import { TeamScoreBlock } from "@/components/public/team-score-block";
import { cn } from "@/lib/utils";
import type { MatchDetailContent } from "@/lib/public/match-detail-content";

type MatchScoreHeroProps = {
  detail: MatchDetailContent;
};

export function MatchScoreHero({ detail }: MatchScoreHeroProps) {
  const { match } = detail;
  const isPlayed = match.status === "played";
  const isLive = match.status === "live" && detail.showLiveFeatures;
  const isPending =
    match.status === "pending" ||
    (match.status === "postponed" && detail.teamType === "academy");
  const isAcademy = detail.teamType === "academy";
  const showScore = isPlayed || isLive;
  const hasHomeScorers = detail.homeScorers.length > 0;
  const hasAwayScorers = detail.awayScorers.length > 0;
  const showScorers = showScore && (hasHomeScorers || hasAwayScorers);
  const showHighlights =
    detail.teamType === "first-team" &&
    detail.showHighlights &&
    isPlayed &&
    Boolean(detail.highlightsUrl);
  const stateLabel = match.homeTeam.isClub ? "Local" : "Visitante";
  const previewLabel = detail.previewNote || "Vista previa del encuentro";

  return (
    <section
      className={cn(
        "relative overflow-hidden border border-[color:var(--rr-border)] shadow-[0_28px_70px_rgba(0,0,0,0.28)]",
        isAcademy
          ? "bg-[linear-gradient(180deg,rgba(24,37,58,0.98),rgba(17,29,47,0.98))]"
          : "bg-[linear-gradient(180deg,rgba(30,47,71,0.98),rgba(17,31,52,0.98))]",
      )}
    >
      <div className="absolute inset-0 opacity-95">
        <div
          className={cn(
            "absolute inset-0",
            isAcademy
              ? "bg-[radial-gradient(circle_at_top,rgba(253,203,88,0.12),transparent_20%),linear-gradient(180deg,rgba(6,16,29,0.08),rgba(6,16,29,0.72))]"
              : "bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_22%),linear-gradient(180deg,rgba(6,16,29,0.1),rgba(6,16,29,0.66))]",
          )}
        />
        {!isAcademy ? (
          <>
            <div className="absolute left-[-18%] top-[-34%] h-[18rem] w-[62%] rounded-[100%] border border-white/10 opacity-45 blur-[1px] md:h-[26rem]" />
            <div className="absolute right-[-18%] top-[-34%] h-[18rem] w-[62%] rounded-[100%] border border-white/10 opacity-45 blur-[1px] md:h-[26rem]" />
            <div className="absolute left-[12%] top-[18%] h-24 w-24 rounded-full bg-white/45 blur-[70px]" />
            <div className="absolute right-[12%] top-[18%] h-24 w-24 rounded-full bg-white/45 blur-[70px]" />
          </>
        ) : null}
        <div className="absolute inset-x-[7%] bottom-[-10%] h-[16rem] rounded-t-[100%] border-t border-white/7 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_60%)] opacity-70" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,22,41,0.1),rgba(7,22,41,0.84))]" />
      </div>

      <div className="relative space-y-8 px-5 py-7 md:px-8 md:py-10 xl:px-12">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <MatchEventBadge label={match.venue} icon={MapPin} tone={isLive ? "live" : "accent"} />
          <MatchStatusBadge status={match.status} teamType={detail.teamType} />
        </div>

        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(15rem,0.85fr)_minmax(0,1fr)]">
          <TeamScoreBlock team={match.homeTeam} align="left" />

          <div className="flex flex-col items-center text-center">
            <div className="flex items-end justify-center gap-4">
              {showScore ? (
                <>
                  <span className="rr-display text-[4.8rem] leading-none text-[color:var(--rr-gold)] md:text-[6.4rem]">
                    {match.homeScore}
                  </span>
                  <span className="rr-display pb-2 text-[2.5rem] leading-none text-white/78 md:text-[3.4rem]">
                    -
                  </span>
                  <span className="rr-display text-[4.8rem] leading-none text-white md:text-[6.4rem]">
                    {match.awayScore}
                  </span>
                </>
              ) : (
                <span className="rr-display text-[4.3rem] leading-none text-[color:var(--rr-gold)] md:text-[5.6rem]">
                  VS
                </span>
              )}
            </div>

            <div className="mt-4 h-px w-20 bg-[rgba(255,255,255,0.18)]" />

            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              <MatchEventBadge label={detail.stageLabel} icon={Trophy} tone="neutral" />
              <MatchEventBadge label={match.dateLabel} icon={CalendarDays} tone="neutral" />
              <MatchEventBadge
                label={isPending && match.status === "postponed" ? "Horario por confirmar" : isLive ? match.liveMinute ?? match.kickoffLabel : match.kickoffLabel}
                icon={isLive ? Radio : Clock3}
                tone={isLive ? "live" : "neutral"}
              />
              <MatchEventBadge label={stateLabel} tone="neutral" />
            </div>

            {showHighlights && detail.highlightsUrl ? (
              <HighlightsButton href={detail.highlightsUrl} className="mt-5" />
            ) : null}

            {isPending ? (
              <p className="rr-kicker mt-5 text-[0.78rem] text-[color:var(--rr-gold)]">
                {previewLabel}
              </p>
            ) : null}
          </div>

          <TeamScoreBlock team={match.awayTeam} align="right" />
        </div>

        {showScorers ? (
          <div className="border-t border-[rgba(255,255,255,0.08)] pt-6">
            {hasHomeScorers && hasAwayScorers ? (
              <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_1px_minmax(0,1fr)] md:items-start">
                <GoalScorersList
                  scorers={detail.homeScorers}
                  align="left"
                  title={match.homeTeam.name}
                />
                <div className="hidden bg-[rgba(255,255,255,0.08)] md:block" />
                <GoalScorersList
                  scorers={detail.awayScorers}
                  align="right"
                  title={match.awayTeam.name}
                />
              </div>
            ) : (
              <GoalScorersList
                scorers={hasHomeScorers ? detail.homeScorers : detail.awayScorers}
                align={hasHomeScorers ? "left" : "right"}
                title={hasHomeScorers ? match.homeTeam.name : match.awayTeam.name}
              />
            )}
          </div>
        ) : null}

        {!showScorers && !isPending && match.status !== "postponed" ? (
          <div
            className={cn(
              "border-t border-[rgba(255,255,255,0.08)] pt-5 text-center text-[0.98rem]",
              "text-[color:var(--rr-muted)]",
            )}
          >
            Sin detalle de anotadores disponible por ahora.
          </div>
        ) : null}
      </div>
    </section>
  );
}
