import { MatchStatus } from "@prisma/client";
import type {
  MatchManagementMatch,
  MatchManagementOpponent,
  MatchManagementTeam,
  MatchManagementVenue,
} from "@/lib/admin/match-management-mocks";
import type { AuthenticatedAdmin } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";

export type AdminMatchesScreenData = {
  activeSeasonName: string | null;
  teams: MatchManagementTeam[];
  matches: MatchManagementMatch[];
  opponentOptions: MatchManagementOpponent[];
  venueOptions: MatchManagementVenue[];
  coachTeamOptions: Array<{ slug: string; name: string }>;
};

type ScopedSeasonTeam = {
  id: bigint;
  publicSlug: string;
  publicName: string;
  competitionId: bigint | null;
  competitionName: string | null;
  season: {
    name: string;
  };
  team: {
    isFirstTeam: boolean;
  };
};

function toDateInputValue(dateTime: Date | null) {
  if (!dateTime) {
    return "";
  }

  return dateTime.toISOString().slice(0, 10);
}

function toTimeInputValue(dateTime: Date | null) {
  if (!dateTime) {
    return "";
  }

  return dateTime.toISOString().slice(11, 16);
}

function toSlugId(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function mapMatchdayLabel(matchday: number | null) {
  return matchday && Number.isFinite(matchday) ? `Jornada ${matchday}` : "Jornada pendiente";
}

function mapCompetitionLabel(match: {
  competition: {
    name: string;
  } | null;
  seasonTeam: {
    competitionName: string | null;
  };
}) {
  return match.competition?.name ?? match.seasonTeam.competitionName ?? "Competicion pendiente";
}

function mapOwnScore(match: {
  isHome: boolean;
  homeScore: number | null;
  awayScore: number | null;
}) {
  return match.isHome ? match.homeScore : match.awayScore;
}

function mapOpponentScore(match: {
  isHome: boolean;
  homeScore: number | null;
  awayScore: number | null;
}) {
  return match.isHome ? match.awayScore : match.homeScore;
}

export async function getAdminMatchesScope(
  _user: AuthenticatedAdmin,
): Promise<{
  activeSeason: {
    id: bigint;
    name: string;
  } | null;
  teams: ScopedSeasonTeam[];
}> {
  void _user;

  const siteSettings = await prisma.siteSettings.findFirst({
    orderBy: { updatedAt: "desc" },
    select: {
      activeSeason: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  const activeSeason = siteSettings?.activeSeason ?? null;

  if (!activeSeason) {
    return {
      activeSeason: null,
      teams: [],
    };
  }

  const teams = await prisma.seasonTeam.findMany({
    where: {
      seasonId: activeSeason.id,
      active: true,
      deletedAt: null,
    },
    orderBy: [{ displayOrder: "asc" }, { publicName: "asc" }],
    select: {
      id: true,
      publicSlug: true,
      publicName: true,
      competitionId: true,
      competitionName: true,
      season: {
        select: {
          name: true,
        },
      },
      team: {
        select: {
          isFirstTeam: true,
        },
      },
    },
  });

  return {
    activeSeason,
    teams,
  };
}

export async function getAdminMatchesScreenData(
  user: AuthenticatedAdmin,
): Promise<AdminMatchesScreenData> {
  const { activeSeason, teams } = await getAdminMatchesScope(user);

  if (!activeSeason) {
    return {
      activeSeasonName: null,
      teams: [],
      matches: [],
      opponentOptions: [],
      venueOptions: [],
      coachTeamOptions: [],
    };
  }

  const matches = await prisma.match.findMany({
    where: {
      seasonId: activeSeason.id,
      deletedAt: null,
      seasonTeamId: {
        in: teams.map((team) => team.id),
      },
    },
    orderBy: [{ dateTime: "asc" }, { id: "asc" }],
    select: {
      id: true,
      matchday: true,
      opponentName: true,
      isHome: true,
      dateTime: true,
      venue: true,
      status: true,
      homeScore: true,
      awayScore: true,
      videoUrl: true,
      publicVisible: true,
      seasonTeam: {
        select: {
          id: true,
          publicSlug: true,
          publicName: true,
          competitionName: true,
          season: {
            select: {
              name: true,
            },
          },
          team: {
            select: {
              isFirstTeam: true,
            },
          },
        },
      },
      competition: {
        select: {
          name: true,
        },
      },
    },
  });

  const mappedTeams: MatchManagementTeam[] = teams.map((team) => ({
    id: team.id.toString(),
    slug: team.publicSlug,
    name: team.publicName,
    season: team.season.name,
    competition: team.competitionName ?? "Competicion pendiente",
    isFirstTeam: team.team.isFirstTeam,
  }));

  const mappedMatches: MatchManagementMatch[] = matches.map((match) => ({
    id: match.id.toString(),
    teamId: match.seasonTeam.id.toString(),
    teamSlug: match.seasonTeam.publicSlug,
    teamName: match.seasonTeam.publicName,
    season: match.seasonTeam.season.name,
    competition: mapCompetitionLabel(match),
    matchday: mapMatchdayLabel(match.matchday),
    opponentName: match.opponentName,
    isHome: match.isHome,
    date: toDateInputValue(match.dateTime),
    time: toTimeInputValue(match.dateTime),
    venue: match.venue ?? "Campo pendiente",
    status:
      match.status === MatchStatus.SCHEDULED
        ? "scheduled"
        : match.status === MatchStatus.LIVE
          ? "live"
          : match.status === MatchStatus.PLAYED
            ? "played"
            : "postponed",
    ownScore: mapOwnScore(match),
    opponentScore: mapOpponentScore(match),
    highlightsUrl: match.videoUrl ?? undefined,
    detailAvailable: match.publicVisible,
    previewAvailable: true,
    isFirstTeam: match.seasonTeam.team.isFirstTeam,
  }));

  const opponentOptions: MatchManagementOpponent[] = Array.from(
    new Map(
      mappedMatches.map((match) => [
        `${match.competition}::${match.opponentName}`.toLowerCase(),
        {
          id: `opponent-${toSlugId(match.competition)}-${toSlugId(match.opponentName)}`,
          name: match.opponentName,
          competition: match.competition,
        },
      ]),
    ).values(),
  ).sort((left, right) => {
    const competitionDiff = left.competition.localeCompare(right.competition, "es");
    return competitionDiff !== 0 ? competitionDiff : left.name.localeCompare(right.name, "es");
  });

  const venueOptions: MatchManagementVenue[] = Array.from(
    new Map(
      mappedMatches
        .map((match) => match.venue.trim())
        .filter(Boolean)
        .map((venue) => [
          venue.toLowerCase(),
          {
            id: `venue-${toSlugId(venue)}`,
            name: venue,
          },
        ]),
    ).values(),
  ).sort((left, right) => left.name.localeCompare(right.name, "es"));

  return {
    activeSeasonName: activeSeason.name,
    teams: mappedTeams,
    matches: mappedMatches,
    opponentOptions,
    venueOptions,
    coachTeamOptions: mappedTeams.map((team) => ({
      slug: team.slug,
      name: team.name,
    })),
  };
}
