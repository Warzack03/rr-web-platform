import type { MetadataRoute } from "next";
import { getAbsoluteUrl } from "@/lib/seo";
import {
  getAcademyPlayerStaticParamsFromDb,
  getFirstTeamPlayerSlugsFromDb,
} from "@/server/services/public/player-detail";
import {
  getAcademyMatchDetailStaticParamsFromDb,
  getFirstTeamMatchDetailIdsFromDb,
} from "@/server/services/public/match-detail";
import { getPublicNewsArticles } from "@/server/services/public/news-content";
import { getPublicNonFirstTeamSlugsFromDb } from "@/server/services/public/teams";

const STATIC_PUBLIC_PATHS = [
  "/",
  "/primer-equipo",
  "/primer-equipo/plantilla",
  "/primer-equipo/calendario",
  "/primer-equipo/clasificacion",
  "/primer-equipo/estadisticas",
  "/equipos",
  "/noticias",
  "/politica-de-privacidad",
  "/politica-de-cookies",
] as const;

const TEAM_SECTION_PATHS = [
  "",
  "/plantilla",
  "/calendario",
  "/clasificacion",
  "/estadisticas",
] as const;

function sitemapEntry(path: string, priority = 0.7): MetadataRoute.Sitemap[number] {
  return {
    url: getAbsoluteUrl(path),
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority,
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [
    academyTeamSlugs,
    firstTeamMatchIds,
    academyMatchParams,
    firstTeamPlayerSlugs,
    academyPlayerParams,
    newsArticles,
  ] = await Promise.all([
    getPublicNonFirstTeamSlugsFromDb(),
    getFirstTeamMatchDetailIdsFromDb(),
    getAcademyMatchDetailStaticParamsFromDb(),
    getFirstTeamPlayerSlugsFromDb(),
    getAcademyPlayerStaticParamsFromDb(),
    getPublicNewsArticles(),
  ]);

  const academyPlayerSlugs = academyPlayerParams.map((param) => param.playerSlug);
  const playerSlugs = Array.from(new Set([...firstTeamPlayerSlugs, ...academyPlayerSlugs]));

  return [
    ...STATIC_PUBLIC_PATHS.map((path) => sitemapEntry(path, path === "/" ? 1 : 0.8)),
    ...academyTeamSlugs.flatMap((teamSlug) =>
      TEAM_SECTION_PATHS.map((sectionPath) => sitemapEntry(`/equipos/${teamSlug}${sectionPath}`)),
    ),
    ...firstTeamMatchIds.map((matchId) =>
      sitemapEntry(`/primer-equipo/partidos/${matchId}`, 0.6),
    ),
    ...academyMatchParams.map((param) =>
      sitemapEntry(`/equipos/${param.teamSlug}/partidos/${param.matchId}`, 0.55),
    ),
    ...playerSlugs.map((playerSlug) => sitemapEntry(`/jugadores/${playerSlug}`, 0.65)),
    ...newsArticles.map((article) => sitemapEntry(`/noticias/${article.slug}`, 0.75)),
  ];
}
