import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  hasSvgExtension,
  isSafeExternalHttpUrl,
  isSafeLocalPublicPath,
  isSafePublicImageReference,
} from "@/lib/url-safety";
import {
  externalHttpUrlSchema,
  publicImageReferenceSchema,
} from "@/server/validators/public-url";

describe("public URL and media validators", () => {
  it("allows only clean http/https external URLs", () => {
    assert.equal(isSafeExternalHttpUrl("https://risingraimon.es/noticia"), true);
    assert.equal(isSafeExternalHttpUrl(" http://risingraimon.es/video "), true);
    assert.equal(isSafeExternalHttpUrl("javascript:alert(1)"), false);
    assert.equal(isSafeExternalHttpUrl("data:text/html;base64,xxx"), false);
    assert.equal(isSafeExternalHttpUrl("https://risingraimon.es/\u0000bad"), false);
  });

  it("allows only safe local public paths", () => {
    assert.equal(isSafeLocalPublicPath("/media/news/cover.webp"), true);
    assert.equal(isSafeLocalPublicPath("//evil.example/media.webp"), false);
    assert.equal(isSafeLocalPublicPath("/media/../secret.png"), false);
    assert.equal(isSafeLocalPublicPath("/media\\secret.png"), false);
  });

  it("rejects SVG image references even when query strings are present", () => {
    assert.equal(hasSvgExtension("/media/logo.svg?version=1"), true);
    assert.equal(hasSvgExtension("https://cdn.example.com/logo.svgz"), true);
    assert.equal(isSafePublicImageReference("/media/photo.webp"), true);
    assert.equal(isSafePublicImageReference("https://cdn.example.com/photo.avif"), true);
    assert.equal(isSafePublicImageReference("/media/logo.svg?version=1"), false);
    assert.equal(isSafePublicImageReference("https://cdn.example.com/logo.svgz"), false);
  });

  it("keeps optional public URL schemas empty-safe and rejects unsafe values", () => {
    assert.equal(externalHttpUrlSchema().safeParse("").success, true);
    assert.equal(externalHttpUrlSchema().safeParse("https://youtu.be/demo").success, true);
    assert.equal(externalHttpUrlSchema().safeParse("ftp://example.com/file").success, false);

    assert.equal(publicImageReferenceSchema().safeParse("").success, true);
    assert.equal(publicImageReferenceSchema().safeParse("/media/players/card.png").success, true);
    assert.equal(publicImageReferenceSchema().safeParse("/media/players/card.svg").success, false);
  });
});
