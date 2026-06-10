import { AdminTeamsWorkspace } from "@/components/admin/admin-teams-workspace";
import { getPreviewRole, isAdminRole, type AdminRole } from "@/lib/admin/roles";
import { getTeamManagementTeamsForRole } from "@/lib/admin/team-management-mocks";
import { requireAdminSectionAccess } from "@/server/auth/session";

type AdminTeamsPageProps = {
  searchParams: Promise<{
    previewRole?: string | string[];
    ui?: string | string[];
  }>;
};

function getSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function getActualRole(role: string): AdminRole {
  return isAdminRole(role) ? role : "COACH";
}

export default async function AdminTeamsPage({
  searchParams,
}: AdminTeamsPageProps) {
  const user = await requireAdminSectionAccess("teams");
  const resolvedSearchParams = await searchParams;
  const actualRole = getActualRole(user.role);
  const previewRole = getPreviewRole(getSingleValue(resolvedSearchParams.previewRole), actualRole);
  const initialUiState = getSingleValue(resolvedSearchParams.ui) === "error" ? "error" : "ready";

  return (
    <AdminTeamsWorkspace
      key={`${previewRole}-${initialUiState}`}
      role={previewRole}
      initialTeams={getTeamManagementTeamsForRole(previewRole)}
      initialUiState={initialUiState}
    />
  );
}
