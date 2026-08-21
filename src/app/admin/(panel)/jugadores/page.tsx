import type { Metadata } from "next";
import { AdminPlayersWorkspace } from "@/components/admin/admin-players-workspace";
import { requireAdminSectionAccess } from "@/server/auth/session";
import { getAdminMediaPickerOptions } from "@/server/services/admin-media";
import { getAdminPlayersScreenData } from "@/server/services/admin-players";

export const metadata: Metadata = {
  title: "Jugadores",
};

type AdminPlayersPageProps = {
  searchParams: Promise<{
    player?: string | string[];
    team?: string | string[];
  }>;
};

function getSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminPlayersPage({
  searchParams,
}: AdminPlayersPageProps) {
  const user = await requireAdminSectionAccess("players");
  const [data, mediaOptions] = await Promise.all([
    getAdminPlayersScreenData(user),
    getAdminMediaPickerOptions(["PLAYER_PHOTO"]),
  ]);
  const resolvedSearchParams = await searchParams;
  const requestedPlayerId = getSingleValue(resolvedSearchParams.player);
  const requestedTeamSlug = getSingleValue(resolvedSearchParams.team);

  return (
    <AdminPlayersWorkspace
      initialPlayers={data.players}
      initialTeams={data.teams}
      countryOptions={data.countryOptions}
      mediaOptions={mediaOptions}
      initialSelectedPlayerId={
        requestedPlayerId && data.players.some((player) => player.id === requestedPlayerId)
          ? requestedPlayerId
          : undefined
      }
      initialTeamFilter={
        requestedTeamSlug && data.teams.some((team) => team.slug === requestedTeamSlug)
          ? requestedTeamSlug
          : "all"
      }
    />
  );
}
