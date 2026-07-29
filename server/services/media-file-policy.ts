import path from "node:path";
import type { AdminMediaUsage } from "@/lib/admin/media-management";

export const MAX_MEDIA_UPLOAD_BYTES = 8 * 1024 * 1024;
export const MAX_MEDIA_MULTIPART_BODY_BYTES = 10 * 1024 * 1024;

const MAX_INPUT_PIXELS = 36_000_000;

export const allowedImageMimeTypes = new Set([
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

type ImageDimensions = {
  width: number;
  height: number;
  hasAlpha?: boolean;
};

type MediaUsageConstraint = {
  minWidth: number;
  minHeight: number;
  maxWidth: number;
  maxHeight: number;
  minAspectRatio?: number;
  maxAspectRatio?: number;
};

type PreparedImageUpload = {
  buffer: Buffer;
  mimeType: string;
  extension: string;
  sizeBytes: number;
  width: number;
  height: number;
  optimizedToWebp: boolean;
};

export function getMediaUsageConstraint(usage: AdminMediaUsage): MediaUsageConstraint {
  switch (usage) {
    case "PLAYER_PHOTO":
      return {
        minWidth: 240,
        minHeight: 240,
        maxWidth: 5000,
        maxHeight: 7000,
        minAspectRatio: 0.45,
        maxAspectRatio: 1.8,
      };
    case "PLAYER_CARD":
      return {
        minWidth: 320,
        minHeight: 480,
        maxWidth: 5000,
        maxHeight: 7000,
        minAspectRatio: 0.42,
        maxAspectRatio: 1.2,
      };
    case "TEAM_LOGO":
    case "OPPONENT_LOGO":
      return {
        minWidth: 64,
        minHeight: 64,
        maxWidth: 2048,
        maxHeight: 2048,
        minAspectRatio: 0.5,
        maxAspectRatio: 2,
      };
    case "TEAM_BANNER":
      return {
        minWidth: 800,
        minHeight: 260,
        maxWidth: 7000,
        maxHeight: 3500,
        minAspectRatio: 1.5,
        maxAspectRatio: 5,
      };
    case "NEWS_COVER":
      return {
        minWidth: 720,
        minHeight: 360,
        maxWidth: 7000,
        maxHeight: 5000,
        minAspectRatio: 1,
        maxAspectRatio: 3,
      };
    case "OTHER":
      return {
        minWidth: 64,
        minHeight: 64,
        maxWidth: 7000,
        maxHeight: 7000,
      };
  }
}

function getAllowedExtensionsForMimeType(mimeType: string) {
  return allowedExtensionsByMimeType[mimeType as keyof typeof allowedExtensionsByMimeType];
}

export function resolveImageExtension(fileName: string, mimeType: string) {
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

export function hasExpectedImageSignature(mimeType: string, buffer: Buffer) {
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

async function readImageDimensionsWithSharp(buffer: Buffer): Promise<ImageDimensions | null> {
  try {
    const sharp = (await import("sharp")).default;
    const metadata = await sharp(buffer, {
      animated: false,
      limitInputPixels: MAX_INPUT_PIXELS,
    }).metadata();

    if (!metadata.width || !metadata.height) {
      return null;
    }

    return {
      width: metadata.width,
      height: metadata.height,
      hasAlpha: metadata.hasAlpha,
    };
  } catch {
    return null;
  }
}

function readPngDimensions(buffer: Buffer): ImageDimensions | null {
  if (!hasExpectedImageSignature("image/png", buffer) || buffer.length < 33) {
    return null;
  }

  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
    hasAlpha: [4, 6].includes(buffer[25]),
  };
}

function readJpegDimensions(buffer: Buffer): ImageDimensions | null {
  if (!hasExpectedImageSignature("image/jpeg", buffer)) {
    return null;
  }

  let offset = 2;

  while (offset < buffer.length) {
    if (buffer[offset] !== 0xff) {
      return null;
    }

    const marker = buffer[offset + 1];
    const length = buffer.readUInt16BE(offset + 2);

    if (length < 2) {
      return null;
    }

    const isStartOfFrame =
      marker >= 0xc0 &&
      marker <= 0xcf &&
      ![0xc4, 0xc8, 0xcc].includes(marker);

    if (isStartOfFrame) {
      return {
        height: buffer.readUInt16BE(offset + 5),
        width: buffer.readUInt16BE(offset + 7),
        hasAlpha: false,
      };
    }

    offset += 2 + length;
  }

  return null;
}

function readWebpDimensions(buffer: Buffer): ImageDimensions | null {
  if (!hasExpectedImageSignature("image/webp", buffer) || buffer.length < 30) {
    return null;
  }

  const format = bufferAscii(buffer, 12, 16);

  if (format === "VP8X" && buffer.length >= 30) {
    return {
      width: 1 + buffer.readUIntLE(24, 3),
      height: 1 + buffer.readUIntLE(27, 3),
      hasAlpha: Boolean(buffer[20] & 0x10),
    };
  }

  if (format === "VP8 " && buffer.length >= 30) {
    return {
      width: buffer.readUInt16LE(26) & 0x3fff,
      height: buffer.readUInt16LE(28) & 0x3fff,
      hasAlpha: false,
    };
  }

  if (format === "VP8L" && buffer.length >= 25) {
    const bits = buffer.readUInt32LE(21);

    return {
      width: (bits & 0x3fff) + 1,
      height: ((bits >> 14) & 0x3fff) + 1,
      hasAlpha: true,
    };
  }

  return null;
}

async function readImageDimensions(mimeType: string, buffer: Buffer) {
  const sharpDimensions = await readImageDimensionsWithSharp(buffer);

  if (sharpDimensions) {
    return sharpDimensions;
  }

  if (mimeType === "image/png") {
    return readPngDimensions(buffer);
  }

  if (mimeType === "image/jpeg") {
    return readJpegDimensions(buffer);
  }

  if (mimeType === "image/webp") {
    return readWebpDimensions(buffer);
  }

  return null;
}

function validateDimensions(usage: AdminMediaUsage, dimensions: ImageDimensions) {
  const constraint = getMediaUsageConstraint(usage);
  const aspectRatio = dimensions.width / dimensions.height;

  if (
    dimensions.width < constraint.minWidth ||
    dimensions.height < constraint.minHeight
  ) {
    throw new Error("La imagen es demasiado pequeña para ese uso.");
  }

  if (
    dimensions.width > constraint.maxWidth ||
    dimensions.height > constraint.maxHeight
  ) {
    throw new Error("La imagen supera la resolucion permitida para ese uso.");
  }

  if (
    (constraint.minAspectRatio && aspectRatio < constraint.minAspectRatio) ||
    (constraint.maxAspectRatio && aspectRatio > constraint.maxAspectRatio)
  ) {
    throw new Error("La proporcion de la imagen no encaja con ese uso.");
  }
}

async function convertToWebpIfHelpful(
  buffer: Buffer,
  mimeType: string,
  dimensions: ImageDimensions,
) {
  if (!["image/png", "image/jpeg"].includes(mimeType)) {
    return null;
  }

  try {
    const sharp = (await import("sharp")).default;
    const output = await sharp(buffer, {
      animated: false,
      limitInputPixels: MAX_INPUT_PIXELS,
    })
      .rotate()
      .webp({
        quality: 84,
        nearLossless: mimeType === "image/png" && dimensions.hasAlpha,
      })
      .toBuffer();

    if (output.length >= buffer.length) {
      return null;
    }

    const convertedDimensions = await readImageDimensions("image/webp", output);

    if (!convertedDimensions) {
      return null;
    }

    return {
      buffer: output,
      dimensions: convertedDimensions,
    };
  } catch {
    return null;
  }
}

export async function prepareImageUpload(input: {
  buffer: Buffer;
  fileName: string;
  mimeType: string;
  usage: AdminMediaUsage;
}): Promise<PreparedImageUpload> {
  const originalExtension = resolveImageExtension(input.fileName, input.mimeType);

  if (!hasExpectedImageSignature(input.mimeType, input.buffer)) {
    throw new Error("El contenido del archivo no coincide con el tipo de imagen indicado.");
  }

  const dimensions = await readImageDimensions(input.mimeType, input.buffer);

  if (!dimensions) {
    throw new Error("No hemos podido verificar las dimensiones de la imagen.");
  }

  validateDimensions(input.usage, dimensions);

  const converted = await convertToWebpIfHelpful(
    input.buffer,
    input.mimeType,
    dimensions,
  );

  if (converted) {
    validateDimensions(input.usage, converted.dimensions);

    return {
      buffer: converted.buffer,
      mimeType: "image/webp",
      extension: "webp",
      sizeBytes: converted.buffer.length,
      width: converted.dimensions.width,
      height: converted.dimensions.height,
      optimizedToWebp: true,
    };
  }

  return {
    buffer: input.buffer,
    mimeType: input.mimeType,
    extension: originalExtension,
    sizeBytes: input.buffer.length,
    width: dimensions.width,
    height: dimensions.height,
    optimizedToWebp: false,
  };
}
