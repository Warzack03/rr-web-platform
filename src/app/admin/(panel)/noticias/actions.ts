"use server";

import { NewsStatus } from "@prisma/client";
import { slugifyNewsTitle } from "@/lib/admin/news-management";
import { requireAdminSectionAccess } from "@/server/auth/session";
import {
  getSafeServerErrorMessage,
  logServerError,
} from "@/server/logging/safe-server-log";
import {
  deleteNewsPost,
  getAdminNewsScreenData,
  saveNewsPost,
  type AdminNewsScreenData,
} from "@/server/services/admin-news";
import {
  deleteNewsPostInputSchema,
  saveNewsPostInputSchema,
  type DeleteNewsPostInput,
  type SaveNewsPostInput,
} from "@/server/validators/admin-news";

type AdminNewsActionResult =
  | {
      ok: true;
      data: AdminNewsScreenData;
      selectedNewsPostId: string;
      message: string;
    }
  | {
      ok: false;
      message: string;
    };

export async function saveNewsPostAction(
  input: SaveNewsPostInput,
): Promise<AdminNewsActionResult> {
  const user = await requireAdminSectionAccess("news");
  const parsed = saveNewsPostInputSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "No hemos podido validar la noticia.",
    };
  }

  try {
    const slug = slugifyNewsTitle(parsed.data.title);
    const savedId = await saveNewsPost(user, {
      newsPostId: parsed.data.newsPostId,
      title: parsed.data.title,
      slug,
      excerpt: parsed.data.excerpt,
      bodyMarkdown: parsed.data.bodyMarkdown,
      externalVideoUrl: parsed.data.externalVideoUrl,
      coverMediaId: parsed.data.coverMediaId,
      coverUrl: parsed.data.coverUrl,
      status: NewsStatus[parsed.data.status],
      featured: parsed.data.featured,
      publishedAt: parsed.data.publishedAt,
      relatedTeamIds: parsed.data.relatedTeamIds,
    });

    return {
      ok: true,
      data: await getAdminNewsScreenData(user),
      selectedNewsPostId: savedId,
      message:
        parsed.data.status === "PUBLISHED"
          ? "Noticia guardada y publicada."
          : parsed.data.status === "ARCHIVED"
            ? "Noticia archivada."
            : "Borrador guardado.",
    };
  } catch (error) {
    logServerError("admin.news.save", error, {
      userId: user.id,
      newsPostId: parsed.data.newsPostId,
      status: parsed.data.status,
    });

    return {
      ok: false,
      message: getSafeServerErrorMessage(error, "No hemos podido guardar la noticia."),
    };
  }
}

export async function deleteNewsPostAction(
  input: DeleteNewsPostInput,
): Promise<AdminNewsActionResult> {
  const user = await requireAdminSectionAccess("news");
  const parsed = deleteNewsPostInputSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "No hemos podido validar la noticia.",
    };
  }

  try {
    await deleteNewsPost(user, parsed.data.newsPostId);
    const data = await getAdminNewsScreenData(user);

    return {
      ok: true,
      data,
      selectedNewsPostId: data.posts[0]?.id ?? "",
      message: "Noticia eliminada.",
    };
  } catch (error) {
    logServerError("admin.news.delete", error, {
      userId: user.id,
      newsPostId: parsed.data.newsPostId,
    });

    return {
      ok: false,
      message: getSafeServerErrorMessage(error, "No hemos podido eliminar la noticia."),
    };
  }
}
