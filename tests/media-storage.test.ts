import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, it } from "node:test";

import {
  getMediaStorageRoot,
  resolveMediaStorageAbsolutePath,
} from "@/server/services/media-storage";

const originalUploadDir = process.env.UPLOAD_DIR;
let temporaryRoots: string[] = [];

afterEach(async () => {
  if (originalUploadDir === undefined) {
    delete process.env.UPLOAD_DIR;
  } else {
    process.env.UPLOAD_DIR = originalUploadDir;
  }

  await Promise.all(
    temporaryRoots.map((temporaryRoot) =>
      rm(temporaryRoot, { recursive: true, force: true }),
    ),
  );
  temporaryRoots = [];
});

describe("media storage", () => {
  it("uses public/media as default logical media root", () => {
    delete process.env.UPLOAD_DIR;

    assert.equal(
      getMediaStorageRoot(),
      path.resolve(process.cwd(), "public", "media"),
    );
    assert.equal(
      resolveMediaStorageAbsolutePath("public/media/uploads/general/2026/07/logo.webp"),
      path.resolve(process.cwd(), "public", "media", "uploads", "general", "2026", "07", "logo.webp"),
    );
  });

  it("can store uploaded media under a configured persistent root", async () => {
    const temporaryRoot = await mkdtemp(path.join(tmpdir(), "rr-media-"));
    temporaryRoots.push(temporaryRoot);
    process.env.UPLOAD_DIR = temporaryRoot;

    assert.equal(getMediaStorageRoot(), temporaryRoot);
    assert.equal(
      resolveMediaStorageAbsolutePath("public/media/uploads/news/covers/2026/07/cover.webp"),
      path.join(temporaryRoot, "uploads", "news", "covers", "2026", "07", "cover.webp"),
    );
  });

  it("rejects paths outside the logical media directory", () => {
    assert.throws(
      () => resolveMediaStorageAbsolutePath("public/media/../secret.webp"),
      /fuera del directorio permitido/i,
    );
    assert.throws(
      () => resolveMediaStorageAbsolutePath("storage/media-trash/secret.webp"),
      /fuera del directorio permitido/i,
    );
  });
});
