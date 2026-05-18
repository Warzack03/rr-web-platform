import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { MatchScoreHero } from "@/components/public/match-score-hero";
import { PlayerPerformanceGrid } from "@/components/public/player-performance-grid";
import type { MatchDetailContent } from "@/lib/public/match-detail-content";

type MatchDetailPageProps = {
  detail: MatchDetailContent;
  backHref: string;
  backLabel: string;
};

export function MatchDetailPage({
  detail,
  backHref,
  backLabel,
}: MatchDetailPageProps) {
  const showPerformance =
    (detail.match.status === "played" ||
      (detail.match.status === "live" && detail.showLiveFeatures)) &&
    detail.playerPerformances.length > 0;

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top,rgba(253,203,88,0.1),transparent_56%)]" />
      <div className="absolute inset-x-0 top-24 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)]" />

      <section className="relative mx-auto w-full max-w-[1280px] px-5 py-12 md:px-8 md:py-16 xl:px-16">
        <Link
          href={backHref}
          className="rr-kicker inline-flex items-center gap-2 text-[0.82rem] text-[color:var(--rr-muted)] transition hover:text-[color:var(--rr-gold)]"
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={1.9} />
          <span>{backLabel}</span>
        </Link>

        {detail.context ? (
          <section className="rr-panel mt-7 border px-5 py-5 md:px-6">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div className="space-y-3">
                <p className="rr-kicker text-[0.76rem] text-[color:var(--rr-gold)]">
                  {detail.context.season}
                </p>
                <div>
                  <h1 className="rr-display text-[2.9rem] leading-[0.92] text-white md:text-[3.6rem]">
                    {detail.context.teamName}
                  </h1>
                  <p className="mt-2 text-[1rem] text-[color:var(--rr-muted)]">
                    {detail.stageLabel}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {detail.context.backToCalendarHref && detail.context.backToCalendarLabel ? (
                  <Link
                    href={detail.context.backToCalendarHref}
                    className="rr-kicker inline-flex min-h-10 items-center border border-[rgba(255,255,255,0.12)] px-4 py-2 text-[0.78rem] text-[color:var(--rr-muted)] transition hover:border-[rgba(253,203,88,0.28)] hover:text-white"
                  >
                    {detail.context.backToCalendarLabel}
                  </Link>
                ) : null}
                {detail.context.backToTeamHref && detail.context.backToTeamLabel ? (
                  <Link
                    href={detail.context.backToTeamHref}
                    className="rr-kicker inline-flex min-h-10 items-center border border-[rgba(253,203,88,0.28)] px-4 py-2 text-[0.78rem] text-[color:var(--rr-gold)] transition hover:bg-[rgba(253,203,88,0.08)]"
                  >
                    {detail.context.backToTeamLabel}
                  </Link>
                ) : null}
              </div>
            </div>
          </section>
        ) : null}

        <div className={detail.context ? "mt-6" : "mt-8"}>
          <MatchScoreHero detail={detail} />
        </div>

        {showPerformance ? (
          <div className="mt-14 md:mt-16">
            <PlayerPerformanceGrid
              players={detail.playerPerformances}
              teamType={detail.teamType}
            />
          </div>
        ) : null}
      </section>
    </div>
  );
}
