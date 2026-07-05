import type {
  PublicNewsArticle,
  PublicNewsCategory,
  PublicNewsImageTone,
} from "@/lib/public/news-content";
import { prisma } from "@/server/db/prisma";

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

function buildContentBlocks(bodyMarkdown: string, externalVideoUrl: string | null) {
  const blocks: PublicNewsArticle["content"] = bodyMarkdown
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => ({
      type: "paragraph" as const,
      text: paragraph,
    }));

  if (externalVideoUrl) {
    blocks.push({
      type: "link",
      label: "Ver video",
      href: externalVideoUrl,
      description: "Video externo asociado a la noticia.",
      external: true,
    });
  }

  return blocks.length > 0
    ? blocks
    : [
        {
          type: "paragraph" as const,
          text: "Contenido pendiente de ampliar.",
        },
      ];
}

export async function getPublishedPublicNewsArticlesFromDb(): Promise<PublicNewsArticle[] | null> {
  try {
    const posts = await prisma.newsPost.findMany({
      where: {
        deletedAt: null,
        status: "PUBLISHED",
      },
      orderBy: [{ featured: "desc" }, { publishedAt: "desc" }, { createdAt: "desc" }],
      select: {
        slug: true,
        title: true,
        excerpt: true,
        bodyMarkdown: true,
        externalVideoUrl: true,
        featured: true,
        publishedAt: true,
        author: {
          select: {
            displayName: true,
          },
        },
        teams: {
          take: 1,
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
      },
    });

    return posts.map((post) => {
      const relatedTeam = post.teams[0]?.seasonTeam.publicName;
      const isFirstTeam = post.teams[0]?.seasonTeam.team.isFirstTeam ?? false;
      const category = inferCategory({
        relatedTeamName: relatedTeam,
        isFirstTeam,
      });

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
        coverImageAlt: `Imagen de portada para ${post.title}.`,
        featured: post.featured,
        relatedTeam,
        badge: post.featured ? "Destacada" : undefined,
        content: buildContentBlocks(post.bodyMarkdown, post.externalVideoUrl),
      } satisfies PublicNewsArticle;
    });
  } catch {
    return null;
  }
}
