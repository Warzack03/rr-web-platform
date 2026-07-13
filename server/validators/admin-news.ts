import { z } from "zod";
import {
  adminNewsStatusValues,
  slugifyNewsTitle,
} from "@/lib/admin/news-management";

const mediaReferenceSchema = z
  .string()
  .trim()
  .refine(
    (value) => value === "" || value.startsWith("/") || /^https?:\/\//.test(value),
    "Introduce una ruta publica valida para la portada.",
  );

export const saveNewsPostInputSchema = z
  .object({
    newsPostId: z.string().trim().optional(),
    title: z.string().trim().min(1, "Introduce un titulo.").max(180),
    slug: z.string().trim().max(190).optional().or(z.literal("")),
    excerpt: z.string().trim().min(1, "Introduce un extracto.").max(300),
    bodyMarkdown: z.string().trim().max(20000, "El contenido es demasiado largo."),
    externalVideoUrl: z.string().trim().url("Introduce una URL valida.").optional().or(z.literal("")),
    coverMediaId: z.string().trim().regex(/^\d+$/).optional().or(z.literal("")),
    coverUrl: mediaReferenceSchema.or(z.literal("")),
    status: z.enum(adminNewsStatusValues),
    featured: z.boolean(),
    publishedAt: z.string().trim().optional().or(z.literal("")),
    relatedTeamIds: z.array(z.string().trim().regex(/^\d+$/)).default([]),
  })
  .superRefine((value, ctx) => {
    const hasBody = value.bodyMarkdown.trim().length > 0;
    const hasVideo = (value.externalVideoUrl ?? "").trim().length > 0;
    const publishedAt = value.publishedAt ?? "";

    if (!hasBody && !hasVideo) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Anade contenido o un video externo.",
        path: ["bodyMarkdown"],
      });
    }

    if (slugifyNewsTitle(value.title).length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "El titulo debe permitir generar un slug valido.",
        path: ["title"],
      });
    }

    if (value.status === "PUBLISHED" && publishedAt.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Define la fecha de publicacion.",
        path: ["publishedAt"],
      });
    }

    if (publishedAt.trim().length > 0 && Number.isNaN(Date.parse(publishedAt))) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "La fecha de publicacion no es valida.",
        path: ["publishedAt"],
      });
    }
  });

export type SaveNewsPostInput = z.infer<typeof saveNewsPostInputSchema>;

export const deleteNewsPostInputSchema = z.object({
  newsPostId: z.string().trim().regex(/^\d+$/, "No hemos podido identificar la noticia."),
});

export type DeleteNewsPostInput = z.infer<typeof deleteNewsPostInputSchema>;
