import { AdminMatchesWorkspace } from "@/components/admin/admin-matches-workspace";
import { requireAdminSectionAccess } from "@/server/auth/session";
import { getAdminMatchesScreenData } from "@/server/services/admin-matches";

type AdminMatchesPageProps = {
  searchParams: Promise<{
    ui?: string | string[];
    team?: string | string[];
  }>;
};

function getSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminMatchesPage({
  searchParams,
}: AdminMatchesPageProps) {
  const user = await requireAdminSectionAccess("matches");
  const data = await getAdminMatchesScreenData(user);
  const resolvedSearchParams = await searchParams;
  const initialUiState = getSingleValue(resolvedSearchParams.ui) === "error" ? "error" : "ready";

  return (
    <AdminMatchesWorkspace
      key={`${user.idString}-${initialUiState}-${getSingleValue(resolvedSearchParams.team) ?? "all"}`}
      initialMatches={data.matches}
      initialTeams={data.teams}
      initialOpponentOptions={data.opponentOptions}
      initialVenueOptions={data.venueOptions}
      initialUiState={initialUiState}
      initialSelectedTeamSlug={getSingleValue(resolvedSearchParams.team)}
    />
  );
}
