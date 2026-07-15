import type { PublicNewsArticle } from "@/lib/public/news-content";
import type { MatchResult, TeamStub } from "@/lib/public/team-page-content";
import type { StandingRowData } from "@/lib/public/team-standings-content";
import type { PublicDataSourceInfo } from "@/lib/public/data-source";
import { getPublicHomeDbSections } from "@/server/services/public/home";
import {
  getFeaturedPublicNewsArticle,
  getLatestPublicNewsArticles,
} from "@/server/services/public/news-content";

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
  } | null;
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
  const result = await getPublicHomePageContentWithSource();

  return result?.content ?? null;
}

export async function getPublicHomePageContentWithSource(): Promise<{
  content: PublicHomePageContent;
  dataSource: PublicDataSourceInfo;
} | null> {
  const [dbSections, featuredNews, latestNews] = await Promise.all([
    getPublicHomeDbSections(),
    getFeaturedPublicNewsArticle(),
    getLatestPublicNewsArticles(2),
  ]);

  if (!dbSections?.firstTeam || !dbSections.academy) {
    return null;
  }

  const nextMatchHref =
    dbSections.firstTeam.nextMatch.href ?? dbSections.firstTeam.calendarHref;

  const content: PublicHomePageContent = {
    hero: {
      eyebrow: "Rising Raimon",
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
    firstTeam: dbSections.firstTeam,
    academy: dbSections.academy,
    news: featuredNews
      ? {
          title: "Actualidad",
          href: "/noticias",
          featured: featuredNews,
          latest: latestNews,
        }
      : null,
  };

  return {
    content,
    dataSource: {
      source: "db",
      note: "home",
    },
  };
}
