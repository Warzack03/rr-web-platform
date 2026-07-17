import type { TeamStatisticsPageContent } from "@/lib/public/team-statistics-utils";
import { getTeamSectionLinks } from "@/lib/public/team-section-links";
import { getPublicRosterContentFromDb } from "@/server/services/public/roster";
import { getPublicTeamPageContentFromDb } from "@/server/services/public/teams";

function buildStatisticsSubtitle(teamType: "first-team" | "academy") {
  return teamType === "first-team"
    ? "Resumen estadistico de toda la plantilla."
    : "Resumen estadistico del grupo con lectura compacta para movil.";
}

function buildStatisticsContentFromDb(input: {
  teamType: "first-team" | "academy";
  teamSlug: string;
  teamName: string;
  season: string;
  competition: string;
  category?: string;
  fieldPlayers: TeamStatisticsPageContent["fieldPlayers"];
  goalkeepers: TeamStatisticsPageContent["goalkeepers"];
}): TeamStatisticsPageContent {
  return {
    teamType: input.teamType,
    teamSlug: input.teamSlug,
    teamName: input.teamName,
    season: input.season,
    competition: input.competition,
    category: input.category,
    title: input.teamName,
    subtitle: buildStatisticsSubtitle(input.teamType),
    backHref: input.teamType === "first-team" ? "/primer-equipo" : `/equipos/${input.teamSlug}`,
    backLabel:
      input.teamType === "first-team"
        ? "Volver a Rising Raimon A"
        : `Volver a ${input.teamName}`,
    navLinks:
      input.teamType === "first-team"
        ? getTeamSectionLinks({ teamType: "first-team" })
        : getTeamSectionLinks({ teamType: "academy", teamSlug: input.teamSlug }),
    fieldPlayers: input.fieldPlayers,
    goalkeepers: input.goalkeepers,
  };
}

export async function getFirstTeamStatisticsPageContentFromDb(): Promise<TeamStatisticsPageContent | null> {
  try {
    const [teamSummary, roster] = await Promise.all([
      getPublicTeamPageContentFromDb("primer-equipo"),
      getPublicRosterContentFromDb("primer-equipo"),
    ]);

    if (!teamSummary || teamSummary.variant !== "first-team" || !roster) {
      return null;
    }

    return buildStatisticsContentFromDb({
      teamType: "first-team",
      teamSlug: "primer-equipo",
      teamName: teamSummary.name,
      season: teamSummary.season,
      competition: teamSummary.competition,
      category: teamSummary.category,
      fieldPlayers: roster.fieldPlayers,
      goalkeepers: roster.goalkeepers,
    });
  } catch {
    return null;
  }
}

export async function getAcademyTeamStatisticsPageContentFromDb(
  teamSlug: string,
): Promise<TeamStatisticsPageContent | null> {
  try {
    const [teamSummary, roster] = await Promise.all([
      getPublicTeamPageContentFromDb(teamSlug),
      getPublicRosterContentFromDb(teamSlug),
    ]);

    if (!teamSummary || teamSummary.variant !== "academy" || !roster) {
      return null;
    }

    return buildStatisticsContentFromDb({
      teamType: "academy",
      teamSlug: teamSummary.slug,
      teamName: teamSummary.name,
      season: teamSummary.season,
      competition: teamSummary.competition,
      category: teamSummary.category,
      fieldPlayers: roster.fieldPlayers,
      goalkeepers: roster.goalkeepers,
    });
  } catch {
    return null;
  }
}
