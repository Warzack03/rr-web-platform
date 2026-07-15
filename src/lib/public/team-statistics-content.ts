import type { PublicDataSourceInfo } from "@/lib/public/data-source";
import type { TeamStatisticsPageContent } from "@/lib/public/team-statistics-utils";
import {
  getAcademyTeamStatisticsPageContentFromDb,
  getFirstTeamStatisticsPageContentFromDb,
} from "@/server/services/public/statistics";

export async function getFirstTeamStatisticsPageContent(): Promise<TeamStatisticsPageContent | null> {
  const result = await getFirstTeamStatisticsPageContentWithSource();

  return result?.content ?? null;
}

export async function getFirstTeamStatisticsPageContentWithSource(): Promise<{
  content: TeamStatisticsPageContent;
  dataSource: PublicDataSourceInfo;
} | null> {
  const dbContent = await getFirstTeamStatisticsPageContentFromDb();

  if (dbContent) {
    return {
      content: dbContent,
      dataSource: {
        source: "db",
        note: "stats",
      },
    };
  }

  return null;
}

export async function getAcademyTeamStatisticsPageContent(
  teamSlug: string,
): Promise<TeamStatisticsPageContent | null> {
  const result = await getAcademyTeamStatisticsPageContentWithSource(teamSlug);

  return result?.content ?? null;
}

export async function getAcademyTeamStatisticsPageContentWithSource(
  teamSlug: string,
): Promise<{
  content: TeamStatisticsPageContent;
  dataSource: PublicDataSourceInfo;
} | null> {
  const dbContent = await getAcademyTeamStatisticsPageContentFromDb(teamSlug);

  if (dbContent) {
    return {
      content: dbContent,
      dataSource: {
        source: "db",
        note: teamSlug,
      },
    };
  }

  return null;
}
