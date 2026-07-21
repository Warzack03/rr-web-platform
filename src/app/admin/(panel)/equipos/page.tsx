import { AdminTeamsWorkspace } from "@/components/admin/admin-teams-workspace";
import { requireAdminSectionAccess } from "@/server/auth/session";
import { getAdminMediaPickerOptions } from "@/server/services/admin-media";
import { getAdminTeamsScreenData } from "@/server/services/admin-teams";

type AdminTeamsPageProps = {
  searchParams: Promise<{
    ui?: string | string[];
  }>;
};

function getSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminTeamsPage({
  searchParams,
}: AdminTeamsPageProps) {
  const user = await requireAdminSectionAccess("teams");
  const [data, mediaOptions] = await Promise.all([
    getAdminTeamsScreenData(user),
    getAdminMediaPickerOptions(["TEAM_LOGO", "TEAM_BANNER"]),
  ]);
  const resolvedSearchParams = await searchParams;
  const initialUiState = getSingleValue(resolvedSearchParams.ui) === "error" ? "error" : "ready";

  return (
    <AdminTeamsWorkspace
      key={`${user.idString}-${initialUiState}`}
      initialTeams={data.teams}
      seasonOptions={data.seasonOptions}
      categoryOptions={data.categoryOptions}
      competitionOptions={data.competitionOptions}
      mediaOptions={mediaOptions}
      initialUiState={initialUiState}
    />
  );
}
