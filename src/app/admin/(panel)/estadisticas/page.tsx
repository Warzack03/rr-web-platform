import { AdminStatsWorkspace } from "@/components/admin/admin-stats-workspace";
import { toAdminRole } from "@/lib/admin/roles";
import { requireAdminSectionAccess } from "@/server/auth/session";
import { getAdminStatsScreenData } from "@/server/services/admin-stats";

type AdminStatsPageProps = {
  searchParams: Promise<{
    ui?: string | string[];
    team?: string | string[];
    match?: string | string[];
  }>;
};

function getSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminStatsPage({
  searchParams,
}: AdminStatsPageProps) {
  const user = await requireAdminSectionAccess("stats");
  const data = await getAdminStatsScreenData(user);
  const resolvedSearchParams = await searchParams;
  const initialUiState = getSingleValue(resolvedSearchParams.ui) === "error" ? "error" : "ready";
  const requestedTeamSlug = getSingleValue(resolvedSearchParams.team);
  const requestedMatchId = getSingleValue(resolvedSearchParams.match);
  const selectedMatch = requestedMatchId
    ? data.matches.find((match) => match.id === requestedMatchId)
    : undefined;
  const initialSelectedTeamSlug =
    selectedMatch?.teamSlug ??
    (requestedTeamSlug && data.teams.some((team) => team.slug === requestedTeamSlug)
      ? requestedTeamSlug
      : data.teams[0]?.slug);
  const initialSelectedMatchId =
    requestedMatchId &&
    data.matches.some(
      (match) =>
        match.id === requestedMatchId &&
        (initialSelectedTeamSlug ? match.teamSlug === initialSelectedTeamSlug : true),
    )
      ? requestedMatchId
      : data.matches.find((match) => match.teamSlug === initialSelectedTeamSlug)?.id;

  return (
    <AdminStatsWorkspace
      key={`${user.idString}-${initialUiState}-${initialSelectedTeamSlug ?? "all"}-${initialSelectedMatchId ?? "all"}`}
      role={toAdminRole(user.role)}
      initialUiState={initialUiState}
      initialSelectedTeamSlug={initialSelectedTeamSlug}
      initialSelectedMatchId={initialSelectedMatchId}
      activeSeasonLabel={data.activeSeasonName ?? undefined}
      initialTeams={data.teams}
      initialMatches={data.matches}
      initialPlayers={data.players}
      initialPlayerCatalog={data.playerCatalog}
      initialStatsState={data.statsState}
      coachTeamOptions={data.coachTeamOptions}
    />
  );
}
