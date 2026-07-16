import { MatchStatus } from "@prisma/client";
import type { PublicHomePageContent } from "@/lib/public/home-content";
import type { StandingRowData } from "@/lib/public/team-standings-content";
import { buildPublicMatchDetailHref } from "@/server/services/public/calendar";
import { prisma } from "@/server/db/prisma";
import {
  buildStandingTableScopeWhere,
  pickBestStandingTableForTeam,
} from "@/server/services/standing-table-sharing";

type PublicHomeDbSections = Pick<PublicHomePageContent, "firstTeam" | "academy">;

function formatMatchDateLabel(date: Date | null) {
  if (!date) {
    return "Fecha pendiente";
  }

  const dateLabel = new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Europe/Madrid",
  }).format(date);
  const timeLabel = new Intl.DateTimeFormat("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Europe/Madrid",
  }).format(date);

  return `${dateLabel.replace(".", "")} - ${timeLabel}`;
}

function formatMatchStatus(status: MatchStatus) {
  switch (status) {
    case MatchStatus.LIVE:
      return "En vivo";
    case MatchStatus.PLAYED:
      return "Jugado";
    case MatchStatus.POSTPONED:
      return "Pendiente";
    case MatchStatus.SCHEDULED:
    default:
      return "Pendiente";
  }
}

function buildMatchCompetitionLabel(competitionName: string | null, matchday: number | null) {
  if (competitionName && matchday) {
    return `${competitionName} - Jornada ${matchday}`;
  }

  if (competitionName) {
    return competitionName;
  }

  if (matchday) {
    return `Jornada ${matchday}`;
  }

  return "Partido oficial";
}

function mapStandingRows(
  rows: Array<{
    position: number;
    teamName: string;
    played: number;
    won: number;
    drawn: number;
    lost: number;
    goalsFor: number;
    goalsAgainst: number;
    goalDifference: number;
    points: number;
    isOwnTeam: boolean;
  }>,
  teams: Array<{
    publicName: string;
    publicSlug: string;
    logoMedia: {
      publicUrl: string;
      altText: string | null;
    } | null;
  }>,
): StandingRowData[] {
  const teamByName = new Map(
    teams.map((team) => [normalizeTeamName(team.publicName), team]),
  );

  return rows.map((row) => {
    const linkedTeam = teamByName.get(normalizeTeamName(row.teamName));

    return {
      position: row.position,
      team: row.teamName,
      teamSlug: linkedTeam?.publicSlug,
      logoUrl: linkedTeam?.logoMedia?.publicUrl,
      logoAlt: linkedTeam?.logoMedia?.altText ?? `Escudo ${row.teamName}`,
      played: row.played,
      won: row.won,
      drawn: row.drawn,
      lost: row.lost,
      goalsFor: row.goalsFor,
      goalsAgainst: row.goalsAgainst,
      goalDifference: row.goalDifference,
      points: row.points,
      isClub: row.isOwnTeam,
    };
  });
}

function normalizeTeamName(teamName: string) {
  return teamName.trim().toLowerCase();
}

