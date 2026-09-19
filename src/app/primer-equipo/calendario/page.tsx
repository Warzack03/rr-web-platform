import type { Metadata } from "next";
import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";
import { PublicSiteLayout } from "@/components/layout/public-site-layout";
import { PageHero } from "@/components/public/page-hero";
import { TeamCalendar } from "@/components/public/team-calendar";
import { getPublicTeamHeroContent } from "@/lib/public/team-page-content";
import { buildPublicPageMetadata } from "@/lib/seo";
import { getPublicTeamCalendarContentFromDb } from "@/server/services/public/calendar";

export const metadata: Metadata = buildPublicPageMetadata({
  title: "Calendario | Primer Equipo",
  description: "Calendario público de partidos del Primer Equipo de Rising Raimon.",
  path: "/primer-equipo/calendario",
});

export const dynamic = "force-dynamic";

const getCachedFirstTeamCalendar = unstable_cache(
  () => getPublicTeamCalendarContentFromDb("primer-equipo"),
  ["public-first-team-calendar"],
  { revalidate: 300 },
);

export default async function FirstTeamCalendarPage() {
  const [dbCalendar, heroContent] = await Promise.all([
    getCachedFirstTeamCalendar(),
    getPublicTeamHeroContent("primer-equipo"),
  ]);

  if (!dbCalendar || !heroContent) {
    notFound();
  }

  const calendar = dbCalendar;

  return (
    <PublicSiteLayout activeNav="primer-equipo">
      <PageHero content={heroContent} activeKey="calendar" />
      <div className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top,rgba(253,203,88,0.1),transparent_56%)]" />
        <div className="absolute inset-x-0 top-24 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)]" />

        <section className="relative mx-auto w-full max-w-[1280px] px-5 py-10 md:px-8 md:py-14 xl:px-16">
          <TeamCalendar
            matchdays={calendar.matchdays}
            teamType="first-team"
            showLiveFeatures
          />
        </section>
      </div>
    </PublicSiteLayout>
  );
}
