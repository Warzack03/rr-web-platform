import { AdminAssignmentsWorkspace } from "@/components/admin/admin-assignments-workspace";
import { getAdminAssignmentsScreenData } from "@/server/services/admin-assignments";
import { requireAdminSectionAccess } from "@/server/auth/session";

type AdminAssignmentsPageProps = {
  searchParams: Promise<{
    team?: string | string[];
    player?: string | string[];
  }>;
};

function getSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminAssignmentsPage({
  searchParams,
}: AdminAssignmentsPageProps) {
  const user = await requireAdminSectionAccess("assignments");
  const data = await getAdminAssignmentsScreenData(user);
  const resolvedSearchParams = await searchParams;
  const requestedPlayerId = getSingleValue(resolvedSearchParams.player);
  const requestedTeamSlug = getSingleValue(resolvedSearchParams.team);
  const assignmentFromPlayer = requestedPlayerId
    ? data.assignments.find((assignment) => assignment.playerId === requestedPlayerId)
    : undefined;
  const initialSelectedTeamSlug =
    assignmentFromPlayer?.teamSlug ??
    (requestedTeamSlug && data.teams.some((team) => team.slug === requestedTeamSlug)
      ? requestedTeamSlug
      : data.teams[0]?.slug);
  const initialSelectedAssignmentId =
    assignmentFromPlayer?.id ??
    data.assignments.find((assignment) => assignment.teamSlug === initialSelectedTeamSlug)?.id;

  return (
    <AdminAssignmentsWorkspace
      key={`${user.idString}-${initialSelectedTeamSlug ?? "none"}-${initialSelectedAssignmentId ?? "none"}`}
      activeSeasonLabel={data.activeSeasonName ?? undefined}
      initialTeams={data.teams}
      initialAssignments={data.assignments}
      initialPlayerOptions={data.playerOptions}
      initialSelectedTeamSlug={initialSelectedTeamSlug}
      initialSelectedAssignmentId={initialSelectedAssignmentId}
    />
  );
}
