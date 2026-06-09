import Link from "next/link";
import { CalendarDays, Shield } from "lucide-react";
import { MatchPreviewPanel, RecentResultsStrip } from "@/components/public/team-overview-panels";
import { MiniStandingsTable } from "@/components/public/mini-standings-table";
import type { PublicHomePageContent } from "@/lib/public/home-content";

type HomeFirstTeamBlockProps = {
  content: PublicHomePageContent["firstTeam"];
};

export function HomeFirstTeamBlock({ content }: HomeFirstTeamBlockProps) {
  return (
    <section className="mx-auto w-full max-w-[1280px] px-5 py-12 md:px-8 md:py-16 xl:px-16">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-[39rem]">
          <p className="rr-kicker text-[color:var(--rr-gold)]">{content.eyebrow}</p>
          <h2 className="rr-display mt-4 text-[3.4rem] leading-[0.9] text-white md:text-[4.4rem]">
            {content.title}
          </h2>
          <p className="mt-4 text-[1.06rem] leading-7 text-[color:var(--rr-muted)]">
            {content.description}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Link
            href={content.teamHref}
            className="rr-kicker inline-flex items-center gap-2 text-[0.84rem] text-[color:var(--rr-muted)] transition hover:text-[color:var(--rr-gold)]"
          >
            <Shield className="h-4 w-4" strokeWidth={1.9} />
            Ver Primer Equipo
          </Link>
          <Link
            href={content.calendarHref}
            className="rr-kicker inline-flex items-center gap-2 text-[0.84rem] text-[color:var(--rr-gold)] transition hover:text-[#ffd46f]"
          >
            <CalendarDays className="h-4 w-4" strokeWidth={1.9} />
            Ver calendario
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <MatchPreviewPanel match={content.nextMatch} />
        </div>

        <div className="space-y-6 lg:col-span-4">
          <MiniStandingsTable rows={content.standingsRows} href={content.standingHref} />
          <RecentResultsStrip
            results={content.recentResults}
            title="Ultimos resultados"
            ctaHref={content.calendarHref}
            ctaLabel="Ver calendario"
            layout="compact"
          />
        </div>
      </div>
    </section>
  );
}
