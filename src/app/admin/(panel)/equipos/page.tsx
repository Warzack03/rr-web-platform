import { AdminTeamsWorkspace } from "@/components/admin/admin-teams-workspace";
import { OWNER_ADMIN_ROLE } from "@/lib/admin/roles";
import { getTeamManagementTeamsForRole } from "@/lib/admin/team-management-mocks";
import { requireAdminSectionAccess } from "@/server/auth/session";

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
  const resolvedSearchParams = await searchParams;
  void user;
  const initialUiState = getSingleValue(resolvedSearchParams.ui) === "error" ? "error" : "ready";

  return (
    <AdminTeamsWorkspace
      key={`${OWNER_ADMIN_ROLE}-${initialUiState}`}
      role={OWNER_ADMIN_ROLE}
      initialTeams={getTeamManagementTeamsForRole(OWNER_ADMIN_ROLE)}
      initialUiState={initialUiState}
    />
  );
}
