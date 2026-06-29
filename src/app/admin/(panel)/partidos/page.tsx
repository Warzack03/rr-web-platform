import { AdminMatchesWorkspace } from "@/components/admin/admin-matches-workspace";
import { OWNER_ADMIN_ROLE } from "@/lib/admin/roles";
import { requireAdminSectionAccess } from "@/server/auth/session";

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
  const resolvedSearchParams = await searchParams;
  void user;
  const initialUiState = getSingleValue(resolvedSearchParams.ui) === "error" ? "error" : "ready";

  return (
    <AdminMatchesWorkspace
      key={`${OWNER_ADMIN_ROLE}-${initialUiState}-${getSingleValue(resolvedSearchParams.team) ?? "all"}`}
      role={OWNER_ADMIN_ROLE}
      initialUiState={initialUiState}
      initialSelectedTeamSlug={getSingleValue(resolvedSearchParams.team)}
    />
  );
}
