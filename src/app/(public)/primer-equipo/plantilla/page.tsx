import { TeamRosterPageContent } from "@/src/components/public/team-route-layouts";
import { getTeamBySlug, getTeamPlayers } from "@/src/lib/demo-data";

const team = getTeamBySlug("primer-equipo");

export default function FirstTeamRosterPage() {
  if (!team) {
    return null;
  }

  return <TeamRosterPageContent team={team} players={getTeamPlayers(team.slug)} />;
}
