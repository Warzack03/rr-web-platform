import type { Metadata } from "next";
import { PublicSiteLayout } from "@/components/layout/public-site-layout";
import { CalendarPageTitle } from "@/components/public/calendar-page-title";
import { PublicEmptyState } from "@/components/public/public-empty-state";
import { TeamCalendar } from "@/components/public/team-calendar";
import { TeamSectionNavigation } from "@/components/public/team-section-navigation";
import { getTeamSectionLinks } from "@/lib/public/team-section-links";
import { getPublicTeamCalendarContentFromDb } from "@/server/services/public/calendar";

export const metadata: Metadata = {
  title: "Calendario | Primer Equipo",
  description: "Calendario publico del Primer Equipo de Rising Raimon.",
};

export const revalidate = 300;

export default async function FirstTeamCalendarPage() {
  const dbCalendar = await getPublicTeamCalendarContentFromDb("primer-equipo");

  if (!dbCalendar) {
    return (
      <PublicSiteLayout activeNav="primer-equipo">
        <PublicEmptyState
          title="No hay calendario publicado"
          description="Cuando haya partidos visibles en la DB, el calendario del Primer Equipo aparecera aqui."
        />
      </PublicSiteLayout>
    );
  }

  const calendar = dbCalendar;

  return (
    <PublicSiteLayout activeNav="primer-equipo" debugDataSource={{ source: "db", note: "primer-equipo" }}>
      <div className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top,rgba(253,203,88,0.1),transparent_56%)]" />
        <div className="absolute inset-x-0 top-24 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)]" />

        <section className="relative mx-auto w-full max-w-[1280px] px-5 py-16 md:px-8 md:py-20 xl:px-16">
          <CalendarPageTitle title={calendar.pageTitle} subtitle={calendar.subtitle} />
          <TeamSectionNavigation
            links={getTeamSectionLinks({ teamType: "first-team" })}
            activeKey="calendar"
            className="mt-8"
          />
          <TeamCalendar
            matchdays={calendar.matchdays}
            teamType="first-team"
            showLiveFeatures
            className="mt-12 md:mt-14"
          />
        </section>
      </div>
    </PublicSiteLayout>
  );
}
