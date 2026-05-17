import { TeamStandingsPageContent } from "@/src/components/public/team-route-layouts";
import { getStandings, getTeamBySlug } from "@/src/lib/demo-data";

const team = getTeamBySlug("primer-equipo");

export default function FirstTeamStandingsPage() {
  if (!team) {
    return null;
  }

  return <TeamStandingsPageContent team={team} rows={getStandings(team.slug)} />;
}
