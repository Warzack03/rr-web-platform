import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicSiteLayout } from "@/components/layout/public-site-layout";
import { TeamSquadPage } from "@/components/public/team-squad-page";
import { buildPublicPageMetadata } from "@/lib/seo";
import { getPublicRosterContentFromDb } from "@/server/services/public/roster";

export const metadata: Metadata = buildPublicPageMetadata({
  title: "Plantilla | Primer Equipo",
  description: "Cromos y plantilla pública del Primer Equipo de Rising Raimon.",
  path: "/primer-equipo/plantilla",
});

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
