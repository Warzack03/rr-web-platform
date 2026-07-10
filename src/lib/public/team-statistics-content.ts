import { getAcademyTeamSquadContent } from "@/lib/public/player-profile-content";
import type { PublicDataSourceInfo } from "@/lib/public/data-source";
import { getFirstTeamSquadContent } from "@/lib/public/first-team-squad-content";
import { getPublicAcademyTeamPageContent, getPublicTeamPageContent } from "@/lib/public/team-page-content";
import { getTeamSectionLinks } from "@/lib/public/team-section-links";
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

  const teamSummary = await getPublicTeamPageContent("primer-equipo");

  if (!teamSummary) {
    return null;
  }

  const squad = getFirstTeamSquadContent();

  return {
    content: {
      teamType: "first-team",
      teamSlug: "primer-equipo",
      teamName: teamSummary.name,
      season: teamSummary.season,
      competition: teamSummary.competition,
      title: teamSummary.name,
      subtitle: "Resumen estadistico de toda la plantilla.",
      backHref: "/primer-equipo",
      backLabel: "Volver al Primer Equipo",
      navLinks: getTeamSectionLinks({ teamType: "first-team" }),
      fieldPlayers: squad.fieldPlayers,
      goalkeepers: squad.goalkeepers,
    },
    dataSource: {
      source: "mock",
      note: "stats",
    },
  };
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

  const teamSummary = await getPublicAcademyTeamPageContent(teamSlug);
  const squad = getAcademyTeamSquadContent(teamSlug);

  if (!teamSummary || !squad) {
    return null;
  }

  return {
    content: {
      teamType: "academy",
      teamSlug: teamSummary.slug,
      teamName: teamSummary.name,
      season: teamSummary.season,
      competition: teamSummary.competition,
      category: teamSummary.category,
      title: teamSummary.name,
      subtitle: "Resumen estadistico del grupo con lectura compacta para movil.",
      backHref: `/equipos/${teamSummary.slug}`,
      backLabel: `Volver a ${teamSummary.name}`,
      navLinks: getTeamSectionLinks({ teamType: "academy", teamSlug: teamSummary.slug }),
      fieldPlayers: squad.fieldPlayers,
      goalkeepers: squad.goalkeepers,
    },
    dataSource: {
      source: "mock",
      note: teamSlug,
    },
  };
}
