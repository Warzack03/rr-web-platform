import type {
  MatchDetailContent,
  MatchDetailScorer,
  PlayerPerformance,
} from "@/lib/public/match-detail-content";
import {
  getAcademyTeamCalendarContent,
  getKnownAcademyTeamCalendarSlugs,
  type CalendarMatch,
} from "@/lib/public/team-calendar-content";
import { getPublicAcademyTeamPageContent } from "@/lib/public/team-page-content";

type AcademyMatchSeed = {
  homeScorers?: MatchDetailScorer[];
  awayScorers?: MatchDetailScorer[];
  playerPerformances?: PlayerPerformance[];
  previewNote?: string;
};

const ACADEMY_MATCH_DETAIL_SEEDS: Record<string, Record<string, AcademyMatchSeed>> = {
  "raimon-b": {
    "raimon-b-vs-inazuma-c": {
      homeScorers: [
        { playerName: "Nathan Swift", minutes: [18] },
        { playerName: "Erik Eagle", minutes: [67] },
      ],
      awayScorers: [],
      playerPerformances: [
        {
          id: "raimon-b-j1-alex-zabel",
          shirtNumber: 1,
          name: "Alex Zabel",
          position: "Portero",
          cleanSheet: true,
        },
        {
          id: "raimon-b-j1-erik-eagle",
          shirtNumber: 4,
          name: "Erik Eagle",
          position: "Defensa",
          goals: 1,
        },
        {
          id: "raimon-b-j1-sam-kincaid",
          shirtNumber: 8,
          name: "Sam Kincaid",
          position: "Centrocampista",
          assists: 1,
          yellowCards: 1,
        },
        {
          id: "raimon-b-j1-nathan-swift",
          shirtNumber: 7,
          name: "Nathan Swift",
          position: "Extremo",
          goals: 1,
          assists: 1,
          mvp: true,
        },
        {
          id: "raimon-b-j1-austin-hobbes",
          shirtNumber: 9,
          name: "Austin Hobbes",
          position: "Delantero",
        },
        {
          id: "raimon-b-j1-jack-wallside",
          shirtNumber: 3,
          name: "Jack Wallside",
          position: "Defensa",
        },
      ],
    },
    "raimon-b-vs-zeus-b": {
      previewNote: "Vista previa del encuentro",
    },
    "raimon-b-vs-royal-c": {
      previewNote: "Pendiente de nueva fecha",
    },
    "raimon-b-vs-farm-jr": {
      previewNote: "Horario confirmado para las 12:30",
    },
  },
  "juvenil-a": {
    "juvenil-a-vs-brain-fc": {
      homeScorers: [
        { playerName: "Scott Banyan", minutes: [12, 58] },
        { playerName: "Tod Ironside", minutes: [71] },
      ],
      awayScorers: [],
      playerPerformances: [
        {
          id: "juvenil-a-j1-matt-carter",
          shirtNumber: 1,
          name: "Matt Carter",
          position: "Portero",
        },
        {
          id: "juvenil-a-j1-jack-wallside",
          shirtNumber: 2,
          name: "Jack Wallside",
          position: "Lateral",
          assists: 1,
        },
        {
          id: "juvenil-a-j1-erik-eagle",
          shirtNumber: 4,
          name: "Erik Eagle",
          position: "Defensa",
          yellowCards: 1,
        },
        {
          id: "juvenil-a-j1-tod-ironside",
          shirtNumber: 10,
          name: "Tod Ironside",
          position: "Mediapunta",
          goals: 1,
          assists: 1,
        },
        {
          id: "juvenil-a-j1-scott-banyan",
          shirtNumber: 9,
          name: "Scott Banyan",
          position: "Delantero",
          goals: 2,
          mvp: true,
        },
      ],
    },
    "juvenil-a-vs-royal-b": {
      previewNote: "Duelo directo por la zona alta",
    },
    "juvenil-a-vs-occult": {
      previewNote: "Pendiente de nueva fecha",
    },
    "juvenil-a-vs-kirkwood": {
      previewNote: "Horario confirmado para la manana",
    },
  },
};

type AcademyMatchLookup = {
  match: CalendarMatch;
  matchdayTitle: string;
};

function getDefaultPreviewNote(match: CalendarMatch) {
  if (match.status === "postponed") {
    return match.actionHint || match.postponementReason || "Pendiente de nueva fecha";
  }

  return match.actionHint || "Vista previa del encuentro";
}

function buildDefaultAcademyDetail(input: {
  match: CalendarMatch;
  matchdayTitle: string;
}): Pick<
  MatchDetailContent,
  "stageLabel" | "homeScorers" | "awayScorers" | "playerPerformances" | "previewNote"
> {
  return {
    stageLabel: `${input.match.competition} - ${input.matchdayTitle}`,
    homeScorers: [],
    awayScorers: [],
    playerPerformances: [],
    previewNote:
      input.match.status === "pending" || input.match.status === "postponed"
        ? getDefaultPreviewNote(input.match)
        : undefined,
  };
}

async function findAcademyCalendarMatch(
  teamSlug: string,
  matchId: string,
): Promise<AcademyMatchLookup | null> {
  const teamSummary = await getPublicAcademyTeamPageContent(teamSlug);

  if (!teamSummary) {
    return null;
  }

  const calendar = getAcademyTeamCalendarContent({
    slug: teamSummary.slug,
    name: teamSummary.name,
    competition: teamSummary.competition,
    season: teamSummary.season,
  });

  for (const matchday of calendar.matchdays) {
    const match = matchday.matches.find((item) => item.id === matchId);

    if (match) {
      return {
        match,
        matchdayTitle: matchday.title,
      };
    }
  }

  return null;
}

export async function getAcademyMatchDetail(
  teamSlug: string,
  matchId: string,
): Promise<MatchDetailContent | null> {
  const teamSummary = await getPublicAcademyTeamPageContent(teamSlug);
  const lookup = await findAcademyCalendarMatch(teamSlug, matchId);

  if (!teamSummary || !lookup) {
    return null;
  }

  const defaultDetail = buildDefaultAcademyDetail(lookup);
  const seed = ACADEMY_MATCH_DETAIL_SEEDS[teamSlug]?.[matchId];

  return {
    teamType: "academy",
    match: lookup.match,
    showHighlights: false,
    showLiveFeatures: false,
    context: {
      teamName: teamSummary.name,
      season: teamSummary.season,
      backToCalendarHref: teamSummary.links.calendar,
      backToCalendarLabel: "Volver al calendario",
      backToTeamHref: `/equipos/${teamSummary.slug}`,
      backToTeamLabel: `Volver a ${teamSummary.name}`,
    },
    ...defaultDetail,
    ...seed,
  };
}

export async function getAcademyMatchDetailStaticParams() {
  const params: Array<{ teamSlug: string; matchId: string }> = [];

  for (const teamSlug of getKnownAcademyTeamCalendarSlugs()) {
    const teamSummary = await getPublicAcademyTeamPageContent(teamSlug);

    if (!teamSummary) {
      continue;
    }

    const calendar = getAcademyTeamCalendarContent({
      slug: teamSummary.slug,
      name: teamSummary.name,
      competition: teamSummary.competition,
      season: teamSummary.season,
    });

    for (const matchday of calendar.matchdays) {
      for (const match of matchday.matches) {
        params.push({
          teamSlug,
          matchId: match.id,
        });
      }
    }
  }

  return params;
}
