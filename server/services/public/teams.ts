import { MatchStatus } from "@prisma/client";
import type {
  AcademyPromoContent,
  AcademyTeamCardContent,
  FeaturedFirstTeamContent,
  TeamsDirectoryContent,
} from "@/lib/public/teams-directory-content";
import type {
  MatchResult,
  PublicTeamPageContent,
  TeamNewsItem,
  TeamQuickInfoItem,
} from "@/lib/public/team-page-content";
import { buildPublicMatchDetailHref } from "@/server/services/public/calendar";
import { getPublishedPublicNewsArticlesFromDb } from "@/server/services/public/news";
import { prisma } from "@/server/db/prisma";
import {
  buildStandingTableScopeWhere,
  findOwnStandingRowForTeam,
  pickBestStandingTableForTeam,
} from "@/server/services/standing-table-sharing";

type DbSeasonTeam = {
  id: bigint;
  publicName: string;
  publicSlug: string;
  competitionId: bigint | null;
  category: string | null;
  competitionName: string | null;
  season: {
    id: bigint;
    name: string;
  };
  team: {
    isFirstTeam: boolean;
  };
  coaches: Array<{
    name: string;
    displayOrder: number;
  }>;
  assignments: Array<{
    shirtNumber: number | null;
    position: string | null;
    player: {
      publicName: string | null;
      slug: string;
    };
  }>;
};

function formatMatchDateLabel(date: Date | null) {
  if (!date) {
    return "Fecha pendiente";
  }

  const dateLabel = new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Europe/Madrid",
  })
    .format(date)
    .replace(".", "");
  const timeLabel = new Intl.DateTimeFormat("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Europe/Madrid",
  }).format(date);

  return `${dateLabel} - ${timeLabel}`;
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

function getResultCode(goalsFor: number | null, goalsAgainst: number | null): MatchResult["result"] {
  if ((goalsFor ?? 0) > (goalsAgainst ?? 0)) {
    return "V";
  }

  if ((goalsFor ?? 0) < (goalsAgainst ?? 0)) {
    return "D";
  }

  return "E";
}

function normalizeCategory(category: string | null, isFirstTeam: boolean) {
  if (category) {
    return category;
  }

  return isFirstTeam ? "Senior" : "Cantera";
}

function getTeamLinks(teamSlug: string, isFirstTeam: boolean) {
  const baseHref = isFirstTeam ? "/primer-equipo" : `/equipos/${teamSlug}`;

  return {
    squad: `${baseHref}/plantilla`,
    calendar: `${baseHref}/calendario`,
    standing: `${baseHref}/clasificacion`,
    statistics: `${baseHref}/estadisticas`,
  };
}

function getTeamSummaryDescription(team: DbSeasonTeam) {
  const category = normalizeCategory(team.category, team.team.isFirstTeam);

  if (team.team.isFirstTeam) {
    return "El bloque que marca el ritmo del club. Maxima exigencia, identidad competitiva y una plantilla preparada para sostener el nivel cada jornada.";
  }

  if (category.toLowerCase().includes("juvenil")) {
    return "Grupo orientado a sostener volumen de juego, exigencia competitiva y progresion hacia el siguiente nivel.";
  }

  if (category.toLowerCase().includes("cadete")) {
    return "Base competitiva para crecer con orden, lectura de juego y personalidad en cada jornada.";
  }

  if (category.toLowerCase().includes("infantil")) {
    return "Primeras grandes exigencias del modelo formativo, con foco en tecnica y toma de decision.";
  }

  return "Equipo conectado al modelo deportivo del club, con foco en progresion y competitividad.";
}

function getTeamsDirectoryDescription(team: DbSeasonTeam) {
  const category = normalizeCategory(team.category, team.team.isFirstTeam).toLowerCase();

  if (category.includes("filial")) {
    return "El paso previo al profesionalismo para acelerar el crecimiento de nuestras mejores promesas.";
  }

  if (category.includes("juvenil")) {
    return "Maximo nivel juvenil para consolidar automatismos, ritmo de partido y competitividad.";
  }

  if (category.includes("cadete")) {
    return "Base competitiva para crecer con orden, lectura de juego y personalidad.";
  }

  if (category.includes("infantil")) {
    return "Primeras grandes exigencias del modelo formativo, con foco en tecnica y toma de decision.";
  }

  return "Estructura deportiva conectada al modelo Rising Raimon.";
}

