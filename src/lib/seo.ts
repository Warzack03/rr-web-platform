import type { Metadata } from "next";

export const SITE_NAME = "Rising Raimon";
export const DEFAULT_SITE_DESCRIPTION =
  "Actualidad, equipos, partidos, clasificaciones y estadísticas de Rising Raimon.";

const FALLBACK_SITE_URL = "https://www.risingraimon.es";
const DEFAULT_OG_IMAGE_PATH = "/images/rr-og-card.svg";

function normalizeSiteUrl(value: string | undefined) {
  const rawValue = value?.trim() || FALLBACK_SITE_URL;

  try {
    const url = new URL(rawValue);
    return `${url.origin}${url.pathname === "/" ? "" : url.pathname}`.replace(/\/$/, "");
  } catch {
    return FALLBACK_SITE_URL;
  }
}

export function getPublicSiteUrl() {
  return normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
}

export function getMetadataBase() {
  return new URL(`${getPublicSiteUrl()}/`);
}

export function getAbsoluteUrl(path = "/") {
  return new URL(path, getMetadataBase()).toString();
}

function normalizeImageUrl(imageUrl?: string) {
  if (!imageUrl) {
    return getAbsoluteUrl(DEFAULT_OG_IMAGE_PATH);
  }

  try {
    return new URL(imageUrl).toString();
  } catch {
    return getAbsoluteUrl(imageUrl);
  }
}

function buildSocialTitle(title: string) {
  return title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
}

export function buildPublicPageMetadata({
  title,
  description = DEFAULT_SITE_DESCRIPTION,
  path = "/",
  imageUrl,
  type = "website",
}: {
  title: string;
  description?: string;
  path?: string;
  imageUrl?: string;
  type?: "website" | "article";
}): Metadata {
  const canonicalUrl = getAbsoluteUrl(path);
  const socialTitle = buildSocialTitle(title);
  const socialImageUrl = normalizeImageUrl(imageUrl);

  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: socialTitle,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: "es_ES",
      type,
      images: [
        {
          url: socialImageUrl,
          width: 1200,
          height: 630,
          alt: socialTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [socialImageUrl],
    },
  };
}
