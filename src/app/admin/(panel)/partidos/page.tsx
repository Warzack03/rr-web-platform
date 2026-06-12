import { AdminMatchesWorkspace } from "@/components/admin/admin-matches-workspace";
import { getPreviewRole, isAdminRole, type AdminRole } from "@/lib/admin/roles";
import { requireAdminSectionAccess } from "@/server/auth/session";

type AdminMatchesPageProps = {
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

export default async function AdminMatchesPage({
  searchParams,
}: AdminMatchesPageProps) {
  const user = await requireAdminSectionAccess("matches");
  const resolvedSearchParams = await searchParams;
  const actualRole = getActualRole(user.role);
  const previewRole = getPreviewRole(getSingleValue(resolvedSearchParams.previewRole), actualRole);
  const initialUiState = getSingleValue(resolvedSearchParams.ui) === "error" ? "error" : "ready";

  return (
    <AdminMatchesWorkspace
      key={`${previewRole}-${initialUiState}-${getSingleValue(resolvedSearchParams.team) ?? "all"}`}
      role={previewRole}
      initialUiState={initialUiState}
      initialSelectedTeamSlug={getSingleValue(resolvedSearchParams.team)}
    />
  );
}
