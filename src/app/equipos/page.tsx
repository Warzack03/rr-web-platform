import type { Metadata } from "next";
import { PublicSiteLayout } from "@/components/layout/public-site-layout";
import {
  AcademyTeamsGrid,
  FeaturedFirstTeamPanel,
  TeamsPageHeader,
} from "@/components/public/teams-directory";
import type { PublicDataSourceInfo } from "@/lib/public/data-source";
import { getTeamsDirectoryContent } from "@/lib/public/teams-directory-content";
import { getPublicTeamsDirectoryContentFromDb } from "@/server/services/public/teams";

export const metadata: Metadata = {
  title: "Equipos",
  description: "Indice publico de la estructura deportiva de Rising Raimon.",
};

export const revalidate = 300;

export default async function TeamsPage() {
  const dbContent = await getPublicTeamsDirectoryContentFromDb();
  const content = dbContent ?? getTeamsDirectoryContent();
  const dataSource: PublicDataSourceInfo = {
    source: dbContent ? "db" : "mock",
    note: "equipos",
  };

  return (
    <PublicSiteLayout activeNav="equipos" debugDataSource={dataSource}>
      <TeamsPageHeader {...content.hero} />
      <FeaturedFirstTeamPanel {...content.featuredFirstTeam} />
      <AcademyTeamsGrid
        title={content.academy.title}
        chip={content.academy.chip}
        teams={content.academy.teams}
        promo={content.academy.promo}
      />
    </PublicSiteLayout>
  );
}
