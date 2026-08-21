import type { Metadata } from "next";
import { AdminStandingsWorkspace } from "@/components/admin/admin-standings-workspace";
import { requireAdminSectionAccess } from "@/server/auth/session";
import { getAdminStandingsScreenData } from "@/server/services/admin-standings";

export const metadata: Metadata = {
  title: "Clasificaciones",
};

type AdminStandingsPageProps = {
  searchParams: Promise<{
    ui?: string | string[];
    team?: string | string[];
  }>;
};

function getSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminStandingsPage({
  searchParams,
}: AdminStandingsPageProps) {
  const user = await requireAdminSectionAccess("standings");
  const data = await getAdminStandingsScreenData(user);
  const resolvedSearchParams = await searchParams;
  const initialUiState =
    getSingleValue(resolvedSearchParams.ui) === "error" ? "error" : "ready";

  return (
    <AdminStandingsWorkspace
      key={`${user.idString}-${initialUiState}-${getSingleValue(resolvedSearchParams.team) ?? "all"}`}
      initialUiState={initialUiState}
      initialSelectedTeamSlug={getSingleValue(resolvedSearchParams.team)}
      initialTables={data.tables}
      initialTeams={data.teams}
      activeSeasonLabel={data.activeSeasonName ?? undefined}
    />
  );
}
