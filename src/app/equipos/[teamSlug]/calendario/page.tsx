import type { Metadata } from "next";
import { PublicSiteLayout } from "@/components/layout/public-site-layout";
import { CalendarPageTitle } from "@/components/public/calendar-page-title";
import { PublicEmptyState } from "@/components/public/public-empty-state";
import { TeamCalendar } from "@/components/public/team-calendar";
import { TeamSectionNavigation } from "@/components/public/team-section-navigation";
import { getPublicAcademyTeamPageContent } from "@/lib/public/team-page-content";
import { getTeamSectionLinks } from "@/lib/public/team-section-links";
import { getPublicTeamCalendarContentFromDb } from "@/server/services/public/calendar";

type TeamPlaceholderPageProps = {
  params: Promise<{
    teamSlug: string;
  }>;
};

export const revalidate = 300;

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
    return (
      <PublicSiteLayout activeNav="equipos">
        <PublicEmptyState
          title="No hay datos del equipo"
          description="Cuando este equipo exista en la DB y este visible, su calendario aparecera aqui."
        />
      </PublicSiteLayout>
    );
  }

  const dbCalendar = await getPublicTeamCalendarContentFromDb(teamSlug);

  if (!dbCalendar) {
    return (
      <PublicSiteLayout activeNav="equipos">
        <PublicEmptyState
          eyebrow={teamSummary.name}
          title="No hay calendario publicado"
          description="Cuando haya partidos visibles en la DB, el calendario de este equipo aparecera aqui."
        />
      </PublicSiteLayout>
    );
  }

  const calendar = dbCalendar;

  return (
    <PublicSiteLayout activeNav="equipos" debugDataSource={{ source: "db", note: teamSlug }}>
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
          <TeamSectionNavigation
            links={getTeamSectionLinks({ teamType: "academy", teamSlug })}
            activeKey="calendar"
            className="mt-8"
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
