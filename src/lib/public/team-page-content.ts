import {
  getPublicTeamHeroContentFromDb,
  getPublicTeamPageContentFromDb,
} from "@/server/services/public/teams";
import type { PublicTeamHeroContent, PublicTeamPageContent } from "@/lib/contracts/public";

export type {
  PublicSquadHighlight,
  PublicTeamHeroContent,
  PublicTeamNewsItem,
  PublicTeamPageContent,
  PublicTeamQuickInfoItem,
  PublicTeamRecentResult,
  PublicTeamReference,
} from "@/lib/contracts/public";

export async function getPublicTeamHeroContent(
  teamSlug: string,
): Promise<PublicTeamHeroContent | null> {
  return getPublicTeamHeroContentFromDb(teamSlug);
}

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
