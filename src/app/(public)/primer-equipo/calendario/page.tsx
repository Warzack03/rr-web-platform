import { TeamCalendarPageContent } from "@/src/components/public/team-route-layouts";
import {
  getLatestResults,
  getTeamBySlug,
  getTeamMatches,
  getUpcomingMatch,
} from "@/src/lib/demo-data";

const team = getTeamBySlug("primer-equipo");

export default function FirstTeamCalendarPage() {
  if (!team) {
    return null;
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
