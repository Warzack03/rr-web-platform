import path from "node:path";

const DEFAULT_MEDIA_STORAGE_ROOT = path.join("public", "media");
const DEFAULT_MEDIA_TRASH_ROOT = path.join("storage", "media-trash");
const LOGICAL_MEDIA_PREFIX = "public/media/";

function normalizeConfiguredPath(value: string | undefined, fallback: string) {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : fallback;
}

function resolveFromCwd(value: string) {
  return path.isAbsolute(value)
    ? path.resolve(value)
    : path.resolve(/* turbopackIgnore: true */ process.cwd(), value);
}

function assertInsideRoot(absolutePath: string, absoluteRoot: string, errorMessage: string) {
  const relative = path.relative(absoluteRoot, absolutePath);

  if (
    relative === "" ||
    (!relative.startsWith("..") && !path.isAbsolute(relative))
  ) {
    return;
  }

  throw new Error(errorMessage);
}

function stripLogicalMediaPrefix(storagePath: string) {
  const normalizedStoragePath = storagePath.replace(/\\/g, "/");

  if (!normalizedStoragePath.startsWith(LOGICAL_MEDIA_PREFIX)) {
    throw new Error("Ruta de media fuera del directorio permitido.");
  }

  const relativeMediaPath = normalizedStoragePath.slice(LOGICAL_MEDIA_PREFIX.length);

  if (
    relativeMediaPath.length === 0 ||
    relativeMediaPath.startsWith("/") ||
    relativeMediaPath.includes("../") ||
    relativeMediaPath.includes("..\\") ||
    relativeMediaPath === ".."
  ) {
    throw new Error("Ruta de media fuera del directorio permitido.");
  }

  return relativeMediaPath;
}

export function getMediaStorageRoot() {
  return resolveFromCwd(
    normalizeConfiguredPath(process.env.UPLOAD_DIR, DEFAULT_MEDIA_STORAGE_ROOT),
  );
}

export function getPublicMediaRoot() {
  return resolveFromCwd(DEFAULT_MEDIA_STORAGE_ROOT);
}

export function getMediaTrashRoot() {
  return resolveFromCwd(DEFAULT_MEDIA_TRASH_ROOT);
}

export function resolveMediaStorageAbsolutePath(storagePath: string) {
  const relativeMediaPath = stripLogicalMediaPrefix(storagePath);
  const mediaRoot = getMediaStorageRoot();
  const absolutePath = path.resolve(mediaRoot, relativeMediaPath);

  assertInsideRoot(
    absolutePath,
    mediaRoot,
    "Ruta de media fuera del directorio permitido.",
  );

  return absolutePath;
}

export function resolvePublicMediaAbsolutePath(storagePath: string) {
  const relativeMediaPath = stripLogicalMediaPrefix(storagePath);
  const mediaRoot = getPublicMediaRoot();
  const absolutePath = path.resolve(mediaRoot, relativeMediaPath);

  assertInsideRoot(
    absolutePath,
    mediaRoot,
    "Ruta de media fuera del directorio permitido.",
  );

  return absolutePath;
}

export function resolveMediaTrashAbsolutePath(storagePath: string) {
  const relativeMediaPath = stripLogicalMediaPrefix(storagePath);
  const trashRoot = getMediaTrashRoot();
  const absolutePath = path.resolve(trashRoot, relativeMediaPath);

  assertInsideRoot(
    absolutePath,
    trashRoot,
    "Ruta de papelera fuera del directorio permitido.",
  );

  return absolutePath;
}