export async function getPublicHomeDbSections(): Promise<PublicHomeDbSections | null> {
  try {
    const siteSettings = await prisma.siteSettings.findFirst({
      orderBy: { updatedAt: "desc" },
      select: {
        activeSeason: {
          select: {
            id: true,
            name: true,
            seasonTeams: {
              where: {
                active: true,
                publicVisible: true,
                deletedAt: null,
              },
              orderBy: [{ displayOrder: "asc" }, { publicName: "asc" }],
              select: {
                id: true,
                publicName: true,
                publicSlug: true,
                competitionId: true,
                category: true,
                competitionName: true,
                team: {
                  select: {
                    isFirstTeam: true,
                  },
                },
                logoMedia: {
                  select: {
                    publicUrl: true,
                    altText: true,
                  },
                },
                assignments: {
                  where: {
                    active: true,
                    deletedAt: null,
                  },
                  select: {
                    id: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const activeSeason = siteSettings?.activeSeason;

    if (!activeSeason) {
      return null;
    }

    const firstTeam = activeSeason.seasonTeams.find((team) => team.team.isFirstTeam);

    if (!firstTeam) {
      return null;
    }

    const academyTeams = activeSeason.seasonTeams.filter((team) => !team.team.isFirstTeam);
    const academyCategoryCount = new Set(
      academyTeams.map((team) => team.category).filter((category): category is string => Boolean(category)),
    ).size;
    const academyPlayerCount = academyTeams.reduce(
      (total, team) => total + team.assignments.length,
      0,
    );

    const [nextMatch, recentResults, standingTables] = await Promise.all([
      prisma.match.findFirst({
        where: {
          seasonTeamId: firstTeam.id,
          deletedAt: null,
          status: {
            in: [MatchStatus.SCHEDULED, MatchStatus.LIVE, MatchStatus.POSTPONED],
          },
        },
        orderBy: [{ dateTime: "asc" }, { id: "asc" }],
        select: {
          id: true,
          dateTime: true,
          venue: true,
          opponentName: true,
          status: true,
          matchday: true,
          competition: {
            select: {
              name: true,
            },
          },
          seasonTeam: {
            select: {
              publicName: true,
            },
          },
        },
      }),
      prisma.match.findMany({
        where: {
          seasonTeamId: firstTeam.id,
          deletedAt: null,
          status: MatchStatus.PLAYED,
        },
        orderBy: [{ dateTime: "desc" }, { id: "desc" }],
        take: 3,
        select: {
          id: true,
          isHome: true,
          homeScore: true,
          awayScore: true,
          opponentName: true,
          matchday: true,
        },
      }),
      prisma.standingTable.findMany({
        where: buildStandingTableScopeWhere(activeSeason.id, [firstTeam], {
          publicVisible: true,
        }),
        orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
        select: {
          seasonTeamId: true,
          competitionId: true,
          seasonTeam: {
            select: {
              competitionName: true,
            },
          },
          rows: {
            orderBy: [{ displayOrder: "asc" }, { position: "asc" }],
            take: 3,
            select: {
              position: true,
              teamName: true,
              played: true,
              won: true,
              drawn: true,
              lost: true,
              goalsFor: true,
              goalsAgainst: true,
              goalDifference: true,
              points: true,
              isOwnTeam: true,
            },
          },
        },
      }),
    ]);
    const standingTable = pickBestStandingTableForTeam(standingTables, firstTeam);

    const nextMatchData = nextMatch
      ? {
          home: {
            name: nextMatch.seasonTeam.publicName,
            highlight: true,
          },
          away: {
            name: nextMatch.opponentName,
          },
          competition: buildMatchCompetitionLabel(
            nextMatch.competition?.name ?? firstTeam.competitionName ?? null,
            nextMatch.matchday,
          ),
          dateLabel: formatMatchDateLabel(nextMatch.dateTime),
          venue: nextMatch.venue ?? "Campo pendiente",
          status: formatMatchStatus(nextMatch.status),
          href: buildPublicMatchDetailHref({
            teamSlug: firstTeam.publicSlug,
            isFirstTeam: true,
            matchId: nextMatch.id.toString(),
          }),
          actionLabel: "Ver calendario",
          actionHref: "/primer-equipo/calendario",
        }
      : {
          home: {
            name: firstTeam.publicName,
            highlight: true,
          },
          away: {
            name: "Rival pendiente",
          },
          competition: firstTeam.competitionName ?? "Competicion pendiente",
          dateLabel: "Fecha pendiente",
          venue: "Campo pendiente",
          status: "Pendiente",
          href: undefined,
          actionLabel: "Ver calendario",
          actionHref: "/primer-equipo/calendario",
        };

    return {
      firstTeam: {
        eyebrow: "Primer Equipo",
        title: "La arena de batalla",
        description:
          "El pulso competitivo del club, resumido en lo que viene y en lo que deja cada jornada.",
        teamHref: "/primer-equipo",
        calendarHref: "/primer-equipo/calendario",
        standingHref: "/primer-equipo/clasificacion",
        nextMatch: nextMatchData,
        recentResults: recentResults.map((match) => {
          const goalsFor = match.isHome ? match.homeScore : match.awayScore;
          const goalsAgainst = match.isHome ? match.awayScore : match.homeScore;

          return {
            opponent: match.opponentName,
            score: `${goalsFor ?? "-"} - ${goalsAgainst ?? "-"}`,
            result:
              (goalsFor ?? 0) > (goalsAgainst ?? 0)
                ? "V"
                : (goalsFor ?? 0) < (goalsAgainst ?? 0)
                  ? "D"
                  : "E",
            label: match.matchday ? `J${match.matchday}` : undefined,
            href: buildPublicMatchDetailHref({
              teamSlug: firstTeam.publicSlug,
              isFirstTeam: true,
              matchId: match.id.toString(),
            }),
          };
        }),
        standingsRows: mapStandingRows(standingTable?.rows ?? [], activeSeason.seasonTeams),
      },
      academy: {
        eyebrow: "Cantera Rising",
        title: "Futuro Raimon",
        description:
          "Un bloque corto para mirar hacia abajo sin perder foco: equipos conectados, formacion competitiva y rutas claras de progresion.",
        href: "/equipos",
        metrics: [
          {
            label: "Equipos",
            value: `${academyTeams.length}`,
          },
          {
            label: "Jugadores",
            value: `${academyPlayerCount}`,
          },
          {
            label: "Categorias",
            value: `${academyCategoryCount}`,
          },
        ],
        teams: academyTeams.slice(0, 4).map((team) => ({
          slug: team.publicSlug,
          name: team.publicName,
          category: team.category ?? "Cantera",
          competition: team.competitionName ?? "Competicion pendiente",
        })),
      },
    };
  } catch {
    return null;
  }
}
