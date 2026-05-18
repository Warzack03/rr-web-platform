import type { PublicNewsArticle } from "@/lib/public/news-content";
import { PUBLIC_NEWS_ARTICLES } from "@/lib/public/news-content";
import {
  getPublicAcademyTeamPageContent,
  getPublicTeamPageContent,
  type MatchResult,
  type TeamStub,
} from "@/lib/public/team-page-content";
import type { StandingRowData } from "@/lib/public/team-standings-content";
import { getFirstTeamStandingsContent } from "@/lib/public/team-standings-content";
import { getTeamsDirectoryContent } from "@/lib/public/teams-directory-content";

export type HomeHeroContent = {
  eyebrow: string;
  titleLead: string;
  titleAccent: string;
  description: string;
  primaryCta: {
    href: string;
    label: string;
  };
  secondaryHref: string;
  secondaryLabel: string;
};

export type HomeMatchPreview = {
  home: TeamStub;
  away: TeamStub;
  competition: string;
  dateLabel: string;
  venue: string;
  status?: string;
  href?: string;
  actionLabel?: string;
  actionHref?: string;
};

export type HomeAcademyMetric = {
  label: string;
  value: string;
};

export type HomeAcademyTeamLink = {
  slug: string;
  name: string;
  category: string;
  competition: string;
};

export type PublicHomePageContent = {
  hero: HomeHeroContent;
  firstTeam: {
    eyebrow: string;
    title: string;
    description: string;
    teamHref: string;
    calendarHref: string;
    standingHref: string;
    nextMatch: HomeMatchPreview;
    recentResults: MatchResult[];
    standingsRows: StandingRowData[];
  };
  news: {
    title: string;
    href: string;
    featured: PublicNewsArticle;
    latest: PublicNewsArticle[];
  };
  academy: {
    eyebrow: string;
    title: string;
    description: string;
    href: string;
    metrics: HomeAcademyMetric[];
    teams: HomeAcademyTeamLink[];
  };
};

export async function getPublicHomePageContent(): Promise<PublicHomePageContent | null> {
  const [firstTeam, standings] = await Promise.all([
    getPublicTeamPageContent("primer-equipo"),
    getFirstTeamStandingsContent(),
  ]);

  if (!firstTeam || !standings) {
    return null;
  }

  const directory = getTeamsDirectoryContent();
  const academyTeams = directory.academy.teams.slice(0, 4);
  const academyTeamPages = await Promise.all(
    academyTeams.map((team) => getPublicAcademyTeamPageContent(team.slug)),
  );

  const availableAcademyTeamPages = academyTeamPages.filter((team) => team !== null);
  const totalAcademyPlayers = availableAcademyTeamPages.reduce(
    (total, team) => total + team.metrics.squadSize,
    0,
  );
  const academyCategories = new Set(academyTeams.map((team) => team.category)).size;
  const nextMatchHref = firstTeam.nextMatch.href ?? firstTeam.links.calendar;

  return {
    hero: {
      eyebrow: "El nuevo estandar",
      titleLead: "Mas que un club,",
      titleAccent: "una identidad",
      description:
        "Competimos con una idea clara: futbol reconocible, cantera conectada y ambicion para sostener cada jornada.",
      primaryCta: {
        href: nextMatchHref,
        label: "Ver proximo partido",
      },
      secondaryHref: "/primer-equipo",
      secondaryLabel: "Ir al Primer Equipo",
    },
    firstTeam: {
      eyebrow: "Primer Equipo",
      title: "La arena de batalla",
      description: "El pulso competitivo del club, resumido en lo que viene y en lo que deja cada jornada.",
      teamHref: "/primer-equipo",
      calendarHref: firstTeam.links.calendar,
      standingHref: firstTeam.links.standing,
      nextMatch: {
        ...firstTeam.nextMatch,
        href: nextMatchHref,
        actionLabel: firstTeam.nextMatch.href ? "Ver previa" : "Ver calendario",
        actionHref: nextMatchHref,
      },
      recentResults: firstTeam.recentResults.slice(0, 3),
      standingsRows: standings.rows.slice(0, 3),
    },
    news: {
      title: "Actualidad",
      href: "/noticias",
      featured: PUBLIC_NEWS_ARTICLES[0],
      latest: PUBLIC_NEWS_ARTICLES.slice(1, 3),
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
          value: `${totalAcademyPlayers}`,
        },
        {
          label: "Categorias",
          value: `${academyCategories}`,
        },
      ],
      teams: academyTeams.map((team) => ({
        slug: team.slug,
        name: team.name,
        category: team.category,
        competition: team.competition,
      })),
    },
  };
}
