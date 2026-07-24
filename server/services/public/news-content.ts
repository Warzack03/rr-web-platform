import type { PublicNewsArticle } from "@/lib/contracts/public";
import {
  getPublishedPublicNewsArticleBySlugFromDb,
  getPublishedPublicNewsArticlesFromDb,
} from "@/server/services/public/news";

export async function getPublicNewsArticles() {
  const dbArticles = await getPublishedPublicNewsArticlesFromDb();

  if (!dbArticles || dbArticles.length === 0) {
    return [];
  }

  return dbArticles;
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

export async function getPublicNewsHighlights(latestLimit = 2) {
  const articles = await getPublicNewsArticles();

  if (articles.length === 0) {
    return {
      featuredArticle: undefined,
      latestArticles: [],
    };
  }

  const featuredArticle = articles.find((article) => article.featured) ?? articles[0];
  const latestArticles = articles
    .filter((article) => article.slug !== featuredArticle.slug)
    .slice(0, latestLimit);

  return {
    featuredArticle,
    latestArticles,
  };
}

export async function getResolvedPublicNewsArticleBySlug(slug: string) {
  return getPublishedPublicNewsArticleBySlugFromDb(slug);
}

export async function getResolvedRelatedPublicNewsArticles(slug: string, limit = 2) {
  const articles = await getPublicNewsArticles();
  const article =
    articles.find((candidate) => candidate.slug === slug) ??
    (await getResolvedPublicNewsArticleBySlug(slug));

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
