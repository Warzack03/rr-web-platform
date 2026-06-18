import type { Metadata } from "next";
import { PublicSiteLayout } from "@/components/layout/public-site-layout";
import { CalendarPageTitle } from "@/components/public/calendar-page-title";
import { TeamCalendar } from "@/components/public/team-calendar";
import { getFirstTeamCalendarContent } from "@/lib/public/team-calendar-content";
import { TeamSectionNavigation } from "@/components/public/team-section-navigation";
import { getTeamSectionLinks } from "@/lib/public/team-section-links";

export const metadata: Metadata = {
  title: "Calendario | Primer Equipo",
  description: "Calendario publico del Primer Equipo de Rising Raimon.",
};

export default function FirstTeamCalendarPage() {
  const calendar = getFirstTeamCalendarContent();

  return (
    <PublicSiteLayout activeNav="primer-equipo">
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