function mapDirectoryTeam(team: DbSeasonTeam): AcademyTeamCardContent {
  return {
    slug: team.publicSlug,
    category: normalizeCategory(team.category, team.team.isFirstTeam),
    name: team.publicName,
    competition: team.competitionName ?? "Competicion pendiente",
    description: getTeamsDirectoryDescription(team),
    ctaLabel: "Ver equipo",
    featured: false,
    accent: "slate",
  };
}

async function getActiveVisibleSeasonTeams() {
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
              season: {
                select: {
                  id: true,
                  name: true,
                },
              },
              team: {
                select: {
                  isFirstTeam: true,
                },
              },
              coaches: {
                where: {
                  publicVisible: true,
                },
                orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
                select: {
                  name: true,
                  displayOrder: true,
                },
              },
              assignments: {
                where: {
                  active: true,
                  deletedAt: null,
                },
                orderBy: [{ displayOrder: "asc" }, { shirtNumber: "asc" }, { id: "asc" }],
                select: {
                  shirtNumber: true,
                  position: true,
                  player: {
                    select: {
                      publicName: true,
                      slug: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  return siteSettings?.activeSeason?.seasonTeams ?? [];
}

async function getTeamNewsItems(teamName: string, isFirstTeam: boolean): Promise<TeamNewsItem[]> {
  const articles = await getPublishedPublicNewsArticlesFromDb();

  if (!articles || articles.length === 0) {
    return [];
  }

  const matchingArticles = articles.filter((article) => {
    if (article.relatedTeam === teamName) {
      return true;
    }

    if (isFirstTeam) {
      return article.relatedTeam === "Primer Equipo";
    }

    return false;
  });

  return matchingArticles.slice(0, 2).map((article, index) => ({
    href: `/noticias/${article.slug}`,
    category: article.category,
    title: article.title,
    tone: index % 2 === 0 ? "ball" : "tactics",
  }));
}

function buildQuickInfo(team: DbSeasonTeam, coachNames: string[]): TeamQuickInfoItem[] {
  return [
    {
      label: "Categoria",
      value: normalizeCategory(team.category, team.team.isFirstTeam),
    },
    {
      label: "Competicion",
      value: team.competitionName ?? "Competicion pendiente",
    },
    {
      label: "Temporada",
      value: team.season.name,
    },
    {
      label: "Entrenadores",
      value: coachNames.length > 0 ? coachNames.join(", ") : "Cuerpo tecnico pendiente",
    },
  ];
}

function buildSquadPreview(team: DbSeasonTeam, links: ReturnType<typeof getTeamLinks>) {
  const highlights = team.assignments
    .slice(0, 3)
    .map((assignment) => ({
      name: assignment.player.publicName ?? assignment.player.slug,
      position: assignment.position ?? "Jugador",
      number: assignment.shirtNumber ?? 0,
    }));

  return {
    totalPlayers: team.assignments.length,
    goalkeepers: team.assignments.filter((assignment) =>
      (assignment.position ?? "").toLowerCase().includes("goalkeeper") ||
      (assignment.position ?? "").toLowerCase().includes("portero"),
    ).length,
    highlights,
    href: links.squad,
  };
}

async function buildPublicTeamPageContent(team: DbSeasonTeam): Promise<PublicTeamPageContent> {
  const links = getTeamLinks(team.publicSlug, team.team.isFirstTeam);
  const coachNames = team.coaches.map((coach) => coach.name);

  const [nextMatch, recentResults, standingTables, playedMatches, playerStats, news] = await Promise.all([
    prisma.match.findFirst({
      where: {
        seasonTeamId: team.id,
        deletedAt: null,
        status: {
          in: [MatchStatus.SCHEDULED, MatchStatus.LIVE, MatchStatus.POSTPONED],
        },
      },
      orderBy: [{ dateTime: "asc" }, { id: "asc" }],
      select: {
        id: true,
        opponentName: true,
        dateTime: true,
        venue: true,
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
        seasonTeamId: team.id,
        deletedAt: null,
        status: MatchStatus.PLAYED,
      },
      orderBy: [{ dateTime: "desc" }, { id: "desc" }],
      take: 3,
      select: {
        id: true,
        opponentName: true,
        isHome: true,
        homeScore: true,
        awayScore: true,
        matchday: true,
      },
    }),
    prisma.standingTable.findMany({
      where: buildStandingTableScopeWhere(team.season.id, [team], {
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
          select: {
            position: true,
            teamName: true,
            played: true,
            won: true,
            points: true,
            goalsFor: true,
            goalsAgainst: true,
            isOwnTeam: true,
          },
        },
      },
    }),
    prisma.match.findMany({
      where: {
        seasonTeamId: team.id,
        deletedAt: null,
        status: MatchStatus.PLAYED,
      },
      select: {
        isHome: true,
        homeScore: true,
        awayScore: true,
      },
    }),
    prisma.playerMatchStats.findMany({
      where: {
        seasonTeamId: team.id,
      },
      select: {
        goals: true,
        player: {
          select: {
            publicName: true,
            slug: true,
          },
        },
      },
    }),
    getTeamNewsItems(team.publicName, team.team.isFirstTeam),
  ]);
  const standingTable = pickBestStandingTableForTeam(standingTables, team);

  const totalGoalsFor = playedMatches.reduce(
    (total, match) => total + (match.isHome ? match.homeScore ?? 0 : match.awayScore ?? 0),
    0,
  );
  const totalGoalsAgainst = playedMatches.reduce(
    (total, match) => total + (match.isHome ? match.awayScore ?? 0 : match.homeScore ?? 0),
    0,
  );

  const topScorerMap = new Map<string, { name: string; goals: number }>();
  for (const stat of playerStats) {
    const key = stat.player.slug;
    const current = topScorerMap.get(key);
    const playerName = stat.player.publicName ?? stat.player.slug;

    if (current) {
      current.goals += stat.goals;
    } else {
      topScorerMap.set(key, {
        name: playerName,
        goals: stat.goals,
      });
    }
  }

  const topScorer =
    Array.from(topScorerMap.values()).sort((left, right) => right.goals - left.goals)[0] ??
    (team.assignments[0]
      ? {
          name: team.assignments[0].player.publicName ?? team.assignments[0].player.slug,
          goals: 0,
        }
      : {
          name: "Plantilla pendiente",
          goals: 0,
        });

  const ownStandingRow = standingTable
    ? findOwnStandingRowForTeam(standingTable.rows, team.publicName)
    : null;

  return {
    slug: team.publicSlug,
    variant: team.team.isFirstTeam ? "first-team" : "academy",
    name: team.publicName,
    category: normalizeCategory(team.category, team.team.isFirstTeam),
    competition: team.competitionName ?? "Competicion pendiente",
    season: team.season.name,
    coaches: coachNames,
    heroImageUrl: undefined,
    heroImagePosition: team.team.isFirstTeam ? "center center" : "center top",
    links,
    nextMatch: nextMatch
      ? {
          home: {
            name: nextMatch.seasonTeam.publicName,
            highlight: true,
          },
          away: {
            name: nextMatch.opponentName,
          },
          competition: buildMatchCompetitionLabel(
            nextMatch.competition?.name ?? team.competitionName,
            nextMatch.matchday,
          ),
          dateLabel: formatMatchDateLabel(nextMatch.dateTime),
          venue: nextMatch.venue ?? "Campo pendiente",
          status: formatMatchStatus(nextMatch.status),
          href: buildPublicMatchDetailHref({
            teamSlug: team.publicSlug,
            isFirstTeam: team.team.isFirstTeam,
            matchId: nextMatch.id.toString(),
          }),
        }
      : {
          home: {
            name: team.publicName,
            highlight: true,
          },
          away: {
            name: "Rival pendiente",
          },
          competition: team.competitionName ?? "Competicion pendiente",
          dateLabel: "Fecha pendiente",
          venue: "Campo pendiente",
          status: "Pendiente",
          href: undefined,
        },
    recentResults: recentResults.map((match) => {
      const goalsFor = match.isHome ? match.homeScore : match.awayScore;
      const goalsAgainst = match.isHome ? match.awayScore : match.homeScore;

      return {
        opponent: match.opponentName,
        score: `${goalsFor ?? "-"} - ${goalsAgainst ?? "-"}`,
        result: getResultCode(goalsFor, goalsAgainst),
        label: match.matchday ? `J${match.matchday}` : undefined,
        href: buildPublicMatchDetailHref({
          teamSlug: team.publicSlug,
          isFirstTeam: team.team.isFirstTeam,
          matchId: match.id.toString(),
        }),
      };
    }),
    standing: {
      competition: team.competitionName ?? "Competicion pendiente",
      position: `${ownStandingRow?.position ?? "-"}`,
      points: ownStandingRow?.points ?? 0,
      played: ownStandingRow?.played ?? playedMatches.length,
      won: ownStandingRow?.won ?? recentResults.filter((match) => {
        const goalsFor = match.isHome ? match.homeScore : match.awayScore;
        const goalsAgainst = match.isHome ? match.awayScore : match.homeScore;

        return (goalsFor ?? 0) > (goalsAgainst ?? 0);
      }).length,
      href: links.standing,
    },
    metrics: {
      goalsFor: totalGoalsFor,
      goalsAgainst: totalGoalsAgainst,
      matchesPlayed: playedMatches.length,
      squadSize: team.assignments.length,
    },
    topScorer: {
      name: topScorer.name,
      goals: topScorer.goals,
      href: undefined,
    },
    squadPreview: buildSquadPreview(team, links),
    quickInfo: buildQuickInfo(team, coachNames),
    news,
  };
}

export async function getPublicTeamPageContentFromDb(
  teamSlug: string,
): Promise<PublicTeamPageContent | null> {
  try {
    const teams = await getActiveVisibleSeasonTeams();
    const team = teams.find((item) => item.publicSlug === teamSlug);

    if (!team) {
      return null;
    }

    return buildPublicTeamPageContent(team);
  } catch {
    return null;
  }
}

export async function getPublicTeamsDirectoryContentFromDb(): Promise<TeamsDirectoryContent | null> {
  try {
    const teams = await getActiveVisibleSeasonTeams();
    const firstTeam = teams.find((team) => team.team.isFirstTeam);
    const academyTeams = teams.filter((team) => !team.team.isFirstTeam);

    if (!firstTeam) {
      return null;
    }

    const featuredFirstTeam: FeaturedFirstTeamContent = {
      sectionTitle: "Primer Equipo",
      eyebrow: "Plantilla profesional",
      name: firstTeam.publicName,
      description: getTeamSummaryDescription(firstTeam),
      primaryCta: {
        href: "/primer-equipo/plantilla",
        label: "Ver plantilla completa",
      },
      secondaryCta: {
        href: "/primer-equipo/calendario",
        label: "Calendario",
      },
    };

    const visibleAcademyTeams = academyTeams.map(mapDirectoryTeam);
    const promoTarget = visibleAcademyTeams[visibleAcademyTeams.length - 1] ?? visibleAcademyTeams[0];
    const promo: AcademyPromoContent = {
      eyebrow: "Metodologia",
      title: "Futuro Raimon",
      description:
        "Una cantera conectada por principios comunes para que cada categoria impulse la siguiente.",
      ctaLabel: promoTarget ? `Ver ${promoTarget.name}` : "Ver equipos",
      href: promoTarget ? `/equipos/${promoTarget.slug}` : "/equipos",
    };

    return {
      hero: {
        chip: "Estructura deportiva",
        title: "Nuestros Equipos",
        description:
          "Del primer equipo a la base, una estructura pensada para competir, formar y dar continuidad al estilo Rising Raimon.",
      },
      featuredFirstTeam,
      academy: {
        title: "Cantera",
        chip: "Academia de alto rendimiento",
        teams: visibleAcademyTeams,
        promo,
      },
    };
  } catch {
    return null;
  }
}
