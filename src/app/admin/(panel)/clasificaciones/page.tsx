import { AdminStandingsWorkspace } from "@/components/admin/admin-standings-workspace";
import { getPreviewRole, isAdminRole, type AdminRole } from "@/lib/admin/roles";
import { requireAdminSectionAccess } from "@/server/auth/session";

type AdminStandingsPageProps = {
  searchParams: Promise<{
    previewRole?: string | string[];
    ui?: string | string[];
    team?: string | string[];
  }>;
};

function getSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function getActualRole(role: string): AdminRole {
  return isAdminRole(role) ? role : "COACH";
}

export default async function AdminStandingsPage({
  searchParams,
}: AdminStandingsPageProps) {
  const user = await requireAdminSectionAccess("standings");
  const resolvedSearchParams = await searchParams;
  const actualRole = getActualRole(user.role);
  const previewRole = getPreviewRole(
    getSingleValue(resolvedSearchParams.previewRole),
    actualRole,
  );
  const initialUiState =
    getSingleValue(resolvedSearchParams.ui) === "error" ? "error" : "ready";

  return (
    <AdminStandingsWorkspace
      key={`${previewRole}-${initialUiState}-${getSingleValue(resolvedSearchParams.team) ?? "all"}`}
      role={previewRole}
      initialUiState={initialUiState}
      initialSelectedTeamSlug={getSingleValue(resolvedSearchParams.team)}
    />
  );
}
