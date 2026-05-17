import { notFound, redirect } from "next/navigation";
import { TeamRosterPageContent } from "@/src/components/public/team-route-layouts";
import { getTeamBySlug, getTeamPlayers } from "@/src/lib/demo-data";

export default async function TeamRosterPage({
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
    redirect("/primer-equipo/plantilla");
  }

  return <TeamRosterPageContent team={team} players={getTeamPlayers(team.slug)} />;
}
