import type { Metadata } from "next";
import { PublicSiteLayout } from "@/components/layout/public-site-layout";
import {
  AcademyTeamsGrid,
  FeaturedFirstTeamPanel,
  TeamsPageHeader,
} from "@/components/public/teams-directory";
import { PublicEmptyState } from "@/components/public/public-empty-state";
import { getPublicTeamsDirectoryContentFromDb } from "@/server/services/public/teams";

export const metadata: Metadata = {
  title: "Equipos",
  description: "Indice publico de la estructura deportiva de Rising Raimon.",
};

export const revalidate = 300;

export default async function TeamsPage() {
  const dbContent = await getPublicTeamsDirectoryContentFromDb();

  if (!dbContent) {
    return (
      <PublicSiteLayout activeNav="equipos">
        <PublicEmptyState
          title="No hay equipos publicados"
          description="Cuando haya equipos visibles en la temporada activa, apareceran en esta seccion."
        />
      </PublicSiteLayout>
    );
  }

  return (
    <PublicSiteLayout activeNav="equipos" debugDataSource={{ source: "db", note: "equipos" }}>
      <TeamsPageHeader {...dbContent.hero} />
      <FeaturedFirstTeamPanel {...dbContent.featuredFirstTeam} />
      <AcademyTeamsGrid
        title={dbContent.academy.title}
        chip={dbContent.academy.chip}
        teams={dbContent.academy.teams}
        promo={dbContent.academy.promo}
      />
      {dbContent.catalunya ? (
        <AcademyTeamsGrid
          title={dbContent.catalunya.title}
          chip={dbContent.catalunya.chip}
          teams={dbContent.catalunya.teams}
          promo={dbContent.catalunya.promo}
        />
      ) : null}
    </PublicSiteLayout>
  );
}
