import type { MetadataRoute } from "next";
import { getAbsoluteUrl, getPublicSiteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/api", "/api/"],
      },
    ],
    sitemap: getAbsoluteUrl("/sitemap.xml"),
    host: getPublicSiteUrl(),
  };
}
