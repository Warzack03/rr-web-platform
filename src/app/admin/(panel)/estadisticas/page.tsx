import { AdminStatsWorkspace } from "@/components/admin/admin-stats-workspace";
import { OWNER_ADMIN_ROLE } from "@/lib/admin/roles";
import { requireAdminSectionAccess } from "@/server/auth/session";

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
  const resolvedSearchParams = await searchParams;
  void user;
  const initialUiState = getSingleValue(resolvedSearchParams.ui) === "error" ? "error" : "ready";

  return (
    <AdminStatsWorkspace
      key={`${OWNER_ADMIN_ROLE}-${initialUiState}-${getSingleValue(resolvedSearchParams.team) ?? "all"}-${getSingleValue(resolvedSearchParams.match) ?? "all"}`}
      role={OWNER_ADMIN_ROLE}
      initialUiState={initialUiState}
      initialSelectedTeamSlug={getSingleValue(resolvedSearchParams.team)}
      initialSelectedMatchId={getSingleValue(resolvedSearchParams.match)}
    />
  );
}
