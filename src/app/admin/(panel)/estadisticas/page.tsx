import { AdminStatsWorkspace } from "@/components/admin/admin-stats-workspace";
import { getPreviewRole, isAdminRole, type AdminRole } from "@/lib/admin/roles";
import { requireAdminSectionAccess } from "@/server/auth/session";

type AdminStatsPageProps = {
  searchParams: Promise<{
    previewRole?: string | string[];
    ui?: string | string[];
    team?: string | string[];
    match?: string | string[];
  }>;
};

function getSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function getActualRole(role: string): AdminRole {
  return isAdminRole(role) ? role : "COACH";
}

export default async function AdminStatsPage({
  searchParams,
}: AdminStatsPageProps) {
  const user = await requireAdminSectionAccess("stats");
  const resolvedSearchParams = await searchParams;
  const actualRole = getActualRole(user.role);
  const previewRole = getPreviewRole(getSingleValue(resolvedSearchParams.previewRole), actualRole);
  const initialUiState = getSingleValue(resolvedSearchParams.ui) === "error" ? "error" : "ready";

  return (
    <AdminStatsWorkspace
      key={`${previewRole}-${initialUiState}-${getSingleValue(resolvedSearchParams.team) ?? "all"}-${getSingleValue(resolvedSearchParams.match) ?? "all"}`}
      role={previewRole}
      initialUiState={initialUiState}
      initialSelectedTeamSlug={getSingleValue(resolvedSearchParams.team)}
      initialSelectedMatchId={getSingleValue(resolvedSearchParams.match)}
    />
  );
}
