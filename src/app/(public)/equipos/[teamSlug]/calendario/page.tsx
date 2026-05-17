import { notFound, redirect } from "next/navigation";
import { TeamCalendarPageContent } from "@/src/components/public/team-route-layouts";
import {
  getLatestResults,
  getTeamBySlug,
  getTeamMatches,
  getUpcomingMatch,
} from "@/src/lib/demo-data";

export default async function TeamCalendarPage({
  params,
}: {
  params: Promise<{ teamSlug: string }>;
}) {
  const { teamSlug } = await params;
  const team = getTeamBySlug(teamSlug);

  if (!team) {
    notFound();
  }

  if (team.isFirstTeam) {
    redirect("/primer-equipo/calendario");
  }

  return (
    <TeamCalendarPageContent
      team={team}
      nextMatch={getUpcomingMatch(team.slug)}
      results={getLatestResults(team.slug)}
      matches={getTeamMatches(team.slug)}
    />
  );
}
