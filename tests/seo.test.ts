import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildPublicPageMetadata,
  getAbsoluteUrl,
  getPublicSiteUrl,
} from "@/src/lib/seo";

function getFirstOpenGraphImageUrl(metadata: ReturnType<typeof buildPublicPageMetadata>) {
  const images = metadata.openGraph?.images;

  if (!images) {
    return undefined;
  }

  const firstImage = Array.isArray(images) ? images[0] : images;

  return typeof firstImage === "string" || firstImage instanceof URL
    ? firstImage.toString()
    : firstImage.url?.toString();
}

describe("public SEO helpers", () => {
  it("uses NEXT_PUBLIC_SITE_URL as metadata base without trailing slash", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://www.risingraimon.es/";

    assert.equal(getPublicSiteUrl(), "https://www.risingraimon.es");
    assert.equal(getAbsoluteUrl("/noticias"), "https://www.risingraimon.es/noticias");
  });

  it("builds canonical, Open Graph and Twitter metadata for public pages", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://www.risingraimon.es";

    const metadata = buildPublicPageMetadata({
      title: "Noticias",
      description: "Actualidad del club.",
      path: "/noticias",
    });

    assert.deepEqual(metadata.alternates, { canonical: "/noticias" });
    assert.equal(metadata.openGraph?.url, "https://www.risingraimon.es/noticias");
    assert.equal(metadata.openGraph?.siteName, "Rising Raimon");
    assert.deepEqual(metadata.twitter, {
      card: "summary_large_image",
      title: "Noticias | Rising Raimon",
      description: "Actualidad del club.",
      images: ["https://www.risingraimon.es/images/rr-og-card.svg"],
    });
  });

  it("keeps external cover images as absolute social images", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://www.risingraimon.es";

    const metadata = buildPublicPageMetadata({
      title: "Crónica",
      path: "/noticias/cronica",
      imageUrl: "https://cdn.example.test/cover.webp",
    });

    assert.equal(getFirstOpenGraphImageUrl(metadata), "https://cdn.example.test/cover.webp");
  });
});
