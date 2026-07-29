import { readFile } from "node:fs/promises";

import {
  resolveMediaStorageAbsolutePath,
  resolvePublicMediaAbsolutePath,
} from "@/server/services/media-storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const imageContentTypes = new Map<string, string>([
  ["avif", "image/avif"],
  ["jpeg", "image/jpeg"],
  ["jpg", "image/jpeg"],
  ["png", "image/png"],
  ["webp", "image/webp"],
]);

function getImageContentType(fileName: string) {
  const extension = fileName.split(".").pop()?.toLowerCase() ?? "";
  return imageContentTypes.get(extension);
}

async function readMediaFile(storagePath: string) {
  const primaryPath = resolveMediaStorageAbsolutePath(storagePath);

  try {
    return await readFile(primaryPath);
  } catch (error) {
    const ioError = error as NodeJS.ErrnoException;

    if (ioError.code !== "ENOENT") {
      throw error;
    }
  }

  const fallbackPath = resolvePublicMediaAbsolutePath(storagePath);
  return readFile(fallbackPath);
}

export async function GET(
  _request: Request,
  context: {
    params: Promise<{
      mediaPath: string[];
    }>;
  },
) {
  const { mediaPath } = await context.params;
  const normalizedPath = mediaPath.join("/");
  const contentType = getImageContentType(normalizedPath);

  if (!contentType) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const fileBuffer = await readMediaFile(`public/media/${normalizedPath}`);

    return new Response(new Uint8Array(fileBuffer), {
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Length": `${fileBuffer.byteLength}`,
        "Content-Type": contentType,
      },
    });
  } catch (error) {
    const ioError = error as NodeJS.ErrnoException;

    if (
      ioError.code === "ENOENT" ||
      (error instanceof Error && error.message.includes("fuera del directorio"))
    ) {
      return new Response("Not found", { status: 404 });
    }

    throw error;
  }
}
