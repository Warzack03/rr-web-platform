import { MediaUsage, NewsStatus, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import type {
  AdminManagedNewsPost,
  AdminNewsTeamOption,
} from "@/lib/admin/news-management";
import {
  slugifyNewsTitle,
  getAdminNewsStatusLabel,
  toDateTimeLocalValue,
} from "@/lib/admin/news-management";
import { resolveMediaAssetId } from "@/server/services/admin-media";
import type { AuthenticatedAdmin } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";

export type AdminNewsScreenData = {
  posts: AdminManagedNewsPost[];
  teamOptions: AdminNewsTeamOption[];
  activeSeasonName: string | null;
};

const ADMIN_NEWS_POST_LIST_LIMIT = 120;

function formatDateTimeLabel(date: Date | null) {
  if (!date) {
    return "Sin fecha";
  }

  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Madrid",
  })
    .format(date)
    .replace(".", "");
}

function mapPostStatusLabel(status: NewsStatus, publishedAt: Date | null) {
  if (status === NewsStatus.PUBLISHED && publishedAt) {
    return `${getAdminNewsStatusLabel("PUBLISHED")} - ${formatDateTimeLabel(publishedAt)}`;
  }

  return getAdminNewsStatusLabel(status);
}

function collectRelatedTeamSlugs(
  teams: Array<{ seasonTeam: { publicSlug: string; team: { isFirstTeam: boolean } } }>,
) {
  return Array.from(new Set(teams.map((item) => item.seasonTeam.publicSlug)));
}

function revalidateNewsPaths(
  input: {
    previousSlug?: string | null;
    nextSlug: string;
    previousRelatedTeamSlugs: string[];
    nextRelatedTeamSlugs: string[];
  },
) {
  revalidatePath("/admin/noticias");
  revalidatePath("/");
  revalidatePath("/noticias");

  if (input.previousSlug) {
    revalidatePath(`/noticias/${input.previousSlug}`);
  }

  revalidatePath(`/noticias/${input.nextSlug}`);

  const teamSlugs = Array.from(
    new Set([...input.previousRelatedTeamSlugs, ...input.nextRelatedTeamSlugs]),
  );

  for (const slug of teamSlugs) {
    if (slug === "primer-equipo") {
      revalidatePath("/primer-equipo");
      continue;
    }

    revalidatePath(`/equipos/${slug}`);
  }
}

