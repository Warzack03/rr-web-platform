import type { TeamStatisticsPageContent } from "@/lib/contracts/public";
import {
  getAcademyTeamStatisticsPageContentFromDb,
  getFirstTeamStatisticsPageContentFromDb,
} from "@/server/services/public/statistics";

export async function getFirstTeamStatisticsPageContent(): Promise<TeamStatisticsPageContent | null> {
  return getFirstTeamStatisticsPageContentFromDb();
}

export async function getAcademyTeamStatisticsPageContent(
  teamSlug: string,
): Promise<TeamStatisticsPageContent | null> {
  return getAcademyTeamStatisticsPageContentFromDb(teamSlug);
}
