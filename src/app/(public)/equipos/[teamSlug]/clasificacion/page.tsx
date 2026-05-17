import { notFound, redirect } from "next/navigation";
import { TeamStandingsPageContent } from "@/src/components/public/team-route-layouts";
import { getStandings, getTeamBySlug } from "@/src/lib/demo-data";

export default async function TeamStandingsPage({
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
    redirect("/primer-equipo/clasificacion");
  }

  return <TeamStandingsPageContent team={team} rows={getStandings(team.slug)} />;
}
