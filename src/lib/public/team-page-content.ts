import { getPublicTeamPageContentFromDb } from "@/server/services/public/teams";
import type { PublicTeamPageContent } from "@/lib/contracts/public";

export type {
  PublicSquadHighlight,
  PublicTeamNewsItem,
  PublicTeamPageContent,
  PublicTeamQuickInfoItem,
  PublicTeamRecentResult,
  PublicTeamReference,
} from "@/lib/contracts/public";

export async function getPublicTeamPageContent(
  teamSlug: string,
): Promise<PublicTeamPageContent | null> {
  return getPublicTeamPageContentFromDb(teamSlug);
}

export async function getPublicAcademyTeamPageContent(
  teamSlug: string,
): Promise<PublicTeamPageContent | null> {
  const dbContent = await getPublicTeamPageContentFromDb(teamSlug);

  if (dbContent && dbContent.variant === "academy") {
    return dbContent;
  }

  return null;
}
