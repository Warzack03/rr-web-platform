import { MatchStatus } from "@prisma/client";
import type {
  MatchManagementMatch,
  MatchManagementOpponent,
  MatchManagementTeam,
  MatchManagementVenue,
} from "@/lib/admin/match-management";
import type { AuthenticatedAdmin } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";
import {
  formatMadridDateInput,
  formatMadridTimeInput,
} from "@/lib/date-time/madrid";

export type AdminMatchesScreenData = {
  activeSeasonName: string | null;
  teams: MatchManagementTeam[];
  matches: MatchManagementMatch[];
  opponentOptions: MatchManagementOpponent[];
  venueOptions: MatchManagementVenue[];
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
    };
  }

  const competitionIds = Array.from(
    new Set(teams.map((team) => team.competitionId).filter((id): id is bigint => id !== null)),
  );

  const [matches, opponents, venues] = await Promise.all([prisma.match.findMany({
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
      opponentId: true,
      opponentName: true,
      isHome: true,
      dateTime: true,
      venueId: true,
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
  }), prisma.opponent.findMany({
    where: {
      competitionId: { in: competitionIds },
      deletedAt: null,
    },
    orderBy: [{ competition: { name: "asc" } }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      competitionId: true,
      active: true,
      logoMediaId: true,
      competition: { select: { name: true } },
      logoMedia: { select: { publicUrl: true, altText: true } },
    },
  }), prisma.venue.findMany({
    where: {
      competitionId: { in: competitionIds },
      deletedAt: null,
    },
    orderBy: [{ competition: { name: "asc" } }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      address: true,
      competitionId: true,
      active: true,
      competition: { select: { name: true } },
    },
  })]);

  const mappedTeams: MatchManagementTeam[] = teams.map((team) => ({
    id: team.id.toString(),
    slug: team.publicSlug,
    name: team.publicName,
    season: team.season.name,
    competitionId: team.competitionId?.toString(),
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
    opponentId: match.opponentId?.toString(),
    opponentName: match.opponentName,
    isHome: match.isHome,
    date: formatMadridDateInput(match.dateTime),
    time: formatMadridTimeInput(match.dateTime),
    venueId: match.venueId?.toString(),
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

  const catalogOptions: MatchManagementOpponent[] = opponents.map((opponent) => ({
    id: opponent.id.toString(),
    name: opponent.name,
    competitionId: opponent.competitionId.toString(),
    competition: opponent.competition.name,
    logoMediaId: opponent.logoMediaId?.toString(),
    logoUrl: opponent.logoMedia?.publicUrl,
    logoAlt: opponent.logoMedia?.altText ?? `Escudo ${opponent.name}`,
    active: opponent.active,
  }));
  const catalogKeys = new Set(
    catalogOptions.map((opponent) => `${opponent.competition}::${opponent.name}`.toLowerCase()),
  );
  const legacyOptions: MatchManagementOpponent[] = mappedMatches
    .filter((match) => !catalogKeys.has(`${match.competition}::${match.opponentName}`.toLowerCase()))
    .map((match) => ({
      id: `legacy-${toSlugId(match.competition)}-${toSlugId(match.opponentName)}`,
      name: match.opponentName,
      competitionId: "",
      competition: match.competition,
      active: false,
    }));
  const opponentOptions = Array.from(
    new Map(
      [...catalogOptions, ...legacyOptions].map((opponent) => [
        `${opponent.competition}::${opponent.name}`.toLowerCase(),
        opponent,
      ]),
    ).values(),
  ).sort((left, right) => {
    const competitionDiff = left.competition.localeCompare(right.competition, "es");
    return competitionDiff !== 0 ? competitionDiff : left.name.localeCompare(right.name, "es");
  });

  const catalogVenueOptions: MatchManagementVenue[] = venues.map((venue) => ({
    id: venue.id.toString(),
    name: venue.name,
    competitionId: venue.competitionId.toString(),
    competition: venue.competition.name,
    address: venue.address ?? undefined,
    active: venue.active,
  }));
  const catalogVenueKeys = new Set(
    catalogVenueOptions.map((venue) => `${venue.competition}::${venue.name}`.toLowerCase()),
  );
  const legacyVenueOptions: MatchManagementVenue[] = mappedMatches
    .filter((match) => !catalogVenueKeys.has(`${match.competition}::${match.venue}`.toLowerCase()))
    .map((match) => ({
      id: `legacy-${toSlugId(match.competition)}-${toSlugId(match.venue)}`,
      name: match.venue,
      competitionId: "",
      competition: match.competition,
      active: false,
    }));
  const venueOptions: MatchManagementVenue[] = Array.from(
    new Map(
      [...catalogVenueOptions, ...legacyVenueOptions].map((venue) => [
        `${venue.competition}::${venue.name}`.toLowerCase(),
        venue,
      ]),
    ).values(),
  ).sort((left, right) => {
    const competitionDiff = left.competition.localeCompare(right.competition, "es");
    return competitionDiff !== 0 ? competitionDiff : left.name.localeCompare(right.name, "es");
  });

  return {
    activeSeasonName: activeSeason.name,
    teams: mappedTeams,
    matches: mappedMatches,
    opponentOptions,
    venueOptions,
  };
}
