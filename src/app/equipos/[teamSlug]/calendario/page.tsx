import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicSiteLayout } from "@/components/layout/public-site-layout";
import { PageHero } from "@/components/public/page-hero";
import { TeamCalendar } from "@/components/public/team-calendar";
import { getPublicAcademyTeamPageContent } from "@/lib/public/team-page-content";
import { buildPublicPageMetadata } from "@/lib/seo";
import { getPublicTeamCalendarContentFromDb } from "@/server/services/public/calendar";
import { getPublicNonFirstTeamSlugsFromDb } from "@/server/services/public/teams";

type TeamPlaceholderPageProps = {
  params: Promise<{
    teamSlug: string;
  }>;
};

export const revalidate = 300;

export async function generateStaticParams() {
  if (process.env.NEXT_PHASE === "phase-production-build") {
    return [];
  }

  const teamSlugs = await getPublicNonFirstTeamSlugsFromDb();

  return teamSlugs.map((teamSlug) => ({
    teamSlug,
  }));
}

export async function generateMetadata({
  params,
}: TeamPlaceholderPageProps): Promise<Metadata> {
  const { teamSlug } = await params;
  const teamSummary = await getPublicAcademyTeamPageContent(teamSlug);

  if (!teamSummary) {
    return {
      title: "Calendario no encontrado",
    };
  }

  return {
    ...buildPublicPageMetadata({
      title: `Calendario | ${teamSummary.name}`,
      description: `Calendario público de partidos de ${teamSummary.name}.`,
      path: `/equipos/${teamSummary.slug}/calendario`,
      imageUrl: teamSummary.heroImageUrl,
    }),
  };
}

export default async function AcademyTeamCalendarPage({
  params,
}: TeamPlaceholderPageProps) {
  const { teamSlug } = await params;
  const teamSummary = await getPublicAcademyTeamPageContent(teamSlug);

  if (!teamSummary) {
    notFound();
  }

  const dbCalendar = await getPublicTeamCalendarContentFromDb(teamSlug);

  if (!dbCalendar) {
    notFound();
  }

  const calendar = dbCalendar;

  return (
    <PublicSiteLayout activeNav="equipos">
      <PageHero content={teamSummary} activeKey="calendar" />
      <div className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top,rgba(253,203,88,0.1),transparent_56%)]" />
        <div className="absolute inset-x-0 top-24 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)]" />

        <section className="relative mx-auto w-full max-w-[1280px] px-5 py-10 md:px-8 md:py-14 xl:px-16">
          <TeamCalendar
            matchdays={calendar.matchdays}
            teamType="academy"
            showLiveFeatures={false}
            showVideoActions={false}
          />
        </section>
      </div>
    </PublicSiteLayout>
  );
}