export async function getAdminNewsScreenData(
  _user: AuthenticatedAdmin,
): Promise<AdminNewsScreenData> {
  void _user;

  const [siteSettings, seasonTeams, posts] = await Promise.all([
    prisma.siteSettings.findFirst({
      orderBy: { updatedAt: "desc" },
      select: {
        activeSeason: {
          select: {
            name: true,
          },
        },
      },
    }),
    prisma.seasonTeam.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: [
        { season: { startDate: "desc" } },
        { displayOrder: "asc" },
        { publicName: "asc" },
      ],
      select: {
        id: true,
        publicName: true,
        publicSlug: true,
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
    }),
    prisma.newsPost.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
      take: ADMIN_NEWS_POST_LIST_LIMIT,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        bodyMarkdown: true,
        externalVideoUrl: true,
        status: true,
        featured: true,
        publishedAt: true,
        updatedAt: true,
        author: {
          select: {
            displayName: true,
          },
        },
        coverMedia: {
          select: {
            id: true,
            publicUrl: true,
            altText: true,
          },
        },
        teams: {
          orderBy: [{ seasonTeam: { season: { startDate: "desc" } } }, { seasonTeam: { publicName: "asc" } }],
          select: {
            seasonTeam: {
              select: {
                id: true,
                publicName: true,
                publicSlug: true,
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
    }),
  ]);

  return {
    activeSeasonName: siteSettings?.activeSeason?.name ?? null,
    teamOptions: seasonTeams.map((team) => ({
      id: team.id.toString(),
      slug: team.publicSlug,
      name: team.publicName,
      season: team.season.name,
      isFirstTeam: team.team.isFirstTeam,
    })),
    posts: posts.map((post) => ({
      id: post.id.toString(),
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt ?? "",
      bodyMarkdown: post.bodyMarkdown,
      externalVideoUrl: post.externalVideoUrl ?? undefined,
      coverMediaId: post.coverMedia?.id.toString(),
      coverUrl: post.coverMedia?.publicUrl ?? undefined,
      coverAltText: post.coverMedia?.altText ?? undefined,
      status: post.status,
      featured: post.featured,
      publishedAt: toDateTimeLocalValue(post.publishedAt),
      publishedAtLabel: mapPostStatusLabel(post.status, post.publishedAt),
      updatedAtLabel: formatDateTimeLabel(post.updatedAt),
      authorName: post.author?.displayName ?? "Media Team",
      relatedTeamIds: post.teams.map((item) => item.seasonTeam.id.toString()),
      relatedTeamLabels: post.teams.map((item) => item.seasonTeam.publicName),
    })),
  };
}

export async function saveNewsPost(
  user: AuthenticatedAdmin,
  input: {
    newsPostId?: string;
    title: string;
    slug: string;
    excerpt: string;
    bodyMarkdown: string;
    externalVideoUrl?: string;
    coverMediaId?: string;
    coverUrl?: string;
    status: NewsStatus;
    featured: boolean;
    publishedAt?: string;
    relatedTeamIds: string[];
  },
) {
  const normalizedSlug = slugifyNewsTitle(input.title);
  const normalizedId = input.newsPostId?.trim() ?? "";
  const isEditing = normalizedId.length > 0;

  if (!normalizedSlug) {
    throw new Error("El titulo debe permitir generar un slug valido.");
  }

  if (isEditing && !/^\d+$/.test(normalizedId)) {
    throw new Error("No hemos podido identificar la noticia.");
  }

  const slugConflict = await prisma.newsPost.findFirst({
    where: {
      slug: normalizedSlug,
      deletedAt: null,
      ...(isEditing ? { id: { not: BigInt(normalizedId) } } : {}),
    },
    select: {
      id: true,
    },
  });

  if (slugConflict) {
    throw new Error("Ese slug ya esta en uso por otra noticia.");
  }

  const relatedSeasonTeams =
    input.relatedTeamIds.length > 0
      ? await prisma.seasonTeam.findMany({
          where: {
            id: {
              in: input.relatedTeamIds.map((value) => BigInt(value)),
            },
            deletedAt: null,
          },
          select: {
            id: true,
            publicSlug: true,
          },
        })
      : [];

  if (relatedSeasonTeams.length !== input.relatedTeamIds.length) {
    throw new Error("Alguno de los equipos relacionados ya no esta disponible.");
  }

  const previousPost = isEditing
    ? await prisma.newsPost.findFirst({
        where: {
          id: BigInt(normalizedId),
          deletedAt: null,
        },
        select: {
          id: true,
          slug: true,
          teams: {
            select: {
              seasonTeam: {
                select: {
                  publicSlug: true,
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
      })
    : null;

  if (isEditing && !previousPost) {
    throw new Error("La noticia ya no esta disponible.");
  }

  const publishedAtValue = input.publishedAt?.trim()
    ? new Date(input.publishedAt)
    : input.status === NewsStatus.PUBLISHED
      ? new Date()
      : null;

  const savedId = await prisma.$transaction(async (tx) => {
    if (input.featured && input.status === NewsStatus.PUBLISHED) {
      await tx.newsPost.updateMany({
        where: {
          deletedAt: null,
          featured: true,
          ...(isEditing ? { id: { not: BigInt(normalizedId) } } : {}),
        },
        data: {
          featured: false,
        },
      });
    }

    const coverMediaId = await resolveMediaAssetId(
      {
        mediaId: input.coverMediaId,
        publicUrl: input.coverUrl,
        usage: MediaUsage.NEWS_COVER,
        uploadedById: user.id,
      },
      tx,
    );

    const data: Prisma.NewsPostUncheckedCreateInput = {
      title: input.title,
      slug: normalizedSlug,
      excerpt: input.excerpt,
      bodyMarkdown: input.bodyMarkdown,
      externalVideoUrl: input.externalVideoUrl?.trim() || null,
      coverMediaId,
      status: input.status,
      featured: input.featured,
      publishedAt: publishedAtValue,
      authorId: user.id,
      createdById: user.id,
      updatedById: user.id,
    };

    const savedPost = isEditing
      ? await tx.newsPost.update({
          where: {
            id: BigInt(normalizedId),
          },
          data: {
            ...data,
            createdById: undefined,
          },
          select: {
            id: true,
          },
        })
      : await tx.newsPost.create({
          data,
          select: {
            id: true,
          },
        });

    await tx.newsPostTeam.deleteMany({
      where: {
        newsPostId: savedPost.id,
      },
    });

    if (relatedSeasonTeams.length > 0) {
      await tx.newsPostTeam.createMany({
        data: relatedSeasonTeams.map((team) => ({
          newsPostId: savedPost.id,
          seasonTeamId: team.id,
        })),
      });
    }

    return savedPost.id;
  });

  revalidateNewsPaths({
    previousSlug: previousPost?.slug,
    nextSlug: normalizedSlug,
    previousRelatedTeamSlugs: collectRelatedTeamSlugs(previousPost?.teams ?? []),
    nextRelatedTeamSlugs: relatedSeasonTeams.map((team) => team.publicSlug),
  });

  return savedId.toString();
}

export async function deleteNewsPost(user: AuthenticatedAdmin, newsPostId: string) {
  if (!/^\d+$/.test(newsPostId)) {
    throw new Error("No hemos podido identificar la noticia.");
  }

  const existing = await prisma.newsPost.findFirst({
    where: {
      id: BigInt(newsPostId),
      deletedAt: null,
    },
    select: {
      id: true,
      slug: true,
      teams: {
        select: {
          seasonTeam: {
            select: {
              publicSlug: true,
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

  if (!existing) {
    throw new Error("La noticia ya no esta disponible.");
  }

  await prisma.newsPost.update({
    where: {
      id: existing.id,
    },
    data: {
      deletedAt: new Date(),
      featured: false,
      updatedById: user.id,
    },
  });

  revalidateNewsPaths({
    previousSlug: existing.slug,
    nextSlug: existing.slug,
    previousRelatedTeamSlugs: collectRelatedTeamSlugs(existing.teams),
    nextRelatedTeamSlugs: [],
  });
}
