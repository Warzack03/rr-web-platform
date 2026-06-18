import {
  getPublicAcademyTeamPageContent,
  getPublicTeamPageContent,
} from "@/lib/public/team-page-content";
import { getTeamSectionLinks, type TeamSectionNavLink } from "@/lib/public/team-section-links";

export type StandingRowData = {
  position: number;
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  isClub?: boolean;
};

export type TeamStandingsPageContent = {
  slug: string;
  variant: "first-team" | "academy";
  title: string;
  subtitle: string;
  season: string;
  teamName: string;
  competition?: string;
  updatedAt?: string;
  backHref: string;
  backLabel: string;
  navLinks: TeamSectionNavLink[];
  rows: StandingRowData[];
};

type StandingsMock = {
  season?: string;
  competition?: string;
  updatedAt?: string;
  rows: StandingRowData[];
};

function createStandingRow(
  position: number,
  team: string,
  played: number,
  won: number,
  drawn: number,
  lost: number,
  goalsFor: number,
  goalsAgainst: number,
  points: number,
  isClub = false,
): StandingRowData {
  return {
    position,
    team,
    played,
    won,
    drawn,
    lost,
    goalsFor,
    goalsAgainst,
    goalDifference: goalsFor - goalsAgainst,
    points,
    isClub,
  };
}

const FIRST_TEAM_STANDINGS: StandingsMock = {
  season: "Temporada 2024/2025",
  competition: "Primera Division",
  updatedAt: "18 Oct 2024",
  rows: [
    createStandingRow(1, "Rising Raimon", 22, 17, 3, 2, 49, 18, 54, true),
    createStandingRow(2, "Zeus FC", 22, 15, 4, 3, 45, 20, 49),
    createStandingRow(3, "Royal Academy", 22, 14, 4, 4, 41, 19, 46),
    createStandingRow(4, "Kirkwood FC", 22, 12, 6, 4, 37, 21, 42),
    createStandingRow(5, "Alpine FC", 22, 11, 6, 5, 35, 24, 39),
    createStandingRow(6, "Inazuma City", 22, 10, 5, 7, 29, 27, 35),
    createStandingRow(7, "Brain FC", 22, 9, 4, 9, 28, 31, 31),
    createStandingRow(8, "Farm United", 22, 7, 6, 9, 26, 32, 27),
    createStandingRow(9, "Occult SC", 22, 6, 5, 11, 23, 38, 23),
    createStandingRow(10, "Otaku FC", 22, 5, 3, 14, 19, 41, 18),
  ],
};

const ACADEMY_STANDINGS: Record<string, StandingsMock> = {
  "raimon-b": {
    updatedAt: "13 Oct 2024",
    rows: [
      createStandingRow(1, "Royal Academy C", 12, 9, 2, 1, 28, 10, 29),
      createStandingRow(2, "Zeus Academy B", 12, 8, 2, 2, 24, 11, 26),
      createStandingRow(3, "Raimon B", 12, 7, 3, 2, 21, 12, 24, true),
      createStandingRow(4, "Farm Jr.", 12, 7, 1, 4, 19, 14, 22),
      createStandingRow(5, "Kirkwood B", 12, 5, 4, 3, 17, 15, 19),
      createStandingRow(6, "Polestar Youth", 12, 4, 3, 5, 16, 18, 15),
      createStandingRow(7, "Otaku Development", 12, 2, 3, 7, 12, 23, 9),
      createStandingRow(8, "Cloister Juniors", 12, 1, 2, 9, 9, 28, 5),
    ],
  },
  "juvenil-a": {
    updatedAt: "11 Oct 2024",
    rows: [
      createStandingRow(1, "Royal Academy B", 9, 7, 1, 1, 20, 8, 22),
      createStandingRow(2, "Juvenil A", 9, 6, 2, 1, 18, 9, 20, true),
      createStandingRow(3, "Brain FC Youth", 9, 6, 0, 3, 17, 11, 18),
      createStandingRow(4, "Kirkwood Juvenil", 9, 5, 2, 2, 16, 10, 17),
      createStandingRow(5, "Occult Academy", 9, 4, 2, 3, 13, 12, 14),
      createStandingRow(6, "Alpine Youth", 9, 3, 2, 4, 12, 14, 11),
      createStandingRow(7, "Inazuma City U18", 9, 2, 1, 6, 9, 17, 7),
      createStandingRow(8, "Farm Academy", 9, 1, 2, 6, 7, 21, 5),
    ],
  },
  "juvenil-b": {
    updatedAt: "09 Oct 2024",
    rows: [
      createStandingRow(1, "Kirkwood Academy B", 8, 6, 1, 1, 19, 7, 19),
      createStandingRow(2, "Royal Academy C", 8, 5, 2, 1, 16, 8, 17),
      createStandingRow(3, "Occult Juniors", 8, 5, 1, 2, 14, 9, 16),
      createStandingRow(4, "Farm B", 8, 4, 2, 2, 13, 10, 14),
      createStandingRow(5, "Juvenil B", 8, 3, 2, 3, 11, 10, 11, true),
      createStandingRow(6, "Otaku B", 8, 2, 3, 3, 9, 11, 9),
      createStandingRow(7, "Inazuma South", 8, 2, 1, 5, 8, 15, 7),
      createStandingRow(8, "Zeus Youth C", 8, 1, 0, 7, 6, 16, 3),
    ],
  },
  "cadete-a": {
    updatedAt: "12 Oct 2024",
    rows: [
      createStandingRow(1, "Zeus Cadete", 7, 6, 0, 1, 18, 6, 18),
      createStandingRow(2, "Kirkwood Cadete", 7, 4, 2, 1, 14, 7, 14),
      createStandingRow(3, "Cadete A", 7, 4, 1, 2, 15, 10, 13, true),
      createStandingRow(4, "Brain Cadete", 7, 4, 0, 3, 13, 11, 12),
      createStandingRow(5, "Otaku Cadete", 7, 3, 2, 2, 10, 9, 11),
      createStandingRow(6, "Royal Cadete B", 7, 2, 1, 4, 9, 13, 7),
      createStandingRow(7, "Alpine Cadete", 7, 1, 2, 4, 7, 15, 5),
      createStandingRow(8, "Inazuma Cadete", 7, 1, 0, 6, 5, 20, 3),
    ],
  },
  "infantil-a": {
    updatedAt: "14 Oct 2024",
    rows: [
      createStandingRow(1, "Infantil A", 8, 7, 1, 0, 24, 7, 22, true),
      createStandingRow(2, "Royal Infantil", 8, 6, 1, 1, 19, 8, 19),
      createStandingRow(3, "Inazuma School", 8, 5, 1, 2, 16, 10, 16),
      createStandingRow(4, "Kirkwood Base", 8, 4, 2, 2, 14, 12, 14),
      createStandingRow(5, "Zeus Infantil", 8, 3, 2, 3, 11, 11, 11),
      createStandingRow(6, "Farm Kids", 8, 2, 1, 5, 8, 17, 7),
      createStandingRow(7, "Otaku School", 8, 1, 1, 6, 6, 18, 4),
      createStandingRow(8, "Occult Base", 8, 0, 1, 7, 4, 19, 1),
    ],
  },
};

