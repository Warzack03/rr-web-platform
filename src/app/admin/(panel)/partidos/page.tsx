import type { Metadata } from "next";
import { AdminMatchesWorkspace } from "@/components/admin/admin-matches-workspace";
import { requireAdminSectionAccess } from "@/server/auth/session";
import { getAdminMatchesScreenData } from "@/server/services/admin-matches";
import { getAdminMediaPickerOptions } from "@/server/services/admin-media";

export const metadata: Metadata = {
  title: "Partidos",
};

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
  const [data, opponentLogoOptions] = await Promise.all([
    getAdminMatchesScreenData(user),
    getAdminMediaPickerOptions(["OPPONENT_LOGO"]),
  ]);
  const resolvedSearchParams = await searchParams;
  const initialUiState = getSingleValue(resolvedSearchParams.ui) === "error" ? "error" : "ready";

  return (
    <AdminMatchesWorkspace
      key={`${user.idString}-${initialUiState}-${getSingleValue(resolvedSearchParams.team) ?? "all"}`}
      initialMatches={data.matches}
      initialTeams={data.teams}
      initialOpponentOptions={data.opponentOptions}
      initialVenueOptions={data.venueOptions}
      opponentLogoOptions={opponentLogoOptions}
      initialUiState={initialUiState}
      initialSelectedTeamSlug={getSingleValue(resolvedSearchParams.team)}
    />
  );
}
