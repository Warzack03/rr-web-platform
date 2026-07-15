import { z } from "zod";
import { adminMediaUsageValues } from "@/lib/admin/media-management";

export const updateMediaAssetInputSchema = z.object({
  mediaId: z.string().trim().regex(/^\d+$/, "No hemos podido identificar el recurso."),
  usage: z.enum(adminMediaUsageValues),
  altText: z.string().trim().max(255, "El texto alternativo no puede superar 255 caracteres."),
});

export const deleteMediaAssetInputSchema = z.object({
  mediaId: z.string().trim().regex(/^\d+$/, "No hemos podido identificar el recurso."),
});

export type UpdateMediaAssetInput = z.infer<typeof updateMediaAssetInputSchema>;
export type DeleteMediaAssetInput = z.infer<typeof deleteMediaAssetInputSchema>;