function sortRows(rows: StandingRowData[]) {
  return [...rows].sort((left, right) => left.position - right.position);
}

function createFallbackAcademyRows(teamName: string): StandingRowData[] {
  return sortRows([
    createStandingRow(1, "Royal Academy", 8, 6, 1, 1, 18, 7, 19),
    createStandingRow(2, "Kirkwood FC", 8, 5, 2, 1, 15, 8, 17),
    createStandingRow(3, "Zeus Academy", 8, 5, 1, 2, 14, 9, 16),
    createStandingRow(4, teamName, 8, 4, 2, 2, 13, 10, 14, true),
    createStandingRow(5, "Inazuma City", 8, 3, 1, 4, 10, 12, 10),
    createStandingRow(6, "Farm Jr.", 8, 2, 2, 4, 9, 13, 8),
    createStandingRow(7, "Otaku FC", 8, 1, 2, 5, 7, 16, 5),
    createStandingRow(8, "Occult SC", 8, 1, 1, 6, 6, 17, 4),
  ]);
}

export async function getFirstTeamStandingsContent(): Promise<TeamStandingsPageContent | null> {
  const teamSummary = await getPublicTeamPageContent("primer-equipo");

  if (!teamSummary) {
    return null;
  }

  return {
    slug: teamSummary.slug,
    variant: "first-team",
    title: "Clasificacion",
    subtitle: `Primer Equipo - ${FIRST_TEAM_STANDINGS.season}`,
    season: FIRST_TEAM_STANDINGS.season ?? teamSummary.season,
    teamName: "Rising Raimon",
    competition: FIRST_TEAM_STANDINGS.competition ?? teamSummary.competition,
    updatedAt: FIRST_TEAM_STANDINGS.updatedAt,
    backHref: "/primer-equipo",
    backLabel: "Volver al Primer Equipo",
    navLinks: getTeamSectionLinks({ teamType: "first-team" }),
    rows: sortRows(FIRST_TEAM_STANDINGS.rows),
  };
}

export async function getAcademyTeamStandingsContent(
  teamSlug: string,
): Promise<TeamStandingsPageContent | null> {
  const teamSummary = await getPublicAcademyTeamPageContent(teamSlug);

  if (!teamSummary) {
    return null;
  }

  const standings = ACADEMY_STANDINGS[teamSlug];

  return {
    slug: teamSummary.slug,
    variant: "academy",
    title: "Clasificacion",
    subtitle: `${teamSummary.name} - ${standings?.season ?? teamSummary.season}`,
    season: standings?.season ?? teamSummary.season,
    teamName: teamSummary.name,
    competition: standings?.competition ?? teamSummary.competition,
    updatedAt: standings?.updatedAt,
    backHref: `/equipos/${teamSummary.slug}`,
    backLabel: `Volver a ${teamSummary.name}`,
    navLinks: getTeamSectionLinks({ teamType: "academy", teamSlug: teamSummary.slug }),
    rows: sortRows(standings?.rows ?? createFallbackAcademyRows(teamSummary.name)),
  };
}
