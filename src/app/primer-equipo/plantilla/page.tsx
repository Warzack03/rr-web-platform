import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicSiteLayout } from "@/components/layout/public-site-layout";
import { TeamSquadPage } from "@/components/public/team-squad-page";
import { getPublicRosterContentFromDb } from "@/server/services/public/roster";

export const metadata: Metadata = {
  title: "Plantilla | Primer Equipo",
  description: "Plantilla publica del Primer Equipo de Rising Raimon.",
};

export const revalidate = 300;

export default async function FirstTeamSquadPage() {
  const dbSquad = await getPublicRosterContentFromDb("primer-equipo");

  if (!dbSquad) {
    notFound();
  }

  return (
    <PublicSiteLayout activeNav="primer-equipo">
      <TeamSquadPage squad={dbSquad} teamType="first-team" />
    </PublicSiteLayout>
  );
}
