import type {
  PublicNewsArticle,
  PublicNewsCategory,
  PublicNewsImageTone,
} from "@/lib/contracts/public";
import { getTeamsDirectoryTeamName } from "@/lib/public/team-display-name";
import { NewsStatus, Prisma } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { logServerError } from "@/server/logging/safe-server-log";
import { buildPublicNewsContentBlocks } from "@/server/services/news-content-policy";

const PUBLIC_NEWS_LIST_LIMIT = 60;

const publicNewsSummarySelect = {
  slug: true,
  title: true,
  excerpt: true,
  featured: true,
  publishedAt: true,
  coverMedia: {
    select: {
      publicUrl: true,
      altText: true,
      width: true,
      height: true,
    },
  },
  author: {
    select: {
      displayName: true,
    },
  },
  teams: {
    where: {
      seasonTeam: {
        active: true,
        publicVisible: true,
        deletedAt: null,
      },
    },
    orderBy: [{ seasonTeam: { publicName: "asc" } }],
    select: {
      seasonTeam: {
        select: {
          publicName: true,
          team: {
            select: {
              isFirstTeam: true,
            },
          },
        },
      },
    },
  },
} satisfies Prisma.NewsPostSelect;

const publicNewsDetailSelect = {
  ...publicNewsSummarySelect,
  bodyMarkdown: true,
  externalVideoUrl: true,
} satisfies Prisma.NewsPostSelect;

type PublicNewsSummaryRow = Prisma.NewsPostGetPayload<{
  select: typeof publicNewsSummarySelect;
}>;

type PublicNewsDetailRow = Prisma.NewsPostGetPayload<{
  select: typeof publicNewsDetailSelect;
}>;

function formatNewsDateLabel(date: Date | null) {
  if (!date) {
    return "FECHA PENDIENTE";
  }

  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Europe/Madrid",
  })
    .format(date)
    .replace(".", "")
    .toUpperCase();
}

function inferCategory(input: {
  relatedTeamName?: string;
  isFirstTeam?: boolean;
}): PublicNewsCategory {
  if (input.relatedTeamName && !input.isFirstTeam) {
    return "Cantera";
  }

  return "Club";
}

function inferImageTone(input: {
  featured: boolean;
  relatedTeamName?: string;
  isFirstTeam?: boolean;
}): PublicNewsImageTone {
  if (input.isFirstTeam) {
    return input.featured ? "stadium-night" : "training-ground";
  }

  if (input.relatedTeamName) {
    return "academy-surge";
  }

  return input.featured ? "press-room" : "locker-room";
}

function getPublishedNewsWhere(now = new Date()) {
  return {
    deletedAt: null,
    status: NewsStatus.PUBLISHED,
    publishedAt: {
      lte: now,
    },
  } satisfies Prisma.NewsPostWhereInput;
}

function mapPublicNewsRowToArticle(
  post: PublicNewsSummaryRow | PublicNewsDetailRow,
): PublicNewsArticle {
  const relatedTeams = post.teams.map((item) =>
    getTeamsDirectoryTeamName(
      item.seasonTeam.publicName,
      item.seasonTeam.team.isFirstTeam,
    ),
  );
  const relatedTeam = relatedTeams[0];
  const isFirstTeam = post.teams.some((item) => item.seasonTeam.team.isFirstTeam);
  const category = inferCategory({
    relatedTeamName: relatedTeam,
    isFirstTeam,
  });
  const hasDetailContent = "bodyMarkdown" in post;

  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt ?? "Actualidad de Rising Raimon.",
    category,
    date: post.publishedAt?.toISOString().slice(0, 10) ?? "",
    dateLabel: formatNewsDateLabel(post.publishedAt),
    author: post.author?.displayName ?? "Media Team",
    imageTone: inferImageTone({
      featured: post.featured,
      relatedTeamName: relatedTeam,
      isFirstTeam,
    }),
    coverImageUrl: post.coverMedia?.publicUrl?.trim() || undefined,
    coverImageAlt: post.coverMedia?.altText?.trim() || `Imagen de portada para ${post.title}.`,
    featured: post.featured,
    relatedTeam,
    relatedTeams,
    badge: post.featured ? "Destacada" : undefined,
    content: hasDetailContent
      ? buildPublicNewsContentBlocks(post.bodyMarkdown, post.externalVideoUrl)
      : [],
  } satisfies PublicNewsArticle;
}

export async function getPublishedPublicNewsArticlesFromDb(): Promise<PublicNewsArticle[] | null> {
  try {
    const posts = await prisma.newsPost.findMany({
      where: getPublishedNewsWhere(),
      orderBy: [{ featured: "desc" }, { publishedAt: "desc" }, { createdAt: "desc" }],
      take: PUBLIC_NEWS_LIST_LIMIT,
      select: publicNewsSummarySelect,
    });

    return posts.map(mapPublicNewsRowToArticle);
  } catch (error) {
    logServerError("public.news.published", error);
    return null;
  }
}

export async function getPublishedPublicNewsArticleBySlugFromDb(
  slug: string,
): Promise<PublicNewsArticle | null> {
  try {
    const post = await prisma.newsPost.findFirst({
      where: {
        ...getPublishedNewsWhere(),
        slug,
      },
      select: publicNewsDetailSelect,
    });

    return post ? mapPublicNewsRowToArticle(post) : null;
  } catch (error) {
    logServerError("public.news.detail", error, { slug });
    return null;
  }
}
