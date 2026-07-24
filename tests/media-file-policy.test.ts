import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  allowedImageMimeTypes,
  getMediaUsageConstraint,
  hasExpectedImageSignature,
  prepareImageUpload,
  resolveImageExtension,
} from "@/server/services/media-file-policy";

function makePngHeader(width: number, height: number, colorType = 6) {
  const buffer = Buffer.alloc(33);

  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]).copy(buffer, 0);
  buffer.writeUInt32BE(13, 8);
  Buffer.from("IHDR").copy(buffer, 12);
  buffer.writeUInt32BE(width, 16);
  buffer.writeUInt32BE(height, 20);
  buffer[24] = 8;
  buffer[25] = colorType;

  return buffer;
}

function makeJpegHeader(width: number, height: number) {
  const buffer = Buffer.alloc(21);

  Buffer.from([0xff, 0xd8, 0xff, 0xc0]).copy(buffer, 0);
  buffer.writeUInt16BE(17, 4);
  buffer[6] = 8;
  buffer.writeUInt16BE(height, 7);
  buffer.writeUInt16BE(width, 9);

  return buffer;
}

function makeWebpHeader(width: number, height: number) {
  const buffer = Buffer.alloc(30);

  Buffer.from("RIFF").copy(buffer, 0);
  Buffer.from("WEBP").copy(buffer, 8);
  Buffer.from("VP8X").copy(buffer, 12);
  buffer.writeUIntLE(width - 1, 24, 3);
  buffer.writeUIntLE(height - 1, 27, 3);

  return buffer;
}

describe("media file policy", () => {
  it("validates image signatures and extensions", () => {
    assert.equal(hasExpectedImageSignature("image/png", makePngHeader(128, 128)), true);
    assert.equal(hasExpectedImageSignature("image/jpeg", makeJpegHeader(128, 128)), true);
    assert.equal(hasExpectedImageSignature("image/webp", makeWebpHeader(128, 128)), true);
    assert.equal(hasExpectedImageSignature("image/jpeg", makePngHeader(128, 128)), false);
    assert.equal(resolveImageExtension("escudo.jpg", "image/jpeg"), "jpeg");
    assert.throws(
      () => resolveImageExtension("escudo.svg", "image/png"),
      /extension del archivo no coincide/i,
    );
  });

  it("reads dimensions from the server-side file buffer", async () => {
    const prepared = await prepareImageUpload({
      buffer: makePngHeader(128, 128),
      fileName: "general.png",
      mimeType: "image/png",
      usage: "OTHER",
    });

    assert.equal(prepared.width, 128);
    assert.equal(prepared.height, 128);
    assert.equal(prepared.mimeType, "image/png");
  });

  it("accepts JPEG and WebP buffers with server-side dimensions", async () => {
    const jpeg = await prepareImageUpload({
      buffer: makeJpegHeader(128, 128),
      fileName: "foto.jpeg",
      mimeType: "image/jpeg",
      usage: "OTHER",
    });
    const webp = await prepareImageUpload({
      buffer: makeWebpHeader(128, 128),
      fileName: "foto.webp",
      mimeType: "image/webp",
      usage: "OTHER",
    });

    assert.equal(jpeg.width, 128);
    assert.equal(jpeg.height, 128);
    assert.equal(jpeg.mimeType, "image/jpeg");
    assert.equal(webp.width, 128);
    assert.equal(webp.height, 128);
    assert.equal(webp.mimeType, "image/webp");
  });

  it("rejects SVG as an uploadable public image format", async () => {
    assert.equal(allowedImageMimeTypes.has("image/svg+xml"), false);

    await assert.rejects(
      () =>
        prepareImageUpload({
          buffer: Buffer.from("<svg />"),
          fileName: "logo.svg",
          mimeType: "image/svg+xml",
          usage: "OTHER",
        }),
      /tipo de imagen no admitido/i,
    );
  });

  it("rejects images that do not match usage limits", async () => {
    await assert.rejects(
      () =>
        prepareImageUpload({
          buffer: makePngHeader(32, 32),
          fileName: "logo.png",
          mimeType: "image/png",
          usage: "TEAM_LOGO",
        }),
      /demasiado pequeña/i,
    );
  });

  it("keeps explicit constraints per media usage", () => {
    const bannerConstraint = getMediaUsageConstraint("TEAM_BANNER");
    const logoConstraint = getMediaUsageConstraint("TEAM_LOGO");

    assert.equal(bannerConstraint.minWidth >= logoConstraint.minWidth, true);
    assert.equal((bannerConstraint.minAspectRatio ?? 0) > 1, true);
    assert.equal((logoConstraint.maxAspectRatio ?? 0) <= 2, true);
  });
});
