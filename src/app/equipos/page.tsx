import type { Metadata } from "next";
import { PublicSiteLayout } from "@/components/layout/public-site-layout";
import {
  AcademyTeamsGrid,
  FeaturedFirstTeamPanel,
  TeamsPageHeader,
} from "@/components/public/teams-directory";
import { PublicEmptyState } from "@/components/public/public-empty-state";
import { buildPublicPageMetadata } from "@/lib/seo";
import { getPublicTeamsDirectoryContentFromDb } from "@/server/services/public/teams";

export const metadata: Metadata = buildPublicPageMetadata({
  title: "Equipos",
  description: "Primer Equipo y equipos de cantera publicados por Rising Raimon.",
  path: "/equipos",
});

export const revalidate = 300;

export default async function TeamsPage() {
  const dbContent = await getPublicTeamsDirectoryContentFromDb();

  if (!dbContent) {
    return (
      <PublicSiteLayout activeNav="equipos">
        <PublicEmptyState
          title="No hay equipos publicados"
          description="Los equipos apareceran aqui cuando esten visibles."
        />
      </PublicSiteLayout>
    );
  }

  return (
    <PublicSiteLayout activeNav="equipos">
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
