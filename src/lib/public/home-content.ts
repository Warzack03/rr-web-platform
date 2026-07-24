import type {
  PublicNewsArticle,
  PublicStandingRow,
  PublicTeamRecentResult,
  PublicTeamReference,
} from "@/lib/contracts/public";
import { getPublicHomeDbSections } from "@/server/services/public/home";
import { getPublicNewsHighlights } from "@/server/services/public/news-content";

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
  home: PublicTeamReference;
  away: PublicTeamReference;
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
  logoUrl?: string;
  logoAlt?: string;
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
    recentResults: PublicTeamRecentResult[];
    standingsRows: PublicStandingRow[];
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
  const [dbSections, newsHighlights] = await Promise.all([
    getPublicHomeDbSections(),
    getPublicNewsHighlights(2),
  ]);
  const { featuredArticle: featuredNews, latestArticles: latestNews } = newsHighlights;

  if (!dbSections?.firstTeam || !dbSections.academy) {
    return null;
  }

  const nextMatchHref =
    dbSections.firstTeam.nextMatch.href ?? dbSections.firstTeam.calendarHref;

  return {
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
      secondaryLabel: "Ir a Primer Equipo",
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
}
