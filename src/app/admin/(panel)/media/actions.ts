"use server";

import { requireAdminSectionAccess } from "@/server/auth/session";
import {
  getSafeServerErrorMessage,
  logServerError,
} from "@/server/logging/safe-server-log";
import { deleteMediaAsset, updateMediaAssetMetadata } from "@/server/services/admin-media";
import {
  deleteMediaAssetInputSchema,
  updateMediaAssetInputSchema,
  type DeleteMediaAssetInput,
  type UpdateMediaAssetInput,
} from "@/server/validators/admin-media";

type MediaActionResult =
  | {
      ok: true;
      message: string;
      item?: Awaited<ReturnType<typeof updateMediaAssetMetadata>>;
      deletedId?: string;
    }
  | {
      ok: false;
      message: string;
    };

export async function updateMediaAssetAction(
  input: UpdateMediaAssetInput,
): Promise<MediaActionResult> {
  const user = await requireAdminSectionAccess("media");
  const parsed = updateMediaAssetInputSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "No hemos podido validar el recurso.",
    };
  }

  try {
    const item = await updateMediaAssetMetadata(user, parsed.data);

    return {
      ok: true,
      item,
      message: "Media actualizada.",
    };
  } catch (error) {
    logServerError("admin.media.update", error, {
      userId: user.id,
      mediaId: parsed.data.mediaId,
    });

    return {
      ok: false,
      message: getSafeServerErrorMessage(error, "No hemos podido actualizar la media."),
    };
  }
}

export async function deleteMediaAssetAction(
  input: DeleteMediaAssetInput,
): Promise<MediaActionResult> {
  const user = await requireAdminSectionAccess("media");
  const parsed = deleteMediaAssetInputSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "No hemos podido validar el recurso.",
    };
  }

  try {
    await deleteMediaAsset(user, parsed.data.mediaId);

    return {
      ok: true,
      deletedId: parsed.data.mediaId,
      message: "Media eliminada.",
    };
  } catch (error) {
    logServerError("admin.media.delete", error, {
      userId: user.id,
      mediaId: parsed.data.mediaId,
    });

    return {
      ok: false,
      message: getSafeServerErrorMessage(error, "No hemos podido eliminar la media."),
    };
  }
}
