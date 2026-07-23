import { randomUUID } from "node:crypto";
import { mkdir, rename, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { MediaType, MediaUsage, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import type { AdminMediaItem, AdminMediaPickerItem, AdminMediaUsage } from "@/lib/contracts/admin";
import {
  adminMediaUsageValues,
  deriveMediaLabelFromPath,
  getAdminMediaUsageFolder,
  getAdminMediaUsageLabel,
  isAdminMediaUsage,
} from "@/lib/admin/media-management";
import {
  hasSvgExtension,
  isSafePublicImageReference,
} from "@/lib/url-safety";
import type { AuthenticatedAdmin } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";

const MAX_MEDIA_UPLOAD_BYTES = 8 * 1024 * 1024;
const allowedImageMimeTypes = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/avif",
]);

const allowedExtensionsByMimeType = {
  "image/png": new Set(["png"]),
  "image/jpeg": new Set(["jpeg", "jpg"]),
  "image/webp": new Set(["webp"]),
  "image/avif": new Set(["avif"]),
} satisfies Record<string, Set<string>>;

type MediaAssetWithRelations = Prisma.MediaAssetGetPayload<{
  select: {
    id: true;
    usage: true;
    storagePath: true;
    publicUrl: true;
    altText: true;
    mimeType: true;
    sizeBytes: true;
    width: true;
    height: true;
    createdAt: true;
    uploadedBy: {
      select: {
        displayName: true;
      };
    };
    _count: {
      select: {
        playerPhotos: true;
        playerPremiumCards: true;
        seasonTeamLogos: true;
        seasonTeamBanners: true;
        teamCoachPhotos: true;
        opponentLogos: true;
        newsCovers: true;
      };
    };
  };
}>;

function toPrismaMediaUsage(usage: AdminMediaUsage): MediaUsage {
  return MediaUsage[usage];
}

