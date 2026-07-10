import type { PublicNewsArticle } from "@/lib/public/news-content";
import type { PublicDataSourceInfo } from "@/lib/public/data-source";
import { PUBLIC_NEWS_ARTICLES } from "@/lib/public/news-content";
import { getPublishedPublicNewsArticlesFromDb } from "@/server/services/public/news";

export async function getPublicNewsArticles() {
  const result = await getPublicNewsArticlesWithSource();

  return result.articles;
}

export async function getPublicNewsArticlesWithSource(): Promise<{
  articles: PublicNewsArticle[];
  dataSource: PublicDataSourceInfo;
}> {
  const dbArticles = await getPublishedPublicNewsArticlesFromDb();

  if (!dbArticles || dbArticles.length === 0) {
    return {
      articles: PUBLIC_NEWS_ARTICLES,
      dataSource: {
        source: "mock",
        note: "news",
      },
    };
  }

  return {
    articles: dbArticles,
    dataSource: {
      source: "db",
      note: "news",
    },
  };
}

export async function getFeaturedPublicNewsArticle() {
  const articles = await getPublicNewsArticles();

  return articles.find((article) => article.featured) ?? articles[0];
}

export async function getLatestPublicNewsArticles(limit?: number) {
  const articles = await getPublicNewsArticles();

  if (articles.length === 0) {
    return [];
  }

  const featuredArticle = articles.find((article) => article.featured) ?? articles[0];
  const latestArticles = articles.filter((article) => article.slug !== featuredArticle.slug);

  return typeof limit === "number" ? latestArticles.slice(0, limit) : latestArticles;
}

export async function getResolvedPublicNewsArticleBySlug(slug: string) {
  const articles = await getPublicNewsArticles();

  return articles.find((article) => article.slug === slug) ?? null;
}

export async function getResolvedRelatedPublicNewsArticles(slug: string, limit = 2) {
  const articles = await getPublicNewsArticles();
  const article = articles.find((candidate) => candidate.slug === slug);

  if (!article) {
    return [];
  }

  const explicitRelated =
    article.relatedSlugs
      ?.map((relatedSlug) => articles.find((candidate) => candidate.slug === relatedSlug) ?? null)
      .filter((relatedArticle): relatedArticle is PublicNewsArticle => relatedArticle !== null) ?? [];

  if (explicitRelated.length > 0) {
    return explicitRelated.slice(0, limit);
  }

  return articles
    .filter((candidate) => {
      if (candidate.slug === slug) {
        return false;
      }

      return (
        candidate.category === article.category ||
        (article.relatedTeam !== undefined && candidate.relatedTeam === article.relatedTeam)
      );
    })
    .slice(0, limit);
}
