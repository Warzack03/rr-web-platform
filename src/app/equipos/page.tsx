import type { Metadata } from "next";
import { PublicSiteLayout } from "@/components/layout/public-site-layout";
import {
  AcademyTeamsGrid,
  FeaturedFirstTeamPanel,
  TeamsPageHeader,
} from "@/components/public/teams-directory";
import { getTeamsDirectoryContent } from "@/lib/public/teams-directory-content";

export const metadata: Metadata = {
  title: "Equipos",
  description: "Indice publico de la estructura deportiva de Rising Raimon.",
};

export default function TeamsPage() {
  const content = getTeamsDirectoryContent();

  return (
    <PublicSiteLayout activeNav="equipos">
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