function formatCreatedAt(date: Date) {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function buildReferenceSummary(counts: MediaAssetWithRelations["_count"]) {
  const summary: string[] = [];

  if (counts.playerPhotos > 0) {
    summary.push(
      counts.playerPhotos === 1
        ? "1 ficha de jugador"
        : `${counts.playerPhotos} fichas de jugador`,
    );
  }

  if (counts.playerPremiumCards > 0) {
    summary.push(
      counts.playerPremiumCards === 1
        ? "1 cromo premium"
        : `${counts.playerPremiumCards} cromos premium`,
    );
  }

  if (counts.seasonTeamLogos > 0) {
    summary.push(
      counts.seasonTeamLogos === 1
        ? "1 logo de equipo"
        : `${counts.seasonTeamLogos} logos de equipo`,
    );
  }

  if (counts.seasonTeamBanners > 0) {
    summary.push(
      counts.seasonTeamBanners === 1
        ? "1 banner de equipo"
        : `${counts.seasonTeamBanners} banners de equipo`,
    );
  }

  if (counts.teamCoachPhotos > 0) {
    summary.push(
      counts.teamCoachPhotos === 1
        ? "1 foto de cuerpo tecnico"
        : `${counts.teamCoachPhotos} fotos de cuerpo tecnico`,
    );
  }

  if (counts.opponentLogos > 0) {
    summary.push(
      counts.opponentLogos === 1
        ? "1 partido"
        : `${counts.opponentLogos} partidos`,
    );
  }

  if (counts.newsCovers > 0) {
    summary.push(
      counts.newsCovers === 1 ? "1 noticia" : `${counts.newsCovers} noticias`,
    );
  }

  return summary;
}

function getReferenceCount(counts: MediaAssetWithRelations["_count"]) {
  return (
    counts.playerPhotos +
    counts.playerPremiumCards +
    counts.seasonTeamLogos +
    counts.seasonTeamBanners +
    counts.teamCoachPhotos +
    counts.opponentLogos +
    counts.newsCovers
  );
}

function mapMediaAssetToAdminItem(asset: MediaAssetWithRelations): AdminMediaItem {
  const usage = asset.usage as AdminMediaUsage;
  const label = deriveMediaLabelFromPath(asset.storagePath ?? asset.publicUrl);
  const referenceSummary = buildReferenceSummary(asset._count);
  const referenceCount = getReferenceCount(asset._count);

  return {
    id: asset.id.toString(),
    label,
    usage,
    usageLabel: getAdminMediaUsageLabel(usage),
    publicUrl: asset.publicUrl,
    altText: asset.altText?.trim() || label,
    mimeType: asset.mimeType ?? undefined,
    sizeBytes: asset.sizeBytes ?? undefined,
    width: asset.width ?? undefined,
    height: asset.height ?? undefined,
    createdAtIso: asset.createdAt.toISOString(),
    createdAtLabel: formatCreatedAt(asset.createdAt),
    uploadedByName: asset.uploadedBy?.displayName ?? "Sistema",
    storagePath: asset.storagePath ?? undefined,
    source: asset.storagePath ? "local" : "external",
    referenceCount,
    referenceSummary,
    canDelete: referenceCount === 0,
  };
}

function sanitizeBaseName(value: string) {
  const normalized = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized || "media";
}

function getAllowedExtensionsForMimeType(mimeType: string) {
  return allowedExtensionsByMimeType[mimeType as keyof typeof allowedExtensionsByMimeType];
}

function resolveExtension(fileName: string, mimeType: string) {
  const explicitExtension = path.extname(fileName).replace(".", "").toLowerCase();
  const allowedExtensions = getAllowedExtensionsForMimeType(mimeType);

  if (!allowedExtensions) {
    throw new Error("Tipo de imagen no admitido.");
  }

  if (explicitExtension) {
    if (!allowedExtensions.has(explicitExtension)) {
      throw new Error("La extension del archivo no coincide con el tipo de imagen.");
    }

    return explicitExtension === "jpg" ? "jpeg" : explicitExtension;
  }

  const [firstAllowedExtension] = Array.from(allowedExtensions);

  if (!firstAllowedExtension) {
    throw new Error("Tipo de imagen no admitido.");
  }

  return firstAllowedExtension === "jpg" ? "jpeg" : firstAllowedExtension;
}

function bufferStartsWith(buffer: Buffer, signature: number[]) {
  return signature.every((byte, index) => buffer[index] === byte);
}

function bufferAscii(buffer: Buffer, start: number, end: number) {
  return buffer.subarray(start, end).toString("ascii");
}

function hasExpectedFileSignature(mimeType: string, buffer: Buffer) {
  if (mimeType === "image/png") {
    return bufferStartsWith(buffer, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  }

  if (mimeType === "image/jpeg") {
    return bufferStartsWith(buffer, [0xff, 0xd8, 0xff]);
  }

  if (mimeType === "image/webp") {
    return (
      buffer.length >= 12 &&
      bufferAscii(buffer, 0, 4) === "RIFF" &&
      bufferAscii(buffer, 8, 12) === "WEBP"
    );
  }

  if (mimeType === "image/avif") {
    return (
      buffer.length >= 16 &&
      bufferAscii(buffer, 4, 8) === "ftyp" &&
      buffer.subarray(8, Math.min(buffer.length, 40)).toString("ascii").includes("avif")
    );
  }

  return false;
}

function isUnsafeSvgMediaReference(input: {
  publicUrl: string;
  storagePath?: string | null;
  mimeType?: string | null;
}) {
  return (
    input.mimeType?.toLowerCase() === "image/svg+xml" ||
    hasSvgExtension(input.publicUrl) ||
    Boolean(input.storagePath && hasSvgExtension(input.storagePath))
  );
}

function parseOptionalDimension(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return undefined;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

function normalizeAltText(value: string | null | undefined, fallbackLabel: string) {
  const normalized = value?.trim();
  return normalized && normalized.length > 0 ? normalized : fallbackLabel;
}

function resolveStorageAbsolutePath(storagePath: string) {
  const absolutePath = path.resolve(/* turbopackIgnore: true */ process.cwd(), storagePath);
  const mediaRoot = path.resolve(
    /* turbopackIgnore: true */ process.cwd(),
    "public",
    "media",
  );

  if (!absolutePath.startsWith(mediaRoot)) {
    throw new Error("Ruta de media fuera del directorio permitido.");
  }

  return absolutePath;
}

function buildRelativeStoragePath(
  usage: AdminMediaUsage,
  fileName: string,
  dateParts?: { year: string; month: string },
) {
  const now = new Date();
  const year = dateParts?.year ?? `${now.getFullYear()}`;
  const month = dateParts?.month ?? `${String(now.getMonth() + 1).padStart(2, "0")}`;

  return path
    .join(
      "public",
      "media",
      "uploads",
      getAdminMediaUsageFolder(usage),
      year,
      month,
      fileName,
    )
    .replace(/\\/g, "/");
}

function extractStorageDateParts(storagePath: string) {
  const match = storagePath.match(/\/(\d{4})\/(\d{2})\/[^/]+$/);

  if (!match) {
    return undefined;
  }

  return {
    year: match[1],
    month: match[2],
  };
}

async function fetchMediaAssetForMutation(id: bigint) {
  return prisma.mediaAsset.findFirst({
    where: {
      id,
      deletedAt: null,
    },
    select: {
      id: true,
      usage: true,
      storagePath: true,
      publicUrl: true,
      _count: {
        select: {
          playerPhotos: true,
          playerPremiumCards: true,
          seasonTeamLogos: true,
          seasonTeamBanners: true,
          teamCoachPhotos: true,
          opponentLogos: true,
          newsCovers: true,
        },
      },
    },
  });
}

export async function getAdminMediaScreenData(user: AuthenticatedAdmin) {
  void user;

  const assets = await prisma.mediaAsset.findMany({
    where: {
      deletedAt: null,
      type: MediaType.IMAGE,
      usage: {
        in: adminMediaUsageValues.map((usage) => toPrismaMediaUsage(usage)),
      },
    },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    select: {
      id: true,
      usage: true,
      storagePath: true,
      publicUrl: true,
      altText: true,
      mimeType: true,
      sizeBytes: true,
      width: true,
      height: true,
      createdAt: true,
      uploadedBy: {
        select: {
          displayName: true,
        },
      },
      _count: {
        select: {
          playerPhotos: true,
          playerPremiumCards: true,
          seasonTeamLogos: true,
          seasonTeamBanners: true,
          teamCoachPhotos: true,
          opponentLogos: true,
          newsCovers: true,
        },
      },
    },
  });

  return {
    items: assets.map(mapMediaAssetToAdminItem),
  };
}

export async function getAdminMediaPickerOptions(
  usages?: AdminMediaUsage[],
): Promise<AdminMediaPickerItem[]> {
  const assets = await prisma.mediaAsset.findMany({
    where: {
      deletedAt: null,
      type: MediaType.IMAGE,
      ...(usages && usages.length > 0
        ? {
            usage: {
              in: usages.map((usage) => toPrismaMediaUsage(usage)),
            },
          }
        : {}),
    },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    select: {
      id: true,
      usage: true,
      storagePath: true,
      publicUrl: true,
      altText: true,
      mimeType: true,
      sizeBytes: true,
      width: true,
      height: true,
    },
  });

  return assets.filter((asset) => !isUnsafeSvgMediaReference(asset)).map((asset) => {
    const usage = asset.usage as AdminMediaUsage;
    const label = deriveMediaLabelFromPath(asset.storagePath ?? asset.publicUrl);

    return {
      id: asset.id.toString(),
      label,
      usage,
      usageLabel: getAdminMediaUsageLabel(usage),
      publicUrl: asset.publicUrl,
      altText: asset.altText?.trim() || label,
      mimeType: asset.mimeType ?? undefined,
      sizeBytes: asset.sizeBytes ?? undefined,
      width: asset.width ?? undefined,
      height: asset.height ?? undefined,
    };
  });
}

export async function resolveMediaAssetId(
  input: {
    mediaId?: string | null;
    publicUrl?: string | null;
    usage: MediaUsage;
    uploadedById: bigint;
  },
  tx: Prisma.TransactionClient,
) {
  const normalizedMediaId = input.mediaId?.trim() ?? "";

  if (normalizedMediaId) {
    if (!/^\d+$/.test(normalizedMediaId)) {
      throw new Error("No hemos podido identificar el recurso seleccionado.");
    }

    const media = await tx.mediaAsset.findFirst({
      where: {
        id: BigInt(normalizedMediaId),
        deletedAt: null,
        usage: input.usage,
      },
      select: {
        id: true,
        publicUrl: true,
        storagePath: true,
        mimeType: true,
      },
    });

    if (!media) {
      throw new Error("El recurso seleccionado ya no esta disponible.");
    }

    if (isUnsafeSvgMediaReference(media)) {
      throw new Error("Los SVG originales no se pueden usar como recurso publico.");
    }

    return media.id;
  }

  const normalizedUrl = input.publicUrl?.trim() ?? "";

  if (!normalizedUrl) {
    return null;
  }

  if (!isSafePublicImageReference(normalizedUrl)) {
    throw new Error("Introduce una URL o ruta publica de imagen valida. No se admiten SVG.");
  }

  const existing = await tx.mediaAsset.findFirst({
    where: {
      deletedAt: null,
      publicUrl: normalizedUrl,
      usage: input.usage,
    },
    select: {
      id: true,
      publicUrl: true,
      storagePath: true,
      mimeType: true,
    },
    orderBy: { id: "desc" },
  });

  if (existing) {
    if (isUnsafeSvgMediaReference(existing)) {
      throw new Error("Los SVG originales no se pueden usar como recurso publico.");
    }

    return existing.id;
  }

  const created = await tx.mediaAsset.create({
    data: {
      type: MediaType.IMAGE,
      usage: input.usage,
      publicUrl: normalizedUrl,
      uploadedById: input.uploadedById,
    },
    select: {
      id: true,
    },
  });

  return created.id;
}

export async function storeUploadedMediaAsset(
  user: AuthenticatedAdmin,
  formData: FormData,
) {
  const usageValue = formData.get("usage");

  if (typeof usageValue !== "string" || !isAdminMediaUsage(usageValue)) {
    throw new Error("Selecciona un uso valido para la imagen.");
  }

  const file = formData.get("file");

  if (!(file instanceof File)) {
    throw new Error("No hemos recibido ningun archivo.");
  }

  if (!allowedImageMimeTypes.has(file.type)) {
    throw new Error("Solo admitimos PNG, JPEG, WEBP o AVIF.");
  }

  if (file.size <= 0) {
    throw new Error("El archivo esta vacio.");
  }

  if (file.size > MAX_MEDIA_UPLOAD_BYTES) {
    throw new Error("La imagen supera el limite de 8 MB.");
  }

  const fileBuffer = Buffer.from(await file.arrayBuffer());

  if (!hasExpectedFileSignature(file.type, fileBuffer)) {
    throw new Error("El contenido del archivo no coincide con el tipo de imagen indicado.");
  }

  const extension = resolveExtension(file.name, file.type);
  const safeBaseName = sanitizeBaseName(file.name.replace(/\.[^/.]+$/, ""));
  const fileName = `${safeBaseName}-${randomUUID()}.${extension}`;
  const relativeStoragePath = buildRelativeStoragePath(usageValue, fileName);
  const absoluteStoragePath = resolveStorageAbsolutePath(relativeStoragePath);

  await mkdir(path.dirname(absoluteStoragePath), { recursive: true });
  await writeFile(absoluteStoragePath, fileBuffer);

  const fallbackLabel = deriveMediaLabelFromPath(file.name);
  const created = await prisma.mediaAsset.create({
    data: {
      type: MediaType.IMAGE,
      usage: toPrismaMediaUsage(usageValue),
      storagePath: relativeStoragePath,
      publicUrl: `/${relativeStoragePath.replace(/^public\//, "")}`,
      altText: normalizeAltText(
        typeof formData.get("altText") === "string"
          ? (formData.get("altText") as string)
          : null,
        fallbackLabel,
      ),
      mimeType: file.type,
      sizeBytes: file.size,
      width: parseOptionalDimension(formData.get("width")) ?? null,
      height: parseOptionalDimension(formData.get("height")) ?? null,
      uploadedById: user.id,
    },
    select: {
      id: true,
      usage: true,
      storagePath: true,
      publicUrl: true,
      altText: true,
      mimeType: true,
      sizeBytes: true,
      width: true,
      height: true,
      createdAt: true,
      uploadedBy: {
        select: {
          displayName: true,
        },
      },
      _count: {
        select: {
          playerPhotos: true,
          playerPremiumCards: true,
          seasonTeamLogos: true,
          seasonTeamBanners: true,
          teamCoachPhotos: true,
          opponentLogos: true,
          newsCovers: true,
        },
      },
    },
  });

  revalidatePath("/admin/media");

  return mapMediaAssetToAdminItem(created);
}

export async function updateMediaAssetMetadata(
  user: AuthenticatedAdmin,
  input: {
    mediaId: string;
    usage: AdminMediaUsage;
    altText: string;
  },
) {
  if (!/^\d+$/.test(input.mediaId)) {
    throw new Error("No hemos podido identificar el recurso.");
  }

  const existing = await fetchMediaAssetForMutation(BigInt(input.mediaId));

  if (!existing) {
    throw new Error("El recurso ya no esta disponible.");
  }

  const referenceCount = getReferenceCount(existing._count);
  const nextUsage = toPrismaMediaUsage(input.usage);

  if (referenceCount > 0 && existing.usage !== nextUsage) {
    throw new Error("No puedes cambiar el uso de un recurso que ya esta enlazado.");
  }

  let nextStoragePath = existing.storagePath ?? null;
  let nextPublicUrl = existing.publicUrl;

  if (
    referenceCount === 0 &&
    existing.storagePath &&
    existing.usage !== nextUsage
  ) {
    const currentFileName = path.basename(existing.storagePath);
    const movedStoragePath = buildRelativeStoragePath(
      input.usage,
      currentFileName,
      extractStorageDateParts(existing.storagePath),
    );

    if (movedStoragePath !== existing.storagePath) {
      const currentAbsolutePath = resolveStorageAbsolutePath(existing.storagePath);
      const nextAbsolutePath = resolveStorageAbsolutePath(movedStoragePath);

      await mkdir(path.dirname(nextAbsolutePath), { recursive: true });
      await rename(currentAbsolutePath, nextAbsolutePath);

      nextStoragePath = movedStoragePath;
      nextPublicUrl = `/${movedStoragePath.replace(/^public\//, "")}`;
    }
  }

  const updated = await prisma.mediaAsset.update({
    where: {
      id: existing.id,
    },
    data: {
      usage: nextUsage,
      storagePath: nextStoragePath,
      publicUrl: nextPublicUrl,
      altText: normalizeAltText(
        input.altText,
        deriveMediaLabelFromPath(nextStoragePath ?? nextPublicUrl),
      ),
      uploadedById: user.id,
    },
    select: {
      id: true,
      usage: true,
      storagePath: true,
      publicUrl: true,
      altText: true,
      mimeType: true,
      sizeBytes: true,
      width: true,
      height: true,
      createdAt: true,
      uploadedBy: {
        select: {
          displayName: true,
        },
      },
      _count: {
        select: {
          playerPhotos: true,
          playerPremiumCards: true,
          seasonTeamLogos: true,
          seasonTeamBanners: true,
          teamCoachPhotos: true,
          opponentLogos: true,
          newsCovers: true,
        },
      },
    },
  });

  revalidatePath("/admin/media");

  return mapMediaAssetToAdminItem(updated);
}

export async function deleteMediaAsset(user: AuthenticatedAdmin, mediaId: string) {
  if (!/^\d+$/.test(mediaId)) {
    throw new Error("No hemos podido identificar el recurso.");
  }

  const existing = await fetchMediaAssetForMutation(BigInt(mediaId));

  if (!existing) {
    throw new Error("El recurso ya no esta disponible.");
  }

  const referenceCount = getReferenceCount(existing._count);

  if (referenceCount > 0) {
    throw new Error("Este recurso sigue en uso y no se puede eliminar todavia.");
  }

  await prisma.mediaAsset.update({
    where: {
      id: existing.id,
    },
    data: {
      deletedAt: new Date(),
      uploadedById: user.id,
    },
  });

  if (existing.storagePath) {
    try {
      await unlink(resolveStorageAbsolutePath(existing.storagePath));
    } catch (error) {
      const ioError = error as NodeJS.ErrnoException;

      if (ioError.code !== "ENOENT") {
        throw error;
      }
    }
  }

  revalidatePath("/admin/media");
}
