import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicSiteLayout } from "@/components/layout/public-site-layout";
import { CalendarPageTitle } from "@/components/public/calendar-page-title";
import { TeamCalendar } from "@/components/public/team-calendar";
import { getAcademyTeamCalendarContent } from "@/lib/public/team-calendar-content";
import { getPublicAcademyTeamPageContent } from "@/lib/public/team-page-content";

type TeamPlaceholderPageProps = {
  params: Promise<{
    teamSlug: string;
  }>;
};

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
    title: `Calendario | ${teamSummary.name}`,
    description: `Calendario publico de ${teamSummary.name} en Rising Raimon.`,
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

  const calendar = getAcademyTeamCalendarContent({
    slug: teamSummary.slug,
    name: teamSummary.name,
    competition: teamSummary.competition,
    season: teamSummary.season,
  });

  return (
    <PublicSiteLayout activeNav="equipos">
      <div className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top,rgba(253,203,88,0.1),transparent_56%)]" />
        <div className="absolute inset-x-0 top-24 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)]" />

        <section className="relative mx-auto w-full max-w-[1280px] px-5 py-16 md:px-8 md:py-20 xl:px-16">
          <CalendarPageTitle
            title={calendar.pageTitle}
            subtitle={calendar.subtitle}
            backHref={`/equipos/${teamSummary.slug}`}
            backLabel={`Volver a ${teamSummary.name}`}
          />
          <TeamCalendar
            matchdays={calendar.matchdays}
            teamType="academy"
            showLiveFeatures={false}
            showVideoActions={false}
            className="mt-12 md:mt-14"
          />
        </section>
      </div>
    </PublicSiteLayout>
  );
}
