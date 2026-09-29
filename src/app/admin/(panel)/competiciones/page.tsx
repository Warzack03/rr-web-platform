import type { Metadata } from "next";
import { AdminCompetitionsWorkspace } from "@/components/admin/admin-competitions-workspace";
import { requireAdminSectionAccess } from "@/server/auth/session";
import { getAdminCompetitionsScreenData } from "@/server/services/admin-competitions";

export const metadata: Metadata = {
  title: "Competiciones",
};

export default async function AdminCompetitionsPage() {
  const user = await requireAdminSectionAccess("competitions");
  const data = await getAdminCompetitionsScreenData(user);

  return (
    <AdminCompetitionsWorkspace
      initialCompetitions={data.competitions}
      seasonOptions={data.seasonOptions}
    />
  );
}

